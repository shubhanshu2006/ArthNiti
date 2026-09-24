import { prisma } from "../../db/client.js";
import { classifyIncome } from "./classification/income-classifier.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { endOfDay } from "../../utils/dates.js";

export async function getIncomeSummary(userId: string, from?: Date, to?: Date) {
  const targetTo = to ?? new Date();
  const maxEnd = endOfDay(targetTo);
  const transactions = await prisma.transaction.findMany({
    where: { userId, isIncome: true, date: { gte: from, lte: maxEnd } },
    orderBy: { date: "asc" },
  });
  const online = transactions.filter((item) => item.incomeMode === "ONLINE").reduce((sum, item) => sum + numberValue(item.amount), 0);
  const offline = transactions.filter((item) => item.incomeMode === "OFFLINE").reduce((sum, item) => sum + numberValue(item.amount), 0);
  const txByDay = new Map<string, number>();
  for (const item of transactions) {
    const day = item.date.toISOString().slice(0, 10);
    txByDay.set(day, (txByDay.get(day) ?? 0) + numberValue(item.amount));
  }

  const byDay = new Map<string, number>();
  if (from) {
    const cursor = new Date(from);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(targetTo);
    end.setHours(0, 0, 0, 0);
    while (cursor <= end) {
      const day = cursor.toISOString().slice(0, 10);
      byDay.set(day, txByDay.get(day) ?? 0);
      cursor.setDate(cursor.getDate() + 1);
    }
    // Include any transaction day that may have been recorded today in local TZ
    for (const [day, amt] of txByDay.entries()) {
      if (!byDay.has(day)) {
        byDay.set(day, amt);
      }
    }
  } else {
    const sortedKeys = [...txByDay.keys()].sort();
    for (const k of sortedKeys) {
      byDay.set(k, txByDay.get(k)!);
    }
  }

  const daily = [...byDay.values()];
  const earningDays = daily.filter((value) => value > 0);
  const average = earningDays.length ? earningDays.reduce((sum, value) => sum + value, 0) / earningDays.length : 0;
  const variance = earningDays.length ? earningDays.reduce((sum, value) => sum + (value - average) ** 2, 0) / earningDays.length : 0;
  const sorted = [...earningDays].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const standardDeviation = Math.sqrt(variance);

  return {
    transactions,
    daily,
    total: roundMoney(online + offline),
    online: roundMoney(online),
    offline: roundMoney(offline),
    average: roundMoney(average),
    median: roundMoney(median),
    variance: roundMoney(variance),
    standardDeviation: roundMoney(standardDeviation),
    volatilityClass: standardDeviation > average * 0.75 ? "high" : standardDeviation > average * 0.35 ? "medium" : "low",
    goodDayThreshold: roundMoney(average + standardDeviation),
    lowDayThreshold: roundMoney(Math.max(0, average - standardDeviation)),
    drySpellFrequency: daily.length ? roundMoney(daily.filter((value) => value === 0).length / daily.length) : 0,
    earningFrequency: daily.length ? roundMoney(earningDays.length / daily.length) : 0,
  };
}

export async function createManualIncome(input: { userId: string; amount: number; date: Date; description?: string; category?: string }) {
  const tx = await prisma.transaction.create({
    data: {
      userId: input.userId,
      amount: input.amount,
      date: input.date,
      type: "CREDIT",
      description: input.description ?? "Manual offline income",
      category: input.category,
      sourceType: "MANUAL",
      incomeMode: "OFFLINE",
      isIncome: true,
      classificationConfidence: 1,
      classificationReason: "Explicitly entered by user as offline income",
    },
  });

  // Autonomous Smart Save: If enabled, automatically allocate surplus into virtual goals
  try {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (user?.smartSaveEnabled) {
      const { computeSavingsDecision } = await import("../savings/savings.service.js");
      const { processAutoSave } = await import("../wallet/deposit.service.js");
      const decision = await computeSavingsDecision(input.userId);
      if (decision.finalAmount > 0) {
        await processAutoSave(
          input.userId,
          decision.finalAmount,
          decision.explanation || "Autonomous Smart Save from surplus"
        );
      }
    }
  } catch (err) {
    // Non-blocking: log and continue
    console.error("Auto-save on income log error:", err);
  }

  return tx;
}

export async function classifyTransaction(id: string) {
  const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id } });
  const result = classifyIncome({ ...transaction, amount: numberValue(transaction.amount) });
  return prisma.transaction.update({ where: { id }, data: result });
}
