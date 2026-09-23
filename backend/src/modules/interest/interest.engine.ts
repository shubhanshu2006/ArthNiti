import { roundMoney } from "../../utils/money.js";

export function calculateDailyInterest(balance: number, annualRate: number, days: number): number {
  return roundMoney(balance * annualRate * Math.max(0, days) / 365);
}
