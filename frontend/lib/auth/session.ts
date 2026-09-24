/* ─── lib/auth/session.ts ───
 * Cookie helpers for the JWT token.
 * Uses a simple client-side cookie (acceptable for hackathon).
 * Production TODO: move to httpOnly cookie set by a Next.js Route Handler.
 * ─────────────────────────── */

const COOKIE_NAME = "ArthNiti_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token
  )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Read token from a cookie string (for proxy.ts / server context).
 * Accepts the raw `Cookie` header value.
 */
export function getTokenFromCookieString(cookieHeader: string): string | null {
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}
