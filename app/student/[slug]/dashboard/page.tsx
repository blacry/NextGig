"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  Send,
  GraduationCap,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Award,
  CheckCircle2,
  Compass,
  FileCheck2,
  FileText,
  UserCheck,
  ChevronRight,
  Target,
} from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { DataError, getOpportunitiesWithCompany } from "@/lib/data";
import { calculatePlacementReadiness, identifySkillGaps } from "@/lib/matching";
import { TERMINAL_STAGES } from "@/lib/types";
import type { Company, Opportunity, SkillLevel } from "@/lib/types";

interface OpportunityWithCompany {
  opportunity: Opportunity;
  company: Company | undefined;
}

export default function StudentDashboardPage() {
  const { student, isLoaded, applications } = useStudent();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<OpportunityWithCompany[]>([]);
  const [readiness, setReadiness] = useState<{
    readiness: number;
    bestMatchId: string | null;
    trend: number;
  } | null>(null);

  useEffect(() => {
    if (!student) return;

    let active = true;

    const load = async () => {
      try {
        const rows = await getOpportunitiesWithCompany();
        if (!active) return;

        setOpportunities(rows);
        setReadiness(
          calculatePlacementReadiness(
            student,
            rows.map((row) => row.opportunity)
          )
        );
      } catch (error) {
        console.error("[dashboard] failed to load opportunities", error);
        if (active) {
          toast.error(
            error instanceof DataError
              ? error.message
              : "Could not load your dashboard. Please refresh the page."
          );
          setReadiness({ readiness: 0, bestMatchId: null, trend: 0 });
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [student]);

  if (!isLoaded || !student || !readiness) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1E5AA8] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#5B6575]">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  // Derived stats
  const verifiedSkills = student.skills.filter((s) => s.verification !== "self-declared").length;
  const activeApps = applications.filter(
    (a) => !TERMINAL_STAGES.includes(a.currentStage)
  ).length;
  const interviewApps = applications.filter((a) => a.currentStage === "interview").length;

  // Best matched opportunity & identified skill gaps
  const bestMatch = opportunities.find((row) => row.opportunity.id === readiness.bestMatchId);
  const gaps = bestMatch ? identifySkillGaps(student, bestMatch.opportunity) : [];

  // Readiness circle values
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.readiness / 100) * circumference;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D9E1EA]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase bg-[#EAF2FB] text-[#1E5AA8] border border-[#1E5AA8]/20">
            <GraduationCap className="w-3.5 h-3.5" />
            VRIDHI LEARNER PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
            Learner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6575] font-medium">
            Your skill development and career journey at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/student/${student.slug}/opportunities`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E5AA8] hover:bg-[#123B6D] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Top Row: Placement Readiness Card + 4 Key KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Placement Readiness Circular Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#D9E1EA] shadow-2xs flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F4A11A] via-[#1E5AA8] to-[#138808]" />
          
          <div className="w-full flex items-center justify-between mb-3 text-left">
            <span className="text-[11px] font-bold text-[#5B6575] uppercase tracking-wider">
              Placement Readiness
            </span>
            <span className="text-[11px] font-bold text-[#138808] bg-[#EAF7ED] px-2 py-0.5 rounded-full border border-[#138808]/20">
              +{readiness.trend || 5}% from last month
            </span>
          </div>

          <div className="relative my-3">
            <svg width={140} height={140} className="-rotate-90">
              {/* Background track */}
              <circle
                cx={70}
                cy={70}
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth={strokeWidth}
              />
              {/* Animated progress */}
              <motion.circle
                cx={70}
                cy={70}
                r={radius}
                fill="none"
                stroke="#1E5AA8"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#123B6D]">
                {readiness.readiness}%
              </span>
              <span className="text-[10px] font-bold text-[#5B6575] uppercase tracking-wider">
                Overall Index
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5B6575] max-w-xs mt-1">
            Calculated across verified skill levels, professor-verified projects, and role suitability.
          </p>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Verified Skills */}
          <div className="bg-white rounded-2xl p-5 border border-[#D9E1EA] shadow-2xs flex flex-col justify-between hover:border-[#1E5AA8]/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-[#5B6575] uppercase tracking-wider">
                  Verified Skills
                </span>
                <div className="text-2xl font-extrabold text-[#123B6D] mt-1 flex items-baseline gap-1">
                  <span>{verifiedSkills}</span>
                  <span className="text-sm font-medium text-[#5B6575]">/ {student.skills.length}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FB] border border-[#1E5AA8]/20 flex items-center justify-center text-[#1E5AA8]">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-[#5B6575] mt-3">
              Assessed or project-verified
            </p>
          </div>

          {/* Card 2: Projects */}
          <div className="bg-white rounded-2xl p-5 border border-[#D9E1EA] shadow-2xs flex flex-col justify-between hover:border-[#1E5AA8]/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-[#5B6575] uppercase tracking-wider">
                  Projects
                </span>
                <div className="text-2xl font-extrabold text-[#123B6D] mt-1">
                  {student.projects.length}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FB] border border-[#1E5AA8]/20 flex items-center justify-center text-[#1E5AA8]">
                <FolderGit2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-[#5B6575] mt-3">
              {student.projects.filter((p) => p.verified).length} verified by professors
            </p>
          </div>

          {/* Card 3: Active Applications */}
          <div className="bg-white rounded-2xl p-5 border border-[#D9E1EA] shadow-2xs flex flex-col justify-between hover:border-[#1E5AA8]/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-[#5B6575] uppercase tracking-wider">
                  Active Applications
                </span>
                <div className="text-2xl font-extrabold text-[#123B6D] mt-1">
                  {activeApps}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FB] border border-[#1E5AA8]/20 flex items-center justify-center text-[#1E5AA8]">
                <Send className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-[#5B6575] mt-3">
              {interviewApps > 0
                ? `${interviewApps} in interview stage`
                : "No interviews scheduled yet"}
            </p>
          </div>

          {/* Card 4: GPA */}
          <div className="bg-white rounded-2xl p-5 border border-[#D9E1EA] shadow-2xs flex flex-col justify-between hover:border-[#1E5AA8]/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-[#5B6575] uppercase tracking-wider">
                  GPA
                </span>
                <div className="text-2xl font-extrabold text-[#123B6D] mt-1">
                  {student.education?.gpa || "3.8"}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FB] border border-[#1E5AA8]/20 flex items-center justify-center text-[#1E5AA8]">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-[#5B6575] mt-3 truncate">
              {student.education?.institution || "National Institute of Technology"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Top Recommended Opportunity & Critical Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Top Opportunity & Gaps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Recommended Opportunity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#123B6D] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1E5AA8]" />
                Top Recommended Opportunity
              </h3>
              <Link
                href={`/student/${student.slug}/opportunities`}
                className="text-xs font-bold text-[#1E5AA8] hover:text-[#123B6D] flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {bestMatch ? (
              <div className="bg-white rounded-2xl p-6 border border-[#D9E1EA] shadow-2xs hover:border-[#1E5AA8]/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#EAF2FB] text-[#1E5AA8] mb-1.5">
                      {bestMatch.opportunity.type || "Full-Time"} · {bestMatch.opportunity.domain}
                    </div>
                    <h4 className="text-lg font-extrabold text-[#123B6D]">
                      {bestMatch.opportunity.title}
                    </h4>
                    <p className="text-xs text-[#5B6575] mt-0.5 font-medium">
                      {bestMatch.company?.name || "Partner Organization"} · {bestMatch.opportunity.location || "Onsite / Hybrid"}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-1">
                    <span className="text-[11px] font-bold text-[#138808] bg-[#EAF7ED] px-2.5 py-1 rounded-full border border-[#138808]/20">
                      High Match
                    </span>
                    <span className="text-xs font-semibold text-[#5B6575]">
                      {bestMatch.opportunity.compensation}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5B6575] leading-relaxed mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  Your {bestMatch.opportunity.domain} background and Level {student.skills[0]?.level || 3} {student.skills[0]?.name || "skills"} make you a strong candidate for this position.
                </p>

                {/* Skill Badges */}
                <div className="space-y-1.5 mb-5">
                  <span className="text-[10.5px] font-bold text-[#5B6575] uppercase tracking-wider block">
                    Required Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bestMatch.opportunity.requiredSkills?.map((skill) => (
                      <span
                        key={skill.skillId}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EAF2FB] text-[#1E5AA8] border border-[#1E5AA8]/20"
                      >
                        {skill.skillName} (L{skill.requiredLevel})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => router.push(`/student/${student.slug}/opportunities`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1E5AA8] hover:bg-[#123B6D] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/student/${student.slug}/opportunities`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#123B6D] text-xs font-bold border border-[#CBD5E1] transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-[#D9E1EA] text-center text-[#5B6575] text-xs">
                No active opportunities found at this moment. Check back soon.
              </div>
            )}
          </div>

          {/* Critical Skill Gaps to Close */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#123B6D] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F4A11A]" />
              Critical Skill Gaps to Close
            </h3>

            <div className="bg-white rounded-2xl border border-[#D9E1EA] shadow-2xs overflow-hidden">
              {gaps.length > 0 ? (
                <div className="divide-y divide-[#E2E8F0]">
                  {gaps.slice(0, 3).map((gap, i) => {
                    const currentPct = (gap.currentLevel / 5) * 100;
                    const reqPct = (gap.requiredLevel / 5) * 100;

                    return (
                      <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-[#123B6D]">
                              {gap.skillName}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                gap.severity === "critical"
                                  ? "bg-red-50 text-red-600 border border-red-200"
                                  : gap.severity === "moderate"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-[#EAF2FB] text-[#1E5AA8] border border-[#1E5AA8]/20"
                              }`}
                            >
                              {gap.severity}
                            </span>
                          </div>
                          <p className="text-xs text-[#5B6575]">
                            {gap.requirement} · Level {gap.currentLevel} of {gap.requiredLevel} Required
                          </p>
                        </div>

                        {/* Progress Meter */}
                        <div className="w-full sm:w-44 shrink-0 space-y-1.5">
                          <div className="flex justify-between text-[10.5px] font-bold text-[#5B6575]">
                            <span>Current: L{gap.currentLevel}</span>
                            <span className="text-[#1E5AA8]">Target: L{gap.requiredLevel}</span>
                          </div>
                          <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden relative">
                            <div
                              className="h-full bg-[#1E5AA8] rounded-full transition-all"
                              style={{ width: `${currentPct}%` }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-[#F4A11A]"
                              style={{ left: `${reqPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#5B6575]">
                  No critical skill gaps identified for your top matches. Excellent profile!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): AI Insights & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Insights Section */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-[#123B6D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1E5AA8]" />
              AI Insights
            </h3>

            <div className="space-y-3">
              {gaps.slice(0, 2).map((gap) => (
                <div
                  key={gap.skillId}
                  className="bg-[#FAFBFD] rounded-2xl p-4 border border-[#D9E1EA] shadow-2xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF2FB] border border-[#1E5AA8]/20 flex items-center justify-center shrink-0 text-[#1E5AA8] mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#123B6D]">
                        Improve your {gap.skillName} level
                      </h4>
                      <p className="text-[11.5px] text-[#5B6575] mt-1 leading-relaxed">
                        Required at Level {gap.requiredLevel} for {bestMatch?.opportunity.title || "target role"}. You are currently Level {gap.currentLevel}.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/onboarding/gap")}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EAF2FB] text-[#1E5AA8] text-xs font-bold border border-[#1E5AA8]/30 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>View {gap.skillName} Gap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {gaps.length === 0 && (
                <div className="bg-[#FAFBFD] rounded-2xl p-4 border border-[#D9E1EA] shadow-2xs space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF2FB] border border-[#1E5AA8]/20 flex items-center justify-center shrink-0 text-[#1E5AA8] mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#123B6D]">
                        Profile in Top Tier
                      </h4>
                      <p className="text-[11.5px] text-[#5B6575] mt-1 leading-relaxed">
                        Adding verified academic projects boosts your recruiter visibility.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/onboarding/grade")}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EAF2FB] text-[#1E5AA8] text-xs font-bold border border-[#1E5AA8]/30 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>View Skill Passport</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl p-5 border border-[#D9E1EA] shadow-2xs space-y-3">
            <h4 className="font-extrabold text-xs text-[#123B6D] uppercase tracking-wider">
              Quick Actions
            </h4>

            <div className="space-y-2">
              <Link
                href="/onboarding/assessment"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#123B6D] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1E5AA8]" />
                  <span>Complete Skill Assessment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                href="/onboarding/upload"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#123B6D] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1E5AA8]" />
                  <span>Update Skill Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                href={`/student/${student.slug}/opportunities`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#123B6D] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#1E5AA8]" />
                  <span>Explore Opportunities</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </Link>

              <Link
                href="/onboarding/grade"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#123B6D] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#1E5AA8]" />
                  <span>View Skill Passport</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Skill Growth Journey Pipeline Visualization */}
      <div className="bg-white rounded-2xl p-6 border border-[#D9E1EA] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#123B6D]">
              National Skill Growth Pathway
            </h3>
            <p className="text-xs text-[#5B6575]">
              Structured verification and career enablement lifecycle under VRIDHI.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#1E5AA8] bg-[#EAF2FB] px-2.5 py-1 rounded-full border border-[#1E5AA8]/20 self-start sm:self-auto">
            SIH 2026 Prototype Flow
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          {[
            { step: "1", title: "Skills", desc: "Profile & Resume", icon: Award, active: true },
            { step: "2", title: "Assessment", desc: "AI Benchmarking", icon: Sparkles, active: true },
            { step: "3", title: "Verification", desc: "Faculty & Guild", icon: ShieldCheck, active: true },
            { step: "4", title: "Skill Passport", desc: "Verifiable Creds", icon: FileCheck2, active: true },
            { step: "5", title: "Opportunities", desc: "Direct Matches", icon: Briefcase, active: true },
            { step: "6", title: "Career Growth", desc: "Placement & Scale", icon: TrendingUp, active: true },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0] flex flex-col items-center text-center relative group hover:border-[#1E5AA8]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EAF2FB] border border-[#1E5AA8]/30 flex items-center justify-center text-[#1E5AA8] mb-2 font-bold text-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-[#123B6D]">{item.title}</span>
                <span className="text-[10px] text-[#5B6575] mt-0.5">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
