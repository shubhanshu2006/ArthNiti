const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { wallet: { create: {} } } });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
