"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  X,
  Info,
  FolderOpen,
  Link2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/shared";

// ── Vridhi Learner Onboarding: Step 1 Resume Upload ────────────────────

export default function UploadPage() {
  const [resumeText, setResumeText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      setSelectedFile({ name: file.name, size: sizeStr });

      if (file.type === "text/plain") {
        const text = await file.text();
        setResumeText(text);
        toast.success("Resume text loaded successfully");
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
          throw new Error(data.error || "Failed to extract PDF text");
        }

        setResumeText(data.text);
        toast.success("PDF resume extracted successfully");
        return;
      }

      toast.error("Please upload a valid .txt or .pdf file");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not process the uploaded file"
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

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setResumeText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (resumeText.trim().length < 20) {
      toast.error("Please upload your resume file or paste your resume content (at least 20 characters) to proceed.");
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

      sessionStorage.setItem("nextgig-onboarding-resume", resumeText);
      sessionStorage.setItem("nextgig-onboarding-parsed", JSON.stringify(parsedProfile));

      router.push("/onboarding/review");
    } catch (error) {
      toast.error("Could not parse resume. Please verify the content and try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ──────────────────────────────────────────────────────────
          1. ONBOARDING INTRO & HEADER
          ────────────────────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1E5AA8]/25 bg-[#1E5AA8]/8 px-3.5 py-1 text-xs font-bold text-[#123B6D]">
          <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
          <span>VRIDHI LEARNER ONBOARDING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B6D] tracking-tight">
          Build Your Vridhi Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6575] leading-relaxed">
          Complete a few steps to create your skill profile and discover opportunities aligned with your capabilities.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. PROGRESS STEPPER TIMELINE
          ────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#E2E8F0] -z-0" />

          {/* Step 1: Active */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#1E5AA8] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#EBF3FC] shadow-xs">
              01
            </div>
            <span className="text-[11px] font-bold text-[#123B6D] mt-1.5">Profile</span>
          </div>

          {/* Step 2: Upcoming */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              02
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Resume</span>
          </div>

          {/* Step 3: Upcoming */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              03
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Skills</span>
          </div>

          {/* Step 4: Upcoming */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              04
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Preferences</span>
          </div>

          {/* Step 5: Upcoming */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-8 h-8 rounded-full bg-white text-[#94A3B8] border-2 border-[#CBD5E1] flex items-center justify-center font-semibold text-xs">
              05
            </div>
            <span className="text-[11px] font-medium text-[#64748B] mt-1.5">Complete</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          3. MAIN TWO-COLUMN CONTENT & INFORMATION PANELS
          ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1400px] mx-auto">
        {/* Left Column (8 cols): Onboarding Forms & Upload */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Upload Card */}
          <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#123B6D]">Upload Your Resume</h2>
                <p className="text-xs sm:text-sm text-[#5B6575] mt-1">
                  Add your CV and public profile links. Vridhi combines available evidence to build a more complete understanding of your skills and experience.
                </p>
              </div>

              {/* Additional Profile Sources */}
              <div className="p-5 rounded-xl bg-[#FAFBFD] border-2 border-[#E2E8F0] space-y-3.5">
                <div className="flex items-center gap-2 text-[#123B6D]">
                  <Link2 className="w-4 h-4 text-[#1E5AA8]" />
                  <h3 className="font-bold text-xs text-[#123B6D]">Additional Profile Sources</h3>
                </div>
                <p className="text-[11.5px] text-[#5B6575]">Public links can help Vridhi identify projects, contributions and credentials your CV may miss.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <Label htmlFor="github-url" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                      GitHub Profile URL
                    </Label>
                    <Input
                      id="github-url"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/your-username"
                      className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-10 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white placeholder:text-[#64748B] font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin-url" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                      LinkedIn Profile URL
                    </Label>
                    <Input
                      id="linkedin-url"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-10 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white placeholder:text-[#64748B] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Large Professional Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragOver
                    ? "border-[#1E5AA8] bg-[#EBF3FC]"
                    : "border-[#1E5AA8]/50 bg-white hover:border-[#1E5AA8] hover:bg-[#F8FAFC]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 rounded-full bg-[#1E5AA8]/10 text-[#1E5AA8] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Upload className="w-7 h-7 text-[#1E5AA8]" />
                </div>
                <p className="text-sm font-bold text-[#123B6D] mb-0.5">
                  Drag &amp; drop your resume here
                </p>
                <p className="text-xs text-[#5B6575] mb-4 font-medium">
                  Supports .txt and .pdf files (up to 10MB)
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-[#1E5AA8] text-xs font-bold text-[#1E5AA8] hover:bg-[#EBF3FC] shadow-2xs transition-all cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Files</span>
                </button>
              </div>

              {/* Selected File Badge / Status */}
              {selectedFile && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#EBF3FC] border-2 border-[#1E5AA8]/30">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#1E5AA8]" />
                    <div>
                      <div className="text-xs font-bold text-[#123B6D]">{selectedFile.name}</div>
                      <div className="text-[10.5px] text-[#5B6575] font-medium">{selectedFile.size} • Loaded successfully</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="p-1.5 rounded-lg text-[#5B6575] hover:text-[#D95C5C] hover:bg-white transition cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E2E8F0]" />
                <span className="text-xs text-[#5B6575] font-bold">──────── or paste your resume text ────────</span>
                <div className="flex-1 h-px bg-[#E2E8F0]" />
              </div>

              {/* Paste Resume Textarea */}
              <div>
                <Label htmlFor="resume-text" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                  Paste Resume Content
                </Label>
                <Textarea
                  id="resume-text"
                  placeholder="Paste your resume content, experience, and education details here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  className="font-mono text-xs bg-white border-2 border-[#CBD5E1] text-[#123B6D] rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white placeholder:text-[#64748B] font-medium"
                />
              </div>

              {/* AI Parse CTA Button */}
              {isLoading ? (
                <div className="space-y-3 py-2">
                  <SkeletonCard />
                  <p className="text-xs text-center text-[#1E5AA8] font-bold animate-pulse">
                    VRIDHI AI is analyzing your competencies and extracting credentials...
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze My Resume with AI →</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Vridhi Visual, Growth Flow & Trust Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trust & Privacy Card */}
          <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#123B6D]">
                <ShieldCheck className="w-5 h-5 text-[#138808]" />
                <h3 className="font-bold text-sm text-[#123B6D]">Why Vridhi asks for this information</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-[#172033] font-medium border-t border-[#E2E8F0] pt-3.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                  <span>Build your verified digital skill profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                  <span>Identify syllabus and practical skill gaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                  <span>Recommend curated learning pathways</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                  <span>Match you with internships and career opportunities</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#5B6575]">
                <Info className="w-3.5 h-3.5 text-[#1E5AA8] shrink-0" />
                <span>Your information is used strictly to build your Vridhi profile and improve opportunity matching.</span>
              </div>
            </CardContent>
          </Card>

          {/* Vridhi Growth Ecosystem Mini Panel */}
          <Card className="bg-[#FAFBFD] border-2 border-[#D9E1EA] rounded-2xl shadow-xs overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1E5AA8] uppercase tracking-wider">
                  Vridhi Growth Architecture
                </span>
                <span className="w-2 h-2 rounded-full bg-[#138808]" />
              </div>
              <div className="space-y-2 text-xs font-semibold text-[#123B6D]">
                <div className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#1E5AA8]" />
                    Learner Profile
                  </span>
                  <span className="text-[10px] text-[#138808] font-bold bg-[#138808]/10 px-2 py-0.5 rounded-md">Step 1</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1E5AA8]" />
                    AI Skill Verification
                  </span>
                  <span className="text-[10px] text-[#64748B] font-bold">Next</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#1E5AA8]" />
                    Verified Opportunities
                  </span>
                  <span className="text-[10px] text-[#64748B] font-bold">Next</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#5B6575] font-medium">
                <span>Education</span>
                <span>→</span>
                <span>Verification</span>
                <span>→</span>
                <span className="text-[#138808] font-bold">Growth</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
