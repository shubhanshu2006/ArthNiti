/**
 * Account Aggregator adapter interface.
 * Abstracts away the AA provider so the prototype does not depend on a real AA.
 * In production, swap MockAAProvider for a real Setu/Sahamati adapter.
 */

export interface AAConsent {
  consentId: string;
  status: "PENDING" | "ACTIVE" | "REVOKED" | "EXPIRED";
  purpose: string;
  expiresAt: Date;
}

export interface AAFinancialAccount {
  institutionName: string;
  accountType: string;
  maskedAccountNumber: string;
}

export interface AATransaction {
  externalId: string;
  amount: number;
  date: Date;
  type: "CREDIT" | "DEBIT";
  description: string;
  merchant?: string;
  sourcePlatform?: string;
  category?: string;
}

export interface AAFinancialData {
  accounts: AAFinancialAccount[];
  transactions: AATransaction[];
}

/**
 * Interface for Account Aggregator providers.
 * Mock and production implementations must conform to this contract.
 */
export interface AccountAggregatorProvider {
  createConsent(userId: string): Promise<AAConsent>;
  getConsentStatus(consentId: string): Promise<AAConsent>;
  fetchFinancialData(consentId: string, userId: string): Promise<AAFinancialData>;
  revokeConsent(consentId: string): Promise<void>;
}
