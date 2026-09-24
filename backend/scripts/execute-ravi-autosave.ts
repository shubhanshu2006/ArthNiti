import { prisma } from "../src/db/client.js";
import { computeSavingsDecision } from "../src/modules/savings/savings.service.js";
import { processAutoSave } from "../src/modules/wallet/deposit.service.js";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "ravi.kumar@demo.com" } });
  if (!user) throw new Error("Ravi not found");

  console.log("User smartSaveEnabled:", user.smartSaveEnabled);
  const decision = await computeSavingsDecision(user.id);
  console.log("Savings Decision:", decision);

  if (decision.finalAmount > 0) {
    const res = await processAutoSave(
      user.id,
      decision.finalAmount,
      decision.explanation || "Autonomous Smart Save: ₹143 surplus detected"
    );
    console.log("Auto-save executed successfully:", res);
  } else {
    console.log("No savings amount to execute:", decision.finalAmount);
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
    include: { goals: true },
  });
  console.log("Updated Wallet & Goals:", JSON.stringify(wallet, null, 2));

  process.exit(0);
}

main().catch(console.error);
