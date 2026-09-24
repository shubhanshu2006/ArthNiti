/* ─── proxy.ts ───
 * Next.js 16 route protection (replaces deprecated middleware.ts).
 * Checks for `ArthNiti_token` cookie on protected routes.
 * Redirects to /sign-in if missing.
 * ─────────────── */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/wallet",
  "/goals",
  "/income",
  "/recommendations",
  "/tax",
  "/simulator",
  "/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get("ArthNiti_token")?.value;

  if (!token) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/wallet/:path*",
    "/goals/:path*",
    "/income/:path*",
    "/recommendations/:path*",
    "/tax/:path*",
    "/simulator/:path*",
    "/settings/:path*",
  ],
};
