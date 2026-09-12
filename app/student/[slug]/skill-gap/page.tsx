"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStudent } from "@/lib/student-context";
import { DataError, getOpportunitiesWithCompany, getLearningPathsForSkills } from "@/lib/data";
import { identifySkillGaps } from "@/lib/matching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillMeter } from "@/components/skill-meter";
import { SkeletonCard } from "@/components/shared";
import type { Company, LearningPath, Opportunity, SkillGap, SkillLevel } from "@/lib/types";

// ── Skill Gap Page ───────────────────────────────────────────────────

interface OpportunityWithGaps {
  opportunity: Opportunity;
  company: Company | undefined;
  gaps: SkillGap[];
}

const getLevelLabel = (level: number): string => {
  if (level === 1) return "beginner";
  if (level === 2) return "intermediate";
  if (level === 3) return "advanced";
  return "beginner";
};

export default function SkillGapPage() {
  const { student, isLoaded } = useStudent();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [opportunitiesWithGaps, setOpportunitiesWithGaps] = useState<OpportunityWithGaps[]>([]);
  const [allGaps, setAllGaps] = useState<SkillGap[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedGap, setSelectedGap] = useState<SkillGap | null>(null);

  useEffect(() => {
    if (!student) return;

    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const rows = await getOpportunitiesWithCompany();
        if (!active) return;

        // Calculate gaps for each opportunity
        const withGaps = rows
          .map(({ opportunity, company }) => ({
            opportunity,
            company,
            gaps: identifySkillGaps(student, opportunity),
          }))
          .filter((item) => item.gaps.length > 0)
          .sort((a, b) => {
            // Sort by number of critical gaps, then total gaps
            const aCritical = a.gaps.filter((g) => g.severity === "critical").length;
            const bCritical = b.gaps.filter((g) => g.severity === "critical").length;
            if (aCritical !== bCritical) return bCritical - aCritical;
            return b.gaps.length - a.gaps.length;
          });

        setOpportunitiesWithGaps(withGaps);

        // Aggregate all unique gaps
        const gapMap = new Map<string, SkillGap>();
        withGaps.forEach(({ gaps }) => {
          gaps.forEach((gap) => {
            const existing = gapMap.get(gap.skillId);
            if (!existing || gap.severity === "critical") {
              gapMap.set(gap.skillId, gap);
            }
          });
        });

        const uniqueGaps = Array.from(gapMap.values()).sort((a, b) => {
          const severityOrder = { critical: 0, moderate: 1, emerging: 2 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        });

        setAllGaps(uniqueGaps);

        // Load learning paths for the most critical gaps
        const criticalSkillIds = uniqueGaps.slice(0, 5).map((g) => g.skillId);
        if (criticalSkillIds.length > 0) {
          const paths = await getLearningPathsForSkills(criticalSkillIds);
          setLearningPaths(paths);
        }
      } catch (error) {
        console.error("[skill-gap] failed to load", error);
        if (active) {
          toast.error(
            error instanceof DataError
              ? error.message
              : "Could not load skill gaps. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [student]);

  if (!isLoaded || !student) return null;

  const criticalGaps = allGaps.filter((g) => g.severity === "critical");
  const moderateGaps = allGaps.filter((g) => g.severity === "moderate");
  const emergingGaps = allGaps.filter((g) => g.severity === "emerging");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Identify and close skill gaps to improve your match scores.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-[var(--ng-critical)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical Gaps</p>
                      <p className="text-3xl font-bold text-[var(--ng-critical)] mt-1">
                        {criticalGaps.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[var(--ng-critical)]/10 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--ng-critical)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-[var(--ng-warning)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Moderate Gaps</p>
                      <p className="text-3xl font-bold text-[var(--ng-warning)] mt-1">
                        {moderateGaps.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[var(--ng-warning)]/10 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--ng-warning)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-[var(--ng-primary)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Emerging Gaps</p>
                      <p className="text-3xl font-bold text-[var(--ng-primary)] mt-1">
                        {emergingGaps.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[var(--ng-primary)]/10 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--ng-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {allGaps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">No skill gaps identified!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You meet or exceed the requirements for all available opportunities.
                </p>
                <Button onClick={() => router.push(`/student/${student.slug}/opportunities`)}>
                  View Opportunities
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left: Gap Details */}
              <div className="xl:col-span-2 space-y-6">
                <h3 className="font-semibold text-lg">Priority Skill Gaps</h3>

                {criticalGaps.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Badge className="bg-[var(--ng-critical)]/10 text-[var(--ng-critical)] border-[var(--ng-critical)]/20">
                          Critical
                        </Badge>
                        <span className="text-muted-foreground font-normal">
                          Blocking your top matches
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {criticalGaps.map((gap, i) => (
                        <div key={gap.skillId} className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium mb-1">{gap.skillName}</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {gap.requirement}
                              </p>
                              <SkillMeter
                                skillName=""
                                currentLevel={gap.currentLevel as SkillLevel}
                                targetLevel={gap.requiredLevel}
                              />
                            </div>
                          </div>
                          {i < criticalGaps.length - 1 && <div className="border-b border-border mt-4" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {moderateGaps.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Badge className="bg-[var(--ng-warning)]/10 text-[var(--ng-warning)] border-[var(--ng-warning)]/20">
                          Moderate
                        </Badge>
                        <span className="text-muted-foreground font-normal">
                          Would improve your match scores
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {moderateGaps.slice(0, 3).map((gap, i) => (
                        <div key={gap.skillId} className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium mb-1">{gap.skillName}</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {gap.requirement}
                              </p>
                              <SkillMeter
                                skillName=""
                                currentLevel={gap.currentLevel as SkillLevel}
                                targetLevel={gap.requiredLevel}
                              />
                            </div>
                          </div>
                          {i < Math.min(3, moderateGaps.length) - 1 && (
                            <div className="border-b border-border mt-4" />
                          )}
                        </div>
                      ))}
                      {moderateGaps.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center pt-2">
                          +{moderateGaps.length - 3} more moderate gaps
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right: Learning Resources */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Recommended Learning</h3>

                {learningPaths.length > 0 ? (
                  <div className="space-y-3">
                    {learningPaths.slice(0, 4).map((path, index) => (
                      <motion.div
                        key={path.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <Card
                          className="hover:border-[var(--ng-primary)] transition-colors cursor-pointer"
                          onClick={() => router.push(`/student/${student.slug}/courses`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[var(--ng-primary)]/10 flex items-center justify-center shrink-0">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="var(--ng-primary)"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm mb-1 line-clamp-2">
                                  {path.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {path.provider}
                                </p>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                                    {getLevelLabel(path.level)}
                                  </Badge>
                                  <span className="text-muted-foreground">{path.duration}</span>
                                  <span className="text-amber-600 flex items-center gap-1">
                                    ⭐ {path.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/student/${student.slug}/courses`)}
                    >
                      View All Courses
                    </Button>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-sm text-muted-foreground">
                      No learning resources found. Check back soon.
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-2">💡 Pro Tip</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Focus on closing critical gaps first. Each level gained boosts your match
                      score by up to 15%.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/student/${student.slug}/opportunities`)}
                    >
                      View All Opportunities
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
