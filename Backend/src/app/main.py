from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.app.api import evaluations, health, jobs, resumes
from src.app.core.config import get_settings
from src.app.core.errors import install_errors
from src.app.core.headers import SecurityHeaders
from src.app.core.rate_limit import RateLimitMiddleware
from src.app.db.session import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="CandidBoard API", version="1.0.0", docs_url="/docs", lifespan=lifespan)
install_errors(app)
app.add_middleware(SecurityHeaders)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-API-Key"],
)
app.include_router(health.router)
app.include_router(health.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(resumes.router, prefix="/api/v1")
app.include_router(evaluations.router, prefix="/api/v1")
