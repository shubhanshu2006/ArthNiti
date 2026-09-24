"use client";

import React from "react";
import { ArrowRightIcon } from "../ui/Icons";

export default function TaxAssistantWidget() {
  return (
    <div className="bento-card group relative bg-white rounded-2xl p-6 border border-black/[0.06] flex items-stretch justify-between gap-4">
      {/* Left Column: Icon, Title, Description, Arrow Button */}
      <div className="flex-1 flex flex-col justify-between max-w-[210px]">
        <div className="space-y-3">
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Tax Assistant
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Stay tax-ready with automated tracking, deductions insights, and
              easy report generation.
            </p>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="pt-4">
          <button
            type="button"
            aria-label="Learn more about Tax Assistant"
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#3B82F6] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Mini Widget */}
      <div className="w-48 sm:w-52 bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-neutral-600">
              Estimated Tax
            </span>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight mt-1">
              ₹6,200
            </div>
          </div>

          {/* Document badge icon with subtle pulse */}
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E5533D] animate-breathing">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>

        <div className="pt-3 text-[10px] text-neutral-400">
          <span>For FY 2025-26</span>
        </div>
      </div>
    </div>
  );
}
