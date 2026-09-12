"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRecruiter } from "@/lib/recruiter-context";
import { calculateMatchScore } from "@/lib/matching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/shared";
import type { SkillDomain } from "@/lib/types";

// ── Domain Display Names ──────────────────────────────────────────────

const DOMAIN_LABELS: Record<SkillDomain, string> = {
  frontend: "Frontend Engineering",
  backend: "Backend & Systems",
  "data-ai": "Data & AI / ML",
  cloud: "Cloud Architecture",
  devops: "DevOps & Infrastructure",
  mobile: "Mobile App Development",
  general: "General Software Engineering",
};

export default function HiringAnalyticsPage() {
  const { recruiter, company, opportunities, candidates, applications, isLoaded } = useRecruiter();
  const [selectedOppId, setSelectedOppId] = useState<string>("all");

  // Filtered applications based on selected opportunity
  const filteredApps = useMemo(() => {
    if (selectedOppId === "all") return applications;
    return applications.filter((app) => app.opportunityId === selectedOppId);
  }, [applications, selectedOppId]);

  // Target opportunity for single-role filtering
  const targetOpportunity = useMemo(() => {
    if (selectedOppId === "all") return null;
    return opportunities.find((o) => o.id === selectedOppId) ?? null;
  }, [selectedOppId, opportunities]);

  // Calculate Key Funnel Metrics dynamically from real data
  const metrics = useMemo(() => {
    const totalApps = filteredApps.length;

    const shortlistedApps = filteredApps.filter((a) =>
      ["screening", "interview", "assessment", "offer", "accepted"].includes(a.currentStage)
    ).length;

    const interviewApps = filteredApps.filter((a) =>
      ["interview", "assessment"].includes(a.currentStage)
    ).length;

    const selectedApps = filteredApps.filter((a) =>
      ["offer", "accepted"].includes(a.currentStage)
    ).length;

    const rejectedApps = filteredApps.filter((a) => a.currentStage === "rejected").length;

    // Conversion Percentages
    const shortlistedPct = totalApps > 0 ? Math.round((shortlistedApps / totalApps) * 100) : 0;
    const interviewPct = totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0;
    const selectedPct = totalApps > 0 ? Math.round((selectedApps / totalApps) * 100) : 0;

    // High Match Rate (> 80% match score)
    let highMatchCount = 0;
    const relevantOpps = targetOpportunity ? [targetOpportunity] : opportunities;

    for (const student of candidates) {
      if (relevantOpps.length > 0) {
        const bestScore = Math.max(
          ...relevantOpps.map((opp) => calculateMatchScore(student, opp).overallScore)
        );
        if (bestScore >= 80) highMatchCount++;
      }
    }

    const highMatchRate = candidates.length > 0 ? Math.round((highMatchCount / candidates.length) * 100) : 0;

    return {
      totalApps,
      shortlistedApps,
      interviewApps,
      selectedApps,
      rejectedApps,
      shortlistedPct,
      interviewPct,
      selectedPct,
      highMatchRate,
    };
  }, [filteredApps, candidates, opportunities, targetOpportunity]);

  // Domain Distribution of Candidates & Skills Supply
  const domainSupply = useMemo(() => {
    const domainCounts: Record<string, number> = {};
    for (const student of candidates) {
      const domains = new Set(student.skills.map((s) => s.domain));
      for (const d of domains) {
        domainCounts[d] = (domainCounts[d] || 0) + 1;
      }
    }

    const total = candidates.length || 1;
    return Object.entries(domainCounts)
      .map(([domain, count]) => ({
        domain: domain as SkillDomain,
        label: DOMAIN_LABELS[domain as SkillDomain] || domain,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [candidates]);

  // Per-Opportunity Pipeline Breakdown Table Data
  const roleBreakdowns = useMemo(() => {
    return opportunities.map((opp) => {
      const oppApps = applications.filter((a) => a.opportunityId === opp.id);
      const total = oppApps.length;
      const shortlisted = oppApps.filter((a) =>
        ["screening", "interview", "assessment", "offer", "accepted"].includes(a.currentStage)
      ).length;
      const selected = oppApps.filter((a) => ["offer", "accepted"].includes(a.currentStage)).length;

      // Avg candidate match score
      let avgScore = 0;
      if (candidates.length > 0) {
        const sum = candidates.reduce(
          (acc, student) => acc + calculateMatchScore(student, opp).overallScore,
          0
        );
        avgScore = Math.round(sum / candidates.length);
      }

      return {
        opp,
        total,
        shortlisted,
        selected,
        avgScore,
      };
    });
  }, [opportunities, applications, candidates]);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hiring Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Understand recruitment performance from application to selection.
          </p>
        </div>

        {/* Opportunity Filter Select */}
        <div className="w-full sm:w-72">
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-card px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ng-primary)]"
          >
            <option value="all">Filter by Opportunity (All Roles)</option>
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Total Applications"
          value={metrics.totalApps}
          description={targetOpportunity ? `Submitted for ${targetOpportunity.title}` : "Across all posted positions"}
        />
        <StatCard
          index={1}
          title="Shortlisted Candidates"
          value={metrics.shortlistedApps}
          description={`${metrics.shortlistedPct}% conversion from total applicants`}
        />
        <StatCard
          index={2}
          title="Interviews & Assessment"
          value={metrics.interviewApps}
          description={`${metrics.interviewPct}% in active evaluation`}
        />
        <StatCard
          index={3}
          title="Selected / Offers"
          value={metrics.selectedApps}
          description={`${metrics.selectedPct}% overall hiring rate`}
        />
      </div>

      {/* Hiring Funnel Section */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Hiring Funnel</h2>
            <p className="text-xs text-muted-foreground">
              Candidate progression and stage conversion rates
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-normal border-border">
            Real-time Pipeline
          </Badge>
        </div>

        {/* Visual Funnel Stage Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stage 1: Applications */}
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-blue-400">1. Applications</span>
              <span className="font-bold text-foreground">100%</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.totalApps}</div>
            <div className="w-full h-1.5 rounded-full bg-blue-500/20 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-full" />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">Total candidates applied</p>
          </div>

          {/* Stage 2: Shortlisted */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-amber-400">2. Shortlisted</span>
              <span className="font-bold text-amber-400">{metrics.shortlistedPct}%</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.shortlistedApps}</div>
            <div className="w-full h-1.5 rounded-full bg-amber-500/20 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, metrics.shortlistedPct)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">Screened for requirements</p>
          </div>

          {/* Stage 3: Interview */}
          <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-purple-400">3. Interview / Test</span>
              <span className="font-bold text-purple-400">{metrics.interviewPct}%</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.interviewApps}</div>
            <div className="w-full h-1.5 rounded-full bg-purple-500/20 overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, metrics.interviewPct)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">Under active evaluation</p>
          </div>

          {/* Stage 4: Selected */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-400">4. Selected</span>
              <span className="font-bold text-emerald-400">{metrics.selectedPct}%</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{metrics.selectedApps}</div>
            <div className="w-full h-1.5 rounded-full bg-emerald-500/20 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, metrics.selectedPct)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">Offers extended / accepted</p>
          </div>
        </div>
      </Card>

      {/* Middle Grid: Domain Talent Supply & High Match Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Skill Supply */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Talent Supply by Domain</h3>
            <p className="text-xs text-muted-foreground">
              Distribution of verified skills across the onboarded candidate pool
            </p>
          </div>

          {domainSupply.length > 0 ? (
            <div className="space-y-3.5 pt-2">
              {domainSupply.map(({ domain, label, count, percentage }) => (
                <div key={domain} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{count}</strong> candidates ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--ng-primary)] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No candidate skills data available yet.
            </p>
          )}
        </Card>

        {/* Quality & Match Score Breakdown */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Candidate Quality & Readiness</h3>
            <p className="text-xs text-muted-foreground">
              Match rate against your active role specifications
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">High Match Rate (&gt; 80% Match)</span>
              <span className="text-2xl font-bold text-[var(--ng-primary)]">{metrics.highMatchRate}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--ng-primary)] to-emerald-400 transition-all duration-500"
                style={{ width: `${metrics.highMatchRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {metrics.highMatchRate > 40
                ? "Your active job requirements closely match candidate skill profiles in the talent pool."
                : "Consider tuning required vs. preferred skill levels on your postings to expand high-match candidate volume."}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span>Total Searchable Pool: <strong className="text-foreground">{candidates.length} candidates</strong></span>
            <span>Active Roles: <strong className="text-foreground">{opportunities.length} roles</strong></span>
          </div>
        </Card>
      </div>

      {/* Role-by-Role Pipeline Performance Table */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Opportunity Performance Breakdown</h3>
            <p className="text-xs text-muted-foreground">
              Detailed candidate pipeline per job posting
            </p>
          </div>
          <Link href={`/recruiter/${recruiter?.slug || "recruiter"}/opportunities`}>
            <Button size="sm" variant="outline" className="text-xs">
              Manage Roles
            </Button>
          </Link>
        </div>

        {roleBreakdowns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Opportunity Title</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Total Applicants</th>
                  <th className="py-3.5 px-4 font-semibold">Shortlisted</th>
                  <th className="py-3.5 px-4 font-semibold">Selected</th>
                  <th className="py-3.5 px-4 font-semibold">Avg Match Score</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {roleBreakdowns.map(({ opp, total, shortlisted, selected, avgScore }) => (
                  <motion.tr key={opp.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {opp.title}
                      <span className="block text-[11px] font-normal text-muted-foreground capitalize">
                        {opp.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{opp.location}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground">{total}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-medium">{shortlisted}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">{selected}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-400 font-bold">
                        {avgScore}%
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/recruiter/${recruiter?.slug || "recruiter"}/applications`}>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-medium">
                          View Applications
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No active job opportunities posted yet. Post a role to track hiring metrics.
          </div>
        )}
      </Card>
    </div>
  );
}
