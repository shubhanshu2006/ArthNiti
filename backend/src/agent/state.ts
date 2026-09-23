/**
 * LangGraph Agent State.
 * This is the shared state passed through all nodes in the financial workflow.
 *
 * The LLM may explain but must NOT calculate any financial values.
 * All numbers are computed by deterministic engines and passed through state.
 */
export interface FinancialAgentState {
  // --- Input ---
  userId: string;

  // --- Income (set by income node) ---
  todayIncome: number;
  onlineIncome: number;
  offlineIncome: number;

  // --- Pattern (set by pattern node) ---
  averageIncome: number;
  medianIncome: number;
  incomeVariance: number;
  standardDeviation: number;
  volatilityClass: string;
  goodDayThreshold: number;
  lowDayThreshold: number;
  drySpellFrequency: number;
  earningFrequency: number;
  lowIncomeStreak: number;

  // --- Savings (set by savings + safety nodes) ---
  surplus: number;
  savingsAmount: number;
  savingsDecision: "SAVE" | "PAUSE" | "REDUCE";
  savingsReason: string;
  smartSaveEnabled: boolean;
  safetyMode: boolean;
  safetyAction: string;
  safetyReasons: string[];

  // --- Wallet (set by savings node) ---
  walletBalance: number;
  goalAllocations: Record<string, number>;

  // --- User profile ---
  riskProfile: string;
  savingPercentage: number;
  maxDailyAutoSave: number | null;
  minimumBalance: number;

  // --- Recommendation (set by recommendation node) ---
  recommendationCategory: string;
  recommendationReasonCodes: string[];
  recommendationConfidence: number;

  // --- Tax (set by tax node) ---
  cumulativeIncome: number;
  taxEstimatedLiability: number;
  taxSuggestedSetAside: number;
  taxQuarter: string;

  // --- Explanation (set by explanation node) ---
  explanation: string;
  incomeExplanation: string;
  savingsExplanation: string;
  recommendationExplanation: string;
  taxExplanation: string;

  // --- Metadata ---
  completedNodes: string[];
  errors: string[];
  timestamp: string;
}

/**
 * Creates a blank initial state with sensible defaults.
 */
export function createInitialState(userId: string): FinancialAgentState {
  return {
    userId,

    todayIncome: 0,
    onlineIncome: 0,
    offlineIncome: 0,

    averageIncome: 0,
    medianIncome: 0,
    incomeVariance: 0,
    standardDeviation: 0,
    volatilityClass: "low",
    goodDayThreshold: 0,
    lowDayThreshold: 0,
    drySpellFrequency: 0,
    earningFrequency: 0,
    lowIncomeStreak: 0,

    surplus: 0,
    savingsAmount: 0,
    savingsDecision: "PAUSE",
    savingsReason: "",
    smartSaveEnabled: true,
    safetyMode: false,
    safetyAction: "ALLOW",
    safetyReasons: [],

    walletBalance: 0,
    goalAllocations: {},

    riskProfile: "moderate",
    savingPercentage: 0.15,
    maxDailyAutoSave: null,
    minimumBalance: 0,

    recommendationCategory: "",
    recommendationReasonCodes: [],
    recommendationConfidence: 0,

    cumulativeIncome: 0,
    taxEstimatedLiability: 0,
    taxSuggestedSetAside: 0,
    taxQuarter: "",

    explanation: "",
    incomeExplanation: "",
    savingsExplanation: "",
    recommendationExplanation: "",
    taxExplanation: "",

    completedNodes: [],
    errors: [],
    timestamp: new Date().toISOString(),
  };
}
