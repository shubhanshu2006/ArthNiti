import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { DEFAULT_GOAL_ALLOCATIONS, DEFAULT_GOAL_TARGETS } from "../../config/constants.js";

/**
 * Gets all goals for a user's wallet.
 */
export async function getGoals(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const goals = await prisma.goal.findMany({
    where: { userId, walletId: wallet.id },
    orderBy: { priority: "asc" },
  });

  return goals.map((g) => ({
    id: g.id,
    type: g.type,
    name: g.name,
    targetAmount: numberValue(g.targetAmount),
    allocatedBalance: numberValue(g.allocatedBalance),
    allocationPercentage: numberValue(g.allocationPercentage),
    priority: g.priority,
    status: g.status,
    progress: numberValue(g.targetAmount) > 0
      ? roundMoney((numberValue(g.allocatedBalance) / numberValue(g.targetAmount)) * 100)
      : 0,
    createdAt: g.createdAt,
  }));
}

/**
 * Creates a new custom goal for a user.
 */
export async function createGoal(input: {
  userId: string;
  type: string;
  name: string;
  targetAmount: number;
  allocationPercentage?: number;
  priority?: number;
}) {
  const wallet = await prisma.wallet.findUnique({ where: { userId: input.userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  // Validate total allocation doesn't exceed 100%
  const existingGoals = await prisma.goal.findMany({
    where: { userId: input.userId, walletId: wallet.id, status: "ACTIVE" },
  });

  const currentTotal = existingGoals.reduce((sum, g) => sum + numberValue(g.allocationPercentage), 0);
  const newPercentage = input.allocationPercentage ?? 0;

  if (currentTotal + newPercentage > 100) {
    throw ApiError.badRequest(
      `Total allocation would be ${currentTotal + newPercentage}%. Maximum is 100%. Current: ${currentTotal}%.`
    );
  }

  const goal = await prisma.goal.create({
    data: {
      userId: input.userId,
      walletId: wallet.id,
      type: input.type.toUpperCase(),
      name: input.name,
      targetAmount: input.targetAmount,
      allocationPercentage: newPercentage,
      priority: input.priority ?? existingGoals.length + 1,
      status: "ACTIVE",
    },
  });

  return {
    id: goal.id,
    type: goal.type,
    name: goal.name,
    targetAmount: numberValue(goal.targetAmount),
    allocatedBalance: numberValue(goal.allocatedBalance),
    allocationPercentage: numberValue(goal.allocationPercentage),
    priority: goal.priority,
    status: goal.status,
  };
}

/**
 * Updates a goal (name, target amount, allocation percentage, priority).
 */
export async function updateGoal(
  goalId: string,
  userId: string,
  data: {
    name?: string;
    targetAmount?: number;
    allocationPercentage?: number;
    priority?: number;
    status?: string;
  }
) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw ApiError.notFound("Goal not found");
  if (goal.userId !== userId) throw ApiError.forbidden("Not your goal");

  // Validate allocation if changing percentage
  if (data.allocationPercentage !== undefined) {
    const otherGoals = await prisma.goal.findMany({
      where: { userId, walletId: goal.walletId, status: "ACTIVE", id: { not: goalId } },
    });
    const otherTotal = otherGoals.reduce((sum, g) => sum + numberValue(g.allocationPercentage), 0);
    if (otherTotal + data.allocationPercentage > 100) {
      throw ApiError.badRequest(
        `Total allocation would be ${otherTotal + data.allocationPercentage}%. Maximum is 100%.`
      );
    }
  }

  const updated = await prisma.goal.update({
    where: { id: goalId },
    data,
  });

  return {
    id: updated.id,
    type: updated.type,
    name: updated.name,
    targetAmount: numberValue(updated.targetAmount),
    allocatedBalance: numberValue(updated.allocatedBalance),
    allocationPercentage: numberValue(updated.allocationPercentage),
    priority: updated.priority,
    status: updated.status,
  };
}

/**
 * Deletes (deactivates) a goal.
 */
export async function deleteGoal(goalId: string, userId: string) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });
  if (!goal) throw ApiError.notFound("Goal not found");
  if (goal.userId !== userId) throw ApiError.forbidden("Not your goal");

  await prisma.goal.update({
    where: { id: goalId },
    data: { status: "ARCHIVED" },
  });

  return { id: goalId, status: "ARCHIVED" };
}

/**
 * Updates goal allocation percentages in bulk.
 * All percentages must sum to 100.
 */
export async function updateAllocations(
  userId: string,
  allocations: Array<{ goalId: string; allocationPercentage: number }>
) {
  const total = allocations.reduce((sum, a) => sum + a.allocationPercentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw ApiError.badRequest(`Allocations must sum to 100%. Current total: ${total}%`);
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw ApiError.notFound("Wallet not found");

  const goalIds = allocations.map((allocation) => allocation.goalId);
  const ownedGoals = await prisma.goal.findMany({
    where: { id: { in: goalIds }, userId, walletId: wallet.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (ownedGoals.length !== goalIds.length || new Set(ownedGoals.map((goal) => goal.id)).size !== goalIds.length) {
    throw ApiError.forbidden("All allocations must belong to the authenticated user's wallet");
  }

  const results = await prisma.$transaction(
    allocations.map((a) =>
      prisma.goal.update({
        where: { id: a.goalId },
        data: { allocationPercentage: a.allocationPercentage },
      })
    )
  );

  return results.map((g) => ({
    id: g.id,
    type: g.type,
    name: g.name,
    allocationPercentage: numberValue(g.allocationPercentage),
  }));
}
