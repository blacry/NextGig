"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/lib/role-context";
import type { UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";  

// ── Login / Sign Up ──────────────────────────────────────────────────
// Real Supabase email+password auth. The demo buttons sign in to the two
// seeded demo accounts (see supabase/seeds/seed-demo.mjs) — they are ordinary
// logins, not fabricated sessions.

const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string }> = {
  student: { email: "demo.student@nextgig.dev", password: "demo-password-123" },
  recruiter: { email: "demo.recruiter@nextgig.dev", password: "demo-password-123" },
};

type PendingAction = "demo-student" | "demo-recruiter" | "login" | "signup" | "github";   

export default function LoginPage() {
  const { login, signUp } = useRole();
  const [pending, setPending] = useState<PendingAction | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("student");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // ✅ Supabase client
  const supabase = createClient();

  // ── Demo login ──────────────────────────────────────────────────────
  const handleDemoLogin = async (role: UserRole) => {
    setPending(role === "student" ? "demo-student" : "demo-recruiter");
    try {
      const { email, password } = DEMO_ACCOUNTS[role];
      await login(email, password);
    } catch (error) {
      console.error("[demo login]", error);
      toast.error(
        error instanceof Error && error.message.toLowerCase().includes("invalid login credentials")
          ? "This demo account is not available yet. Seed the demo users in Supabase, then try again."
          : error instanceof Error
            ? error.message
            : "Could not start the demo. Please try again."
      );
    } finally {
      setPending(null);
    }
  };

  // ── Email login ────────────────────────────────────────────────────
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending("login");
    try {
      await login(loginEmail.trim(), loginPassword);
    } catch (error) {
      console.error("[login]", error);
      toast.error(
        error instanceof Error ? error.message : "Could not sign you in. Please try again."
      );
    } finally {
      setPending(null);
    }
  };

  // ── Email sign-up ──────────────────────────────────────────────────
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (signupPassword.length < 8 || !/[a-z]/.test(signupPassword) || !/[A-Z]/.test(signupPassword) || !/[0-9]/.test(signupPassword)) {
      toast.error("Use 8 or more characters with at least one uppercase letter, lowercase letter, and number.");
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
      console.error("[signup]", error);
      toast.error(
        error instanceof Error ? error.message : "Could not create your account. Please try again."
      );
    } finally {
      setPending(null);
    }
  };

  // ── GitHub OAuth login ─────────────────────────────────────────────
  const handleGitHubLogin = async () => {
    setPending("github");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "GitHub login failed");
    } finally {
      setPending(null);
    }
  };

  const isBusy = pending !== null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--ng-primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to NextGig</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Prove your skills. Get matched. Get hired.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-xs mb-1.5 block">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-xs mb-1.5 block">Password</Label>
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowLoginPassword((visible) => !visible)}
                      className="relative float-right -mt-6 mr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <Button type="submit" className="w-full" disabled={isBusy}>
                    {pending === "login" ? "Signing in..." : "Sign In"}
                  </Button>

                  {/* ✅ GitHub OAuth button */}
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 rounded-lg"
                      onClick={handleGitHubLogin}
                      disabled={isBusy}
                    >
                      Continue with GitHub
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="text-xs mb-1.5 block">Full Name</Label>
                    <Input
                      id="signup-name"
                      required
                      autoComplete="name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-xs mb-1.5 block">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-xs mb-1.5 block">Password</Label>
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="8+ chars, upper/lowercase, and a number"
                    />
                    <button
                      type="button"
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowSignupPassword((visible) => !visible)}
                      className="relative float-right -mt-6 mr-3 text-muted-foreground hover:text-foreground"
                    >
                      {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">I am a</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={signupRole === "student" ? "default" : "outline"}
                        onClick={() => setSignupRole("student")}
                        className="w-full"
                      >
                        Student
                      </Button>
                      <Button
                        type="button"
                        variant={signupRole === "recruiter" ? "default" : "outline"}
                        onClick={() => setSignupRole("recruiter")}
                        className="w-full"
                      >
                        Recruiter
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isBusy}>
                    {pending === "signup" ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Or explore a demo account</CardTitle>
            <CardDescription className="text-xs">
              Pre-seeded profiles with real data in Postgres.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleDemoLogin("student")}
            >
              {pending === "demo-student" ? "Loading..." : "Student Demo"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleDemoLogin("recruiter")}
            >
              {pending === "demo-recruiter" ? "Loading..." : "Recruiter Demo"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}