/* ─── lib/api/simulation.ts ─── */
import { apiPost } from "./client";
import type { SimulationResponse } from "../types/api";

export function simulateIncome(userId: string, todayIncome: number): Promise<SimulationResponse> {
  return apiPost<SimulationResponse>("/simulation/income", { userId, todayIncome });
}

export function lookupPersona(persona: string): Promise<{
  id: string;
  name: string;
  persona: string;
  riskProfile: string;
  mutated: false;
}> {
  return apiPost("/simulation/persona", { persona });
}
