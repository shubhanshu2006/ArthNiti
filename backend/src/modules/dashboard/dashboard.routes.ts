import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { getDashboard } from "./dashboard.service.js";

const router = Router();
const paramsSchema = z.object({ userId: z.string().min(1) });

router.get("/:userId", authenticate, validate({ params: paramsSchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await getDashboard(String(req.params.userId));
    res.json({ success: true, data: dashboard });
  } catch (error) {
    next(error);
  }
});

export default router;
