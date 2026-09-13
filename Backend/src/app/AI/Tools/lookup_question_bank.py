TECH = [
    {"id": "t1", "question": "Walk through how you would design a versioned REST endpoint that writes to PostgreSQL.", "competency": "REST + SQL", "difficulty": "mid", "expected_signal": "Mentions migrations, transactions, and API versioning."},
    {"id": "t2", "question": "How would you handle a database migration that must run with zero downtime?", "competency": "PostgreSQL", "difficulty": "mid", "expected_signal": "Expand-contract or dual-write approach."},
    {"id": "t3", "question": "Describe how you would authenticate a Python API and protect it from common web attacks.", "competency": "API security", "difficulty": "mid", "expected_signal": "Authn vs authz, rate limits, input validation."},
    {"id": "t4", "question": "How do you structure automated tests for a FastAPI service?", "competency": "Testing", "difficulty": "mid", "expected_signal": "Unit vs integration, fixtures, CI."},
    {"id": "t5", "question": "Explain how you would diagnose a slow SQL query in production.", "competency": "Performance", "difficulty": "senior", "expected_signal": "EXPLAIN, indexes, N+1 awareness."},
    {"id": "t6", "question": "How would you design pagination and filtering for a large REST collection?", "competency": "API design", "difficulty": "mid", "expected_signal": "Cursor vs offset, stable sort."},
    {"id": "t7", "question": "Walk through a production incident you owned from alert to postmortem.", "competency": "Ownership", "difficulty": "senior", "expected_signal": "Timeline, impact, fix, follow-up."},
    {"id": "t8", "question": "How would you cache frequently read API responses without serving stale data?", "competency": "Caching", "difficulty": "mid", "expected_signal": "TTL, invalidation, cache keys."},
]

BEHAVIORAL = [
    {"id": "b1", "question": "Tell me about a time you owned a production issue end to end.", "competency": "ownership", "difficulty": "mid", "expected_signal": "STAR: detection, action, result."},
    {"id": "b2", "question": "Describe a disagreement on a design and how you resolved it in writing.", "competency": "clear written communication", "difficulty": "mid", "expected_signal": "Documented trade-offs."},
    {"id": "b3", "question": "Give an example of giving or receiving difficult feedback.", "competency": "feedback", "difficulty": "mid", "expected_signal": "Specific behavior, not personality."},
    {"id": "b4", "question": "Tell me about collaborating across teams when requirements were unclear.", "competency": "collaboration", "difficulty": "mid", "expected_signal": "Clarifying questions, shared artifact."},
    {"id": "b5", "question": "Describe a time you had to say no to a feature request.", "competency": "judgment", "difficulty": "mid", "expected_signal": "Risk vs value."},
    {"id": "b6", "question": "How do you handle conflicting priorities in a sprint?", "competency": "ownership", "difficulty": "mid", "expected_signal": "Trade-off and communication."},
]


def lookup_question_bank(role_family: str, seniority: str, category: str = "technical", limit: int = 6) -> dict:
    source = TECH if category != "behavioral" else BEHAVIORAL
    items = source[: max(1, min(limit, len(source)))]
    tagged = [{**i, "role_family": role_family, "seniority": seniority} for i in items]
    return {"items": tagged}
