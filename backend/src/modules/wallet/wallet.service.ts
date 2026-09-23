import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { WALLET_TX_TYPES } from "../../config/constants.js";

const LOG_CTX = "Wallet.Service";

/**
 * Gets or creates a wallet for a user.
 */
export async function getWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      goals: { where: { status: "ACTIVE" }, orderBy: { priority: "asc" } },
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, balance: 0, interestEarned: 0 },
      include: {
        goals: { where: { status: "ACTIVE" }, orderBy: { priority: "asc" } },
      },
    });
  }

  return {
    id: wallet.id,
    userId: wallet.userId,
    balance: numberValue(wallet.balance),
    interestEarned: numberValue(wallet.interestEarned),
    goals: wallet.goals.map((g) => ({
      id: g.id,
      type: g.type,
      name: g.name,
      targetAmount: numberValue(g.targetAmount),
      allocatedBalance: numberValue(g.allocatedBalance),
      allocationPercentage: numberValue(g.allocationPercentage),
      priority: g.priority,
      status: g.status,
    })),
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt,
  };
}

/**
 * Gets the wallet ledger (all transaction history).
 */
export async function getWalletLedger(userId: string, limit = 50) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const entries = await prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return entries.map((e) => ({
    id: e.id,
    type: e.type,
    amount: numberValue(e.amount),
    reason: e.reason,
    status: e.status,
    createdAt: e.createdAt,
  }));
}
