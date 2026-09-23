import { roundMoney } from "../../utils/money.js";

export function estimateTax(cumulativeIncome: number) {
  const taxableIncome = Math.max(0, cumulativeIncome);
  const estimatedLiability = taxableIncome <= 700000 ? 0 : taxableIncome * 0.1;
  return {
    estimatedLiability: roundMoney(estimatedLiability),
    suggestedSetAside: roundMoney(estimatedLiability * 1.1),
  };
}
