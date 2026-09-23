import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { logger } from "../../utils/logger.js";
import { classifyIncome } from "../income/classification/income-classifier.js";
import type { AccountAggregatorProvider, AATransaction } from "./aa.adapter.js";
import { createAAProvider } from "./aa.provider.js";

const LOG_CTX = "AA.Service";

// Use mock provider for prototype; swap for real adapter in production
const aaProvider: AccountAggregatorProvider = createAAProvider();

/**
 * Creates an AA consent for a user.
 */
export async function createConsent(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User not found");

  const consent = await aaProvider.createConsent(userId);

  const saved = await prisma.aAConsent.create({
    data: {
      userId,
      provider: "MOCK",
      consentId: consent.consentId,
      status: consent.status,
      purpose: consent.purpose,
      expiresAt: consent.expiresAt,
    },
  });

  logger.info(LOG_CTX, `Consent created for user ${userId}: ${saved.consentId}`);
  return saved;
}

/**
 * Gets the current AA consent status for a user.
 */
export async function getConsentStatus(userId: string) {
  const consent = await prisma.aAConsent.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!consent) throw ApiError.notFound("No active consent found for user");

  return consent;
}

/**
 * Syncs financial data from the AA provider for a user.
 * Normalizes transactions, classifies income, and writes to the unified income ledger.
 * Uses idempotent upserts (externalId) to prevent duplicates on re-sync.
 */
export async function syncFinancialData(userId: string) {
  const consent = await prisma.aAConsent.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!consent) throw ApiError.badRequest("No active consent. Create consent first.");

  // Fetch data from AA provider
  const financialData = await aaProvider.fetchFinancialData(consent.consentId, userId);
  logger.info(LOG_CTX, `Fetched ${financialData.transactions.length} transactions for user ${userId}`);

  const result = await prisma.$transaction(async (tx) => {
    let account = await tx.financialAccount.findFirst({ where: { userId, aaConsentId: consent.id } });
    if (!account && financialData.accounts.length > 0) {
      const aaAccount = financialData.accounts[0];
      account = await tx.financialAccount.create({
        data: {
          userId,
          aaConsentId: consent.id,
          institutionName: aaAccount.institutionName,
          accountType: aaAccount.accountType,
          maskedAccountNumber: aaAccount.maskedAccountNumber,
          currency: "INR",
          status: "ACTIVE",
          lastSyncedAt: new Date(),
        },
      });
    }

    let synced = 0;
    let skipped = 0;
    for (const aaTx of financialData.transactions) {
      if (aaTx.amount <= 0) continue;
      const existing = await tx.transaction.findUnique({ where: { userId_externalId: { userId, externalId: aaTx.externalId } }, select: { id: true } });
      if (existing) {
        skipped++;
        continue;
      }
      const classification = classifyIncome({ description: aaTx.description, merchant: aaTx.merchant, type: aaTx.type, amount: aaTx.amount, sourcePlatform: aaTx.sourcePlatform });
      await tx.transaction.create({
        data: {
          userId,
          accountId: account?.id ?? null,
          externalId: aaTx.externalId,
          amount: aaTx.amount,
          date: aaTx.date,
          type: aaTx.type,
          description: aaTx.description,
          merchant: aaTx.merchant ?? null,
          sourcePlatform: aaTx.sourcePlatform ?? null,
          category: aaTx.category ?? null,
          sourceType: "AA",
          incomeMode: "ONLINE",
          isIncome: aaTx.type === "CREDIT" ? classification.isIncome : false,
          classificationConfidence: classification.confidence,
          classificationReason: classification.reason,
        },
      });
      synced++;
    }
    if (account) await tx.financialAccount.update({ where: { id: account.id }, data: { lastSyncedAt: new Date() } });
    return { synced, skipped, accountId: account?.id };
  });

  logger.info(LOG_CTX, `Sync complete: ${result.synced} new, ${result.skipped} skipped (duplicates)`);

  return {
    synced: result.synced,
    skipped: result.skipped,
    total: financialData.transactions.length,
    accountId: result.accountId,
  };
}

/**
 * Revokes the active AA consent for a user.
 */
export async function revokeConsent(consentId: string, userId: string) {
  const consent = await prisma.aAConsent.findUnique({ where: { id: consentId } });
  if (!consent) throw ApiError.notFound("Consent not found");
  if (consent.userId !== userId) throw ApiError.forbidden("Not your AA consent");

  await aaProvider.revokeConsent(consent.consentId);

  const updated = await prisma.aAConsent.update({
    where: { id: consentId },
    data: { status: "REVOKED" },
  });

  logger.info(LOG_CTX, `Consent revoked: ${consentId}`);
  return updated;
}
