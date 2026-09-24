/* ───────────────────────────────────────────────
 * lib/api/client.ts
 * Central fetch wrapper — attaches JWT, unwraps
 * the backend's { success, data } / { error } envelope.
 * ─────────────────────────────────────────────── */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

// ── Error class ──────────────────────────────

export class ApiClientError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ── Token accessor ───────────────────────────
// Reads the token from the `ArthNiti_token` cookie.
// Works in both browser and middleware (reads from document.cookie in browser).

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)ArthNiti_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ── Core fetch ───────────────────────────────

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token: explicitToken, ...init } = options ?? {};
  const token = explicitToken ?? getTokenFromCookie();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...init,
    headers,
  });

  // Handle non-JSON responses
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    if (!res.ok) {
      throw new ApiClientError(`HTTP ${res.status}: ${res.statusText}`, res.status);
    }
    return {} as T;
  }

  const json = await res.json();

  // Backend returns { error: true, statusCode, message } on errors
  if (json.error || !res.ok) {
    throw new ApiClientError(
      json.message ?? `Request failed with status ${res.status}`,
      json.statusCode ?? res.status,
      json.details
    );
  }

  // Backend wraps successful data in { success: true, data: ... }
  return (json.data ?? json) as T;
}

// ── Convenience methods ──────────────────────

export function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiFetch<T>(path, { method: "GET", token });
}

export function apiPost<T>(path: string, body?: unknown, token?: string): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

export function apiPatch<T>(path: string, body?: unknown, token?: string): Promise<T> {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    token,
  });
}

export function apiDelete<T>(path: string, token?: string): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE", token });
}
