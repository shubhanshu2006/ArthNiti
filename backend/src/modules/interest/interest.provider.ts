import { calculateDailyInterest } from "./interest.engine.js";

export interface InterestPeriod {
  days: number;
}

export interface InterestProvider {
  getApplicableRate(productId: string): Promise<number>;
  calculateInterest(balance: number, rate: number, period: InterestPeriod): Promise<number>;
}

export class PrototypeInterestProvider implements InterestProvider {
  constructor(private readonly defaultRate: number) {}

  async getApplicableRate(_productId: string): Promise<number> {
    return this.defaultRate;
  }

  async calculateInterest(balance: number, rate: number, period: InterestPeriod): Promise<number> {
    return calculateDailyInterest(balance, rate, period.days);
  }
}
