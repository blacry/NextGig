"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStudent } from "@/lib/student-context";
import { DataError, getOpportunitiesWithCompany } from "@/lib/data";
import { calculateMatchScore } from "@/lib/matching";
import { OpportunityCard } from "@/components/opportunity-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      m.opp.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground mt-1">Discover roles matched to your verified skills.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <Input
            placeholder="Search roles, domains, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filters</Button>
          <Button variant="outline">Sort: Match Score</Button>
        </div>
      </div>

      {isLoadingOpportunities ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(({ opp, company, result }, index) => (
            <OpportunityCard
              key={opp.id}
              index={index}
              opportunity={opp}
              company={company}
              matchResult={result}
              onViewDetails={() => {}}
              onApply={
                appliedOpportunityIds.has(opp.id)
                  ? undefined
                  : () => void addApplication(opp.id)
              }
            />
          ))}
        </div>
      )}

      {!isLoadingOpportunities && filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          {matches.length === 0
            ? "No opportunities have been posted yet. Check back soon."
            : "No opportunities found matching your search."}
        </div>
      )}
    </div>
  );
}
