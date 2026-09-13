"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Building2,
  Briefcase,
  Cpu,
  Award,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  MapPin,
  Globe,
  Clock,
  QrCode,
  Compass,
} from "lucide-react";
import { GlobalHeader, GlobalFooter } from "@/components/GlobalHeader";

export default function VridhiHomePage() {
  const [activeOpportunityTab, setActiveOpportunityTab] = useState<"all" | "internships" | "jobs" | "apprenticeships">("all");

  // Sample opportunities data
  const opportunities = [
    {
      id: 1,
      title: "Software Engineering Intern (Cloud Systems)",
      company: "National Informatics Centre (Gov Tech Partner)",
      category: "internships",
      location: "Ranchi / New Delhi / Hybrid",
      experience: "Pre-Final / Final Year B.Tech",
      stipend: "₹25,000 / month",
      match: 94,
      skills: ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL"],
      verifiedGov: true,
      deadline: "30 Sept 2026",
    },
    {
      id: 2,
      title: "Data Analyst Intern (Public Policy & Analytics)",
      company: "Jharkhand Digital Innovation Corp",
      category: "internships",
      location: "Ranchi / Remote",
      experience: "Undergraduates & Postgraduates",
      stipend: "₹28,000 / month",
      match: 91,
      skills: ["Python", "SQL", "Tableau", "Statistical Modeling", "Pandas"],
      verifiedGov: true,
      deadline: "05 Oct 2026",
    },
    {
      id: 3,
      title: "AI / ML Research Associate",
      company: "Apex Cognitive Systems (Industry Consortium)",
      category: "jobs",
      location: "Jamshedpur / Hyderabad",
      experience: "0-2 Years Experience",
      stipend: "₹8.5 - 12.0 LPA",
      match: 88,
      skills: ["PyTorch", "NLP", "LLM Fine-tuning", "FastAPI", "Vector DBs"],
      verifiedGov: false,
      deadline: "12 Oct 2026",
    },
    {
      id: 4,
      title: "Cloud Infrastructure Apprentice (DevOps)",
      company: "Bharat Cloud Solutions",
      category: "apprenticeships",
      location: "Dhanbad / Pune",
      experience: "Diploma / Degree in CS / IT",
      stipend: "₹20,000 / month + NAPS Benefits",
      match: 86,
      skills: ["Linux", "AWS / Azure", "Kubernetes", "CI/CD Pipelines", "Terraform"],
      verifiedGov: true,
      deadline: "20 Oct 2026",
    },
  ];

  const filteredOpportunities =
    activeOpportunityTab === "all"
      ? opportunities
      : opportunities.filter((item) => item.category === activeOpportunityTab);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] font-sans antialiased selection:bg-[#123B6D]/15 selection:text-[#123B6D]">
      {/* ──────────────────────────────────────────────────────────
          GLOBAL VRIDHI GOVERNMENT HEADER
          ────────────────────────────────────────────────────────── */}
      <GlobalHeader />

      {/* Main Page Content */}
      <main id="main-content">
        {/* ──────────────────────────────────────────────────────────
            1. HERO SECTION (Exact Reference Layout Match)
            ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F7F9FC] to-[#EEF3FA] border-b border-[#D9E1EA] pt-8 pb-14 md:pt-12 md:pb-18">
          {/* Subtle Dotted Network Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Badge, Heading, Subtext, Dual CTAs & Trust Line */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                {/* Green Dot National Digital Platform Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D9E1EA] bg-[#F1F5F9] px-3.5 py-1 text-xs font-semibold text-[#172033]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
                  <span>National Digital Platform for Skill Development</span>
                </div>

                {/* Main Heading (Exact Reference Typography) */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-extrabold text-[#123B6D] tracking-tight leading-[1.14]">
                  Where Skills Grow.
                  <br />
                  <span className="text-[#123B6D]">Opportunities Multiply.</span>
                </h1>

                {/* Supporting Text */}
                <p className="text-sm sm:text-base text-[#5B6575] leading-relaxed max-w-xl font-normal">
                  Vridhi bridges the gap between education and industry by helping learners discover their skills, identify gaps, build verified capabilities and connect with meaningful career opportunities.
                </p>

                {/* Action Buttons (Exact Reference Styling) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white bg-[#1E5AA8] hover:bg-[#123B6D] shadow-xs hover:shadow transition duration-200 text-sm group"
                  >
                    <span>Explore Opportunities</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-[#123B6D] bg-white hover:bg-slate-50 border border-[#CBD5E1] shadow-2xs transition duration-200 text-sm group"
                  >
                    <span className="text-[#F4A11A] text-base">📝</span>
                    <span>Try Interactive Demo</span>
                  </Link>
                </div>

                {/* Trust / Prototype Statement with Shield */}
                <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-semibold text-[#5B6575]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#138808]" />
                    <span>Skills • Learning • Opportunities • Growth</span>
                  </span>
                  <span className="text-[#CBD5E1]">|</span>
                  <span className="text-[#475569]">
                    Smart India Hackathon 2026 Prototype
                  </span>
                </div>
              </div>

              {/* Right Column: Exact Reference Hero Illustration Visual */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                <div className="relative w-full max-w-[640px] rounded-2xl overflow-hidden shadow-md border border-[#E2E8F0] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/vridhi_reference_hero.jpg"
                    alt="Vridhi Skill Ecosystem - Skilled Jharkhand Stronger India"
                    className="w-full h-auto object-contain block hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            2. NATIONAL & STATE IMPACT METRICS
            ────────────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-[#D9E1EA] py-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8]">
                National Skill Framework Alignment
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#123B6D] mt-1">
                Building a skilled and employment-ready India
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123B6D]">10M+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#172033] mt-1">Learners Empowered</div>
                <div className="text-[11px] text-[#5B6575] mt-0.5">Across Higher Education</div>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E5AA8]">50K+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#172033] mt-1">Institutions</div>
                <div className="text-[11px] text-[#5B6575] mt-0.5">Colleges &amp; Universities</div>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#138808]">100K+</div>
                <div className="text-xs sm:text-sm font-semibold text-[#172033] mt-1">Career Opportunities</div>
                <div className="text-[11px] text-[#5B6575] mt-0.5">Internships &amp; Jobs</div>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F4A11A]">AI-Powered</div>
                <div className="text-xs sm:text-sm font-semibold text-[#172033] mt-1">Intelligent Opportunity Matching</div>
                <div className="text-[11px] text-[#5B6575] mt-0.5">Competency-Based Engine</div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            3. THREE STAKEHOLDER ECOSYSTEM CARDS
            ────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-[#F7F9FC] border-b border-[#D9E1EA]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8] bg-[#1E5AA8]/10 px-3 py-1 rounded-full border border-[#1E5AA8]/20">
                Stakeholder Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#123B6D] mt-3">
                One Platform. India&apos;s Skill Growth Ecosystem.
              </h2>
              <p className="text-sm sm:text-base text-[#5B6575] mt-2">
                Unifying learner aspirations, academic curriculum outcomes, and industry talent recruitment onto a single credible national baseline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: Learners */}
              <div className="bg-white rounded-2xl p-7 border border-[#D9E1EA] hover:border-[#1E5AA8] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1E5AA8]/10 text-[#1E5AA8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#1E5AA8] uppercase tracking-wider">For Learners</span>
                  <h3 className="text-xl font-extrabold text-[#123B6D] mt-1">
                    Discover. Learn. Grow.
                  </h3>
                  <p className="text-xs text-[#5B6575] mt-2 mb-6">
                    Assess your practical skills through AI, bridge curriculum gaps, and showcase verifiable credentials to top recruiters.
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#172033] font-medium border-t border-[#E2E8F0] pt-4 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>AI Skill Assessment &amp; Gap Analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Personalized Learning Pathways</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Verified Digital Skill Passport</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Internships &amp; Career Opportunities</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/students"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-xs sm:text-sm transition duration-150"
                >
                  <span>Learner Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 2: Institutions */}
              <div className="bg-white rounded-2xl p-7 border border-[#D9E1EA] hover:border-[#138808] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#138808]/10 text-[#138808] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#138808] uppercase tracking-wider">For Institutions</span>
                  <h3 className="text-xl font-extrabold text-[#123B6D] mt-1">
                    Educate. Enable. Empower.
                  </h3>
                  <p className="text-xs text-[#5B6575] mt-2 mb-6">
                    Gain deep analytics on departmental competencies, adapt syllabus to industry trends, and track student outcomes.
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#172033] font-medium border-t border-[#E2E8F0] pt-4 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Learner Skill Analytics &amp; Cohort Benchmarks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Curriculum &amp; Industry Gap Insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Placement Tracking &amp; Verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Institutional Accreditation Readiness</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/institutions"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#123B6D] hover:bg-[#0F3057] text-white font-bold text-xs sm:text-sm transition duration-150"
                >
                  <span>Institution Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 3: Industry */}
              <div className="bg-white rounded-2xl p-7 border border-[#D9E1EA] hover:border-[#F4A11A] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F4A11A]/15 text-[#B87105] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#B87105] uppercase tracking-wider">For Industry</span>
                  <h3 className="text-xl font-extrabold text-[#123B6D] mt-1">
                    Connect. Collaborate. Grow.
                  </h3>
                  <p className="text-xs text-[#5B6575] mt-2 mb-6">
                    Eliminate resume spam with competency-proven profiles, direct skill matches, and automated candidate evaluations.
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#172033] font-medium border-t border-[#E2E8F0] pt-4 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Skill-Based Talent Recruitment &amp; Matching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Verified Pre-Assessed Candidates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Internship &amp; Apprenticeship Listings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
                      <span>Recruitment Funnel Analytics</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/employers"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-xs sm:text-sm transition duration-150"
                >
                  <span>Industry Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            4. GROWTH JOURNEY
            ────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#D9E1EA]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8]">
                Standardized Growth Pathway
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#123B6D] mt-2">
                Your Journey from Learning to Growth
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6575] mt-2">
                A seamless structured pathway empowering every learner across India &amp; Jharkhand from skill discovery to industry success.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="text-xs font-black text-[#1E5AA8] uppercase mb-1">Step 01</div>
                <div className="text-sm font-extrabold text-[#123B6D]">LEARN</div>
                <p className="text-[11px] text-[#5B6575] mt-1">Curriculum &amp; courses</p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="text-xs font-black text-[#1E5AA8] uppercase mb-1">Step 02</div>
                <div className="text-sm font-extrabold text-[#123B6D]">ASSESS</div>
                <p className="text-[11px] text-[#5B6575] mt-1">AI skill evaluations</p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="text-xs font-black text-[#1E5AA8] uppercase mb-1">Step 03</div>
                <div className="text-sm font-extrabold text-[#123B6D]">IDENTIFY</div>
                <p className="text-[11px] text-[#5B6575] mt-1">Pinpoint skill gaps</p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="text-xs font-black text-[#1E5AA8] uppercase mb-1">Step 04</div>
                <div className="text-sm font-extrabold text-[#123B6D]">IMPROVE</div>
                <p className="text-[11px] text-[#5B6575] mt-1">Targeted practice</p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="text-xs font-black text-[#1E5AA8] uppercase mb-1">Step 05</div>
                <div className="text-sm font-extrabold text-[#123B6D]">VERIFY</div>
                <p className="text-[11px] text-[#5B6575] mt-1">Skill Passport</p>
              </div>

              {/* Step 6 */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="text-xs font-black text-[#1E5AA8] uppercase mb-1">Step 06</div>
                <div className="text-sm font-extrabold text-[#123B6D]">CONNECT</div>
                <p className="text-[11px] text-[#5B6575] mt-1">Direct matching</p>
              </div>

              {/* Step 7 */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#138808]/10 to-[#138808]/20 border border-[#138808]/40 text-center col-span-2 sm:col-span-1">
                <div className="text-xs font-black text-[#138808] uppercase mb-1">Step 07</div>
                <div className="text-sm font-extrabold text-[#123B6D]">GROW</div>
                <p className="text-[11px] text-[#138808] font-bold mt-1">Career advancement</p>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            5. AI SKILL INTELLIGENCE SECTION
            ────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-[#F7F9FC] border-b border-[#D9E1EA]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Explanation */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5AA8]/30 bg-[#1E5AA8]/10 px-3 py-1 text-xs font-semibold text-[#123B6D]">
                  <Cpu className="w-3.5 h-3.5 text-[#1E5AA8]" />
                  <span>NextGen Competency Engine</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#123B6D] leading-tight">
                  AI-Powered Skill Intelligence
                </h2>

                <p className="text-sm sm:text-base text-[#5B6575] leading-relaxed">
                  Vridhi evaluates demonstrated competencies rather than relying only on resumes and keywords. Our intelligent assessment engine identifies strengths, skill gaps and relevant opportunities.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#138808]/10 text-[#138808] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#172033]">Real-time Problem Solving Assessment</h4>
                      <p className="text-[12px] text-[#5B6575]">Evaluates code quality, reasoning accuracy, and domain architecture understanding.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#138808]/10 text-[#138808] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#172033]">Dynamic Gap Remediation Pathways</h4>
                      <p className="text-[12px] text-[#5B6575]">Maps exact topics learners must practice to reach the 90%+ employability threshold.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/skill-assessment"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1E5AA8] hover:text-[#123B6D] hover:underline underline-offset-4"
                  >
                    <span>Explore Skill Assessment Module</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: AI Dashboard Visual */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9E1EA] shadow-md">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <span className="text-[10px] font-bold text-[#5B6575] uppercase tracking-wider">Learner Scorecard</span>
                      <h3 className="text-base font-bold text-[#123B6D]">Skill Readiness Score</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#1E5AA8]">82%</span>
                      <div className="text-[10px] text-[#138808] font-bold">Verified Level 4</div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="space-y-4 py-5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#172033]">Technical &amp; Engineering Skills</span>
                        <span className="text-[#123B6D] font-bold">91%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1E5AA8] rounded-full" style={{ width: "91%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#172033]">Communication &amp; Collaborative Aptitude</span>
                        <span className="text-[#123B6D] font-bold">76%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#5670B6] rounded-full" style={{ width: "76%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#172033]">Problem Solving &amp; Logical Reasoning</span>
                        <span className="text-[#123B6D] font-bold">84%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#F4A11A] rounded-full" style={{ width: "84%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#172033]">Industry Readiness &amp; Work Ethic</span>
                        <span className="text-[#123B6D] font-bold">88%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#138808] rounded-full" style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Recommended Skills */}
                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <span className="text-xs font-bold text-[#5B6575]">Target Recommendations for +10% Employability:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#1E5AA8]/10 text-[#1E5AA8] border border-[#1E5AA8]/20">
                        Python (Advanced)
                      </span>
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#138808]/10 text-[#138808] border border-[#138808]/20">
                        Data Analysis
                      </span>
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#F4A11A]/15 text-[#B87105] border border-[#F4A11A]/30">
                        Cloud Computing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            6. VERIFIED SKILL PASSPORT
            ────────────────────────────────────────────────────────── */}
        <section id="skill-passport" className="py-14 sm:py-20 bg-white border-b border-[#D9E1EA]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Digital Skill Passport Card */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="bg-[#FAFBFD] rounded-2xl p-6 sm:p-8 border-2 border-[#123B6D]/20 shadow-md relative overflow-hidden">
                  {/* Top Passport Header */}
                  <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#123B6D] text-white flex items-center justify-center font-bold text-xs">
                        IND
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#5B6575]">
                          Digital Skill Passport
                        </div>
                        <div className="text-xs font-extrabold text-[#123B6D]">Vridhi National Register</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#138808] bg-[#138808]/10 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Active
                      </span>
                    </div>
                  </div>

                  {/* Passport Details Grid */}
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                      <div>
                        <div className="text-[10px] font-semibold text-[#5B6575]">Learner Name</div>
                        <div className="text-sm font-bold text-[#172033]">Alex Chen (Demo Learner)</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#5B6575]">Institution</div>
                        <div className="text-sm font-bold text-[#172033]">IIT ISM Dhanbad / BIT Mesra</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-white p-3.5 rounded-xl border border-[#E2E8F0] text-center">
                      <div>
                        <div className="text-[10px] font-semibold text-[#5B6575]">Assessment Score</div>
                        <div className="text-base font-black text-[#1E5AA8]">88 / 100</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#5B6575]">Projects Verified</div>
                        <div className="text-base font-black text-[#138808]">4 Capstones</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#5B6575]">Readiness Tier</div>
                        <div className="text-base font-black text-[#F4A11A]">Tier-1 Ready</div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                      <div className="text-[10px] font-semibold text-[#5B6575] mb-1.5">Validated Competencies</div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-[#123B6D]">
                          Full Stack Development (92%)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-[#123B6D]">
                          Cloud Architecture (86%)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-[#123B6D]">
                          System Design (84%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR & Cryptographic Seal Footer */}
                  <div className="mt-5 pt-4 border-t border-[#D9E1EA] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[#5B6575]">
                      <QrCode className="w-6 h-6 text-[#123B6D]" />
                      <span>Tamper-evident verification token #VRIDHI-2026-IND-8842</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Link */}
              <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8]">
                  Universal Portable Credentials
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#123B6D] leading-tight">
                  Your Skills. Verified. Portable. Recognised.
                </h2>

                <p className="text-sm sm:text-base text-[#5B6575] leading-relaxed">
                  The Vridhi Verified Skill Passport provides every Indian learner with a verifiable digital portfolio of assessed abilities. Recognized across participating academic institutions and premier industry talent partners.
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm text-[#172033] font-medium pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    <span>Instant cryptographic verification for employers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    <span>Eliminates fraudulent claims with authentic assessments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    <span>Seamless integration with DigiLocker and National Academic Depository</span>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/demo?role=student"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#123B6D] hover:bg-[#0F3057] text-white font-bold text-xs sm:text-sm transition duration-150"
                  >
                    <span>View Sample Skill Passport</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            7. INTERNSHIP & CAREER OPPORTUNITIES SECTION
            ────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-[#F7F9FC] border-b border-[#D9E1EA]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8]">
                  Verified Openings
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#123B6D] mt-1">
                  Opportunities Matched to Your Skills
                </h2>
                <p className="text-xs sm:text-sm text-[#5B6575] mt-1">
                  Live openings from participating government agencies, tech consortiums, and national enterprises.
                </p>
              </div>

              {/* Filters */}
              <div className="inline-flex bg-white rounded-lg p-1 border border-[#D9E1EA] text-xs font-semibold text-[#5B6575]">
                <button
                  onClick={() => setActiveOpportunityTab("all")}
                  className={`px-3 py-1.5 rounded-md transition ${
                    activeOpportunityTab === "all" ? "bg-[#1E5AA8] text-white" : "hover:text-[#172033]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveOpportunityTab("internships")}
                  className={`px-3 py-1.5 rounded-md transition ${
                    activeOpportunityTab === "internships" ? "bg-[#1E5AA8] text-white" : "hover:text-[#172033]"
                  }`}
                >
                  Internships
                </button>
                <button
                  onClick={() => setActiveOpportunityTab("jobs")}
                  className={`px-3 py-1.5 rounded-md transition ${
                    activeOpportunityTab === "jobs" ? "bg-[#1E5AA8] text-white" : "hover:text-[#172033]"
                  }`}
                >
                  Career Opportunities
                </button>
                <button
                  onClick={() => setActiveOpportunityTab("apprenticeships")}
                  className={`px-3 py-1.5 rounded-md transition ${
                    activeOpportunityTab === "apprenticeships" ? "bg-[#1E5AA8] text-white" : "hover:text-[#172033]"
                  }`}
                >
                  Apprenticeships
                </button>
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpportunities.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-[#D9E1EA] hover:border-[#1E5AA8] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E5AA8] bg-[#1E5AA8]/8 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h3 className="text-base font-extrabold text-[#123B6D] mt-1.5">{item.title}</h3>
                        <div className="text-xs font-medium text-[#5B6575] flex items-center gap-1.5 mt-0.5">
                          <span>{item.company}</span>
                          {item.verifiedGov && (
                            <span className="text-[10px] text-[#138808] font-bold bg-[#138808]/10 px-1.5 py-0.2 rounded">
                              Verified Partner
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Match Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-[#138808]">{item.match}%</div>
                        <div className="text-[10px] font-semibold text-[#5B6575]">Skill Match</div>
                      </div>
                    </div>

                    {/* Metadata Items */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5B6575] bg-[#F7F9FC] p-2.5 rounded-lg my-3.5 border border-[#E2E8F0]">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#1E5AA8] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#F4A11A] shrink-0" />
                        <span className="truncate">{item.deadline}</span>
                      </div>
                    </div>

                    {/* Required Skills Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-100 text-[#334155] px-2 py-0.5 rounded border border-[#E2E8F0]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#123B6D]">{item.stipend}</span>
                    <Link
                      href="/opportunities"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5AA8] hover:text-[#123B6D] hover:underline"
                    >
                      <span>Apply with Vridhi Score</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E1EA] text-[#123B6D] font-bold text-xs sm:text-sm shadow-xs transition"
              >
                <span>Browse All 1,200+ Open Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            8. POLICY & VISION COMPLIANCE
            ────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-20 bg-white border-b border-[#D9E1EA]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E5AA8]">
                Policy &amp; Vision Compliance
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#123B6D] mt-2">
                Aligned with India&apos;s Digital &amp; Skill Development Vision
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6575] mt-2">
                Designed to support national priorities in skill development, digital education and employability.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="w-10 h-10 rounded-full bg-[#1E5AA8]/10 text-[#1E5AA8] flex items-center justify-center mx-auto mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#123B6D]">Skill Development</h4>
                <p className="text-[11px] text-[#5B6575] mt-1">Competency-based benchmarking</p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="w-10 h-10 rounded-full bg-[#138808]/10 text-[#138808] flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#123B6D]">Digital India</h4>
                <p className="text-[11px] text-[#5B6575] mt-1">Paperless verified credentials</p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="w-10 h-10 rounded-full bg-[#123B6D]/10 text-[#123B6D] flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#123B6D]">National Education (NEP)</h4>
                <p className="text-[11px] text-[#5B6575] mt-1">Holistic multidisciplinary growth</p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition">
                <div className="w-10 h-10 rounded-full bg-[#F4A11A]/15 text-[#B87105] flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#123B6D]">Academia–Industry Bridge</h4>
                <p className="text-[11px] text-[#5B6575] mt-1">Direct corporate collaboration</p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center hover:border-[#1E5AA8] transition col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-full bg-[#1E5AA8]/10 text-[#1E5AA8] flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#123B6D]">Youth Employability</h4>
                <p className="text-[11px] text-[#5B6575] mt-1">Transparent meritocratic hiring</p>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
            9. PRE-FOOTER CALL TO ACTION
            ────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-[#123B6D] to-[#1E5AA8] text-white py-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Where Skills Grow. Opportunities Multiply.
              </h2>
              <p className="text-sm text-slate-200 mt-1 max-w-xl">
                Join thousands of learners, institutions, and industry leaders pioneering skill-based growth across India &amp; Jharkhand.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/get-started"
                className="px-6 py-3 rounded-lg bg-white text-[#123B6D] hover:bg-slate-100 font-bold text-sm shadow-sm transition"
              >
                Get Started Now
              </Link>
              <Link
                href="/demo"
                className="px-6 py-3 rounded-lg bg-[#123B6D]/50 hover:bg-[#123B6D] border border-white/30 text-white font-bold text-sm transition"
              >
                Interactive Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ──────────────────────────────────────────────────────────
          GLOBAL VRIDHI GOVERNMENT FOOTER
          ────────────────────────────────────────────────────────── */}
      <GlobalFooter />
    </div>
  );
}
