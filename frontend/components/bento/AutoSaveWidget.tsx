"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightIcon } from "../ui/Icons";

export default function AutoSaveWidget() {
  const [savings, setSavings] = useState(4830);

  // Gentle micro-deposit tick animation
  useEffect(() => {
    const timer = setInterval(() => {
      setSavings((prev) => (prev >= 4890 ? 4830 : prev + 15));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bento-card group relative bg-white rounded-2xl p-6 border border-black/[0.06] flex items-stretch justify-between gap-4">
      {/* Left Column: Icon, Title, Description, Arrow Button */}
      <div className="flex-1 flex flex-col justify-between max-w-[210px]">
        <div className="space-y-3">
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
              <circle cx="12" cy="12" r="3" fill="#10B981" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Auto Micro-Savings
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Automatically set aside small amounts from every earning, no matter
              how irregular.
            </p>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="pt-4">
          <button
            type="button"
            aria-label="Learn more about Auto Micro-Savings"
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#10B981] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Mini Widget */}
      <div className="w-48 sm:w-52 bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-neutral-600">
              Auto-Save
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-0.5 mt-1">
            <div className="text-2xl font-bold text-neutral-900 tracking-tight transition-all duration-300">
              ₹{savings.toLocaleString()}
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span>10%</span>
              <span className="text-neutral-400 font-normal">of earnings</span>
            </div>
          </div>
        </div>

        {/* Constant Animated Progress Bar */}
        <div className="pt-3">
          <div className="relative w-full h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative"
              style={{ width: "70%" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
