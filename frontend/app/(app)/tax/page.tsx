"use client";

import React from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { useTax } from "../../../hooks/useTax";
import TaxCard from "../../../components/dashboard/tax/TaxCard";
import { Receipt, Calendar, Info, ShieldCheck, CheckCircle2 } from "lucide-react";

const TAX_QUARTERS = [
  { quarter: "Q1", months: "Apr – Jun", due: "15 June (15%)", status: "Completed" },
  { quarter: "Q2", months: "Jul – Sep", due: "15 September (45%)", status: "Completed" },
  { quarter: "Q3", months: "Oct – Dec", due: "15 December (75%)", status: "Completed" },
  { quarter: "Q4", months: "Jan – Mar", due: "15 March (100%)", status: "Current Assessment" },
];

export default function TaxPage() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { tax, history, isLoading, mutate } = useTax(userId);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-inter">
          Tax Assistant & Advance Set-Aside
        </h2>
        <p className="text-xs text-stone-500">
          Section 44ADA presumptive taxation rules tailored specifically for independent gig earners
        </p>
      </div>

      {/* Main Tax Card */}
      <TaxCard
        userId={userId}
        tax={tax}
        onRecalculated={mutate}
        isLoading={isLoading}
      />

      {/* Advance Tax Filing Timeline Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/90 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-inter">
            FY 2025–26 Advance Tax Calendar
          </h3>
          <p className="text-xs text-stone-500">
            ArthNiti calculates automatic quarterly set-asides so you never face sudden March penalty interest (Section 234B/C)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {TAX_QUARTERS.map((q) => {
            const isCurrent = q.quarter === "Q4";
            return (
              <div
                key={q.quarter}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "border-orange-500 bg-orange-50/50 shadow-xs"
                    : "border-stone-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-900 font-inter">{q.quarter}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? "bg-orange-500 text-white"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-stone-700">{q.months}</p>
                <p className="text-[11px] text-stone-400 mt-1">Due: {q.due}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
