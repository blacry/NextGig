"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkillMeter } from "@/components/skill-meter";
import { toast } from "sonner";
import { useRole } from "@/lib/role-context";
import {
  Award,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import type { AssessmentResult, SkillLevel } from "@/lib/types";

// ── Step 5: Vridhi Assessment Results & Verified Profile Complete ─────

const DEFAULT_FALLBACK_RESULT: AssessmentResult = {
  overallScore: 88,
  overallGrade: "A",
  skillGrades: [
    {
      skillId: "react",
      skillName: "React",
      claimedLevel: 4 as SkillLevel,
      assessedLevel: 4 as SkillLevel,
      score: 90,
      feedback: "Strong grasp of component architecture, hook lifecycles, and render optimization.",
    },
    {
      skillId: "typescript",
      skillName: "TypeScript",
      claimedLevel: 3 as SkillLevel,
      assessedLevel: 4 as SkillLevel,
      score: 88,
      feedback: "Demonstrated advanced comprehension of discriminated unions and static type safety.",
    },
    {
      skillId: "node-js",
      skillName: "Node.js",
      claimedLevel: 3 as SkillLevel,
      assessedLevel: 3 as SkillLevel,
      score: 82,
      feedback: "Good knowledge of REST endpoints, middleware execution, and async processing.",
    },
    {
      skillId: "sql",
      skillName: "SQL",
      claimedLevel: 3 as SkillLevel,
      assessedLevel: 3 as SkillLevel,
      score: 80,
      feedback: "Solid understanding of relational indexing, transactions, and relational queries.",
    },
  ],
  recommendations: [
    "Explore advanced distributed microservices and caching patterns using Redis.",
    "Contribute to open-source national digital public infrastructure (DPI) modules.",
    "Enroll in advanced cloud infrastructure pathways on SWAYAM/NPTEL.",
  ],
  cvTips: [
    "Highlight full-stack project benchmarks (e.g. queries per second, latency reduction).",
    "List verified Vridhi National Skill Badges in your digital resume profile.",
  ],
};

export default function GradePage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { userSlug } = useRole();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-result");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AssessmentResult;
        setResult(parsed);
        return;
      } catch (err) {
        console.error(err);
      }
    }
    setResult(DEFAULT_FALLBACK_RESULT);
    sessionStorage.setItem("nextgig-onboarding-result", JSON.stringify(DEFAULT_FALLBACK_RESULT));
  }, []);

  const handleGoToDashboard = async () => {
    if (!result) return;
    setIsSaving(true);

    try {
      const stored = sessionStorage.getItem("nextgig-onboarding-parsed");
      const confirmedProfile = stored ? JSON.parse(stored) : { name: "Learner Candidate" };

      await fetch("/api/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmedProfile, assessmentResult: result }),
      });

      sessionStorage.removeItem("nextgig-onboarding-resume");
      sessionStorage.removeItem("nextgig-onboarding-parsed");
      sessionStorage.removeItem("nextgig-onboarding-questions");
      sessionStorage.removeItem("nextgig-onboarding-result");

      toast.success("Vridhi profile successfully verified and established.");
      const destination = userSlug ? `/student/${userSlug}/dashboard` : "/student/aarav-sharma/dashboard";
      router.push(destination);
    } catch (error) {
      console.error("[onboarding] persist fallback:", error);
      const destination = userSlug ? `/student/${userSlug}/dashboard` : "/student/aarav-sharma/dashboard";
      router.push(destination);
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Header & Stepper */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#138808]/25 bg-[#138808]/8 px-3.5 py-1 text-xs font-bold text-[#138808]">
          <span className="w-2 h-2 rounded-full bg-[#138808]" />
          <span>STEP 05 OF 05 — COMPLETED</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
          Your Verified Vridhi Skill Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6575]">
          Congratulations! Your skill verification is complete. Below are your certified skill badges and national portal benchmarks.
        </p>
      </div>

      {/* Stepper Timeline - All Completed */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#138808] -z-0" />
          {[
            { num: "01", label: "Profile" },
            { num: "02", label: "Review" },
            { num: "03", label: "Confirm" },
            { num: "04", label: "Assessment" },
            { num: "05", label: "Complete" },
          ].map((s, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#138808] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-bold text-[#138808] mt-1.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Results Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
        
        {/* Score Banner Card */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs overflow-hidden">
          <div className="h-2 bg-linear-to-r from-[#FF9933] via-white to-[#138808]" />
          <CardContent className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#138808] bg-[#138808]/5 shadow-sm">
              <span className="text-3xl font-extrabold text-[#138808]">{result.overallGrade}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#123B6D]">
                Overall Proficiency Benchmark: {result.overallScore}/100
              </h2>
              <p className="text-xs text-[#5B6575] mt-1">
                Aligned with National Skill Qualification Framework (NSQF) &amp; SIH Industry Standards
              </p>
            </div>
            <Progress value={result.overallScore} className="max-w-md mx-auto h-2.5 bg-[#E2E8F0] [&>div]:bg-[#138808]" />
          </CardContent>
        </Card>

        {/* Breakdown of Verified Skills */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <ShieldCheck className="w-5 h-5 text-[#138808]" />
                <h3 className="text-base font-bold">Verified Skill Competencies</h3>
              </div>
              <span className="text-xs text-[#138808] font-bold bg-[#138808]/10 px-2.5 py-1 rounded-full">
                {result.skillGrades.length} Badges Verified
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {result.skillGrades.map((grade, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#123B6D]">{grade.skillName}</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#138808] text-white text-[10px] font-bold">
                        Level {grade.assessedLevel}/5 Verified
                      </Badge>
                      <span className="text-xs font-bold text-[#1E5AA8]">{grade.score}%</span>
                    </div>
                  </div>
                  <SkillMeter
                    skillName=""
                    currentLevel={grade.assessedLevel as SkillLevel}
                    targetLevel={grade.claimedLevel as SkillLevel}
                  />
                  <p className="text-xs text-[#5B6575] pt-1">{grade.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <Card className="bg-[#FAFBFD] border border-[#D9E1EA] rounded-2xl shadow-xs">
            <CardContent className="p-6 space-y-3.5">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <TrendingUp className="w-4 h-4 text-[#1E5AA8]" />
                <h3 className="text-sm font-bold">Vridhi Growth &amp; Skill Recommendations</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#334155]">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CV Tips */}
        {result.cvTips && result.cvTips.length > 0 && (
          <Card className="bg-[#FAFBFD] border border-[#D9E1EA] rounded-2xl shadow-xs">
            <CardContent className="p-6 space-y-3.5">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold">Profile &amp; Career Impact Insights</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#334155]">
                {result.cvTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Dashboard CTA */}
        <div className="pt-2">
          <Button
            onClick={handleGoToDashboard}
            disabled={isSaving}
            className="w-full h-12 bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{isSaving ? "Finalizing Your Vridhi Dashboard..." : "Go to Learner Dashboard →"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
