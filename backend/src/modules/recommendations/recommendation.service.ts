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
    include: { wallet: { include: { goals: true } } },
  });
  if (!user) throw ApiError.notFound("User not found");

  // Get income pattern data
  const from30 = daysAgo(30);
  const summary = await getIncomeSummary(userId, from30);

  const availableSavings = user.wallet ? numberValue(user.wallet.balance) : 0;
  const growthGoal = user.wallet?.goals.find((g) => g.type === "GROWTH");
  const growthBalance = growthGoal ? numberValue(growthGoal.allocatedBalance) : 0;

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
    growthBalance,
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
 * Gets the latest persisted recommendation for a user without recomputing.
 * If none exists yet (first-time view), generates and persists one.
 * Used by GET routes so viewing a recommendation doesn't create new rows
 * on every request — only `generateRecommendation` (POST /generate) does that.
 */
export async function getLatestRecommendation(userId: string) {
  const [recommendation, inputRecord] = await Promise.all([
    prisma.recommendation.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.recommendationInput.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!recommendation) {
    return generateRecommendation(userId);
  }

  return {
    id: recommendation.id,
    category: recommendation.category,
    confidence: numberValue(recommendation.confidence),
    explanation: recommendation.reasoning,
    inputs: inputRecord
      ? {
          averageIncome: numberValue(inputRecord.averageIncome),
          incomeVariance: numberValue(inputRecord.incomeVariance),
          volatilityClass: inputRecord.volatilityClass,
          drySpellFrequency: numberValue(inputRecord.drySpellFrequency),
          savingsRate: numberValue(inputRecord.savingsRate),
          availableSavings: numberValue(inputRecord.availableSavings),
          riskProfile: inputRecord.riskProfile,
        }
      : null,
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
  inputs: { averageIncome: number; volatilityClass: string; riskProfile: string; availableSavings: number; growthBalance?: number }
): string {
  const parts: string[] = [];

  parts.push(`Based on your financial profile, a ${result.category} investment approach is recommended.`);

  if (result.reasonCodes.includes("HIGH_INCOME_VOLATILITY")) {
    parts.push(`Your income volatility is high (${inputs.volatilityClass}), suggesting more stable investment options.`);
  }

  const growthAmt = roundMoney(inputs.growthBalance ?? 0);
  if (result.reasonCodes.includes("LIMITED_AVAILABLE_SAVINGS")) {
    parts.push(
      `With an overall savings buffer of ₹${roundMoney(inputs.availableSavings)}, building your emergency reserve remains the priority. Only your designated Growth Fund (₹${growthAmt}) is allocated toward market investments, keeping your emergency and medical reserves 100% protected in liquid cash.`
    );
  } else {
    parts.push(
      `Your designated Growth Fund of ₹${growthAmt} (from total savings of ₹${roundMoney(inputs.availableSavings)}) is ready for allocation toward this strategy.`
    );
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
