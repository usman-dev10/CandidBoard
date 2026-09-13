from pathlib import Path

from src.app.core.errors import AppError

OK_MIME = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "text/plain": "txt",
}
MAX = 2 * 1024 * 1024


def extract_resume_text(raw: bytes, mime_type: str, filename: str = "") -> dict:
    if len(raw) > MAX:
        raise AppError(413, "FILE_TOO_LARGE", "Resume must be 2 MB or smaller.")
    if len(raw) == 0:
        raise AppError(422, "EMPTY_TEXT", "File is empty.")
    kind = OK_MIME.get(mime_type or "")
    if not kind:
        ext = Path(filename).suffix.lower().lstrip(".")
        kind = ext if ext in {"pdf", "docx", "txt"} else None
    if not kind:
        raise AppError(415, "UNSUPPORTED_TYPE", "Use PDF, DOCX, or TXT.")
    try:
        if kind == "txt":
            text, pages, parser = raw.decode("utf-8", errors="replace"), 1, "utf8"
        elif kind == "pdf":
            text, pages, parser = _pdf(raw)
        else:
            text, pages, parser = _docx(raw)
    except AppError:
        raise
    except Exception as exc:
        raise AppError(422, "PARSE_FAILED", "Could not parse resume.") from exc
    text = text.strip()
    if not text:
        raise AppError(422, "EMPTY_TEXT", "Parser produced no text.")
    return {"text": text, "page_count": pages, "parser": parser, "warnings": []}


def _pdf(raw: bytes) -> tuple[str, int, str]:
    from io import BytesIO
    from pypdf import PdfReader

    reader = PdfReader(BytesIO(raw))
    parts = [(p.extract_text() or "") for p in reader.pages]
    return "\n".join(parts), len(reader.pages), "pypdf"


def _docx(raw: bytes) -> tuple[str, int, str]:
    from io import BytesIO
    from docx import Document

    doc = Document(BytesIO(raw))
    return "\n".join(p.text for p in doc.paragraphs), 1, "python-docx"
