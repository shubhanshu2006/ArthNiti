"use client";

import React from "react";
import { Shield, HeartPulse, TrendingUp, Target, CheckCircle2 } from "lucide-react";
import type { GoalData } from "../../../lib/types/api";

interface Props {
  goal: GoalData;
  onEdit?: (goal: GoalData) => void;
}

const TYPE_ICONS: Record<string, typeof Shield> = {
  EMERGENCY: Shield,
  MEDICAL: HeartPulse,
  GROWTH: TrendingUp,
  CUSTOM: Target,
};

const TYPE_COLORS: Record<string, { bg: string; text: string; bar: string; border: string }> = {
  EMERGENCY: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    bar: "from-orange-500 to-amber-500",
    border: "border-orange-200/70",
  },
  MEDICAL: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    bar: "from-rose-500 to-orange-400",
    border: "border-rose-200/70",
  },
  GROWTH: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    bar: "from-emerald-500 to-teal-400",
    border: "border-emerald-200/70",
  },
  CUSTOM: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    bar: "from-amber-500 to-orange-500",
    border: "border-amber-200/70",
  },
};

export default function GoalCard({ goal, onEdit }: Props) {
  const Icon = TYPE_ICONS[goal.type] || Target;
  const colors = TYPE_COLORS[goal.type] || TYPE_COLORS.CUSTOM;

  const current = goal.allocatedBalance || 0;
  const target = goal.targetAmount || 1;
  const progressPercent = Math.min(100, Math.round((current / target) * 100));

  return (
    <div
      onClick={() => onEdit && onEdit(goal)}
      className={`bg-white rounded-3xl p-5 border ${colors.border} shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
              {goal.name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span className="capitalize">{goal.type.toLowerCase()}</span>
              <span>•</span>
              <span className="font-semibold text-stone-600">
                {goal.allocationPercentage}% Auto-Allocation
              </span>
            </div>
          </div>
        </div>

        {progressPercent >= 100 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Met
          </span>
        )}
      </div>

      {/* Figures */}
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-xs text-stone-400">Saved: </span>
          <span className="text-lg font-bold text-stone-900 font-instrument">
            ₹{current.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-stone-400">Target: </span>
          <span className="text-sm font-semibold text-stone-600 font-instrument">
            ₹{target.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          style={{ width: `${progressPercent}%` }}
          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700`}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-[11px] text-stone-400">
        <span>{progressPercent}% completed</span>
        <span>₹{Math.max(0, target - current).toLocaleString("en-IN")} remaining</span>
      </div>
    </div>
  );
}
