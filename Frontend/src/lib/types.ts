export type EvalStatus = "Advance" | "Hold" | "Reject" | "Running" | "Failed";
export type Seniority = "junior" | "mid" | "senior" | "lead";
export type AgentStatus = "pending" | "running" | "done" | "skipped";

export interface Job {
  id: string;
  title: string;
  department: string;
  seniority: Seniority;
  location: string;
  description: string;
  mustHave: string[];
  niceToHave: string[];
  values: string[];
  createdAt: string;
}

export interface Evaluation {
  id: string;
  candidate: string;
  role: string;
  score: number;
  status: EvalStatus;
  date: string;
  skipped?: boolean;
}

export interface EvaluationReport {
  candidate: string;
  jobTitle: string;
  overall: number;
  status: EvalStatus;
  summary: string;
  dimensions: { label: string; score: number }[];
  evidence: string[];
  technical: { question: string; competency: string; difficulty: string }[];
  culture: { question: string; competency: string }[];
  handoffs: string[];
}
