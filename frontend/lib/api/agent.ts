/* ─── lib/api/agent.ts ─── */
import { apiPost } from "./client";
import type { AgentRunResponse } from "../types/api";

export function runAgent(userId: string): Promise<AgentRunResponse> {
  return apiPost<AgentRunResponse>("/agent/run", { userId });
}
