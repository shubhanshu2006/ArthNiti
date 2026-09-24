"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { DEMO_PERSONAS } from "../../../lib/types/api";

export default function GetStartedPage() {
  const router = useRouter();
  const { loginWithEmail, isLoading } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePersonaSelect = async (email: string, key: string) => {
    setSelectedPersona(key);
    setError(null);
    try {
      await loginWithEmail(email);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session.");
      setSelectedPersona(null);
    }
  };

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto">
      {/* Logo + Heading */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#E5533D] flex items-center justify-center shadow-lg shadow-orange-200/50 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">ArthNiti</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
          Choose your <span className="font-instrument italic text-[#E5533D]">persona</span>
        </h1>
        <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
          Select a gig worker profile to explore how ArthNiti adapts to different income patterns, savings behavior, and risk preferences.
        </p>
      </div>

      {/* Persona Cards */}
      <div className="grid gap-4">
        {DEMO_PERSONAS.map((persona) => {
          const isSelected = selectedPersona === persona.key;
          const isOtherLoading = isLoading && selectedPersona !== null && !isSelected;

          return (
            <button
              key={persona.key}
              onClick={() => handlePersonaSelect(persona.email, persona.key)}
              disabled={isLoading}
              className={`
                relative w-full text-left p-6 rounded-2xl border transition-all duration-300 group
                ${isSelected
                  ? "border-[#F97316] bg-gradient-to-r from-[#FFF7ED] to-[#FEF3E2] shadow-lg shadow-orange-100/50 scale-[1.02]"
                  : isOtherLoading
                    ? "border-neutral-100 bg-white/60 opacity-50 cursor-not-allowed"
                    : "border-neutral-200/60 bg-white hover:border-[#F97316]/40 hover:shadow-lg hover:shadow-orange-50/80 hover:-translate-y-1"
                }
              `}
            >
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${persona.color}15, ${persona.color}08)`,
                    border: `1px solid ${persona.color}20`,
                  }}
                >
                  {isSelected && isLoading ? (
                    <svg className="animate-spin w-6 h-6 text-[#F97316]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    persona.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-neutral-900">{persona.name}</h3>
                    <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {persona.label}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-3 leading-relaxed">{persona.description}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-neutral-500">Income:</span>
                      <span className="font-medium text-neutral-700">{persona.normalIncome}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-neutral-500">Volatility:</span>
                      <span className="font-medium text-neutral-700">{persona.volatility}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-neutral-500">Risk:</span>
                      <span className="font-medium text-neutral-700">{persona.risk}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  className={`w-5 h-5 mt-2 shrink-0 transition-all duration-200 ${
                    isSelected ? "text-[#F97316] translate-x-1" : "text-neutral-300 group-hover:text-[#F97316] group-hover:translate-x-1"
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center">
                  {isLoading ? (
                    <svg className="animate-spin w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
          <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Bottom link */}
      <p className="text-center mt-8 text-xs text-neutral-400">
        Already have a session?{" "}
        <Link href="/sign-in" className="text-[#F97316] hover:text-[#E5533D] font-medium transition-colors">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
