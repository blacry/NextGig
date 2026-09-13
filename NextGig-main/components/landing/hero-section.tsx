"use client";

import Link from "next/link";
import {
  GraduationCap,
  Building2,
  BookOpen,
  University,
  TrendingUp,
  Flame,
  Bell,
  CheckCircle2,
} from "lucide-react";

// Floating UI node card
function NodeCard({
  icon: Icon,
  label,
  active = false,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-4 flex flex-col items-center gap-2 w-24 cursor-pointer transition-all duration-300 hover:scale-105 ${
        active ? "border-brand-400/40 bg-brand-700/40 glow-green-sm" : ""
      } ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          active ? "bg-brand-400/20" : "bg-brand-800/60"
        }`}
      >
        <Icon className={`w-5 h-5 ${active ? "text-brand-100" : "text-brand-400"}`} />
      </div>
      <span className="text-xs text-brand-400 font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

// Small info card
function InfoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-card rounded-xl px-3.5 py-3 text-xs ${className}`}>{children}</div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-700/50 bg-brand-800/40 text-xs text-brand-400 font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              The Future of Learning &amp; Careers
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <span className="text-brand-100">Learn. Build.</span>
              <br />
              <span className="text-brand-400">Connect. Grow.</span>
            </h1>

            {/* Description */}
            <p className="text-brand-400 text-lg leading-relaxed max-w-md">
              NextGig connects students, educators, institutions and companies in
              one ecosystem — turning learning into real-world opportunity.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/select-role"
                className="btn-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 text-sm"
              >
                Explore NextGig
                <span className="text-base">→</span>
              </Link>
              <Link
                href="/#how-it-works"
                className="px-6 py-3 rounded-xl text-sm font-medium text-brand-400 border border-brand-700/50 hover:border-brand-400/40 hover:text-brand-100 transition-all"
              >
                See how it works
              </Link>
            </div>

            {/* Footnote */}
            <p className="text-brand-700 text-xs flex items-center gap-2">
              <span className="w-8 h-px bg-brand-700" />
              Built for learners. Powered by opportunity.
            </p>
          </div>

          {/* Right — Floating UI visualization */}
          <div className="relative h-[520px] hidden lg:block">
            {/* Central NextGig node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-20 h-20 rounded-2xl bg-brand-700 border-2 border-brand-400/30 flex items-center justify-center glow-green animate-float-2 shadow-2xl">
                <span className="text-brand-100 font-bold text-sm">NextGig</span>
              </div>
            </div>

            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              {/* Students to center */}
              <line x1="22%" y1="28%" x2="50%" y2="50%" stroke="rgba(142,182,155,0.15)" strokeWidth="1" strokeDasharray="4,4" />
              {/* Companies to center */}
              <line x1="22%" y1="58%" x2="50%" y2="50%" stroke="rgba(142,182,155,0.15)" strokeWidth="1" strokeDasharray="4,4" />
              {/* Teachers to center */}
              <line x1="78%" y1="58%" x2="50%" y2="50%" stroke="rgba(142,182,155,0.15)" strokeWidth="1" strokeDasharray="4,4" />
              {/* Institutes to center */}
              <line x1="78%" y1="72%" x2="50%" y2="50%" stroke="rgba(142,182,155,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            </svg>

            {/* Role nodes */}
            <div className="absolute top-[14%] left-[12%] animate-float-1 z-10">
              <NodeCard icon={GraduationCap} label="Students" />
            </div>
            <div className="absolute top-[52%] left-[10%] animate-float-3 z-10">
              <NodeCard icon={Building2} label="Companies" />
            </div>
            <div className="absolute top-[52%] right-[10%] animate-float-2 z-10">
              <NodeCard icon={BookOpen} label="Teachers" />
            </div>
            <div className="absolute top-[66%] right-[12%] animate-float-1 z-10">
              <NodeCard icon={University} label="Institutes" />
            </div>

            {/* Info cards */}
            {/* Skill Progress */}
            <div className="absolute top-[8%] left-[35%] animate-float-3 z-10">
              <InfoCard>
                <div className="flex items-center justify-between gap-8 mb-1.5">
                  <span className="text-brand-400">Skill Progress</span>
                  <span className="text-brand-100 font-semibold">82%</span>
                </div>
                <div className="w-full h-1.5 bg-brand-800 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-brand-400 rounded-full" />
                </div>
              </InfoCard>
            </div>

            {/* New Opportunity */}
            <div className="absolute top-[20%] right-[6%] animate-float-2 z-10 w-48">
              <InfoCard>
                <p className="text-brand-700 mb-1 uppercase tracking-wide" style={{ fontSize: "10px" }}>New Opportunity</p>
                <p className="text-brand-100 font-semibold text-xs leading-snug">
                  "Frontend Developer Internship"
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-brand-400" />
                  <span className="text-brand-400 text-xs">98% match</span>
                </div>
              </InfoCard>
            </div>

            {/* Learning Streak */}
            <div className="absolute bottom-[22%] left-[28%] animate-float-1 z-10">
              <InfoCard>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-brand-700 text-xs">Learning Streak</p>
                    <p className="text-brand-100 font-bold text-sm">18 Days</p>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* New Connection */}
            <div className="absolute bottom-[10%] right-[8%] animate-float-3 z-10 w-48">
              <InfoCard>
                <div className="flex items-start gap-2">
                  <Bell className="w-3.5 h-3.5 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-brand-700 uppercase tracking-wide mb-0.5" style={{ fontSize: "10px" }}>New Connection</p>
                    <p className="text-brand-100 text-xs font-medium leading-snug">
                      "ABC Technologies viewed your profile"
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Trend card */}
            <div className="absolute bottom-[36%] left-[8%] animate-float-2 z-10">
              <InfoCard className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                <div>
                  <p className="text-brand-700 text-xs">Placements</p>
                  <p className="text-brand-100 font-bold text-sm">↑ 34%</p>
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
