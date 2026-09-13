"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Search,
} from "lucide-react";

export function GlobalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "sm" | "lg">("normal");
  const [currentLang, setCurrentLang] = useState<"en" | "hi">("en");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/students", label: "For Learners" },
    { href: "/institutions", label: "For Institutions" },
    { href: "/employers", label: "For Industry" },
    { href: "/skill-assessment", label: "Skill Assessment" },
    { href: "/opportunities", label: "Opportunities" },
    { href: "/demo", label: "Interactive Demo" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full bg-white transition-all duration-200 border-b border-[#D9E1EA] shadow-2xs">
      {/* ──────────────────────────────────────────────────────────
          TOP OFFICIAL GOVERNMENT UTILITY BAR (Exact Reference Match)
          ────────────────────────────────────────────────────────── */}
      <div className="bg-[#F8FAFC] text-[#334155] text-[11.5px] font-medium border-b border-[#E2E8F0] relative z-10">
        {/* Subtle 3px India Tricolor Accent Line across top */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#F4A11A] via-white to-[#138808]" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Government of India | Ministry of Education | Government of Jharkhand */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-[#334155] font-semibold flex-wrap">
            <span className="text-[#123B6D] hover:text-[#1E5AA8] transition-colors cursor-default">
              Government of India
            </span>
            <span className="text-[#CBD5E1]">|</span>
            <span className="text-[#334155] hover:text-[#123B6D] transition-colors cursor-default">
              Ministry of Education
            </span>
            <span className="text-[#CBD5E1]">|</span>
            <span className="text-[#138808] font-bold hover:text-[#0F6806] transition-colors cursor-default">
              Government of Jharkhand
            </span>
          </div>

          {/* Right: Skip to Main Content | A- | A | A+ | English ▼ | हिन्दी */}
          <div className="flex items-center gap-2.5 ml-auto text-[#475569] text-[11.5px]">
            <a
              href="#main-content"
              className="hover:text-[#123B6D] underline underline-offset-2 hidden lg:inline font-medium text-[#475569]"
            >
              Skip to Main Content
            </a>
            <span className="text-[#CBD5E1] hidden lg:inline">|</span>

            {/* Font Size Adjusters */}
            <div className="inline-flex items-center gap-1.5 font-medium">
              <button
                onClick={() => setFontSizeLevel("sm")}
                title="Decrease Font Size"
                className={`hover:text-[#123B6D] px-0.5 ${fontSizeLevel === "sm" ? "text-[#1E5AA8] font-bold" : ""}`}
              >
                A-
              </button>
              <span className="text-[#CBD5E1]">|</span>
              <button
                onClick={() => setFontSizeLevel("normal")}
                title="Default Font Size"
                className={`hover:text-[#123B6D] px-0.5 ${fontSizeLevel === "normal" ? "text-[#1E5AA8] font-bold" : ""}`}
              >
                A
              </button>
              <span className="text-[#CBD5E1]">|</span>
              <button
                onClick={() => setFontSizeLevel("lg")}
                title="Increase Font Size"
                className={`hover:text-[#123B6D] px-0.5 ${fontSizeLevel === "lg" ? "text-[#1E5AA8] font-bold" : ""}`}
              >
                A+
              </button>
            </div>

            <span className="text-[#CBD5E1]">|</span>

            {/* Language Switch */}
            <div className="flex items-center gap-1.5 font-medium">
              <button
                onClick={() => setCurrentLang("en")}
                className={`inline-flex items-center gap-0.5 hover:text-[#123B6D] ${
                  currentLang === "en" ? "text-[#123B6D] font-bold" : ""
                }`}
              >
                <span>English</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <span className="text-[#CBD5E1]">|</span>
              <button
                onClick={() => setCurrentLang("hi")}
                className={`hover:text-[#123B6D] ${
                  currentLang === "hi" ? "text-[#123B6D] font-bold" : ""
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MAIN HEADER ROW (Exact Reference Match)
          ────────────────────────────────────────────────────────── */}
      <div
        className={`max-w-[1440px] mx-auto px-4 sm:px-8 transition-all duration-200 flex items-center justify-between gap-4 ${
          isScrolled ? "py-2" : "py-2.5 sm:py-3"
        }`}
      >
        {/* Left: Ashoka Lion Emblem + VRIDHI Branding */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {/* Prominent Ashoka Emblem with Satyameva Jayate (exact reference visual match) */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ashoka_emblem.jpg"
              alt="Government of India Emblem - Satyameva Jayate"
              className="h-12 w-auto object-contain drop-shadow-2xs group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Vridhi Wordmark + Subtitle + SIH Badge */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-black tracking-tight text-[#123B6D] leading-none flex items-center">
                VRIDHI
                <TrendingUp className="w-4 h-4 text-[#138808] ml-0.5 stroke-[3]" />
              </span>
              <span className="bg-[#1E5AA8]/10 text-[#1E5AA8] text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#1E5AA8]/20">
                SIH 2026 MVP
              </span>
            </div>
            <span className="text-[11.5px] font-bold text-[#172033] tracking-tight leading-tight mt-0.5">
              National Skill &amp; Career Growth Portal
            </span>
            <span className="text-[10px] font-medium text-[#5B6575] tracking-tight leading-none mt-0.5 hidden sm:block">
              Where Skills Grow. Opportunities Multiply.
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation (Clean, evenly aligned, subtle active indicator) */}
        <nav className="hidden xl:flex items-center gap-1 text-[13.5px] font-medium text-[#334155]">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#123B6D] font-bold"
                    : "text-[#334155] hover:text-[#123B6D] hover:bg-[#F8FAFC]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#1E5AA8] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs: Search icon, Sign In, Get Started */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Circular Search Icon Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="h-9 w-9 rounded-full bg-[#F1F5F9] text-[#334155] hover:text-[#123B6D] hover:bg-[#E2E8F0] flex items-center justify-center transition border border-[#E2E8F0]"
            aria-label="Search Portal"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sign In Button: White background + Blue border */}
          <Link
            href="/login"
            className="h-9 px-4 text-[13px] font-bold text-[#123B6D] bg-white hover:bg-[#F8FAFC] rounded-lg border border-[#1E5AA8] transition duration-150 inline-flex items-center justify-center shadow-2xs"
          >
            Sign In
          </Link>

          {/* Get Started Button: Solid Government Blue + White Text */}
          <Link
            href="/get-started"
            className="h-9 px-4 text-[13px] font-bold text-white bg-[#1E5AA8] hover:bg-[#123B6D] rounded-lg shadow-xs hover:shadow transition duration-150 inline-flex items-center justify-center gap-1.5 group"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/get-started"
            className="h-8 px-2.5 text-xs font-bold text-white bg-[#1E5AA8] rounded-md inline-flex items-center"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-[#172033] hover:bg-slate-100 border border-[#CBD5E1]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 sm:px-8 py-2.5"
          >
            <div className="max-w-[1440px] mx-auto flex items-center gap-2">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search skills, opportunities, institutes, Jharkhand placement drives..."
                className="w-full bg-transparent text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-hidden py-1"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] px-2 py-0.5"
              >
                ESC
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-[#D9E1EA] bg-white px-4 py-4 space-y-1.5 shadow-xl"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md ${
                  pathname === item.href
                    ? "font-bold text-[#123B6D] bg-[#EBF3FC]"
                    : "text-[#334155] hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2 border-t border-[#E2E8F0]">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2 text-xs font-bold text-[#123B6D] border border-[#1E5AA8] rounded-md"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2 text-xs font-bold text-white bg-[#1E5AA8] rounded-md"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function GlobalFooter() {
  return (
    <footer className="bg-[#123B6D] text-slate-300 text-xs border-t border-[#0F3057]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Column 1: VRIDHI Brand Info */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ashoka_emblem.jpg"
                alt="Emblem"
                className="h-8 w-auto object-contain bg-white rounded-sm p-0.5"
              />
              <div>
                <div className="text-sm font-black text-white leading-none">VRIDHI</div>
                <div className="text-[10px] text-slate-400 mt-0.5">National Skill &amp; Career Growth Portal</div>
              </div>
            </div>
            <p className="text-xs text-amber-300 font-semibold italic">
              &quot;Where Skills Grow. Opportunities Multiply.&quot;
            </p>
            <p className="text-[12px] text-slate-300 leading-relaxed pr-6">
              Vridhi connects learners, institutions and industry across India &amp; Jharkhand through intelligent skill assessment, verified capabilities, learning pathways, internships and career opportunities.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 font-medium">
              Prototype developed for Smart India Hackathon 2026
            </div>
          </div>

          {/* Column 2: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Portals</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/students" className="hover:text-white transition">
                  For Learners
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-white transition">
                  For Institutions
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-white transition">
                  For Industry
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition">
                  Interactive Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Key Modules</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/skill-assessment" className="hover:text-white transition">
                  Skill Assessment
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition">
                  Opportunities &amp; Jobs
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/get-started" className="hover:text-white transition">
                  Onboarding Workflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Help &amp; Governance</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Vridhi
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Tri-color indicator */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 Vridhi. All Rights Reserved. Prototype developed for Smart India Hackathon 2026.
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#F4A11A]" />
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
            <span className="font-semibold text-slate-300">Digital India &amp; Jharkhand Initiative MVP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const VridhiHeader = GlobalHeader;
export const VridhiFooter = GlobalFooter;
