"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  Zap,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { useAuth } from "../../lib/auth/AuthProvider";
import { DEMO_PERSONAS } from "../../lib/types/api";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Financial Command Center",
    subtitle: "Real-time earnings, intelligent micro-savings, and autonomous portfolio health.",
  },
  "/income": {
    title: "Income Stream & Volatility",
    subtitle: "Daily variance analysis, online aggregator payouts, and offline cash tracking.",
  },
  "/wallet": {
    title: "Smart Wallet & Goals",
    subtitle: "Segregated balance pools, partner interest accrual, and virtual fund allocation.",
  },
  "/goals": {
    title: "Virtual Financial Goals",
    subtitle: "Target-based savings rules for emergencies, medical buffer, and long-term wealth.",
  },
  "/recommendations": {
    title: "Investment Advisory Engine",
    subtitle: "Personalized asset allocation aligned with your cash-flow stability and risk tolerance.",
  },
  "/tax": {
    title: "Tax Assistant & Set-Aside",
    subtitle: "Section 44ADA / Presumptive tax estimations for independent gig contractors.",
  },
  "/simulator": {
    title: "What-If Income Simulator",
    subtitle: "Simulate daily earnings surges to preview autonomous savings decisions risk-free.",
  },
  "/settings": {
    title: "Preferences & Account Aggregator",
    subtitle: "Safety mode boundaries, saving percentages, and financial institution consent.",
  },
};

export default function Topbar({
  onMenuClick,
  onRunAgent,
  isAgentRunning,
}: {
  onMenuClick?: () => void;
  onRunAgent?: () => void;
  isAgentRunning?: boolean;
}) {
  const pathname = usePathname();
  const { user, loginWithEmail, logout } = useAuth();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const currentPersona = DEMO_PERSONAS.find((p) => p.email === user?.email) || DEMO_PERSONAS[0];
  const pageMeta = PAGE_TITLES[pathname] || {
    title: "Dashboard",
    subtitle: "Autonomous micro-savings for independent earners",
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-orange-100/70 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            type="button"
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-orange-100/60 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
              <span>{pageMeta.title}</span>
            </h1>
            <p className="hidden md:block text-xs text-stone-500 font-normal">
              {pageMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions, Persona Switcher & User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Interactive Persona Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/60 text-xs font-medium text-stone-800 transition-all shadow-2xs"
            >
              <span className="text-base">{currentPersona.icon}</span>
              <span className="hidden sm:inline font-semibold">{currentPersona.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-200/60 text-orange-900 font-bold uppercase">
                {currentPersona.key.replace("_", " ")}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Persona Switcher Menu */}
            {isPersonaMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsPersonaMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-orange-100 shadow-xl shadow-orange-500/10 z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-orange-50">
                    <p className="text-[11px] font-bold uppercase text-stone-400 font-inter">
                      Switch Demo Persona
                    </p>
                    <p className="text-xs text-stone-500">
                      Changes volatility curve & decision rules
                    </p>
                  </div>

                  {DEMO_PERSONAS.map((p) => {
                    const isSelected = p.email === user?.email;
                    return (
                      <button
                        key={p.key}
                        onClick={() => {
                          loginWithEmail(p.email);
                          setIsPersonaMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${isSelected
                            ? "bg-orange-50 text-orange-900 font-medium"
                            : "hover:bg-stone-50 text-stone-700"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{p.icon}</span>
                          <div>
                            <p className="text-xs font-bold leading-tight">{p.name}</p>
                            <p className="text-[10px] text-stone-400">
                              {p.label} • {p.normalIncome}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar Pill */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              type="button"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-xs shadow-orange-500/20 hover:scale-105 transition-transform"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </button>

            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-orange-100 shadow-xl shadow-orange-500/10 z-50 p-2">
                  <div className="p-3 border-b border-orange-50">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {user?.name || "Demo User"}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">
                      {user?.email || "user@fintra.internal"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 capitalize">
                      {user?.riskProfile || "Moderate"} Risk
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
