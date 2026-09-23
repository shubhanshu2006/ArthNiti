import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import {
  computeSavingsDecision,
  getSavingsConfig,
  enableSmartSave,
  pauseSmartSave,
  getSavingsHistory,
} from "./savings.service.js";

const router = Router();

// --- Schemas ---

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

const savingsDecisionSchema = z.object({
  userId: z.string().min(1),
});

// --- Routes ---

/**
 * GET /api/savings/:userId
 * Gets the user's savings configuration and recent history.
 */
router.get(
  "/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = String(req.params.userId);
      const [config, history] = await Promise.all([
        getSavingsConfig(userId),
        getSavingsHistory(userId),
      ]);
      res.json({
        success: true,
        data: { config, recentHistory: history },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/savings/decision
 * Runs the full Smart Save + Safety pipeline and returns the decision.
 * Does NOT execute the save — that's done by the wallet module.
 */
router.post(
  "/decision",
  authenticate,
  validate({ body: savingsDecisionSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const decision = await computeSavingsDecision(req.body.userId);
      res.json({ success: true, data: decision });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/savings/enable
 * Enables Smart Save for the authenticated user.
 */
router.post(
  "/enable",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await enableSmartSave(req.userId!);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/savings/pause
 * Pauses Smart Save for the authenticated user.
 */
router.post(
  "/pause",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await pauseSmartSave(req.userId!);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
