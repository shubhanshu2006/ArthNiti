/* ─── hooks/useDashboard.ts ─── */
import useSWR from "swr";
import { getDashboard } from "../lib/api/dashboard";
import type { DashboardResponse } from "../lib/types/api";

export function useDashboard(userId: string | undefined | null) {
  const { data, error, isLoading, mutate } = useSWR<DashboardResponse>(
    userId ? `/dashboard/${userId}` : null,
    () => getDashboard(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    dashboard: data,
    isLoading,
    isError: error,
    mutate,
  };
}
