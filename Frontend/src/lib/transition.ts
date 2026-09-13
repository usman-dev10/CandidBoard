type Handler = (path: string) => void;

let handler: Handler | null = null;

export function setTransitionHandler(next: Handler | null) {
  handler = next;
}

export function startPageTransition(path: string) {
  handler?.(path);
}

export function movingCopy(pathname: string) {
  if (pathname === "/" || pathname === "") return "Returning to Home…";
  if (pathname === "/dashboard") return "Moving to Dashboard…";
  if (pathname === "/evaluate") return "Starting a new evaluation…";
  if (pathname === "/jobs") return "Opening Jobs…";
  if (pathname === "/jobs/new") return "Opening New Job…";
  if (pathname.startsWith("/jobs/") && pathname.endsWith("/edit")) return "Opening the job editor…";
  if (pathname === "/candidates") return "Opening Candidates…";
  if (pathname === "/settings") return "Opening Settings…";
  if (pathname.startsWith("/evaluations/")) return "Opening the evaluation report…";
  if (pathname === "/unlock") return "Continuing to Unlock…";
  if (pathname === "/privacy") return "Opening the Privacy Policy…";
  if (pathname === "/terms") return "Opening the Terms of Service…";
  if (pathname === "/contact") return "Opening Contact…";
  return "Moving to the next page…";
}
