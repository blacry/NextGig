"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRecruiter } from "@/lib/recruiter-context";
import { calculateMatchScore, identifySkillGaps } from "@/lib/matching";
import type { Student, Opportunity, SkillDomain } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SkillMeter } from "@/components/skill-meter";
import { SkeletonCard } from "@/components/shared";

// ── Filter Pills Definition ───────────────────────────────────────────

const DOMAIN_PILLS: { label: string; value: string }[] = [
  { label: "All Domains", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Data / AI", value: "data-ai" },
  { label: "Cloud", value: "cloud" },
  { label: "DevOps", value: "devops" },
  { label: "Mobile", value: "mobile" },
];

const AVAILABILITY_OPTIONS = ["Available", "Immediate", "2 weeks"];

// ── Talent Discovery Page ─────────────────────────────────────────────

export default function TalentPoolPage() {
  const searchParams = useSearchParams();
  const { recruiter, opportunities, candidates, isLoaded } = useRecruiter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOppId, setSelectedOppId] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  
  // Drawer & Modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [contactStudent, setContactStudent] = useState<Student | null>(null);

  // Sync opportunity filter from query parameter ?role=...
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setSelectedOppId(roleParam);
    }
  }, [searchParams]);

  // Target opportunity for matching calculations
  const targetOpportunity = useMemo(() => {
    if (selectedOppId === "all") return null;
    return opportunities.find((o) => o.id === selectedOppId) ?? null;
  }, [selectedOppId, opportunities]);

  // Compute student match score and stats
  const processedCandidates = useMemo(() => {
    return candidates.map((student, idx) => {
      let matchScore = 80;
      let matchBreakdown = null;

      if (targetOpportunity) {
        const matchResult = calculateMatchScore(student, targetOpportunity);
        matchScore = matchResult.overallScore;
        matchBreakdown = matchResult.breakdown;
      } else {
        // Default readiness score based on verified skills & projects
        const verifiedCount = student.skills.filter((s) => s.verification !== "self-declared").length;
        const avgLevel = student.skills.length > 0
          ? student.skills.reduce((acc, s) => acc + s.level, 0) / student.skills.length
          : 2.5;
        matchScore = Math.min(98, Math.max(70, Math.round(70 + verifiedCount * 4 + avgLevel * 3 + (idx % 5))));
      }

      // Static display availability determination for UI demonstration
      const availabilityList = ["Available", "Immediate", "Available in 2 weeks"];
      const availability = availabilityList[idx % availabilityList.length];

      return {
        student,
        matchScore,
        matchBreakdown,
        availability,
      };
    });
  }, [candidates, targetOpportunity]);

  // Filtered & sorted candidates
  const filteredCandidates = useMemo(() => {
    return processedCandidates.filter(({ student, matchScore }) => {
      // Query filter (Name, Degree, Institution, Skill name, Project title)
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.education.institution?.toLowerCase().includes(q) ||
        student.education.degree?.toLowerCase().includes(q) ||
        student.education.field?.toLowerCase().includes(q) ||
        student.skills.some((s) => s.name.toLowerCase().includes(q)) ||
        student.projects.some((p) => p.title.toLowerCase().includes(q));

      // Domain filter
      const matchesDomain =
        selectedDomain === "all"
          ? true
          : student.skills.some((s) => s.domain === selectedDomain);

      // Min match filter
      const matchesScore = matchScore >= minMatchFilter;

      return matchesQuery && matchesDomain && matchesScore;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [processedCandidates, searchQuery, selectedDomain, minMatchFilter]);

  const toggleShortlist = (studentId: string, studentName: string) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
        toast.info(`Removed ${studentName} from shortlist`);
      } else {
        next.add(studentId);
        toast.success(`Shortlisted ${studentName}!`);
      }
      return next;
    });
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talent Discovery</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Find candidates based on verified skills, experience, projects and career readiness.
        </p>
      </div>

      {/* Main Search & Role Filter Bar */}
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              width="18"
              height="18"
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
              placeholder="Search students by skill, role, technology or project..."
              className="pl-10 h-11 bg-background text-sm focus-visible:ring-[var(--ng-primary)]"
            />
          </div>

          {/* Role Match Dropdown */}
          <div className="w-full md:w-72">
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ng-primary)]"
            >
              <option value="all">🎯 Match: All Candidates</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  Match vs. {opp.title} ({opp.requiredSkills.length} skills)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pill Filters Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-muted-foreground font-medium shrink-0 mr-1">Domain:</span>
          {DOMAIN_PILLS.map((pill) => {
            const isSelected = selectedDomain === pill.value;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => setSelectedDomain(pill.value)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border ${
                  isSelected
                    ? "bg-[var(--ng-primary)] text-white border-[var(--ng-primary)] shadow-sm"
                    : "bg-background/80 text-muted-foreground hover:text-foreground hover:bg-accent border-border"
                }`}
              >
                {pill.label}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-border mx-1 shrink-0" />

          {/* High match toggle filter */}
          <button
            type="button"
            onClick={() => setMinMatchFilter(minMatchFilter === 80 ? 0 : 80)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
              minMatchFilter === 80
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-background/80 text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            <span>✨ 80%+ Match Only</span>
          </button>
        </div>
      </Card>

      {/* Target Role Notification Banner if selected */}
      {targetOpportunity && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-[var(--ng-primary)]/10 border border-[var(--ng-primary)]/30 flex items-center justify-between gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <span>
              Matching candidate pool against <strong className="text-foreground">{targetOpportunity.title}</strong> ({targetOpportunity.location})
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedOppId("all")}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear Role Filter
          </Button>
        </motion.div>
      )}

      {/* Candidate Cards 3-Column Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map(({ student, matchScore, availability }) => {
            const isShortlisted = shortlistedIds.has(student.id);
            const verifiedSkillsCount = student.skills.filter((s) => s.verification !== "self-declared").length;

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col justify-between hover:border-[var(--ng-primary)]/50 transition-all duration-200 shadow-sm hover:shadow-md bg-card/80 group">
                  <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
                    {/* Candidate Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[var(--ng-primary)]/15 border border-[var(--ng-primary)]/30 text-[var(--ng-primary)] font-bold flex items-center justify-center text-sm shrink-0">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base tracking-tight truncate group-hover:text-[var(--ng-primary)] transition-colors">
                            {student.name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {student.education.institution || "University Student"}{" "}
                            {student.education.degree ? `· ${student.education.degree}` : ""}
                          </p>
                        </div>
                      </div>

                      {isShortlisted && (
                        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] shrink-0">
                          Shortlisted
                        </Badge>
                      )}
                    </div>

                    {/* AI Skill Match Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-sm text-[var(--ng-primary)]">{matchScore}%</span>
                        <span className="text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
                          AI Skill Match
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--ng-primary)] to-emerald-400 transition-all duration-500"
                          style={{ width: `${matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Top Skill Chips */}
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {student.skills.slice(0, 5).map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="text-[11px] font-normal py-0.5 px-2 bg-muted/60 hover:bg-muted"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                      {student.skills.length > 5 && (
                        <Badge variant="outline" className="text-[10px] py-0.5 px-1.5 text-muted-foreground">
                          +{student.skills.length - 5}
                        </Badge>
                      )}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-lg bg-muted/30 border border-border/50 mt-auto">
                      <div>
                        <span className="text-muted-foreground">Projects: </span>
                        <span className="font-semibold text-foreground">{student.projects.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Certifications: </span>
                        <span className="font-semibold text-foreground">{student.certifications.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Verified: </span>
                        <span className="font-semibold text-emerald-400">{verifiedSkillsCount} skills</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Availability: </span>
                        <span className="font-semibold text-foreground">{availability}</span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                        className="h-8 text-xs font-medium border-border hover:border-foreground"
                      >
                        View Profile
                      </Button>

                      <Button
                        variant={isShortlisted ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => toggleShortlist(student.id, student.name)}
                        className={`h-8 text-xs font-medium ${
                          isShortlisted ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : ""
                        }`}
                      >
                        {isShortlisted ? "Saved" : "Shortlist"}
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => setContactStudent(student)}
                        className="h-8 text-xs font-medium bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary-dark)] shadow-sm"
                      >
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-lg font-semibold">No candidates found</h3>
            <p className="text-sm text-muted-foreground">
              No student profiles match your search criteria. Try adjusting your search query or domain filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("all");
                setSelectedOppId("all");
                setMinMatchFilter(0);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      )}

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
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">About</h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{selectedStudent.bio}</p>
                  </div>
                )}

                {/* Education Details */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Education</h4>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                    <p className="font-semibold text-sm">{selectedStudent.education.institution || "Not specified"}</p>
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

                {/* Certifications */}
                {selectedStudent.certifications.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Certifications ({selectedStudent.certifications.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedStudent.certifications.map((cert) => (
                        <div key={cert.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-foreground">{cert.name}</span>
                            {cert.issuer && <span className="text-muted-foreground"> · {cert.issuer}</span>}
                          </div>
                          {cert.date && <span className="text-muted-foreground">{cert.date}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <Button
                  variant={shortlistedIds.has(selectedStudent.id) ? "secondary" : "outline"}
                  onClick={() => toggleShortlist(selectedStudent.id, selectedStudent.name)}
                >
                  {shortlistedIds.has(selectedStudent.id) ? "★ Shortlisted" : "☆ Shortlist"}
                </Button>
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
                Reach out directly via email to invite {contactStudent.name} for an interview or role discussion.
              </p>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-1">
                <div><span className="text-muted-foreground">Email: </span><span className="font-mono text-foreground">{contactStudent.email}</span></div>
                <div><span className="text-muted-foreground">Recruiter: </span><span>{recruiter?.name || "NextGig Recruiter"}</span></div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setContactStudent(null)}>Cancel</Button>
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
    </div>
  );
}
