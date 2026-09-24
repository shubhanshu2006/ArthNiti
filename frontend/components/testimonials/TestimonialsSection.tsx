"use client";

import React, { useState } from "react";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";

const testimonials = [
  {
    id: 1,
    quote:
      "My income varies every week, and ArthNiti helps me save automatically without thinking about it. It's simple and effective.",
    name: "Priya Sharma",
    role: "Freelance Designer",
    platform: "Freelancer / UI/UX",
    rating: 5,
    gradient: "from-rose-400 to-orange-400",
    badgeBg: "bg-orange-500",
    badgeIcon: "F",
  },
  {
    id: 2,
    quote:
      "I finally understand where my money goes. The investment suggestions actually match my goals and risk comfort.",
    name: "Harsh Upadhyay",
    role: "Ride-share Driver",
    platform: "Uber Partner",
    rating: 5,
    gradient: "from-blue-500 to-indigo-600",
    badgeBg: "bg-black",
    badgeIcon: "U",
  },
  {
    id: 3,
    quote:
      "The tax tracking feature saves me so much time. Everything I need as a gig worker is in one place.",
    name: "Ananya Verma",
    role: "Content Creator",
    platform: "YouTube & Instagram",
    rating: 5,
    gradient: "from-purple-500 to-pink-500",
    badgeBg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
    badgeIcon: "▶",
  },
  {
    id: 4,
    quote:
      "Managing fuel expenses and sudden vehicle repairs was a nightmare. ArthNiti's emergency fund auto-allocation gave me real peace of mind.",
    name: "Vikram Malhotra",
    role: "Delivery Partner",
    platform: "Zomato & Blinkit",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
    badgeBg: "bg-red-600",
    badgeIcon: "Z",
  },
  {
    id: 5,
    quote:
      "The income intelligence graph lets me forecast lean months in advance. I can finally budget for holidays without worrying about cashflow.",
    name: "Sneha Nair",
    role: "Independent Consultant",
    platform: "Upwork & TopTal",
    rating: 5,
    gradient: "from-indigo-500 to-purple-600",
    badgeBg: "bg-emerald-600",
    badgeIcon: "Up",
  },
  {
    id: 6,
    quote:
      "I used to lose thousands because I never tracked deductible GST and maintenance expenses. ArthNiti's tax assistant handles it with zero effort.",
    name: "Karan Patel",
    role: "Commercial Fleet Driver",
    platform: "Porter & Urban Co",
    rating: 5,
    gradient: "from-amber-500 to-orange-600",
    badgeBg: "bg-blue-600",
    badgeIcon: "P",
  },
];

export default function TestimonialsSection() {
  // startIndex can range from 0 to testimonials.length - 3 (on desktop) or testimonials.length - 1
  const [startIndex, setStartIndex] = useState(0);

  const maxIndex = testimonials.length - 3; // 3 visible on desktop

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="py-20 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header with Title & Arrow Controls */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Trusted by Gig Workers
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Built for the Way{" "}
            <span className="font-instrument block font-normal bg-gradient-to-r from-[#E5533D] via-[#EA580C] to-[#E5533D] bg-clip-text text-transparent mt-1">
              Gig Workers Manage Money
            </span>
          </h2>
        </div>

        {/* Arrow Navigation & Indicators */}
        <div className="flex items-center gap-3">
          {/* Page Indicators */}
          <div className="flex items-center gap-1.5 mr-2">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStartIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  startIndex === idx
                    ? "w-6 bg-[#E5533D]"
                    : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Testimonials"
            className="w-9 h-9 rounded-lg border border-black/[0.08] hover:border-black/20 bg-white hover:bg-neutral-50 active:scale-95 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all shadow-2xs"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Testimonials"
            className="w-9 h-9 rounded-lg border border-black/[0.08] hover:border-black/20 bg-white hover:bg-neutral-50 active:scale-95 flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all shadow-2xs"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testimonials Carousel Track */}
      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${startIndex * (100 / 3)}%)`,
          }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
            >
              <div className="h-full bg-white rounded-2xl p-7 border border-black/[0.06] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                {/* Quote */}
                <p className="text-neutral-700 text-sm leading-relaxed mb-6 font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author info with avatar & verified platform badge */}
                <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar with Gig Badge Overlay */}
                    <div className="relative">
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-sm shadow-inner`}
                      >
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {/* Platform Icon Badge on Photo */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${item.badgeBg} text-white flex items-center justify-center text-[8px] font-bold ring-2 ring-white shadow-xs`}
                      >
                        {item.badgeIcon}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 leading-snug flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <svg
                          className="w-3.5 h-3.5 text-blue-500 fill-blue-500"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </h4>
                      <p className="text-xs text-neutral-500">{item.role}</p>
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
