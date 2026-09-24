/* ─── hooks/useIncome.ts ─── */
import useSWR from "swr";
import {
  getIncomeSummary,
  getIncomeStats,
  getDailyIncome,
  getTodayIncome,
  getOfflineIncome,
} from "../lib/api/income";
import type {
  IncomeSummary,
  IncomeStats,
  DailyIncome,
  TodayIncome,
  ManualIncomeEntry,
} from "../lib/types/api";

export function useIncome(userId: string | undefined | null) {
  const { data: summary, error: summaryErr, isLoading: summaryLoading, mutate: mutateSummary } = useSWR<IncomeSummary>(
    userId ? `/income/${userId}` : null,
    () => getIncomeSummary(userId!),
    { revalidateOnFocus: false }
  );

  const { data: stats, error: statsErr, isLoading: statsLoading, mutate: mutateStats } = useSWR<IncomeStats>(
    userId ? `/income/${userId}/stats` : null,
    () => getIncomeStats(userId!),
    { revalidateOnFocus: false }
  );

  const { data: daily, error: dailyErr, isLoading: dailyLoading, mutate: mutateDaily } = useSWR<DailyIncome[]>(
    userId ? `/income/${userId}/daily` : null,
    () => getDailyIncome(userId!),
    { revalidateOnFocus: false }
  );

  const { data: today, error: todayErr, isLoading: todayLoading, mutate: mutateToday } = useSWR<TodayIncome>(
    userId ? `/income/${userId}/today` : null,
    () => getTodayIncome(userId!),
    { revalidateOnFocus: false }
  );

  const { data: offline, error: offlineErr, isLoading: offlineLoading, mutate: mutateOffline } = useSWR<ManualIncomeEntry[]>(
    userId ? `/income/${userId}/offline` : null,
    () => getOfflineIncome(userId!),
    { revalidateOnFocus: false }
  );

  const mutateAll = () => {
    mutateSummary();
    mutateStats();
    mutateDaily();
    mutateToday();
    mutateOffline();
  };

  return {
    summary,
    stats,
    daily: daily ?? [],
    today,
    offline: offline ?? [],
    isLoading: summaryLoading || dailyLoading,
    isError: summaryErr || statsErr || dailyErr,
    mutateAll,
    mutateDaily,
    mutateToday,
    mutateOffline,
  };
}
