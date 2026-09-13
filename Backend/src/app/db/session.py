from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from src.app.core.config import get_settings
from src.app.db.models import Base
from src.app.db import trace  # noqa: F401  — register extra tables

_settings = get_settings()
try:
    db_url = _settings.db_url
    if db_url.startswith("sqlite"):
        engine = create_engine(db_url, connect_args={"check_same_thread": False}, future=True)
    else:
        engine = create_engine(db_url, connect_args={"sslmode": "require"}, future=True)
except Exception as exc:
    raise RuntimeError(
        "DATABASE_URL is invalid. On Render paste Supabase Settings → Database → URI "
        "(port 5432). Example: postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres "
        f"Detail: {exc}"
    ) from exc
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


@event.listens_for(engine, "connect")
def _fk(dbapi_connection, _):
    if _settings.db_url.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def init_db() -> None:
    Base.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
