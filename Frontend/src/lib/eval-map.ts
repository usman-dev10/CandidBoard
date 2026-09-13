import type { Evaluation, EvaluationReport, EvalStatus } from "./types";

export type EvalApi = {
  id: string;
  job_id: string;
  status: string;
  current_agent: string | null;
  overall_score: number | null;
  recommendation: string | null;
  report: Record<string, unknown> | null;
  created_at: string;
  candidate: string | null;
  job_title: string | null;
  error?: { code?: string } | null;
};

const DIMS = [
  ["skills_match", "Skills"],
  ["experience_match", "Experience"],
  ["domain_match", "Domain"],
  ["seniority_match", "Seniority"],
  ["education_match", "Education"],
] as const;

function recOf(row: EvalApi): "Advance" | "Hold" | "Reject" {
  const rec = row.recommendation || (row.report?.recommendation as string | undefined);
  if (rec === "Advance" || rec === "Hold" || rec === "Reject") return rec;
  return "Hold";
}

export function badgeStatus(row: EvalApi): EvalStatus {
  if (row.status === "failed") return "Failed";
  if (row.status !== "completed") return "Running";
  return recOf(row);
}

export function toUiEval(row: EvalApi): Evaluation {
  const report = row.report || {};
  return {
    id: row.id,
    candidate: (report.candidate_name as string) || row.candidate || "Candidate",
    role: (report.job_title as string) || row.job_title || "Role",
    score: row.overall_score ?? (report.overall_score as number) ?? 0,
    status: badgeStatus(row),
    date: (row.created_at || "").slice(0, 10),
    skipped: Boolean(report.screens_skipped),
  };
}

export function toUiReport(row: EvalApi): EvaluationReport | null {
  const report = row.report;
  if (!report) return null;
  const fit = (report.job_fit_summary || {}) as Record<string, unknown>;
  const dims = (fit.dimension_scores || {}) as Record<string, number>;
  const tech = (report.technical_questions as { question?: string; competency?: string; difficulty?: string }[]) || [];
  const culture = (report.culture_questions as { question?: string; competency?: string }[]) || [];
  const skipped = Boolean(report.screens_skipped);
  return {
    candidate: (report.candidate_name as string) || row.candidate || "Candidate",
    jobTitle: (report.job_title as string) || row.job_title || "Role",
    overall: Number(report.overall_score ?? row.overall_score ?? 0),
    status: recOf(row),
    summary: String(report.executive_summary || ""),
    dimensions: DIMS.map(([key, label]) => ({ label, score: Number(dims[key] ?? 0) })),
    evidence: ((fit.evidence_quotes as string[]) || []).filter(Boolean),
    technical: tech.map((q) => ({
      question: q.question || "",
      competency: q.competency || "",
      difficulty: q.difficulty || "mid",
    })),
    culture: culture.map((q) => ({ question: q.question || "", competency: q.competency || "" })),
    handoffs: skipped ? ["A1 → A2", "A2 → A5"] : ["A1 → A2", "A2 → A3", "A3 → A4", "A4 → A5"],
  };
}
