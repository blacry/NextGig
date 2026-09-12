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
import { Badge } from "@/components/ui/badge";
import type { Company, MatchResult, Opportunity } from "@/lib/types";

// ── Student Opportunities View ───────────────────────────────────────

interface ScoredOpportunity {
  opp: Opportunity;
  company: Company | undefined;
  result: MatchResult;
}

type SortOption = "match" | "newest" | "deadline" | "compensation";
type FilterType = "all" | "internship" | "full-time" | "contract";

export default function OpportunitiesPage() {
  const { student, isLoaded, applications, addApplication } = useStudent();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<ScoredOpportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("match");
  const [filterType, setFilterType] = useState<FilterType>("all");

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

  // Apply filters and search
  let filtered = matches.filter(
    (m) =>
      (m.opp.title.toLowerCase().includes(search.toLowerCase()) ||
      m.opp.domain.toLowerCase().includes(search.toLowerCase()) ||
      m.company?.name.toLowerCase().includes(search.toLowerCase())) &&
      (filterType === "all" || m.opp.type === filterType)
  );

  // Apply sorting
  const sortedFiltered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return b.result.overallScore - a.result.overallScore;
      case "newest":
        return new Date(b.opp.postedAt).getTime() - new Date(a.opp.postedAt).getTime();
      case "deadline":
        return new Date(a.opp.deadline).getTime() - new Date(b.opp.deadline).getTime();
      case "compensation":
        // Simple numeric extraction from compensation string
        const getCompValue = (comp: string) => {
          const match = comp.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        return getCompValue(b.opp.compensation) - getCompValue(a.opp.compensation);
      default:
        return 0;
    }
  });

  const typeCount = {
    all: matches.length,
    internship: matches.filter((m) => m.opp.type === "internship").length,
    "full-time": matches.filter((m) => m.opp.type === "full-time").length,
    contract: matches.filter((m) => m.opp.type === "contract").length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground mt-1">Discover roles matched to your verified skills.</p>
      </motion.div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <Input
              placeholder="Search roles, domains, companies, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Badge
            variant={filterType === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterType("all")}
          >
            All ({typeCount.all})
          </Badge>
          <Badge
            variant={filterType === "internship" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterType("internship")}
          >
            Internships ({typeCount.internship})
          </Badge>
          <Badge
            variant={filterType === "full-time" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterType("full-time")}
          >
            Full-Time ({typeCount["full-time"]})
          </Badge>
          <Badge
            variant={filterType === "contract" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterType("contract")}
          >
            Contract ({typeCount.contract})
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-border rounded-md px-3 py-1.5 bg-background hover:bg-accent cursor-pointer transition-colors"
            >
              <option value="match">Best Match</option>
              <option value="newest">Newest First</option>
              <option value="deadline">Deadline Soon</option>
              <option value="compensation">Highest Pay</option>
            </select>
          </div>
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
          {sortedFiltered.map(({ opp, company, result }, index) => (
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

      {!isLoadingOpportunities && sortedFiltered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          {matches.length === 0
            ? "No opportunities have been posted yet. Check back soon."
            : "No opportunities found matching your filters."}
        </div>
      )}
    </div>
  );
}
