"use client";

import React, { useState } from "react";
import { X, ArrowDownLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { deposit } from "../../../lib/api/wallet";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export default function DepositModal({ userId, isOpen, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("Manual Top-up via UPI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError("Please specify a deposit amount of at least ₹10");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deposit(userId, num, reason);
      setAmount("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-orange-100 shadow-2xl animate-fade-in-up relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-orange-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-3">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-inter">
            Deposit to Smart Wallet
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Add funds manually. Funds earn high-yield interest through our regulated partner.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200/60 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Deposit Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="10"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 font-bold text-base transition-all"
              />
            </div>
            {/* Quick chips */}
            <div className="flex items-center gap-2 mt-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q.toString())}
                  className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold transition-colors"
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Payment Reference / Source
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 text-sm font-medium transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-[#E5533D] rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing Deposit..." : "Confirm Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
