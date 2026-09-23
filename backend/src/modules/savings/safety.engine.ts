import { roundMoney } from "../../utils/money.js";
import { PATTERN_THRESHOLDS } from "../../config/constants.js";

export interface SafetyCheck {
  safe: boolean;
  action: "ALLOW" | "REDUCE" | "PAUSE";
  adjustedAmount: number;
  reasons: string[];
}

/**
 * Safety Engine — validates a proposed savings amount against safety constraints.
 *
 * Checks (in order):
 * 1. Is Smart Save enabled?
 * 2. Is income above normal?
 * 3. Is the user in a low-income streak?
 * 4. Would minimum balance be preserved?
 * 5. Does the amount respect the daily auto-save limit?
 *
 * Returns an action: ALLOW (proceed), REDUCE (lower the amount), or PAUSE (save nothing).
 */
export function runSafetyChecks(input: {
  proposedAmount: number;
  smartSaveEnabled: boolean;
  todayIncome: number;
  normalIncome: number;
  lowIncomeStreak: number;
  availableBalance: number;
  minimumBalance: number;
  maxDailyAutoSave: number | null;
}): SafetyCheck {
  const reasons: string[] = [];
  let amount = input.proposedAmount;

  // Check 1: Smart Save must be enabled
  if (!input.smartSaveEnabled) {
    return {
      safe: false,
      action: "PAUSE",
      adjustedAmount: 0,
      reasons: ["Smart Save is disabled by user"],
    };
  }

  // Check 2: Income should be above normal for auto-save
  if (input.todayIncome <= input.normalIncome) {
    return {
      safe: false,
      action: "PAUSE",
      adjustedAmount: 0,
      reasons: ["Today's income is at or below normal — no surplus to save"],
    };
  }

  // Check 3: Low-income streak detection
  if (input.lowIncomeStreak >= PATTERN_THRESHOLDS.LOW_INCOME_STREAK_LIMIT) {
    return {
      safe: false,
      action: "PAUSE",
      adjustedAmount: 0,
      reasons: [
        `Income has remained below normal for ${input.lowIncomeStreak} consecutive days`,
        "Auto-save paused to protect cash flow",
      ],
    };
  }

  // Check 4: Daily auto-save cap
  if (input.maxDailyAutoSave != null && amount > input.maxDailyAutoSave) {
    reasons.push(
      `Amount reduced from ₹${roundMoney(amount)} to ₹${roundMoney(input.maxDailyAutoSave)} (daily limit)`
    );
    amount = input.maxDailyAutoSave;
  }

  // Check 5: Minimum balance protection
  const safeAmount = Math.max(0, input.availableBalance - input.minimumBalance);
  if (amount > safeAmount) {
    if (safeAmount <= 0) {
      return {
        safe: false,
        action: "PAUSE",
        adjustedAmount: 0,
        reasons: ["Saving would breach minimum balance — auto-save paused"],
      };
    }
    reasons.push(
      `Amount reduced from ₹${roundMoney(amount)} to ₹${roundMoney(safeAmount)} to preserve minimum balance of ₹${roundMoney(input.minimumBalance)}`
    );
    amount = safeAmount;
  }

  // Final validation
  amount = roundMoney(amount);
  if (amount <= 0) {
    return {
      safe: false,
      action: "PAUSE",
      adjustedAmount: 0,
      reasons: ["Calculated savings amount is zero after safety checks"],
    };
  }

  const action = reasons.length > 0 ? "REDUCE" : "ALLOW";
  return {
    safe: true,
    action,
    adjustedAmount: amount,
    reasons: reasons.length > 0 ? reasons : ["All safety checks passed"],
  };
}

/**
 * Calculates the low-income streak — how many consecutive recent days
 * the user's daily income was below their normal (rolling average).
 */
export function calculateLowIncomeStreak(
  dailyIncomes: number[],
  normalIncome: number
): number {
  let streak = 0;
  // Walk backwards from the most recent day
  for (let i = dailyIncomes.length - 1; i >= 0; i--) {
    if (dailyIncomes[i] < normalIncome) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
