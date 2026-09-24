"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Calendar, Filter } from "lucide-react";
import type { DailyIncome } from "../../../lib/types/api";

interface Props {
  daily: DailyIncome[];
  baseline?: number;
  goodDayThreshold?: number;
}

export default function IncomeTrendChart({
  daily,
  baseline = 900,
  goodDayThreshold = 1050,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<"7d" | "14d" | "30d">("14d");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter daily based on selected range
  const sorted = [...daily].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sliceCount = range === "7d" ? 7 : range === "14d" ? 14 : 30;
  const data = sorted.slice(-sliceCount).map((d) => {
    const parsed = new Date(d.date);
    const day = parsed.getDate();
    const month = parsed.toLocaleString("default", { month: "short" });
    return {
      date: `${day} ${month}`,
      total: d.total,
      online: d.online,
      offline: d.offline,
    };
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs relative">
      {/* Header with Title and Range Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-inter flex items-center gap-2">
            <span>Daily Cash Flow Pattern</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              Live Variance
            </span>
          </h3>
          <p className="text-xs text-stone-500">
            Dotted line indicates normal threshold where Smart Save engages
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center bg-orange-50/80 p-1 rounded-xl border border-orange-100 text-xs font-semibold">
          {(["7d", "14d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg uppercase transition-all ${
                range === r
                  ? "bg-white text-orange-700 shadow-2xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FB923C" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="offlineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v}`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-orange-100 shadow-lg text-xs space-y-1">
                        <p className="font-bold text-stone-900">{item.date}</p>
                        <p className="text-orange-600 font-semibold text-sm">
                          Total: ₹{item.total.toLocaleString("en-IN")}
                        </p>
                        <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100 flex items-center justify-between gap-4">
                          <span>Online: ₹{item.online}</span>
                          <span>Offline: ₹{item.offline}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Normal Baseline Reference Line */}
              {baseline > 0 && (
                <ReferenceLine
                  y={baseline}
                  stroke="#EA580C"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Baseline ₹${baseline}`,
                    fill: "#EA580C",
                    fontSize: 10,
                    position: "right",
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey="total"
                stroke="#F97316"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
            Loading chart analytics...
          </div>
        )}
      </div>

      {/* Legend & Callout */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-orange-50 text-xs text-stone-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Total Daily Earnings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-orange-600" />
            Baseline Earning Level
          </span>
        </div>
        <p className="text-[11px] text-stone-400">
          Surplus over baseline triggers automated goal micro-savings
        </p>
      </div>
    </div>
  );
}
