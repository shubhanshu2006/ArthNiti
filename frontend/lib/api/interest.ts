/* ─── lib/api/interest.ts ─── */
import { apiGet, apiPost } from "./client";
import type { InterestAccount, InterestEntry } from "../types/api";

export function getInterestAccount(userId: string): Promise<InterestAccount> {
  return apiGet<InterestAccount>(`/wallet/${userId}/interest`);
}

export function calculateInterest(userId: string): Promise<InterestEntry> {
  return apiPost<InterestEntry>(`/wallet/${userId}/interest/calculate`);
}

export function getInterestHistory(userId: string): Promise<InterestEntry[]> {
  return apiGet<InterestEntry[]>(`/wallet/${userId}/interest/history`);
}
