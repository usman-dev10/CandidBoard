DEFAULT_WEIGHTS = {
    "skills_match": 0.35,
    "experience_match": 0.25,
    "domain_match": 0.20,
    "seniority_match": 0.15,
    "education_match": 0.05,
}

KEYS = tuple(DEFAULT_WEIGHTS)


def calculate_weighted_score(scores: dict, weights: dict | None = None) -> dict:
    w = dict(DEFAULT_WEIGHTS)
    if weights:
        w.update({k: float(v) for k, v in weights.items() if k in DEFAULT_WEIGHTS})
    total_w = sum(w[k] for k in KEYS)
    if abs(total_w - 1.0) > 0.001:
        w = {k: v / total_w for k, v in w.items()}
    contrib = 0.0
    for k in KEYS:
        val = max(0, min(100, int(scores.get(k, 0))))
        contrib += val * w[k]
    overall = int(round(max(0, min(100, contrib))))
    return {
        "overall_score": overall,
        "weights_applied": w,
        "formula": "clamp(round(sum(dimension_score * weight)), 0, 100)",
    }
