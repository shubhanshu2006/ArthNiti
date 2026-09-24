import { prisma } from "../src/db/client.js";
import { getTodayIncome } from "../src/modules/income/aggregation/daily-income.service.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  const todayIncome = await getTodayIncome(user!.id);
  console.log("getTodayIncome result:", todayIncome);
  const { getIncomeSummary } = await import("../src/modules/income/income.service.js");
  const { daysAgo } = await import("../src/utils/dates.js");
  const summary = await getIncomeSummary(user!.id, daysAgo(30));
  console.log("summary.daily:", summary.daily);
  process.exit(0);
}

main().catch(console.error);
