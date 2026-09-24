/* ─── lib/api/dashboard.ts ─── */
import { apiGet } from "./client";
import type { DashboardResponse } from "../types/api";

export function getDashboard(userId: string): Promise<DashboardResponse> {
  return apiGet<DashboardResponse>(`/dashboard/${userId}`);
}
