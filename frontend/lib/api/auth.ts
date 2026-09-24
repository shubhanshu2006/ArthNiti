/* ─── lib/api/auth.ts ─── */
import { apiPost, apiGet } from "./client";
import type { LoginResponse, AuthUser } from "../types/api";

export function login(email: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/auth/login", { email });
}

export function getMe(token?: string): Promise<AuthUser> {
  return apiGet<AuthUser>("/auth/me", token);
}
