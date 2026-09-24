"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { useWallet } from "../../../hooks/useWallet";
import GoalCard from "../../../components/dashboard/wallet/GoalCard";
import GoalAllocationDonut from "../../../components/dashboard/wallet/GoalAllocationDonut";
import { Target, Plus, Sliders, CheckCircle2, AlertCircle } from "lucide-react";
import { createGoal, updateAllocations } from "../../../lib/api/wallet";
import type { GoalData } from "../../../lib/types/api";

export default function GoalsPage() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { goals, isLoading, mutateGoals } = useWallet(userId);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [goalType, setGoalType] = useState("CUSTOM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount);
    if (isNaN(numTarget) || numTarget <= 0) {
      setError("Please specify a valid target amount");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createGoal(userId, {
        name: goalName.trim(),
        targetAmount: numTarget,
        type: goalType,
        allocationPercentage: 10,
      });
      setGoalName("");
      setTargetAmount("");
      setCreateModalOpen(false);
      mutateGoals();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-inter">
            Virtual Financial Goals
          </h2>
          <p className="text-xs text-stone-500">
            Automated micro-allocations partitioned across emergency, health, and wealth goals
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Virtual Goal</span>
        </button>
      </div>

      {/* Main Grid: Goal Cards & Allocation Rule Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Donut Chart & Allocation Rule */}
        <div className="lg:col-span-5">
          <GoalAllocationDonut goals={goals} />
        </div>

        {/* Right: Goals Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-stone-900 font-inter">
            Active Financial Targets ({goals.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </div>
      </div>

      {/* Create Goal Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-orange-100 shadow-2xl animate-fade-in-up relative">
            <h3 className="text-lg font-bold text-stone-900 font-inter mb-1">
              Add New Virtual Goal
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Set a target amount. The Smart Save engine will automatically allocate surplus toward it.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Festival Season Trip, New Bike Down Payment"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="25000"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Goal Category
                </label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 text-sm font-medium transition-all"
                >
                  <option value="CUSTOM">Custom Personal Target</option>
                  <option value="EMERGENCY">Emergency Liquidity</option>
                  <option value="MEDICAL">Medical Safety Net</option>
                  <option value="GROWTH">Wealth Compounding</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-[#E5533D] rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Creating..." : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
