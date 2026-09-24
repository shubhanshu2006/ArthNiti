"use client";

import React from "react";
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, Shield, Zap } from "lucide-react";
import type { IncomeSummary, IncomeStats, TodayIncome } from "../../../lib/types/api";

interface Props {
  summary?: IncomeSummary;
  stats?: IncomeStats;
  today?: TodayIncome;
  isLoading?: boolean;
}

export default function IncomeSummaryCard({ summary, stats, today, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-orange-100/60 rounded w-1/4" />
        <div className="h-8 bg-orange-100/60 rounded w-1/2" />
        <div className="h-20 bg-orange-50 rounded" />
      </div>
    );
  }

  const todayAmount = today?.total ?? summary?.average ?? 0;
  const avgAmount = stats?.rollingAverage ?? summary?.average ?? 0;
  const isGoodDay = todayAmount > avgAmount;
  const volatility = stats?.volatilityClass ?? summary?.volatilityClass ?? "MEDIUM";
  const onlineTotal = summary?.onlineIncome ?? 0;
  const offlineTotal = summary?.offlineIncome ?? 0;
  const total = onlineTotal + offlineTotal || 1;
  const onlinePercent = Math.round((onlineTotal / total) * 100);
  const offlinePercent = 100 - onlinePercent;

  return (
    <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF7ED]/50 rounded-3xl p-6 border border-orange-100/80 shadow-xs relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-orange-400/10 via-amber-300/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-950 font-inter">
              Income Intelligence
            </h3>
            <p className="text-xs text-stone-500">Volatile cashflow classification</p>
          </div>
        </div>

        {/* Volatility Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              volatility === "LOW"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : volatility === "HIGH"
                ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                : "bg-amber-50 text-amber-800 border border-amber-200/60"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                volatility === "LOW"
                  ? "bg-emerald-500"
                  : volatility === "HIGH"
                  ? "bg-rose-500"
                  : "bg-amber-500"
              }`}
            />
            {volatility} Volatility
          </span>
        </div>
      </div>

      {/* Main Income Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Today's Income */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-orange-100/70 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Today&apos;s Earnings</span>
            {isGoodDay ? (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Surge
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-stone-400">Baseline</span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-instrument">
            ₹{todayAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            {isGoodDay ? (
              <span className="text-emerald-600 font-medium">
                +₹{Math.max(0, todayAmount - Math.round(avgAmount))} above normal
              </span>
            ) : (
              <span>Within standard band</span>
            )}
          </p>
        </div>

        {/* Rolling Baseline Average */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-orange-100/70 shadow-2xs">
          <div className="text-xs text-stone-500 mb-1">Normal Day Baseline</div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-instrument">
            ₹{Math.round(avgAmount).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            Surge threshold:{" "}
            <strong className="text-orange-700">
              ₹{Math.round(stats?.goodDayThreshold ?? avgAmount * 1.15).toLocaleString("en-IN")}
            </strong>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Auto-save kicks in above ₹{Math.round(avgAmount)}
            </span>
          </p>
        </div>

        {/* Monthly Estimate */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-orange-100/70 shadow-2xs">
          <div className="text-xs text-stone-500 mb-1">30-Day Cumulative</div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-instrument">
            ₹{(summary?.totalIncome ?? avgAmount * 26).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            Earning freq:{" "}
            <strong className="text-stone-700">
              {Math.round((summary?.earningFrequency ?? 0.85) * 100)}% of days
            </strong>
          </p>
        </div>
      </div>

      {/* Online vs Offline Revenue Distribution Bar */}
      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/80">
        <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Online (Account Aggregator): ₹{onlineTotal.toLocaleString("en-IN")} ({onlinePercent}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Offline (Cash/Tips): ₹{offlineTotal.toLocaleString("en-IN")} ({offlinePercent}%)
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-2.5 bg-orange-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${onlinePercent}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-[#E5533D] rounded-l-full transition-all duration-500"
          />
          <div
            style={{ width: `${offlinePercent}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-r-full transition-all duration-500"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2">
          <span>Dry-spell index: {((summary?.drySpellFrequency ?? 0.15) * 10).toFixed(1)}/10</span>
          <span>Safety buffer protected</span>
        </div>
      </div>
    </div>
  );
}
