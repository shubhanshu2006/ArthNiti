import { prisma } from "../src/db/client.js";
import { startOfDay, endOfDay } from "../src/utils/dates.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  const now = new Date();

  // UTC boundaries
  const utcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const utcEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  // Local boundaries
  const localStart = startOfDay(now);
  const localEnd = endOfDay(now);

  const txs = await prisma.transaction.findMany({
    where: {
      userId: user!.id,
      isIncome: true,
      OR: [
        { date: { gte: utcStart, lte: utcEnd } },
        { date: { gte: localStart, lte: localEnd } },
      ],
    },
  });

  console.log("Matched transactions for TODAY:", txs.length);
  for (const t of txs) {
    console.log(`- Amount: ${t.amount}, Mode: ${t.incomeMode}, Date: ${t.date.toISOString()}`);
  }
  process.exit(0);
}

main().catch(console.error);
