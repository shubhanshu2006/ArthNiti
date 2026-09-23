import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";
import { WALLET_TX_TYPES } from "../../config/constants.js";

const LOG_CTX = "Deposit.Service";

/**
 * Processes a manual deposit into the wallet.
 * Creates a wallet transaction, increases the balance, and allocates to goals.
 * All operations happen in a single PostgreSQL transaction for consistency.
 */
export async function processManualDeposit(userId: string, amount: number, reason?: string) {
  if (amount <= 0) throw ApiError.badRequest("Deposit amount must be positive");

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { goals: { where: { status: "ACTIVE" } } },
  });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create wallet transaction
    const walletTx = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WALLET_TX_TYPES.MANUAL_DEPOSIT,
        amount,
        reason: reason ?? "Manual deposit",
        status: "COMPLETED",
      },
    });

    // 2. Increase wallet balance
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    await tx.interestAccount.updateMany({
      where: { walletId: wallet.id },
      data: { eligibleBalance: updatedWallet.balance },
    });

    // 3. Allocate to goals
    const goalAllocations = await allocateToGoals(tx, wallet.id, wallet.goals, amount);

    // 4. Create savings ledger entry
    await tx.savingsLedger.create({
      data: {
        userId,
        walletId: wallet.id,
        amount,
        type: WALLET_TX_TYPES.MANUAL_DEPOSIT,
        reason: reason ?? "Manual deposit",
      },
    });

    return {
      transactionId: walletTx.id,
      amount: roundMoney(amount),
      newBalance: numberValue(updatedWallet.balance),
      goalAllocations,
    };
  });

  logger.info(LOG_CTX, `Manual deposit of ₹${amount} for user ${userId}`);
  return result;
}

/**
 * Processes an auto-save deposit (triggered by the savings decision engine).
 * Same flow as manual deposit but with AUTO_SAVE type.
 */
export async function processAutoSave(userId: string, amount: number, reason: string) {
  if (amount <= 0) throw ApiError.badRequest("Auto-save amount must be positive");

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: { goals: { where: { status: "ACTIVE" } } },
  });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create wallet transaction
    const walletTx = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WALLET_TX_TYPES.AUTO_SAVE,
        amount,
        reason,
        status: "COMPLETED",
      },
    });

    // 2. Increase wallet balance
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    await tx.interestAccount.updateMany({
      where: { walletId: wallet.id },
      data: { eligibleBalance: updatedWallet.balance },
    });

    // 3. Allocate to goals
    const goalAllocations = await allocateToGoals(tx, wallet.id, wallet.goals, amount);

    // 4. Create savings ledger entry
    await tx.savingsLedger.create({
      data: {
        userId,
        walletId: wallet.id,
        amount,
        type: WALLET_TX_TYPES.AUTO_SAVE,
        reason,
      },
    });

    return {
      transactionId: walletTx.id,
      amount: roundMoney(amount),
      newBalance: numberValue(updatedWallet.balance),
      goalAllocations,
    };
  });

  logger.info(LOG_CTX, `Auto-save of ₹${amount} for user ${userId}`);
  return result;
}

/**
 * Allocates a deposit amount across active goals based on their allocationPercentage.
 * Runs inside a Prisma transaction.
 */
async function allocateToGoals(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  walletId: string,
  goals: Array<{ id: string; type: string; name: string; allocationPercentage: any }>,
  totalAmount: number
) {
  const allocations: Record<string, number> = {};

  for (const goal of goals) {
    const percentage = numberValue(goal.allocationPercentage) / 100;
    const allocation = roundMoney(totalAmount * percentage);

    if (allocation > 0) {
      await tx.goal.update({
        where: { id: goal.id },
        data: { allocatedBalance: { increment: allocation } },
      });

      allocations[goal.type] = allocation;
    }
  }

  // Create a goal allocation ledger entry
  await tx.walletTransaction.create({
    data: {
      walletId,
      type: WALLET_TX_TYPES.GOAL_ALLOCATION,
      amount: totalAmount,
      reason: `Allocated: ${Object.entries(allocations).map(([k, v]) => `${k}=₹${v}`).join(", ")}`,
      status: "COMPLETED",
    },
  });

  return allocations;
}
