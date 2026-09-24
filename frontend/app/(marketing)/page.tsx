import React from "react";
import Navbar from "../../components/navbar/Navbar";
import HeroSection from "../../components/hero/HeroSection";
import BentoGrid from "../../components/bento/BentoGrid";
import TestimonialsSection from "../../components/testimonials/TestimonialsSection";
import FinancialProgressSection from "../../components/progress-dashboard/FinancialProgressSection";
import Footer from "../../components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FCFAF6] text-[#18181B] selection:bg-[#E5533D]/15 selection:text-[#E5533D]">
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Why ArthNiti Bento Grid (6 Continuous Animated Widgets) */}
      <BentoGrid />

      {/* Testimonials from Gig Workers */}
      <TestimonialsSection />

      {/* Dashboard Progress & Financial Control Center */}
      <FinancialProgressSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
