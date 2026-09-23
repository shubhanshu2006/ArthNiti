import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Authentication middleware.
 * Extracts and verifies JWT from the Authorization header.
 * Attaches userId to the request object for downstream handlers.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(ApiError.unauthorized("Missing or invalid Authorization header"));
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;

    const requestedUserId = typeof req.params.userId === "string"
      ? req.params.userId
      : typeof req.body?.userId === "string"
        ? req.body.userId
        : undefined;
    if (requestedUserId && requestedUserId !== decoded.userId) {
      next(ApiError.forbidden("You can only access your own financial data"));
      return;
    }

    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
