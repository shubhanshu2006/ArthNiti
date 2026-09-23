import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import * as aaService from "./aa.service.js";

const router = Router();

// --- Schemas ---

const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

const consentIdParamsSchema = z.object({
  consentId: z.string().min(1),
});

// --- Routes ---

/**
 * POST /api/aa/consent
 * Creates a new AA consent for the authenticated user.
 */
router.post(
  "/consent",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const consent = await aaService.createConsent(req.userId!);
      res.status(201).json({ success: true, data: consent });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/aa/consent/:userId
 * Gets the active consent status for a user.
 */
router.get(
  "/consent/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const consent = await aaService.getConsentStatus(String(req.params.userId));
      res.json({ success: true, data: consent });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/aa/sync/:userId
 * Triggers a financial data sync from the AA provider.
 */
router.post(
  "/sync/:userId",
  authenticate,
  validate({ params: userIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aaService.syncFinancialData(String(req.params.userId));
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/aa/consent/:consentId
 * Revokes an AA consent.
 */
router.delete(
  "/consent/:consentId",
  authenticate,
  validate({ params: consentIdParamsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aaService.revokeConsent(String(req.params.consentId), req.userId!);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
