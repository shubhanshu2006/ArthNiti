"use client";

import React from "react";
import { ArrowRightIcon } from "../ui/Icons";

export default function FlexibleGoalsWidget() {
  return (
    <div className="bento-card group relative bg-white rounded-2xl p-6 border border-black/[0.06] flex items-stretch justify-between gap-4">
      {/* Left Column: Icon, Title, Description, Arrow Button */}
      <div className="flex-1 flex flex-col justify-between max-w-[210px]">
        <div className="space-y-3">
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Flexible Goals
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Set meaningful goals and let ArthNiti adapt your savings plan to your
              changing income.
            </p>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="pt-4">
          <button
            type="button"
            aria-label="Learn more about Flexible Goals"
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#8B5CF6] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all duration-200"
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
              New Laptop
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-base font-bold text-neutral-900">
              ₹36,000
            </span>
            <span className="text-[11px] text-neutral-400">/ ₹60,000</span>
          </div>
        </div>

        {/* Constant Animated Progress Bar */}
        <div className="pt-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-2.5 bg-neutral-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative"
                style={{ width: "60%" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-neutral-700">60%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
