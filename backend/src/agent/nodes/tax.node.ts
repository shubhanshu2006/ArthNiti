import type { FinancialAgentState } from "../state.js";
import { estimateTax } from "../../modules/tax/tax.engine.js";
import { prisma } from "../../db/client.js";
import { numberValue } from "../../utils/money.js";
import { currentQuarter } from "../../utils/dates.js";
import { logger } from "../../utils/logger.js";
import { getActiveTaxRuleSet } from "../../modules/tax/tax.rules.js";

const LOG_CTX = "Agent.TaxNode";

/**
 * Tax Node — calculates tax estimate from cumulative eligible income.
 * Uses the deterministic tax engine.
 */
export async function taxNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    // Get cumulative income
    const incomeAgg = await prisma.transaction.aggregate({
      where: { userId: state.userId, isIncome: true },
      _sum: { amount: true },
    });

    const cumulativeIncome = numberValue(incomeAgg._sum.amount);
    const taxResult = estimateTax(cumulativeIncome);
    const quarter = currentQuarter();

    const ruleSet = await getActiveTaxRuleSet();
    await prisma.taxEstimate.create({
        data: {
          userId: state.userId,
          quarter,
          cumulativeIncome,
          estimatedLiability: taxResult.estimatedLiability,
          suggestedSetAside: taxResult.suggestedSetAside,
          ruleSetId: ruleSet.id,
        },
    });

    logger.info(LOG_CTX, `Tax: cumulative=₹${cumulativeIncome}, liability=₹${taxResult.estimatedLiability}`);

    return {
      cumulativeIncome,
      taxEstimatedLiability: taxResult.estimatedLiability,
      taxSuggestedSetAside: taxResult.suggestedSetAside,
      taxQuarter: quarter,
      completedNodes: [...state.completedNodes, "tax"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Tax node failed", err.message);
    return { errors: [...state.errors, `Tax: ${err.message}`] };
  }
}
