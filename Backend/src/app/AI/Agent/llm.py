import json
import re
import time

import httpx

from src.app.core.config import get_settings


def complete_json(system: str, user: str) -> dict | None:
    settings = get_settings()
    if not settings.llm_api_key:
        return None
    last: Exception | None = None
    for attempt in range(3):
        try:
            raw = _call(settings, system, user)
            return _parse(raw)
        except Exception as exc:
            last = exc
            time.sleep(1 * (2**attempt))
    if last:
        return None
    return None


def _call(settings, system: str, user: str) -> str:
    if settings.llm_provider.lower() == "anthropic":
        return _anthropic(settings, system, user)
    return _groq(settings, system, user)


def _groq(settings, system: str, user: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {settings.llm_api_key}", "Content-Type": "application/json"}
    body = {
        "model": settings.llm_model,
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
    }
    with httpx.Client(timeout=45) as client:
        res = client.post(url, headers=headers, json=body)
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]


def _anthropic(settings, system: str, user: str) -> str:
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": settings.llm_api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    body = {
        "model": settings.llm_model,
        "max_tokens": 4096,
        "system": system,
        "messages": [{"role": "user", "content": user}],
    }
    with httpx.Client(timeout=60) as client:
        res = client.post(url, headers=headers, json=body)
        res.raise_for_status()
        parts = res.json().get("content") or []
        return "".join(p.get("text", "") for p in parts if p.get("type") == "text")


def _parse(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?", "", raw).removesuffix("```").strip()
    return json.loads(raw)
