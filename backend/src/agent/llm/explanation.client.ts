import { env } from "../../config/env.js";
import type { FinancialAgentState } from "../state.js";

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

export async function generateExplanation(state: FinancialAgentState, fallback: string): Promise<string> {
  const provider = env.LLM_PROVIDER;
  const apiKey = provider === "openrouter" ? env.OPENROUTER_API_KEY : provider === "groq" ? env.GROQ_API_KEY : undefined;
  if (!provider || !apiKey) return fallback;

  const endpoint = provider === "openrouter"
    ? "https://openrouter.ai/api/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";
  const model = env.LLM_MODEL ?? (provider === "openrouter" ? "openai/gpt-4o-mini" : "llama-3.1-8b-instant");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(provider === "openrouter" ? { "HTTP-Referer": "http://localhost:3000", "X-Title": "Fintech Smart Save" } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "Explain the provided financial calculations in plain language. Never recalculate, modify, or invent financial values. Include the disclaimer: Illustrative information, not personalized financial advice.",
        },
        {
          role: "user",
          content: JSON.stringify({
            computedState: {
              income: state.todayIncome,
              averageIncome: state.averageIncome,
              savingsDecision: state.savingsDecision,
              savingsAmount: state.savingsAmount,
              recommendation: state.recommendationCategory,
              taxLiability: state.taxEstimatedLiability,
              taxSetAside: state.taxSuggestedSetAside,
            },
            deterministicExplanation: fallback,
          }),
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`LLM explanation request failed with status ${response.status}`);
  const payload = await response.json() as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content?.trim() || fallback;
  const disclaimer = "Illustrative information, not personalized financial advice.";
  return content.includes(disclaimer) ? content : `${content}\n\n${disclaimer}`;
}
