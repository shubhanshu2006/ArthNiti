import type {
  AccountAggregatorProvider,
  AAConsent,
  AAFinancialData,
  AATransaction,
} from "./aa.adapter.js";

/**
 * Mock AA Provider — generates synthetic gig-worker transactions.
 * Used in the prototype so the system doesn't depend on a real AA gateway.
 *
 * In production, replace this with a real Setu/Sahamati/OneMoney adapter.
 */

const GIG_PLATFORMS = [
  { merchant: "Swiggy", platform: "SWIGGY", descriptions: ["Swiggy earnings payout", "Swiggy delivery bonus", "Swiggy weekend surge"] },
  { merchant: "Zomato", platform: "ZOMATO", descriptions: ["Zomato delivery earnings", "Zomato incentive payout"] },
  { merchant: "Uber", platform: "UBER", descriptions: ["Uber driver earnings", "Uber weekend earnings", "Uber surge payout"] },
  { merchant: "Ola", platform: "OLA", descriptions: ["Ola driver payout", "Ola surge earnings"] },
  { merchant: "Razorpay", platform: "FREELANCE", descriptions: ["Client payment - web project", "Design contract milestone", "Full stack project delivery"] },
  { merchant: "Upwork", platform: "UPWORK", descriptions: ["Upwork hourly payment", "Upwork contract payment"] },
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockTransactions(userId: string, days: number = 30): AATransaction[] {
  const transactions: AATransaction[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    // ~70% chance of earning on any given day
    if (Math.random() < 0.3) continue;

    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0);

    // 1-2 transactions per earning day
    const txCount = Math.random() < 0.3 ? 2 : 1;

    for (let j = 0; j < txCount; j++) {
      const platform = pickRandom(GIG_PLATFORMS);
      const amount = randomBetween(300, 2000);

      transactions.push({
        externalId: `mock-${userId}-${i}-${j}`,
        amount,
        date,
        type: "CREDIT",
        description: pickRandom(platform.descriptions),
        merchant: platform.merchant,
        sourcePlatform: platform.platform,
        category: "GIG_INCOME",
      });
    }
  }

  return transactions;
}

export class MockAAProvider implements AccountAggregatorProvider {
  async createConsent(userId: string): Promise<AAConsent> {
    return {
      consentId: `mock-consent-${userId}-${Date.now()}`,
      status: "ACTIVE",
      purpose: "Income verification and financial data aggregation",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    };
  }

  async getConsentStatus(consentId: string): Promise<AAConsent> {
    return {
      consentId,
      status: "ACTIVE",
      purpose: "Income verification and financial data aggregation",
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };
  }

  async fetchFinancialData(consentId: string, userId: string): Promise<AAFinancialData> {
    const transactions = generateMockTransactions(userId);

    return {
      accounts: [
        {
          institutionName: "Mock Bank",
          accountType: "SAVINGS",
          maskedAccountNumber: "XXXX-XXXX-" + randomBetween(1000, 9999),
        },
      ],
      transactions,
    };
  }

  async revokeConsent(_consentId: string): Promise<void> {
    // No-op for mock
  }
}
