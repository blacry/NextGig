"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/shared";

// ── Step 3: Accuracy Agreement ───────────────────────────────────────

export default function AgreementPage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-parsed");
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch { router.push("/onboarding/upload"); }
    } else {
      router.push("/onboarding/upload");
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
      router.push("/onboarding/assessment");
    } catch {
      toast.error("Failed to generate your assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  const p = profile as { name?: string; education?: { degree?: string; field?: string; institution?: string }; skills?: { name: string; level: number }[]; projects?: { title: string }[]; certifications?: { name: string }[] };

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step <= 3 ? "bg-ng-primary text-white" : "bg-muted text-muted-foreground"
            }`}>{step < 3 ? "✓" : step}</div>
            {step < 5 && <div className={`w-8 h-px ${step < 3 ? "bg-ng-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-2">Confirm Your Profile</h2>
        <p className="text-muted-foreground mb-6">
          Review your profile summary below. Once you confirm, we&apos;ll generate a personalized skill assessment based on your claimed skills.
        </p>

        {/* Summary cards */}
        <div className="space-y-3 mb-6">
          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Name</p>
            <p className="font-medium">{p.name}</p>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Education</p>
            <p className="font-medium">{p.education?.degree} in {p.education?.field}</p>
            <p className="text-sm text-muted-foreground">{p.education?.institution}</p>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Skills ({p.skills?.length || 0})</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {p.skills?.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                  {s.name} <span className="text-muted-foreground">Lvl {s.level}</span>
                </span>
              ))}
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase mb-1">Projects: {p.projects?.length || 0} · Certifications: {p.certifications?.length || 0}</p>
          </CardContent></Card>
        </div>

        {/* Agreement checkbox */}
        <Card className="mb-6 border-(--ng-warning)/30 bg-(--ng-warning)/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                I confirm that the information provided above is <strong>accurate and not misleading</strong>.
                I understand that my skills will be assessed based on these claims, and inaccurate information
                may result in lower assessment scores.
              </label>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <p className="text-sm text-center text-muted-foreground">
              AI is generating your personalized assessment...
            </p>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/onboarding/review")} className="flex-1">
              ← Edit Profile
            </Button>
            <Button onClick={handleProceed} disabled={!agreed} className="flex-1">
              Proceed to Skill Assessment →
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
