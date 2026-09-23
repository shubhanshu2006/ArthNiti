import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { prisma } from "../../db/client.js";
import { getIncomeSummary } from "../income/income.service.js";
import { decideSmartSave } from "../savings/smart-save.engine.js";
import { runSafetyChecks } from "../savings/safety.engine.js";
import { calculateLowIncomeStreak } from "../savings/safety.engine.js";
import { numberValue, roundMoney } from "../../utils/money.js";

const router = Router();
const incomeSchema = z.object({ userId: z.string().min(1), todayIncome: z.number().nonnegative() });
const personaSchema = z.object({ persona: z.string().min(1), userId: z.string().optional() });

router.post("/income", authenticate, validate({ body: incomeSchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, todayIncome } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { wallet: { include: { goals: { where: { status: "ACTIVE" } } } } } });
    if (!user) throw new Error("User not found");
    const summary = await getIncomeSummary(userId, new Date(Date.now() - 30 * 86400000));
    const lowIncomeStreak = calculateLowIncomeStreak(summary.daily, summary.average);
    const decision = decideSmartSave({
      income: todayIncome,
      normalIncome: summary.average,
      savingPercentage: numberValue(user.savingPercentage),
      maxDailyAutoSave: user.maxDailyAutoSave ? numberValue(user.maxDailyAutoSave) : null,
      smartSaveEnabled: user.smartSaveEnabled,
      minimumBalance: numberValue(user.minimumBalance),
      availableBalance: todayIncome,
      lowIncomeStreak,
    });
    const safety = runSafetyChecks({
      proposedAmount: decision.savedAmount,
      smartSaveEnabled: user.smartSaveEnabled,
      todayIncome,
      normalIncome: summary.average,
      lowIncomeStreak,
      availableBalance: todayIncome,
      minimumBalance: numberValue(user.minimumBalance),
      maxDailyAutoSave: user.maxDailyAutoSave ? numberValue(user.maxDailyAutoSave) : null,
    });
    const amount = safety.safe ? safety.adjustedAmount : 0;
    res.json({
      success: true,
      data: {
        income: todayIncome,
        normalIncome: summary.average,
        surplus: roundMoney(Math.max(0, todayIncome - summary.average)),
        recommendedSave: amount,
        decision: amount > 0 ? "SAVE" : "PAUSE",
        goalAllocation: Object.fromEntries((user.wallet?.goals ?? []).map((goal) => [goal.type.toLowerCase(), roundMoney(amount * numberValue(goal.allocationPercentage) / 100)])),
        safety,
        mutated: false,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/persona", authenticate, validate({ body: personaSchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findFirst({ where: { persona: req.body.persona } });
    if (!user) throw new Error("Persona not found");
    res.json({ success: true, data: { id: user.id, name: user.name, persona: user.persona, riskProfile: user.riskProfile, mutated: false } });
  } catch (error) {
    next(error);
  }
});

export default router;
