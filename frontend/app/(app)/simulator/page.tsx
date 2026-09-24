"use client";

import React from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import WhatIfSimulator from "../../../components/dashboard/simulator/WhatIfSimulator";
import { Sliders, Lightbulb, ShieldCheck, Zap } from "lucide-react";

export default function SimulatorPage() {
  const { user } = useAuth();
  const userId = user?.id || "";

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-inter">
          What-If Income Simulator
        </h2>
        <p className="text-xs text-stone-500">
          Simulate income volatility scenarios without affecting your real Smart Wallet balance
        </p>
      </div>

      {/* Main Interactive Simulator */}
      <WhatIfSimulator userId={userId} />

      {/* Engineering & Mathematical Rationale Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-inter">
              How the ArthNiti Surplus Algorithm Operates
            </h3>
            <p className="text-xs text-stone-500">
              Deterministic, non-hallucinating rule engine designed for cashflow preservation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-2">
            <p className="font-bold text-stone-900 font-inter">1. Baseline Normal Detection</p>
            <p className="text-stone-600 leading-relaxed">
              Calculates a rolling 30-day median and trimmed average of your platform payouts,
              ignoring artificial spikes and zero-earning rest days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-2">
            <p className="font-bold text-stone-900 font-inter">2. Surplus Math (No LLM Math)</p>
            <p className="text-stone-600 leading-relaxed">
              Surplus is strictly calculated as: <code>Math.max(0, todayIncome - goodDayThreshold)</code>.
              Only a configured fraction (e.g. 15%) of the excess is earmarked for saving.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-2">
            <p className="font-bold text-stone-900 font-inter">3. Safety Mode Protection</p>
            <p className="text-stone-600 leading-relaxed">
              If low earnings occur for 3+ consecutive days or the wallet balance falls below your
              minimum threshold, automatic deductions are instantly throttled or paused.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
