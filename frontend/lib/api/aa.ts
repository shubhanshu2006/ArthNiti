/* ─── lib/api/aa.ts ─── */
import { apiGet, apiPost, apiDelete } from "./client";
import type { AAConsent } from "../types/api";

export function createConsent(): Promise<AAConsent> {
  return apiPost<AAConsent>("/aa/consent");
}

export function getConsentStatus(userId: string): Promise<AAConsent | null> {
  return apiGet<AAConsent | null>(`/aa/consent/${userId}`);
}

export function syncFinancialData(userId: string): Promise<{ synced: boolean; transactions: number }> {
  return apiPost<{ synced: boolean; transactions: number }>(`/aa/sync/${userId}`);
}

export function revokeConsent(consentId: string): Promise<{ revoked: boolean }> {
  return apiDelete<{ revoked: boolean }>(`/aa/consent/${consentId}`);
}
