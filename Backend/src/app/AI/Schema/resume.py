from pydantic import BaseModel, Field


class SkillItem(BaseModel):
    name: str
    category: str = "domain"
    evidence: str = ""


class EducationItem(BaseModel):
    institution: str | None = None
    degree: str | None = None
    field: str | None = None
    year: str | None = None


class ExperienceItem(BaseModel):
    company: str | None = None
    title: str | None = None
    start: str | None = None
    end: str | None = None
    bullets: list[str] = Field(default_factory=list)


class ResumeProfile(BaseModel):
    full_name: str | None = None
    contact: dict = Field(default_factory=lambda: {"email": None, "phone": None, "location": None})
    headline: str | None = None
    years_experience_estimated: float | None = None
    education: list[EducationItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    skills: list[SkillItem] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    links: list[str] = Field(default_factory=list)
    gaps_or_ambiguities: list[str] = Field(default_factory=list)
