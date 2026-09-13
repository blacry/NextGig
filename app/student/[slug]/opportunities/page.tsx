"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Search, SlidersHorizontal, ArrowUpDown, Briefcase, CheckCircle2 } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { DataError, getOpportunitiesWithCompany } from "@/lib/data";
import { calculateMatchScore } from "@/lib/matching";
import { OpportunityCard } from "@/components/opportunity-card";
import { SkeletonCard } from "@/components/shared";
import type { Company, MatchResult, Opportunity } from "@/lib/types";

// ── Student Opportunities View ───────────────────────────────────────

interface ScoredOpportunity {
  opp: Opportunity;
  company: Company | undefined;
  result: MatchResult;
}

export default function OpportunitiesPage() {
  const { student, isLoaded, applications, addApplication } = useStudent();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<ScoredOpportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);

  useEffect(() => {
    if (!student) return;

    let active = true;

    const load = async () => {
      setIsLoadingOpportunities(true);
      try {
        const rows = await getOpportunitiesWithCompany();
        if (!active) return;

        setMatches(
          rows
            .map(({ opportunity, company }) => ({
              opp: opportunity,
              company,
              result: calculateMatchScore(student, opportunity),
            }))
            .sort((a, b) => b.result.overallScore - a.result.overallScore)
        );
      } catch (error) {
        console.error("[opportunities] failed to load", error);
        if (active) {
          toast.error(
            error instanceof DataError
              ? error.message
              : "Could not load opportunities. Please try again."
          );
        }
      } finally {
        if (active) setIsLoadingOpportunities(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [student]);

  if (!isLoaded || !student) return null;

  const appliedOpportunityIds = new Set(applications.map((a) => a.opportunityId));

  const filtered = matches.filter(
    (m) =>
      m.opp.title.toLowerCase().includes(search.toLowerCase()) ||
      m.opp.domain.toLowerCase().includes(search.toLowerCase()) ||
      m.opp.location.toLowerCase().includes(search.toLowerCase()) ||
      m.company?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#D9E1EA] space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase bg-[#EAF2FB] text-[#1E5AA8] border border-[#1E5AA8]/20">
          <Briefcase className="w-3.5 h-3.5" />
          Verified Opportunities
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
          Career Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6575] font-medium">
          Discover high-fit internships, apprenticeships, and full-time roles matched to your verified skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, domains, skills, or organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#123B6D] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1E5AA8]" />
            <span>Filters</span>
          </button>
          <button
            type="button"
            className="px-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#123B6D] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#1E5AA8]" />
            <span>Sort: Match Score</span>
          </button>
        </div>
      </div>

      {/* Grid of Opportunities */}
      {isLoadingOpportunities ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(({ opp, company, result }, index) => {
            const hasApplied = appliedOpportunityIds.has(opp.id);
            return (
              <OpportunityCard
                key={opp.id}
                index={index}
                opportunity={opp}
                company={company}
                matchResult={result}
                onViewDetails={() => {}}
                onApply={
                  hasApplied
                    ? undefined
                    : () => {
                        void addApplication(opp.id);
                        toast.success(`Application submitted for ${opp.title}!`);
                      }
                }
              />
            );
          })}
        </div>
      )}

      {!isLoadingOpportunities && filtered.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#D9E1EA] text-[#5B6575] space-y-2">
          <p className="font-bold text-sm text-[#123B6D]">No opportunities match your current filters</p>
          <p className="text-xs">Try adjusting your search criteria or check back soon for newly posted roles.</p>
        </div>
      )}
    </div>
  );
}
