import { prisma } from "../src/db/client.js";

async function main() {
  const txs = await prisma.transaction.findMany({
    where: { isIncome: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      amount: true,
      date: true,
      createdAt: true,
      incomeMode: true,
      sourceType: true,
      description: true,
    },
  });
  console.log("Recent Transactions:", JSON.stringify(txs, null, 2));
  process.exit(0);
}

main().catch(console.error);
