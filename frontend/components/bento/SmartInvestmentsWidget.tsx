"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightIcon } from "../ui/Icons";

const investments = [
  { name: "Index Funds", color: "bg-[#E5533D]", ring: "ring-[#E5533D]/30" },
  { name: "Gold ETFs", color: "bg-amber-500", ring: "ring-amber-500/30" },
  { name: "Mutual Funds", color: "bg-blue-500", ring: "ring-blue-500/30" },
  { name: "Liquid Fund", color: "bg-indigo-600", ring: "ring-indigo-600/30" },
];

export default function SmartInvestmentsWidget() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Constant rotation of recommendation focus
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % investments.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bento-card group relative bg-white rounded-2xl p-6 border border-black/[0.06] flex items-stretch justify-between gap-4">
      {/* Left Column: Icon, Title, Description, Arrow Button */}
      <div className="flex-1 flex flex-col justify-between max-w-[210px]">
        <div className="space-y-3">
          {/* Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">
              Smart Investments
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Get personalised investment recommendations based on your financial
              behaviour and risk profile.
            </p>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="pt-4">
          <button
            type="button"
            aria-label="Learn more about Smart Investments"
            className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-[#F97316] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Mini Widget */}
      <div className="w-48 sm:w-52 bg-[#FAF9F6] border border-black/[0.04] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-neutral-600">
            Recommended for You
          </span>
          <span className="text-[9px] font-semibold text-orange-600 bg-orange-50 px-1 py-0.5 rounded">
            AI Pick
          </span>
        </div>

        {/* 4 Asset Items perfectly filling the vertical height */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-between py-0.5">
          {investments.map((item, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={item.name}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-xs border border-neutral-200 scale-[1.02]"
                    : "hover:bg-neutral-100/60 opacity-80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${item.color} ${
                      isActive ? `ring-4 ${item.ring} animate-pulse` : ""
                    }`}
                  />
                  <span
                    className={`text-[11px] ${
                      isActive
                        ? "font-semibold text-neutral-900"
                        : "text-neutral-600 font-normal"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
