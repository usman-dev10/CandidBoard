"use client";

import { useEffect, useState } from "react";
import { movingCopy, setTransitionHandler } from "@/lib/transition";

function destPath(href: string) {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

export function PageTransition() {
  const [on, setOn] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (next: string) => {
      if (reduced || !next) return;
      setPath(next);
      setOn(true);
    };
    setTransitionHandler(show);

    const click = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const next = destPath(a.getAttribute("href") || a.href);
      if (next) show(next);
    };
    const back = () => show(window.location.pathname);
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", back);
    return () => {
      setTransitionHandler(null);
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", back);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setOn(false), 900);
    return () => clearTimeout(t);
  }, [on, path]);

  if (!on) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#080810]/72 backdrop-blur-sm px-6" aria-live="polite" aria-label={movingCopy(path)}>
      <div className="relative h-28 w-28">
        <svg className="cb-ring-cw absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="rgba(99,102,241,0.25)" strokeWidth="3" />
          <circle cx="50" cy="50" r="44" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="72 204" />
        </svg>
        <svg className="cb-ring-ccw absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="rgba(139,92,246,0.2)" strokeWidth="3" />
          <circle cx="50" cy="50" r="44" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" strokeDasharray="58 218" />
        </svg>
        <div className="cb-mark absolute inset-0 flex items-center justify-center rounded-full">
          <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            CB
          </span>
        </div>
      </div>
      <p className="mt-6 text-sm text-indigo-200 text-center max-w-xs" style={{ fontFamily: "var(--font-display)" }}>
        {movingCopy(path)}
      </p>
    </div>
  );
}
