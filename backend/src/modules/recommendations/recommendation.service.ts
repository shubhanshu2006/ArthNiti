import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { recommend } from "./recommendation.engine.js";
import { getIncomeSummary } from "../income/income.service.js";
import { daysAgo } from "../../utils/dates.js";

const LOG_CTX = "Recommendation.Service";

const DISCLAIMER = "Illustrative information, not personalized financial advice.";

/**
 * Generates an investment recommendation for a user.
 * Uses deterministic engine for category + reason codes,
 * then builds a human-readable explanation.
 *
 * Persists both the inputs and the recommendation for auditability.
 */
export async function generateRecommendation(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user) throw ApiError.notFound("User not found");

  // Get income pattern data
  const from30 = daysAgo(30);
  const summary = await getIncomeSummary(userId, from30);

  const availableSavings = user.wallet ? numberValue(user.wallet.balance) : 0;

  // Build recommendation inputs
  const inputs = {
    averageIncome: summary.average,
    incomeVariance: summary.variance,
    volatilityClass: summary.volatilityClass,
    drySpellFrequency: summary.daily.length > 0
      ? roundMoney(summary.daily.filter((d) => d === 0).length / summary.daily.length)
      : 0,
    savingsRate: numberValue(user.savingPercentage),
    availableSavings,
    riskProfile: user.riskProfile ?? "moderate",
  };

  // Run deterministic recommendation engine
  const engineResult = recommend({
    volatilityClass: inputs.volatilityClass,
    riskProfile: inputs.riskProfile,
    availableSavings: inputs.availableSavings,
    averageIncome: inputs.averageIncome,
    incomeVariance: inputs.incomeVariance,
    drySpellFrequency: inputs.drySpellFrequency,
    savingsRate: inputs.savingsRate,
    onlineIncome: summary.online,
    offlineIncome: summary.offline,
  });

  // Build explanation
  const explanation = buildExplanation(engineResult, inputs);

  // Persist inputs
  await prisma.recommendationInput.create({
    data: {
      userId,
      averageIncome: inputs.averageIncome,
      incomeVariance: inputs.incomeVariance,
      volatilityClass: inputs.volatilityClass,
      drySpellFrequency: inputs.drySpellFrequency,
      savingsRate: inputs.savingsRate,
      availableSavings: inputs.availableSavings,
      riskProfile: inputs.riskProfile,
    },
  });

  // Persist recommendation
  const recommendation = await prisma.recommendation.create({
    data: {
      userId,
      category: engineResult.category,
      reasoning: explanation,
      confidence: engineResult.confidence,
    },
  });

  logger.info(LOG_CTX, `Recommendation generated for ${userId}: ${engineResult.category}`);

  return {
    id: recommendation.id,
    category: engineResult.category,
    confidence: engineResult.confidence,
    reasonCodes: engineResult.reasonCodes,
    explanation,
    inputs,
    disclaimer: DISCLAIMER,
    createdAt: recommendation.createdAt,
  };
}

/**
 * Gets the latest recommendation for a user.
 */
export async function getLatestRecommendation(userId: string) {
  const recommendation = await prisma.recommendation.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!recommendation) {
    return null;
  }

  return {
    id: recommendation.id,
    category: recommendation.category,
    reasoning: recommendation.reasoning,
    confidence: numberValue(recommendation.confidence),
    disclaimer: DISCLAIMER,
    createdAt: recommendation.createdAt,
  };
}

/**
 * Gets recommendation history for a user.
 */
export async function getRecommendationHistory(userId: string, limit = 10) {
  const recs = await prisma.recommendation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return recs.map((r) => ({
    id: r.id,
    category: r.category,
    reasoning: r.reasoning,
    confidence: numberValue(r.confidence),
    createdAt: r.createdAt,
  }));
}

function buildExplanation(
  result: { category: string; reasonCodes: string[]; confidence: number },
  inputs: { averageIncome: number; volatilityClass: string; riskProfile: string; availableSavings: number }
): string {
  const parts: string[] = [];

  parts.push(`Based on your financial profile, a ${result.category} investment approach is recommended.`);

  if (result.reasonCodes.includes("HIGH_INCOME_VOLATILITY")) {
    parts.push(`Your income volatility is high (${inputs.volatilityClass}), suggesting more stable investment options.`);
  }

  if (result.reasonCodes.includes("LIMITED_AVAILABLE_SAVINGS")) {
    parts.push(`With available savings of ₹${roundMoney(inputs.availableSavings)}, building an emergency fund should be prioritized.`);
  }

  if (inputs.riskProfile === "conservative") {
    parts.push("Your conservative risk profile favors capital preservation over aggressive growth.");
  } else if (inputs.riskProfile === "aggressive") {
    parts.push("Your aggressive risk profile allows for higher-risk, higher-return options.");
  }

  parts.push(`Average daily income: ₹${roundMoney(inputs.averageIncome)}.`);
  parts.push(DISCLAIMER);

  return parts.join(" ");
}
