import { prisma } from "../src/db/client.js";

async function main() {
  const tx = await prisma.transaction.findUnique({
    where: { id: "cmuegnvdn000h7ov2x4q6peoe" },
    include: { user: true },
  });
  console.log("Transaction owner:", tx?.user?.name, tx?.user?.email);
  process.exit(0);
}

main().catch(console.error);
