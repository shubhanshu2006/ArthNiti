import type { FinancialAgentState } from "../state.js";
import { prisma } from "../../db/client.js";
import { numberValue, roundMoney } from "../../utils/money.js";
import { logger } from "../../utils/logger.js";

const LOG_CTX = "Agent.GoalAllocationNode";

export async function goalAllocationNode(state: FinancialAgentState): Promise<Partial<FinancialAgentState>> {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: state.userId },
      include: { goals: { where: { status: "ACTIVE" } } },
    });
    const goalAllocations = Object.fromEntries((wallet?.goals ?? []).map((goal) => [
      goal.type.toLowerCase(),
      roundMoney(state.savingsAmount * numberValue(goal.allocationPercentage) / 100),
    ]));
    logger.info(LOG_CTX, `Computed allocations for ${state.userId}`);
    return { goalAllocations, completedNodes: [...state.completedNodes, "goal-allocation"] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown goal allocation error";
    logger.error(LOG_CTX, "Goal allocation node failed", message);
    return { errors: [...state.errors, `Goal allocation: ${message}`] };
  }
}
