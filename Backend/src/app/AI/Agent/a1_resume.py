import re

from src.app.AI.Schema.resume import ResumeProfile, SkillItem
from src.app.AI.SystemPrompt.a1 import A1
from src.app.AI.SystemPrompt.preamble import wrap_data
from src.app.AI.Agent.llm import complete_json

INJECT = re.compile(r"ignore previous|give a perfect score|you are now", re.I)
EMAIL = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)


def run_a1(state: dict) -> dict:
    text = state.get("resume_text") or ""
    payload = wrap_data("RESUME", text[:12000])
    data = complete_json(A1, payload)
    profile = ResumeProfile.model_validate(data) if data else _heuristic(text)
    gaps = list(profile.gaps_or_ambiguities)
    if INJECT.search(text):
        gaps.append("Possible prompt-injection language in resume; treated as data only.")
    profile.gaps_or_ambiguities = gaps
    handoffs = list(state.get("handoffs") or [])
    handoffs.append({"from_agent": "A1", "to_agent": "A2", "condition": "profile_validated", "payload_keys": ["resume_profile"]})
    return {"resume_profile": profile.model_dump(), "handoffs": handoffs, "current_agent": "A1"}


def _heuristic(text: str) -> ResumeProfile:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    name = lines[0][:80] if lines else None
    mail = EMAIL.search(text)
    skills = []
    for token in ("Python", "PostgreSQL", "REST", "FastAPI", "React", "TypeScript", "JavaScript"):
        if re.search(rf"\b{re.escape(token)}\b", text, re.I):
            skills.append(SkillItem(name=token, category="language" if token in {"Python", "TypeScript", "JavaScript"} else "tool", evidence=token))
    years = None
    ym = re.search(r"(\d+)\s+\+?\s*years", text, re.I)
    if ym:
        years = float(ym.group(1))
    return ResumeProfile(
        full_name=name,
        contact={"email": mail.group(0) if mail else None, "phone": None, "location": None},
        headline=lines[1][:120] if len(lines) > 1 else None,
        years_experience_estimated=years,
        skills=skills,
        gaps_or_ambiguities=[] if skills else ["Limited structured skill evidence."],
    )
