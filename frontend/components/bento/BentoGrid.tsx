"use client";

import React from "react";
import Link from "next/link";
import IncomeWidget from "./IncomeWidget";
import AutoSaveWidget from "./AutoSaveWidget";
import SmartInvestmentsWidget from "./SmartInvestmentsWidget";
import FlexibleGoalsWidget from "./FlexibleGoalsWidget";
import TaxAssistantWidget from "./TaxAssistantWidget";
import FinancialInsightsWidget from "./FinancialInsightsWidget";
import { ArrowRightIcon } from "../ui/Icons";
import Reveal from "../ui/Reveal";

const widgets = [
  IncomeWidget,
  AutoSaveWidget,
  SmartInvestmentsWidget,
  FlexibleGoalsWidget,
  TaxAssistantWidget,
  FinancialInsightsWidget,
];

export default function BentoGrid() {
  return (
    <section id="features" className="py-24 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Section Header */}
      <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Why ArthNiti?
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Everything You Need{" "}
            <span className="font-instrument block font-normal bg-gradient-to-r from-[#E5533D] via-[#EA580C] to-[#E5533D] bg-clip-text text-transparent mt-1">
              To Build Financial Stability
            </span>
          </h2>
        </div>
      </Reveal>

      {/* Bento Grid: 2 rows of 3 columns, increased card width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {widgets.map((Widget, idx) => (
          <Reveal key={Widget.name} delay={idx * 90}>
            <Widget />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
