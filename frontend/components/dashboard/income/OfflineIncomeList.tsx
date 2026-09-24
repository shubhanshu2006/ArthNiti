"use client";

import React, { useState } from "react";
import { Trash2, DollarSign, Calendar, Tag } from "lucide-react";
import type { ManualIncomeEntry } from "../../../lib/types/api";
import { deleteManualIncome } from "../../../lib/api/income";

interface Props {
  entries: ManualIncomeEntry[];
  onDeleted?: () => void;
}

export default function OfflineIncomeList({ entries, onDeleted }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this cash entry?")) return;
    setDeletingId(id);
    try {
      await deleteManualIncome(id);
      if (onDeleted) onDeleted();
    } catch (e) {
      console.error("Failed to delete entry", e);
    } finally {
      setDeletingId(null);
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-orange-100/70 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center mb-3">
          <DollarSign className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-stone-800">No offline entries yet</p>
        <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
          Logged tips and manual cash payments will appear here with instant daily balance syncing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs">
      <h3 className="text-sm font-bold text-stone-900 mb-4 font-inter">
        Recent Manual & Cash Logs
      </h3>

      <div className="divide-y divide-orange-50">
        {entries.map((entry) => {
          const dateStr = new Date(entry.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div
              key={entry.id}
              className="py-3.5 flex items-center justify-between gap-4 group hover:bg-orange-50/30 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center font-bold text-sm">
                  ₹
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">
                    {entry.description || (entry.category ? entry.category.replace("_", " ") : "Cash Entry")}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span className="capitalize">{entry.category ? entry.category.toLowerCase().replace("_", " ") : "cash"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-stone-900 font-instrument">
                  +₹{entry.amount.toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  title="Delete Entry"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
