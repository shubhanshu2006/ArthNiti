/* ─── hooks/useWallet.ts ─── */
import useSWR from "swr";
import {
  getWallet,
  getWalletLedger,
  getGoals,
} from "../lib/api/wallet";
import {
  getInterestAccount,
  getInterestHistory,
} from "../lib/api/interest";
import type {
  WalletResponse,
  WalletTransaction,
  GoalData,
  InterestAccount,
  InterestEntry,
} from "../lib/types/api";

export function useWallet(userId: string | undefined | null) {
  const { data: wallet, error: walletErr, isLoading: walletLoading, mutate: mutateWallet } = useSWR<WalletResponse>(
    userId ? `/wallet/${userId}` : null,
    () => getWallet(userId!),
    { revalidateOnFocus: false }
  );

  const { data: ledger, error: ledgerErr, isLoading: ledgerLoading, mutate: mutateLedger } = useSWR<WalletTransaction[]>(
    userId ? `/wallet/${userId}/ledger` : null,
    () => getWalletLedger(userId!),
    { revalidateOnFocus: false }
  );

  const { data: goals, error: goalsErr, isLoading: goalsLoading, mutate: mutateGoals } = useSWR<GoalData[]>(
    userId ? `/wallet/${userId}/goals` : null,
    () => getGoals(userId!),
    { revalidateOnFocus: false }
  );

  const { data: interest, error: interestErr, isLoading: interestLoading, mutate: mutateInterest } = useSWR<InterestAccount>(
    userId ? `/wallet/${userId}/interest` : null,
    () => getInterestAccount(userId!),
    { revalidateOnFocus: false }
  );

  const { data: interestHistory, mutate: mutateInterestHistory } = useSWR<InterestEntry[]>(
    userId ? `/wallet/${userId}/interest/history` : null,
    () => getInterestHistory(userId!),
    { revalidateOnFocus: false }
  );

  const mutateAll = () => {
    mutateWallet();
    mutateLedger();
    mutateGoals();
    mutateInterest();
    mutateInterestHistory();
  };

  return {
    wallet,
    ledger: ledger ?? [],
    goals: goals ?? [],
    interest,
    interestHistory: interestHistory ?? [],
    isLoading: walletLoading || goalsLoading,
    isError: walletErr || ledgerErr || goalsErr,
    mutateAll,
    mutateWallet,
    mutateGoals,
    mutateLedger,
    mutateInterest,
  };
}
