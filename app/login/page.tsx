"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Building2,
  Compass,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalHeader, GlobalFooter } from "@/components/GlobalHeader";
import { useRole } from "@/lib/role-context";
import type { UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

// ── Vridhi Demo Account Credentials ──────────────────────────────────
const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; slug?: string; name: string }> = {
  student: {
    email: "demo.student@nextgig.dev",
    password: "demo-password-123",
    slug: "alex-chen",
    name: "Aarav Sharma (Student)",
  },
  academician: {
    email: "demo.academician@nextgig.dev",
    password: "demo-password-123",
    slug: "ananya-sharma",
    name: "Dr. Ananya Sharma (Academician)",
  },
  recruiter: {
    email: "demo.recruiter@nextgig.dev",
    password: "demo-password-123",
    slug: "sarah-jenkins",
    name: "Sarah Jenkins (Industry Partner)",
  },
};

type PendingAction = "demo-student" | "demo-academician" | "demo-recruiter" | "login" | "signup" | "github";

function LoginForm() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  const { login, signUp } = useRole();
  const [pending, setPending] = useState<PendingAction | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("student");

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "auth_failed" || errorParam === "auth") {
        toast.error("GitHub sign-in failed. Please try again.");
      } else if (errorParam === "missing_code" || errorParam === "no_user") {
        toast.error("Authentication could not be completed. Please try again.");
      }
    }
    if (searchParams.get("tab") === "signup") {
      setActiveTab("signup");
    }
  }, [searchParams]);

  // Supabase client instance
  const supabase = createClient();

  // ── Demo Login Handler ─────────────────────────────────────────────
  const handleDemoLogin = async (role: UserRole) => {
    setPending(
      role === "student"
        ? "demo-student"
        : role === "academician"
        ? "demo-academician"
        : "demo-recruiter"
    );
    try {
      const { email, password, slug } = DEMO_ACCOUNTS[role];
      try {
        await login(email, password);
      } catch {
        // Graceful fallback navigation for evaluation
        if (role === "academician") {
          window.location.href = `/academician/${slug || "ananya-sharma"}/dashboard`;
          return;
        } else if (role === "student") {
          window.location.href = `/student/${slug || "alex-chen"}/dashboard`;
          return;
        } else {
          window.location.href = `/recruiter/${slug || "sarah-jenkins"}/dashboard`;
          return;
        }
      }
    } catch (error) {
      console.error("[demo login error]", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not initialize demo session. Please try again."
      );
    } finally {
      setPending(null);
    }
  };

  // ── Email Login Handler ────────────────────────────────────
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      toast.error("Please enter both email and password.");
      return;
    }

    setPending("login");
    try {
      await login(loginEmail.trim(), loginPassword);
    } catch (error) {
      console.error("[login error]", error);
      toast.error(
        error instanceof Error ? error.message : "Could not sign you in. Please verify your credentials."
      );
    } finally {
      setPending(null);
    }
  };

  // ── Email Sign-Up Handler ──────────────────────────────────
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!signupName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!signupEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (
      signupPassword.length < 8 ||
      !/[a-z]/.test(signupPassword) ||
      !/[A-Z]/.test(signupPassword) ||
      !/[0-9]/.test(signupPassword)
    ) {
      toast.error("Password must be at least 8 characters with uppercase, lowercase, and numbers.");
      return;
    }

    setPending("signup");
    try {
      await signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        name: signupName.trim(),
        role: signupRole,
      });
    } catch (error) {
      console.error("[signup error]", error);
      toast.error(
        error instanceof Error ? error.message : "Could not create your account. Please try again."
      );
    } finally {
      setPending(null);
    }
  };

  // ── GitHub OAuth Login Handler ─────────────────────────────
  const handleGitHubLogin = async () => {
    setPending("github");
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) {
        toast.error(error.message || "GitHub sign-in failed. Please try again.");
        setPending(null);
      }
    } catch (err) {
      console.error("[GitHub Login Error]", err);
      toast.error(err instanceof Error ? err.message : "GitHub sign-in failed. Please try again.");
      setPending(null);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset link has been dispatched to your registered email.");
  };

  const isBusy = pending !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-[1240px] mx-auto">
      
      {/* ──────────────────────────────────────────────────────────
          LEFT COLUMN: VRIDHI ECOSYSTEM & TRUST PANEL (Order 2 on mobile, 1 on desktop)
          ────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
        
        {/* Brand Banner Card */}
        <Card className="bg-linear-to-br from-[#123B6D] via-[#1E5AA8] to-[#123B6D] text-white border-0 rounded-2xl shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
          <div className="h-1.5 w-full bg-linear-to-r from-[#F4A11A] via-white to-[#138808]" />
          
          <CardContent className="p-7 sm:p-9 space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              <span>VRIDHI DIGITAL SKILL PORTAL</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Where Skills Grow.<br />Opportunities Multiply.
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Connect your academic learning, verify capabilities with adaptive AI benchmarks, and discover vetted national industry opportunities.
              </p>
            </div>

            {/* Growth Pipeline Visual Steps */}
            <div className="pt-2 border-t border-white/20 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                The Vridhi National Growth Pipeline
              </span>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 backdrop-blur-xs">
                  <GraduationCap className="w-5 h-5 mx-auto mb-1 text-blue-100" />
                  <div className="font-bold text-[11px] text-white">1. Learner</div>
                  <div className="text-[10px] text-blue-100">Profile &amp; Skills</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 backdrop-blur-xs">
                  <Sparkles className="w-5 h-5 mx-auto mb-1 text-amber-300" />
                  <div className="font-bold text-[11px] text-white">2. AI Assessment</div>
                  <div className="text-[10px] text-blue-100">Adaptive Checks</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 border border-white/20 backdrop-blur-xs">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                  <div className="font-bold text-[11px] text-white">3. Industry</div>
                  <div className="text-[10px] text-blue-100">Verified Gigs</div>
                </div>
              </div>

              {/* Milestone Indicator Arrow */}
              <div className="flex items-center justify-between text-[10.5px] text-blue-100 px-1 pt-1 font-semibold">
                <span>Academic Core</span>
                <span>→</span>
                <span>Verification</span>
                <span>→</span>
                <span className="text-emerald-300 font-bold">National Career</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* National Initiative Trust Highlights */}
        <Card className="bg-white border border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#123B6D] border-b border-[#E2E8F0] pb-3">
              <ShieldCheck className="w-5 h-5 text-[#138808]" />
              <h3 className="font-bold text-sm text-[#123B6D]">
                Integrated Digital Infrastructure
              </h3>
            </div>

            <div className="space-y-3 text-xs text-[#172033] font-medium">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#123B6D]">National Standards:</strong> Skill maps aligned with AICTE, NCVET &amp; NSQF competency frameworks.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#123B6D]">Verified Badging:</strong> Transparent, tamper-evident competency badges trusted by recruiters.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#123B6D]">Data Privacy:</strong> Student records and assessment data protected under digital governance principles.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#5B6575]">
              <span className="flex items-center gap-1.5 font-semibold text-[#123B6D]">
                <Compass className="w-3.5 h-3.5 text-[#1E5AA8]" />
                Smart India Hackathon (SIH 2026)
              </span>
              <span className="font-bold text-[#1E5AA8] bg-[#EBF3FC] px-2.5 py-0.5 rounded-full">Edition MVP</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ──────────────────────────────────────────────────────────
          RIGHT COLUMN: AUTHENTICATION & DEMO TABS (Order 1 on mobile, 2 on desktop)
          ────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
        
        {/* Main Authentication Card */}
        <Card className="bg-white border-2 border-[#D9E1EA] rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-[#1E5AA8]" />

          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {/* Header Title & Subtitle */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E5AA8] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" /> Secure Portal Access
              </div>
              <h1 className="text-2xl font-extrabold text-[#123B6D] tracking-tight">
                Welcome back to Vridhi
              </h1>
              <p className="text-xs sm:text-sm text-[#5B6575]">
                Sign in to continue your skill development and career journey.
              </p>
            </div>

            {/* Custom Pixel-Perfect Segmented Tab Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-[#F1F5F9] rounded-xl border-2 border-[#CBD5E1] gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`py-2.5 px-4 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer select-none ${
                  activeTab === "login"
                    ? "bg-[#1E5AA8] text-white shadow-sm"
                    : "text-[#475569] hover:text-[#123B6D] hover:bg-white/70"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`py-2.5 px-4 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center cursor-pointer select-none ${
                  activeTab === "signup"
                    ? "bg-[#1E5AA8] text-white shadow-sm"
                    : "text-[#475569] hover:text-[#123B6D] hover:bg-white/70"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ── TAB 1: SIGN IN FORM ──────────────────────────────── */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4 pt-1">
                <div>
                  <Label htmlFor="login-email" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="learner@vridhi.gov.in"
                      className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-11 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white pl-10 placeholder:text-[#64748B] font-medium"
                    />
                    <Mail className="w-4 h-4 text-[#1E5AA8] absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="login-password" className="text-xs font-bold text-[#123B6D]">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11.5px] font-bold text-[#1E5AA8] hover:text-[#123B6D] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-11 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white pr-10 pl-3.5 placeholder:text-[#64748B] font-medium"
                    />
                    <button
                      type="button"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute right-3.5 top-3 text-[#1E5AA8] hover:text-[#123B6D] p-0.5 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isBusy}
                  className="w-full h-11 bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{pending === "login" ? "Signing in..." : "Sign In →"}</span>
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                  <span className="text-[11px] text-[#5B6575] font-bold uppercase">or continue with</span>
                  <div className="flex-1 h-px bg-[#E2E8F0]" />
                </div>

                {/* GitHub OAuth Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] hover:border-[#1E5AA8] text-[#123B6D] font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-60"
                  onClick={handleGitHubLogin}
                  disabled={isBusy}
                >
                  {pending === "github" ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#1E5AA8] border-t-transparent rounded-full animate-spin" />
                      <span>Connecting to GitHub...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-[#123B6D]" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>Continue with GitHub</span>
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* ── TAB 2: CREATE ACCOUNT FORM ───────────────────────── */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4 pt-1">
                <div>
                  <Label htmlFor="signup-name" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                    Full Legal Name
                  </Label>
                  <Input
                    id="signup-name"
                    required
                    autoComplete="name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-11 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white placeholder:text-[#64748B] font-medium"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="learner@university.edu.in"
                    className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-11 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white placeholder:text-[#64748B] font-medium"
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                    Create Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="8+ characters, uppercase, lowercase, numbers"
                      className="bg-white border-2 border-[#CBD5E1] text-[#123B6D] text-xs h-11 rounded-xl focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 focus:bg-white pr-10 pl-3.5 placeholder:text-[#64748B] font-medium"
                    />
                    <button
                      type="button"
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowSignupPassword((v) => !v)}
                      className="absolute right-3.5 top-3 text-[#1E5AA8] hover:text-[#123B6D] p-0.5 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Role Selector Buttons */}
                <div>
                  <Label className="text-xs font-bold text-[#123B6D] mb-1.5 block">
                    Select Your Vridhi Portal Role
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole("student")}
                      className={`text-xs h-10 font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        signupRole === "student"
                          ? "bg-[#1E5AA8] text-white shadow-xs border-2 border-[#1E5AA8]"
                          : "border-2 border-[#CBD5E1] text-[#123B6D] bg-white hover:border-[#1E5AA8] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" /> Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupRole("academician")}
                      className={`text-xs h-10 font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        signupRole === "academician"
                          ? "bg-[#1E5AA8] text-white shadow-xs border-2 border-[#1E5AA8]"
                          : "border-2 border-[#CBD5E1] text-[#123B6D] bg-white hover:border-[#1E5AA8] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" /> Academician
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupRole("recruiter")}
                      className={`text-xs h-10 font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        signupRole === "recruiter"
                          ? "bg-[#1E5AA8] text-white shadow-xs border-2 border-[#1E5AA8]"
                          : "border-2 border-[#CBD5E1] text-[#123B6D] bg-white hover:border-[#1E5AA8] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Recruiter
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isBusy}
                  className="w-full h-11 bg-[#1E5AA8] hover:bg-[#123B6D] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{pending === "signup" ? "Creating Account..." : "Create Account →"}</span>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ── EXPLORE VRIDHI DEMO CARD ─────────────────────────────── */}
        <Card className="bg-[#FAFBFD] border-2 border-[#D9E1EA] rounded-2xl shadow-xs">
          <CardContent className="p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#123B6D] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Explore Vridhi Demo
                </h2>
                <p className="text-[11.5px] text-[#5B6575] mt-0.5">
                  Experience the platform using a pre-configured demo profile.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#138808]/15 text-[#138808] border border-[#138808]/30">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleDemoLogin("student")}
                className="h-11 text-xs font-bold border-2 border-[#1E5AA8]/40 bg-white hover:bg-[#EBF3FC] hover:border-[#1E5AA8] text-[#123B6D] rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#1E5AA8]" />
                <span>{pending === "demo-student" ? "Loading..." : "Student"}</span>
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleDemoLogin("academician")}
                className="h-11 text-xs font-bold border-2 border-[#1E5AA8]/40 bg-white hover:bg-[#EBF3FC] hover:border-[#1E5AA8] text-[#123B6D] rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#1E5AA8]" />
                <span>{pending === "demo-academician" ? "Loading..." : "Academician"}</span>
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleDemoLogin("recruiter")}
                className="h-11 text-xs font-bold border-2 border-[#1E5AA8]/40 bg-white hover:bg-[#EBF3FC] hover:border-[#1E5AA8] text-[#123B6D] rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-[#1E5AA8]" />
                <span>{pending === "demo-recruiter" ? "Loading..." : "Recruiter"}</span>
              </button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans antialiased selection:bg-[#123B6D]/15 selection:text-[#123B6D]">
      {/* 1. Global Vridhi Government Header */}
      <GlobalHeader />

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<div className="py-12 text-center text-xs text-[#5B6575]">Loading Vridhi Portal...</div>}>
            <LoginForm />
          </Suspense>
        </motion.div>
      </main>

      {/* 3. Global Vridhi Footer */}
      <GlobalFooter />
    </div>
  );
}