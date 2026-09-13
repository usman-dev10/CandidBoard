import asyncio
import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from src.app.api.eval_dto import EvalIn, eval_payload, trace_payload
from src.app.core.security import require_workspace
from src.app.db.session import get_db
from src.app.services import events, store
from src.app.db.trace import AgentRunRow, HandoffRow, ReportRow, ToolCallRow
from src.app.services.files import delete_file
from src.app.services.runner import kickoff

router = APIRouter(prefix="/evaluations", dependencies=[Depends(require_workspace)])


@router.post("", status_code=202)
async def start_eval(body: EvalIn, db: Session = Depends(get_db)):
    store.get_job(db, body.job_id)
    resume = store.get_resume(db, body.resume_id)
    if not (resume.extracted_text or "").strip():
        from src.app.core.errors import AppError

        raise AppError(422, "EMPTY_TEXT", "Resume has no extracted text.")
    row = store.create_eval(db, body.job_id, body.resume_id)
    db.commit()
    kickoff(row.id)
    return {
        "id": row.id,
        "thread_id": row.thread_id,
        "status": row.status,
        "poll_url": f"/api/v1/evaluations/{row.id}",
        "events_url": f"/api/v1/evaluations/{row.id}/events",
    }


@router.get("")
def list_evals(db: Session = Depends(get_db)):
    return [eval_payload(db, r) for r in store.list_evals(db)]


@router.get("/{evaluation_id}")
def get_one(evaluation_id: str, db: Session = Depends(get_db)):
    return eval_payload(db, store.get_eval(db, evaluation_id))


@router.get("/{evaluation_id}/trace")
def get_trace(evaluation_id: str, db: Session = Depends(get_db)):
    return trace_payload(db, evaluation_id)


@router.delete("/{evaluation_id}", status_code=204)
def delete_eval(evaluation_id: str, db: Session = Depends(get_db)):
    row = store.get_eval(db, evaluation_id)
    delete_file(row.resume.storage_path if row.resume else None)
    eid = row.id
    db.query(HandoffRow).filter(HandoffRow.evaluation_id == eid).delete()
    db.query(ToolCallRow).filter(ToolCallRow.evaluation_id == eid).delete()
    db.query(AgentRunRow).filter(AgentRunRow.evaluation_id == eid).delete()
    db.query(ReportRow).filter(ReportRow.evaluation_id == eid).delete()
    db.delete(row)
    events.clear(eid)
    return None


@router.get("/{evaluation_id}/events")
async def stream_events(evaluation_id: str, db: Session = Depends(get_db)):
    store.get_eval(db, evaluation_id)

    async def gen():
        seen = 0
        for _ in range(180):
            batch = events.snapshot(evaluation_id)
            while seen < len(batch):
                item = batch[seen]
                seen += 1
                yield f"event: {item['event']}\ndata: {json.dumps(item['data'])}\n\n"
                if item["event"] in {"completed", "failed"}:
                    return
            await asyncio.sleep(0.4)

    return StreamingResponse(gen(), media_type="text/event-stream")
