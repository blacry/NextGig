"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkillMeter } from "@/components/skill-meter";
import type { AssessmentResult, SkillLevel } from "@/lib/types";

// ── Step 5: Grade & Results ──────────────────────────────────────────

export default function GradePage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-result");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { router.push("/onboarding/upload"); }
    } else {
      router.push("/onboarding/upload");
    }
  }, [router]);

  const handleGoToDashboard = () => {
    // Store result and profile in localStorage for the dashboard
    const profile = sessionStorage.getItem("nextgig-onboarding-parsed");
    if (profile) {
      const parsed = JSON.parse(profile);
      const slug = (parsed.name || "student").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      // Update skills with assessed levels
      if (result) {
        const assessedSkills = parsed.skills.map((skill: { id: string; name: string; domain: string; level: number }) => {
          const grade = result.skillGrades.find((g) => g.skillId === skill.id);
          return {
            ...skill,
            level: grade ? grade.assessedLevel : skill.level,
            verification: "assessed",
          };
        });
        parsed.skills = assessedSkills;
      }

      parsed.slug = slug;
      parsed.id = `student-${slug}`;
      localStorage.setItem(`nextgig-student-${slug}-profile`, JSON.stringify(parsed));
      localStorage.setItem(`nextgig-student-${slug}-onboarding`, JSON.stringify({ step: 5, completed: true }));
      localStorage.setItem("nextgig-auth", JSON.stringify({
        role: "student",
        userName: parsed.name,
        userSlug: slug,
        userId: parsed.id,
      }));
    }

    // Clean up session storage
    sessionStorage.removeItem("nextgig-onboarding-resume");
    sessionStorage.removeItem("nextgig-onboarding-parsed");
    sessionStorage.removeItem("nextgig-onboarding-questions");
    sessionStorage.removeItem("nextgig-onboarding-result");

    const profile2 = JSON.parse(sessionStorage.getItem("nextgig-onboarding-parsed") || localStorage.getItem(`nextgig-student-${(JSON.parse(localStorage.getItem("nextgig-auth") || "{}")).userSlug}-profile`) || "{}");
    const slug2 = (JSON.parse(localStorage.getItem("nextgig-auth") || "{}")).userSlug || "student";
    router.push(`/student/${slug2}/dashboard`);
  };

  if (!result) return null;

  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "var(--ng-success)";
    if (grade.startsWith("B")) return "var(--ng-primary)";
    if (grade.startsWith("C")) return "var(--ng-warning)";
    return "var(--ng-critical)";
  };

  return (
    <div>
      {/* Step indicator - all complete */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-[var(--ng-primary)] text-white">✓</div>
            {step < 5 && <div className="w-8 h-px bg-[var(--ng-primary)]" />}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">Your Assessment Results</h2>
        <p className="text-muted-foreground mb-6">
          Here&apos;s how you performed. Your skill levels have been updated based on this assessment.
        </p>

        {/* Overall score */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-4" style={{ borderColor: gradeColor(result.overallGrade) }}>
                <span className="text-3xl font-bold" style={{ color: gradeColor(result.overallGrade) }}>
                  {result.overallGrade}
                </span>
              </div>
              <p className="text-lg font-semibold mb-1">Overall Score: {result.overallScore}/100</p>
              <Progress value={result.overallScore} className="max-w-xs mx-auto h-2 mt-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Skill grades */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Skill Assessment</h3>
            <div className="space-y-4">
              {result.skillGrades.map((grade, i) => (
                <motion.div
                  key={grade.skillId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{grade.skillName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={grade.assessedLevel >= grade.claimedLevel ? "default" : "destructive"} className="text-[10px] h-auto min-h-0 min-w-0 py-0 px-1.5">
                        {grade.assessedLevel >= grade.claimedLevel ? "Verified" : `Adjusted ${grade.claimedLevel} → ${grade.assessedLevel}`}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{grade.score}/100</span>
                    </div>
                  </div>
                  <SkillMeter
                    skillName=""
                    currentLevel={grade.assessedLevel as SkillLevel}
                    targetLevel={grade.claimedLevel as SkillLevel}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">{grade.feedback}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <Card className="mb-6 ai-surface">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">AI Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ng-primary)" stroke="none" className="mt-0.5 shrink-0"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" /></svg>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CV Tips */}
        {result.cvTips && result.cvTips.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">CV Improvement Tips</h3>
              <ul className="space-y-2">
                {result.cvTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[var(--ng-warning)] shrink-0">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleGoToDashboard} size="lg" className="w-full">
          Go to My Dashboard →
        </Button>
      </motion.div>
    </div>
  );
}
