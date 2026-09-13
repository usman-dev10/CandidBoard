from concurrent.futures import ThreadPoolExecutor

from src.app.AI.Agent.graph import run_panel
from src.app.db.session import SessionLocal
from src.app.services import events
from src.app.services.persist import persist_run
from src.app.services.store import get_eval, stamp_done, stamp_fail

_pool = ThreadPoolExecutor(max_workers=4)


def _job_payload(job) -> dict:
    req = job.requirements or {}
    return {
        "title": job.title,
        "department": job.department,
        "seniority": job.seniority,
        "location": job.location,
        "description": job.description,
        "must_have_skills": req.get("must_have") or [],
        "nice_to_have_skills": req.get("nice_to_have") or [],
        "values": job.values or [],
    }


def _execute(evaluation_id: str) -> None:
    db = SessionLocal()
    try:
        row = get_eval(db, evaluation_id)
        row.status = "running"
        row.current_agent = "A1"
        db.commit()
        events.emit(evaluation_id, "stage", {"agent_id": "A1", "status": "running"})
        state = {
            "evaluation_id": row.id,
            "thread_id": row.thread_id,
            "job_requisition": _job_payload(row.job),
            "resume_text": row.resume.extracted_text or "",
            "handoffs": [],
            "tool_trace": [],
            "errors": [],
            "screens_skipped": False,
        }
        result = run_panel(state)
        for hop in result.get("handoffs") or []:
            events.emit(evaluation_id, "handoff", {"from": hop.get("from_agent"), "to": hop.get("to_agent"), "condition": hop.get("condition")})
        for tool in result.get("tool_trace") or []:
            events.emit(evaluation_id, "tool", {"tool_name": tool.get("tool_name"), "agent_id": tool.get("agent_id")})
        report = result.get("final_report") or {}
        persist_run(db, evaluation_id, result)
        stamp_done(row, report)
        db.commit()
        events.emit(evaluation_id, "completed", {"recommendation": report.get("recommendation"), "overall_score": report.get("overall_score")})
    except Exception as exc:
        db.rollback()
        try:
            row = get_eval(db, evaluation_id)
            stamp_fail(row, "GRAPH_FAILED")
            db.commit()
        except Exception:
            db.rollback()
        events.emit(evaluation_id, "failed", {"error_code": "GRAPH_FAILED", "message": "Evaluation failed."})
    finally:
        db.close()


def kickoff(evaluation_id: str) -> None:
    _pool.submit(_execute, evaluation_id)

