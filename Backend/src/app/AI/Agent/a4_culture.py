from src.app.AI.Schema.graph_state import CultureQuestion, CultureScreen
from src.app.AI.Tools.lookup_question_bank import lookup_question_bank


def run_a4(state: dict) -> dict:
    job = state.get("job_requisition") or {}
    values = [v for v in (job.get("values") or []) if str(v).strip()]
    detected = values or ["not_specified"]
    bank = lookup_question_bank(job.get("title") or "role", job.get("seniority") or "mid", "behavioral", 5)
    trace = list(state.get("tool_trace") or [])
    trace.append({"agent_id": "A4", "tool_name": "lookup_question_bank", "arguments": {"category": "behavioral"}, "result": {"count": len(bank["items"])}})
    questions = [
        CultureQuestion(question=i["question"], competency=i["competency"], expected_signal=i.get("expected_signal") or "", source="bank")
        for i in bank["items"][:6]
    ]
    screen = CultureScreen(values_detected=detected, questions=questions)
    handoffs = list(state.get("handoffs") or [])
    handoffs.append({"from_agent": "A4", "to_agent": "A5", "condition": "culture_completed", "payload_keys": ["culture_screen"]})
    return {"culture_screen": screen.model_dump(), "handoffs": handoffs, "tool_trace": trace, "current_agent": "A4"}
