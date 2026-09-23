import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { getIncomeSummary, createManualIncome, classifyTransaction } from "./income.service.js";
import { getDailyIncome, getTodayIncome } from "./aggregation/daily-income.service.js";
import { calculateIncomePattern, getLatestIncomePattern } from "./pattern/income-pattern.engine.js";
import { prisma } from "../../db/client.js";
import { ApiError } from "../../utils/api-error.js";
import { numberValue } from "../../utils/money.js";

const router = Router();

// --- Schemas ---

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

const incomeIdParamsSchema = z.object({
  incomeId: z.string().min(1),
});

const manualIncomeSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive("Income amount must be positive"),
  date: z.string().transform((s) => new Date(s)),
  description: z.string().optional(),
  category: z.string().optional(),
});

const updateManualIncomeSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

// --- Routes ---

/**
 * POST /api/income/manual
 * Creates a manual offline income entry.
 */
router.post(
  "/manual",
  authenticate,
  validate({ body: manualIncomeSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const income = await createManualIncome(req.body);
      res.status(201).json({ success: true, data: income });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/income/:userId
 * Gets the unified income summary (online + offline) for a user.
 */
router.get(
  "/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;
      const summary = await getIncomeSummary(String(req.params.userId), from, to);
      res.json({
        success: true,
        data: {
          totalIncome: summary.total,
          onlineIncome: summary.online,
          offlineIncome: summary.offline,
          average: summary.average,
          median: summary.median,
          variance: summary.variance,
          standardDeviation: summary.standardDeviation,
          volatilityClass: summary.volatilityClass,
          goodDayThreshold: summary.goodDayThreshold,
          lowDayThreshold: summary.lowDayThreshold,
          drySpellFrequency: summary.drySpellFrequency,
          earningFrequency: summary.earningFrequency,
          transactionCount: summary.transactions.length,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/income/:userId/stats
 * Gets the income pattern analysis (rolling statistics).
 */
router.get(
  "/:userId/stats",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recalculate = req.query.recalculate === "true";
      let pattern;

      if (recalculate) {
        pattern = await calculateIncomePattern(String(req.params.userId));
      } else {
        pattern = await getLatestIncomePattern(String(req.params.userId));
        if (!pattern) {
          pattern = await calculateIncomePattern(String(req.params.userId));
        }
      }

      res.json({ success: true, data: pattern });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/income/:userId/offline
 * Gets only offline/manual income entries for a user.
 */
router.get(
  "/:userId/offline",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: String(req.params.userId),
          sourceType: "MANUAL",
          incomeMode: "OFFLINE",
          isIncome: true,
        },
        orderBy: { date: "desc" },
      });

      res.json({
        success: true,
        data: transactions.map((tx) => ({
          id: tx.id,
          amount: numberValue(tx.amount),
          date: tx.date,
          description: tx.description,
          category: tx.category,
          createdAt: tx.createdAt,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/income/:userId/daily
 * Gets daily aggregated income (online + offline combined per day).
 */
router.get(
  "/:userId/daily",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const from = req.query.from
        ? new Date(req.query.from as string)
        : new Date(Date.now() - 30 * 86400000);
      const to = req.query.to ? new Date(req.query.to as string) : new Date();
      const daily = await getDailyIncome(String(req.params.userId), from, to);
      res.json({ success: true, data: daily });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/income/:userId/today
 * Gets today's unified income breakdown.
 */
router.get(
  "/:userId/today",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const today = await getTodayIncome(String(req.params.userId));
      res.json({ success: true, data: today });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/income/manual/:incomeId
 * Updates a manual income entry.
 */
router.patch(
  "/manual/:incomeId",
  authenticate,
  validate({ params: incomeIdParamsSchema, body: updateManualIncomeSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tx = await prisma.transaction.findUnique({ where: { id: String(req.params.incomeId) } });
      if (!tx) throw ApiError.notFound("Income entry not found");
      if (tx.userId !== req.userId) throw ApiError.forbidden("Not your income entry");
      if (tx.sourceType !== "MANUAL") throw ApiError.badRequest("Can only edit manual income entries");

      const updated = await prisma.transaction.update({
        where: { id: String(req.params.incomeId) },
        data: req.body,
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/income/manual/:incomeId
 * Deletes a manual income entry.
 */
router.delete(
  "/manual/:incomeId",
  authenticate,
  validate({ params: incomeIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tx = await prisma.transaction.findUnique({ where: { id: String(req.params.incomeId) } });
      if (!tx) throw ApiError.notFound("Income entry not found");
      if (tx.userId !== req.userId) throw ApiError.forbidden("Not your income entry");
      if (tx.sourceType !== "MANUAL") throw ApiError.badRequest("Can only delete manual income entries");

      await prisma.transaction.delete({ where: { id: String(req.params.incomeId) } });
      res.json({ success: true, message: "Manual income entry deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
