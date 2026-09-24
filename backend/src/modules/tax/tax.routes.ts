import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { calculateTaxEstimate, getLatestTaxEstimate, getTaxHistory } from "./tax.service.js";

const router = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

const calculateSchema = z.object({
  userId: z.string().min(1),
});

/**
 * GET /api/tax/:userId
 * Gets the latest persisted tax estimate for a user.
 * Does NOT recompute/persist a new one on every call — use
 * POST /api/tax/calculate for that. Bootstraps a first estimate
 * only if the user has none yet.
 */
router.get(
  "/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = routeParam(req.params.userId);
      const latest = await getLatestTaxEstimate(userId);
      res.json({ success: true, data: latest });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/tax/:userId/history
 * Gets tax estimate history.
 */
router.get(
  "/:userId/history",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await getTaxHistory(routeParam(req.params.userId));
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/tax/calculate
 * Calculates a new tax estimate.
 */
router.post(
  "/calculate",
  authenticate,
  validate({ body: calculateSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const estimate = await calculateTaxEstimate(req.body.userId);
      res.status(201).json({ success: true, data: estimate });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
