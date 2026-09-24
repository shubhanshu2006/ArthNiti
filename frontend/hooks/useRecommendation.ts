/* ─── hooks/useRecommendation.ts ─── */
import useSWR from "swr";
import { getRecommendation, getRecommendationHistory } from "../lib/api/recommendation";
import type { RecommendationResponse } from "../lib/types/api";

export function useRecommendation(userId: string | undefined | null) {
  const { data: latest, error: latestErr, isLoading: latestLoading, mutate: mutateLatest } = useSWR<RecommendationResponse>(
    userId ? `/recommendation/${userId}` : null,
    () => getRecommendation(userId!),
    { revalidateOnFocus: false }
  );

  const { data: history, mutate: mutateHistory } = useSWR<RecommendationResponse[]>(
    userId ? `/recommendation/${userId}/history` : null,
    () => getRecommendationHistory(userId!),
    { revalidateOnFocus: false }
  );

  return {
    recommendation: latest,
    history: history ?? [],
    isLoading: latestLoading,
    isError: latestErr,
    mutate: () => {
      mutateLatest();
      mutateHistory();
    },
  };
}
