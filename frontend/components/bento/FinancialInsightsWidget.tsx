"use client";

import React from "react";
import { ArrowRightIcon } from "../ui/Icons";

export default function FinancialInsightsWidget() {
  return (
    <div className="bento-card group relative bg-white rounded-2xl p-6 border border-black/[0.06] flex items-stretch justify-between gap-4">
      {/* Left Column: Icon, Title, Description, Arrow Button */}
      <div className="flex-1 flex flex-col justify-between max-w-[210px]">
        <div className="space-y-3">
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] flex items-center justify-center text-[#F43F5E]">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Financial Insights
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Get clear, personalised insights to make better decisions and
              improve your financial health.
            </p>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="pt-4">
          <button
            type="button"
            aria-label="Learn more about Financial Insights"
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#F43F5E] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Mini Widget */}
      <div className="w-48 sm:w-52 bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-3.5 flex flex-col items-center justify-between shadow-2xs">
        <span className="text-[11px] font-medium text-neutral-600 self-start">
          Financial Health
        </span>

        {/* SVG Circular Meter with Constant Animated Sweep */}
        <div className="relative w-20 h-20 flex items-center justify-center my-0.5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="7"
              strokeDasharray="238.76"
              strokeDashoffset="60"
              strokeLinecap="round"
            />
            {/* Active Animated Gauge */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="url(#health_gradient)"
              strokeWidth="7.5"
              strokeDasharray="238.76"
              strokeDashoffset="75"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient
                id="health_gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
          </svg>

          {/* Orbiting particle ring */}
          <div className="absolute inset-0 rounded-full animate-gauge-sweep pointer-events-none opacity-40">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 blur-[1px]" />
          </div>

          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold text-neutral-900 leading-none">
              78
            </span>
            <span className="text-[9px] text-neutral-400 font-normal">
              /100
            </span>
          </div>
        </div>

        {/* Status Label */}
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Good
        </span>
      </div>
    </div>
  );
}
