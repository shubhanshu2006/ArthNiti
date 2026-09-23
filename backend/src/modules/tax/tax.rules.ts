import { prisma } from "../../db/client.js";

export async function getActiveTaxRuleSet() {
  const now = new Date();
  const active = await prisma.taxRuleSet.findFirst({
    where: {
      effectiveFrom: { lte: now },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
    },
    orderBy: { effectiveFrom: "desc" },
  });
  if (active) return active;

  const fiscalYear = now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
  return prisma.taxRuleSet.create({
    data: {
      name: `India New Tax Regime FY ${fiscalYear - 1}-${String(fiscalYear).slice(-2)} (Prototype)`,
      effectiveFrom: new Date(`${fiscalYear - 1}-04-01`),
      effectiveTo: new Date(`${fiscalYear}-03-31`),
      assumptions: {
        regime: "new",
        deductions: false,
        incomeTreatment: "gig-business-income",
        disclaimer: "Planning estimate only.",
      },
    },
  });
}
