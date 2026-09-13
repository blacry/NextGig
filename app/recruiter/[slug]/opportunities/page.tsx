"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRecruiter } from "@/lib/recruiter-context";
import { useRole } from "@/lib/role-context";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { OpportunityForm } from "@/components/opportunity-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { SkeletonCard } from "@/components/shared";

// ── Recruiter Opportunities Page ───────────────────────────────────────

export default function RecruiterOpportunitiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recruiter, company, opportunities, candidates, isLoaded, refresh } = useRecruiter();
  const { userId } = useRole();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Check URL query to automatically open drawer if requested (e.g. ?open=true)
  useEffect(() => {
    if (searchParams.get("open") === "true" || searchParams.get("new") === "true") {
      setIsFormOpen(true);
    }
  }, [searchParams]);

  // Filtered opportunities list
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.requiredSkills.some((s) => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? opp.active
          : !opp.active;

      // Type
      const matchesType =
        typeFilter === "all" ? true : opp.type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [opportunities, searchQuery, statusFilter, typeFilter]);

  // Stats calculation
  const totalRoles = opportunities.length;
  const activeRoles = opportunities.filter((o) => o.active).length;
  const draftRoles = totalRoles - activeRoles;
  
  // Total high-match candidates across all active roles (> 75% match)
  const totalMatchesCount = useMemo(() => {
    let count = 0;
    for (const opp of opportunities.filter((o) => o.active)) {
      const ranked = rankCandidatesForOpportunity(candidates, opp);
      count += ranked.filter((r) => r.overallScore >= 75).length;
    }
    return count;
  }, [opportunities, candidates]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Manage your open positions, post new job descriptions, and view candidate matches.
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-[var(--ng-primary)] hover:bg-[var(--ng-primary-dark)] text-white shadow-lg shadow-[var(--ng-primary)]/20 font-medium px-5 h-10 gap-2 shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post Opportunity
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Total Posted" value={totalRoles} description="Positions created" />
        <StatCard index={1} title="Active Roles" value={activeRoles} description="Currently sourcing candidates" />
        <StatCard index={2} title="Draft / Inactive" value={draftRoles} description="Not visible to applicants" />
        <StatCard index={3} title="Strong Candidate Matches" value={totalMatchesCount} description="Candidates with > 75% match score" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-muted/30 p-3 rounded-xl border border-border">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            placeholder="Search by title, department, location, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background h-9 border-border"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Status Tabs */}
          <div className="flex items-center bg-background rounded-lg border border-border p-1 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === "all"
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({totalRoles})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === "active"
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({activeRoles})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === "draft"
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drafts ({draftRoles})
            </button>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-background text-xs text-foreground border border-border rounded-lg px-2.5 py-1.5 h-8 focus:outline-none focus:ring-1 focus:ring-[var(--ng-primary)]"
          >
            <option value="all">All Types</option>
            <option value="job">Full-time Job</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredOpportunities.map((opp, index) => {
              // Rank candidates for this specific opportunity
              const candidateScores = rankCandidatesForOpportunity(candidates, opp);
              const topCandidatesCount = candidateScores.filter((c) => c.overallScore >= 70).length;

              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                >
                  <Card className="hover:border-[var(--ng-primary)]/40 transition-all duration-200 group">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title & Metadata */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-[var(--ng-primary)] transition-colors truncate">
                              {opp.title}
                            </h3>
                            <Badge
                              variant={opp.active ? "default" : "secondary"}
                              className={
                                opp.active
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium text-xs"
                                  : "text-muted-foreground font-medium text-xs"
                              }
                            >
                              {opp.active ? "Active" : "Draft / Inactive"}
                            </Badge>
                            <Badge variant="outline" className="text-xs uppercase font-semibold tracking-wider">
                              {opp.type}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                            {opp.department && (
                              <span className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                </svg>
                                {opp.department}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              {opp.location} ({opp.locationMode})
                            </span>
                            {opp.salaryRange && (
                              <span className="flex items-center gap-1 text-foreground/90 font-medium">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="12" y1="1" x2="12" y2="23" />
                                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                {opp.salaryRange}
                              </span>
                            )}
                            {opp.openings && (
                              <span>
                                {opp.openings} {opp.openings === 1 ? "Opening" : "Openings"}
                              </span>
                            )}
                          </div>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {opp.requiredSkills.map((s) => (
                              <span
                                key={s.skillId}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-accent/60 text-foreground border border-border"
                              >
                                {s.skillName} (L{s.requiredLevel}+)
                              </span>
                            ))}
                            {opp.preferredSkills.map((s) => (
                              <span
                                key={s.skillId}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border/50"
                              >
                                {s.skillName} (L{s.requiredLevel}+)
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: Candidate Matches & Actions */}
                        <div className="flex items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-border shrink-0">
                          {/* Talent Match Counter */}
                          <div className="text-right px-3 py-1.5 rounded-xl bg-accent/40 border border-border min-w-[120px]">
                            <div className="text-lg font-bold text-[var(--ng-primary)]">
                              {topCandidatesCount}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-medium">
                              Qualified Matches
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/recruiter/${recruiter?.slug || "default"}/talent?role=${opp.id}`}>
                              <Button variant="outline" size="sm" className="h-9 font-medium text-xs">
                                View Talent Pool
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">No opportunities found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "No positions match your current search and filter parameters."
                  : "You haven't posted any opportunities yet. Create your first role to start discovering candidate skill matches."}
              </p>
            </div>
            {searchQuery || statusFilter !== "all" || typeFilter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-[var(--ng-primary)] text-white shadow-md shadow-[var(--ng-primary)]/20 font-medium"
              >
                Post First Opportunity
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Slide-over Drawer Form */}
      {(recruiter || userId) && (
        <OpportunityForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          recruiterId={recruiter?.id || userId || ""}
          companyId={company?.id || recruiter?.companyId || ""}
          onSuccess={() => {
            refresh();
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
