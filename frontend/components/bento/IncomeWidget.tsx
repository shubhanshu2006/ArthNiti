"use client";

import React, { useState } from "react";
import { ArrowRightIcon } from "../ui/Icons";

const monthlyData = [
  { month: "Jan", height: "35%", amount: "₹24,500" },
  { month: "Feb", height: "65%", amount: "₹38,200" },
  { month: "Mar", height: "45%", amount: "₹31,000" },
  { month: "Apr", height: "88%", amount: "₹48,320" },
  { month: "May", height: "55%", amount: "₹34,800" },
  { month: "Jun", height: "72%", amount: "₹42,100" },
];

export default function IncomeWidget() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(3);

  return (
    <div className="bento-card group relative bg-white rounded-2xl p-6 border border-black/[0.06] flex items-stretch justify-between gap-4">
      {/* Left Column: Icon, Title, Description, Arrow Button */}
      <div className="flex-1 flex flex-col justify-between max-w-[210px]">
        <div className="space-y-3">
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F0] flex items-center justify-center text-[#E5533D]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="12" width="4" height="9" rx="1.5" />
              <rect x="10" y="5" width="4" height="16" rx="1.5" />
              <rect x="17" y="9" width="4" height="12" rx="1.5" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Income Intelligence
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Analyse your irregular earnings across multiple platforms and get
              real-time insights into your income patterns.
            </p>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="pt-4">
          <button
            type="button"
            aria-label="Learn more about Income Intelligence"
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#E5533D] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Mini Widget */}
      <div className="w-48 sm:w-52 bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-neutral-600">
            Variable Income
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5533D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5533D]"></span>
          </span>
        </div>

        {/* Bar Chart Container */}
        <div className="h-28 flex items-end justify-between gap-1.5 pt-1 px-1 relative">
          {monthlyData.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isApr = item.month === "Apr";

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group/bar relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(3)}
              >
                {/* Tooltip on active bar */}
                {isHovered && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-10 font-medium">
                    {item.amount}
                  </div>
                )}

                {/* Animated Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-500 relative overflow-hidden ${
                    isApr
                      ? "bg-[#E5533D] animate-bar-4 shadow-[0_2px_8px_rgba(229,83,61,0.35)]"
                      : idx % 2 === 0
                      ? "bg-[#FCA5A5]/60 hover:bg-[#F87171] animate-bar-1"
                      : "bg-[#F87171]/70 hover:bg-[#EF4444] animate-bar-3"
                  }`}
                  style={{
                    height: item.height,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 animate-shimmer" />
                </div>

                {/* Month Label */}
                <span
                  className={`text-[9px] transition-colors ${
                    isApr
                      ? "font-semibold text-neutral-800"
                      : "text-neutral-400"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
