import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { WALLET_TX_TYPES } from "../../config/constants.js";

const LOG_CTX = "Withdrawal.Service";

/**
 * Processes a withdrawal from the wallet, optionally from a specific goal.
 * All operations happen in a single PostgreSQL transaction for consistency.
 *
 * If goalId is provided, deducts from that goal's allocatedBalance first.
 * Always deducts from the wallet's total balance.
 */
export async function processWithdrawal(input: {
  userId: string;
  amount: number;
  goalId?: string;
  reason?: string;
}) {
  const { userId, amount, goalId, reason } = input;

  if (amount <= 0) throw ApiError.badRequest("Withdrawal amount must be positive");

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { goals: { where: { status: "ACTIVE" } } },
  });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const walletBalance = numberValue(wallet.balance);
  if (amount > walletBalance) {
    throw ApiError.badRequest(
      `Insufficient balance. Available: ₹${roundMoney(walletBalance)}, requested: ₹${roundMoney(amount)}`
    );
  }

  // If withdrawing from a specific goal, validate it
  if (goalId) {
    const goal = wallet.goals.find((g) => g.id === goalId);
    if (!goal) throw ApiError.notFound("Goal not found in this wallet");

    const goalBalance = numberValue(goal.allocatedBalance);
    if (amount > goalBalance) {
      throw ApiError.badRequest(
        `Insufficient goal balance. Available in ${goal.name}: ₹${roundMoney(goalBalance)}, requested: ₹${roundMoney(amount)}`
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create withdrawal ledger entry
    const walletTx = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WALLET_TX_TYPES.WITHDRAWAL,
        amount,
        reason: reason ?? (goalId ? "Goal withdrawal" : "Wallet withdrawal"),
        status: "COMPLETED",
      },
    });

    // 2. Decrease wallet balance
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });

    await tx.interestAccount.updateMany({
      where: { walletId: wallet.id },
      data: { eligibleBalance: updatedWallet.balance },
    });

    // 3. If goal-specific, decrease goal's allocated balance
    let updatedGoal = null;
    if (goalId) {
      updatedGoal = await tx.goal.update({
        where: { id: goalId },
        data: { allocatedBalance: { decrement: amount } },
      });
    }

    // 4. Create savings ledger entry (negative amount for withdrawal)
    await tx.savingsLedger.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: -amount,
        type: WALLET_TX_TYPES.WITHDRAWAL,
        reason: reason ?? (goalId ? `Withdrawal from ${updatedGoal?.name ?? "goal"}` : "Wallet withdrawal"),
      },
    });

    return {
      transactionId: walletTx.id,
      amount: roundMoney(amount),
      newBalance: numberValue(updatedWallet.balance),
      goal: updatedGoal
        ? {
            id: updatedGoal.id,
            name: updatedGoal.name,
            newAllocatedBalance: numberValue(updatedGoal.allocatedBalance),
          }
        : null,
    };
  });

  logger.info(LOG_CTX, `Withdrawal of ₹${amount} for user ${userId}${goalId ? ` from goal ${goalId}` : ""}`);
  return result;
}
