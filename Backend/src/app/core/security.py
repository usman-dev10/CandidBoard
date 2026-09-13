import hmac
from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.app.core.config import Settings, get_settings

bearer = HTTPBearer(auto_error=False)


def timing_equal(left: str, right: str) -> bool:
    a = left.encode("utf-8")
    b = right.encode("utf-8")
    if len(a) != len(b):
        return hmac.compare_digest(a.ljust(64, b"\0"), b.ljust(64, b"\0")) and False
    return hmac.compare_digest(a, b)


def require_workspace(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    settings: Settings = Depends(get_settings),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> None:
    token = creds.credentials if creds else (x_api_key or "")
    expected = settings.workspace_api_key
    if not token or not expected or not timing_equal(token, expected):
        raise HTTPException(
            status_code=401,
            detail={"code": "UNAUTHORIZED", "message": "Enter the demo workspace token."},
        )
