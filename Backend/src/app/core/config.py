from functools import lru_cache
from pathlib import Path
from urllib.parse import quote

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
        return normalize_db_url(self.database_url)


def normalize_db_url(raw: str) -> str:
    url = (raw or "").strip().strip('"').strip("'")
    if url.startswith("sqlite:///./"):
        db_dir = ROOT / "data"
        db_dir.mkdir(parents=True, exist_ok=True)
        return f"sqlite:///{(ROOT / url.replace('sqlite:///./', '')).as_posix()}"
    if url.startswith("https://"):
        raise ValueError("DATABASE_URL must start with postgresql:// not https://")
    if "[YOUR-PASSWORD]" in url or "YOUR-PASSWORD" in url:
        raise ValueError("Replace [YOUR-PASSWORD] in DATABASE_URL with the real database password.")
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]
    if "://" not in url or not url.startswith("postgresql"):
        raise ValueError(
            "DATABASE_URL must look like postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"
        )
    body = url.split("://", 1)[1]
    if "@" not in body:
        raise ValueError("DATABASE_URL is missing @host. Copy URI from Supabase Settings → Database.")
    creds, host = body.rsplit("@", 1)
    user, password = (creds.split(":", 1) + [""])[:2] if ":" in creds else (creds, "")
    password = quote(password, safe="%")
    if host.startswith("["):
        raise ValueError("DATABASE_URL host looks wrong. Remove leftover [brackets] from the password.")
    rest = f"{user}:{password}@{host}"
    if "sslmode=" not in rest:
        rest += ("&" if "?" in rest else "?") + "sslmode=require"
    return "postgresql+psycopg2://" + rest


@lru_cache
def get_settings() -> Settings:
    return Settings()
