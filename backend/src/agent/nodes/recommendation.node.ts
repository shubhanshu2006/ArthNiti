import type { FinancialAgentState } from "../state.js";
import { recommend } from "../../modules/recommendations/recommendation.engine.js";
import { logger } from "../../utils/logger.js";
import { prisma } from "../../db/client.js";

const LOG_CTX = "Agent.RecommendationNode";

/**
 * Recommendation Node — runs the deterministic investment recommendation engine.
 * Uses income pattern and user profile from state.
 */
export async function recommendationNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const result = recommend({
      volatilityClass: state.volatilityClass,
      riskProfile: state.riskProfile,
      availableSavings: state.walletBalance,
      averageIncome: state.averageIncome,
      incomeVariance: state.incomeVariance,
      drySpellFrequency: state.drySpellFrequency,
      savingsRate: state.savingPercentage,
      onlineIncome: state.onlineIncome,
      offlineIncome: state.offlineIncome,
    });

    logger.info(LOG_CTX, `Recommendation: ${result.category} (confidence=${result.confidence})`);

    await prisma.recommendationInput.create({
      data: {
        userId: state.userId,
        averageIncome: state.averageIncome,
        incomeVariance: state.incomeVariance,
        volatilityClass: state.volatilityClass,
        drySpellFrequency: state.drySpellFrequency,
        savingsRate: state.savingPercentage,
        availableSavings: state.walletBalance,
        riskProfile: state.riskProfile,
      },
    });
    await prisma.recommendation.create({
      data: {
        userId: state.userId,
        category: result.category,
        reasoning: `Reason codes: ${result.reasonCodes.join(", ")}`,
        confidence: result.confidence,
      },
    });

    return {
      recommendationCategory: result.category,
      recommendationReasonCodes: result.reasonCodes,
      recommendationConfidence: result.confidence,
      completedNodes: [...state.completedNodes, "recommendation"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Recommendation node failed", err.message);
    return { errors: [...state.errors, `Recommendation: ${err.message}`] };
  }
}
