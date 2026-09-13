from fastapi import APIRouter

from src.app.core.config import get_settings
from src.app.db.session import engine

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/ready")
def ready():
    settings = get_settings()
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False
    llm = bool(settings.llm_api_key) or True
    ready_ok = db_ok
    return {
        "status": "ready" if ready_ok else "degraded",
        "database": db_ok,
        "model_configured": bool(settings.llm_api_key),
        "fallback_ok": llm,
    }
