from src.app.AI.Tools.calculate_weighted_score import calculate_weighted_score
from src.app.AI.Tools.lookup_skill_taxonomy import lookup_skill_taxonomy
from src.app.AI.Tools.lookup_question_bank import lookup_question_bank
from src.app.AI.Agent.a5_orchestrator import _recommend
from src.app.AI.Agent.graph import run_panel


def test_weighted_score_prd_example():
    out = calculate_weighted_score(
        {"skills_match": 80, "experience_match": 70, "domain_match": 65, "seniority_match": 60, "education_match": 50}
    )
    assert out["overall_score"] == 70


def test_taxonomy_react():
    out = lookup_skill_taxonomy(["React.js"])
    assert out["normalized"][0]["canonical"] == "React"


def test_question_bank_limits():
    tech = lookup_question_bank("backend", "mid", "technical", 6)
    beh = lookup_question_bank("backend", "mid", "behavioral", 4)
    assert len(tech["items"]) == 6
    assert len(beh["items"]) == 4


def test_recommend_cannot_advance_when_skipped():
    assert _recommend(90, True, "advance_screen") == "Reject"
    assert _recommend(80, False, "advance_screen") == "Advance"
    assert _recommend(70, False, "hold") == "Hold"
    assert _recommend(40, True, "reject_early") == "Reject"


def test_graph_hold_and_reject_paths():
    hold = run_panel(
        {
            "evaluation_id": "e1",
            "thread_id": "thr_hold",
            "job_requisition": {
                "title": "Backend Engineer",
                "seniority": "mid",
                "description": "Build REST APIs in Python. Own PostgreSQL.",
                "must_have_skills": ["Python", "REST APIs", "PostgreSQL"],
                "values": ["ownership"],
            },
            "resume_text": "Alex Khan\nBackend Engineer\n3 years Python FastAPI PostgreSQL REST APIs\nalex@example.com",
            "handoffs": [],
            "tool_trace": [],
            "errors": [],
        }
    )
    assert hold["job_fit"]["calculator_receipt"]["overall_score"] == hold["job_fit"]["overall_score"]
    assert hold["final_report"]["recommendation"] in {"Advance", "Hold", "Reject"}
    assert hold["final_report"]["handoff_count"] >= 2
    reject = run_panel(
        {
            "evaluation_id": "e2",
            "thread_id": "thr_reject",
            "job_requisition": {
                "title": "Staff ML Engineer",
                "seniority": "lead",
                "description": "Lead large-scale machine learning platform work across research and production.",
                "must_have_skills": ["PyTorch", "CUDA", "Distributed training"],
                "values": [],
            },
            "resume_text": "Sam Lee\nRetail associate\nCashier experience.",
            "handoffs": [],
            "tool_trace": [],
            "errors": [],
        }
    )
    assert reject["screens_skipped"] is True
    assert reject["final_report"]["recommendation"] == "Reject"
    assert reject["final_report"]["technical_questions"] == []
