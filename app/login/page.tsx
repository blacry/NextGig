"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/role-context";

// ── Dummy Login Page for MVP ──────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [isLoading, setIsLoading] = useState<"student" | "recruiter" | null>(null);

  const handleLogin = (selectedRole: "student" | "recruiter") => {
    setIsLoading(selectedRole);

    // Simulate network delay for effect
    setTimeout(() => {
      if (selectedRole === "student") {
        login("student", "Demo Student", "demo-student", "123");
        // Clear previous state for a fresh demo run
        sessionStorage.clear();
      } else {
        login("recruiter", "Demo Recruiter", "demo-recruiter", "456");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-6"
      >
        <Card className="border-(--ng-primary)/20 hover:border-(--ng-primary)/50sition-colors cursor-pointer group" onClick={() => handleLogin("student")}>
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-(--ng-primary)/10 text-text-ng-primaryded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <CardTitle className="text-2xl">Student / Job Seeker</CardTitle>
            <CardDescription>Prove your skills and get hired.</CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <Button className="w-full" disabled={isLoading !== null}>
              {isLoading === "student" ? "Loading Demo..." : "Enter Student Demo"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-(--ng-secondary)/20r:border-[var(--ng-secondary)]/50 transition-colors cursor-pointer group" onClick={() => handleLogin("recruiter")}>
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-(--ng-secondary)/10 text-ng-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <CardTitle className="text-2xl">Recruiter / Employer</CardTitle>
            <CardDescription>Find verified, skill-matched talent.</CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <Button variant="secondary" className="w-full" disabled={isLoading !== null}>
              {isLoading === "recruiter" ? "Loading Demo..." : "Enter Recruiter Demo"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
