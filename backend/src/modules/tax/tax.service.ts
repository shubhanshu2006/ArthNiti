import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { estimateTax } from "./tax.engine.js";
import { currentQuarter } from "../../utils/dates.js";
import { getActiveTaxRuleSet } from "./tax.rules.js";

const LOG_CTX = "Tax.Service";

const DISCLAIMER = "Planning estimate only. Not tax filing or professional tax advice.";

/**
 * Calculates a tax estimate for a user based on their cumulative eligible income.
 * Uses the deterministic tax engine and persists the result.
 */
export async function calculateTaxEstimate(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");

  // Get the active tax rule set
  const ruleSet = await getActiveTaxRuleSet();

  // Calculate cumulative income (all income transactions for this user)
  const incomeAgg = await prisma.transaction.aggregate({
    where: { userId, isIncome: true },
    _sum: { amount: true },
  });

  const cumulativeIncome = numberValue(incomeAgg._sum.amount);
  const quarter = currentQuarter();

  // Run deterministic tax engine
  const taxResult = estimateTax(cumulativeIncome);

  // Persist the estimate
  const estimate = await prisma.taxEstimate.create({
    data: {
      userId,
      quarter,
      cumulativeIncome,
      estimatedLiability: taxResult.estimatedLiability,
      suggestedSetAside: taxResult.suggestedSetAside,
      ruleSetId: ruleSet.id,
    },
  });

  // Build explanation
  const explanation = buildTaxExplanation(cumulativeIncome, taxResult, quarter);

  logger.info(LOG_CTX, `Tax estimate for ${userId}: liability ₹${taxResult.estimatedLiability}`);

  return {
    id: estimate.id,
    quarter,
    cumulativeIncome: roundMoney(cumulativeIncome),
    estimatedLiability: taxResult.estimatedLiability,
    suggestedSetAside: taxResult.suggestedSetAside,
    ruleSet: {
      name: ruleSet.name,
      assumptions: ruleSet.assumptions,
    },
    explanation,
    disclaimer: DISCLAIMER,
    createdAt: estimate.createdAt,
  };
}

/**
 * Gets the latest persisted tax estimate for a user without recomputing.
 * If none exists yet (first-time view), calculates and persists one.
 * Used by GET routes so viewing a tax estimate doesn't create new rows
 * on every request — only `calculateTaxEstimate` (POST /calculate) does that.
 */
export async function getLatestTaxEstimate(userId: string) {
  const estimate = await prisma.taxEstimate.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { ruleSet: true },
  });

  if (!estimate) {
    return calculateTaxEstimate(userId);
  }

  const cumulativeIncome = numberValue(estimate.cumulativeIncome);
  const taxResult = {
    estimatedLiability: numberValue(estimate.estimatedLiability),
    suggestedSetAside: numberValue(estimate.suggestedSetAside),
  };

  return {
    id: estimate.id,
    quarter: estimate.quarter,
    cumulativeIncome,
    estimatedLiability: taxResult.estimatedLiability,
    suggestedSetAside: taxResult.suggestedSetAside,
    ruleSet: {
      name: estimate.ruleSet.name,
      assumptions: estimate.ruleSet.assumptions,
    },
    explanation: buildTaxExplanation(cumulativeIncome, taxResult, estimate.quarter),
    disclaimer: DISCLAIMER,
    createdAt: estimate.createdAt,
  };
}

/**
 * Gets tax estimate history for a user.
 */
export async function getTaxHistory(userId: string, limit = 10) {
  const estimates = await prisma.taxEstimate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return estimates.map((e) => ({
    id: e.id,
    quarter: e.quarter,
    cumulativeIncome: numberValue(e.cumulativeIncome),
    estimatedLiability: numberValue(e.estimatedLiability),
    suggestedSetAside: numberValue(e.suggestedSetAside),
    createdAt: e.createdAt,
  }));
}

export function buildTaxExplanation(
  cumulativeIncome: number,
  taxResult: { estimatedLiability: number; suggestedSetAside: number },
  quarter: string
): string {
  const parts: string[] = [];

  parts.push(`For ${quarter}, your cumulative eligible income is ₹${roundMoney(cumulativeIncome)}.`);

  if (taxResult.estimatedLiability === 0) {
    parts.push("Your income is below the taxable threshold — no estimated liability at this time.");
  } else {
    parts.push(`Estimated tax liability: ₹${roundMoney(taxResult.estimatedLiability)}.`);
    parts.push(`We suggest setting aside ₹${roundMoney(taxResult.suggestedSetAside)} (10% buffer included) to stay prepared.`);
  }

  parts.push(DISCLAIMER);
  return parts.join(" ");
}
