from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from src.app.AI.Tools.extract_resume_text import extract_resume_text
from src.app.core.config import get_settings
from src.app.core.errors import AppError
from src.app.core.security import require_workspace
from src.app.db.session import get_db
from src.app.services.files import store_bytes
from src.app.services import store

router = APIRouter(prefix="/resumes", dependencies=[Depends(require_workspace)])


@router.post("", status_code=201)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    settings = get_settings()
    raw = await file.read(settings.max_resume_bytes + 1)
    if len(raw) > settings.max_resume_bytes:
        raise AppError(413, "FILE_TOO_LARGE", "Resume must be 2 MB or smaller.")
    parsed = extract_resume_text(raw, file.content_type or "", file.filename or "")
    path = store_bytes(raw, file.filename or "resume.txt")
    row = store.create_resume(
        db,
        original_filename=file.filename or "resume.txt",
        mime_type=file.content_type or "application/octet-stream",
        storage_path=str(path),
        extracted_text=parsed["text"],
        parser_warnings=parsed.get("warnings") or [],
    )
    preview = parsed["text"][:240].replace("\n", " ")
    return {
        "id": row.id,
        "original_filename": row.original_filename,
        "mime_type": row.mime_type,
        "extracted_text_preview": preview,
        "parser_warnings": row.parser_warnings,
    }


@router.get("/{resume_id}")
def get_resume(resume_id: str, db: Session = Depends(get_db)):
    row = store.get_resume(db, resume_id)
    return {
        "id": row.id,
        "original_filename": row.original_filename,
        "mime_type": row.mime_type,
        "extracted_text": row.extracted_text,
        "parser_warnings": row.parser_warnings,
        "created_at": row.created_at.isoformat(),
    }
