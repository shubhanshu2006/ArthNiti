/* ─── lib/api/recommendation.ts ─── */
import { apiGet, apiPost } from "./client";
import type { RecommendationResponse } from "../types/api";

export function getRecommendation(userId: string): Promise<RecommendationResponse> {
  return apiGet<RecommendationResponse>(`/recommendation/${userId}`);
}

export function getRecommendationHistory(userId: string): Promise<RecommendationResponse[]> {
  return apiGet<RecommendationResponse[]>(`/recommendation/${userId}/history`);
}

export function generateRecommendation(userId: string): Promise<RecommendationResponse> {
  return apiPost<RecommendationResponse>("/recommendation/generate", { userId });
}
