"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { getSavingsDecision } from "../../../lib/api/savings";
import { autoSave } from "../../../lib/api/wallet";
import type { SavingsDecisionResponse } from "../../../lib/types/api";

interface Props {
  userId: string;
  onExecuted?: () => void;
}

export default function AutoSaveTrigger({ userId, onExecuted }: Props) {
  const [decision, setDecision] = useState<SavingsDecisionResponse | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = React.useCallback(async () => {
    setEvaluating(true);
    setError(null);
    setExecuted(false);
    try {
      const res = await getSavingsDecision(userId);
      setDecision(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to compute savings decision");
    } finally {
      setEvaluating(false);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) {
      handleEvaluate();
    }
  }, [userId, handleEvaluate]);

  const handleExecute = async () => {
    if (!decision || decision.finalAmount <= 0) return;
    setExecuting(true);
    setError(null);
    try {
      await autoSave(userId, decision.finalAmount, decision.explanation || decision.smartSave?.reason || "Autonomous Smart Save");
      setExecuted(true);
      if (onExecuted) onExecuted();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Auto-save execution failed");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFBF7] via-white to-[#FFF7ED] rounded-3xl p-6 border border-orange-200/90 shadow-xs relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs shadow-orange-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-inter">
              Autonomous Savings Decision Engine
            </h3>
            <p className="text-xs text-stone-500">
              Detects surplus earnings and executes two-step rule-based micro-transfers
            </p>
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={evaluating || executing}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{evaluating ? "Evaluating..." : "Check Today's Surplus"}</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Decision Preview / Completed Card */}
      {decision && (
        <div className="mt-4 p-4 rounded-2xl bg-white border border-orange-200 shadow-2xs space-y-3 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100/70 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-orange-950 font-inter">
                  Engine Verdict
                </p>
                {decision.alreadySavedToday && decision.alreadySavedToday > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Auto-Saved Today
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {decision.explanation || decision.smartSave?.reason || "Surplus evaluated against normal baseline"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                {decision.alreadySavedToday && decision.alreadySavedToday > 0 ? "Saved Today" : "Recommended Save"}
              </span>
              <span className="text-2xl font-extrabold text-orange-600 font-instrument">
                ₹{(decision.alreadySavedToday && decision.alreadySavedToday > 0 ? decision.alreadySavedToday : decision.finalAmount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-orange-50/50">
              <span className="text-stone-400 text-[10px] block">Today&apos;s Income</span>
              <span className="font-bold text-stone-900 font-instrument text-sm">
                ₹{(decision.smartSave?.income ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50/50">
              <span className="text-stone-400 text-[10px] block">Normal Baseline</span>
              <span className="font-bold text-stone-900 font-instrument text-sm">
                ₹{Math.round(decision.smartSave?.normalIncome ?? 900).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50/50">
              <span className="text-stone-400 text-[10px] block">Surplus Afforded</span>
              <span className="font-bold text-emerald-600 font-instrument text-sm">
                ₹{Math.max(0, decision.smartSave?.surplus ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50/50">
              <span className="text-stone-400 text-[10px] block">Safety Mode</span>
              <span className="font-bold text-stone-900 text-xs">
                {!decision.safety?.safe ? "ACTIVE (Throttled)" : "NORMAL (Clear)"}
              </span>
            </div>
          </div>

          {/* Allocation breakdown or manual execute button */}
          {decision.alreadySavedToday && decision.alreadySavedToday > 0 ? (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">
                  Automatically allocated: <strong>Emergency (50%) ₹{(decision.alreadySavedToday * 0.5).toFixed(2)}</strong>, <strong>Medical (30%) ₹{(decision.alreadySavedToday * 0.3).toFixed(2)}</strong>, <strong>Growth (20%) ₹{(decision.alreadySavedToday * 0.2).toFixed(2)}</strong>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                100% Automated
              </span>
            </div>
          ) : decision.finalAmount > 0 ? (
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400">
                Rule: Will split across Emergency (50%), Medical (30%), Growth (20%)
              </span>
              <button
                onClick={handleExecute}
                disabled={executing}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-[#E5533D] rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {executing ? "Transferring..." : `Execute ₹${decision.finalAmount.toFixed(2)} Auto-Save`}
              </button>
            </div>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl">
              No surplus detected for today. Cashflow is preserved according to safety limits.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
