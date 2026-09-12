"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

// ── Step 2: Review Parsed Profile ────────────────────────────────────

interface ParsedSkill {
  id: string;
  name: string;
  domain: string;
  level: number;
}

interface ParsedProfile {
  name: string;
  email: string;
  bio: string;
  education: { degree: string; field: string; institution: string; year: number; gpa?: number };
  skills: ParsedSkill[];
  projects: { title: string; description: string; techStack: string[] }[];
  certifications: { name: string; issuer: string; date: string }[];
}

const POPULAR_SKILL_SUGGESTIONS = [
  { name: "Docker", domain: "devops" },
  { name: "TypeScript", domain: "frontend" },
  { name: "Git", domain: "devops" },
  { name: "PostgreSQL", domain: "backend" },
  { name: "AWS", domain: "cloud" },
  { name: "GraphQL", domain: "backend" },
  { name: "Tailwind CSS", domain: "frontend" },
  { name: "Figma", domain: "frontend" },
  { name: "Kubernetes", domain: "devops" },
  { name: "MongoDB", domain: "data-ai" },
  { name: "Redis", domain: "backend" },
  { name: "Linux", domain: "devops" },
];

export default function ReviewPage() {
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDomain, setNewSkillDomain] = useState("general");
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-parsed");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        router.push("/onboarding/upload");
      }
    } else {
      router.push("/onboarding/upload");
    }
  }, [router]);

  const updateField = (path: string, value: unknown) => {
    if (!profile) return;
    const keys = path.split(".");
    const updated = { ...profile };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) };
      obj = obj[keys[i]] as Record<string, unknown>;
    }
    obj[keys[keys.length - 1]] = value;
    setProfile(updated as ParsedProfile);
  };

  const removeSkill = (index: number) => {
    if (!profile) return;
    const removed = profile.skills[index]?.name;
    setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== index) });
    if (removed) {
      toast.info(`Removed ${removed}`);
    }
  };

  const updateSkillLevel = (index: number, level: number) => {
    if (!profile) return;
    const skills = [...profile.skills];
    skills[index] = { ...skills[index], level: Math.min(5, Math.max(1, level)) };
    setProfile({ ...profile, skills });
  };

  const handleAddSkill = () => {
    if (!profile) return;
    const trimmed = newSkillName.trim();
    if (!trimmed) {
      toast.error("Please enter a skill name.");
      return;
    }

    const exists = profile.skills.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      toast.error(`"${trimmed}" is already in your skills list.`);
      return;
    }

    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `skill-${Date.now()}`;
    const newSkill: ParsedSkill = {
      id,
      name: trimmed,
      domain: newSkillDomain,
      level: newSkillLevel,
    };

    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill],
    });

    toast.success(`Added "${trimmed}" to your skills.`);
    setNewSkillName("");
    setNewSkillLevel(3);
    setNewSkillDomain("general");
    setIsAddingSkill(false);
  };

  const handleContinue = () => {
    if (!profile) return;
    sessionStorage.setItem("nextgig-onboarding-parsed", JSON.stringify(profile));
    router.push("/onboarding/agreement");
  };

  if (!profile) return null;

  const availableSuggestions = POPULAR_SKILL_SUGGESTIONS.filter(
    (s) => !profile.skills.some((existing) => existing.name.toLowerCase() === s.name.toLowerCase())
  );

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step <= 2 ? "bg-ng-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              {step < 2 ? "✓" : step}
            </div>
            {step < 5 && <div className={`w-8 h-px ${step < 2 ? "bg-ng-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
        <p className="text-muted-foreground mb-6">
          Here&apos;s what our AI extracted from your CV. Review and edit anything that needs correction.
        </p>

        {/* Personal Info */}
        <Card className="mb-4">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-xs mb-1.5 block">Full Name</Label><Input value={profile.name ?? ""} onChange={(e) => updateField("name", e.target.value)} /></div>
              <div><Label className="text-xs mb-1.5 block">Email</Label><Input value={profile.email ?? ""} onChange={(e) => updateField("email", e.target.value)} /></div>
            </div>
            <div><Label className="text-xs mb-1.5 block">Bio</Label><Input value={profile.bio ?? ""} onChange={(e) => updateField("bio", e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-4">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label className="text-xs mb-1.5 block">Degree</Label><Input value={profile.education.degree ?? ""} onChange={(e) => updateField("education.degree", e.target.value)} /></div>
              <div><Label className="text-xs mb-1.5 block">Field</Label><Input value={profile.education.field ?? ""} onChange={(e) => updateField("education.field", e.target.value)} /></div>
              <div><Label className="text-xs mb-1.5 block">Institution</Label><Input value={profile.education.institution ?? ""} onChange={(e) => updateField("education.institution", e.target.value)} /></div>
              <div className="flex gap-4">
                <div className="flex-1"><Label className="text-xs mb-1.5 block">Year</Label><Input type="number" value={profile.education.year ?? ""} onChange={(e) => updateField("education.year", parseInt(e.target.value))} /></div>
                <div className="flex-1"><Label className="text-xs mb-1.5 block">GPA</Label><Input type="number" step="0.1" value={profile.education.gpa ?? ""} onChange={(e) => updateField("education.gpa", parseFloat(e.target.value))} /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Skills ({profile.skills.length})
              </h3>
              {!isAddingSkill && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingSkill(true)}
                  className="h-8 text-xs gap-1.5 border-dashed border-ng-primary/60 text-ng-primary hover:bg-ng-primary/10 hover:text-ng-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Skill
                </Button>
              )}
            </div>

            {/* Inline Add Skill Form */}
            <AnimatePresence>
              {isAddingSkill && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="p-4 rounded-xl border border-ng-primary/30 bg-muted/40 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-ng-primary" />
                        <span className="text-xs font-semibold text-foreground">Add Missing Skill</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setIsAddingSkill(false);
                          setNewSkillName("");
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <Label className="text-[11px] mb-1.5 block text-muted-foreground font-medium">Skill Name</Label>
                        <Input
                          autoFocus
                          placeholder="e.g. Docker, TypeScript, AWS..."
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          className="h-9 text-xs bg-background"
                        />
                      </div>

                      <div>
                        <Label className="text-[11px] mb-1.5 block text-muted-foreground font-medium">Domain</Label>
                        <select
                          value={newSkillDomain}
                          onChange={(e) => setNewSkillDomain(e.target.value)}
                          className="w-full h-9 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="data-ai">Data & AI</option>
                          <option value="cloud">Cloud</option>
                          <option value="devops">DevOps</option>
                          <option value="mobile">Mobile</option>
                          <option value="general">General</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <Label className="text-[11px] text-muted-foreground font-medium">Proficiency</Label>
                          <span className="text-[11px] font-semibold text-ng-primary">Lvl {newSkillLevel}/5</span>
                        </div>
                        <div className="flex items-center gap-2 h-9">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={newSkillLevel}
                            onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                            className="w-full h-1.5 accent-ng-primary cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick suggestions if user wants to easily pick common skills */}
                    {availableSuggestions.length > 0 && (
                      <div className="pt-1 border-t border-border/40">
                        <span className="text-[10px] text-muted-foreground block mb-1.5">Suggested missing skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {availableSuggestions.slice(0, 8).map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => {
                                setNewSkillName(item.name);
                                setNewSkillDomain(item.domain);
                              }}
                              className="text-[10px] px-2.5 py-1 rounded-full border border-border/80 bg-background/80 hover:bg-ng-primary/10 hover:border-ng-primary/40 hover:text-ng-primary transition-all text-muted-foreground cursor-pointer"
                            >
                              + {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                          setIsAddingSkill(false);
                          setNewSkillName("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={handleAddSkill}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Skill
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {profile.skills.map((skill, i) => (
                <motion.div
                  key={skill.id || i}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <Badge variant="outline" className="ml-2 text-[9px] h-auto min-h-0 min-w-0 py-0 px-1">{skill.domain}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground w-12">Lvl {skill.level}/5</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.level ?? ""}
                      onChange={(e) => updateSkillLevel(i, parseInt(e.target.value))}
                      className="w-20 h-1.5 accent-ng-primary cursor-pointer"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(i)}
                    title="Discard skill"
                    aria-label={`Discard ${skill.name}`}
                    className="w-7 h-7 p-0 min-h-0 min-w-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {!isAddingSkill && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSkill(true)}
                className="w-full mt-3 border border-dashed border-border/80 text-muted-foreground hover:text-foreground hover:border-ng-primary/40 text-xs py-2 h-auto gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add more skills
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Projects ({profile.projects.length})</h3>
            {profile.projects.map((project, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 mb-2">
                <p className="text-sm font-medium">{project.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-[10px] h-auto min-h-0 min-w-0 py-0 px-1.5">{tech}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Certifications</h3>
              {profile.certifications.map((cert, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 mb-2">
                  <p className="text-sm font-medium">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/onboarding/upload")} className="flex-1">
            ← Back to Upload
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            This Looks Right →
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
