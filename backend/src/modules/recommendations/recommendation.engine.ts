export interface RecommendationResult {
  category: "Conservative" | "Balanced" | "Growth";
  confidence: number;
  reasonCodes: string[];
}

export function recommend(input: {
  volatilityClass: string;
  riskProfile?: string | null;
  availableSavings: number;
  averageIncome?: number;
  incomeVariance?: number;
  drySpellFrequency?: number;
  savingsRate?: number;
  onlineIncome?: number;
  offlineIncome?: number;
}): RecommendationResult {
  const reasons: string[] = [];
  if (input.volatilityClass === "high") reasons.push("HIGH_INCOME_VOLATILITY");
  if ((input.drySpellFrequency ?? 0) >= 0.2) reasons.push("FREQUENT_DRY_SPELLS");
  if ((input.incomeVariance ?? 0) > (input.averageIncome ?? 0) ** 2) reasons.push("HIGH_INCOME_VARIANCE");
  if (input.availableSavings < 5000) reasons.push("LIMITED_AVAILABLE_SAVINGS");
  if ((input.savingsRate ?? 0) < 0.1) reasons.push("LOW_SAVINGS_RATE");
  if ((input.offlineIncome ?? 0) > (input.onlineIncome ?? 0) && (input.offlineIncome ?? 0) > 0) reasons.push("HIGH_OFFLINE_INCOME_MIX");

  const risk = input.riskProfile ?? "moderate";
  if (risk === "conservative" || input.volatilityClass === "high") {
    return { category: "Conservative", confidence: 0.86, reasonCodes: [...reasons, `${risk.toUpperCase()}_RISK_PROFILE`] };
  }
  if (risk === "aggressive" && input.volatilityClass === "low") {
    return { category: "Growth", confidence: 0.78, reasonCodes: [...reasons, "AGGRESSIVE_RISK_PROFILE"] };
  }
  return { category: "Balanced", confidence: 0.8, reasonCodes: [...reasons, "MODERATE_RISK_PROFILE"] };
}
