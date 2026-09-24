import { prisma } from "../src/db/client.js";
import { computeSavingsDecision } from "../src/modules/savings/savings.service.js";

async function main() {
  const email = process.argv[2] || "arjun.mehta@demo.com";
  const user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: { include: { goals: true, ledger: { take: 5 } } } },
  });
  if (!user) {
    console.log("User not found:", email);
    process.exit(1);
  }

  console.log("User Info:", {
    id: user.id,
    name: user.name,
    email: user.email,
    smartSaveEnabled: user.smartSaveEnabled,
    walletBalance: user.wallet?.balance,
    goals: user.wallet?.goals.map(g => ({ name: g.name, balance: g.allocatedBalance })),
  });

  const txs = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 10,
  });
  console.log("Latest Transactions:", txs.map(t => ({ date: t.date.toISOString(), amount: t.amount, desc: t.description })));

  const { getIncomeSummary } = await import("../src/modules/income/income.service.js");
  const { daysAgo } = await import("../src/utils/dates.js");
  const summary = await getIncomeSummary(user.id, daysAgo(30));
  console.log("Summary Daily Array:", summary.daily);

  const { calculateAndCreditInterest } = await import("../src/modules/interest/interest.service.js");
  const interestRes = await calculateAndCreditInterest(user.id);
  console.log("Interest calculation result:", interestRes);

  const { generateRecommendation } = await import("../src/modules/recommendations/recommendation.service.js");
  const rec = await generateRecommendation(user.id);
  console.log("New Recommendation Explanation:", rec.explanation);

  process.exit(0);
}

main().catch(console.error);
