"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { GoalData } from "../../../lib/types/api";

interface Props {
  goals: GoalData[];
}

const COLORS = ["#F97316", "#FB923C", "#F59E0B", "#10B981", "#6366F1"];

export default function GoalAllocationDonut({ goals }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeGoals = goals.filter((g) => g.status !== "ARCHIVED");

  const chartData = activeGoals.map((g) => ({
    name: g.name,
    value: g.allocationPercentage || 1,
    allocated: g.allocatedBalance || 0,
    target: g.targetAmount || 0,
  }));

  const totalAllocated = activeGoals.reduce((sum, g) => sum + (g.allocatedBalance || 0), 0);

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-stone-900 font-inter mb-1">
          Automated Goal Allocation Rule
        </h3>
        <p className="text-xs text-stone-500">
          How every Smart Save rupee is partitioned across goals
        </p>
      </div>

      <div className="relative h-56 sm:h-64 my-2 flex items-center justify-center">
        {mounted && chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-2xl border border-orange-100 shadow-lg text-xs space-y-1">
                          <p className="font-bold text-stone-900">{item.name}</p>
                          <p className="text-orange-600 font-semibold">
                            Split Rule: {item.value}% of auto-savings
                          </p>
                          <p className="text-stone-500 text-[11px]">
                            Saved: ₹{item.allocated.toLocaleString("en-IN")}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-medium text-stone-400">Total in Goals</span>
              <span className="text-xl font-bold text-stone-900 font-instrument">
                ₹{totalAllocated.toLocaleString("en-IN")}
              </span>
            </div>
          </>
        ) : (
          <div className="text-xs text-stone-400">No active goals configured</div>
        )}
      </div>

      {/* Legend */}
      <div className="space-y-1.5 pt-2 border-t border-orange-50">
        {activeGoals.map((g, i) => (
          <div key={g.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="font-medium text-stone-700">{g.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-900">{g.allocationPercentage}%</span>
              <span className="text-stone-400 text-[11px]">
                ₹{(g.allocatedBalance || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
