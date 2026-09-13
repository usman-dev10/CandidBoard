from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.app.db.trace import HandoffRow, ReportRow, ToolCallRow
from src.app.services.store import get_eval


class EvalIn(BaseModel):
    job_id: str = Field(min_length=8, max_length=36)
    resume_id: str = Field(min_length=8, max_length=36)


def eval_payload(db: Session, row) -> dict:
    report_row = db.get(ReportRow, row.id)
    return {
        "id": row.id,
        "job_id": row.job_id,
        "resume_id": row.resume_id,
        "thread_id": row.thread_id,
        "status": row.status,
        "current_agent": row.current_agent,
        "overall_score": row.overall_score,
        "recommendation": row.recommendation,
        "error": {"code": row.error_code} if row.error_code else None,
        "report": report_row.report if report_row else None,
        "created_at": row.created_at.isoformat(),
        "completed_at": row.completed_at.isoformat() if row.completed_at else None,
        "candidate": (row.resume.extracted_text or "").splitlines()[0][:80] if row.resume and row.resume.extracted_text else None,
        "job_title": row.job.title if row.job else None,
    }


def trace_payload(db: Session, evaluation_id: str) -> dict:
    get_eval(db, evaluation_id)
    hops = db.query(HandoffRow).filter(HandoffRow.evaluation_id == evaluation_id).all()
    tools = db.query(ToolCallRow).filter(ToolCallRow.evaluation_id == evaluation_id).all()
    return {
        "handoffs": [{"from_agent": h.from_agent, "to_agent": h.to_agent, "condition": h.condition} for h in hops],
        "tool_calls": [{"agent_id": t.agent_id, "tool_name": t.tool_name} for t in tools],
    }
