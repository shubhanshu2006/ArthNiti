import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue } from "../../utils/money.js";

/**
 * List all users (useful for persona switching in the demo).
 */
export async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      persona: true,
      riskProfile: true,
      smartSaveEnabled: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return users;
}

/**
 * Get a single user by ID with their wallet summary.
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: {
        select: {
          id: true,
          balance: true,
          interestEarned: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound(`User not found: ${userId}`);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    persona: user.persona,
    riskProfile: user.riskProfile,
    smartSaveEnabled: user.smartSaveEnabled,
    maxDailyAutoSave: numberValue(user.maxDailyAutoSave),
    minimumBalance: numberValue(user.minimumBalance),
    savingPercentage: numberValue(user.savingPercentage),
    wallet: user.wallet
      ? {
          id: user.wallet.id,
          balance: numberValue(user.wallet.balance),
          interestEarned: numberValue(user.wallet.interestEarned),
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Update user settings (smart save preferences).
 */
export async function updateUserSettings(
  userId: string,
  data: {
    smartSaveEnabled?: boolean;
    maxDailyAutoSave?: number;
    minimumBalance?: number;
    savingPercentage?: number;
    riskProfile?: string;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound(`User not found: ${userId}`);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      persona: true,
      riskProfile: true,
      smartSaveEnabled: true,
      maxDailyAutoSave: true,
      minimumBalance: true,
      savingPercentage: true,
      updatedAt: true,
    },
  });
}
