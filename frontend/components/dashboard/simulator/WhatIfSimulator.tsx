"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sliders, ShieldAlert, Sparkles, Lock, ArrowUpRight, CheckCircle2, RotateCcw } from "lucide-react";
import { simulateIncome } from "../../../lib/api/simulation";
import type { SimulationResponse } from "../../../lib/types/api";

interface Props {
  userId: string;
}

const PRESETS = [
  { label: "Rest Day", val: 0 },
  { label: "Slow Day", val: 400 },
  { label: "Average", val: 900 },
  { label: "Surge Shift", val: 1600 },
  { label: "Mega Weekend", val: 3200 },
];

export default function WhatIfSimulator({ userId }: Props) {
  const [amount, setAmount] = useState<number>(1600);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSimulation = useCallback(
    async (simVal: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await simulateIncome(userId, simVal);
        setData(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Simulation calculation failed");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Initial simulation call
  useEffect(() => {
    fetchSimulation(amount);
  }, [fetchSimulation, amount]);

  return (
    <div className="bg-gradient-to-br from-[#FFFBF7] via-white to-[#FFF7ED] rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-sm relative overflow-hidden space-y-6">
      {/* Top Banner with Strict Preview Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-orange-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 font-inter">
              What-If Cashflow Simulator
            </h3>
            <p className="text-xs text-stone-500">
              Drag the earnings slider to preview autonomous savings decisions in real-time
            </p>
          </div>
        </div>

        {/* Persistent Non-Mutating Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>PREVIEW ONLY — NOT SAVED TO WALLET</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Interactive Slider Section */}
      <div className="space-y-4 bg-white/90 p-6 rounded-2xl border border-orange-100 shadow-2xs">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-950 font-inter">
              Simulated Daily Earnings
            </span>
            <p className="text-xs text-stone-500">How much would you make today?</p>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-instrument">
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Custom Orange Slider */}
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-hidden"
        />

        <div className="flex justify-between text-[11px] text-stone-400 font-semibold px-0.5">
          <span>₹0 (Rest)</span>
          <span>₹1,500</span>
          <span>₹3,000</span>
          <span>₹5,000 (Peak Surge)</span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-stone-500 mr-1">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setAmount(p.val)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                amount === p.val
                  ? "bg-orange-500 text-white shadow-2xs"
                  : "bg-orange-50 hover:bg-orange-100/70 text-orange-800"
              }`}
            >
              {p.label} (₹{p.val})
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Result Breakdown */}
      {data && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                Normal Baseline
              </span>
              <p className="text-xl font-bold text-stone-800 font-instrument">
                ₹{Math.round(data.normalIncome).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-stone-400 mt-1">Rolling average</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                Calculated Surplus
              </span>
              <p className="text-xl font-bold text-emerald-700 font-instrument">
                ₹{Math.max(0, data.surplus).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-stone-400 mt-1">Above baseline</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                Engine Decision
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-0.5 ${
                  data.decision === "SAVE"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {data.decision === "SAVE" ? "SAVE SURPLUS" : "PRESERVE CASH"}
              </span>
              <p className="text-[10px] text-stone-400 mt-1">Safety rules applied</p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-orange-900 block mb-1">
                Simulated Micro-Save
              </span>
              <p className="text-2xl font-extrabold text-orange-600 font-instrument">
                ₹{data.recommendedSave.toFixed(2)}
              </p>
              <p className="text-[10px] text-orange-800 mt-0.5">Autonomous deduction</p>
            </div>
          </div>

          {/* Goal Allocation Breakdown */}
          {data.recommendedSave > 0 && data.goalAllocation && (
            <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
              <p className="text-xs font-bold text-stone-800 mb-2 font-inter">
                Simulated Allocation Split Across Virtual Goals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(data.goalAllocation).map(([goalKey, allocAmount]) => (
                  <div
                    key={goalKey}
                    className="p-3 rounded-xl bg-orange-50/50 border border-orange-100/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-stone-700 capitalize">
                        {goalKey.replace(/_/g, " ").toLowerCase()}
                      </p>
                    </div>
                    <span className="font-bold text-stone-900 font-instrument text-sm">
                      +₹{Number(allocAmount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
