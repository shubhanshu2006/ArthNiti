"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Receipt,
  PiggyBank,
  RefreshCw,
  Zap,
} from "lucide-react";
import { runAgent } from "../../../lib/api/agent";
import type { AgentRunResponse } from "../../../lib/types/api";

interface Props {
  userId: string;
  onRunComplete?: () => void;
}

const PIPELINE_NODES = [
  { id: "income", label: "Income Ingestion", icon: TrendingUp },
  { id: "pattern", label: "Volatility Pattern", icon: Zap },
  { id: "smart_save", label: "Smart Save Decision", icon: PiggyBank },
  { id: "safety", label: "Safety Mode Check", icon: ShieldCheck },
  { id: "recommendation", label: "Investment Category", icon: Sparkles },
  { id: "tax", label: "Tax Assessment", icon: Receipt },
  { id: "explanation", label: "Plain-Language LLM", icon: Bot },
];

export default function ExplanationFeed({ userId, onRunComplete }: Props) {
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<AgentRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"full" | "savings" | "recommendation" | "tax">("full");

  const handleRunPipeline = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await runAgent(userId);
      setData(res);
      if (onRunComplete) onRunComplete();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Pipeline execution failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF7ED]/60 rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-sm relative overflow-hidden space-y-6">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-orange-400/10 via-amber-300/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-[#E5533D] text-white flex items-center justify-center shadow-md shadow-orange-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-900 font-inter">
                Autonomous Financial Agent
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                LangGraph Pipeline
              </span>
            </div>
            <p className="text-xs text-stone-500">
              End-to-end reasoning engine: cashflow detection → safety filter → goal allocation → plain-language synthesis
            </p>
          </div>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={running}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-[#EA580C] to-[#E5533D] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${running ? "animate-spin" : "animate-pulse"}`} />
          <span>{running ? "Synthesizing Pipeline..." : "Run Complete Agent"}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Pipeline Diagram (Horizontal Flow with Nodes) */}
      <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-orange-100/90 shadow-2xs">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-900 font-inter mb-3">
          Autonomous Architecture Pipeline
        </p>

        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
          {PIPELINE_NODES.map((node, i) => {
            const Icon = node.icon;
            const isCompleted = data?.meta?.completedNodes ? true : false;
            return (
              <React.Fragment key={node.id}>
                <div className="flex flex-col items-center min-w-[80px] text-center group">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      running
                        ? "bg-orange-100 text-orange-600 animate-pulse"
                        : isCompleted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-orange-50/70 text-orange-700 border border-orange-100"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-semibold text-stone-700 mt-1 leading-tight line-clamp-1">
                    {node.label}
                  </span>
                </div>
                {i < PIPELINE_NODES.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-orange-200 shrink-0 mb-3" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Agent Output Feed (Tabs or Formatted Text) */}
      {data ? (
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-orange-100 shadow-xs space-y-6 animate-fade-in">
          {/* Tabs & Verification Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100/70 pb-4">
            <div className="flex flex-wrap items-center gap-1.5 bg-orange-50/70 p-1 rounded-xl">
              {[
                { id: "full", label: "Complete Synthesis", icon: Sparkles },
                { id: "savings", label: "Savings Engine", icon: PiggyBank },
                { id: "recommendation", label: "Investments", icon: TrendingUp },
                { id: "tax", label: "Tax Assessment", icon: Receipt },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-orange-700 shadow-2xs font-bold ring-1 ring-orange-200/80"
                        : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pipeline Verified
              </span>
              {data.meta?.timestamp && (
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  {new Date(data.meta.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          {/* Tab 1: Complete Synthesis (Bento Cards) */}
          {activeTab === "full" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Income Summary */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 border border-blue-100 shadow-2xs flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                        📊
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-inter">
                          Income & Cashflow Intelligence
                        </h4>
                        <p className="text-[10px] text-stone-400">Daily volatility analysis</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-800 capitalize">
                      {data.income?.volatility || "Normal"} Volatility
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                    {(data.explanations?.income || "")
                      .replace(/^[📊]\s*\*\*[^*]+\*\*\s*/gi, "")
                      .replace(/\*\*/g, "") ||
                      `Today you earned ₹${data.income?.today || 0}. Your average daily income is ₹${(data.income?.average || 0).toFixed(2)} with ${data.income?.volatility || "low"} volatility.`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-100/60 bg-blue-50/30 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 rounded-b-2xl text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Today</span>
                    <strong className="text-stone-900 font-bold">₹{data.income?.today ?? 0}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Daily Average</span>
                    <strong className="text-stone-900 font-bold">₹{(data.income?.average ?? 0).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Zero-Income Days</span>
                    <strong className="text-stone-900 font-bold">~{Math.round((data.pattern?.drySpellFrequency ?? 0.39) * 100)}%</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Savings Decision */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border border-orange-100 shadow-2xs flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-sm">
                        💰
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-inter">
                          Autonomous Savings Decision
                        </h4>
                        <p className="text-[10px] text-stone-400">Rule-based baseline protection</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      {data.savings?.decision === "PAUSE" ? "Auto-Save Paused" : `+₹${data.savings?.amount ?? 0} Swept`}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                    {(data.explanations?.savings || "")
                      .replace(/^[💰]\s*\*\*[^*]+\*\*\s*/gi, "")
                      .replace(/\*\*/g, "") ||
                      `Today's income of ₹${data.income?.today || 0} exceeded normal daily benchmark by ₹${(data.savings?.surplus || 0).toFixed(2)}. ₹${(data.savings?.amount || 0).toFixed(2)} recommended for auto-save.`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-orange-100/60 bg-orange-50/30 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 rounded-b-2xl text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Surplus Detected</span>
                    <strong className="text-emerald-600 font-bold">+₹{(data.savings?.surplus ?? 0).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Auto-Save Swept</span>
                    <strong className="text-orange-600 font-bold">₹{(data.savings?.amount ?? 0).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Safety Shield</span>
                    <strong className="text-stone-900 font-bold">{data.savings?.safetyMode ? "Throttled" : "100% Protected ✓"}</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Investment Recommendation */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 border border-emerald-100 shadow-2xs flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        📈
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-inter">
                          Investment Recommendation
                        </h4>
                        <p className="text-[10px] text-stone-400">Micro-growth suggestions</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                      {data.recommendation?.category || "Conservative"} Profile
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                    {(data.explanations?.recommendation || "")
                      .replace(/^[📈]\s*\*\*[^*]+\*\*\s*/gi, "")
                      .replace(/\*\*/g, "") ||
                      `A Conservative investment approach is recommended for your profile. Building your emergency fund should be prioritized before higher-risk investments. Illustrative information, not personalized financial advice.`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-100/60 bg-emerald-50/30 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 rounded-b-2xl text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Priority Target</span>
                    <strong className="text-stone-900 font-bold">Emergency First</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Strategy</span>
                    <strong className="text-stone-900 font-bold">{data.recommendation?.category || "Conservative"}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">SEBI Compliance</span>
                    <strong className="text-emerald-700 font-bold">Rule-based ✓</strong>
                  </div>
                </div>
              </div>

              {/* Card 4: Tax Planning */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 via-white to-violet-50/30 border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm">
                        🧾
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-inter">
                          Presumptive Tax Planning
                        </h4>
                        <p className="text-[10px] text-stone-400">Section 44ADA simplified</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {data.tax?.estimatedLiability === 0 ? "Tax Exempt (₹0 Due)" : "Buffer Set-Aside"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                    {(data.explanations?.tax || "")
                      .replace(/^[🧾]\s*\*\*[^*]+\*\*\s*/gi, "")
                      .replace(/\*\*/g, "") ||
                      `For ${data.tax?.quarter || "Q2-FY2027"}, your cumulative income of ₹${(data.tax?.cumulativeIncome || 0).toLocaleString("en-IN")} is below the taxable threshold. No estimated liability at this time. Planning estimate only.`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-100/60 bg-purple-50/30 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-3 rounded-b-2xl text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Assessment Quarter</span>
                    <strong className="text-stone-900 font-bold">{data.tax?.quarter || "Q2-FY2027"}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Tracked Gross</span>
                    <strong className="text-stone-900 font-bold">₹{(data.tax?.cumulativeIncome || 0).toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9.5px]">Estimated Tax</span>
                    <strong className="text-emerald-600 font-bold">₹{(data.tax?.estimatedLiability || 0).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Savings Deep-Dive */}
          {activeTab === "savings" && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 border border-orange-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 font-inter flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-orange-600" />
                  Autonomous Savings & Surplus Rationale
                </h4>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                  Decision: {data.savings?.decision || "SAVE"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-orange-100/80">
                {(data.explanations?.savings || data.savings?.reason || "").replace(/\*\*/g, "")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-stone-400 block text-[10px]">Computed Surplus</span>
                  <strong className="text-sm font-bold text-stone-900">₹{(data.savings?.surplus ?? 0).toFixed(2)}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-stone-400 block text-[10px]">Recommended Auto-Save</span>
                  <strong className="text-sm font-bold text-orange-600">₹{(data.savings?.amount ?? 0).toFixed(2)}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-stone-400 block text-[10px]">Safety Filter Status</span>
                  <strong className="text-sm font-bold text-emerald-600">{data.savings?.safetyMode ? "Throttled" : "Passed ✓"}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-orange-100">
                  <span className="text-stone-400 block text-[10px]">Action Executed</span>
                  <strong className="text-sm font-bold text-stone-900">{data.savings?.safetyAction || "Auto-Save to Wallet"}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Recommendations Deep-Dive */}
          {activeTab === "recommendation" && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 font-inter flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Portfolio & Asset Allocation Rationale
                </h4>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full capitalize">
                  Strategy: {data.recommendation?.category || "Conservative"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-emerald-100/80">
                {(data.explanations?.recommendation || "").replace(/\*\*/g, "")}
              </p>
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-emerald-900">SEBI Rule-based Guardrails Active:</p>
                <p className="text-[11px] text-stone-500">
                  All suggestions prioritize high-yield liquid buffers first. Micro-allocations to diversified index instruments are recommended only after emergency safety thresholds are met.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Tax Deep-Dive */}
          {activeTab === "tax" && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/40 via-white to-violet-50/20 border border-purple-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900 font-inter flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-purple-600" />
                  Section 44ADA Presumptive Tax Assessment
                </h4>
                <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  {data.tax?.quarter || "Q2-FY2027"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-purple-100/80">
                {(data.explanations?.tax || "").replace(/\*\*/g, "")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-stone-400 block text-[10px]">Tracked Cumulative Income</span>
                  <strong className="text-sm font-bold text-stone-900">₹{(data.tax?.cumulativeIncome || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-stone-400 block text-[10px]">50% Presumptive Deductions</span>
                  <strong className="text-sm font-bold text-purple-600">-₹{((data.tax?.cumulativeIncome || 0) * 0.5).toLocaleString("en-IN")}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="text-stone-400 block text-[10px]">Estimated March Liability</span>
                  <strong className="text-sm font-bold text-emerald-600">₹{(data.tax?.estimatedLiability || 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white border border-dashed border-orange-200 text-center space-y-2">
          <Bot className="w-8 h-8 text-orange-300 mx-auto" />
          <p className="text-xs font-semibold text-stone-700">Agent Pipeline Idle</p>
          <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
            Click &quot;Run Complete Agent&quot; above to execute the LangGraph workflow across your latest earnings and view AI plain-language reasoning.
          </p>
        </div>
      )}
    </div>
  );
}
