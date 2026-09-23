import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../../db/client.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

/**
 * Generates a JWT token for a given user.
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

/**
 * Verifies and decodes a JWT token.
 */
export function verifyToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string };
}

/**
 * Logs in a user by email (demo/prototype auth — no password).
 * Returns the user object and JWT token.
 */
export async function loginByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw ApiError.notFound(`No user found with email: ${email}`);
  }

  const token = generateToken(user.id, email);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      persona: user.persona,
      riskProfile: user.riskProfile,
    },
  };
}

/**
 * Retrieves the currently authenticated user by ID.
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      persona: true,
      riskProfile: true,
      smartSaveEnabled: true,
      maxDailyAutoSave: true,
      minimumBalance: true,
      savingPercentage: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
}
