import { prisma } from "../src/db/client.js";
import { startOfDay, endOfDay } from "../src/utils/dates.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  const now = new Date();
  const localStart = startOfDay(now);
  const localEnd = endOfDay(now);
  const utcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const utcEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  const minStart = new Date(Math.min(localStart.getTime(), utcStart.getTime()));
  const maxEnd = new Date(Math.max(localEnd.getTime(), utcEnd.getTime()));

  console.log("localStart:", localStart.toISOString());
  console.log("utcStart:", utcStart.toISOString());
  console.log("minStart:", minStart.toISOString(), "maxEnd:", maxEnd.toISOString());

  const txs = await prisma.transaction.findMany({
    where: {
      userId: user!.id,
      isIncome: true,
      OR: [
        { date: { gte: minStart, lte: maxEnd } },
        { createdAt: { gte: minStart, lte: maxEnd } },
      ],
    },
  });

  console.log("Found transactions:", txs.length);
  for (const t of txs) {
    console.log(`- Amount: ${t.amount}, Mode: ${t.incomeMode}, Date: ${t.date.toISOString()}, CreatedAt: ${t.createdAt.toISOString()}`);
  }
  process.exit(0);
}

main().catch(console.error);
