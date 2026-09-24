/* ─── lib/api/wallet.ts ─── */
import { apiGet, apiPost } from "./client";
import type { WalletResponse, WalletTransaction, DepositResult, GoalData } from "../types/api";

export function getWallet(userId: string): Promise<WalletResponse> {
  return apiGet<WalletResponse>(`/wallet/${userId}`);
}

export function getWalletLedger(userId: string, limit = 50): Promise<WalletTransaction[]> {
  return apiGet<WalletTransaction[]>(`/wallet/${userId}/ledger?limit=${limit}`);
}

export function deposit(userId: string, amount: number, reason?: string): Promise<DepositResult> {
  return apiPost<DepositResult>("/wallet/deposit", { userId, amount, reason });
}

export function autoSave(userId: string, amount: number, reason?: string): Promise<DepositResult> {
  return apiPost<DepositResult>("/wallet/auto-save", {
    userId,
    amount,
    reason: reason ?? "Auto-save from Smart Save engine",
  });
}

export function withdraw(
  userId: string,
  amount: number,
  goalId?: string,
  reason?: string
): Promise<DepositResult> {
  return apiPost<DepositResult>(`/wallet/${userId}/withdraw`, { amount, goalId, reason });
}

// ── Goals ────────────────────────────────────

export function getGoals(userId: string): Promise<GoalData[]> {
  return apiGet<GoalData[]>(`/wallet/${userId}/goals`);
}

export function createGoal(
  userId: string,
  data: {
    type: string;
    name: string;
    targetAmount: number;
    allocationPercentage?: number;
    priority?: number;
  }
): Promise<GoalData> {
  return apiPost<GoalData>(`/wallet/${userId}/goals`, data);
}

export function updateGoal(
  userId: string,
  goalId: string,
  data: {
    name?: string;
    targetAmount?: number;
    allocationPercentage?: number;
    priority?: number;
    status?: "ACTIVE" | "PAUSED" | "ARCHIVED";
  }
): Promise<GoalData> {
  return apiPost<GoalData>(`/wallet/${userId}/goals/${goalId}`, data);
}

export function deleteGoal(userId: string, goalId: string): Promise<{ message: string }> {
  return apiPost<{ message: string }>(`/wallet/${userId}/goals/${goalId}`);
}

export function updateAllocations(
  userId: string,
  allocations: Array<{ goalId: string; allocationPercentage: number }>
): Promise<GoalData[]> {
  return apiPost<GoalData[]>(`/wallet/${userId}/goals/allocate`, { allocations });
}
