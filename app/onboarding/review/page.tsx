"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
  FolderGit2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ── Step 2: Vridhi Profile Verification & Review ─────────────────────

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

const DEFAULT_SAMPLE_PROFILE: ParsedProfile = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.edu.in",
  bio: "B.Tech Computer Science student specializing in Web Architecture, AI Integration, and Cloud systems.",
  education: {
    degree: "B.Tech",
    field: "Computer Science & Engineering",
    institution: "National Institute of Technology",
    year: 2026,
    gpa: 8.7,
  },
  skills: [
    { id: "react", name: "React", domain: "frontend", level: 4 },
    { id: "typescript", name: "TypeScript", domain: "frontend", level: 3 },
    { id: "node-js", name: "Node.js", domain: "backend", level: 3 },
    { id: "python", name: "Python", domain: "backend", level: 3 },
    { id: "sql", name: "SQL", domain: "backend", level: 3 },
    { id: "git", name: "Git & Version Control", domain: "devops", level: 4 },
  ],
  projects: [
    {
      title: "Smart National Skill Portal",
      description: "Full-stack role-based management web app with automated verification workflows.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      url: "https://github.com/vridhi-portal/demo-project",
    },
  ],
  certifications: [
    {
      name: "National Industry Skill Standard - Web Tech",
      issuer: "NCVET / AICTE Certified Partner",
      date: "2025-10-12",
    },
  ],
};

export default function ReviewPage() {
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-parsed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ParsedProfile;
        setProfile({
          ...parsed,
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : DEFAULT_SAMPLE_PROFILE.skills,
          projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_SAMPLE_PROFILE.projects,
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : DEFAULT_SAMPLE_PROFILE.certifications,
        });
      } catch {
        setProfile(DEFAULT_SAMPLE_PROFILE);
      }
    } else {
      // If no stored resume found, initialize with template profile so user isn't stuck
      setProfile(DEFAULT_SAMPLE_PROFILE);
    }
  }, []);

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
    setProfile({
      ...profile,
      skills: [...profile.skills, { id: `manual-skill-${Date.now()}`, name: "New Skill", domain: "general", level: 3 }],
    });
  };

  const updateSkillName = (index: number, name: string) => {
    if (!profile) return;
    const skills = [...profile.skills];
    skills[index] = { ...skills[index], name, id: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || `manual-skill-${index}` };
    setProfile({ ...profile, skills });
  };

  const addProject = () => {
    if (!profile) return;
    setProfile({ ...profile, projects: [...profile.projects, { title: "New Project", description: "", techStack: [], url: "" }] });
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
    setProfile({ ...profile, certifications: [...profile.certifications, { name: "New Certification", issuer: "", date: "" }] });
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
    toast.success("Profile details verified.");
    router.push("/onboarding/agreement");
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Header & Stepper */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5AA8]/25 bg-[#1E5AA8]/8 px-3.5 py-1 text-xs font-bold text-[#123B6D]">
          <span className="w-2 h-2 rounded-full bg-[#138808]" />
          <span>STEP 02 OF 05</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
          Review &amp; Refine Your Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6575]">
          VRIDHI AI has organized your credentials. Review and update any details before advancing to skill verification.
        </p>
      </div>

      {/* Stepper Timeline */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#E2E8F0] -z-0" />
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ✓
            </div>
            <span className="text-[11px] font-medium text-[#138808] mt-1.5">Profile</span>
          </div>
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#1E5AA8] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#EBF3FC] shadow-xs">
              02
            </div>
            <span className="text-[11px] font-bold text-[#123B6D] mt-1.5">Review</span>
          </div>
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              03
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Confirm</span>
          </div>
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              04
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Assessment</span>
          </div>
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              05
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
        
        {/* Source Links Info */}
        {(profile.sourceLinks?.githubUrl || profile.sourceLinks?.linkedinUrl) && (
          <Card className="bg-[#EBF3FC] border border-[#1E5AA8]/25 rounded-2xl">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-[#123B6D] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1E5AA8]" />
                Connected Profile Evidence:
              </span>
              <div className="flex items-center gap-4 text-[#1E5AA8]">
                {profile.sourceLinks.githubUrl && (
                  <a href={profile.sourceLinks.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline font-semibold">
                    GitHub Profile <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.sourceLinks.linkedinUrl && (
                  <a href={profile.sourceLinks.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline font-semibold">
                    LinkedIn Profile <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Details */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-[#123B6D] border-b border-[#E2E8F0] pb-3">
              <User className="w-4 h-4 text-[#1E5AA8]" />
              <h2 className="text-base font-bold">Personal &amp; Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Full Name</Label>
                <Input
                  value={profile.name ?? ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Email Address</Label>
                <Input
                  value={profile.email ?? ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Professional Bio &amp; Goals</Label>
              <Input
                value={profile.bio ?? ""}
                onChange={(e) => updateField("bio", e.target.value)}
                className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Education Details */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 text-[#123B6D] border-b border-[#E2E8F0] pb-3">
              <GraduationCap className="w-4 h-4 text-[#1E5AA8]" />
              <h2 className="text-base font-bold">Academic Institution &amp; Degree</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Degree</Label>
                <Input
                  value={profile.education?.degree ?? ""}
                  onChange={(e) => updateField("education.degree", e.target.value)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Discipline / Branch</Label>
                <Input
                  value={profile.education?.field ?? ""}
                  onChange={(e) => updateField("education.field", e.target.value)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Institution / University</Label>
                <Input
                  value={profile.education?.institution ?? ""}
                  onChange={(e) => updateField("education.institution", e.target.value)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">Graduation Year</Label>
                <Input
                  type="number"
                  value={profile.education?.year ?? 2026}
                  onChange={(e) => updateField("education.year", parseInt(e.target.value) || 2026)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#334155] mb-1.5 block">CGPA / Score</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={profile.education?.gpa ?? 8.5}
                  onChange={(e) => updateField("education.gpa", parseFloat(e.target.value) || 8.0)}
                  className="bg-white border-[#CBD5E1] text-xs h-9 rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills List with Level Sliders */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <Layers className="w-4 h-4 text-[#1E5AA8]" />
                <h2 className="text-base font-bold">Identified Competencies ({profile.skills.length})</h2>
              </div>
              <Button variant="outline" size="sm" onClick={addSkill} className="h-8 text-xs font-bold border-[#1E5AA8] text-[#1E5AA8] hover:bg-[#EBF3FC]">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {profile.skills.map((skill, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkillName(i, e.target.value)}
                        className="h-8 text-xs font-bold text-[#123B6D] bg-white border-[#CBD5E1]"
                      />
                      <Badge variant="outline" className="text-[10px] bg-white border-[#CBD5E1] text-[#5B6575]">
                        {skill.domain}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#1E5AA8] w-10">Lvl {skill.level}/5</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => updateSkillLevel(i, parseInt(e.target.value))}
                      className="w-16 h-1.5 accent-[#1E5AA8]"
                    />
                    <button
                      onClick={() => removeSkill(i)}
                      className="p-1 rounded text-[#94A3B8] hover:text-red-600 transition"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <FolderGit2 className="w-4 h-4 text-[#1E5AA8]" />
                <h2 className="text-base font-bold">Key Technical Projects ({profile.projects.length})</h2>
              </div>
              <Button variant="outline" size="sm" onClick={addProject} className="h-8 text-xs font-bold border-[#1E5AA8] text-[#1E5AA8] hover:bg-[#EBF3FC]">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
              </Button>
            </div>
            <div className="space-y-3 pt-2">
              {profile.projects.map((project, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <Input
                      value={project.title}
                      onChange={(e) => updateProject(i, "title", e.target.value)}
                      placeholder="Project Name"
                      className="h-8 text-xs font-bold text-[#123B6D] bg-white border-[#CBD5E1]"
                    />
                    <button
                      onClick={() => removeProject(i)}
                      className="p-1 rounded text-[#94A3B8] hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Input
                    value={project.description}
                    onChange={(e) => updateProject(i, "description", e.target.value)}
                    placeholder="Brief description of work and achievements"
                    className="h-8 text-xs bg-white border-[#CBD5E1]"
                  />
                  <Input
                    value={project.url ?? ""}
                    onChange={(e) => updateProject(i, "url", e.target.value)}
                    placeholder="Repository or live URL (optional)"
                    className="h-8 text-xs bg-white border-[#CBD5E1]"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <Award className="w-4 h-4 text-[#1E5AA8]" />
                <h2 className="text-base font-bold">Certifications &amp; Accreditations ({profile.certifications.length})</h2>
              </div>
              <Button variant="outline" size="sm" onClick={addCertification} className="h-8 text-xs font-bold border-[#1E5AA8] text-[#1E5AA8] hover:bg-[#EBF3FC]">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Certification
              </Button>
            </div>
            <div className="space-y-3 pt-2">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_auto] gap-2.5 items-center">
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(i, "name", e.target.value)}
                    placeholder="Certification Title"
                    className="h-8 text-xs font-bold text-[#123B6D] bg-white border-[#CBD5E1]"
                  />
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(i, "issuer", e.target.value)}
                    placeholder="Issuing Organization"
                    className="h-8 text-xs bg-white border-[#CBD5E1]"
                  />
                  <Input
                    value={cert.date}
                    onChange={(e) => updateCertification(i, "date", e.target.value)}
                    placeholder="Date / Year"
                    className="h-8 text-xs bg-white border-[#CBD5E1]"
                  />
                  <button
                    onClick={() => removeCertification(i)}
                    className="p-1 rounded text-[#94A3B8] hover:text-red-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => router.push("/onboarding/upload")}
            className="w-full sm:w-auto px-6 h-11 border-[#CBD5E1] text-[#334155] font-bold text-xs rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Upload
          </Button>
          <Button
            onClick={handleContinue}
            className="w-full sm:flex-1 h-11 bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all"
          >
            Confirm &amp; Proceed to Declaration <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
