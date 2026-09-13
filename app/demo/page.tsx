"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Briefcase,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink,
  Target,
  Zap,
  BarChart3,
  Layers,
  GraduationCap,
  Building2,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock interactive demo dataset reflecting NextGig's core features
const DEMO_STUDENT = {
  name: "Alex Chen",
  role: "Aspiring Full-Stack & AI Engineer",
  institution: "National Institute of Technology",
  degree: "B.Tech in Computer Science & Engineering (2026)",
  overallReadiness: 88,
  readinessDelta: "+14% this month",
  skillsVerified: 8,
  assessmentsCompleted: 5,
  matchedOpportunities: 12,
};

const DEMO_SKILLS = [
  { name: "React & Next.js", level: 5, score: 96, category: "Frontend", status: "Industry Verified", verifiedBy: "AI Assessment & Code Review" },
  { name: "TypeScript", level: 4, score: 89, category: "Frontend", status: "Assessed", verifiedBy: "Adaptive Coding Exam" },
  { name: "Node.js & Express", level: 4, score: 85, category: "Backend", status: "Assessed", verifiedBy: "Backend Challenge v2" },
  { name: "PostgreSQL & Prisma", level: 4, score: 82, category: "Database", status: "Project Verified", verifiedBy: "GitHub Repo Analysis" },
  { name: "Python & FastApi", level: 4, score: 88, category: "Backend", status: "Industry Verified", verifiedBy: "Benchmark Test" },
  { name: "LLM Orchestration (LangChain)", level: 3, score: 74, category: "AI / Data", status: "Assessed", verifiedBy: "AI Skill Sprint" },
  { name: "Docker & CI/CD", level: 3, score: 70, category: "DevOps", status: "Self-Declared", verifiedBy: "Pending Verification" },
  { name: "System Design", level: 3, score: 68, category: "Architecture", status: "Self-Declared", verifiedBy: "Pending Verification" },
];

const DEMO_ASSESSMENTS = [
  {
    title: "Full-Stack Architecture & Security",
    skill: "React + Node.js",
    score: 94,
    grade: "Mastery Level 5",
    date: "Completed 2 days ago",
    breakdown: { "Architecture & Clean Code": 98, "API Design": 92, "Performance": 94, "Security Practices": 91 },
    aiFeedback: "Excellent understanding of asynchronous workflows and state management. Recommended next step: Advanced microservices orchestration.",
  },
  {
    title: "AI Integration & Prompt Engineering",
    skill: "LLM & Vector DBs",
    score: 84,
    grade: "Proficient Level 4",
    date: "Completed 1 week ago",
    breakdown: { "Context Window Optimization": 88, "Embedding Search": 85, "Tool Calling": 80 },
    aiFeedback: "Strong grasp of semantic search and embeddings. Focus on structured JSON output validation.",
  },
];

const DEMO_RECOMMENDED_COURSES = [
  {
    title: "Production System Design & Scalability",
    provider: "VRIDHI Skill Accelerator",
    domain: "Architecture",
    duration: "3 weeks",
    impact: "+18% match for Senior SWE Intern roles",
    modules: 6,
    progress: 45,
    tag: "High ROI",
  },
  {
    title: "Autonomous AI Agents with LangGraph",
    provider: "Industry AI Partner Lab",
    domain: "Generative AI",
    duration: "2 weeks",
    impact: "+22% match for GenAI Engineer roles",
    modules: 4,
    progress: 10,
    tag: "Trending",
  },
  {
    title: "Kubernetes & Cloud-Native Deployments",
    provider: "DevOps Consortium",
    domain: "Cloud & Infrastructure",
    duration: "2.5 weeks",
    impact: "+12% match for Backend Platform roles",
    modules: 5,
    progress: 0,
    tag: "Skill Gap Fix",
  },
];

const DEMO_JOB_MATCHES = [
  {
    role: "Full-Stack AI Engineer Intern",
    company: "Nexus AI Labs",
    location: "Bengaluru (Hybrid)",
    stipend: "₹45,000 / month",
    type: "Internship -> PPO",
    matchScore: 94,
    matchBreakdown: "Matched 5/5 Required Skills, 3/3 Preferred",
    keySkills: ["Next.js", "TypeScript", "Python", "Vector DBs"],
    urgency: "Actively Hiring",
  },
  {
    role: "Software Development Engineer (Frontend)",
    company: "CloudScale Technologies",
    location: "Remote",
    stipend: "₹14 - 18 LPA",
    type: "Full Time",
    matchScore: 91,
    matchBreakdown: "Top 5% candidate among 320 applicants",
    keySkills: ["React", "TypeScript", "TailwindCSS", "GraphQL"],
    urgency: "High Demand",
  },
  {
    role: "Junior Backend Platform Engineer",
    company: "Synthetix Financial",
    location: "Mumbai / Remote",
    stipend: "₹12 - 16 LPA",
    type: "Full Time",
    matchScore: 83,
    matchBreakdown: "Skill gap identified: Kubernetes (+12% match with course)",
    keySkills: ["Node.js", "PostgreSQL", "Docker", "FastAPI"],
    urgency: "Direct Interview Fast-Track",
  },
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("all");

  const filteredSkills =
    selectedSkillFilter === "all"
      ? DEMO_SKILLS
      : DEMO_SKILLS.filter((s) => s.category.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[var(--ng-primary)]/20">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#123B6D] flex items-center justify-center border border-[#D9E1EA]">
                <span className="text-amber-300 font-serif font-black text-xs">V</span>
              </div>
              <span className="font-extrabold tracking-tight text-lg text-[#123B6D]">VRIDHI</span>
              <Badge variant="outline" className="bg-[#1E5AA8]/10 text-[#1E5AA8] border-[#1E5AA8]/30 font-semibold text-xs">
                Interactive Demo
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/get-started">
              <Button size="sm" className="bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-semibold shadow-sm hover:shadow transition-all">
                Create Learner Profile
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Demo Intro */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[var(--ng-primary)]/10 via-[var(--ng-secondary)]/10 to-transparent border border-border/70 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--ng-primary)] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Live Student Intelligence Dashboard (Demo)
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {DEMO_STUDENT.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {DEMO_STUDENT.role} • {DEMO_STUDENT.degree} • {DEMO_STUDENT.institution}
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/80 shadow-xs">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Placement Readiness</div>
                <div className="text-3xl font-extrabold text-[var(--ng-primary)] flex items-baseline gap-1.5">
                  {DEMO_STUDENT.overallReadiness}%
                  <span className="text-xs font-semibold text-emerald-500 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {DEMO_STUDENT.readinessDelta}
                  </span>
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-xs font-medium text-muted-foreground">Verified Skills</div>
                <div className="text-2xl font-bold text-foreground">
                  {DEMO_STUDENT.skillsVerified} <span className="text-xs text-muted-foreground font-normal">/ 8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Navigation Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2 overflow-x-auto">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="overview" className="gap-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                Dashboard Overview
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2 text-sm">
                <BrainCircuit className="w-4 h-4" />
                Skills & Verification
              </TabsTrigger>
              <TabsTrigger value="assessments" className="gap-2 text-sm">
                <Award className="w-4 h-4" />
                AI Assessments
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2 text-sm">
                <Briefcase className="w-4 h-4" />
                Job & Internship Matches
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2 text-sm">
                <BookOpen className="w-4 h-4" />
                Upskilling Paths
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placement Readiness Breakdown */}
              <Card className="md:col-span-2 border-border/80">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Target className="w-5 h-5 text-[var(--ng-primary)]" />
                        Skills Readiness Analysis
                      </CardTitle>
                      <CardDescription>
                        AI comparison between current verified skills and real-time market hiring criteria.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 font-medium">
                      Top 10% Industry Tier
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Frontend & UI Engineering (React/Next.js/TS)</span>
                      <span className="text-emerald-500 font-bold">96% Mastery</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Backend API & Database Architecture</span>
                      <span className="text-[var(--ng-primary)] font-bold">86% Proficient</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>AI / LLM Integration & Prompt Pipelines</span>
                      <span className="text-amber-500 font-bold">76% Intermediate</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>DevOps & Cloud Deployment</span>
                      <span className="text-muted-foreground font-bold">68% Developing (Target Area)</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Evaluated by NextGig Neural Skill Engine</span>
                    <button
                      onClick={() => setActiveTab("skills")}
                      className="text-[var(--ng-primary)] hover:underline font-medium inline-flex items-center"
                    >
                      View all 8 skills <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions & AI Summary */}
              <Card className="border-border/80 flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    AI Career Next Steps
                  </CardTitle>
                  <CardDescription>Targeted actions to reach 95%+ readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1.5">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Take Cloud Deployment Assessment
                    </div>
                    <p className="text-muted-foreground">
                      Verify Docker & CI/CD to unlock 4 additional high-paying backend roles.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1.5">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Apply to Nexus AI Labs
                    </div>
                    <p className="text-muted-foreground">
                      94% match profile. Fast-track technical round available.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link href="/get-started" className="w-full">
                      <Button className="w-full bg-[var(--ng-primary)] text-primary-foreground font-medium text-xs h-9">
                        Unlock Live Platform With Your CV
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Matches Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Top Matched Opportunities</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("jobs")} className="text-xs">
                  See all matches <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_JOB_MATCHES.map((job, idx) => (
                  <Card key={idx} className="border-border/80 hover:border-[var(--ng-primary)]/50 transition-all">
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Badge variant="secondary" className="text-[10px] font-semibold uppercase mb-1">
                            {job.type}
                          </Badge>
                          <h3 className="font-semibold text-base leading-snug">{job.role}</h3>
                          <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-emerald-500">{job.matchScore}%</span>
                          <span className="block text-[10px] text-muted-foreground">Match</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {job.keySkills.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{job.stipend}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">{job.urgency}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: SKILLS */}
          <TabsContent value="skills" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold">Verified Skill Passport</h2>
                <p className="text-sm text-muted-foreground">
                  Skills validated through automated testing, GitHub repos, and AI-proctored evaluations.
                </p>
              </div>
              <div className="flex gap-2">
                {["all", "Frontend", "Backend", "AI", "DevOps"].map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedSkillFilter === cat ? "default" : "outline"}
                    size="xs"
                    onClick={() => setSelectedSkillFilter(cat)}
                    className="capitalize text-xs"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSkills.map((skill, i) => (
                <Card key={i} className="border-border/80">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base">{skill.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              skill.status.includes("Industry")
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]"
                                : "bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] border-[var(--ng-primary)]/30 text-[10px]"
                            }
                          >
                            {skill.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{skill.verifiedBy}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[var(--ng-primary)]">Level {skill.level}/5</div>
                        <div className="text-[11px] text-muted-foreground">{skill.score}% Score</div>
                      </div>
                    </div>

                    <Progress value={skill.score} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: ASSESSMENTS */}
          <TabsContent value="assessments" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">AI Assessment Transcripts</h2>
              <p className="text-sm text-muted-foreground">
                In-depth breakdown of code quality, problem solving, and architecture assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {DEMO_ASSESSMENTS.map((assessment, i) => (
                <Card key={i} className="border-border/80">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <Badge className="bg-[var(--ng-primary)] text-primary-foreground text-xs mb-1.5">
                          {assessment.grade}
                        </Badge>
                        <CardTitle className="text-lg font-bold">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.skill} • {assessment.date}</CardDescription>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-3xl font-extrabold text-[var(--ng-primary)]">{assessment.score}</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/40 p-3 rounded-lg border border-border/60">
                      {Object.entries(assessment.breakdown).map(([criterion, score]) => (
                        <div key={criterion} className="space-y-1">
                          <span className="text-[11px] text-muted-foreground block line-clamp-1">{criterion}</span>
                          <span className="text-sm font-bold text-foreground">{score}%</span>
                          <Progress value={score} className="h-1" />
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-[var(--ng-primary)]/5 rounded-lg border border-[var(--ng-primary)]/20 text-xs text-foreground flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[var(--ng-primary)] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[var(--ng-primary)]">AI Evaluator Feedback: </span>
                        {assessment.aiFeedback}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: JOB MATCHES */}
          <TabsContent value="jobs" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Employer Opportunity Matches</h2>
              <p className="text-sm text-muted-foreground">
                Matches are generated by analyzing verified skill vectors directly against recruiter hiring criteria.
              </p>
            </div>

            <div className="space-y-4">
              {DEMO_JOB_MATCHES.map((job, idx) => (
                <Card key={idx} className="border-border/80">
                  <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">{job.type}</Badge>
                        <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                          {job.urgency}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{job.role}</h3>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location} • {job.stipend}</p>

                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ {job.matchBreakdown}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.keySkills.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 shrink-0">
                      <div className="md:text-right">
                        <div className="text-3xl font-black text-emerald-500">{job.matchScore}%</div>
                        <div className="text-xs text-muted-foreground">Compatibility Index</div>
                      </div>
                      <Link href="/get-started">
                        <Button className="bg-[var(--ng-primary)] text-primary-foreground font-semibold text-xs h-9">
                          Apply with Skill Passport
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 5: COURSES & LEARNING */}
          <TabsContent value="courses" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Personalized Upskilling & Gap Closure</h2>
              <p className="text-sm text-muted-foreground">
                Targeted short courses recommended specifically to elevate your job match percentage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_RECOMMENDED_COURSES.map((course, i) => (
                <Card key={i} className="border-border/80 flex flex-col justify-between">
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="text-xs">{course.domain}</Badge>
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">
                        {course.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold leading-tight">{course.title}</CardTitle>
                    <CardDescription>{course.provider} • {course.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      {course.impact}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress ({course.modules} modules)</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>

                    <Button variant="outline" className="w-full text-xs font-semibold h-9">
                      {course.progress > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Demo Bottom Callout */}
        <div className="mt-12 p-8 rounded-2xl bg-card border border-border text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#123B6D]">Ready to assess and verify your skills on VRIDHI?</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Where Skills Grow. Opportunities Multiply. Get your instant AI skill gap analysis, verified credential passport, and direct connection with national career opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/get-started">
              <Button size="lg" className="bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-semibold px-8 h-11">
                Get Started with VRIDHI
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-8 h-11">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
