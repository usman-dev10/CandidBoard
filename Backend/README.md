# CandidBoard backend

FastAPI + LangGraph hiring panel. Five agents, conditional routing, real tools.

## Layout

```
src/app/AI/Agent          A1–A5 nodes and LangGraph
src/app/AI/Schema         Job, resume, graph, report contracts
src/app/AI/SystemPrompt   Shared policy + per-agent prompts
src/app/AI/Tools          extract_resume_text, calculate_weighted_score,
                          lookup_skill_taxonomy, lookup_question_bank
```

## Run

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn src.app.main:app --reload --port 8000
```

Workspace header: `Authorization: Bearer change-me` (or `WORKSPACE_API_KEY` from `.env`).

Public: `GET /health`, `GET /ready`  
Workspace: `/api/v1/jobs`, `/resumes`, `/evaluations`

Optional: set `LLM_API_KEY` and `LLM_PROVIDER=groq` (or `anthropic`). Without a key, agents still run with deterministic extraction plus the required calculator tool.

## Tests

```bash
pytest -q
```
