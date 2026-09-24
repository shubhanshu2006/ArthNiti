"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { useWallet } from "../../../hooks/useWallet";
import WalletBalanceCard from "../../../components/dashboard/wallet/WalletBalanceCard";
import InterestCard from "../../../components/dashboard/interest/InterestCard";
import WalletLedgerTable from "../../../components/dashboard/wallet/WalletLedgerTable";
import DepositModal from "../../../components/dashboard/wallet/DepositModal";
import WithdrawModal from "../../../components/dashboard/wallet/WithdrawModal";

export default function WalletPage() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { wallet, ledger, goals, interest, interestHistory, isLoading, mutateAll } = useWallet(userId);

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Wallet Balance Header Card */}
      <WalletBalanceCard
        wallet={wallet}
        interest={interest}
        onDepositClick={() => setDepositOpen(true)}
        onWithdrawClick={() => setWithdrawOpen(true)}
        isLoading={isLoading}
      />

      {/* High-Yield Interest & Yield Accrual Module */}
      <InterestCard
        userId={userId}
        interest={interest}
        history={interestHistory}
        onCalculated={mutateAll}
        isLoading={isLoading}
      />

      {/* Full Transaction Audit Ledger */}
      <WalletLedgerTable
        transactions={ledger}
        isLoading={isLoading}
      />

      {/* Modals */}
      <DepositModal
        userId={userId}
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        onSuccess={mutateAll}
      />
      <WithdrawModal
        userId={userId}
        currentBalance={wallet?.balance || 0}
        goals={goals}
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={mutateAll}
      />
    </div>
  );
}
