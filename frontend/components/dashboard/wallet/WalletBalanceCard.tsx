"use client";

import React from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, Sparkles, Shield, Percent, Landmark } from "lucide-react";
import type { WalletResponse, InterestAccount } from "../../../lib/types/api";

interface Props {
  wallet?: WalletResponse;
  interest?: InterestAccount;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  onAutoSaveClick?: () => void;
  isLoading?: boolean;
}

export default function WalletBalanceCard({
  wallet,
  interest,
  onDepositClick,
  onWithdrawClick,
  onAutoSaveClick,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-orange-100/60 rounded w-1/4" />
        <div className="h-10 bg-orange-100/60 rounded w-1/2" />
        <div className="h-24 bg-orange-50 rounded" />
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const interestEarned = wallet?.interestEarned ?? 0;
  const ratePercent = (interest?.annualRate ?? 0.065) * 100;
  const partnerName = interest?.partnerName ?? "Regulated Partner Bank";

  return (
    <div className="bg-gradient-to-br from-[#FFFBF7] via-white to-[#FFF7ED] rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-xs relative overflow-hidden">
      {/* Decorative ambient ring */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-orange-400/15 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Custody Note */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-orange-100/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900 font-inter">Smart Wallet Experience</p>
            <p className="text-[11px] text-stone-500">
              Funds held securely by <strong className="text-stone-700">{partnerName}</strong>
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
          <Percent className="w-3.5 h-3.5 text-emerald-600" />
          <span>{ratePercent.toFixed(1)}% p.a. High-Yield Interest</span>
        </div>
      </div>

      {/* Main Balance Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-7">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-950 font-inter mb-1">
            Total Smart Wallet Balance
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight font-instrument">
              ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Available
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
            <span>
              Cumulative Interest Accrued:{" "}
              <strong className="text-stone-900 font-semibold font-instrument text-sm">
                +₹{interestEarned.toFixed(2)}
              </strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-start md:justify-end gap-2.5">
          <button
            onClick={onDepositClick}
            type="button"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit</span>
          </button>

          <button
            onClick={onWithdrawClick}
            type="button"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-stone-800 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-stone-500" />
            <span>Withdraw</span>
          </button>

          {onAutoSaveClick && (
            <button
              onClick={onAutoSaveClick}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200/80 text-amber-900 text-xs sm:text-sm font-bold border border-amber-300/60 shadow-2xs transition-all active:scale-98 cursor-pointer"
              title="Test immediate surplus auto-save decision"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Smart Save</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
