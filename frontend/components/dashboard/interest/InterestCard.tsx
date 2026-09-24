"use client";

import React, { useState } from "react";
import { Landmark, Percent, Sparkles, CheckCircle2, History, AlertCircle } from "lucide-react";
import { calculateInterest } from "../../../lib/api/interest";
import type { InterestAccount, InterestEntry } from "../../../lib/types/api";

interface Props {
  userId: string;
  interest?: InterestAccount;
  history?: InterestEntry[];
  onCalculated?: () => void;
  isLoading?: boolean;
}

export default function InterestCard({
  userId,
  interest,
  history = [],
  onCalculated,
  isLoading,
}: Props) {
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<{
    amount?: number;
    interestAmount?: number;
    eligibleBalance?: number;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setCalculating(true);
    setError(null);
    try {
      const res = await calculateInterest(userId);
      setResult(res as unknown as { amount?: number; interestAmount?: number; eligibleBalance?: number; message?: string });
      if (onCalculated) onCalculated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to calculate daily interest");
    } finally {
      setCalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-orange-100 rounded w-1/4" />
        <div className="h-16 bg-orange-50 rounded" />
      </div>
    );
  }

  const ratePercent = (interest?.annualRate ?? 0.065) * 100;
  const partnerName = interest?.partnerName ?? "Regulated Partner Bank";
  const productName = interest?.productName ?? "High-Yield Liquid Savings";
  const eligibleBalance = interest?.eligibleBalance ?? 0;
  const totalAccrued = history.reduce((sum, h) => sum + h.amount, 0);

  const calculatedAmount = result?.interestAmount ?? result?.amount ?? 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-inter">
              High-Yield Partner Yield
            </h3>
            <p className="text-xs text-stone-500">
              {productName} via {partnerName}
            </p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={calculating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{calculating ? "Accruing..." : "Calculate & Accrue Interest"}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result feedback */}
      {result && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 animate-fade-in border ${
            calculatedAmount > 0
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${
                calculatedAmount > 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            />
            <span>
              {calculatedAmount > 0 ? (
                <>
                  Credited +₹{calculatedAmount.toFixed(2)} interest on eligible balance of ₹
                  {(result.eligibleBalance ?? eligibleBalance).toLocaleString("en-IN")}.
                </>
              ) : (
                result.message || "Interest has already been calculated for today."
              )}
            </span>
          </div>
          <button
            onClick={() => setResult(null)}
            className="text-[11px] font-bold hover:underline shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
          <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
            Annual Yield Rate
          </span>
          <p className="text-2xl font-bold text-orange-600 font-instrument">
            {ratePercent.toFixed(1)}% p.a.
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Calculated daily on unallocated balance</p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
          <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
            Eligible Yield Balance
          </span>
          <p className="text-2xl font-bold text-stone-900 font-instrument">
            ₹{eligibleBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Current Smart Wallet pool</p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
          <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
            Total Interest Credited
          </span>
          <p className="text-2xl font-bold text-emerald-700 font-instrument">
            +₹{totalAccrued.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Directly added to wallet principal</p>
        </div>
      </div>

      {/* History Table */}
      {history.length > 0 && (
        <div className="pt-2 border-t border-orange-50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            Recent Accrual Entries
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {history.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 rounded-xl bg-stone-50/70 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Percent className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-stone-600 font-medium">
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 font-instrument text-sm">
                    +₹{entry.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
