"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/shared";

// ── Step 1: CV Upload ────────────────────────────────────────────────

export default function UploadPage() {
  const [resumeText, setResumeText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      if (file.type === "text/plain") {
        const text = await file.text();

        setResumeText(text);
        toast.success("File loaded successfully");
        return;
      }

      if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to extract PDF");
        }

        setResumeText(data.text);
        toast.success("PDF text extracted successfully");
        return;
      }

      toast.error("Please upload a .txt or .pdf file");
    } catch (error) {
      console.error("File upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not process the file"
      );
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleSubmit = async () => {
    if (resumeText.trim().length < 20) {
      toast.error("Please provide more resume content for AI parsing.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: resumeText,
          sources: { githubUrl: githubUrl.trim(), linkedinUrl: linkedinUrl.trim() },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse resume");
      }

      const parsedProfile = await response.json();
      parsedProfile.sourceLinks = { githubUrl: githubUrl.trim(), linkedinUrl: linkedinUrl.trim() };

      // Store in sessionStorage for the review page
      sessionStorage.setItem("nextgig-onboarding-resume", resumeText);
      sessionStorage.setItem("nextgig-onboarding-parsed", JSON.stringify(parsedProfile));

      router.push("/onboarding/review");
    } catch (error) {
      toast.error("Failed to parse your CV. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 1
                  ? "bg-ng-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 5 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-muted-foreground mb-6">
          Add your CV and public profile links. NextGig combines the available evidence, then lets you correct the result before anything is saved.
        </p>

        <Card className="mb-4">
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-sm">Additional profile sources</h3>
              <p className="text-xs text-muted-foreground mt-1">Public links help us find projects, contributions, and credentials your CV may miss.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github-url" className="text-xs mb-1.5 block">GitHub profile or repository URL</Label>
                <Input id="github-url" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/you" />
              </div>
              <div>
                <Label htmlFor="linkedin-url" className="text-xs mb-1.5 block">LinkedIn profile URL</Label>
                <Input id="linkedin-url" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/you" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drop zone */}
        <Card
          className={`border-dashed border-2 transition-colors duration-200 mb-4 ${
            dragOver ? "border-ng-primary bg-(--ng-soft)/20" : "border-border"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1">
              Drag & drop your resume here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports .txt and .pdf files
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <span className={buttonVariants({ variant: "outline", size: "sm" })}>
                Browse Files
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Or paste */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or paste your resume text</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Textarea
          placeholder="Paste your resume content here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={12}
          className="mb-6 font-mono text-sm"
        />

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <p className="text-sm text-center text-muted-foreground">
              AI is parsing your resume... This may take a moment.
            </p>
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={resumeText.trim().length < 20}
            className="w-full"
            size="lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-2">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
            Parse My CV with AI
          </Button>
        )}
      </motion.div>
    </div>
  );
}
