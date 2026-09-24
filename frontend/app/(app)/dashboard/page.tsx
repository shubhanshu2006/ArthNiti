"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { useDashboard } from "../../../hooks/useDashboard";
import { useIncome } from "../../../hooks/useIncome";
import { useWallet } from "../../../hooks/useWallet";

import ExplanationFeed from "../../../components/dashboard/explanation/ExplanationFeed";
import WalletBalanceCard from "../../../components/dashboard/wallet/WalletBalanceCard";
import GoalCard from "../../../components/dashboard/wallet/GoalCard";
import DepositModal from "../../../components/dashboard/wallet/DepositModal";
import WithdrawModal from "../../../components/dashboard/wallet/WithdrawModal";
import IncomeSummaryCard from "../../../components/dashboard/income/IncomeSummaryCard";
import IncomeTrendChart from "../../../components/dashboard/income/IncomeTrendChart";
import AutoSaveTrigger from "../../../components/dashboard/savings/AutoSaveTrigger";
import SmartSaveToggle from "../../../components/dashboard/savings/SmartSaveToggle";
import WalletLedgerTable from "../../../components/dashboard/wallet/WalletLedgerTable";

import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id || "";

  const { dashboard, mutate: mutateDashboard } = useDashboard(userId);
  const { summary, stats, daily, today, mutateAll: mutateIncome } = useIncome(userId);
  const { wallet, goals, interest, ledger, mutateAll: mutateWallet } = useWallet(userId);

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const refreshAll = () => {
    mutateDashboard();
    mutateIncome();
    mutateWallet();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Smart Wallet Master Card */}
      <WalletBalanceCard
        wallet={wallet}
        interest={interest}
        onDepositClick={() => setDepositOpen(true)}
        onWithdrawClick={() => setWithdrawOpen(true)}
        onAutoSaveClick={() => {
          const autoSaveEl = document.getElementById("autosave-section");
          if (autoSaveEl) autoSaveEl.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 2. Income Analysis & Volatility Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-6">
          <IncomeSummaryCard
            summary={summary}
            stats={stats}
            today={today}
          />
        </div>
        <div className="lg:col-span-6">
          <IncomeTrendChart
            daily={daily}
            baseline={stats?.rollingAverage || 900}
            goodDayThreshold={stats?.goodDayThreshold || 1050}
          />
        </div>
      </div>

      {/* 3. Autonomous Smart Save Engine Controls */}
      <div id="autosave-section" className="space-y-4">
        <SmartSaveToggle
          enabled={user?.smartSaveEnabled ?? true}
          onToggled={refreshAll}
        />
        <AutoSaveTrigger userId={userId} onExecuted={refreshAll} />
      </div>

      {/* 4. Virtual Financial Goals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-inter">
              Virtual Goal Allocation
            </h3>
            <p className="text-xs text-stone-500">
              Segregated progress for emergencies, medical buffer, and compounding growth
            </p>
          </div>
          <Link
            href="/goals"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Manage Goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      </div>

      {/* 5. Autonomous Financial Agent Pipeline (LangGraph) */}
      <ExplanationFeed userId={userId} onRunComplete={refreshAll} />

      {/* 6. Recent Wallet Ledger Audit Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 font-inter">
            Recent Money Movement
          </h3>
          <Link
            href="/wallet"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Ledger Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <WalletLedgerTable transactions={ledger.slice(0, 8)} />
      </div>

      {/* Modals */}
      <DepositModal
        userId={userId}
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        onSuccess={refreshAll}
      />
      <WithdrawModal
        userId={userId}
        currentBalance={wallet?.balance || 0}
        goals={goals}
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={refreshAll}
      />
    </div>
  );
}
