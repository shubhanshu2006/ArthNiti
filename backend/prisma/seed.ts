import { classifyIncome } from "../src/modules/income/classification/income-classifier.js";
import { prisma } from "../src/db/client.js";

const DEFAULT_GOALS = [
  { type: "EMERGENCY", name: "Emergency Fund", targetAmount: 15000, allocationPercentage: 50, priority: 1 },
  { type: "MEDICAL", name: "Medical Fund", targetAmount: 10000, allocationPercentage: 30, priority: 2 },
  { type: "GROWTH", name: "Growth Fund", targetAmount: 50000, allocationPercentage: 20, priority: 3 },
];

const ANNUAL_RATE = 0.065;
const PARTNER_NAME = "Prototype Partner";
const PRODUCT_NAME = "Smart Savings";

interface PersonaConfig {
  name: string;
  email: string;
  persona: string;
  riskProfile: string;
  savingPercentage: number;
  maxDailyAutoSave: number;
  transactions: Array<{
    externalId: string;
    amount: number;
    daysAgo: number;
    type: string;
    description: string;
    merchant?: string;
    sourcePlatform?: string;
    sourceType: "AA" | "MANUAL";
    incomeMode: "ONLINE" | "OFFLINE";
  }>;
}

const personas: PersonaConfig[] = [
  {
    name: "Ravi Kumar",
    email: "ravi.kumar@demo.com",
    persona: "delivery_rider",
    riskProfile: "conservative",
    savingPercentage: 0.15,
    maxDailyAutoSave: 200,
    transactions: [
      { externalId: "dr-s-001", amount: 850, daysAgo: 29, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-002", amount: 920, daysAgo: 28, type: "CREDIT", description: "Zomato delivery earnings", merchant: "Zomato", sourcePlatform: "ZOMATO", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-003", amount: 780, daysAgo: 27, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-004", amount: 950, daysAgo: 26, type: "CREDIT", description: "Swiggy weekend bonus", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-005", amount: 0, daysAgo: 25, type: "CREDIT", description: "Rest day", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-006", amount: 900, daysAgo: 24, type: "CREDIT", description: "Zomato delivery earnings", merchant: "Zomato", sourcePlatform: "ZOMATO", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-007", amount: 870, daysAgo: 23, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-008", amount: 1450, daysAgo: 22, type: "CREDIT", description: "Weekend delivery surge", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-009", amount: 860, daysAgo: 21, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-010", amount: 730, daysAgo: 20, type: "CREDIT", description: "Zomato delivery earnings", merchant: "Zomato", sourcePlatform: "ZOMATO", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-011", amount: 910, daysAgo: 19, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-012", amount: 300, daysAgo: 18, type: "CREDIT", description: "Cash delivery tip", merchant: "Cash", sourcePlatform: "CASH", sourceType: "MANUAL", incomeMode: "OFFLINE" },
      { externalId: "dr-s-013", amount: 880, daysAgo: 17, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-014", amount: 940, daysAgo: 16, type: "CREDIT", description: "Zomato delivery earnings", merchant: "Zomato", sourcePlatform: "ZOMATO", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-015", amount: 200, daysAgo: 15, type: "CREDIT", description: "Cash errand payment", merchant: "Cash", sourcePlatform: "CASH", sourceType: "MANUAL", incomeMode: "OFFLINE" },
      { externalId: "dr-s-016", amount: 820, daysAgo: 14, type: "CREDIT", description: "Swiggy earnings payout", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-017", amount: 970, daysAgo: 13, type: "CREDIT", description: "Weekend surge earnings", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-018", amount: 1200, daysAgo: 12, type: "CREDIT", description: "Swiggy festival bonus", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-019", amount: 890, daysAgo: 11, type: "CREDIT", description: "Zomato delivery earnings", merchant: "Zomato", sourcePlatform: "ZOMATO", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "dr-s-020", amount: 1600, daysAgo: 0, type: "CREDIT", description: "Swiggy weekend surge", merchant: "Swiggy", sourcePlatform: "SWIGGY", sourceType: "AA", incomeMode: "ONLINE" },
    ],
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@demo.com",
    persona: "rideshare_driver",
    riskProfile: "moderate",
    savingPercentage: 0.18,
    maxDailyAutoSave: 350,
    transactions: [
      { externalId: "rd-s-001", amount: 1400, daysAgo: 29, type: "CREDIT", description: "Uber driver earnings", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-002", amount: 1550, daysAgo: 28, type: "CREDIT", description: "Ola driver payout", merchant: "Ola", sourcePlatform: "OLA", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-003", amount: 1600, daysAgo: 27, type: "CREDIT", description: "Uber driver earnings", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-004", amount: 0, daysAgo: 26, type: "CREDIT", description: "Off day", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-005", amount: 1450, daysAgo: 25, type: "CREDIT", description: "Ola driver payout", merchant: "Ola", sourcePlatform: "OLA", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-006", amount: 1700, daysAgo: 24, type: "CREDIT", description: "Uber weekend earnings", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-007", amount: 1350, daysAgo: 23, type: "CREDIT", description: "Uber driver earnings", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-008", amount: 500, daysAgo: 22, type: "CREDIT", description: "Private car hire", merchant: "Cash", sourcePlatform: "CASH", sourceType: "MANUAL", incomeMode: "OFFLINE" },
      { externalId: "rd-s-009", amount: 1480, daysAgo: 21, type: "CREDIT", description: "Ola driver payout", merchant: "Ola", sourcePlatform: "OLA", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-010", amount: 1620, daysAgo: 20, type: "CREDIT", description: "Uber driver earnings", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-011", amount: 0, daysAgo: 19, type: "CREDIT", description: "Off day", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-012", amount: 1530, daysAgo: 18, type: "CREDIT", description: "Ola surge earnings", merchant: "Ola", sourcePlatform: "OLA", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-013", amount: 1800, daysAgo: 17, type: "CREDIT", description: "Uber weekend surge", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "rd-s-014", amount: 1700, daysAgo: 0, type: "CREDIT", description: "Uber driver earnings", merchant: "Uber", sourcePlatform: "UBER", sourceType: "AA", incomeMode: "ONLINE" },
    ],
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@demo.com",
    persona: "freelancer",
    riskProfile: "aggressive",
    savingPercentage: 0.2,
    maxDailyAutoSave: 1000,
    transactions: [
      { externalId: "fl-s-001", amount: 0, daysAgo: 29, type: "CREDIT", description: "No income", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-002", amount: 2500, daysAgo: 27, type: "CREDIT", description: "Client payment - web project", merchant: "Razorpay", sourcePlatform: "FREELANCE", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-003", amount: 0, daysAgo: 25, type: "CREDIT", description: "No income", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-004", amount: 4000, daysAgo: 23, type: "CREDIT", description: "Design contract milestone", merchant: "Razorpay", sourcePlatform: "FREELANCE", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-005", amount: 1500, daysAgo: 21, type: "CREDIT", description: "Upwork hourly payment", merchant: "Upwork", sourcePlatform: "UPWORK", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-006", amount: 0, daysAgo: 19, type: "CREDIT", description: "No income", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-007", amount: 800, daysAgo: 17, type: "CREDIT", description: "Cash consulting session", merchant: "Cash", sourcePlatform: "CASH", sourceType: "MANUAL", incomeMode: "OFFLINE" },
      { externalId: "fl-s-008", amount: 6000, daysAgo: 14, type: "CREDIT", description: "Full stack project delivery", merchant: "Razorpay", sourcePlatform: "FREELANCE", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-009", amount: 0, daysAgo: 12, type: "CREDIT", description: "No income", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-010", amount: 3500, daysAgo: 10, type: "CREDIT", description: "React app milestone payment", merchant: "Razorpay", sourcePlatform: "FREELANCE", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-011", amount: 1200, daysAgo: 8, type: "CREDIT", description: "Upwork contract payment", merchant: "Upwork", sourcePlatform: "UPWORK", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-012", amount: 500, daysAgo: 6, type: "CREDIT", description: "Cash logo design", merchant: "Cash", sourcePlatform: "CASH", sourceType: "MANUAL", incomeMode: "OFFLINE" },
      { externalId: "fl-s-013", amount: 0, daysAgo: 4, type: "CREDIT", description: "No income", merchant: "", sourcePlatform: "", sourceType: "AA", incomeMode: "ONLINE" },
      { externalId: "fl-s-014", amount: 6000, daysAgo: 0, type: "CREDIT", description: "Full stack project delivery", merchant: "Razorpay", sourcePlatform: "FREELANCE", sourceType: "AA", incomeMode: "ONLINE" },
    ],
  },
];

async function seedTaxRuleSet() {
  const existing = await prisma.taxRuleSet.findFirst({ where: { name: { contains: "FY 2024-25" } } });
  if (existing) return existing;
  return prisma.taxRuleSet.create({
    data: {
      name: "India New Tax Regime FY 2024-25 (Prototype)",
      effectiveFrom: new Date("2024-04-01"),
      effectiveTo: new Date("2025-03-31"),
      assumptions: {
        regime: "new",
        deductions: false,
        incomeTreatment: "gig-business-income",
        disclaimer: "Planning estimate only.",
      },
    },
  });
}

async function seedPersona(config: PersonaConfig) {
  const existing = await prisma.user.findUnique({ where: { email: config.email } });
  if (existing) {
    console.log(`Skipping ${config.name} (already seeded)`);
    return existing;
  }

  console.log(`Seeding ${config.name}...`);

  const user = await prisma.user.create({
    data: {
      name: config.name,
      email: config.email,
      persona: config.persona,
      riskProfile: config.riskProfile,
      savingPercentage: config.savingPercentage,
      maxDailyAutoSave: config.maxDailyAutoSave,
      minimumBalance: 200,
      smartSaveEnabled: true,
      wallet: {
        create: {
          balance: 0,
          interestEarned: 0,
          interestAccount: {
            create: {
              partnerName: PARTNER_NAME,
              productName: PRODUCT_NAME,
              annualRate: ANNUAL_RATE,
              rateType: "FIXED",
              eligibleBalance: 0,
            },
          },
        },
      },
    },
    include: { wallet: true },
  });

  const consent = await prisma.aAConsent.create({
    data: {
      userId: user.id,
      provider: "MOCK",
      consentId: `mock-consent-${user.id}`,
      status: "ACTIVE",
      purpose: "Income verification",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
  });

  const account = await prisma.financialAccount.create({
    data: {
      userId: user.id,
      aaConsentId: consent.id,
      institutionName: "Mock Bank",
      accountType: "SAVINGS",
      currency: "INR",
      status: "ACTIVE",
      lastSyncedAt: new Date(),
    },
  });

  for (const tx of config.transactions) {
    if (tx.amount === 0) continue;

    const classification = classifyIncome({
      description: tx.description,
      merchant: tx.merchant,
      type: tx.type,
      amount: tx.amount,
      sourcePlatform: tx.sourcePlatform,
    });

    const txDate = new Date(Date.now() - tx.daysAgo * 86400000);
    txDate.setHours(12, 0, 0, 0);

    await prisma.transaction.upsert({
      where: { userId_externalId: { userId: user.id, externalId: tx.externalId } },
      create: {
        userId: user.id,
        accountId: tx.sourceType === "AA" ? account.id : null,
        externalId: tx.externalId,
        amount: tx.amount,
        date: txDate,
        type: tx.type,
        description: tx.description,
        merchant: tx.merchant || null,
        sourcePlatform: tx.sourcePlatform || null,
        sourceType: tx.sourceType,
        incomeMode: tx.incomeMode,
        isIncome: tx.type === "CREDIT" ? classification.isIncome : false,
        classificationConfidence: classification.confidence,
        classificationReason: classification.reason,
      },
      update: {},
    });
  }

  const goals = await Promise.all(
    DEFAULT_GOALS.map((g) =>
      prisma.goal.create({
        data: {
          userId: user.id,
          walletId: user.wallet!.id,
          type: g.type,
          name: g.name,
          targetAmount: g.targetAmount,
          allocationPercentage: g.allocationPercentage,
          priority: g.priority,
          status: "ACTIVE",
        },
      })
    )
  );

  console.log(`  Created ${user.name}: ${config.transactions.filter((t) => t.amount > 0).length} transactions, ${goals.length} goals`);
  return user;
}

async function main() {
  console.log("Starting seed...");

  await seedTaxRuleSet();

  for (const persona of personas) {
    await seedPersona(persona);
  }

  const userCount = await prisma.user.count();
  const txCount = await prisma.transaction.count();
  console.log(`Seed complete: ${userCount} users, ${txCount} transactions`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
