import Link from "next/link";
import { PageFrame } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <PageFrame>
      <div className="max-w-2xl mx-auto glass rounded-2xl p-8 text-sm text-gray-400 space-y-4">
        <Link href="/" className="text-xs text-gray-500">← Back</Link>
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p>
          CandidBoard is a hiring-advisory demo. You unlock a workspace, paste a job requisition, and upload or paste a
          resume so five specialist agents can compile an Advance / Hold / Reject report.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">What we collect</h2>
        <p>
          Job text (title, department, seniority, location, description, must-have skills, values) and candidate resume
          files or pasted resume text. Files must be PDF, DOCX, or TXT and 2 MB or smaller. We also store the workspace
          unlock session in an HttpOnly cookie so you stay signed in on this device.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">How data is used</h2>
        <p>
          Resumes and job text are evaluation data only. They are not used to train models. The panel extracts stated
          facts, scores job fit, and — when fit is high enough — prepares technical and culture questions. The
          Orchestrator compiles the report and does not invent new facts.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">Retention and deletion</h2>
        <p>
          In this version, evaluation data is kept for 30 days unless you delete a job or evaluation from the app.
          Signing out clears the session cookie. This demo workspace does not sell personal data or share it with
          third-party advertisers.
        </p>
        <h2 className="text-lg font-semibold text-white pt-2">Your control</h2>
        <p>
          You can stop an evaluation, delete listed jobs or evaluations, and sign out at any time from Settings. Do not
          upload sensitive government IDs or data you are not allowed to process.
        </p>
      </div>
    </PageFrame>
  );
}
