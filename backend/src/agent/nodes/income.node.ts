import type { FinancialAgentState } from "../state.js";
import { getTodayIncome } from "../../modules/income/aggregation/daily-income.service.js";
import { prisma } from "../../db/client.js";
import { numberValue } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";

const LOG_CTX = "Agent.IncomeNode";

/**
 * Income Node — fetches today's unified income (online + offline)
 * and loads user profile settings into the agent state.
 */
export async function incomeNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: state.userId },
      include: { wallet: true },
    });

    if (!user) {
      return { errors: [...state.errors, "User not found"] };
    }

    const todayData = await getTodayIncome(state.userId);

    logger.info(LOG_CTX, `Income fetched: total=₹${todayData.total}, online=₹${todayData.online}, offline=₹${todayData.offline}`);

    return {
      todayIncome: todayData.total,
      onlineIncome: todayData.online,
      offlineIncome: todayData.offline,
      smartSaveEnabled: user.smartSaveEnabled,
      riskProfile: user.riskProfile ?? "moderate",
      savingPercentage: numberValue(user.savingPercentage),
      maxDailyAutoSave: user.maxDailyAutoSave ? numberValue(user.maxDailyAutoSave) : null,
      minimumBalance: numberValue(user.minimumBalance),
      walletBalance: user.wallet ? numberValue(user.wallet.balance) : 0,
      completedNodes: [...state.completedNodes, "income"],
    };
  } catch (err: any) {
    logger.error(LOG_CTX, "Income node failed", err.message);
    return { errors: [...state.errors, `Income: ${err.message}`] };
  }
}
