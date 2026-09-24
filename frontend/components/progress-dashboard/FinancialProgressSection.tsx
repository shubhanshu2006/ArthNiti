"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, WalletIcon, ShieldCheckIcon, DocumentTaxIcon } from "../ui/Icons";
import Reveal from "../ui/Reveal";

const chartPoints = [
  { month: "Jan", val: 24, label: "₹24,000", gigCount: "18 gigs" },
  { month: "Feb", val: 38, label: "₹38,200", gigCount: "26 gigs" },
  { month: "Mar", val: 32, label: "₹32,100", gigCount: "22 gigs" },
  { month: "Apr", val: 42, label: "₹42,000", gigCount: "31 gigs" },
  { month: "May", val: 39, label: "₹39,500", gigCount: "29 gigs" },
  { month: "Jun", val: 48.32, label: "₹48,320", gigCount: "38 gigs" },
];

export default function FinancialProgressSection() {
  const [activePoint, setActivePoint] = useState<number>(5);
  const [timeframe, setTimeframe] = useState<string>("6m");

  const current = chartPoints[activePoint];

  return (
    <section id="dashboard" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading & CTAs */}
        <Reveal className="lg:col-span-4 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            A Clear View{" "}
            <span className="font-instrument block font-normal bg-gradient-to-r from-[#E5533D] via-[#EA580C] to-[#E5533D] bg-clip-text text-transparent mt-1">
              Of Your Financial Progress
            </span>
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
            Track your earnings, savings, investments, and tax estimates - all in
            one place.
          </p>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#121212] hover:bg-neutral-800 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-98"
            >
              <span>Explore Dashboard</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        {/* Right Column: Live Interactive Dashboard Container */}
        <Reveal delay={120} className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Earnings Overview Area Chart Column (7 cols on xl) */}
            <div className="xl:col-span-7 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-black/[0.05] pb-6 xl:pb-0 xl:pr-6 space-y-4">
              {/* Header with Title and Timeframe Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    Earnings Overview
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                      ₹48,320
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center">
                      ↑ 14% (vs last 6 months)
                    </span>
                  </div>
                </div>

                {/* Pill Timeframe Filter */}
                <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-medium">
                  {["1M", "6M", "1Y", "All"].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf.toLowerCase())}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        timeframe === tf.toLowerCase()
                          ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Month Interactive Inspection Pill */}
              <div className="bg-[#FAF9F6] border border-black/[0.03] rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500">
                  Inspecting: <strong className="text-neutral-900">{current.month} 2026</strong>
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {current.label} ({current.gigCount})
                </span>
              </div>

              {/* Area SVG Chart filling container cleanly */}
              <div className="relative h-64 sm:h-72 w-full flex items-center">
                {/* Y-Axis Value Labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-neutral-400 font-mono select-none pr-2">
                  <span>₹60K</span>
                  <span>₹40K</span>
                  <span>₹20K</span>
                  <span>0</span>
                </div>

                <div className="ml-9 w-full h-full relative">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 500 240"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="earnings_gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#E5533D" stopOpacity="0.32" />
                        <stop offset="70%" stopColor="#E5533D" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#E5533D" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F2F4" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F2F4" strokeDasharray="3 3" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F2F4" strokeDasharray="3 3" />
                    <line x1="0" y1="200" x2="500" y2="200" stroke="#E5E7EB" />

                    {/* Shaded Area */}
                    <polygon
                      points="15,160 100,105 185,125 270,75 360,88 460,35 460,200 15,200"
                      fill="url(#earnings_gradient)"
                    />

                    {/* Main Trend Line */}
                    <polyline
                      fill="none"
                      stroke="#E5533D"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="15,160 100,105 185,125 270,75 360,88 460,35"
                    />

                    {/* Interactive Points */}
                    {[
                      { cx: 15, cy: 160 },
                      { cx: 100, cy: 105 },
                      { cx: 185, cy: 125 },
                      { cx: 270, cy: 75 },
                      { cx: 360, cy: 88 },
                      { cx: 460, cy: 35 },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={activePoint === i ? 6.5 : 4.5}
                          className={`${
                            activePoint === i
                              ? "fill-[#E5533D] stroke-white stroke-2 shadow-lg"
                              : "fill-white stroke-[#E5533D] stroke-2"
                          } cursor-pointer transition-all duration-200`}
                          onMouseEnter={() => setActivePoint(i)}
                        />
                        {activePoint === i && (
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r={12}
                            fill="none"
                            stroke="#E5533D"
                            strokeWidth="1.5"
                            opacity="0.5"
                            className="animate-ping"
                          />
                        )}
                      </g>
                    ))}
                  </svg>

                  {/* X Axis Months */}
                  <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-2 px-1">
                    {chartPoints.map((p, idx) => (
                      <span
                        key={p.month}
                        className={`cursor-pointer transition-colors px-1 py-0.5 rounded ${
                          activePoint === idx
                            ? "font-bold text-neutral-900 bg-neutral-100"
                            : "hover:text-neutral-700"
                        }`}
                        onMouseEnter={() => setActivePoint(idx)}
                      >
                        {p.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Summary Statistics Strip filling bottom area */}
              <div className="pt-2 border-t border-black/[0.04] grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#FAF9F6] p-2 rounded-lg border border-black/[0.03]">
                  <span className="text-[10px] text-neutral-400 block">Avg Monthly</span>
                  <span className="font-bold text-neutral-800">₹37,350</span>
                </div>
                <div className="bg-[#FAF9F6] p-2 rounded-lg border border-black/[0.03]">
                  <span className="text-[10px] text-neutral-400 block">Top Gig</span>
                  <span className="font-bold text-neutral-800">Freelance</span>
                </div>
                <div className="bg-[#FAF9F6] p-2 rounded-lg border border-black/[0.03]">
                  <span className="text-[10px] text-neutral-400 block">Active Streams</span>
                  <span className="font-bold text-emerald-600">3 Platforms</span>
                </div>
              </div>
            </div>

            {/* Metrics & Transactions (5 cols on xl) */}
            <div className="xl:col-span-5 flex flex-col justify-between gap-5">
              {/* 4 Metric Badges in 2x2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Total Savings */}
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-black/[0.04]">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <div className="w-5 h-5 rounded-md bg-rose-100 flex items-center justify-center text-[#E5533D]">
                      <WalletIcon className="w-3 h-3 text-[#E5533D]" />
                    </div>
                    <span className="text-[10px] font-medium">Total Savings</span>
                  </div>
                  <div className="text-base font-bold text-neutral-900">
                    ₹24,600
                  </div>
                </div>

                {/* Investment Value */}
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-black/[0.04]">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium">Investment Value</span>
                  </div>
                  <div className="text-base font-bold text-neutral-900">
                    ₹18,420
                  </div>
                </div>

                {/* Emergency Fund */}
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-black/[0.04]">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldCheckIcon className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-medium">Emergency Fund</span>
                  </div>
                  <div className="text-base font-bold text-neutral-900">
                    ₹45,000
                  </div>
                  <div className="mt-1.5 w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }} />
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 block">45% of goal</span>
                </div>

                {/* Estimated Tax */}
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-black/[0.04]">
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                    <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center text-amber-600">
                      <DocumentTaxIcon className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-[10px] font-medium">Estimated Tax</span>
                  </div>
                  <div className="text-base font-bold text-neutral-900">
                    ₹6,200
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 block">For FY 2025-26</span>
                </div>
              </div>

              {/* Recent Transactions List with authentic icons */}
              <div className="bg-[#FAF9F6] rounded-xl p-3.5 border border-black/[0.04]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-neutral-700">
                    Recent Transactions
                  </span>
                  <Link
                    href="#transactions"
                    className="text-[10px] font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-0.5"
                  >
                    <span>View all</span>
                    <ArrowRightIcon className="w-2.5 h-2.5" />
                  </Link>
                </div>

                <div className="space-y-2">
                  {/* Swiggy */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-black/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FC8019] flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
                        S
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 text-[11px]">
                          Swiggy Delivery
                        </div>
                        <div className="text-[9px] text-neutral-400">
                          Apr 28, 2026 &bull; 4 orders completed
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">
                      + ₹1,250
                    </span>
                  </div>

                  {/* Uber */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-black/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
                        U
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 text-[11px]">
                          Uber Ride
                        </div>
                        <div className="text-[9px] text-neutral-400">
                          Apr 26, 2026 &bull; 6 passenger trips
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">
                      + ₹2,340
                    </span>
                  </div>

                  {/* Freelance */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-black/[0.03]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
                        F
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 text-[11px]">
                          Freelance Project
                        </div>
                        <div className="text-[9px] text-neutral-400">
                          Apr 24, 2026 &bull; Mobile UI Milestone
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">
                      + ₹8,000
                    </span>
                  </div>

                  {/* Zomato */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#E23744] flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
                        Z
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 text-[11px]">
                          Zomato Delivery
                        </div>
                        <div className="text-[9px] text-neutral-400">
                          Apr 22, 2026 &bull; Weekend dinner peak
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">
                      + ₹1,080
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
