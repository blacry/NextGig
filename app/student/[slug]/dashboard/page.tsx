"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStudent } from "@/lib/student-context";
import { DataError, getOpportunitiesWithCompany } from "@/lib/data";
import { calculatePlacementReadiness, identifySkillGaps } from "@/lib/matching";
import { StatCard } from "@/components/stat-card";
import { SkillsRadarChart } from "@/components/skills-radar-chart";
import { OpportunityCard } from "@/components/opportunity-card";
import { AIRecommendationCard } from "@/components/ai-recommendation-card";
import { YouTubeCourseCard } from "@/components/youtube-course-card";
import { SkillMeter } from "@/components/skill-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TERMINAL_STAGES } from "@/lib/types";
import type { Company, Opportunity, SkillLevel } from "@/lib/types";

// ── Student Dashboard ────────────────────────────────────────────────

interface OpportunityWithCompany {
  opportunity: Opportunity;
  company: Company | undefined;
}

export default function StudentDashboardPage() {
  const { student, isLoaded, applications, addApplication } = useStudent();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<OpportunityWithCompany[]>([]);
  const [readiness, setReadiness] = useState<{
    readiness: number;
    bestMatchId: string | null;
    trend: number;
  } | null>(null);
  const [youtubeCourses, setYoutubeCourses] = useState<Array<{
    title: string;
    videoId: string;
    thumbnail: string;
    channel: string;
    description: string;
    relevance: number;
  }>>([]);

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

        try {
          const response = await fetch("/api/youtube-courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              skills: student.skills.map((skill) => skill.name),
              context: `Dashboard recommendations for a ${student.education.field} student`,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            if (active) setYoutubeCourses(data.courses || []);
          }
        } catch (youtubeError) {
          console.error("[dashboard] YouTube recommendations failed", youtubeError);
        }
      } catch (error) {
        console.error("[dashboard] failed to load opportunities", error);
        if (active) {
          toast.error(
            error instanceof DataError
              ? error.message
              : "Could not load your dashboard. Please refresh the page."
          );
          // Still render the profile-driven half of the dashboard.
          setReadiness({ readiness: 0, bestMatchId: null, trend: 0 });
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [student]);

  if (!isLoaded || !student || !readiness) return null;

  // Derive stats
  const verifiedSkills = student.skills.filter((s) => s.verification !== "self-declared").length;
  const activeApps = applications.filter(
    (a) => !TERMINAL_STAGES.includes(a.currentStage)
  ).length;
  const interviewApps = applications.filter((a) => a.currentStage === "interview").length;
  const applicationStatusLabel = (stage: string) => stage.charAt(0).toUpperCase() + stage.slice(1);

  // Find gaps for the best match
  const bestMatch = opportunities.find((row) => row.opportunity.id === readiness.bestMatchId);
  const gaps = bestMatch ? identifySkillGaps(student, bestMatch.opportunity) : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your placement journey at a glance.</p>
      </motion.div>

      {/* Top Row: Skills Radar Chart + Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Skill Proficiency
          </h3>
          <SkillsRadarChart skills={student.skills} />
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            index={0}
            title="Verified Skills"
            value={verifiedSkills}
            suffix={`/ ${student.skills.length}`}
            description="Assessed or project-verified"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          />
          <StatCard
            index={1}
            title="Projects"
            value={student.projects.length}
            description={`${student.projects.filter((p) => p.verified).length} verified by professors`}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
          />
          <StatCard
            index={2}
            title="Active Applications"
            value={activeApps}
            description={
              interviewApps > 0
                ? `${interviewApps} in the interview phase`
                : "No interviews scheduled yet"
            }
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
          />
          <StatCard
            index={3}
            title="GPA"
            value={student.education.gpa || 0}
            description={student.education.institution}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
          />
        </div>
      </div>

      {youtubeCourses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Learn next</h3>
              <p className="text-sm text-muted-foreground">AI-recommended YouTube lessons for your career path.</p>
            </div>
            <button className="text-sm text-[var(--ng-primary)] hover:underline" onClick={() => router.push(`/student/${student.slug}/courses`)}>View all</button>
          </div>
          <div className="card-grid card-grid-3">
            {youtubeCourses.slice(0, 3).map((course, index) => (
              <YouTubeCourseCard key={`${course.videoId}-${index}`} {...course} index={index} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-semibold">Application activity</h3><p className="text-sm text-muted-foreground">Live updates from recruiter pipelines.</p></div><button className="text-sm text-[var(--ng-primary)] hover:underline" onClick={() => router.push(`/student/${student.slug}/opportunities`)}>View opportunities</button></div>
        <Card><CardContent className="p-0">{applications.length ? <div className="card-grid card-grid-2 gap-3 p-4">{applications.slice(0, 6).map((application) => { const row = opportunities.find((item) => item.opportunity.id === application.opportunityId); const latest = application.stageHistory.at(-1); return <button key={application.id} onClick={() => router.push(`/student/${student.slug}/opportunities`)} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/20 p-4 text-left transition-colors hover:bg-muted/50"><div className="min-w-0"><p className="truncate text-sm font-semibold">{row?.opportunity.title || "Opportunity"}</p><p className="mt-1 text-xs text-muted-foreground">Updated {latest ? new Date(latest.timestamp).toLocaleDateString() : "recently"}</p></div><span className="shrink-0 rounded-full bg-[var(--ng-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--ng-primary)]">{applicationStatusLabel(application.currentStage)}</span></button>; })}</div> : <div className="p-6 text-center text-sm text-muted-foreground">No applications yet. Explore opportunities to get started.</div>}</CardContent></Card>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Top Match & Gaps */}
        <div className="xl:col-span-2 space-y-6">
          <h3 className="font-semibold text-lg">Top Recommended Opportunity</h3>
          {bestMatch ? (
            <div className="max-w-2xl">
            <OpportunityCard
              opportunity={bestMatch.opportunity}
              company={bestMatch.company}
              matchReason={`Your ${bestMatch.opportunity.domain} background and Level ${student.skills[0]?.level || 3} ${student.skills[0]?.name || "skills"} make you a strong candidate.`}
              onViewDetails={() => router.push(`/student/${student.slug}/opportunities`)}
              onApply={() => void addApplication(bestMatch.opportunity.id)}
            />
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                No opportunities have been posted yet. Check back soon.
              </CardContent>
            </Card>
          )}

          <h3 className="font-semibold text-lg mt-8">Critical Skill Gaps to Close</h3>
          <Card>
            <CardContent className="p-0">
              {gaps.length > 0 ? (
                <div className="divide-y divide-border">
                  {gaps.slice(0, 3).map((gap, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{gap.skillName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            gap.severity === 'critical' ? 'bg-[var(--ng-critical)]/10 text-[var(--ng-critical)]' :
                            gap.severity === 'moderate' ? 'bg-[var(--ng-warning)]/10 text-[var(--ng-warning)]' :
                            'bg-[var(--ng-primary)]/10 text-[var(--ng-primary)]'
                          }`}>
                            {gap.severity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{gap.requirement}</p>
                      </div>
                      <div className="w-32 shrink-0">
                        <SkillMeter skillName="" currentLevel={gap.currentLevel as SkillLevel} targetLevel={gap.requiredLevel as SkillLevel} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No critical gaps identified for your top matches. Great job!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Career Tips & Quick Actions */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">Career Tips</h3>

          {/* Career Tips Card */}
          <Card className="bg-gradient-to-br from-[var(--ng-primary)]/5 to-[var(--ng-primary)]/10 border-[var(--ng-primary)]/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--ng-primary)]/20 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ng-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-2 text-[var(--ng-primary)]">
                    Boost Your Readiness Score
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your current readiness is <strong>{readiness.readiness}%</strong>. To improve:
                  </p>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {[
                  "Complete skill assessments to verify expertise",
                  "Add recent projects to show practical experience",
                  "Close critical gaps to unlock more roles",
                  "Refresh your profile before applying",
                  "Practice explaining your strongest projects",
                  "Track application feedback and next steps",
                ].map((tip) => <li key={tip} className="flex items-start gap-2"><span className="text-[var(--ng-primary)]">•</span><span>{tip}</span></li>)}
              </ul>
            </CardContent>
          </Card>

          {/* Skill Gap Insights */}
          {gaps.slice(0, 2).map((gap) => (
            <AIRecommendationCard
              key={gap.skillId}
              title={`Improve your ${gap.skillName} level`}
              reason={`${gap.requirement} You are currently Level ${gap.currentLevel}.`}
              actionLabel={`View ${gap.skillName} gap`}
              onAction={() => router.push(`/student/${student.slug}/skill-gap`)}
            />
          ))}
          {gaps.length === 0 && (
            <AIRecommendationCard
              title="Keep your profile fresh"
              reason="Adding a recent project boosts your experience match on every role you apply to."
              actionLabel="Update Profile"
              onAction={() => router.push(`/student/${student.slug}/portfolio`)}
            />
          )}

          <Card className="border-dashed bg-muted/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3">
              <button onClick={() => router.push("/onboarding/upload")} className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-sm font-medium text-left">
                <span>Update Resume</span>
                <span className="text-muted-foreground">→</span>
              </button>
              <button onClick={() => router.push(`/student/${student.slug}/portfolio`)} className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-sm font-medium text-left">
                <span>Request Project Verification</span>
                <span className="text-muted-foreground">→</span>
              </button>
              <button onClick={() => router.push(`/student/${student.slug}/skills`)} className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-sm font-medium text-left">
                <span>View All Skills</span>
                <span className="text-muted-foreground">→</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
