from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(ROOT / ".env"), extra="ignore")

    workspace_api_key: str = "change-me"
    llm_provider: str = "groq"
    llm_api_key: str = ""
    llm_model: str = "llama-3.3-70b-versatile"
    database_url: str = "sqlite:///./data/candidboard.db"
    upload_dir: str = "./data/uploads"
    frontend_origin: str = "http://localhost:3000"
    retention_days: int = 30
    max_concurrent_evals: int = 5
    max_resume_bytes: int = 2 * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        if not path.is_absolute():
            path = ROOT / path
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def db_url(self) -> str:
        url = self.database_url.strip().strip('"').strip("'")
        if url.startswith("https://"):
            raise ValueError(
                "DATABASE_URL must be the Postgres URI (postgresql://...), not the https project URL."
            )
        if url.startswith("sqlite:///./"):
            db_dir = ROOT / "data"
            db_dir.mkdir(parents=True, exist_ok=True)
            return f"sqlite:///{(ROOT / url.replace('sqlite:///./', '')).as_posix()}"
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://") :]
        dialect = url.split("://", 1)[0] if "://" in url else ""
        if dialect.startswith("postgresql") or dialect == "postgres":
            url = "postgresql+psycopg2://" + url.split("://", 1)[1]
        if url.startswith("postgresql") and "sslmode=" not in url:
            url += ("&" if "?" in url else "?") + "sslmode=require"
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
