import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { startOfDay, endOfDay, daysAgo } from "../../utils/dates.js";
import { decideSmartSave, type SavingsDecision } from "./smart-save.engine.js";
import { runSafetyChecks, calculateLowIncomeStreak, type SafetyCheck } from "./safety.engine.js";
import { getIncomeSummary } from "../income/income.service.js";
import { getTodayIncome } from "../income/aggregation/daily-income.service.js";
import { calculateIncomePattern } from "../income/pattern/income-pattern.engine.js";

const LOG_CTX = "Savings.Service";

export interface FullSavingsDecision {
  smartSave: SavingsDecision;
  safety: SafetyCheck;
  finalAmount: number;
  alreadySavedToday: number;
  isAutoSaved: boolean;
  finalDecision: "SAVE" | "PAUSE" | "REDUCE";
  explanation: string;
}

/**
 * Runs the complete savings decision pipeline:
 *  1. Get today's income (unified — online + offline)
 *  2. Get income pattern (rolling average from recent history)
 *  3. Run Smart Save engine (surplus × savingPercentage)
 *  4. Run Safety engine (streak, cap, minimum balance checks)
 *  5. Return auditable decision with explanation
 */
export async function computeSavingsDecision(userId: string): Promise<FullSavingsDecision> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user) throw ApiError.notFound("User not found");

  // 1. Today's unified income
  const todayData = await getTodayIncome(userId);
  const todayIncome = todayData.total;

  // 2. Income pattern (rolling average from last 30 days)
  const from30 = daysAgo(30);
  const summary = await getIncomeSummary(userId, from30);
  const pattern = await calculateIncomePattern(userId);
  const normalIncome = pattern.rollingAverage;

  // 3. Calculate low-income streak
  const recentDays = summary.daily; // array of daily income totals
  const lowIncomeStreak = calculateLowIncomeStreak(recentDays, normalIncome);

  // 4. Smart Save engine
  const walletBalance = user.wallet ? numberValue(user.wallet.balance) : 0;
  const availableCashFlow = todayIncome;

  const smartSaveResult = decideSmartSave({
    income: todayIncome,
    normalIncome,
    savingPercentage: numberValue(user.savingPercentage),
    maxDailyAutoSave: user.maxDailyAutoSave ? numberValue(user.maxDailyAutoSave) : null,
    smartSaveEnabled: user.smartSaveEnabled,
    minimumBalance: numberValue(user.minimumBalance),
    availableBalance: availableCashFlow,
    lowIncomeStreak,
  });

  // 5. Safety engine
  const safetyResult = runSafetyChecks({
    proposedAmount: smartSaveResult.savedAmount,
    smartSaveEnabled: user.smartSaveEnabled,
    todayIncome,
    normalIncome,
    lowIncomeStreak,
    availableBalance: availableCashFlow,
    minimumBalance: numberValue(user.minimumBalance),
    maxDailyAutoSave: user.maxDailyAutoSave ? numberValue(user.maxDailyAutoSave) : null,
  });

  // Determine final outcome
  const proposedFinal = safetyResult.safe ? safetyResult.adjustedAmount : 0;
  const finalDecision: "SAVE" | "PAUSE" | "REDUCE" =
    proposedFinal > 0
      ? proposedFinal < smartSaveResult.savedAmount
        ? "REDUCE"
        : "SAVE"
      : "PAUSE";

  // Check how much was already auto-saved today
  const now = new Date();
  const localStart = startOfDay(now);
  const utcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const todayStart = new Date(Math.min(localStart.getTime(), utcStart.getTime()));

  const todaySavings = await prisma.savingsLedger.findMany({
    where: {
      userId,
      type: "AUTO_SAVE",
      createdAt: { gte: todayStart },
    },
  });
  let alreadyAutoSavedToday = roundMoney(
    todaySavings.reduce((sum, s) => sum + numberValue(s.amount), 0)
  );

  let explanation = buildExplanation(todayIncome, normalIncome, proposedFinal, finalDecision, safetyResult);

  // If Smart Save is enabled and there is remaining surplus to save, autonomously execute the transfer!
  const remainingToSave = Math.max(0, roundMoney(proposedFinal - alreadyAutoSavedToday));
  if (user.smartSaveEnabled && remainingToSave > 0) {
    const { processAutoSave } = await import("../wallet/deposit.service.js");
    await processAutoSave(
      userId,
      remainingToSave,
      explanation || `Autonomous Smart Save: ₹${smartSaveResult.surplus} surplus detected`
    );
    alreadyAutoSavedToday = roundMoney(alreadyAutoSavedToday + remainingToSave);
  }

  const isAutoSaved = alreadyAutoSavedToday > 0;
  if (isAutoSaved) {
    explanation = `Today's income of ₹${roundMoney(todayIncome)} is above your normal baseline of ₹${roundMoney(normalIncome)} (surplus: ₹${smartSaveResult.surplus}). ₹${alreadyAutoSavedToday} was automatically saved into your virtual goals.`;
  }

  logger.info(LOG_CTX, `Decision for ${userId}: ${finalDecision} alreadySaved=₹${alreadyAutoSavedToday} remaining=₹${remainingToSave}`, {
    todayIncome,
    normalIncome,
    surplus: smartSaveResult.surplus,
  });

  return {
    smartSave: smartSaveResult,
    safety: safetyResult,
    finalAmount: remainingToSave,
    alreadySavedToday: alreadyAutoSavedToday,
    isAutoSaved,
    finalDecision,
    explanation,
  };
}

/**
 * Gets the user's savings configuration.
 */
export async function getSavingsConfig(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      smartSaveEnabled: true,
      maxDailyAutoSave: true,
      minimumBalance: true,
      savingPercentage: true,
    },
  });
  if (!user) throw ApiError.notFound("User not found");
  return {
    userId: user.id,
    smartSaveEnabled: user.smartSaveEnabled,
    maxDailyAutoSave: numberValue(user.maxDailyAutoSave),
    minimumBalance: numberValue(user.minimumBalance),
    savingPercentage: numberValue(user.savingPercentage),
  };
}

/**
 * Enables Smart Save for a user.
 */
export async function enableSmartSave(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { smartSaveEnabled: true },
    select: { id: true, smartSaveEnabled: true },
  });
}

/**
 * Pauses (disables) Smart Save for a user.
 */
export async function pauseSmartSave(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { smartSaveEnabled: false },
    select: { id: true, smartSaveEnabled: true },
  });
}

/**
 * Gets the savings history (SavingsLedger entries).
 */
export async function getSavingsHistory(userId: string) {
  const entries = await prisma.savingsLedger.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return entries.map((e) => ({
    id: e.id,
    amount: numberValue(e.amount),
    type: e.type,
    reason: e.reason,
    createdAt: e.createdAt,
  }));
}

function buildExplanation(
  todayIncome: number,
  normalIncome: number,
  finalAmount: number,
  decision: string,
  safety: SafetyCheck
): string {
  if (decision === "PAUSE") {
    return safety.reasons.join(". ") + ".";
  }

  const surplus = roundMoney(todayIncome - normalIncome);
  let text = `Today's income of ₹${roundMoney(todayIncome)} is above your normal of ₹${roundMoney(normalIncome)} (surplus: ₹${surplus}). `;

  if (decision === "REDUCE") {
    text += `Auto-save was reduced to ₹${roundMoney(finalAmount)}. ${safety.reasons.join(". ")}.`;
  } else {
    text += `₹${roundMoney(finalAmount)} has been auto-saved.`;
  }

  return text;
}
