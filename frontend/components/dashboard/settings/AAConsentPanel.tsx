"use client";

import React, { useState } from "react";
import { Landmark, RefreshCw, CheckCircle2, ShieldCheck, Trash2, AlertCircle } from "lucide-react";
import { syncFinancialData, createConsent, revokeConsent } from "../../../lib/api/aa";
import type { AAConsent } from "../../../lib/types/api";

interface Props {
  userId: string;
  consent?: AAConsent | null;
  onSynced?: () => void;
}

export default function AAConsentPanel({ userId, consent, onSynced }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSyncResult(null);
    try {
      const res = await syncFinancialData(userId);
      setSyncResult(`Synced ${res.transactions} new transactions via Account Aggregator gateway.`);
      if (onSynced) onSynced();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Financial sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/90 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 font-inter">
                Account Aggregator (AA) Ecosystem
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                RBI Compliant
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Consent-driven financial data ingestion without sharing banking credentials
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-orange-800 shadow-2xs transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Syncing Gateway..." : "Sync Aggregator Data"}</span>
        </button>
      </div>

      {syncResult && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncResult}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-bold text-stone-900">
              Consent Active (FIP: Swiggy, Zomato, Uber, Bank Statements)
            </p>
            <p className="text-[11px] text-stone-500">
              Purpose: Automated Income Detection & Micro-Savings · Encrypted End-to-End
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-stone-400">Status:</span>
          <span className="font-bold text-emerald-700">AUTHORIZED</span>
        </div>
      </div>
    </div>
  );
}
