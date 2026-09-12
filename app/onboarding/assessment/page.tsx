"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/shared";
import type { AssessmentQuestion, AssessmentAnswer } from "@/lib/types";

// ── Step 4: AI-Generated Skill Assessment ────────────────────────────

export default function AssessmentPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("nextgig-onboarding-questions");
    if (stored) {
      try { setQuestions(JSON.parse(stored)); } catch { router.push("/onboarding/upload"); }
    } else {
      router.push("/onboarding/upload");
    }
  }, [router]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const profile = JSON.parse(sessionStorage.getItem("nextgig-onboarding-parsed") || "{}");
      const answerArray: AssessmentAnswer[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || "",
      }));

      const response = await fetch("/api/evaluate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers: answerArray, parsedProfile: profile }),
      });

      if (!response.ok) throw new Error("Failed to evaluate");

      const result = await response.json();
      sessionStorage.setItem("nextgig-onboarding-result", JSON.stringify(result));
      router.push("/onboarding/grade");
    } catch {
      toast.error("Failed to evaluate your assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) return <SkeletonCard />;

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step <= 4 ? "bg-[var(--ng-primary)] text-white" : "bg-muted text-muted-foreground"
            }`}>{step < 4 ? "✓" : step}</div>
            {step < 5 && <div className={`w-8 h-px ${step < 4 ? "bg-[var(--ng-primary)]" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Skill Assessment</h2>
          <Badge variant="outline" className="h-auto min-h-0 min-w-0">{currentIndex + 1} / {questions.length}</Badge>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-[10px] h-auto min-h-0 min-w-0">
                    {currentQuestion.skillName}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] h-auto min-h-0 min-w-0 ${
                      currentQuestion.difficulty === "easy"
                        ? "text-green-600"
                        : currentQuestion.difficulty === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                </div>

                <p className="text-base font-medium mb-6 leading-relaxed">{currentQuestion.question}</p>

                {currentQuestion.type === "objective" && currentQuestion.options ? (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
                    }
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, i) => (
                        <motion.div
                          key={i}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                            answers[currentQuestion.id] === option
                              ? "border-[var(--ng-primary)] bg-[var(--ng-primary)]/5"
                              : "border-border hover:border-[var(--ng-primary)]/30"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <RadioGroupItem value={option} id={`option-${i}`} />
                          <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-sm">
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <Textarea
                    placeholder="Write your answer here... (2-4 sentences)"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                    }
                    rows={5}
                    className="text-sm"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex-1"
          >
            ← Previous
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={!answers[currentQuestion.id]?.trim()}
              className="flex-1"
            >
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Evaluating..." : "Submit Assessment"}
            </Button>
          )}
        </div>

        {/* Quick nav dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors min-h-0 min-w-0 ${
                i === currentIndex
                  ? "bg-[var(--ng-primary)]"
                  : answers[q.id]?.trim()
                  ? "bg-[var(--ng-success)]"
                  : "bg-muted"
              }`}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
