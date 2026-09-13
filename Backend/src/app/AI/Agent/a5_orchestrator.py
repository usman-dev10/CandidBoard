from src.app.AI.Schema.graph_state import FinalReport


def run_a5(state: dict) -> dict:
    job = state.get("job_requisition") or {}
    profile = state.get("resume_profile") or {}
    fit = state.get("job_fit") or {}
    skipped = bool(state.get("screens_skipped"))
    overall = int(fit.get("overall_score") or 0)
    rec = _recommend(overall, skipped, fit.get("recommendation_hint"))
    tech = (state.get("technical_screen") or {}).get("questions") or []
    culture = (state.get("culture_screen") or {}).get("questions") or []
    gaps = list(profile.get("gaps_or_ambiguities") or [])
    name = profile.get("full_name")
    title = job.get("title") or "Role"
    summary = (
        f"{name or 'Candidate'} scored {overall} for {title}. "
        f"Recommendation is {rec}. "
        + ("Deep screen skipped because job-fit was below 60. " if skipped else "Technical and culture screens were completed. ")
        + "Advisory only. A human makes the hiring decision."
    )
    report = FinalReport(
        candidate_name=name,
        job_title=title,
        overall_score=overall,
        recommendation=rec,
        executive_summary=summary,
        job_fit_summary=fit,
        technical_questions=tech if not skipped else [],
        culture_questions=culture if not skipped else [],
        screens_skipped=skipped,
        missing_inputs=gaps,
        risk_flags=[g for g in gaps if "injection" in g.lower()],
        agent_trace=_trace(skipped),
        handoff_count=len(state.get("handoffs") or []),
    )
    return {"final_report": report.model_dump(), "current_agent": "A5"}


def _recommend(score: int, skipped: bool, hint: str | None) -> str:
    if skipped or score < 60 or hint == "reject_early":
        return "Reject"
    if score >= 75:
        return "Advance"
    return "Hold"


def _trace(skipped: bool) -> list[dict]:
    if skipped:
        return [
            {"agent_id": "A1", "status": "succeeded"},
            {"agent_id": "A2", "status": "succeeded"},
            {"agent_id": "A3", "status": "skipped"},
            {"agent_id": "A4", "status": "skipped"},
            {"agent_id": "A5", "status": "succeeded"},
        ]
    return [{"agent_id": f"A{i}", "status": "succeeded"} for i in range(1, 6)]
