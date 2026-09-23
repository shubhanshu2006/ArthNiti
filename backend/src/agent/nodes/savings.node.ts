import type { FinancialAgentState } from "../state.js";
import { decideSmartSave } from "../../modules/savings/smart-save.engine.js";
import { logger } from "../../utils/logger.js";

const LOG_CTX = "Agent.SavingsNode";

/**
 * Savings Node — runs the Smart Save engine to determine how much to save.
 * Uses income and pattern data already in state.
 */
export async function savingsNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const decision = decideSmartSave({
      income: state.todayIncome,
      normalIncome: state.averageIncome,
      savingPercentage: state.savingPercentage,
      maxDailyAutoSave: state.maxDailyAutoSave,
      smartSaveEnabled: state.smartSaveEnabled,
      minimumBalance: state.minimumBalance,
      availableBalance: state.todayIncome,
      lowIncomeStreak: state.lowIncomeStreak,
    });

    logger.info(LOG_CTX, `Smart Save: ${decision.decision}, amount=₹${decision.savedAmount}`);

    return {
      surplus: decision.surplus,
      savingsAmount: decision.savedAmount,
      savingsDecision: decision.decision,
      savingsReason: decision.reason,
      completedNodes: [...state.completedNodes, "savings"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Savings node failed", err.message);
    return { errors: [...state.errors, `Savings: ${err.message}`] };
  }
}
