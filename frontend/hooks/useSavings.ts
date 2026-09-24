/* ─── hooks/useSavings.ts ─── */
import useSWR from "swr";
import { getSavings } from "../lib/api/savings";
import type { SavingsResponse } from "../lib/types/api";

export function useSavings(userId: string | undefined | null) {
  const { data, error, isLoading, mutate } = useSWR<SavingsResponse>(
    userId ? `/savings/${userId}` : null,
    () => getSavings(userId!),
    { revalidateOnFocus: false }
  );

  return {
    savings: data,
    isLoading,
    isError: error,
    mutate,
  };
}
