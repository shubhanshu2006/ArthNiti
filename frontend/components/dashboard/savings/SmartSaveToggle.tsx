"use client";

import React, { useState } from "react";
import { Zap, ShieldCheck, ShieldAlert, Check } from "lucide-react";
import { enableSmartSave, pauseSmartSave } from "../../../lib/api/savings";

interface Props {
  enabled: boolean;
  onToggled?: () => void;
}

export default function SmartSaveToggle({ enabled, onToggled }: Props) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (enabled) {
        await pauseSmartSave();
      } else {
        await enableSmartSave();
      }
      if (onToggled) onToggled();
    } catch (e) {
      console.error("Failed to toggle Smart Save", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
            enabled
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-stone-100 text-stone-400 border border-stone-200"
          }`}
        >
          {enabled ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-stone-900 font-inter">
              Autonomous Smart Save
            </h4>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                enabled
                  ? "bg-emerald-100/80 text-emerald-800"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {enabled ? "Active" : "Paused"}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {enabled
              ? "Surplus earnings above your normal baseline are automatically saved into virtual goals."
              : "Autonomous transfers are temporarily paused. Manual deposits and withdrawals remain active."}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        type="button"
        aria-label="Toggle autonomous Smart Save"
        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
          enabled ? "bg-orange-500" : "bg-stone-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
