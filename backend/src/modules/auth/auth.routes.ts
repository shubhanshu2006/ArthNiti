import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { loginByEmail, getCurrentUser } from "./auth.service.js";
import { logger } from "../../utils/logger.js";

const router = Router();

// --- Schemas ---

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
});

// --- Routes ---

/**
 * POST /api/auth/login
 * Demo login — accepts email, returns JWT + user info.
 */
router.post(
  "/login",
  validate({ body: loginSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await loginByEmail(email);
      logger.info("Auth", `User logged in: ${email}`);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.userId!);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
