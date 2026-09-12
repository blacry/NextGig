"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--ng-primary)]/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--ng-secondary)]/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <Badge />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          The future of skill intelligence is here.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          NextGig bridges the gap between academia and industry. Upload your CV, prove your skills with AI-driven assessments, and match directly with employers looking for your verified capabilities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-[var(--ng-pr    imary)]/20 hover:shadow-[var(--ng-primary)]/40 transition-shadow">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Try the Demo
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center rounded-full border border-[var(--ng-primary)]/30 bg-[var(--ng-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--ng-primary)] mb-8">
      <span className="flex h-2 w-2 rounded-full bg-[var(--ng-primary)] mr-2 animate-pulse" />
      SIH 2026 Hackathon MVP
    </div>
  );
}
