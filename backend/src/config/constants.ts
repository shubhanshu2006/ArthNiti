/** Application-wide constants */

/** Default goal allocation percentages (must sum to 100) */
export const DEFAULT_GOAL_ALLOCATIONS = {
  EMERGENCY: 50,
  MEDICAL: 30,
  GROWTH: 20,
} as const;

/** Default goal targets in INR */
export const DEFAULT_GOAL_TARGETS = {
  EMERGENCY: 15_000,
  MEDICAL: 10_000,
  GROWTH: 50_000,
} as const;

/** Interest engine defaults */
export const INTEREST_DEFAULTS = {
  ANNUAL_RATE: 0.065,
  RATE_TYPE: "FIXED",
  PARTNER_NAME: "Prototype Partner",
  PRODUCT_NAME: "Smart Savings",
} as const;

/** Currency */
export const DEFAULT_CURRENCY = "INR";

/** Pagination */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 200,
} as const;

/** Income pattern thresholds */
export const PATTERN_THRESHOLDS = {
  HIGH_VOLATILITY: 0.75,
  MEDIUM_VOLATILITY: 0.35,
  LOW_INCOME_STREAK_LIMIT: 3,
  ROLLING_WINDOW_DAYS: 30,
} as const;

/** Wallet transaction types */
export const WALLET_TX_TYPES = {
  MANUAL_DEPOSIT: "MANUAL_DEPOSIT",
  AUTO_SAVE: "AUTO_SAVE",
  GOAL_ALLOCATION: "GOAL_ALLOCATION",
  WITHDRAWAL: "WITHDRAWAL",
  INTEREST_CREDIT: "INTEREST_CREDIT",
  ADJUSTMENT: "ADJUSTMENT",
} as const;

/** Savings decision outcomes */
export const SAVINGS_DECISIONS = {
  SAVE: "SAVE",
  PAUSE: "PAUSE",
  REDUCE: "REDUCE",
} as const;
