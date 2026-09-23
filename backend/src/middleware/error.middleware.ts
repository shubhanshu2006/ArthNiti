import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { logger } from "../utils/logger.js";

/**
 * Global error-handling middleware.
 * Must be registered LAST in the Express middleware chain.
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    logger.warn("ErrorHandler", `${err.statusCode} ${err.message}`, {
      method: req.method,
      path: req.path,
    });

    res.status(err.statusCode).json({
      error: true,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Unexpected / non-operational error
  logger.error("ErrorHandler", "Unhandled error", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    method: req.method,
    path: req.path,
  });

  res.status(500).json({
    error: true,
    statusCode: 500,
    message: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
  });
}
