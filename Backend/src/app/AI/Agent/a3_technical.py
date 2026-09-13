from src.app.AI.Schema.graph_state import TechnicalScreen, TechQuestion
from src.app.AI.Tools.lookup_question_bank import lookup_question_bank


def run_a3(state: dict) -> dict:
    job = state.get("job_requisition") or {}
    profile = state.get("resume_profile") or {}
    seniority = job.get("seniority") or "mid"
    family = (job.get("title") or "engineer").split()[-1].lower()
    bank = lookup_question_bank(family, seniority, "technical", 6)
    trace = list(state.get("tool_trace") or [])
    trace.append({"agent_id": "A3", "tool_name": "lookup_question_bank", "arguments": {"role_family": family, "seniority": seniority, "category": "technical"}, "result": {"count": len(bank["items"])}})
    claimed = " ".join(s.get("name", "") for s in profile.get("skills") or [])
    questions = []
    for item in bank["items"]:
        questions.append(
            TechQuestion(
                question=item["question"],
                competency=item["competency"],
                difficulty=item.get("difficulty") or seniority,
                expected_signal=item.get("expected_signal") or "",
                linked_resume_evidence=claimed or None,
                source="bank",
            )
        )
    screen = TechnicalScreen(role_family=family, questions=questions[:8], focus_competencies=[q.competency for q in questions[:5]])
    handoffs = list(state.get("handoffs") or [])
    handoffs.append({"from_agent": "A3", "to_agent": "A4", "condition": "technical_completed", "payload_keys": ["technical_screen"]})
    return {"technical_screen": screen.model_dump(), "handoffs": handoffs, "tool_trace": trace, "current_agent": "A3"}
