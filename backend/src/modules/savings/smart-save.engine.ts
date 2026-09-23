import { roundMoney } from "../../utils/money.js";

export interface SavingsDecision {
  decision: "SAVE" | "PAUSE" | "REDUCE";
  income: number;
  normalIncome: number;
  surplus: number;
  savedAmount: number;
  reason: string;
}

export function decideSmartSave(input: {
  income: number;
  normalIncome: number;
  savingPercentage: number;
  maxDailyAutoSave?: number | null;
  smartSaveEnabled: boolean;
  minimumBalance: number;
  availableBalance: number;
  lowIncomeStreak?: number;
}): SavingsDecision {
  const surplus = roundMoney(Math.max(0, input.income - input.normalIncome));

  if (!input.smartSaveEnabled) {
    return { decision: "PAUSE", income: input.income, normalIncome: input.normalIncome, surplus, savedAmount: 0, reason: "Smart Save is disabled" };
  }
  if ((input.lowIncomeStreak ?? 0) >= 3 || input.income <= input.normalIncome) {
    return { decision: "PAUSE", income: input.income, normalIncome: input.normalIncome, surplus, savedAmount: 0, reason: "Income is at or below the normal level" };
  }

  const requested = surplus * input.savingPercentage;
  const capped = input.maxDailyAutoSave == null ? requested : Math.min(requested, input.maxDailyAutoSave);
  const safeAmount = Math.max(0, input.availableBalance - input.minimumBalance);
  const savedAmount = roundMoney(Math.min(capped, safeAmount));

  if (savedAmount <= 0) {
    return { decision: "REDUCE", income: input.income, normalIncome: input.normalIncome, surplus, savedAmount: 0, reason: "Minimum balance would not be preserved" };
  }
  return { decision: "SAVE", income: input.income, normalIncome: input.normalIncome, surplus, savedAmount, reason: "Higher-than-usual earning day" };
}
