"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  Users,
  Briefcase,
  CheckCircle2,
  Award,
  BookOpen,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Download,
  Mail,
  Globe,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { InstitutionDetails } from "@/lib/types";

// Mock Student Cohort Data
const INITIAL_STUDENTS = [
  {
    id: "st-101",
    name: "Aarav Sharma",
    email: "aarav.s@iitb.ac.in",
    degree: "B.Tech Computer Science",
    year: 2025,
    gpa: 8.9,
    verifiedSkillsCount: 6,
    topSkill: "Full-Stack Dev (Next.js/Node)",
    verificationStatus: "Verified",
    projectTitle: "Distributed Autonomous Mesh System",
  },
  {
    id: "st-102",
    name: "Ananya Patel",
    email: "ananya.p@iitb.ac.in",
    degree: "B.Tech Electrical Engg",
    year: 2025,
    gpa: 9.1,
    verifiedSkillsCount: 5,
    topSkill: "Machine Learning (PyTorch)",
    verificationStatus: "Verified",
    projectTitle: "Neural Edge Signal Processing",
  },
  {
    id: "st-103",
    name: "Rohan Verma",
    email: "rohan.v@iitb.ac.in",
    degree: "M.Tech Data Science",
    year: 2025,
    gpa: 8.6,
    verifiedSkillsCount: 4,
    topSkill: "Data Pipelines & BigQuery",
    verificationStatus: "Pending Faculty Sign-off",
    projectTitle: "Real-time Stream Analytics Engine",
  },
  {
    id: "st-104",
    name: "Priya Nair",
    email: "priya.n@iitb.ac.in",
    degree: "B.Tech Mechanical Engg",
    year: 2026,
    gpa: 8.4,
    verifiedSkillsCount: 3,
    topSkill: "Embedded C & Robotics",
    verificationStatus: "Verified",
    projectTitle: "Autonomous Quadcopter Flight Controller",
  },
  {
    id: "st-105",
    name: "Vikram Malhotra",
    email: "vikram.m@iitb.ac.in",
    degree: "B.Tech Computer Science",
    year: 2025,
    gpa: 9.4,
    verifiedSkillsCount: 8,
    topSkill: "Systems & Rust Architecture",
    verificationStatus: "Verified",
    projectTitle: "High-Throughput Key-Value Database",
  },
];

// Mock Faculty Roster
const FACULTY_MEMBERS = [
  {
    name: "Dr. K. S. Raman",
    department: "Computer Science & Engg",
    designation: "Professor & HOD",
    verifiedCount: 42,
    email: "ks.raman@iitb.ac.in",
  },
  {
    name: "Dr. Meera Sengupta",
    department: "Electrical Engineering",
    designation: "Associate Professor",
    verifiedCount: 28,
    email: "meera.sg@iitb.ac.in",
  },
  {
    name: "Prof. Rajesh Kumar",
    department: "Data Science & AI School",
    designation: "Assistant Professor",
    verifiedCount: 19,
    email: "rajesh.k@iitb.ac.in",
  },
];

// Mock Placement Drives
const PLACEMENT_DRIVES = [
  {
    company: "Google Cloud",
    role: "Software Development Engineer - I",
    eligibility: "B.Tech / M.Tech CSE & ECE (CGPA >= 8.0)",
    compensation: "₹ 34 - 42 LPA",
    deadline: "Sept 30, 2026",
    applicants: 124,
    status: "Active Drive",
  },
  {
    company: "Microsoft Research",
    role: "Applied AI / ML Engineer",
    eligibility: "All Tech Graduating Students",
    compensation: "₹ 38 LPA",
    deadline: "Oct 05, 2026",
    applicants: 98,
    status: "Active Drive",
  },
  {
    company: "Zomato Tech",
    role: "Backend Platform Engineer",
    eligibility: "B.Tech Final Year",
    compensation: "₹ 24 - 28 LPA",
    deadline: "Oct 12, 2026",
    applicants: 156,
    status: "Upcoming",
  },
];

export default function InstitutionDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "demo";
  const activeTabParam = searchParams.get("tab") || "students";

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [details, setDetails] = useState<InstitutionDetails | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS);

  // Sync tab with URL
  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  // Load Institution Details
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`nextgig-institution-${slug}-details`) || localStorage.getItem(`nextgig-institution-active`);
      if (stored) {
        try {
          setDetails(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, [slug]);

  const instName = details?.name || "Indian Institute of Technology, Bombay";
  const instCode = details?.code || "IITB";
  const instType = details?.type || "Institute of National Importance";
  const instCity = details?.city ? `${details.city}, ${details.state || ""}` : "Mumbai, Maharashtra";
  const instEmail = details?.officialEmail || "placements@iitb.ac.in";
  const adminName = details?.adminName || "Dr. Placement Officer";
  const cohortSize = details?.cohortSize || "1,000 - 3,000 Students";

  const filteredStudents = studentsList.filter(
    (st) =>
      st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.degree.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.topSkill.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleVerifyStudent = (studentId: string, studentName: string) => {
    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, verificationStatus: "Verified" } : s
      )
    );
    toast.success(`Verified skill portfolio for ${studentName}`);
  };

  return (
    <div className="space-y-8">
      {/* ── Top Institution Header Banner ───────────────────────────────── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 md:p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[var(--ng-primary)]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{instName}</h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1 text-xs px-2.5 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Campus Portal</span>
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  {instType} ({instCode})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {instCity}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  {instEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Exporting campus skill audit report (PDF)...")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Skill Audit</span>
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success("Invitation link sent to academic faculty roster!")}
              className="bg-[var(--ng-primary)] text-white hover:bg-[var(--ng-primary)]/90 text-xs gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Faculty</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/60 shadow-sm hover:border-[var(--ng-primary)]/40 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Registered Cohort</p>
              <p className="text-2xl font-bold tracking-tight">1,420</p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> 94% Onboarded
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm hover:border-[var(--ng-primary)]/40 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Verified Skill Badges</p>
              <p className="text-2xl font-bold tracking-tight">3,890</p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Project Verified
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm hover:border-[var(--ng-primary)]/40 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Active Placement Drives</p>
              <p className="text-2xl font-bold tracking-tight">28</p>
              <p className="text-[11px] text-muted-foreground">Top Tech Recruiters</p>
            </div>
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm hover:border-[var(--ng-primary)]/40 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Avg Industry Skill Match</p>
              <p className="text-2xl font-bold tracking-tight">84.5%</p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                +4.2% vs last term
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Tab Navigation Bar ──────────────────────────────────────── */}
      <div className="border-b border-border flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { id: "students", label: "Student Roster & Verifications", icon: Users },
          { id: "faculty", label: "Faculty & Academicians", icon: GraduationCap },
          { id: "drives", label: "Campus Placement Drives", icon: Briefcase },
          { id: "analytics", label: "Department Skill Analytics", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-xs rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? "border-[var(--ng-primary)] text-[var(--ng-primary)] bg-[var(--ng-primary)]/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Student Roster ────────────────────────────────────────── */}
      {activeTab === "students" && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Student Verification & Skill Roster</CardTitle>
                <CardDescription className="text-xs">
                  Review student skill passports, verified academic projects, and graduation readiness
                </CardDescription>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search by student, skill, branch..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Degree & Branch</th>
                  <th className="py-3 px-4">Top Skill Domain</th>
                  <th className="py-3 px-4">Verified Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] font-bold flex items-center justify-center text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-xs">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-foreground">{student.degree}</p>
                      <p className="text-[11px] text-muted-foreground">Class of {student.year} · CGPA {student.gpa}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[11px] font-normal border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
                        {student.topSkill}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">
                      {student.projectTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      {student.verificationStatus === "Verified" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {student.verificationStatus !== "Verified" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyStudent(student.id, student.name)}
                          className="h-8 text-xs px-2.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50"
                        >
                          Verify Skills
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.info(`Viewing skill passport for ${student.name}`)}
                          className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground"
                        >
                          View Passport
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: Faculty Roster ────────────────────────────────────────── */}
      {activeTab === "faculty" && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Faculty & Academic Evaluators</CardTitle>
                <CardDescription className="text-xs">
                  Professors authorized to sign off on student projects and skill verifications
                </CardDescription>
              </div>
              <Button size="sm" className="bg-[var(--ng-primary)] text-white text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Faculty Member</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FACULTY_MEMBERS.map((fac, idx) => (
                <Card key={idx} className="border border-border/60 p-4 space-y-3 hover:border-[var(--ng-primary)]/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{fac.name}</h4>
                      <p className="text-xs text-[var(--ng-primary)] font-medium">{fac.designation}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{fac.department}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {fac.verifiedCount} Verifications
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{fac.email}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 3: Placement Drives ──────────────────────────────────────── */}
      {activeTab === "drives" && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Campus Placement & Internship Drives</CardTitle>
                <CardDescription className="text-xs">
                  Active recruitment opportunities hosted exclusively or open to your campus students
                </CardDescription>
              </div>
              <Button size="sm" className="bg-[var(--ng-primary)] text-white text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Request Custom Drive</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {PLACEMENT_DRIVES.map((drive, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border/60 hover:border-[var(--ng-primary)]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{drive.company}</span>
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] px-2">
                        {drive.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-[var(--ng-primary)]">{drive.role}</p>
                    <p className="text-xs text-muted-foreground">
                      Eligibility: {drive.eligibility} · CTC: <span className="font-medium text-emerald-600 dark:text-emerald-400">{drive.compensation}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="font-bold text-foreground">{drive.applicants} Applicants</p>
                      <p className="text-[11px] text-muted-foreground">Deadline: {drive.deadline}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Shortlist
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 4: Skill Analytics ───────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Campus Skill Distribution & Industry Benchmark</CardTitle>
            <CardDescription className="text-xs">
              Aggregate technical capabilities across departments compared to recruiter market demand
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top Technical Domains
                </h4>

                {[
                  { domain: "Full-Stack Web (React, Node, Next.js)", count: 412, pct: 88 },
                  { domain: "AI & Machine Learning (PyTorch, LLMs)", count: 320, pct: 76 },
                  { domain: "Cloud Architecture & DevOps (GCP, K8s)", count: 245, pct: 64 },
                  { domain: "Data Engineering & Pipelines (SQL, Spark)", count: 198, pct: 58 },
                  { domain: "Systems Programming (C++, Rust)", count: 140, pct: 45 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>{item.domain}</span>
                      <span className="text-muted-foreground">{item.count} students ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-[var(--ng-primary)] rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-accent/40 border border-border/60 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Recruiter Skill Demand Insights</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Companies hiring from your campus are prioritizing <strong>Verified Autonomous AI Agents</strong> and <strong>Distributed Cloud Systems</strong> skills. Your CSE & Data Science students demonstrate a 15% higher verification score than peer institutions in your region.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Updated live from NextGig Industry Index</span>
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--ng-primary)] p-0 h-auto font-medium">
                    Download Full Benchmarking Report →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
