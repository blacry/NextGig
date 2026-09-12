"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRole } from "@/lib/role-context";

// ── Onboarding Layout ────────────────────────────────────────────────
// Clean, focused layout with step progress indicator.
//
// Onboarding writes to the signed-in student's own rows, so the whole flow
// requires a student session — otherwise the save at the final step would
// fail with a 401 after the user has done all the work.

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (role === null) {
      router.push("/login");
    } else if (role !== "student") {
      router.push("/login");
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== "student") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F9FB] via-[#E8F0FE] to-[#F6F9FB] dark:from-[#0A0B10] dark:via-[#0F1628] dark:to-[#0A0B10]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ng-primary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold">NextGig</span>
          </div>
          <span className="text-xs text-muted-foreground">Student Onboarding</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
