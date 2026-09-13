import re
from pathlib import Path
from uuid import uuid4

from src.app.core.config import get_settings
from src.app.core.errors import AppError

SAFE = re.compile(r"[^A-Za-z0-9._-]+")


def safe_name(name: str) -> str:
    base = Path(name or "resume.txt").name
    cleaned = SAFE.sub("_", base)[:180]
    return cleaned or "resume.txt"


def store_bytes(raw: bytes, filename: str) -> Path:
    settings = get_settings()
    if len(raw) > settings.max_resume_bytes:
        raise AppError(413, "FILE_TOO_LARGE", "Resume must be 2 MB or smaller.")
    dest = settings.upload_path / f"{uuid4().hex}_{safe_name(filename)}"
    dest.write_bytes(raw)
    try:
        dest.relative_to(settings.upload_path.resolve())
    except ValueError as exc:
        dest.unlink(missing_ok=True)
        raise AppError(400, "VALIDATION_ERROR", "Invalid storage path.") from exc
    return dest


def delete_file(path: str | None) -> None:
    if not path:
        return
    target = Path(path)
    root = get_settings().upload_path.resolve()
    try:
        target.resolve().relative_to(root)
    except ValueError:
        return
    target.unlink(missing_ok=True)
