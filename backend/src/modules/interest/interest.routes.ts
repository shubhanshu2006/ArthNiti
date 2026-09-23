import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { getInterestAccount, calculateAndCreditInterest, getInterestHistory } from "./interest.service.js";

const router = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

/**
 * GET /api/wallet/:userId/interest
 * Gets the interest account details and triggers calculation.
 */
router.get(
  "/:userId/interest",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = routeParam(req.params.userId);
      await getInterestAccount(userId);
      await calculateAndCreditInterest(userId);
      const account = await getInterestAccount(userId);
      res.json({ success: true, data: account });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/wallet/:userId/interest/calculate
 * Calculates and credits accrued interest.
 */
router.post(
  "/:userId/interest/calculate",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await calculateAndCreditInterest(routeParam(req.params.userId));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/wallet/:userId/interest/history
 * Gets the interest credit history.
 */
router.get(
  "/:userId/interest/history",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await getInterestHistory(routeParam(req.params.userId));
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
