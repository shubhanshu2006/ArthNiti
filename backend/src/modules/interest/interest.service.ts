import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { calculateDailyInterest } from "./interest.engine.js";
import { WALLET_TX_TYPES, INTEREST_DEFAULTS } from "../../config/constants.js";
import { daysBetween } from "../../utils/dates.js";
import { PrototypeInterestProvider } from "./interest.provider.js";

const LOG_CTX = "Interest.Service";
const interestProvider = new PrototypeInterestProvider(INTEREST_DEFAULTS.ANNUAL_RATE);

/**
 * Gets the interest account for a user's wallet.
 */
export async function getInterestAccount(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const account = await prisma.interestAccount.findUnique({
    where: { walletId: wallet.id },
  });

  if (!account) {
    // Create a default interest account if one doesn't exist
    const created = await prisma.interestAccount.create({
      data: {
        walletId: wallet.id,
        partnerName: INTEREST_DEFAULTS.PARTNER_NAME,
        productName: INTEREST_DEFAULTS.PRODUCT_NAME,
        annualRate: INTEREST_DEFAULTS.ANNUAL_RATE,
        rateType: INTEREST_DEFAULTS.RATE_TYPE,
        eligibleBalance: wallet.balance,
      },
    });
    return formatInterestAccount(created);
  }

  return formatInterestAccount(account);
}

/**
 * Calculates and credits interest for a user's wallet.
 * Uses daily simple interest: balance × annualRate × days / 365.
 * Creates an InterestEntry record and updates wallet balance atomically.
 */
export async function calculateAndCreditInterest(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const account = await prisma.interestAccount.findUnique({
    where: { walletId: wallet.id },
  });
  if (!account) throw ApiError.notFound("Interest account not found");

  const balance = numberValue(wallet.balance);
  if (balance <= 0) {
    return {
      amount: 0,
      interestAmount: 0,
      eligibleBalance: 0,
      message: "No eligible balance for interest calculation",
    };
  }

  const annualRate = await interestProvider.getApplicableRate(account.productName);
  const now = new Date();
  const lastCalculated = account.lastCalculatedAt;
  const days = !lastCalculated ? 1 : daysBetween(lastCalculated, now);

  if (days < 1) {
    return {
      amount: 0,
      interestAmount: 0,
      eligibleBalance: balance,
      message: "Interest already calculated for today",
    };
  }

  const interestAmount = await interestProvider.calculateInterest(balance, annualRate, { days });

  if (interestAmount <= 0) {
    return { amount: 0, interestAmount: 0, eligibleBalance: balance, message: "Calculated interest is zero" };
  }

  // Atomic transaction: create entry + update wallet + update account
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create interest entry
    const periodStart = lastCalculated ?? new Date(now.getTime() - days * 86400000);
    const entry = await tx.interestEntry.create({
      data: {
        walletId: wallet.id,
        amount: interestAmount,
        eligibleBalance: balance,
        rate: annualRate,
        periodStart,
        periodEnd: now,
        status: "CREDITED",
        source: account.productName,
      },
    });

    // 2. Update wallet balance and interest earned
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: interestAmount },
        interestEarned: { increment: interestAmount },
      },
    });

    await tx.savingsLedger.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: interestAmount,
        type: WALLET_TX_TYPES.INTEREST_CREDIT,
        reason: `Interest credited at ${(annualRate * 100).toFixed(2)}% for ${days} days`,
      },
    });

    // 3. Update interest account timestamps and eligible balance
    await tx.interestAccount.update({
      where: { id: account.id },
      data: {
        lastCalculatedAt: now,
        lastCreditedAt: now,
        eligibleBalance: updatedWallet.balance,
      },
    });

    // 4. Create wallet ledger entry
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WALLET_TX_TYPES.INTEREST_CREDIT,
        amount: interestAmount,
        reason: `Interest: ₹${roundMoney(balance)} × ${(annualRate * 100).toFixed(2)}% × ${days} days`,
        status: "COMPLETED",
      },
    });

    return {
      amount: roundMoney(interestAmount),
      interestAmount: roundMoney(interestAmount),
      eligibleBalance: roundMoney(balance),
      annualRate,
      days,
      periodStart,
      periodEnd: now,
      newWalletBalance: numberValue(updatedWallet.balance),
      totalInterestEarned: numberValue(updatedWallet.interestEarned),
    };
  });

  logger.info(LOG_CTX, `Interest credited: ₹${result.interestAmount} for user ${userId} (${days} days)`);
  return result;
}

/**
 * Gets the interest history for a user's wallet.
 */
export async function getInterestHistory(userId: string, limit = 50) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const entries = await prisma.interestEntry.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return entries.map((e) => ({
    id: e.id,
    amount: numberValue(e.amount),
    eligibleBalance: numberValue(e.eligibleBalance),
    rate: numberValue(e.rate),
    periodStart: e.periodStart,
    periodEnd: e.periodEnd,
    status: e.status,
    source: e.source,
    createdAt: e.createdAt,
  }));
}

function formatInterestAccount(account: any) {
  return {
    id: account.id,
    walletId: account.walletId,
    partnerName: account.partnerName,
    productName: account.productName,
    annualRate: numberValue(account.annualRate),
    rateType: account.rateType,
    eligibleBalance: numberValue(account.eligibleBalance),
    lastCalculatedAt: account.lastCalculatedAt,
    lastCreditedAt: account.lastCreditedAt,
  };
}
