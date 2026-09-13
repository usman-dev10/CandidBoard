from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.app.AI.Schema.job import JobIn, JobOut
from src.app.core.security import require_workspace
from src.app.db.session import get_db
from src.app.services import store

router = APIRouter(prefix="/jobs", dependencies=[Depends(require_workspace)])


def _out(row) -> JobOut:
    req = row.requirements or {}
    return JobOut(
        id=row.id,
        title=row.title,
        department=row.department,
        seniority=row.seniority,
        location=row.location,
        description=row.description,
        must_have_skills=req.get("must_have") or [],
        nice_to_have_skills=req.get("nice_to_have") or [],
        values=row.values or [],
        created_at=row.created_at.isoformat(),
    )


@router.post("", status_code=201)
def create_job(body: JobIn, db: Session = Depends(get_db)):
    return _out(store.create_job(db, body))


@router.get("")
def list_jobs(db: Session = Depends(get_db)):
    return [_out(j) for j in store.list_jobs(db)]


@router.get("/{job_id}")
def get_job(job_id: str, db: Session = Depends(get_db)):
    return _out(store.get_job(db, job_id))


@router.put("/{job_id}")
def update_job(job_id: str, body: JobIn, db: Session = Depends(get_db)):
    return _out(store.update_job(db, job_id, body))


@router.delete("/{job_id}", status_code=204)
def delete_job(job_id: str, db: Session = Depends(get_db)):
    store.delete_job(db, job_id)
