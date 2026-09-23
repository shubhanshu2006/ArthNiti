import { prisma } from "../../../db/client.js";
import { numberValue, roundMoney } from "../../../utils/money.js";
import { PATTERN_THRESHOLDS } from "../../../config/constants.js";

/**
 * Income Pattern Engine.
 * Calculates rolling statistics from the unified income ledger:
 * rollingAverage, medianIncome, variance, standardDeviation,
 * volatilityClass, goodDayThreshold, lowDayThreshold, drySpellFrequency, earningFrequency.
 *
 * Persists results to IncomeStats for historical tracking.
 */
export async function calculateIncomePattern(userId: string, windowDays: number = PATTERN_THRESHOLDS.ROLLING_WINDOW_DAYS) {
  const from = new Date();
  from.setDate(from.getDate() - windowDays);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      isIncome: true,
      date: { gte: from },
    },
    orderBy: { date: "asc" },
  });

  // Group by day
  const byDay = new Map<string, number>();
  const cursor = new Date(from);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Initialize all days in window (including zero-income days)
  while (cursor <= today) {
    byDay.set(cursor.toISOString().slice(0, 10), 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  // Fill in actual income
  for (const tx of transactions) {
    const day = tx.date.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + numberValue(tx.amount));
  }

  const daily = [...byDay.values()];
  const earningDays = daily.filter((v) => v > 0);
  const zeroDays = daily.filter((v) => v === 0);

  // Statistics
  const totalDays = daily.length || 1;
  const average = earningDays.length > 0
    ? earningDays.reduce((sum, v) => sum + v, 0) / earningDays.length
    : 0;

  const sorted = [...earningDays].sort((a, b) => a - b);
  const median = sorted.length > 0
    ? sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]
    : 0;

  const variance = earningDays.length > 0
    ? earningDays.reduce((sum, v) => sum + (v - average) ** 2, 0) / earningDays.length
    : 0;

  const standardDeviation = Math.sqrt(variance);

  const volatilityClass =
    standardDeviation > average * PATTERN_THRESHOLDS.HIGH_VOLATILITY
      ? "high"
      : standardDeviation > average * PATTERN_THRESHOLDS.MEDIUM_VOLATILITY
        ? "medium"
        : "low";

  const goodDayThreshold = average + standardDeviation;
  const lowDayThreshold = Math.max(0, average - standardDeviation);
  const earningFrequency = earningDays.length / totalDays;
  const drySpellFrequency = zeroDays.length / totalDays;

  const result = {
    rollingAverage: roundMoney(average),
    medianIncome: roundMoney(median),
    variance: roundMoney(variance),
    standardDeviation: roundMoney(standardDeviation),
    volatilityClass,
    goodDayThreshold: roundMoney(goodDayThreshold),
    lowDayThreshold: roundMoney(lowDayThreshold),
    drySpellFrequency: roundMoney(drySpellFrequency),
    earningFrequency: roundMoney(earningFrequency),
  };

  // Persist to IncomeStats
  await prisma.incomeStats.create({
    data: {
      userId,
      periodStart: from,
      periodEnd: new Date(),
      ...result,
    },
  });

  return result;
}

/**
 * Gets the latest persisted income pattern for a user.
 */
export async function getLatestIncomePattern(userId: string) {
  return prisma.incomeStats.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
