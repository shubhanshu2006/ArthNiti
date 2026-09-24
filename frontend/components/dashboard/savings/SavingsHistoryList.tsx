"use client";

import React from "react";
import { Sparkles, ArrowDownLeft, Shield } from "lucide-react";
import type { SavingsResponse } from "../../../lib/types/api";

interface Props {
  savings?: SavingsResponse;
  isLoading?: boolean;
}

export default function SavingsHistoryList({ savings, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-orange-100 rounded w-1/4" />
        <div className="h-12 bg-orange-50 rounded" />
      </div>
    );
  }

  const history = savings?.recentHistory || [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-inter">
            Recent Savings Activity
          </h3>
          <p className="text-xs text-stone-500">Autonomous transfers and manual additions</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Saved</span>
          <p className="text-base font-bold text-orange-600 font-instrument">
            ₹{history.reduce((s, h) => s + h.amount, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-400">
          No savings runs recorded yet. Use the Smart Save engine to trigger one.
        </div>
      ) : (
        <div className="divide-y divide-orange-50">
          {history.map((h) => {
            const dateStr = new Date(h.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const isAuto = h.type === "AUTO_SAVE";

            return (
              <div key={h.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isAuto
                        ? "bg-orange-100 text-orange-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {isAuto ? <Sparkles className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">
                      {h.reason || (isAuto ? "Surplus Auto-Save" : "Deposit")}
                    </p>
                    <p className="text-[10px] text-stone-400">{dateStr}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-stone-900 font-instrument text-sm">
                    +₹{h.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-stone-400 capitalize">{h.type.toLowerCase().replace("_", " ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
