export interface ClassificationInput {
  description?: string | null;
  merchant?: string | null;
  type: string;
  amount: number;
  sourcePlatform?: string | null;
}

export interface ClassificationResult {
  isIncome: boolean;
  confidence: number;
  reason: string;
}

const incomeKeywords = /earning|payout|payment|bonus|delivery|driver|client|contract|consulting|cash/i;
const nonIncomeKeywords = /refund|reversal|transfer|deposit|atm|interest/i;

export function classifyIncome(input: ClassificationInput): ClassificationResult {
  if (input.amount <= 0 || input.type.toUpperCase() !== "CREDIT") {
    return { isIncome: false, confidence: 0.99, reason: "Not a positive credit transaction" };
  }

  const text = [input.description, input.merchant, input.sourcePlatform].filter(Boolean).join(" ");
  if (nonIncomeKeywords.test(text)) {
    return { isIncome: false, confidence: 0.85, reason: "Credit resembles a transfer or reversal" };
  }
  if (incomeKeywords.test(text)) {
    return { isIncome: true, confidence: 0.94, reason: "Likely gig or freelance earning" };
  }
  return { isIncome: false, confidence: 0.6, reason: "Positive credit requires user confirmation before classification as income" };
}
