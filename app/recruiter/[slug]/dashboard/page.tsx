"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRecruiter } from "@/lib/recruiter-context";
import { useRole } from "@/lib/role-context";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { OpportunityForm } from "@/components/opportunity-form";
import { StatCard } from "@/components/stat-card";
import { MatchScore } from "@/components/match-score";
import { SkillMeter } from "@/components/skill-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatmapPreview } from "@/components/heatmap-preview";
import { SkeletonCard } from "@/components/shared";
import type { Student } from "@/lib/types";

// ── Recruiter Dashboard ──────────────────────────────────────────────

export default function RecruiterDashboardPage() {
  const { recruiter, company, opportunities, candidates, applications, isLoaded, refresh } = useRecruiter();
  const { userId, userSlug } = useRole();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Drawer & Contact Modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [contactStudent, setContactStudent] = useState<Student | null>(null);

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
        <StatCard index={2} title="Applications" value={applications.length} description="Across your open roles" />
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
              <Link href={`/recruiter/${userSlug}/talent`}>
                <Button size="sm" variant="outline">View All</Button>
              </Link>
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
                            className="hover:bg-muted/30 transition-colors group cursor-pointer"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td>
                              <div className="font-medium text-sm text-foreground hover:text-[var(--ng-primary)] transition-colors">
                                {student.name}
                              </div>
                              <div className="text-xs text-muted-foreground">{student.education.institution || "Student"}</div>
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student);
                                }}
                                className="h-8 text-xs font-medium border-border hover:border-foreground"
                              >
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

      {/* Candidate Profile Slide-over Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedStudent(null)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card border-l border-border z-50 overflow-y-auto flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-border flex items-start justify-between bg-muted/20 sticky top-0 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--ng-primary)]/20 text-[var(--ng-primary)] font-bold flex items-center justify-center text-lg border border-[var(--ng-primary)]/40">
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.education.degree || "Student"} · {selectedStudent.education.institution || "University"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedStudent.email}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {selectedStudent.bio && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      About
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{selectedStudent.bio}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Education
                  </h4>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                    <p className="font-semibold text-sm">
                      {selectedStudent.education.institution || "Not specified"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.education.degree} in {selectedStudent.education.field}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50 mt-2">
                      {selectedStudent.education.year && <span>Graduation: {selectedStudent.education.year}</span>}
                      {selectedStudent.education.gpa && (
                        <span className="font-medium text-emerald-400">GPA: {selectedStudent.education.gpa}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Verified Skills ({selectedStudent.skills.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {selectedStudent.skills.map((skill) => (
                      <SkillMeter
                        key={skill.id}
                        skillName={skill.name}
                        currentLevel={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {selectedStudent.projects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Projects ({selectedStudent.projects.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedStudent.projects.map((project) => (
                        <div key={project.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-sm">{project.title}</h5>
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[var(--ng-primary)] hover:underline flex items-center gap-1"
                              >
                                View Project ↗
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.techStack.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-[10px] py-0 px-2">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    const student = selectedStudent;
                    setSelectedStudent(null);
                    setContactStudent(student);
                  }}
                  className="bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary-dark)]"
                >
                  Contact Candidate
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Direct Contact Modal */}
      <AnimatePresence>
        {contactStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setContactStudent(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 max-w-md w-full z-10 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Contact {contactStudent.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setContactStudent(null)} className="h-8 w-8 p-0">
                  ✕
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Reach out directly via email to schedule an interview or discuss an opportunity.
              </p>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-1">
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-mono text-foreground">{contactStudent.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Recruiter: </span>
                  <span>{recruiter?.name || "NextGig Recruiter"}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setContactStudent(null)}>
                  Cancel
                </Button>
                <a href={`mailto:${contactStudent.email}?subject=Opportunity%20Discussion%20via%20NextGig`}>
                  <Button className="bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary-dark)]">
                    Send Email ✉️
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

