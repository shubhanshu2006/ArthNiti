"use client";

import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Percent,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import type { WalletTransaction } from "../../../lib/types/api";

interface Props {
  transactions: WalletTransaction[];
  isLoading?: boolean;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof ArrowDownLeft; color: string; bg: string }
> = {
  DEPOSIT: {
    label: "Deposit",
    icon: ArrowDownLeft,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  WITHDRAWAL: {
    label: "Withdrawal",
    icon: ArrowUpRight,
    color: "text-stone-700",
    bg: "bg-stone-100 border-stone-200",
  },
  AUTO_SAVE: {
    label: "Smart Save",
    icon: Sparkles,
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
  },
  INTEREST: {
    label: "Yield Credited",
    icon: Percent,
    color: "text-amber-800",
    bg: "bg-amber-50 border-amber-200",
  },
  GOAL_ALLOCATE: {
    label: "Allocation",
    icon: RefreshCw,
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
  },
};

export default function WalletLedgerTable({ transactions, isLoading }: Props) {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-orange-100 rounded w-1/4" />
        <div className="h-10 bg-orange-50 rounded" />
        <div className="h-10 bg-orange-50 rounded" />
      </div>
    );
  }

  const filtered = transactions.filter((tx) => {
    if (filter !== "ALL" && tx.type !== filter) return false;
    if (searchTerm) {
      const match =
        tx.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-orange-100/80 shadow-xs">
      {/* Table Header and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-inter">
            Audit Ledger & Money Movement
          </h3>
          <p className="text-xs text-stone-500">
            Immutable log of deposits, autonomous savings, and partner yields
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search memo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white focus:border-orange-500 focus:outline-hidden"
          >
            <option value="ALL">All Entries</option>
            <option value="AUTO_SAVE">Smart Save</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAWAL">Withdrawals</option>
            <option value="INTEREST">Interest</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-400">
          No ledger movements found matching criteria
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-orange-100/80 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-3">Transaction</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/60 text-xs">
              {filtered.map((tx) => {
                const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.DEPOSIT;
                const Icon = config.icon;
                const isPositive = tx.type === "DEPOSIT" || tx.type === "AUTO_SAVE" || tx.type === "INTEREST";
                const dateStr = new Date(tx.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={tx.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border ${config.bg} ${config.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 leading-tight">
                            {tx.reason || config.label}
                          </p>
                          <p className="text-[10px] text-stone-400">Ref: {tx.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 text-[11px] whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold font-instrument text-sm whitespace-nowrap">
                      <span className={isPositive ? "text-emerald-700" : "text-stone-800"}>
                        {isPositive ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-emerald-700 capitalize text-xs whitespace-nowrap">
                      {tx.status.toLowerCase()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
