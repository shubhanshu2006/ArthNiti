"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Target,
  Sparkles,
  Receipt,
  Sliders,
  Settings,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";
import { ArthNitiLogo } from "../ui/Icons";
import { useAuth } from "../../lib/auth/AuthProvider";
import { DEMO_PERSONAS } from "../../lib/types/api";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/income", label: "Income Stream", icon: TrendingUp, badge: "Daily" },
  { href: "/wallet", label: "Smart Wallet", icon: Wallet, badge: null },
  { href: "/goals", label: "Virtual Goals", icon: Target, badge: null },
  { href: "/recommendations", label: "Investments", icon: Sparkles, badge: "AI" },
  { href: "/tax", label: "Tax Assistant", icon: Receipt, badge: "Estimator" },
  { href: "/simulator", label: "What-If Simulator", icon: Sliders, badge: "Live" },
  { href: "/settings", label: "Settings & AA", icon: Settings, badge: null },
];

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user, logout, loginWithEmail } = useAuth();

  const currentPersona = DEMO_PERSONAS.find((p) => p.email === user?.email) || DEMO_PERSONAS[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFDF9]/95 backdrop-blur-md border-r border-orange-100/80 flex flex-col justify-between transition-transform duration-300 ease-out lg:translate-x-0 overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top: Brand Header */}
        <div className="px-5 py-3.5 border-b border-orange-100/60 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F97316] to-[#E5533D] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <ArthNitiLogo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-stone-900 font-inter">
                  ArthNiti
                </span>
                <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded-full bg-orange-100/80 text-orange-700">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium">Smart Autonomous Finance</p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-none flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 pb-1.5 pt-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-800/60 font-inter">
                Core Modules
              </p>
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-150 group ${isActive
                    ? "bg-gradient-to-r from-orange-500/10 to-amber-500/5 text-orange-700 font-bold shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-orange-50/50"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive
                        ? "bg-gradient-to-br from-orange-500 to-[#E5533D] text-white shadow-2xs"
                        : "text-stone-500 group-hover:text-orange-600 group-hover:bg-orange-100/50"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${isActive
                          ? "bg-orange-500/20 text-orange-800"
                          : "bg-stone-100 text-stone-600 group-hover:bg-orange-100/60 group-hover:text-orange-700"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Middle Section: Quick Persona Switcher */}
          <div className="pt-2">
            {/* 1-Click Persona Switcher */}
            <div className="px-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-800/60 font-inter mb-1.5 px-2 flex items-center justify-between">
                <span>Switch Persona</span>
                <span className="text-[9px] font-normal text-stone-400">1-Click</span>
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {DEMO_PERSONAS.map((p) => {
                  const isSelected = p.email === user?.email;
                  return (
                    <button
                      key={p.key}
                      onClick={() => {
                        loginWithEmail(p.email);
                        if (onClose) onClose();
                      }}
                      title={`${p.name} (${p.label})`}
                      className={`py-2 px-1 rounded-xl text-center text-[10px] transition-all cursor-pointer ${isSelected
                        ? "bg-gradient-to-br from-orange-500 to-[#EA580C] text-white font-bold shadow-xs ring-2 ring-orange-200"
                        : "bg-white text-stone-600 hover:bg-orange-50 hover:text-stone-900 border border-stone-200/80 shadow-2xs"
                        }`}
                    >
                      <span className="block text-sm leading-none">{p.icon}</span>
                      <span className="truncate block mt-1 text-[10px] leading-tight font-medium">
                        {p.name.split(" ")[0]}
                      </span>
                      <span className={`block text-[8px] truncate mt-0.5 ${isSelected ? "text-orange-100" : "text-stone-400"}`}>
                        {p.label.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Active Persona Card & Log Out */}
        <div className="p-3 border-t border-orange-100/80 bg-orange-50/30 shrink-0">
          <div className="p-2.5 bg-white/95 rounded-2xl border border-orange-100/70 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-base border border-orange-200/60 shrink-0">
                {currentPersona.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {user?.name || currentPersona.name}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                  <span>•</span>
                  <span className="capitalize truncate font-medium">{user?.persona || currentPersona.label}</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
