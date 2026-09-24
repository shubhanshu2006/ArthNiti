"use client";

import React, { useState } from "react";
import { Receipt, RefreshCw, AlertCircle, Info, Landmark, Calendar, ShieldCheck } from "lucide-react";
import { calculateTax } from "../../../lib/api/tax";
import type { TaxResponse } from "../../../lib/types/api";

interface Props {
  userId: string;
  tax?: TaxResponse;
  onRecalculated?: () => void;
  isLoading?: boolean;
}

export default function TaxCard({ userId, tax, onRecalculated, isLoading }: Props) {
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecalculate = async () => {
    setCalculating(true);
    setError(null);
    try {
      await calculateTax(userId);
      if (onRecalculated) onRecalculated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to re-estimate tax");
    } finally {
      setCalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-orange-100 rounded w-1/4" />
        <div className="h-20 bg-orange-50 rounded" />
      </div>
    );
  }

  const liability = tax?.estimatedLiability ?? 0;
  const setAside = tax?.suggestedSetAside ?? 0;
  const quarter = tax?.quarter ?? "Q4 (Jan - Mar)";

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF7ED]/40 rounded-3xl p-6 border border-orange-100/90 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-inter">
              Tax Assistant & Set-Aside
            </h3>
            <p className="text-xs text-stone-500">
              Rule-based presumptive taxation for gig and freelance income
            </p>
          </div>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-xs font-semibold text-stone-700 shadow-2xs transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${calculating ? "animate-spin" : ""}`} />
          <span>{calculating ? "Estimating..." : "Recalculate"}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Tax Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase font-bold mb-1">
            <span>Assessment Period</span>
            <Calendar className="w-3 h-3 text-stone-400" />
          </div>
          <p className="text-lg font-bold text-stone-900 font-inter">{quarter}</p>
          <p className="text-[11px] text-stone-500 mt-1">Section 44ADA Presumptive</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
          <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
            Estimated Annual Liability
          </span>
          <p className="text-2xl font-bold text-stone-900 font-instrument">
            ₹{liability.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            After 50% presumptive business deduction
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 shadow-2xs">
          <div className="flex items-center justify-between text-orange-900 text-[10px] uppercase font-bold mb-1">
            <span>Suggested Set-Aside</span>
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-700 font-instrument">
            ₹{setAside.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-orange-800 mt-1">
            Recommended liquid buffer to prevent March penalties
          </p>
        </div>
      </div>

      {/* Section 44ADA Presumptive Computation Breakdown */}
      <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900 font-inter">
            Section 44ADA Presumptive Computation Breakdown
          </span>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {liability === 0 ? "Tax Exempt (₹0 Due)" : "Advance Tax Due"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-100">
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Tracked Gross Receipts</p>
            <p className="text-sm font-bold text-stone-900 font-instrument mt-0.5">
              ₹{(tax?.cumulativeIncome ?? 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-100">
            <p className="text-[10px] text-stone-400 uppercase font-semibold">50% Presumptive Expenses</p>
            <p className="text-sm font-bold text-emerald-700 font-instrument mt-0.5">
              -₹{((tax?.cumulativeIncome ?? 0) * 0.5).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-100">
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Net Taxable Profit (50%)</p>
            <p className="text-sm font-bold text-stone-900 font-instrument mt-0.5">
              ₹{((tax?.cumulativeIncome ?? 0) * 0.5).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-100">
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Sec 87A Zero-Tax Limit</p>
            <p className="text-sm font-bold text-stone-700 font-instrument mt-0.5">
              Up to ₹7,00,000
            </p>
          </div>
        </div>

        {tax?.explanation && (
          <p className="text-[11px] text-stone-600 pt-2 border-t border-orange-100/70 leading-relaxed">
            {tax.explanation}
          </p>
        )}
      </div>

      {/* Tax disclaimer */}
      <div className="flex items-start gap-2 pt-2 border-t border-orange-100/70 text-[11px] text-stone-400">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
        <p>
          <strong>Tax Estimator Disclaimer:</strong> Calculations are indicative estimates based
          on presumptive tax rules for independent contractors in India. ArthNiti does not provide
          formal tax filing or chartered accountancy services. Please consult an authorized CA.
        </p>
      </div>
    </div>
  );
}
