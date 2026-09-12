"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRecruiter } from "@/lib/recruiter-context";
import { useRole } from "@/lib/role-context";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { OpportunityForm } from "@/components/opportunity-form";
import { StatCard } from "@/components/stat-card";
import { MatchScore } from "@/components/match-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatmapPreview } from "@/components/heatmap-preview";
import { SkeletonCard } from "@/components/shared";

// ── Recruiter Dashboard ──────────────────────────────────────────────

export default function RecruiterDashboardPage() {
  const { recruiter, company, opportunities, candidates, isLoaded, refresh } = useRecruiter();
  const { userId } = useRole();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Pipeline for the recruiter's most recent posting.
  const featured = opportunities[0];

  const ranked = useMemo(
    () => (featured ? rankCandidatesForOpportunity(candidates, featured).slice(0, 5) : []),
    [featured, candidates]
  );

  const candidatesById = useMemo(
    () => new Map(candidates.map((c) => [c.id, c])),
    [candidates]
  );

  // Supply signal across this recruiter's own postings: how many candidates in
  // the pool meet each required level, as a share of the pool.
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {company
              ? `Overview of ${company.name}'s active pipelines and talent matches.`
              : "Overview of your active pipelines and talent matches."}
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-[var(--ng-primary)] hover:bg-[var(--ng-primary-dark)] text-white shadow-lg shadow-[var(--ng-primary)]/20 font-medium px-5 h-10 gap-2 shrink-0 self-start sm:self-auto"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Post Opportunity
        </Button>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Active Roles" value={activeRoles} description={`${opportunities.length} posted in total`} />
        <StatCard index={1} title="Total Candidates" value={candidates.length} description="Onboarded and searchable" />
        <StatCard index={2} title="Applications" value={0} description="Across your open roles" />
        <StatCard index={3} title="High Match Rate" value={highMatchRate} suffix="%" description="Candidates > 80% match" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Top Pipeline */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Candidates Pipeline</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {featured ? `For ${featured.title}` : "No open roles yet"}
                </p>
              </div>
              <Button size="sm" variant="outline" disabled={!featured}>View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              {ranked.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full data-table">
                    <thead className="bg-muted/50 border-y border-border text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="text-left font-medium">Candidate</th>
                        <th className="text-left font-medium">Match Score</th>
                        <th className="text-left font-medium">Verified Skills</th>
                        <th className="text-left font-medium">Status</th>
                        <th className="text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ranked.map((result, i) => {
                        const student = candidatesById.get(result.studentId);
                        if (!student) return null;

                        const verified = student.skills.filter(
                          (s) => s.verification !== "self-declared"
                        ).length;

                        return (
                          <motion.tr
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-muted/30 transition-colors group"
                          >
                            <td>
                              <div className="font-medium text-sm">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.education.institution}</div>
                            </td>
                            <td className="w-48">
                              <MatchScore score={result.overallScore} size="sm" showBreakdown={false} />
                            </td>
                            <td>
                              <Badge variant="secondary" className="font-normal text-xs">{verified} verified</Badge>
                            </td>
                            <td>
                              <span className="text-xs text-muted-foreground">New Match</span>
                            </td>
                            <td className="text-right">
                              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                View Profile
                              </Button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  {!featured
                    ? "Post an opportunity to start matching candidates."
                    : "No onboarded candidates to rank yet."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Insights */}
        <div className="space-y-6">
          <Card className="ai-surface border-[var(--ng-primary)]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ng-primary)" stroke="none"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/></svg>
                AI Sourcing Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {heatmapData.length > 0 && heatmapData[0].value < 50 ? (
                  <>
                    <strong className="text-foreground">{heatmapData[0].skillName}</strong> is your
                    scarcest requirement — only {heatmapData[0].value}% of the talent pool meets it.
                    Relaxing that level, or treating it as preferred, widens your pool the most.
                  </>
                ) : (
                  <>
                    Your current requirements are well covered by the talent pool. Adding a
                    stretch skill would help you differentiate stronger candidates.
                  </>
                )}
              </p>
              <Button size="sm" variant="secondary" className="w-full" disabled={!featured}>
                Adjust Requirements
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Skill Supply vs Demand</CardTitle>
              <p className="text-xs text-muted-foreground">
                Share of the talent pool meeting your required levels
              </p>
            </CardHeader>
            <CardContent>
              {heatmapData.length > 0 ? (
                <HeatmapPreview data={heatmapData} maxCols={4} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {recruiter
                    ? "Post an opportunity to see supply signals."
                    : "No data yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
