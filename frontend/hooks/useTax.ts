/* ─── hooks/useTax.ts ─── */
import useSWR from "swr";
import { getTaxEstimate, getTaxHistory } from "../lib/api/tax";
import type { TaxResponse } from "../lib/types/api";

export function useTax(userId: string | undefined | null) {
  const { data: estimate, error: estimateErr, isLoading: estimateLoading, mutate: mutateEstimate } = useSWR<TaxResponse>(
    userId ? `/tax/${userId}` : null,
    () => getTaxEstimate(userId!),
    { revalidateOnFocus: false }
  );

  const { data: history, mutate: mutateHistory } = useSWR<TaxResponse[]>(
    userId ? `/tax/${userId}/history` : null,
    () => getTaxHistory(userId!),
    { revalidateOnFocus: false }
  );

  return {
    tax: estimate,
    history: history ?? [],
    isLoading: estimateLoading,
    isError: estimateErr,
    mutate: () => {
      mutateEstimate();
      mutateHistory();
    },
  };
}
