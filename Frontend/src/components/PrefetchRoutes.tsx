"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAppPath } from "@/lib/auth";

const PUBLIC = ["/", "/unlock", "/privacy", "/terms"];
const APP = ["/dashboard", "/evaluate", "/jobs", "/jobs/new", "/candidates", "/settings"];

export function PrefetchRoutes() {
  const app = isAppPath(usePathname());
  const hrefs = app ? [...PUBLIC, ...APP] : PUBLIC;
  return (
    <div className="hidden" aria-hidden>
      {hrefs.map((href) => (
        <Link key={href} href={href} prefetch>
          {href}
        </Link>
      ))}
    </div>
  );
}
