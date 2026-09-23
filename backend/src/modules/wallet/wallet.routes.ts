import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { getWallet, getWalletLedger } from "./wallet.service.js";
import { processManualDeposit, processAutoSave } from "./deposit.service.js";
import { processWithdrawal } from "./withdrawal.service.js";
import { getGoals, createGoal, updateGoal, deleteGoal, updateAllocations } from "../goals/goal.service.js";
import { computeSavingsDecision } from "../savings/savings.service.js";

const router = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

// --- Schemas ---

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

const goalIdParamsSchema = z.object({
  userId: z.string().min(1),
  goalId: z.string().min(1),
});

const depositSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive("Deposit amount must be positive"),
  reason: z.string().optional(),
});

const autoSaveSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive("Auto-save amount must be positive"),
  reason: z.string().default("Auto-save from Smart Save engine"),
});

const withdrawalSchema = z.object({
  amount: z.number().positive("Withdrawal amount must be positive"),
  goalId: z.string().optional(),
  reason: z.string().optional(),
});

const createGoalSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  allocationPercentage: z.number().min(0).max(100).optional(),
  priority: z.number().int().positive().optional(),
});

const updateGoalSchema = z.object({
  name: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  allocationPercentage: z.number().min(0).max(100).optional(),
  priority: z.number().int().positive().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]).optional(),
});

const allocateSchema = z.object({
  allocations: z.array(
    z.object({
      goalId: z.string().min(1),
      allocationPercentage: z.number().min(0).max(100),
    })
  ),
});

// --- Wallet Routes ---

/**
 * GET /api/wallet/:userId
 * Gets the wallet summary with goals.
 */
router.get(
  "/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallet = await getWallet(routeParam(req.params.userId));
      res.json({ success: true, data: wallet });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/wallet/:userId/ledger
 * Gets the wallet transaction ledger.
 */
router.get(
  "/:userId/ledger",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const ledger = await getWalletLedger(routeParam(req.params.userId), limit);
      res.json({ success: true, data: ledger });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/wallet/deposit
 * Manual deposit into the wallet.
 */
router.post(
  "/deposit",
  authenticate,
  validate({ body: depositSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await processManualDeposit(req.body.userId, req.body.amount, req.body.reason);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/wallet/auto-save
 * Auto-save triggered by the savings decision engine.
 */
router.post(
  "/auto-save",
  authenticate,
  validate({ body: autoSaveSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decision = await computeSavingsDecision(req.body.userId);
      if (decision.finalAmount <= 0 || req.body.amount > decision.finalAmount) {
        throw new Error(`Auto-save rejected by Smart Save/Safety policy. Maximum allowed: ₹${decision.finalAmount}`);
      }
      const result = await processAutoSave(req.body.userId, req.body.amount, req.body.reason);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/wallet/:userId/withdraw
 * Withdrawal from the wallet (optionally from a specific goal).
 */
router.post(
  "/:userId/withdraw",
  authenticate,
  validate({ params: userIdParamsSchema, body: withdrawalSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await processWithdrawal({
        userId: routeParam(req.params.userId),
        amount: req.body.amount,
        goalId: req.body.goalId,
        reason: req.body.reason,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// --- Goal Routes (nested under /api/wallet/:userId/goals) ---

/**
 * GET /api/wallet/:userId/goals
 */
router.get(
  "/:userId/goals",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goals = await getGoals(routeParam(req.params.userId));
      res.json({ success: true, data: goals });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/wallet/:userId/goals
 */
router.post(
  "/:userId/goals",
  authenticate,
  validate({ params: userIdParamsSchema, body: createGoalSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await createGoal({ userId: routeParam(req.params.userId), ...req.body });
      res.status(201).json({ success: true, data: goal });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/wallet/:userId/goals/:goalId
 */
router.patch(
  "/:userId/goals/:goalId",
  authenticate,
  validate({ params: goalIdParamsSchema, body: updateGoalSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const goal = await updateGoal(routeParam(req.params.goalId), routeParam(req.params.userId), req.body);
      res.json({ success: true, data: goal });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/wallet/:userId/goals/:goalId
 */
router.delete(
  "/:userId/goals/:goalId",
  authenticate,
  validate({ params: goalIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteGoal(routeParam(req.params.goalId), routeParam(req.params.userId));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/wallet/:userId/goals/allocate
 * Bulk update goal allocation percentages (must sum to 100).
 */
router.post(
  "/:userId/goals/allocate",
  authenticate,
  validate({ params: userIdParamsSchema, body: allocateSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await updateAllocations(routeParam(req.params.userId), req.body.allocations);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
