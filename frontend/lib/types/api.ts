/* ───────────────────────────────────────────────
 * lib/types/api.ts
 * Typed response shapes matching the backend DTOs
 * ─────────────────────────────────────────────── */

// ── Auth ──────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  persona: string | null;
  riskProfile: string | null;
  smartSaveEnabled: boolean;
  maxDailyAutoSave: number | null;
  minimumBalance: number;
  savingPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// ── Dashboard ─────────────────────────────────

export interface DashboardResponse {
  income: {
    today: number;
    average: number;
    monthly: number;
    online: number;
    offline: number;
    volatility: string;
    drySpellFrequency: number;
    earningFrequency: number;
  };
  wallet: {
    balance: number;
    interestEarned: number;
  };
  goals: Record<string, number>;
  savings: {
    total: number;
    todayAutoSave: number;
    manualDeposits: number;
  };
  recommendation: {
    category: string;
    reason: string;
    confidence: number;
  };
  tax: {
    estimatedLiability: number;
    suggestedSetAside: number;
  };
}

// ── Income ────────────────────────────────────

export interface IncomeSummary {
  totalIncome: number;
  onlineIncome: number;
  offlineIncome: number;
  average: number;
  median: number;
  variance: number;
  standardDeviation: number;
  volatilityClass: string;
  goodDayThreshold: number;
  lowDayThreshold: number;
  drySpellFrequency: number;
  earningFrequency: number;
  transactionCount: number;
}

export interface IncomeStats {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  rollingAverage: number;
  medianIncome: number;
  variance: number;
  standardDeviation: number;
  volatilityClass: string;
  goodDayThreshold: number;
  lowDayThreshold: number;
  drySpellFrequency: number;
  earningFrequency: number;
  createdAt: string;
}

export interface DailyIncome {
  date: string;
  total: number;
  online: number;
  offline: number;
}

export interface TodayIncome {
  total: number;
  online: number;
  offline: number;
  transactions: number;
}

export interface ManualIncomeEntry {
  id: string;
  amount: number;
  date: string;
  description: string | null;
  category: string | null;
  createdAt: string;
}

// ── Wallet ────────────────────────────────────

export interface GoalData {
  id: string;
  type: string;
  name: string;
  targetAmount: number;
  allocatedBalance: number;
  allocationPercentage: number;
  priority: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletResponse {
  id: string;
  userId: string;
  balance: number;
  interestEarned: number;
  goals: GoalData[];
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  reason: string | null;
  status: string;
  createdAt: string;
}

export interface DepositResult {
  wallet: WalletResponse;
  transaction: WalletTransaction;
}

// ── Savings ───────────────────────────────────

export interface SavingsConfig {
  smartSaveEnabled: boolean;
  savingPercentage: number;
  maxDailyAutoSave: number | null;
  minimumBalance: number;
}

export interface SavingsHistoryEntry {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  type: string;
  reason: string | null;
  createdAt: string;
}

export interface SavingsResponse {
  config: SavingsConfig;
  recentHistory: SavingsHistoryEntry[];
}

export interface SavingsDecisionResponse {
  smartSave: {
    decision: "SAVE" | "PAUSE" | "REDUCE";
    income: number;
    normalIncome: number;
    surplus: number;
    savedAmount: number;
    reason: string;
  };
  safety: {
    safe: boolean;
    action: "ALLOW" | "REDUCE" | "PAUSE";
    adjustedAmount: number;
    reasons: string[];
  };
  finalAmount: number;
  alreadySavedToday?: number;
  isAutoSaved?: boolean;
  finalDecision: "SAVE" | "PAUSE" | "REDUCE";
  explanation: string;
}

// ── Interest ──────────────────────────────────

export interface InterestAccount {
  id: string;
  walletId: string;
  partnerName: string;
  productName: string;
  annualRate: number;
  rateType: string;
  eligibleBalance: number;
  lastCalculatedAt: string | null;
  lastCreditedAt: string | null;
}

export interface InterestEntry {
  id: string;
  walletId: string;
  amount: number;
  eligibleBalance: number;
  rate: number;
  periodStart: string;
  periodEnd: string;
  status: string;
  source: string;
  createdAt: string;
}

// ── Recommendation ────────────────────────────

export interface RecommendationResponse {
  id: string;
  category: "Conservative" | "Balanced" | "Growth";
  confidence: number;
  explanation: string;
  inputs: {
    averageIncome: number;
    incomeVariance: number;
    volatilityClass: string;
    drySpellFrequency: number;
    savingsRate: number;
    availableSavings: number;
    riskProfile: string;
  } | null;
  disclaimer: string;
  createdAt: string;
}

// ── Tax ───────────────────────────────────────

export interface TaxResponse {
  id: string;
  quarter: string;
  cumulativeIncome: number;
  estimatedLiability: number;
  suggestedSetAside: number;
  ruleSet: {
    name: string;
    assumptions: unknown;
  };
  explanation: string;
  disclaimer: string;
  createdAt: string;
}

// ── Agent ─────────────────────────────────────

export interface AgentRunResponse {
  income: {
    today: number;
    online: number;
    offline: number;
    average: number;
    median: number;
    volatility: string;
  };
  pattern: {
    variance: number;
    standardDeviation: number;
    goodDayThreshold: number;
    lowDayThreshold: number;
    drySpellFrequency: number;
    earningFrequency: number;
    lowIncomeStreak: number;
  };
  savings: {
    decision: string;
    amount: number;
    surplus: number;
    reason: string;
    safetyMode: boolean;
    safetyAction: string;
    safetyReasons: string[];
  };
  wallet: {
    balance: number;
    goalAllocations: Record<string, number>;
  };
  recommendation: {
    category: string;
    confidence: number;
    reasonCodes: string[];
  };
  tax: {
    quarter: string;
    cumulativeIncome: number;
    estimatedLiability: number;
    suggestedSetAside: number;
  };
  explanations: {
    income: string;
    savings: string;
    recommendation: string;
    tax: string;
    full: string;
  };
  meta: {
    completedNodes: string[];
    errors: string[];
    timestamp: string;
  };
}

// ── Simulation ────────────────────────────────

export interface SimulationResponse {
  income: number;
  normalIncome: number;
  surplus: number;
  recommendedSave: number;
  decision: "SAVE" | "PAUSE";
  goalAllocation: Record<string, number>;
  safety: unknown;
  mutated: false;
}

// ── AA Consent ────────────────────────────────

export interface AAConsent {
  id: string;
  userId: string;
  provider: string;
  consentId: string;
  status: string;
  purpose: string | null;
  expiresAt: string | null;
  createdAt: string;
}

// ── Generic API Wrapper ───────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  error: true;
  statusCode: number;
  message: string;
  details?: unknown;
}

// ── User Settings ─────────────────────────────

export interface UserSettings {
  smartSaveEnabled?: boolean;
  maxDailyAutoSave?: number;
  minimumBalance?: number;
  savingPercentage?: number;
  riskProfile?: "conservative" | "moderate" | "aggressive";
}

// ── Demo Personas ─────────────────────────────

export const DEMO_PERSONAS = [
  {
    key: "delivery_rider",
    label: "Delivery Rider",
    email: "ravi.kumar@demo.com",
    name: "Ravi Kumar",
    normalIncome: "₹900/day",
    volatility: "Medium",
    risk: "Conservative",
    description: "A delivery rider with moderate income volatility and conservative risk appetite.",
    icon: "🛵",
    color: "#F97316",
  },
  {
    key: "rideshare_driver",
    label: "Ride-share Driver",
    email: "priya.sharma@demo.com",
    name: "Priya Sharma",
    normalIncome: "₹1,500/day",
    volatility: "Low–Medium",
    risk: "Moderate",
    description: "A ride-share driver with stable income and moderate risk preference.",
    icon: "🚗",
    color: "#EA580C",
  },
  {
    key: "freelancer",
    label: "Freelancer",
    email: "arjun.mehta@demo.com",
    name: "Arjun Mehta",
    normalIncome: "₹2,500/day",
    volatility: "High",
    risk: "Aggressive",
    description: "A freelancer with high income volatility and aggressive growth strategy.",
    icon: "💻",
    color: "#E5533D",
  },
] as const;

export type PersonaKey = (typeof DEMO_PERSONAS)[number]["key"];
