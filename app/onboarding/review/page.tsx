"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

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
  projects: { title: string; description: string; techStack: string[]; url?: string }[];
  certifications: { name: string; issuer: string; date: string }[];
  sourceLinks?: { githubUrl?: string; linkedinUrl?: string };
}

const PREDEFINED_SKILL_TAGS = [
  { id: "javascript", name: "JavaScript", domain: "frontend" },
  { id: "typescript", name: "TypeScript", domain: "frontend" },
  { id: "react", name: "React", domain: "frontend" },
  { id: "node-js", name: "Node.js", domain: "backend" },
  { id: "python", name: "Python", domain: "backend" },
  { id: "java", name: "Java", domain: "backend" },
  { id: "sql", name: "SQL", domain: "data-ai" },
  { id: "machine-learning", name: "Machine Learning", domain: "data-ai" },
  { id: "aws", name: "AWS", domain: "cloud" },
  { id: "docker", name: "Docker", domain: "devops" },
  { id: "git", name: "Git", domain: "devops" },
  { id: "figma", name: "Figma", domain: "general" },
] as const;

export default function ReviewPage() {
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [selectedSkillTag, setSelectedSkillTag] = useState(PREDEFINED_SKILL_TAGS[0].id);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-parsed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ParsedProfile;
        queueMicrotask(() => setProfile({
          ...parsed,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        }));
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
    setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== index) });
  };

  const updateSkillLevel = (index: number, level: number) => {
    if (!profile) return;
    const skills = [...profile.skills];
    skills[index] = { ...skills[index], level: Math.min(5, Math.max(1, level)) };
    setProfile({ ...profile, skills });
  };

  const addSkill = () => {
    if (!profile) return;
    const tag = PREDEFINED_SKILL_TAGS.find((item) => item.id === selectedSkillTag);
    if (!tag || profile.skills.some((skill) => skill.id === tag.id)) return;
    setProfile({ ...profile, skills: [...profile.skills, { ...tag, level: 1 }] });
  };

  const updateSkillName = (index: number, name: string) => {
    if (!profile) return;
    const skills = [...profile.skills];
    skills[index] = { ...skills[index], name, id: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || `manual-skill-${index}` };
    setProfile({ ...profile, skills });
  };

  const addProject = () => {
    if (!profile) return;
    setProfile({ ...profile, projects: [...profile.projects, { title: "New project", description: "", techStack: [], url: "" }] });
  };

  const updateProject = (index: number, field: "title" | "description" | "url", value: string) => {
    if (!profile) return;
    const projects = [...profile.projects];
    projects[index] = { ...projects[index], [field]: value };
    setProfile({ ...profile, projects });
  };

  const removeProject = (index: number) => {
    if (!profile) return;
    setProfile({ ...profile, projects: profile.projects.filter((_, i) => i !== index) });
  };

  const addCertification = () => {
    if (!profile) return;
    setProfile({ ...profile, certifications: [...profile.certifications, { name: "New certification", issuer: "", date: "" }] });
  };

  const updateCertification = (index: number, field: "name" | "issuer" | "date", value: string) => {
    if (!profile) return;
    const certifications = [...profile.certifications];
    certifications[index] = { ...certifications[index], [field]: value };
    setProfile({ ...profile, certifications });
  };

  const removeCertification = (index: number) => {
    if (!profile) return;
    setProfile({ ...profile, certifications: profile.certifications.filter((_, i) => i !== index) });
  };

  const handleContinue = () => {
    if (!profile) return;
    sessionStorage.setItem("nextgig-onboarding-parsed", JSON.stringify(profile));
    router.push("/onboarding/agreement");
  };

  if (!profile) return null;

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
          Review the combined profile evidence and correct anything that is missing or inaccurate. Your edits become the source of truth for the assessment.
        </p>

        {(profile.sourceLinks?.githubUrl || profile.sourceLinks?.linkedinUrl) && (
          <Card className="mb-4">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-3">Profile sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {profile.sourceLinks.githubUrl && <a className="text-[var(--ng-primary)] truncate" href={profile.sourceLinks.githubUrl} target="_blank" rel="noreferrer">GitHub: {profile.sourceLinks.githubUrl}</a>}
                {profile.sourceLinks.linkedinUrl && <a className="text-[var(--ng-primary)] truncate" href={profile.sourceLinks.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn: {profile.sourceLinks.linkedinUrl}</a>}
              </div>
            </CardContent>
          </Card>
        )}

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
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Skills ({profile.skills.length})</h3>
            <div className="space-y-3">
              {profile.skills.map((skill, i) => (
                <motion.div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="flex-1 min-w-0">
                    <Input value={skill.name} onChange={(e) => updateSkillName(i, e.target.value)} className="h-7 text-sm max-w-xs" aria-label={`Skill ${i + 1} name`} />
                    <Badge variant="outline" className="ml-2 text-[9px] h-auto min-h-0 min-w-0 py-0 px-1">{skill.domain}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground w-12">Lvl {skill.level}/5</span>
                    <input type="range" min="1" max="5" value={skill.level ?? ""} onChange={(e) => updateSkillLevel(i, parseInt(e.target.value))} className="w-20 h-1.5 accent-ng-primary" />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeSkill(i)} className="w-7 h-7 p-0 min-h-0 min-w-0 text-muted-foreground hover:text-destructive">×</Button>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Label htmlFor="skill-tag" className="sr-only">Skill tag</Label>
              <select
                id="skill-tag"
                value={selectedSkillTag}
                onChange={(e) => setSelectedSkillTag(e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {PREDEFINED_SKILL_TAGS.map((tag) => (
                  <option key={tag.id} value={tag.id} disabled={profile.skills.some((skill) => skill.id === tag.id)}>
                    {tag.name}{profile.skills.some((skill) => skill.id === tag.id) ? " (added)" : ""}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={addSkill} disabled={profile.skills.some((skill) => skill.id === selectedSkillTag)}>
                <Plus size={14} className="mr-1" /> Add selected skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Projects ({profile.projects.length})</h3>
            {profile.projects.map((project, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50 mb-2 space-y-2">
                <div className="flex gap-2"><Input value={project.title} onChange={(e) => updateProject(i, "title", e.target.value)} placeholder="Project name" /><Button variant="ghost" size="sm" onClick={() => removeProject(i)} aria-label="Remove project"><Trash2 size={15} /></Button></div>
                <Input value={project.description} onChange={(e) => updateProject(i, "description", e.target.value)} placeholder="What did you build?" />
                <Input value={project.url ?? ""} onChange={(e) => updateProject(i, "url", e.target.value)} placeholder="Project or repository URL (optional)" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2" onClick={addProject}><Plus size={14} className="mr-1" /> Add project</Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Certifications ({profile.certifications.length})</h3>
              {profile.certifications.map((cert, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 mb-2 grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_auto] gap-2 items-center">
                  <Input value={cert.name} onChange={(e) => updateCertification(i, "name", e.target.value)} placeholder="Certification name" />
                  <Input value={cert.issuer} onChange={(e) => updateCertification(i, "issuer", e.target.value)} placeholder="Issuer" />
                  <Input value={cert.date} onChange={(e) => updateCertification(i, "date", e.target.value)} placeholder="Date" />
                  <Button variant="ghost" size="sm" onClick={() => removeCertification(i)} aria-label="Remove certification"><Trash2 size={15} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2" onClick={addCertification}><Plus size={14} className="mr-1" /> Add certification</Button>
            </CardContent>
          </Card>

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
