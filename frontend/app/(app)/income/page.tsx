"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { useIncome } from "../../../hooks/useIncome";
import IncomeSummaryCard from "../../../components/dashboard/income/IncomeSummaryCard";
import IncomeTrendChart from "../../../components/dashboard/income/IncomeTrendChart";
import ManualIncomeModal from "../../../components/dashboard/income/ManualIncomeModal";
import OfflineIncomeList from "../../../components/dashboard/income/OfflineIncomeList";
import { Plus, TrendingUp, DollarSign } from "lucide-react";

export default function IncomePage() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { summary, stats, daily, today, offline, isLoading, mutateAll } = useIncome(userId);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-inter">
            Income Streams & Variance
          </h2>
          <p className="text-xs text-stone-500">
            Real-time monitoring of platform payouts and cash earnings
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Cash / Offline Earnings</span>
        </button>
      </div>

      {/* Summary Card */}
      <IncomeSummaryCard
        summary={summary}
        stats={stats}
        today={today}
        isLoading={isLoading}
      />

      {/* Daily Cash Flow Area Chart */}
      <IncomeTrendChart
        daily={daily}
        baseline={stats?.rollingAverage || 900}
        goodDayThreshold={stats?.goodDayThreshold || 1050}
      />

      {/* Offline entries list */}
      <OfflineIncomeList
        entries={offline}
        onDeleted={mutateAll}
      />

      {/* Add Offline Income Modal */}
      <ManualIncomeModal
        userId={userId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={mutateAll}
      />
    </div>
  );
}
