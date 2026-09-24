"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArthNitiLogo, SearchIcon, ArrowRightIcon } from "../ui/Icons";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "testimonials", label: "Testimonials" },
  { id: "dashboard", label: "Dashboard" },
  { id: "about", label: "About" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll-spy: highlight whichever section currently occupies the
  // "reading band" just below the sticky header.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          // Prefer the entry closest to the top of the viewport.
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topMost.target.id);
        }
      },
      {
        // Treat the middle band of the viewport (below the sticky header)
        // as the "active" zone.
        rootMargin: "-96px 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
    setIsMobileMenuOpen(false);
  };

  const desktopLinkClass = (id: string) =>
    `relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#E5533D] after:rounded-full after:origin-left after:transition-transform after:duration-300 ${
      activeSection === id
        ? "text-neutral-900 after:scale-x-100"
        : "text-neutral-600 hover:text-neutral-900 after:scale-x-0 hover:after:scale-x-100"
    }`;

  const mobileLinkClass = (id: string) =>
    `block py-2 text-sm font-medium transition-colors ${
      activeSection === id
        ? "text-[#E5533D]"
        : "text-neutral-700 hover:text-[#E5533D]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FCFAF6]/90 backdrop-blur-md border-b border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform duration-200 group-hover:scale-105">
            <ArthNitiLogo className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            ArthNiti
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className={desktopLinkClass(link.id)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            aria-label="Search"
            suppressHydrationWarning
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04] rounded-full transition-colors"
          >
            <SearchIcon className="w-4 h-4" />
          </button>
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#121212] hover:bg-neutral-800 rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-98"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-neutral-700 hover:text-neutral-900"
          aria-label="Toggle Menu"
          suppressHydrationWarning
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#FCFAF6] border-b border-black/[0.06] space-y-3 animate-fade-in-up">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={`#${link.id}`}
              className={mobileLinkClass(link.id)}
              onClick={(e) => scrollToSection(e, link.id)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              href="/sign-in"
              className="w-full text-center py-2 text-sm font-medium text-neutral-800 border border-neutral-300 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/get-started"
              className="w-full text-center py-2 text-sm font-medium text-white bg-[#121212] rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
