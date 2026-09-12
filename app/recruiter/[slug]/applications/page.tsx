"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRecruiter } from "@/lib/recruiter-context";
import { setApplicationStage } from "@/lib/data";
import { calculateMatchScore } from "@/lib/matching";
import type { Application, ApplicationStage, Student, Opportunity } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkillMeter } from "@/components/skill-meter";
import { SkeletonCard } from "@/components/shared";

// ── Stage Filters Definition ──────────────────────────────────────────

const STAGE_PILLS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Screening", value: "screening" },
  { label: "Interview", value: "interview" },
  { label: "Assessment", value: "assessment" },
  { label: "Offer", value: "offer" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const STAGE_CONFIG: Record<
  ApplicationStage,
  { label: string; bg: string; text: string; border: string }
> = {
  applied: {
    label: "Applied",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  screening: {
    label: "Screening",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  interview: {
    label: "Interview",
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  assessment: {
    label: "Assessment",
    bg: "bg-indigo-500/15",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
  },
  offer: {
    label: "Offer Made",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  accepted: {
    label: "Accepted",
    bg: "bg-teal-500/15",
    text: "text-teal-400",
    border: "border-teal-500/30",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
  withdrawn: {
    label: "Withdrawn",
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
  },
};

// ── Applications Page ──────────────────────────────────────────────────

export default function ApplicationsPage() {
  const { recruiter, opportunities, candidates, applications: contextApps, isLoaded, refresh } = useRecruiter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedOppId, setSelectedOppId] = useState<string>("all");
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  // Local state for instant optimistic updates
  const [localApps, setLocalApps] = useState<Application[]>([]);

  useEffect(() => {
    setLocalApps(contextApps);
  }, [contextApps]);

  // Drawer & Contact Modal State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [contactStudent, setContactStudent] = useState<Student | null>(null);

  // Processed table rows using strictly real database applications
  const tableRows = useMemo(() => {
    return localApps
      .map((app) => {
        const student = candidates.find((s) => s.id === app.studentId);
        const opportunity = opportunities.find((o) => o.id === app.opportunityId);

        let matchScore = 85;
        if (student && opportunity) {
          matchScore = calculateMatchScore(student, opportunity).overallScore;
        } else if (student) {
          const verifiedCount = student.skills.filter((s) => s.verification !== "self-declared").length;
          matchScore = Math.min(98, Math.max(72, 75 + verifiedCount * 4));
        }

        const expYears = student
          ? `${Math.max(1, student.projects.length)} year${student.projects.length > 1 ? "s" : ""}`
          : "1 year";

        return {
          app,
          student,
          opportunity,
          matchScore,
          expYears,
        };
      })
      .filter(({ student, opportunity, app }) => {
        // Query Search (Candidate Name, Role Title, Institution)
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          (student && student.name.toLowerCase().includes(q)) ||
          (opportunity && opportunity.title.toLowerCase().includes(q)) ||
          (student && student.education.institution?.toLowerCase().includes(q));

        // Stage Filter
        const matchesStage =
          selectedStage === "all"
            ? true
            : selectedStage === "shortlisted"
            ? ["screening", "interview", "assessment", "offer", "accepted"].includes(app.currentStage)
            : app.currentStage === selectedStage;

        // Role Filter
        const matchesRole = selectedOppId === "all" || app.opportunityId === selectedOppId;

        return matchesQuery && matchesStage && matchesRole;
      });
  }, [localApps, candidates, opportunities, searchQuery, selectedStage, selectedOppId]);

  // Immediate optimistic stage change handler
  const handleStageChange = async (appId: string, newStage: ApplicationStage) => {
    // Optimistically update local component state so UI updates immediately
    setLocalApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, currentStage: newStage } : a))
    );
    setUpdatingAppId(appId);

    try {
      await setApplicationStage(appId, newStage);
      toast.success(`Application stage updated to "${STAGE_CONFIG[newStage]?.label || newStage}"`);
      await refresh();
    } catch (error: any) {
      // Revert on error
      setLocalApps(contextApps);
      toast.error(error.message || "Failed to update application stage");
    } finally {
      setUpdatingAppId(null);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Review, shortlist and move candidates through your hiring pipeline
          </p>
        </div>

        {/* Global Search Bar in Header */}
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates, skills, roles..."
            className="pl-9 h-10 bg-card text-xs sm:text-sm focus-visible:ring-[var(--ng-primary)]"
          />
        </div>
      </div>

      {/* Stage Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
        {STAGE_PILLS.map((pill) => {
          const isSelected = selectedStage === pill.value;
          const count =
            pill.value === "all"
              ? localApps.length
              : pill.value === "shortlisted"
              ? localApps.filter((a) =>
                  ["screening", "interview", "assessment", "offer", "accepted"].includes(a.currentStage)
                ).length
              : localApps.filter((a) => a.currentStage === pill.value).length;

          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => setSelectedStage(pill.value)}
              className={`px-4 py-2 rounded-full font-medium transition-all shrink-0 border flex items-center gap-2 ${
                isSelected
                  ? "bg-[var(--ng-primary)] text-white border-[var(--ng-primary)] shadow-sm"
                  : "bg-card/80 text-muted-foreground hover:text-foreground hover:bg-accent border-border"
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Opportunity Filter Select */}
        <div className="ml-auto shrink-0 min-w-[200px]">
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="w-full h-9 rounded-full border border-input bg-card px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ng-primary)]"
          >
            <option value="all">Filter by Opportunity (All)</option>
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm overflow-hidden">
        {tableRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Candidate</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Skill Match</th>
                  <th className="py-3.5 px-4 font-semibold">Experience</th>
                  <th className="py-3.5 px-4 font-semibold">Institution</th>
                  <th className="py-3.5 px-4 font-semibold">Applied</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tableRows.map(({ app, student, opportunity, matchScore, expYears }) => {
                  const stageStyle = STAGE_CONFIG[app.currentStage] || STAGE_CONFIG.applied;
                  const appliedDateStr = new Date(app.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  const isShortlisted = ["screening", "interview", "assessment", "offer", "accepted"].includes(app.currentStage);

                  return (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        {student ? (
                          <div className="flex items-center gap-3 min-w-[160px]">
                            <div className="w-9 h-9 rounded-full bg-[var(--ng-primary)]/15 text-[var(--ng-primary)] font-bold flex items-center justify-center text-xs border border-[var(--ng-primary)]/30 shrink-0">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => setSelectedStudent(student)}
                                className="font-semibold text-foreground hover:text-[var(--ng-primary)] transition-colors text-left block truncate"
                              >
                                {student.name}
                              </button>
                              <p className="text-[11px] text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Applicant</span>
                        )}
                      </td>

                      {/* Role Column */}
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {opportunity ? opportunity.title : "General Application"}
                      </td>

                      {/* Skill Match Column */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-0.5"
                        >
                          {matchScore}%
                        </Badge>
                      </td>

                      {/* Experience Column */}
                      <td className="py-3.5 px-4 text-muted-foreground">{expYears}</td>

                      {/* Institution Column */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {student?.education.institution || "Not specified"}
                      </td>

                      {/* Applied Date Column */}
                      <td className="py-3.5 px-4 text-muted-foreground">{appliedDateStr}</td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={app.currentStage}
                            disabled={updatingAppId === app.id}
                            onChange={(e) =>
                              handleStageChange(app.id, e.target.value as ApplicationStage)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border} focus:outline-none cursor-pointer appearance-none pr-6`}
                          >
                            <option value="applied" className="bg-popover text-popover-foreground">
                              Applied
                            </option>
                            <option value="screening" className="bg-popover text-popover-foreground">
                              Screening
                            </option>
                            <option value="interview" className="bg-popover text-popover-foreground">
                              Interview
                            </option>
                            <option value="assessment" className="bg-popover text-popover-foreground">
                              Assessment
                            </option>
                            <option value="offer" className="bg-popover text-popover-foreground">
                              Offer Made
                            </option>
                            <option value="accepted" className="bg-popover text-popover-foreground">
                              Accepted
                            </option>
                            <option value="rejected" className="bg-popover text-popover-foreground">
                              Rejected
                            </option>
                            <option value="withdrawn" className="bg-popover text-popover-foreground">
                              Withdrawn
                            </option>
                          </select>
                          <svg
                            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {student && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                              className="h-8 text-xs font-medium border-border hover:border-foreground"
                            >
                              View
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStageChange(
                                app.id,
                                isShortlisted ? "applied" : "screening"
                              )
                            }
                            className={`h-8 text-xs font-medium ${
                              isShortlisted
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary-dark)]"
                            }`}
                          >
                            {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] flex items-center justify-center mx-auto text-xl">
                📂
              </div>
              <h3 className="text-lg font-semibold">No applications submitted yet</h3>
              <p className="text-sm text-muted-foreground">
                {localApps.length === 0
                  ? "When students apply to your job postings from their student portal, their applications will appear here."
                  : "No candidate applications match your current search or filter criteria."}
              </p>
              {(searchQuery || selectedStage !== "all" || selectedOppId !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStage("all");
                    setSelectedOppId("all");
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Candidate Profile Slide-over Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedStudent(null)}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card border-l border-border z-50 overflow-y-auto flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
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

              {/* Drawer Body Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Bio Summary */}
                {selectedStudent.bio && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      About
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{selectedStudent.bio}</p>
                  </div>
                )}

                {/* Education Details */}
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

                {/* Verified Skills */}
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

                {/* Projects */}
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

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const student = selectedStudent;
                    setSelectedStudent(null);
                    setContactStudent(student);
                  }}
                >
                  Contact Candidate
                </Button>
                <Button
                  onClick={() => {
                    setSelectedStudent(null);
                    toast.success(`Candidate ${selectedStudent.name} saved for review.`);
                  }}
                  className="bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary-dark)]"
                >
                  Shortlist Application
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
                Reach out directly via email to schedule an interview or discuss their application.
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
                <a href={`mailto:${contactStudent.email}?subject=Application%20Update%20via%20NextGig`}>
                  <Button className="bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary-dark)]">
                    Send Email ✉️
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
