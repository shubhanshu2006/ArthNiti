import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { listUsers, getUserById, updateUserSettings } from "./users.service.js";

const router = Router();

// --- Schemas ---

const userIdParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

const updateSettingsSchema = z.object({
  smartSaveEnabled: z.boolean().optional(),
  maxDailyAutoSave: z.number().positive().optional(),
  minimumBalance: z.number().min(0).optional(),
  savingPercentage: z.number().min(0).max(1).optional(),
  riskProfile: z.enum(["conservative", "moderate", "aggressive"]).optional(),
});

// --- Routes ---

/**
 * GET /api/users
 * List all users (for demo persona switching).
 */
router.get(
  "/",
  authenticate,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await listUsers();
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/users/:userId
 * Get user profile with wallet summary.
 */
router.get(
  "/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getUserById(String(req.params.userId));
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/users/:userId/settings
 * Update user smart-save settings.
 */
router.patch(
  "/:userId/settings",
  authenticate,
  validate({ params: userIdParamsSchema, body: updateSettingsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await updateUserSettings(String(req.params.userId), req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
