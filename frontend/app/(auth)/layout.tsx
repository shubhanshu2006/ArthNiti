import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — ArthNiti",
  description: "Sign in to your ArthNiti account to manage your savings, investments, and financial goals.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCFAF6] via-[#FFF7ED] to-[#FEF3E2] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#F97316]/8 to-[#EA580C]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#E5533D]/6 to-[#F97316]/4 blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24, 24, 27, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24, 24, 27, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  );
}
