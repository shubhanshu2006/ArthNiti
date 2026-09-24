"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArthNitiLogo,
  LinkedInIcon,
  XTwitterIcon,
  YouTubeIcon,
  InstagramIcon,
  ArrowRightIcon,
} from "../ui/Icons";
import Reveal from "../ui/Reveal";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer id="about" className="w-full bg-[#FCFAF6] border-t border-black/[0.06] pt-16 pb-12 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-black/[0.05]">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <ArthNitiLogo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                ArthNiti
              </span>
            </Link>
            <p className="text-xs text-neutral-500 max-w-xs">
              For Independent Earners. A Brighter Tomorrow.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-neutral-600">
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#E5533D] hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="#x"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#E5533D] hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200"
              >
                <XTwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#E5533D] hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-[#E5533D] hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Links: Product (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-semibold text-neutral-900 tracking-wider">
              Product
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#features" className="hover:text-neutral-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#dashboard" className="hover:text-neutral-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-neutral-900 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#whats-new" className="hover:text-neutral-900 transition-colors">
                  What&apos;s New
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Resources (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-semibold text-neutral-900 tracking-wider">
              Resources
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#blog" className="hover:text-neutral-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#guides" className="hover:text-neutral-900 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#help" className="hover:text-neutral-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#community" className="hover:text-neutral-900 transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-semibold text-neutral-900 tracking-wider">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <Link href="#about" className="hover:text-neutral-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#careers" className="hover:text-neutral-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-neutral-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-neutral-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-neutral-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter (2 cols on lg, full on sm) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-semibold text-neutral-900 tracking-wider">
              Subscribe to our newsletter
            </h5>
            <p className="text-[11px] text-neutral-500">
              Get financial tips, product updates and more.
            </p>
            <form onSubmit={handleSubmit} className="relative mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full text-xs bg-white border border-neutral-300 rounded-lg pl-3 pr-9 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#E5533D] focus:border-[#E5533D]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 bottom-1 w-7 bg-neutral-900 hover:bg-[#E5533D] text-white rounded-md flex items-center justify-center transition-colors"
              >
                <ArrowRightIcon className="w-3 h-3" />
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[11px] text-emerald-600 font-medium">
                Thank you for subscribing!
              </p>
            )}
          </div>
        </Reveal>

        {/* Bottom Bar with Copyright & Cursive Doodle */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            &copy; 2026 ArthNiti. All rights reserved.
          </p>

          {/* Cursive Handwriting Doodle */}
          <div className="flex items-center gap-2 select-none">
            <span
              className="text-[#E5533D] text-lg font-instrument italic tracking-wide"
              style={{ transform: "rotate(-3deg)" }}
            >
              Smarter Money Happier You
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
