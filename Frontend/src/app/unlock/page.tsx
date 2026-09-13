"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidButton, PageFrame, inputClass } from "@/components/ui";
import { sanitize } from "@/lib/sanitize";
import { startPageTransition } from "@/lib/transition";

export default function UnlockPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: sanitize(token, 128).trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Unlock failed");
      return;
    }
    startPageTransition("/dashboard");
    router.replace("/dashboard");
  };

  return (
    <PageFrame>
      <div className="max-w-md mx-auto glass rounded-2xl p-8">
        <p className="text-xs tracking-widest text-indigo-400 uppercase mb-2">Workspace</p>
        <h1 className="text-3xl font-bold text-white mb-2">Unlock</h1>
        <p className="text-sm text-gray-400 mb-6">Enter the demo workspace token.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            autoComplete="off"
            maxLength={128}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Workspace token"
            className={inputClass}
          />
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
          <LiquidButton type="submit" className="w-full" disabled={busy}>
            Unlock
          </LiquidButton>
          <p className="text-xs text-gray-600 text-center">Default token: demo</p>
        </form>
      </div>
    </PageFrame>
  );
}
