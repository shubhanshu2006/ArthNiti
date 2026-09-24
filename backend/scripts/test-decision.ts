import { prisma } from "../src/db/client.js";
import { computeSavingsDecision } from "../src/modules/savings/savings.service.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  const decision = await computeSavingsDecision(user!.id);
  console.log("Decision result:", JSON.stringify(decision, null, 2));
  process.exit(0);
}

main().catch(console.error);
