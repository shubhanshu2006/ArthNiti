import { prisma } from "../../db/client.js";
import { classifyIncome } from "./classification/income-classifier.js";
import { numberValue, roundMoney } from "../../utils/money.js";

export async function getIncomeSummary(userId: string, from?: Date, to = new Date()) {
  const transactions = await prisma.transaction.findMany({
    where: { userId, isIncome: true, date: { gte: from, lte: to } },
    orderBy: { date: "asc" },
  });
  const online = transactions.filter((item) => item.incomeMode === "ONLINE").reduce((sum, item) => sum + numberValue(item.amount), 0);
  const offline = transactions.filter((item) => item.incomeMode === "OFFLINE").reduce((sum, item) => sum + numberValue(item.amount), 0);
  const byDay = new Map<string, number>();
  for (const item of transactions) {
    const day = item.date.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + numberValue(item.amount));
  }

  if (from) {
    const cursor = new Date(from);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(0, 0, 0, 0);
    while (cursor <= end) {
      const day = cursor.toISOString().slice(0, 10);
      if (!byDay.has(day)) byDay.set(day, 0);
      cursor.setDate(cursor.getDate() + 1);
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
  return prisma.transaction.create({
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
}

export async function classifyTransaction(id: string) {
  const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id } });
  const result = classifyIncome({ ...transaction, amount: numberValue(transaction.amount) });
  return prisma.transaction.update({ where: { id }, data: result });
}
