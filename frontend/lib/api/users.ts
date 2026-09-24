/* ─── lib/api/users.ts ─── */
import { apiGet, apiPatch } from "./client";
import type { AuthUser, UserSettings } from "../types/api";

export function listUsers(): Promise<AuthUser[]> {
  return apiGet<AuthUser[]>("/users");
}

export function getUser(userId: string): Promise<AuthUser> {
  return apiGet<AuthUser>(`/users/${userId}`);
}

export function updateSettings(userId: string, settings: UserSettings): Promise<AuthUser> {
  return apiPatch<AuthUser>(`/users/${userId}/settings`, settings);
}
