import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { runFinancialAgent } from "./graph.js";

const router = Router();

const runAgentSchema = z.object({
  userId: z.string().min(1),
});

/**
 * POST /api/agent/run
 * Runs the full financial agent pipeline for a user.
 * Returns the complete agent state with all computed values and explanations.
 */
router.post(
  "/run",
  authenticate,
  validate({ body: runAgentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = await runFinancialAgent(req.body.userId);
      res.json({
        success: true,
        data: {
          // Income
          income: {
            today: state.todayIncome,
            online: state.onlineIncome,
            offline: state.offlineIncome,
            average: state.averageIncome,
            median: state.medianIncome,
            volatility: state.volatilityClass,
          },
          // Pattern
          pattern: {
            variance: state.incomeVariance,
            standardDeviation: state.standardDeviation,
            goodDayThreshold: state.goodDayThreshold,
            lowDayThreshold: state.lowDayThreshold,
            drySpellFrequency: state.drySpellFrequency,
            earningFrequency: state.earningFrequency,
            lowIncomeStreak: state.lowIncomeStreak,
          },
          // Savings
          savings: {
            decision: state.savingsDecision,
            amount: state.savingsAmount,
            surplus: state.surplus,
            reason: state.savingsReason,
            safetyMode: state.safetyMode,
            safetyAction: state.safetyAction,
            safetyReasons: state.safetyReasons,
          },
          // Wallet
          wallet: {
            balance: state.walletBalance,
            goalAllocations: state.goalAllocations,
          },
          // Recommendation
          recommendation: {
            category: state.recommendationCategory,
            confidence: state.recommendationConfidence,
            reasonCodes: state.recommendationReasonCodes,
          },
          // Tax
          tax: {
            quarter: state.taxQuarter,
            cumulativeIncome: state.cumulativeIncome,
            estimatedLiability: state.taxEstimatedLiability,
            suggestedSetAside: state.taxSuggestedSetAside,
          },
          // Explanations
          explanations: {
            income: state.incomeExplanation,
            savings: state.savingsExplanation,
            recommendation: state.recommendationExplanation,
            tax: state.taxExplanation,
            full: state.explanation,
          },
          // Metadata
          meta: {
            completedNodes: state.completedNodes,
            errors: state.errors,
            timestamp: state.timestamp,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
