"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "../ui/Icons";
import Image from "next/image";

const stats = [
  { value: "10K+", label: "Gig Workers" },
  { value: "₹2.4Cr+", label: "Saved" },
  { value: "12K+", label: "Goals Created" },
  { value: "24/7", label: "AI Guidance" },
];

export default function HeroSection() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#FCFAF6] pt-12 sm:pt-16 pb-20 lg:pb-32 scroll-mt-24"
    >
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/hero-bg.png"
          width={1920}
          height={1080}
          quality={100}
          priority
          alt="ArthNiti Hero Background"
          className="w-full h-full object-cover  filter brightness-[1.02] lg:-translate-y-12 lg:translate-x-14 "
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Subtle bottom fade to blend with the Bento section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FCFAF6] via-[#FCFAF6]/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px]">
          {/* Left Column: Headline, Copy, CTA & Stats */}
          <div className="lg:col-span-6 space-y-6 pt-2 lg:-translate-x-18 lg:-translate-y-5">
            {/* Tagline Badge */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
            >
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-neutral-600 uppercase">
                Finance, On Your Terms
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[58px] font-bold tracking-tight text-neutral-900 leading-[1.12] animate-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              Make Every <br className="hidden sm:inline" />
              Earning Count <br />
              <span className="font-instrument italic font-normal bg-gradient-to-r from-[#E5533D] via-[#EA580C] to-[#E5533D] bg-clip-text text-transparent">
                Save. Invest. Grow.
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md animate-fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              For gig workers with irregular income - automatically save, invest
              smartly, and achieve your goals with the help of an intelligent
              financial agent.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-[#121212] hover:bg-neutral-800 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-98"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsPlayingDemo(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-neutral-800 bg-white/85 hover:bg-white border border-black/[0.08] rounded-xl shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <PlayIcon className="w-2.5 h-2.5 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats Row */}
            <div
              className="pt-10 border-t border-black/[0.06] max-w-lg animate-fade-in-up"
              style={{ animationDelay: "320ms" }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-[repeat(4,max-content)] gap-x-8 gap-y-5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="space-y-0.5 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      {stat.value}
                    </div>

                    <div className="text-xs text-neutral-500 font-medium whitespace-nowrap">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Left clear so the background laptop screen, notebook and coffee mug show unobstructed */}
          <div className="lg:col-span-6 hidden lg:block min-h-[480px]" />
        </div>
      </div>

      {/* Video Demo Modal */}
      {isPlayingDemo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPlayingDemo(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">
                ArthNiti Product Demo
              </h3>
              <button
                type="button"
                onClick={() => setIsPlayingDemo(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
                aria-label="Close Demo"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-neutral-900 rounded-xl flex flex-col items-center justify-center text-white text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E5533D] flex items-center justify-center animate-pulse">
                <PlayIcon className="w-5 h-5 ml-0.5" />
              </div>
              <p className="text-sm font-medium">Interactive Demo Simulation</p>
              <p className="text-xs text-neutral-400 max-w-sm">
                Watch how ArthNiti tracks irregular gig income from Swiggy, Uber,
                and freelancing to automate savings and taxes.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
