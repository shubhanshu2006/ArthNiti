import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { generateRecommendation, getLatestRecommendation, getRecommendationHistory } from "./recommendation.service.js";

const router = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

const generateSchema = z.object({
  userId: z.string().min(1),
});

/**
 * GET /api/recommendation/:userId
 * Gets the latest investment recommendation for a user.
 */
router.get(
  "/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = routeParam(req.params.userId);
      const generated = await generateRecommendation(userId);
      res.json({ success: true, data: generated });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/recommendation/:userId/history
 * Gets recommendation history.
 */
router.get(
  "/:userId/history",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await getRecommendationHistory(routeParam(req.params.userId));
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/recommendation/generate
 * Generates a new investment recommendation.
 */
router.post(
  "/generate",
  authenticate,
  validate({ body: generateSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rec = await generateRecommendation(req.body.userId);
      res.status(201).json({ success: true, data: rec });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
