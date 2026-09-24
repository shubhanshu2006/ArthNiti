"use client";

import React, { useState } from "react";
import { X, Plus, DollarSign, Calendar, Tag, Check, AlertCircle } from "lucide-react";
import { createManualIncome } from "../../../lib/api/income";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = ["DELIVERY_TIPS", "CASH_TRIPS", "HANDYMAN", "FREELANCE_CASH", "OTHER"];

export default function ManualIncomeModal({ userId, isOpen, onClose, onSuccess }: Props) {
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(getTodayDateString());
  const [category, setCategory] = useState<string>("DELIVERY_TIPS");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than ₹0");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // If date selected is today's local date, send current timestamp so it matches today's window
      const datePayload =
        date === getTodayDateString() ? new Date().toISOString() : new Date(date).toISOString();

      await createManualIncome({
        userId,
        amount: numAmount,
        date: datePayload,
        category,
        description: description.trim() || `${category.replace("_", " ")} entry`,
      });
      setAmount("");
      setDescription("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record manual cash income");
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
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-inter">
            Log Offline / Cash Earnings
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Add tips, cash gig payments, or offline earnings to your daily income profile
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
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 350"
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 font-medium text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Date of Earning
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Source / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-stone-900 text-sm font-medium transition-all"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Note / Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Customer cash tip for late evening run"
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-[#E5533D] rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Recording..." : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
