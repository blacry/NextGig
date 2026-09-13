"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createOpportunity, getSkillTaxonomy, type CreateOpportunityInput } from "@/lib/data";
import type { Opportunity, OpportunitySkillRequirement, SkillDomain, SkillLevel, SkillTaxonomyItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// ── Opportunity Form ──────────────────────────────────────────────────
// A full JD form that collects every field needed to:
//   1. Post a new opportunity to Supabase
//   2. Drive the student skill-gap analysis
//   3. Power the candidate ranking/matching engine
//
// Rendered as a slide-over drawer (the parent controls visibility via
// `open` + `onClose`). On submit it calls createOpportunity() from
// lib/data.ts and invokes `onSuccess(opportunity)`.

// ── Types ─────────────────────────────────────────────────────────────

type SkillEntry = {
  id: string; // temp uuid for key
  skillId: string;
  skillName: string;
  requiredLevel: SkillLevel;
  /** "must" = required, "important" = preferred high, "nice" = preferred */
  priority: "must" | "important" | "nice";
};

interface OpportunityFormProps {
  open: boolean;
  onClose: () => void;
  recruiterId: string;
  companyId: string;
  initialOpportunity?: Opportunity | null;
  onSuccess: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────

const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  1: "Beginner",
  2: "Elementary",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

const PRIORITY_LABELS = {
  must: "Must Have",
  important: "Important",
  nice: "Good to Have",
};

const PRIORITY_COLORS = {
  must: "bg-red-500/10 text-red-500 border-red-500/20",
  important: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  nice: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

function uid() {
  return Math.random().toString(36).slice(2);
}

// ── Component ──────────────────────────────────────────────────────────

export function OpportunityForm({
  open,
  onClose,
  recruiterId,
  companyId,
  initialOpportunity,
  onSuccess,
}: OpportunityFormProps) {
  // ── Taxonomy ──────────────────────────────────────────────────────────
  const [taxonomy, setTaxonomy] = useState<SkillTaxonomyItem[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  useEffect(() => {
    getSkillTaxonomy().then(setTaxonomy).catch(console.error);
  }, []);

  // ── Form state ────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"full-time" | "internship" | "contract">("full-time");
  const [domain, setDomain] = useState<SkillDomain>("general");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState<"remote" | "hybrid" | "onsite">("remote");
  const [compensation, setCompensation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [description, setDescription] = useState("");
  const [minLevel, setMinLevel] = useState<SkillLevel>(3);
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [submitting, setSubmitting] = useState<"draft" | "publish" | null>(null);

  // ── Pre-fill or Reset on open/change ──────────────────────────────────
  const reset = useCallback(() => {
    setTitle(""); setType("full-time"); setDomain("general");
    setLocation(""); setWorkMode("remote"); setCompensation("");
    setDeadline(""); setDeadline(""); setDuration(""); setEligibility("");
    setDescription(""); setMinLevel(3); setSkills([]);
    setSkillSearch(""); setShowSkillDropdown(false);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
    } else if (initialOpportunity) {
      setTitle(initialOpportunity.title);
      setType(initialOpportunity.type);
      setDomain(initialOpportunity.domain || "general");
      const rawLoc = initialOpportunity.location || "";
      const parts = rawLoc.split("·");
      setLocation(parts[0]?.trim() || rawLoc);
      setCompensation(initialOpportunity.compensation || "");
      setDeadline(initialOpportunity.deadline || "");
      setDuration(initialOpportunity.duration || "");
      setEligibility(initialOpportunity.eligibility || "");
      setDescription(initialOpportunity.description || "");

      const reqSkills: SkillEntry[] = (initialOpportunity.requiredSkills || []).map((s: OpportunitySkillRequirement) => ({
        id: uid(),
        skillId: s.skillId,
        skillName: s.skillName,
        requiredLevel: s.requiredLevel,
        priority: "must",
      }));
      const prefSkills: SkillEntry[] = (initialOpportunity.preferredSkills || []).map((s: OpportunitySkillRequirement) => ({
        id: uid(),
        skillId: s.skillId,
        skillName: s.skillName,
        requiredLevel: s.requiredLevel,
        priority: "important",
      }));
      setSkills([...reqSkills, ...prefSkills]);
    }
  }, [open, initialOpportunity, reset]);

  // ── Skill management ─────────────────────────────────────────────────
  const filteredSkills = taxonomy.filter(
    (s) =>
      !skills.some((e) => e.skillId === s.id) &&
      s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  function addSkill(item: SkillTaxonomyItem) {
    setSkills((prev) => [
      ...prev,
      { id: uid(), skillId: item.id, skillName: item.name, requiredLevel: minLevel, priority: "must" },
    ]);
    setSkillSearch("");
    setShowSkillDropdown(false);
  }

  function addCustomSkill(rawName: string) {
    const name = rawName.trim();
    if (!name) return;
    const customId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setSkills((prev) => [
      ...prev,
      {
        id: uid(),
        skillId: customId || uid(),
        skillName: name,
        requiredLevel: minLevel,
        priority: "must",
      },
    ]);
    setSkillSearch("");
    setShowSkillDropdown(false);
  }

  function removeSkill(id: string) {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  function updateSkill(id: string, patch: Partial<SkillEntry>) {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  // ── Submit ────────────────────────────────────────────────────────────
  async function handleSubmit(active: boolean) {
    if (!title.trim()) { toast.error("Role title is required."); return; }
    if (!description.trim()) { toast.error("Description is required."); return; }
    if (!location.trim()) { toast.error("Location is required."); return; }

    setSubmitting(active ? "publish" : "draft");
    try {
      const input: CreateOpportunityInput = {
        recruiterId,
        companyId,
        title: title.trim(),
        domain,
        type,
        location: `${location.trim()} · ${workMode.charAt(0).toUpperCase() + workMode.slice(1)}`,
        workMode,
        description: description.trim(),
        eligibility: eligibility.trim() || "Open to all",
        compensation: compensation.trim() || "Competitive",
        deadline,
        duration: duration.trim() || undefined,
        openings: 1,
        active,
        skills: skills.map((s) => ({
          skillId: s.skillId,
          requiredLevel: s.requiredLevel,
          preferred: s.priority !== "must",
        })),
      };
      await createOpportunity(input);
      toast.success(active ? "Opportunity published!" : "Saved as draft.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSubmitting(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-background border-l border-border flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold">Create Opportunity</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Fill in the JD details to match and rank candidates.</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Section: Basic Info */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">Opportunity Type</Label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as typeof type)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="full-time">Full-Time Job</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="opp-title" className="text-xs mb-1.5 block">Role Title <span className="text-red-500">*</span></Label>
                    <Input id="opp-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI/ML Engineer" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Domain</Label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as SkillDomain)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="data-ai">Data / AI</option>
                      <option value="cloud">Cloud</option>
                      <option value="devops">DevOps</option>
                      <option value="mobile">Mobile</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="opp-location" className="text-xs mb-1.5 block">Location <span className="text-red-500">*</span></Label>
                    <Input id="opp-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bengaluru / Remote" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Work Mode</Label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value as typeof workMode)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="opp-comp" className="text-xs mb-1.5 block">Salary / Stipend</Label>
                    <Input id="opp-comp" value={compensation} onChange={(e) => setCompensation(e.target.value)} placeholder="₹8-12 LPA" />
                  </div>
                  <div>
                    <Label htmlFor="opp-deadline" className="text-xs mb-1.5 block">Application Deadline</Label>
                    <Input id="opp-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="opp-duration" className="text-xs mb-1.5 block">Duration (internships)</Label>
                    <Input id="opp-duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 months" />
                  </div>
                </div>
              </section>

              {/* Section: Description */}
              <section>
                <Label htmlFor="opp-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                  Description <span className="text-red-500 normal-case font-normal">*</span>
                </Label>
                <textarea
                  id="opp-desc"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role, responsibilities, and what the candidate will work on..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </section>

              {/* Section: Eligibility */}
              <section>
                <Label htmlFor="opp-elig" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                  Eligibility Criteria
                </Label>
                <Input
                  id="opp-elig"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. Final year B.Tech, 7+ CGPA, any branch"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  This is used to surface skill gap info to students who don&apos;t qualify yet.
                </p>
              </section>

              {/* Section: Skills */}
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Required Skills</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">Default Skill Level</Label>
                    <select
                      value={minLevel}
                      onChange={(e) => setMinLevel(Number(e.target.value) as SkillLevel)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {([1, 2, 3, 4, 5] as SkillLevel[]).map((l) => (
                        <option key={l} value={l}>{SKILL_LEVEL_LABELS[l]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <Label className="text-xs mb-1.5 block">Search &amp; Add Skill</Label>
                    <Input
                      value={skillSearch}
                      onChange={(e) => { setSkillSearch(e.target.value); setShowSkillDropdown(true); }}
                      onFocus={() => setShowSkillDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && skillSearch.trim()) {
                          e.preventDefault();
                          const match = filteredSkills[0];
                          if (match && match.name.toLowerCase() === skillSearch.trim().toLowerCase()) {
                            addSkill(match);
                          } else {
                            addCustomSkill(skillSearch.trim());
                          }
                        }
                      }}
                      placeholder="Android, Kotlin, Flutter, Python..."
                    />
                    {showSkillDropdown && (filteredSkills.length > 0 || skillSearch.trim().length > 0) && (
                      <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-popover border border-border rounded-md shadow-lg max-h-56 overflow-y-auto divide-y divide-border">
                        {filteredSkills.slice(0, 15).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onMouseDown={() => addSkill(s)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center justify-between"
                          >
                            <span>{s.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{s.domain}</span>
                          </button>
                        ))}
                        {skillSearch.trim() && !skills.some((e) => e.skillName.toLowerCase() === skillSearch.trim().toLowerCase()) && (
                          <button
                            type="button"
                            onMouseDown={() => addCustomSkill(skillSearch.trim())}
                            className="w-full text-left px-3 py-2 text-sm text-[var(--ng-primary)] hover:bg-accent font-medium flex items-center gap-1.5"
                          >
                            <span>+ Add &quot;{skillSearch.trim()}&quot; as custom skill</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skill entries */}
                {skills.length > 0 ? (
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{skill.skillName}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 border ${PRIORITY_COLORS[skill.priority]}`}
                            >
                              {PRIORITY_LABELS[skill.priority]}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Priority */}
                          <select
                            value={skill.priority}
                            onChange={(e) => updateSkill(skill.id, { priority: e.target.value as SkillEntry["priority"] })}
                            className="h-7 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="must">Must Have</option>
                            <option value="important">Important</option>
                            <option value="nice">Good to Have</option>
                          </select>
                          {/* Level */}
                          <select
                            value={skill.requiredLevel}
                            onChange={(e) => updateSkill(skill.id, { requiredLevel: Number(e.target.value) as SkillLevel })}
                            className="h-7 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            {([1, 2, 3, 4, 5] as SkillLevel[]).map((l) => (
                              <option key={l} value={l}>Lv {l} – {SKILL_LEVEL_LABELS[l]}</option>
                            ))}
                          </select>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground text-sm">
                    Search and add skills above — they drive candidate matching &amp; student skill gap analysis.
                  </div>
                )}
              </section>

              {/* AI insight callout */}
              {skills.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-[var(--ng-primary)]/20 bg-[var(--ng-primary)]/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ng-primary)" stroke="none" className="mt-0.5 flex-shrink-0">
                      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
                    </svg>
                    <div>
                      <p className="text-xs font-medium mb-1">AI Matching Active</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Once published, students will see this role in their Skill Gap page with a personalised breakdown of which skills they need to level up. Your dashboard will show the top-ranked candidates automatically.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border flex-shrink-0 bg-background">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={!!submitting}>Cancel</Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(false)}
                  disabled={!!submitting}
                >
                  {submitting === "draft" ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmit(true)}
                  disabled={!!submitting}
                  className="bg-[var(--ng-primary)] hover:bg-[var(--ng-primary)]/90 text-white"
                >
                  {submitting === "publish" ? "Publishing..." : "Publish Opportunity"}
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
