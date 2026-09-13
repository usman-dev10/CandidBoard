import time
from collections import defaultdict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from src.app.core.errors import envelope


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_hits: int = 60, window: int = 60):
        super().__init__(app)
        self.max_hits = max_hits
        self.window = window
        self.hits: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path in {"/health", "/ready", "/api/v1/health", "/api/v1/ready"}:
            return await call_next(request)
        ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "local").split(",")[0].strip()
        now = time.time()
        bucket = [t for t in self.hits[ip] if now - t < self.window]
        if len(bucket) >= self.max_hits:
            return JSONResponse(status_code=429, content=envelope("RATE_LIMITED", "Too many requests."))
        bucket.append(now)
        self.hits[ip] = bucket
        return await call_next(request)
