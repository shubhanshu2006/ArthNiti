"use client";

import React, { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Landmark,
  Coins,
  Lock,
  Info,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { generateRecommendation } from "../../../lib/api/recommendation";
import type { RecommendationResponse } from "../../../lib/types/api";

interface Props {
  userId: string;
  recommendation?: RecommendationResponse;
  walletBalance?: number;
  growthFundBalance?: number;
  onRegenerated?: () => void;
  isLoading?: boolean;
}

export default function RecommendationCard({
  userId,
  recommendation,
  walletBalance = 1244.66,
  growthFundBalance,
  onRegenerated,
  isLoading,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await generateRecommendation(userId);
      if (onRegenerated) onRegenerated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to refresh recommendation");
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-orange-100 rounded w-1/4" />
        <div className="h-24 bg-orange-50 rounded" />
      </div>
    );
  }

  const category = (recommendation?.category?.toUpperCase() || "GROWTH") as
    | "CONSERVATIVE"
    | "BALANCED"
    | "GROWTH";

  // Calculate actual growth fund and emergency safety pool
  const totalSavings = walletBalance > 0 ? walletBalance : 1244.66;
  const growthFund =
    growthFundBalance !== undefined && growthFundBalance > 0
      ? growthFundBalance
      : Math.round(totalSavings * 0.2 * 100) / 100;
  const emergencyReserve = Math.max(0, totalSavings - growthFund);

  // Simple, human-friendly asset allocation buckets based on the actual Growth Fund amount
  const getBuckets = () => {
    if (category === "CONSERVATIVE") {
      return [
        {
          name: "Safe High-Yield Liquid Deposits",
          subtitle: "100% liquid bank deposits",
          share: "70%",
          amount: Math.round(growthFund * 0.7 * 100) / 100,
          expectedReturn: "7.2% daily interest",
          icon: Landmark,
          iconBg: "bg-emerald-100 text-emerald-700",
          simpleDesc:
            "Your money stays safe like a fixed deposit. No market risk, instant withdrawal anytime for bills.",
        },
        {
          name: "India's Top 50 Companies (Index)",
          subtitle: "Blue-chip leaders (Tata, Reliance)",
          share: "20%",
          amount: Math.round(growthFund * 0.2 * 100) / 100,
          expectedReturn: "~12-14% p.a. long-term",
          icon: TrendingUp,
          iconBg: "bg-blue-100 text-blue-700",
          simpleDesc:
            "Small gentle step into wealth building by owning India's biggest brands.",
        },
        {
          name: "Digital 24K Gold",
          subtitle: "Inflation shield",
          share: "10%",
          amount: Math.round(growthFund * 0.1 * 100) / 100,
          expectedReturn: "Gold market rate",
          icon: Coins,
          iconBg: "bg-amber-100 text-amber-700",
          simpleDesc:
            "A tiny gold cushion to protect your purchasing power over time.",
        },
      ];
    }

    if (category === "BALANCED") {
      return [
        {
          name: "India's Top 50 Companies (Nifty 50)",
          subtitle: "Blue-chip index fund",
          share: "50%",
          amount: Math.round(growthFund * 0.5 * 100) / 100,
          expectedReturn: "~12-14% p.a. long-term",
          icon: TrendingUp,
          iconBg: "bg-blue-100 text-blue-700",
          simpleDesc:
            "Half of your growth fund grows with India's largest companies (Nifty 50).",
        },
        {
          name: "Government & Bank Debt Bonds",
          subtitle: "Fixed steady interest",
          share: "40%",
          amount: Math.round(growthFund * 0.4 * 100) / 100,
          expectedReturn: "~7.5% stable yield",
          icon: Landmark,
          iconBg: "bg-emerald-100 text-emerald-700",
          simpleDesc:
            "Safe government-backed securities that cushion you against stock market dips.",
        },
        {
          name: "Digital 24K Gold",
          subtitle: "Safe-haven asset",
          share: "10%",
          amount: Math.round(growthFund * 0.1 * 100) / 100,
          expectedReturn: "Gold market rate",
          icon: Coins,
          iconBg: "bg-amber-100 text-amber-700",
          simpleDesc:
            "Digital micro-gold that you can convert or redeem whenever needed.",
        },
      ];
    }

    // Default: GROWTH
    return [
      {
        name: "Top 50 Indian Companies (Nifty 50 Index)",
        subtitle: "Household names: Tata, Infosys, Reliance, HDFC",
        share: "75%",
        amount: Math.round(growthFund * 0.75 * 100) / 100,
        expectedReturn: "~12–14% p.a. historical",
        icon: TrendingUp,
        iconBg: "bg-orange-100 text-orange-700",
        simpleDesc:
          "Invests in India's top 50 companies for wealth compounding. Recommended for your higher earning surplus.",
      },
      {
        name: "Safe High-Yield Cash Reserve",
        subtitle: "Instant liquidity buffer in bank account",
        share: "25%",
        amount: Math.round(growthFund * 0.25 * 100) / 100,
        expectedReturn: "7.2% APY guaranteed",
        icon: ShieldCheck,
        iconBg: "bg-emerald-100 text-emerald-700",
        simpleDesc:
          "Zero market risk. Kept liquid so you can withdraw immediately if client milestone payments get delayed.",
      },
    ];
  };

  const buckets = getBuckets();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-xs space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-900 font-inter">
                Simple Investment Plan for Everyday Earners
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                {category} Plan
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Clear suggestions for putting your extra surplus to work without touching your emergency cash
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-xs font-semibold text-orange-800 shadow-2xs transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
          <span>{generating ? "Recalculating..." : "Refresh Suggestion"}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* 2-Layer Safety Model Visual Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Layer 1: Emergency & Living Cash (Untouched) */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              1. Safe Living & Emergency Reserve
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
              100% Protected
            </span>
          </div>
          <p className="text-2xl font-bold text-stone-900 font-instrument">
            ₹{emergencyReserve.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Kept safely in your partner bank wallet earning <strong>7.2% daily interest</strong>. Never invested in stocks, so you always have cash for rent, groceries, and medical emergencies.
          </p>
        </div>

        {/* Layer 2: Growth Fund (Suggested for Wealth Building) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50/30 to-orange-100/40 border border-orange-200 space-y-1.5 ring-2 ring-orange-200/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-950">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              2. Your Available Growth Fund
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-2xs">
              Ready to Grow
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-700 font-instrument">
            ₹{growthFund.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-orange-900 leading-relaxed">
            This is your surplus cash allocated from good earning days. Below is how you can simply divide this <strong>₹{growthFund.toFixed(2)}</strong> to build wealth.
          </p>
        </div>
      </div>

      {/* Suggested Allocation Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Suggested Breakdown for Your ₹{growthFund.toFixed(2)} Growth Fund
          </h4>
          <span className="text-[11px] text-stone-400">
            Micro-allocations based on your {category.toLowerCase()} profile
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {buckets.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-orange-200 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl ${b.iconBg} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-lg">
                      {b.share}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-stone-900">{b.name}</h5>
                    <p className="text-[10px] text-stone-400">{b.subtitle}</p>
                  </div>

                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {b.simpleDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Suggested Amount</span>
                    <span className="text-sm font-bold text-stone-900 font-instrument">
                      ₹{b.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {b.expectedReturn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple 3 Rules for Normal Everyday People */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2.5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-orange-600" />
          <h5 className="text-xs font-bold text-stone-900">
            3 Simple Rules of How This Protects You
          </h5>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-stone-600">
          <div className="space-y-0.5">
            <p className="font-bold text-stone-800">1. Emergency Cash is Sacred</p>
            <p className="text-stone-500">
              Your ₹{emergencyReserve.toFixed(0)} safety reserve is never touched. You can withdraw it anytime for unexpected bills.
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-stone-800">2. Starts With Small Change</p>
            <p className="text-stone-500">
              You don't need thousands. You can invest as little as ₹10 to ₹50 whenever you have a good earning day.
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-stone-800">3. Automatically Pauses</p>
            <p className="text-stone-500">
              If your income has a slow week below normal baseline, all micro-investing pauses automatically so your living cash stays full.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory SEBI Disclaimer */}
      <div className="flex items-start gap-2 pt-2 border-t border-orange-100/70 text-[11px] text-stone-400">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-400" />
        <p>
          <strong>Statutory SEBI Disclaimer:</strong> ArthNiti provides automated, rule-based educational
          micro-investment suggestions for illustrative purposes only, <strong>not personalized financial advice</strong>.
          ArthNiti is not a registered SEBI investment advisor. Securities investments are subject to market risks.
          Past returns are not indicative of future performance.
        </p>
      </div>
    </div>
  );
}

