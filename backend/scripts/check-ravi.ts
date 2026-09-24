import { prisma } from "../src/db/client.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  const txs = await prisma.transaction.findMany({
    where: { userId: user!.id, isIncome: true },
    orderBy: { date: "desc" },
    take: 5,
    select: { id: true, amount: true, date: true, createdAt: true, incomeMode: true, description: true },
  });
  console.log("Ravi's latest transactions:", txs);
  const wallet = await prisma.wallet.findUnique({
    where: { userId: user!.id },
    include: { goals: true, ledger: { take: 5, orderBy: { createdAt: "desc" } } },
  });
  console.log("Wallet:", wallet);
  const savings = await prisma.savingsLedger.findMany({
    where: { userId: user!.id },
    take: 5,
    orderBy: { createdAt: "desc" },
  });
  console.log("Savings Ledgers:", savings);
  process.exit(0);
}

main().catch(console.error);
