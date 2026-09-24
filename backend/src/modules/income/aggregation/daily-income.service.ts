import { prisma } from "../../../db/client.js";
import { numberValue } from "../../../utils/money.js";
import { startOfDay, endOfDay } from "../../../utils/dates.js";

/**
 * Calculates aggregated daily income totals for a user within a date range.
 * Combines both AA (online) and manual (offline) income into one daily view.
 */
export async function getDailyIncome(userId: string, from: Date, to: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      isIncome: true,
      date: { gte: startOfDay(from), lte: endOfDay(to) },
    },
    orderBy: { date: "asc" },
    select: {
      amount: true,
      date: true,
      incomeMode: true,
      sourceType: true,
      sourcePlatform: true,
      description: true,
    },
  });

  // Aggregate by day
  const byDay = new Map<string, { online: number; offline: number; total: number; transactions: number }>();

  for (const tx of transactions) {
    const day = tx.date.toISOString().slice(0, 10);
    const entry = byDay.get(day) ?? { online: 0, offline: 0, total: 0, transactions: 0 };
    const amount = numberValue(tx.amount);

    if (tx.incomeMode === "ONLINE") {
      entry.online += amount;
    } else {
      entry.offline += amount;
    }
    entry.total += amount;
    entry.transactions += 1;

    byDay.set(day, entry);
  }

  return Array.from(byDay.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));
}

/**
 * Gets today's total income for a user (combines online + offline).
 */
export async function getTodayIncome(userId: string) {
  const today = new Date();
  const localStart = startOfDay(today);
  const localEnd = endOfDay(today);
  const utcStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0));
  const utcEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999));
  const minStart = new Date(Math.min(localStart.getTime(), utcStart.getTime()));
  const maxEnd = new Date(Math.max(localEnd.getTime(), utcEnd.getTime()));

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      isIncome: true,
      date: { gte: minStart, lte: maxEnd },
    },
  });

  let online = 0;
  let offline = 0;

  for (const tx of transactions) {
    const amount = numberValue(tx.amount);
    if (tx.incomeMode === "ONLINE") {
      online += amount;
    } else {
      offline += amount;
    }
  }

  return {
    date: today.toISOString().slice(0, 10),
    online,
    offline,
    total: online + offline,
  };
}
