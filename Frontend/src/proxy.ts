import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";
import { verifySession } from "@/lib/session";

const PUBLIC_EXACT = new Set(["/", "/unlock", "/privacy", "/terms", "/contact"]);

function isPublic(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return pathname.startsWith("/api/unlock") || pathname.startsWith("/api/logout");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const ok = verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!isPublic(pathname) && !ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/unlock";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname === "/unlock" && ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
