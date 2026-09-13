import { PageFrame } from "@/components/ui";
import { SignOutButton } from "./sign-out";

export default function SettingsPage() {
  return (
    <PageFrame>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Workspace</h1>
        <div className="glass rounded-2xl p-6 space-y-4 text-sm">
          <Row k="Workspace" v="Demo workspace" />
          <Row k="Retention" v="30 days" />
          <Row k="GET /health" v="ok" />
          <Row k="GET /ready" v="ready (frontend mock)" />
        </div>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </PageFrame>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-3 last:border-0">
      <span className="text-gray-500">{k}</span>
      <span className="text-white">{v}</span>
    </div>
  );
}
