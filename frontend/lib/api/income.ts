/* ─── lib/api/income.ts ─── */
import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type {
  IncomeSummary,
  IncomeStats,
  DailyIncome,
  TodayIncome,
  ManualIncomeEntry,
} from "../types/api";

export function getIncomeSummary(userId: string): Promise<IncomeSummary> {
  return apiGet<IncomeSummary>(`/income/${userId}`);
}

export function getIncomeStats(userId: string, recalculate = false): Promise<IncomeStats> {
  return apiGet<IncomeStats>(`/income/${userId}/stats${recalculate ? "?recalculate=true" : ""}`);
}

export function getDailyIncome(userId: string, from?: string, to?: string): Promise<DailyIncome[]> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return apiGet<DailyIncome[]>(`/income/${userId}/daily${qs ? `?${qs}` : ""}`);
}

export function getTodayIncome(userId: string): Promise<TodayIncome> {
  return apiGet<TodayIncome>(`/income/${userId}/today`);
}

export function getOfflineIncome(userId: string): Promise<ManualIncomeEntry[]> {
  return apiGet<ManualIncomeEntry[]>(`/income/${userId}/offline`);
}

export function createManualIncome(data: {
  userId: string;
  amount: number;
  date: string;
  description?: string;
  category?: string;
}): Promise<ManualIncomeEntry> {
  return apiPost<ManualIncomeEntry>("/income/manual", data);
}

export function updateManualIncome(
  incomeId: string,
  data: { amount?: number; description?: string; category?: string }
): Promise<ManualIncomeEntry> {
  return apiPatch<ManualIncomeEntry>(`/income/manual/${incomeId}`, data);
}

export function deleteManualIncome(incomeId: string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/income/manual/${incomeId}`);
}
