from typing import Literal

from pydantic import BaseModel, Field, field_validator

Seniority = Literal["junior", "mid", "senior", "lead"]


class JobIn(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    department: str | None = Field(default=None, max_length=120)
    seniority: Seniority
    location: str | None = Field(default=None, max_length=160)
    description: str = Field(min_length=40, max_length=8000)
    must_have_skills: list[str] = Field(min_length=1)
    nice_to_have_skills: list[str] = Field(default_factory=list)
    values: list[str] = Field(default_factory=list)

    @field_validator("title", "department", "location", "description", mode="before")
    @classmethod
    def strip_tags(cls, v):
        if isinstance(v, str):
            return v.replace("<", "").replace(">", "").strip()
        return v


class JobOut(BaseModel):
    id: str
    title: str
    department: str | None
    seniority: str
    location: str | None
    description: str
    must_have_skills: list[str]
    nice_to_have_skills: list[str]
    values: list[str]
    created_at: str
