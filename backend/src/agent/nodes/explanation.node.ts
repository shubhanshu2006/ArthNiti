import type { FinancialAgentState } from "../state.js";
import { roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { generateExplanation } from "../llm/explanation.client.js";

const LOG_CTX = "Agent.ExplanationNode";

/**
 * Explanation Node — generates human-readable explanations for each decision.
 *
 * Per the implementation plan (Section 21):
 * - The LLM may explain savings decisions, summarize income patterns,
 *   explain recommendations, and explain tax estimates.
 * - The LLM must NOT calculate financial values.
 *
 * In this prototype, explanations are generated deterministically.
 * In production, swap this for LLM-generated explanations using the
 * pre-computed state values.
 */
export async function explanationNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const incomeExplanation = buildIncomeExplanation(state);
    const savingsExplanation = buildSavingsExplanation(state);
    const recommendationExplanation = buildRecommendationExplanation(state);
    const taxExplanation = buildTaxExplanation(state);

    const explanation = [
      "📊 **Income Summary**",
      incomeExplanation,
      "",
      "💰 **Savings Decision**",
      savingsExplanation,
      "",
      "📈 **Investment Recommendation**",
      recommendationExplanation,
      "",
      "🧾 **Tax Planning**",
      taxExplanation,
    ].join("\n");

    let generatedExplanation = explanation;
    try {
      generatedExplanation = await generateExplanation(state, explanation);
    } catch (error) {
      logger.warn(LOG_CTX, `LLM explanation unavailable; using deterministic fallback: ${error instanceof Error ? error.message : "unknown error"}`);
    }
    logger.info(LOG_CTX, "Explanations generated");

    return {
      incomeExplanation,
      savingsExplanation,
      recommendationExplanation,
      taxExplanation,
      explanation: generatedExplanation,
      completedNodes: [...state.completedNodes, "explanation"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Explanation node failed", err.message);
    return { errors: [...state.errors, `Explanation: ${err.message}`] };
  }
}

function buildIncomeExplanation(state: FinancialAgentState): string {
  const parts: string[] = [];

  if (state.todayIncome > 0) {
    parts.push(`Today you earned ₹${roundMoney(state.todayIncome)}`);
    if (state.onlineIncome > 0 && state.offlineIncome > 0) {
      parts.push(`(₹${roundMoney(state.onlineIncome)} online + ₹${roundMoney(state.offlineIncome)} offline)`);
    }
    parts.push(".");
  } else {
    parts.push("No income recorded today.");
  }

  parts.push(`Your average daily income is ₹${roundMoney(state.averageIncome)} with ${state.volatilityClass} volatility.`);

  if (state.todayIncome > state.goodDayThreshold) {
    parts.push("This is a high-income day! 🎉");
  } else if (state.todayIncome > 0 && state.todayIncome < state.lowDayThreshold) {
    parts.push("This is a below-average income day.");
  }

  if (state.drySpellFrequency > 0.2) {
    parts.push(`You have zero-income days about ${Math.round(state.drySpellFrequency * 100)}% of the time.`);
  }

  return parts.join(" ");
}

function buildSavingsExplanation(state: FinancialAgentState): string {
  if (state.savingsDecision === "PAUSE") {
    return state.safetyReasons.length > 0
      ? `Auto-save is paused. ${state.safetyReasons.join(". ")}.`
      : `Auto-save is paused. ${state.savingsReason}`;
  }

  const parts: string[] = [];
  parts.push(
    `Today's income of ₹${roundMoney(state.todayIncome)} exceeds your normal of ₹${roundMoney(state.averageIncome)} by ₹${roundMoney(state.surplus)}.`
  );

  if (state.savingsDecision === "REDUCE") {
    parts.push(`Auto-save was reduced to ₹${roundMoney(state.savingsAmount)}.`);
    if (state.safetyReasons.length > 0) {
      parts.push(state.safetyReasons.join(". ") + ".");
    }
  } else {
    parts.push(`₹${roundMoney(state.savingsAmount)} recommended for auto-save.`);
  }

  return parts.join(" ");
}

function buildRecommendationExplanation(state: FinancialAgentState): string {
  const parts: string[] = [];

  parts.push(`A ${state.recommendationCategory} investment approach is recommended for your profile.`);

  if (state.recommendationReasonCodes.includes("HIGH_INCOME_VOLATILITY")) {
    parts.push("Your income volatility suggests more stable investment options.");
  }
  if (state.recommendationReasonCodes.includes("LIMITED_AVAILABLE_SAVINGS")) {
    parts.push("Building your emergency fund should be prioritized before higher-risk investments.");
  }

  parts.push("Illustrative information, not personalized financial advice.");

  return parts.join(" ");
}

function buildTaxExplanation(state: FinancialAgentState): string {
  if (state.taxEstimatedLiability === 0) {
    return `For ${state.taxQuarter}, your cumulative income of ₹${roundMoney(state.cumulativeIncome)} is below the taxable threshold. No estimated liability at this time. Planning estimate only.`;
  }

  return `For ${state.taxQuarter}, your cumulative income is ₹${roundMoney(state.cumulativeIncome)}. Estimated tax liability: ₹${roundMoney(state.taxEstimatedLiability)}. Suggested set-aside: ₹${roundMoney(state.taxSuggestedSetAside)}. Planning estimate only — not tax filing or professional tax advice.`;
}
