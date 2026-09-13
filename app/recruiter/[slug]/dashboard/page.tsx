"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRecruiter } from "@/lib/recruiter-context";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { MatchScore } from "@/components/match-score";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatmapPreview } from "@/components/heatmap-preview";
import { SkeletonCard } from "@/components/shared";
import {
  Briefcase,
  Users,
  FileCheck,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
  Layers,
  GraduationCap,
  Award,
  Search,
  CheckCircle2,
  ExternalLink,
  Target,
  BarChart3,
  Network,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

// ── Vridhi Recruiter Dashboard ───────────────────────────────────────

export default function RecruiterDashboardPage() {
  const { recruiter, company, opportunities, candidates, isLoaded } = useRecruiter();
  const [showPostModal, setShowPostModal] = useState(false);

  // Pipeline for the recruiter's most recent posting
  const featured = opportunities[0];

  const ranked = useMemo(
    () => (featured ? rankCandidatesForOpportunity(candidates, featured).slice(0, 5) : []),
    [featured, candidates]
  );

  const candidatesById = useMemo(
    () => new Map(candidates.map((c) => [c.id, c])),
    [candidates]
  );

  // Supply signal across this recruiter's own postings
  const heatmapData = useMemo(() => {
    if (candidates.length === 0) return [];

    const requirements = new Map<string, { skillName: string; requiredLevel: number }>();
    for (const opp of opportunities) {
      for (const requirement of [...opp.requiredSkills, ...opp.preferredSkills]) {
        const existing = requirements.get(requirement.skillId);
        if (!existing || requirement.requiredLevel > existing.requiredLevel) {
          requirements.set(requirement.skillId, {
            skillName: requirement.skillName,
            requiredLevel: requirement.requiredLevel,
          });
        }
      }
    }

    return [...requirements.entries()]
      .map(([skillId, { skillName, requiredLevel }]) => {
        const qualified = candidates.filter((candidate) =>
          candidate.skills.some((s) => s.id === skillId && s.level >= requiredLevel)
        ).length;
        const value = Math.round((qualified / candidates.length) * 100);

        return {
          skillName,
          value,
          ...(value < 30
            ? { label: `Only ${qualified} of ${candidates.length} at Level ${requiredLevel}+` }
            : {}),
        };
      })
      .sort((a, b) => a.value - b.value)
      .slice(0, 8);
  }, [opportunities, candidates]);

  const highMatchRate = useMemo(() => {
    if (!featured || candidates.length === 0) return 0;
    const scores = rankCandidatesForOpportunity(candidates, featured);
    return Math.round(
      (scores.filter((s) => s.overallScore > 80).length / candidates.length) * 100
    );
  }, [featured, candidates]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const activeRoles = opportunities.filter((o) => o.active).length;

  const handleQuickAction = (action: string) => {
    toast.info(`${action} feature is ready for exploration.`);
  };

  return (
    <div className="space-y-8 max-w-[1360px] mx-auto">
      
      {/* ──────────────────────────────────────────────────────────
          1. DASHBOARD HEADER & ACTION BAR
          ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5AA8]/25 bg-[#1E5AA8]/8 px-3.5 py-1 text-xs font-bold text-[#123B6D]">
            <span className="w-2 h-2 rounded-full bg-[#138808]" />
            <span>VRIDHI INDUSTRY PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6575]">
            {company
              ? `Discover verified talent, manage opportunities and build high-quality teams for ${company.name} through Vridhi.`
              : "Discover verified talent, manage opportunities and build high-quality teams through Vridhi."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post an Opportunity</span>
          </Link>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. KPI STAT METRIC CARDS (4-Column Grid)
          ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Active Roles */}
        <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs hover:border-[#1E5AA8]/50 transition-all">
          <CardContent className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6575] uppercase tracking-wider">
                Active Roles
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#EBF3FC] text-[#1E5AA8] flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#123B6D] tracking-tight">
              {activeRoles}
            </div>
            <p className="text-[11.5px] text-[#5B6575] font-medium">
              {opportunities.length} posted in total
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Candidates */}
        <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs hover:border-[#1E5AA8]/50 transition-all">
          <CardContent className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6575] uppercase tracking-wider">
                Total Candidates
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#EBF3FC] text-[#1E5AA8] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#123B6D] tracking-tight">
              {candidates.length}
            </div>
            <p className="text-[11.5px] text-[#5B6575] font-medium">
              Onboarded and searchable
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Applications */}
        <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs hover:border-[#1E5AA8]/50 transition-all">
          <CardContent className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6575] uppercase tracking-wider">
                Applications
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#EBF3FC] text-[#1E5AA8] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#123B6D] tracking-tight">
              0
            </div>
            <p className="text-[11.5px] text-[#5B6575] font-medium">
              Across your open roles
            </p>
          </CardContent>
        </Card>

        {/* Card 4: High Match Rate */}
        <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs hover:border-[#1E5AA8]/50 transition-all">
          <CardContent className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5B6575] uppercase tracking-wider">
                High Match Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#138808]/10 text-[#138808] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#123B6D] tracking-tight">
              {highMatchRate}%
            </div>
            <p className="text-[11.5px] text-[#138808] font-bold flex items-center gap-1">
              <span>Candidates &gt; 80% match</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ──────────────────────────────────────────────────────────
          3. MAIN TWO-COLUMN WORKSPACE: PIPELINE & INSIGHTS
          ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Top Candidates Pipeline */}
        <div className="xl:col-span-8 space-y-6">
          <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#FAFBFD]">
              <div>
                <h2 className="text-base font-bold text-[#123B6D]">
                  Top Candidates Pipeline
                </h2>
                <p className="text-xs text-[#5B6575] mt-0.5">
                  {featured
                    ? `Candidates ranked by verified skills and compatibility for: ${featured.title}`
                    : "Candidates ranked by verified skills and role compatibility."}
                </p>
              </div>

              <Link
                href="/students"
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#EBF3FC] hover:border-[#1E5AA8] text-[#123B6D] transition-all"
              >
                View All Talent →
              </Link>
            </div>

            <CardContent className="p-0">
              {ranked.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F1F5F9] border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#5B6575]">
                      <tr>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Match Score</th>
                        <th className="py-3 px-4">Verified Skills</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs">
                      {ranked.map((result, i) => {
                        const student = candidatesById.get(result.studentId);
                        if (!student) return null;

                        const verified = student.skills.filter(
                          (s) => s.verification !== "self-declared"
                        ).length;

                        return (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="hover:bg-[#FAFBFD] transition-colors group"
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#123B6D] text-sm">{student.name}</div>
                              <div className="text-[11px] text-[#5B6575] font-medium">{student.education.institution}</div>
                            </td>
                            <td className="py-3.5 px-4 w-44">
                              <MatchScore score={result.overallScore} size="sm" showBreakdown={false} />
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge className="bg-[#138808]/10 text-[#138808] border border-[#138808]/20 font-bold text-[10.5px]">
                                {verified} Verified Badges
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E5AA8] bg-[#EBF3FC] px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1E5AA8]" />
                                Qualified
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Link
                                href={`/students`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5AA8] hover:text-[#123B6D] hover:underline"
                              >
                                <span>Profile</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EBF3FC] text-[#1E5AA8] flex items-center justify-center mx-auto">
                    <Target className="w-6 h-6 text-[#1E5AA8]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#123B6D]">
                    {!featured ? "No open roles yet" : "No onboarded candidates to rank yet."}
                  </h3>
                  <p className="text-xs text-[#5B6575] max-w-sm mx-auto">
                    {!featured
                      ? "Post an opportunity to start receiving AI-verified candidates matching your skill requirements."
                      : "Check back as learners complete skill assessments across national universities."}
                  </p>
                  <Link
                    href="/opportunities"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E5AA8] text-white font-bold text-xs hover:bg-[#123B6D] transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post an Opportunity</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#123B6D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1E5AA8]" /> Quick Actions
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  href="/opportunities"
                  className="p-3.5 rounded-xl border-2 border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1E5AA8] hover:bg-[#EBF3FC] text-center transition-all group"
                >
                  <Briefcase className="w-5 h-5 mx-auto mb-1.5 text-[#1E5AA8] group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-[#123B6D]">Post Opportunity</div>
                  <div className="text-[10px] text-[#5B6575]">New Listing</div>
                </Link>

                <Link
                  href="/students"
                  className="p-3.5 rounded-xl border-2 border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1E5AA8] hover:bg-[#EBF3FC] text-center transition-all group"
                >
                  <Search className="w-5 h-5 mx-auto mb-1.5 text-[#1E5AA8] group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-[#123B6D]">Search Talent</div>
                  <div className="text-[10px] text-[#5B6575]">Browse Candidates</div>
                </Link>

                <button
                  type="button"
                  onClick={() => handleQuickAction("Review Applications")}
                  className="p-3.5 rounded-xl border-2 border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1E5AA8] hover:bg-[#EBF3FC] text-center transition-all group cursor-pointer"
                >
                  <FileCheck className="w-5 h-5 mx-auto mb-1.5 text-[#1E5AA8] group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-[#123B6D]">Applications</div>
                  <div className="text-[10px] text-[#5B6575]">Active Pipeline</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction("View Analytics")}
                  className="p-3.5 rounded-xl border-2 border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1E5AA8] hover:bg-[#EBF3FC] text-center transition-all group cursor-pointer"
                >
                  <BarChart3 className="w-5 h-5 mx-auto mb-1.5 text-[#1E5AA8] group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-[#123B6D]">Analytics</div>
                  <div className="text-[10px] text-[#5B6575]">Supply Trends</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): AI Insight & Skill Supply Heatmap */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* AI Sourcing Insight Card */}
          <Card className="bg-[#FAFBFD] border-2 border-[#1E5AA8]/30 rounded-2xl shadow-xs overflow-hidden">
            <div className="h-1 bg-linear-to-r from-[#1E5AA8] to-amber-400" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <div className="w-7 h-7 rounded-lg bg-[#EBF3FC] text-[#1E5AA8] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="font-bold text-sm text-[#123B6D]">AI Sourcing Insight</h3>
              </div>

              <p className="text-xs text-[#334155] leading-relaxed font-medium">
                {heatmapData.length > 0 && heatmapData[0].value < 50 ? (
                  <>
                    <strong className="text-[#123B6D]">{heatmapData[0].skillName}</strong> is currently your scarcest requirement — only {heatmapData[0].value}% of the talent pool meets it. Relaxing that level, or marking it as preferred, widens your pool significantly.
                  </>
                ) : (
                  <>
                    Your current role requirements are well covered by the verified talent pool. Adding a specialized stretch capability helps differentiate top-tier candidates.
                  </>
                )}
              </p>

              <Link
                href="/opportunities"
                className="w-full h-9 rounded-xl bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Adjust Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Skill Supply vs Demand Card */}
          <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs">
            <CardContent className="p-6 space-y-3.5">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h3 className="font-bold text-sm text-[#123B6D]">Skill Supply vs Demand</h3>
                <p className="text-[11px] text-[#5B6575] mt-0.5 font-medium">
                  Share of the talent pool meeting your required levels
                </p>
              </div>

              {heatmapData.length > 0 ? (
                <div className="pt-1">
                  <HeatmapPreview data={heatmapData} maxCols={4} />
                </div>
              ) : (
                <div className="p-6 text-center space-y-1 text-xs text-[#5B6575]">
                  <p className="font-medium">
                    {recruiter ? "Post an opportunity to see supply signals." : "No data yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Talent Matching Pipeline Architecture Visual */}
          <Card className="bg-linear-to-br from-[#123B6D] to-[#1E5AA8] text-white border-0 rounded-2xl shadow-md p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-amber-300 uppercase tracking-wider">
                Vridhi Verification Flow
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>

            <div className="space-y-2 text-xs font-semibold text-white">
              <div className="p-2 rounded-lg bg-white/10 border border-white/15 flex items-center justify-between">
                <span>1. Industry Posting</span>
                <span className="text-[10px] text-blue-200">Requirements</span>
              </div>
              <div className="p-2 rounded-lg bg-white/10 border border-white/15 flex items-center justify-between">
                <span>2. AI Verified Skills</span>
                <span className="text-[10px] text-emerald-300">National Badges</span>
              </div>
              <div className="p-2 rounded-lg bg-white/10 border border-white/15 flex items-center justify-between">
                <span>3. Ranked Pipeline</span>
                <span className="text-[10px] text-amber-300">Match Score</span>
              </div>
            </div>

            <div className="pt-1 text-[10.5px] text-blue-100/90 text-center font-medium">
              Transparent, merit-based competency hiring
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
