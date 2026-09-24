/* ─── lib/api/tax.ts ─── */
import { apiGet, apiPost } from "./client";
import type { TaxResponse } from "../types/api";

export function getTaxEstimate(userId: string): Promise<TaxResponse> {
  return apiGet<TaxResponse>(`/tax/${userId}`);
}

export function getTaxHistory(userId: string): Promise<TaxResponse[]> {
  return apiGet<TaxResponse[]>(`/tax/${userId}/history`);
}

export function calculateTax(userId: string): Promise<TaxResponse> {
  return apiPost<TaxResponse>("/tax/calculate", { userId });
}
