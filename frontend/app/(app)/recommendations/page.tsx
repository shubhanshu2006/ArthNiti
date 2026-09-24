"use client";

import React from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { useRecommendation } from "../../../hooks/useRecommendation";
import { useWallet } from "../../../hooks/useWallet";
import RecommendationCard from "../../../components/dashboard/recommendation/RecommendationCard";

export default function RecommendationsPage() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const { recommendation, isLoading, mutate } = useRecommendation(userId);
  const { wallet, goals } = useWallet(userId);

  const walletBalance = wallet?.balance ?? 1244.66;
  const growthGoal = goals?.find((g) => g.type === "GROWTH");
  const growthFundBalance = growthGoal ? growthGoal.allocatedBalance : Math.round(walletBalance * 0.2 * 100) / 100;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-inter">
          Investment Suggestions
        </h2>
        <p className="text-xs text-stone-500">
          Smart, simple micro-investment guidance tailored to your actual Growth Fund surplus
        </p>
      </div>

      {/* Main Active Recommendation Card */}
      <RecommendationCard
        userId={userId}
        recommendation={recommendation}
        walletBalance={walletBalance}
        growthFundBalance={growthFundBalance}
        onRegenerated={mutate}
        isLoading={isLoading}
      />
    </div>
  );
}
