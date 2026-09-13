CANON = {
    "react.js": ("React", "frontend"),
    "reactjs": ("React", "frontend"),
    "react": ("React", "frontend"),
    "python3": ("Python", "language"),
    "python": ("Python", "language"),
    "postgres": ("PostgreSQL", "data"),
    "postgresql": ("PostgreSQL", "data"),
    "psql": ("PostgreSQL", "data"),
    "rest api": ("REST APIs", "backend"),
    "rest apis": ("REST APIs", "backend"),
    "fastapi": ("FastAPI", "backend"),
    "node.js": ("Node.js", "backend"),
    "nodejs": ("Node.js", "backend"),
    "js": ("JavaScript", "language"),
    "javascript": ("JavaScript", "language"),
    "ts": ("TypeScript", "language"),
    "typescript": ("TypeScript", "language"),
    "k8s": ("Kubernetes", "infra"),
    "kubernetes": ("Kubernetes", "infra"),
}


def lookup_skill_taxonomy(skills: list[str]) -> dict:
    out = []
    for raw in skills:
        key = (raw or "").strip().lower()
        if key in CANON:
            canonical, family = CANON[key]
            out.append({"raw": raw, "canonical": canonical, "family": family, "alias_matched": True})
        else:
            out.append({"raw": raw, "canonical": raw.strip(), "family": "unknown", "alias_matched": False})
    return {"normalized": out}
