"use client";

import { motion } from "framer-motion";
import { GlobalHeader, GlobalFooter } from "@/components/GlobalHeader";

// ── Vridhi Learner Onboarding Layout ─────────────────────────────────
// Government-style clean light theme with global header & footer.

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans antialiased selection:bg-[#123B6D]/15 selection:text-[#123B6D]">
      {/* Universal Global Vridhi Government Header */}
      <GlobalHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Universal Global Vridhi Footer */}
      <GlobalFooter />
    </div>
  );
}
