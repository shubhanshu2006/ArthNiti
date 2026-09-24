import { prisma } from "../src/db/client.js";
import { getDailyIncome } from "../src/modules/income/aggregation/daily-income.service.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  const from = new Date(Date.now() - 30 * 86400000);
  const to = new Date();
  const daily = await getDailyIncome(user!.id, from, to);
  console.log("Daily income entries count:", daily.length);
  console.log("Last 5 daily entries:", daily.slice(-5));
  process.exit(0);
}

main().catch(console.error);
