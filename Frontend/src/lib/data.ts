import type { Evaluation, EvaluationReport, Job } from "./types";

export const DISCLAIMER =
  "Advisory only. A human makes the hiring decision.";

export const EMPTY_EVALS =
  "No evaluations yet. Create a job and upload a resume.";

export const DEMO_TOKEN = "demo";
export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

export const AGENTS = [
  { id: "A1", name: "Resume Analyzer", subtitle: "Extract structured facts from the resume" },
  { id: "A2", name: "Job Fit Agent", subtitle: "Score match vs the job requisition" },
  { id: "A3", name: "Technical Screener", subtitle: "Role-specific technical questions" },
  { id: "A4", name: "Culture Fit Agent", subtitle: "Behavioral questions from stated values" },
  { id: "A5", name: "Orchestrator", subtitle: "Compile the final report — no new facts" },
] as const;

export const SEED_JOBS: Job[] = [
  {
    id: "job-be",
    title: "Backend Engineer",
    department: "Engineering",
    seniority: "mid",
    location: "Remote",
    description:
      "Build and maintain REST APIs in Python. Own PostgreSQL schema changes and code review.",
    mustHave: ["Python", "REST APIs", "PostgreSQL"],
    niceToHave: ["FastAPI", "Redis"],
    values: ["ownership", "clear written communication"],
    createdAt: "2026-09-11",
  },
];

export const SEED_EVALS: Evaluation[] = [
  {
    id: "eval-alex",
    candidate: "Alex Khan",
    role: "Backend Engineer",
    score: 70,
    status: "Hold",
    date: "2026-09-11",
  },
  {
    id: "eval-aiko",
    candidate: "Aiko Tanaka",
    role: "Senior ML Engineer",
    score: 91,
    status: "Advance",
    date: "2026-09-11",
  },
  {
    id: "eval-marcus",
    candidate: "Marcus Webb",
    role: "Staff Frontend Engineer",
    score: 74,
    status: "Hold",
    date: "2026-09-10",
  },
  {
    id: "eval-dion",
    candidate: "Dion Fletcher",
    role: "Backend Engineer II",
    score: 41,
    status: "Reject",
    date: "2026-09-08",
    skipped: true,
  },
];

export const ALEX_REPORT: EvaluationReport = {
  candidate: "Alex Khan",
  jobTitle: "Backend Engineer",
  overall: 70,
  status: "Hold",
  summary:
    "Solid Python and API experience with limited PostgreSQL depth. Advance to a focused technical screen; do not treat as a definite hire.",
  dimensions: [
    { label: "Skills", score: 80 },
    { label: "Experience", score: 70 },
    { label: "Domain", score: 65 },
    { label: "Seniority", score: 60 },
    { label: "Education", score: 50 },
  ],
  evidence: [
    "3 years Python and FastAPI listed on resume",
    "One PostgreSQL project; no Kubernetes",
    "Job requires REST APIs and PostgreSQL as must-haves",
  ],
  technical: [
    {
      question: "Walk through how you would design a versioned REST endpoint that writes to PostgreSQL.",
      competency: "REST + SQL",
      difficulty: "mid",
    },
    {
      question: "How would you handle a migration that must run with zero downtime?",
      competency: "PostgreSQL",
      difficulty: "mid",
    },
  ],
  culture: [
    {
      question: "Tell me about a time you owned a production issue end to end.",
      competency: "ownership",
    },
  ],
  handoffs: ["A1 → A2", "A2 → A3 (score ≥ 60)", "A3 → A4", "A4 → A5"],
};
