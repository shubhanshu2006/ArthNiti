import type { FinancialAgentState } from "../state.js";
import { getIncomeSummary } from "../../modules/income/income.service.js";
import { calculateIncomePattern } from "../../modules/income/pattern/income-pattern.engine.js";
import { calculateLowIncomeStreak } from "../../modules/savings/safety.engine.js";
import { daysAgo } from "../../utils/dates.js";
import { logger } from "../../utils/logger.js";

const LOG_CTX = "Agent.PatternNode";

/**
 * Pattern Node — calculates income pattern statistics from the last 30 days.
 * Feeds: rolling average, variance, volatility, dry-spell, thresholds.
 */
export async function patternNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const from30 = daysAgo(30);
    const summary = await getIncomeSummary(state.userId, from30);
    const pattern = await calculateIncomePattern(state.userId);

    const lowIncomeStreak = calculateLowIncomeStreak(summary.daily, pattern.rollingAverage);

    logger.info(LOG_CTX, `Pattern: avg=₹${pattern.rollingAverage}, volatility=${pattern.volatilityClass}, streak=${lowIncomeStreak}`);

    return {
      averageIncome: pattern.rollingAverage,
      medianIncome: pattern.medianIncome,
      incomeVariance: pattern.variance,
      standardDeviation: pattern.standardDeviation,
      volatilityClass: pattern.volatilityClass,
      goodDayThreshold: pattern.goodDayThreshold,
      lowDayThreshold: pattern.lowDayThreshold,
      drySpellFrequency: pattern.drySpellFrequency,
      earningFrequency: pattern.earningFrequency,
      lowIncomeStreak,
      completedNodes: [...state.completedNodes, "pattern"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Pattern node failed", err.message);
    return { errors: [...state.errors, `Pattern: ${err.message}`] };
  }
}
