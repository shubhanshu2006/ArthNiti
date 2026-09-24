/* ─── lib/api/savings.ts ─── */
import { apiGet, apiPost } from "./client";
import type { SavingsResponse, SavingsDecisionResponse } from "../types/api";

export function getSavings(userId: string): Promise<SavingsResponse> {
  return apiGet<SavingsResponse>(`/savings/${userId}`);
}

export function getSavingsDecision(userId: string): Promise<SavingsDecisionResponse> {
  return apiPost<SavingsDecisionResponse>("/savings/decision", { userId });
}

export function enableSmartSave(): Promise<{ smartSaveEnabled: boolean }> {
  return apiPost<{ smartSaveEnabled: boolean }>("/savings/enable");
}

export function pauseSmartSave(): Promise<{ smartSaveEnabled: boolean }> {
  return apiPost<{ smartSaveEnabled: boolean }>("/savings/pause");
}
