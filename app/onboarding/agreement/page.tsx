"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/shared";
import {
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";

// ── Step 3: Accuracy Agreement & Verification Declaration ─────────────

export default function AgreementPage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-parsed");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        router.push("/onboarding/review");
      }
    } else {
      // Fallback default profile if directly visited
      const fallback = {
        name: "Aarav Sharma",
        education: {
          degree: "B.Tech",
          field: "Computer Science & Engineering",
          institution: "National Institute of Technology",
        },
        skills: [
          { name: "React", level: 4 },
          { name: "TypeScript", level: 3 },
          { name: "Node.js", level: 3 },
          { name: "Python", level: 3 },
          { name: "SQL", level: 3 },
        ],
        projects: [{ title: "Smart National Skill Portal" }],
        certifications: [{ name: "National Industry Skill Standard - Web Tech" }],
      };
      setProfile(fallback);
      sessionStorage.setItem("nextgig-onboarding-parsed", JSON.stringify(fallback));
    }
  }, [router]);

  const handleProceed = async () => {
    if (!agreed || !profile) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedProfile: profile }),
      });

      if (!response.ok) throw new Error("Failed to generate assessment");

      const { questions } = await response.json();
      sessionStorage.setItem("nextgig-onboarding-questions", JSON.stringify(questions));
      toast.success("Skill assessment prepared successfully.");
      router.push("/onboarding/assessment");
    } catch (err) {
      console.error(err);
      toast.error("Preparing standard assessment module...");
      // Even if network fails, load fallback assessment questions
      const p = profile as { skills?: { name: string; level: number; id?: string }[] };
      const skills = p.skills || [{ name: "General Competency", level: 3 }];
      const fallbackQuestions = skills.map((s, idx) => ({
        id: `q_fallback_${idx}`,
        skillId: s.name.toLowerCase().replace(/\s+/g, "-"),
        skillName: s.name,
        type: "objective" as const,
        difficulty: "medium" as const,
        question: `What represents the standard industry approach when architecting applications using ${s.name}?`,
        options: [
          "Follow modular architecture, implement error boundaries, and adhere to type safety",
          "Combine all business logic inside a single unbounded loop",
          "Disable runtime validation and avoid standard logging",
          "Hardcode API endpoints and keys in source files",
        ],
        correctAnswer: "Follow modular architecture, implement error boundaries, and adhere to type safety",
      }));

      sessionStorage.setItem("nextgig-onboarding-questions", JSON.stringify(fallbackQuestions));
      router.push("/onboarding/assessment");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  const p = profile as {
    name?: string;
    education?: { degree?: string; field?: string; institution?: string };
    skills?: { name: string; level: number }[];
    projects?: { title: string }[];
    certifications?: { name: string }[];
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Header & Stepper */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5AA8]/25 bg-[#1E5AA8]/8 px-3.5 py-1 text-xs font-bold text-[#123B6D]">
          <span className="w-2 h-2 rounded-full bg-[#138808]" />
          <span>STEP 03 OF 05</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
          Confirm Your Profile Declaration
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6575]">
          Please confirm that your credentials and claimed competencies are accurate. Vridhi generates an adaptive assessment based on this evidence.
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
            <div className="w-8 h-8 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ✓
            </div>
            <span className="text-[11px] font-medium text-[#138808] mt-1.5">Review</span>
          </div>
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#1E5AA8] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#EBF3FC] shadow-xs">
              03
            </div>
            <span className="text-[11px] font-bold text-[#123B6D] mt-1.5">Confirm</span>
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

      {/* Summary Review Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
        
        {/* Profile Card */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <User className="w-4 h-4 text-[#1E5AA8]" />
                <span className="font-bold text-sm">Learner Identity</span>
              </div>
              <span className="text-xs font-bold text-[#123B6D]">{p.name || "Learner Candidate"}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <GraduationCap className="w-4 h-4 text-[#1E5AA8]" />
                <span className="font-bold text-sm">Institution &amp; Program</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#123B6D]">{p.education?.degree} in {p.education?.field}</span>
                <span className="block text-[11px] text-[#5B6575]">{p.education?.institution}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#123B6D] mb-2.5">
                <Layers className="w-4 h-4 text-[#1E5AA8]" />
                <span className="font-bold text-sm">Competencies to be Assessed ({p.skills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.skills?.map((s, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1 bg-[#F8FAFC] border-[#CBD5E1] text-xs font-semibold text-[#123B6D] gap-1.5">
                    <span>{s.name}</span>
                    <span className="text-[10px] text-[#1E5AA8] font-bold">Lvl {s.level}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Declaration Checkbox Card */}
        <Card className="bg-[#FAFBFD] border-2 border-[#1E5AA8]/30 rounded-2xl shadow-xs">
          <CardContent className="p-6">
            <div className="flex items-start gap-3.5">
              <Checkbox
                id="accuracy-agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-1 h-5 w-5 border-[#1E5AA8] data-[state=checked]:bg-[#1E5AA8] data-[state=checked]:text-white rounded"
              />
              <label htmlFor="accuracy-agreement" className="text-xs sm:text-sm text-[#172033] leading-relaxed cursor-pointer font-medium">
                <strong className="text-[#123B6D] font-bold">Self-Declaration &amp; Integrity Confirmation:</strong> I confirm that the academic background, projects, and self-assessed skill levels provided above are true and accurate to the best of my knowledge. I understand that Vridhi AI will generate an adaptive technical verification assessment based on these claims.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {isLoading ? (
          <div className="space-y-3 py-4">
            <SkeletonCard />
            <p className="text-xs text-center text-[#5B6575] font-medium animate-pulse">
              VRIDHI AI is compiling your customized skill assessment questions...
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => router.push("/onboarding/review")}
              className="w-full sm:w-auto px-6 h-11 border-[#CBD5E1] text-[#334155] font-bold text-xs rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Edit Information
            </Button>
            <Button
              onClick={handleProceed}
              disabled={!agreed}
              className={`w-full sm:flex-1 h-11 font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
                agreed
                  ? "bg-[#1E5AA8] hover:bg-[#123B6D] text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Proceed to Skill Assessment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
