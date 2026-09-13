import Link from "next/link";
import { PageFrame } from "@/components/ui";

export default function TermsPage() {
  return (
    <PageFrame>
      <div className="max-w-2xl mx-auto glass rounded-2xl p-8 text-sm text-gray-400 space-y-4">
        <Link href="/" className="text-xs text-gray-500">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p>
          By unlocking the CandidBoard demo workspace you agree to use it as an educational hiring-panel product. Access
          is gated by a workspace token. Do not attempt to bypass that gate or use another person’s session.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">Advisory only</h2>
        <p>
          Scores and Advance / Hold / Reject labels are recommendations. A human makes the hiring decision. CandidBoard
          does not guarantee interview outcomes, legal compliance of your hiring process, or completeness of extracted
          resume facts.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">Acceptable use</h2>
        <p>
          Upload only job descriptions and resumes you are authorized to evaluate. Do not submit malware, or content
          that is unlawful or intended to harm candidates. Resume files are limited to PDF, DOCX, or TXT, maximum 2 MB.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">How the panel runs</h2>
        <p>
          Five agents run in sequence: Resume Analyzer, Job Fit, Technical Screener, Culture Fit, and Orchestrator. If
          job-fit is below 60, the technical and culture screens are skipped and the result cannot be Advance. Hold is
          60–74. Advance is 75–100 when those screens ran.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">Limitation</h2>
        <p>
          The demo is provided as-is for coursework and product review. We are not liable for hiring decisions made
          from a report. If you do not agree, do not unlock the workspace.
        </p>
      </div>
    </PageFrame>
  );
}
