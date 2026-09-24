"use client";

import React, { useState } from "react";
import { Settings, Shield, CheckCircle2, AlertCircle, Save, Zap } from "lucide-react";
import { updateSettings } from "../../../lib/api/users";
import type { AuthUser, UserSettings } from "../../../lib/types/api";

interface Props {
  user: AuthUser;
  onUpdated?: () => void;
}

export default function SettingsForm({ user, onUpdated }: Props) {
  const [savingPercentage, setSavingPercentage] = useState<number>(
    Math.round(Number(user.savingPercentage ?? 0.15) * 100)
  );
  const [maxDailyAutoSave, setMaxDailyAutoSave] = useState<number>(
    Number(user.maxDailyAutoSave) || 200
  );
  const [minimumBalance, setMinimumBalance] = useState<number>(
    Number(user.minimumBalance) || 0
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      await updateSettings(user.id, {
        savingPercentage: Number((savingPercentage / 100).toFixed(4)),
        maxDailyAutoSave: Number(maxDailyAutoSave),
        minimumBalance: Number(minimumBalance),
      });
      setSaved(true);
      if (onUpdated) onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update financial settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/90 shadow-xs space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-inter">
            Surplus Savings Rate & Safety Limits
          </h3>
          <p className="text-xs text-stone-500">
            Configure how much of your volatile daily surplus sweeps into savings, and set protection bounds.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Rules updated successfully! The savings engine will reflect these bounds immediately.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sliders & Numerical Bounds */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/70">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Surplus Savings Rate: <strong className="text-orange-700 font-bold">{savingPercentage}%</strong>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={savingPercentage}
              onChange={(e) => setSavingPercentage(parseInt(e.target.value, 10))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <p className="text-[10px] text-stone-400 mt-1">Percentage of surplus saved above normal</p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/70">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Max Daily Auto-Save (₹)
            </label>
            <input
              type="number"
              min="50"
              step="50"
              value={maxDailyAutoSave}
              onChange={(e) => setMaxDailyAutoSave(parseInt(e.target.value, 10) || 50)}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white"
            />
            <p className="text-[10px] text-stone-400 mt-1">Hard cap on single-day deduction</p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/70">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Minimum Protected Balance (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={minimumBalance}
              onChange={(e) => setMinimumBalance(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white"
            />
            <p className="text-[10px] text-stone-400 mt-1">Wallet buffer safety reserve</p>
          </div>
        </div>

        {/* Live Calculation Preview */}
        <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-stone-900">
              Live Auto-Save Formula Preview:
            </p>
            <p className="text-stone-600 leading-relaxed">
              If your daily income is ₹1,000 above your safety baseline, a{" "}
              <strong className="text-orange-700 font-bold">{savingPercentage}%</strong> rate will automatically sweep{" "}
              <strong className="text-orange-700 font-bold">
                ₹{Math.min(maxDailyAutoSave, Math.round(1000 * (savingPercentage / 100)))}
              </strong>{" "}
              into your 7.2% APY Smart Wallet (capped at ₹{maxDailyAutoSave}/day).
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Preferences..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
