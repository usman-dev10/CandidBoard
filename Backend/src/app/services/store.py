from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.app.AI.Schema.job import JobIn
from src.app.core.errors import AppError
from src.app.db.models import EvalRow, JobRow, ResumeRow, uid


def create_job(db: Session, body: JobIn) -> JobRow:
    row = JobRow(
        title=body.title,
        department=body.department,
        seniority=body.seniority,
        location=body.location,
        description=body.description,
        requirements={"must_have": body.must_have_skills, "nice_to_have": body.nice_to_have_skills},
        values=body.values,
    )
    db.add(row)
    db.flush()
    return row


def get_job(db: Session, job_id: str) -> JobRow:
    row = db.get(JobRow, job_id)
    if not row:
        raise AppError(404, "NOT_FOUND", "Job not found.")
    return row


def list_jobs(db: Session) -> list[JobRow]:
    return list(db.scalars(select(JobRow).order_by(JobRow.created_at.desc())))


def update_job(db: Session, job_id: str, body: JobIn) -> JobRow:
    row = get_job(db, job_id)
    row.title = body.title
    row.department = body.department
    row.seniority = body.seniority
    row.location = body.location
    row.description = body.description
    row.requirements = {
        "must_have": body.must_have_skills,
        "nice_to_have": body.nice_to_have_skills,
    }
    row.values = body.values
    db.flush()
    return row


def delete_job(db: Session, job_id: str) -> None:
    row = get_job(db, job_id)
    db.delete(row)
    try:
        db.flush()
    except IntegrityError as exc:
        raise AppError(409, "IN_USE", "This job has evaluations and cannot be deleted.") from exc


def create_resume(db: Session, **kwargs) -> ResumeRow:
    row = ResumeRow(**kwargs)
    db.add(row)
    db.flush()
    return row


def get_resume(db: Session, resume_id: str) -> ResumeRow:
    row = db.get(ResumeRow, resume_id)
    if not row:
        raise AppError(404, "NOT_FOUND", "Resume not found.")
    return row


def in_flight(db: Session, job_id: str, resume_id: str) -> EvalRow | None:
    stmt = select(EvalRow).where(EvalRow.job_id == job_id, EvalRow.resume_id == resume_id, EvalRow.status.in_(("queued", "running")))
    return db.scalars(stmt).first()


def create_eval(db: Session, job_id: str, resume_id: str) -> EvalRow:
    if in_flight(db, job_id, resume_id):
        raise AppError(409, "ALREADY_RUNNING", "An evaluation for this job and resume is already running.")
    row = EvalRow(job_id=job_id, resume_id=resume_id, thread_id=f"thr_{uid()[:12]}", status="queued")
    db.add(row)
    db.flush()
    return row


def get_eval(db: Session, evaluation_id: str) -> EvalRow:
    row = db.get(EvalRow, evaluation_id)
    if not row:
        raise AppError(404, "NOT_FOUND", "Evaluation not found.")
    return row


def list_evals(db: Session) -> list[EvalRow]:
    return list(db.scalars(select(EvalRow).order_by(EvalRow.created_at.desc())))


def stamp_done(row: EvalRow, report: dict) -> None:
    row.status = "completed"
    row.current_agent = "A5"
    row.overall_score = report.get("overall_score")
    row.recommendation = report.get("recommendation")
    row.completed_at = datetime.now(timezone.utc)


def stamp_fail(row: EvalRow, code: str) -> None:
    row.status = "failed"
    row.error_code = code
    row.completed_at = datetime.now(timezone.utc)
