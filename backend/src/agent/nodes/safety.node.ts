import type { FinancialAgentState } from "../state.js";
import { runSafetyChecks } from "../../modules/savings/safety.engine.js";
import { logger } from "../../utils/logger.js";

const LOG_CTX = "Agent.SafetyNode";

/**
 * Safety Node — validates the savings decision against safety constraints.
 * May reduce or pause the proposed savings amount.
 */
export async function safetyNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const check = runSafetyChecks({
      proposedAmount: state.savingsAmount,
      smartSaveEnabled: state.smartSaveEnabled,
      todayIncome: state.todayIncome,
      normalIncome: state.averageIncome,
      lowIncomeStreak: state.lowIncomeStreak,
      availableBalance: state.todayIncome,
      minimumBalance: state.minimumBalance,
      maxDailyAutoSave: state.maxDailyAutoSave,
    });

    const finalDecision: "SAVE" | "PAUSE" | "REDUCE" = check.safe
      ? check.adjustedAmount < state.savingsAmount ? "REDUCE" : "SAVE"
      : "PAUSE";

    logger.info(LOG_CTX, `Safety: ${check.action}, adjusted=₹${check.adjustedAmount}`);

    return {
      savingsAmount: check.adjustedAmount,
      savingsDecision: finalDecision,
      safetyMode: !check.safe,
      safetyAction: check.action,
      safetyReasons: check.reasons,
      completedNodes: [...state.completedNodes, "safety"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Safety node failed", err.message);
    return { errors: [...state.errors, `Safety: ${err.message}`] };
  }
}
