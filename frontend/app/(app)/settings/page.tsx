"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";
import SettingsForm from "../../../components/dashboard/settings/SettingsForm";
import AAConsentPanel from "../../../components/dashboard/settings/AAConsentPanel";

export default function SettingsPage() {
  const { user } = useAuth();
  const userId = user?.id || "";

  if (!user) {
    return (
      <div className="py-12 text-center text-xs text-stone-400">
        Loading user preferences...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-inter">
          Preferences & Connected Financial Data
        </h2>
        <p className="text-xs text-stone-500">
          Tune autonomous saving boundaries, set your surplus savings rate, and manage Account Aggregator sync
        </p>
      </div>

      {/* Safety Rules & Surplus Savings Form */}
      <SettingsForm user={user} />

      {/* Account Aggregator Consent Panel */}
      <AAConsentPanel userId={userId} />
    </div>
  );
}
