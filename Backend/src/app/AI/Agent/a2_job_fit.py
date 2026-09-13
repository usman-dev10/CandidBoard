from src.app.AI.Agent.llm import complete_json
from src.app.AI.Schema.graph_state import DimensionScores, JobFit
from src.app.AI.SystemPrompt.a2 import A2
from src.app.AI.SystemPrompt.preamble import wrap_data
from src.app.AI.Tools.calculate_weighted_score import calculate_weighted_score
from src.app.AI.Tools.lookup_skill_taxonomy import lookup_skill_taxonomy


def run_a2(state: dict) -> dict:
    profile = state.get("resume_profile") or {}
    job = state.get("job_requisition") or {}
    names = [s.get("name", "") for s in profile.get("skills") or []]
    tax = lookup_skill_taxonomy(names)
    must_tax = lookup_skill_taxonomy(job.get("must_have_skills") or [])
    trace = list(state.get("tool_trace") or [])
    trace.append({"agent_id": "A2", "tool_name": "lookup_skill_taxonomy", "arguments": {"skills": names}, "result": tax})

    dims = _dims(profile, must_tax, tax)
    llm = complete_json(A2, wrap_data("PROFILE_AND_JOB", str({"profile": profile, "job": job})))
    if llm and isinstance(llm.get("dimension_scores"), dict):
        try:
            dims = DimensionScores.model_validate(llm["dimension_scores"])
        except Exception:
            pass

    receipt = calculate_weighted_score(dims.model_dump())
    trace.append({"agent_id": "A2", "tool_name": "calculate_weighted_score", "arguments": dims.model_dump(), "result": receipt})
    overall = int(receipt["overall_score"])
    hint = "reject_early" if overall < 60 else ("hold" if overall < 75 else "advance_screen")
    fit = JobFit(
        dimension_scores=dims,
        rationales={"skills_match": "Compared claimed skills to must-haves."},
        evidence_quotes=[s.get("evidence", "") for s in (profile.get("skills") or []) if s.get("evidence")][:4],
        overall_score=overall,
        recommendation_hint=hint,
        calculator_receipt=receipt,
    )
    skipped = overall < 60
    handoffs = list(state.get("handoffs") or [])
    if skipped:
        handoffs.append({"from_agent": "A2", "to_agent": "A5", "condition": "overall_score < 60", "payload_keys": ["resume_profile", "job_fit"]})
    else:
        handoffs.append({"from_agent": "A2", "to_agent": "A3", "condition": "overall_score >= 60", "payload_keys": ["resume_profile", "job_fit"]})
    return {"job_fit": fit.model_dump(), "screens_skipped": skipped, "handoffs": handoffs, "tool_trace": trace, "current_agent": "A2"}


def _dims(profile: dict, must_tax: dict, tax: dict) -> DimensionScores:
    must = [n["canonical"].lower() for n in must_tax.get("normalized", [])]
    have = {n["canonical"].lower() for n in tax.get("normalized", [])}
    hit = sum(1 for m in must if any(m in h or h in m for h in have))
    skills = int(round(100 * hit / max(1, len(must)))) if must else 50
    years = profile.get("years_experience_estimated") or 0
    exp = 55 if years < 2 else (70 if years < 5 else 85)
    domain = max(0, min(100, skills - 5))
    return DimensionScores(skills_match=skills, experience_match=exp, domain_match=domain, seniority_match=60, education_match=50)
