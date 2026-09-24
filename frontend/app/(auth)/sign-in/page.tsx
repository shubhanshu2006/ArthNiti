"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth/AuthProvider";
import { DEMO_PERSONAS } from "../../../lib/types/api";

export default function SignInPage() {
  const router = useRouter();
  const { loginWithEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmail(email);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please use a demo account.");
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    try {
      await loginWithEmail(demoEmail);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Logo + Heading */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#E5533D] flex items-center justify-center shadow-lg shadow-orange-200/50 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">ArthNiti</span>
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome <span className="font-instrument italic text-[#E5533D]">back</span>
        </h1>
        <p className="text-neutral-500 text-sm">
          Sign in with a demo account to explore your financial dashboard
        </p>
      </div>

      {/* Sign-in Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-xl shadow-black/[0.03] p-8">
        {/* Quick Login — Demo Personas */}
        <div className="mb-6">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Quick Demo Login</p>
          <div className="space-y-2">
            {DEMO_PERSONAS.map((persona) => (
              <button
                key={persona.key}
                onClick={() => handleQuickLogin(persona.email)}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-[#F97316]/30 hover:bg-[#FFF7ED]/50 transition-all duration-200 group text-left disabled:opacity-50"
              >
                <span className="text-2xl">{persona.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 group-hover:text-[#E5533D] transition-colors">
                    {persona.name}
                  </p>
                  <p className="text-xs text-neutral-400">{persona.label} · {persona.normalIncome}</p>
                </div>
                <svg className="w-4 h-4 text-neutral-300 group-hover:text-[#F97316] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-neutral-400 font-medium tracking-wider">or enter email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-neutral-500 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ravi.kumar@demo.com"
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-all"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-[#F97316] to-[#E5533D] rounded-xl shadow-lg shadow-orange-200/40 hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      {/* Bottom link */}
      <p className="text-center mt-6 text-xs text-neutral-400">
        New here?{" "}
        <Link href="/get-started" className="text-[#F97316] hover:text-[#E5533D] font-medium transition-colors">
          Choose a persona to get started →
        </Link>
      </p>
    </div>
  );
}
