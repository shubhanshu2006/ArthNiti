import { prisma } from "../../db/client.js";
import { getIncomeSummary } from "../income/income.service.js";
import { getLatestTaxEstimate } from "../tax/tax.service.js";
import { getLatestRecommendation } from "../recommendations/recommendation.service.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { startOfDay } from "../../utils/dates.js";

export async function getDashboard(userId: string) {
  // Autonomously evaluate and execute auto-save if enabled
  try {
    const userCheck = await prisma.user.findUnique({ where: { id: userId }, select: { smartSaveEnabled: true } });
    if (userCheck?.smartSaveEnabled) {
      const { computeSavingsDecision } = await import("../savings/savings.service.js");
      await computeSavingsDecision(userId);
    }
  } catch (err) {
    // Non-blocking
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const summary = await getIncomeSummary(userId, monthStart, now);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: { include: { goals: { where: { status: "ACTIVE" } } } } },
  });
  if (!user) throw new Error("User not found");

  const [savings, latestRecommendation, latestTax] = await Promise.all([
    prisma.savingsLedger.findMany({ where: { userId, createdAt: { gte: monthStart } } }),
    getLatestRecommendation(userId),
    getLatestTaxEstimate(userId),
  ]);

  const localStart = startOfDay(now);
  const utcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const today = new Date(Math.min(localStart.getTime(), utcStart.getTime()));

  const todayAutoSave = savings
    .filter((entry) => entry.type === "AUTO_SAVE" && entry.createdAt >= today)
    .reduce((sum, entry) => sum + numberValue(entry.amount), 0);
  const manualDeposits = savings
    .filter((entry) => entry.type === "MANUAL_DEPOSIT")
    .reduce((sum, entry) => sum + numberValue(entry.amount), 0);
  const totalSavings = savings.reduce((sum, entry) => sum + numberValue(entry.amount), 0);

  const recommendation = { category: latestRecommendation.category, reason: latestRecommendation.explanation, confidence: latestRecommendation.confidence };
  const tax = { estimatedLiability: latestTax.estimatedLiability, suggestedSetAside: latestTax.suggestedSetAside };

  return {
    income: {
      today: roundMoney(summary.transactions.filter((tx) => tx.date >= today).reduce((sum, tx) => sum + numberValue(tx.amount), 0)),
      average: summary.average,
      monthly: summary.total,
      online: summary.online,
      offline: summary.offline,
      volatility: summary.volatilityClass,
      drySpellFrequency: summary.drySpellFrequency,
      earningFrequency: summary.earningFrequency,
    },
    wallet: {
      balance: numberValue(user.wallet?.balance),
      interestEarned: numberValue(user.wallet?.interestEarned),
    },
    goals: Object.fromEntries((user.wallet?.goals ?? []).map((goal) => [goal.type.toLowerCase(), numberValue(goal.allocatedBalance)])),
    savings: {
      total: roundMoney(totalSavings),
      todayAutoSave: roundMoney(todayAutoSave),
      manualDeposits: roundMoney(manualDeposits),
    },
    recommendation,
    tax,
  };
}
