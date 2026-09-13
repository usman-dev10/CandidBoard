from typing import Any, Literal, TypedDict

from pydantic import BaseModel, Field

Hint = Literal["advance_screen", "hold", "reject_early"]
Rec = Literal["Advance", "Hold", "Reject"]


class DimensionScores(BaseModel):
    skills_match: int = Field(ge=0, le=100)
    experience_match: int = Field(ge=0, le=100)
    domain_match: int = Field(ge=0, le=100)
    seniority_match: int = Field(ge=0, le=100)
    education_match: int = Field(ge=0, le=100)


class JobFit(BaseModel):
    dimension_scores: DimensionScores
    rationales: dict[str, str] = Field(default_factory=dict)
    evidence_quotes: list[str] = Field(default_factory=list)
    overall_score: int = Field(ge=0, le=100)
    recommendation_hint: Hint
    calculator_receipt: dict[str, Any] = Field(default_factory=dict)


class TechQuestion(BaseModel):
    question: str
    competency: str
    difficulty: str = "mid"
    expected_signal: str = ""
    linked_resume_evidence: str | None = None
    source: str = "bank"


class TechnicalScreen(BaseModel):
    role_family: str
    questions: list[TechQuestion] = Field(min_length=5, max_length=8)
    focus_competencies: list[str] = Field(default_factory=list)


class CultureQuestion(BaseModel):
    question: str
    competency: str
    expected_signal: str = ""
    source: str = "bank"


class CultureScreen(BaseModel):
    values_detected: list[str]
    questions: list[CultureQuestion] = Field(min_length=4, max_length=6)


class FinalReport(BaseModel):
    candidate_name: str | None
    job_title: str
    overall_score: int
    recommendation: Rec
    executive_summary: str
    job_fit_summary: dict[str, Any]
    technical_questions: list[dict[str, Any]]
    culture_questions: list[dict[str, Any]]
    screens_skipped: bool
    missing_inputs: list[str]
    risk_flags: list[str]
    agent_trace: list[dict[str, Any]]
    handoff_count: int
    schema_version: str = "1.0"


class GraphState(TypedDict, total=False):
    evaluation_id: str
    thread_id: str
    job_requisition: dict
    resume_text: str
    resume_profile: dict
    job_fit: dict
    technical_screen: dict
    culture_screen: dict
    final_report: dict
    screens_skipped: bool
    handoffs: list[dict]
    tool_trace: list[dict]
    errors: list[str]
    current_agent: str
