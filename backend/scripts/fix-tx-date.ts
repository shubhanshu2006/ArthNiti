import { prisma } from "../src/db/client.js";

async function main() {
  const updated = await prisma.transaction.update({
    where: { id: "cmuegnvdn000h7ov2x4q6peoe" },
    data: { date: new Date() },
  });
  console.log("Updated transaction date to current timestamp:", updated.date);
  process.exit(0);
}

main().catch(console.error);
