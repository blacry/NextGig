"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStudent } from "@/lib/student-context";
import { mockOpportunities } from "@/lib/data";
import { calculateMatchScore } from "@/lib/matching";
import { OpportunityCard } from "@/components/opportunity-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MatchResult, Opportunity } from "@/lib/types";

// ── Student Opportunities View ───────────────────────────────────────

export default function OpportunitiesPage() {
  const { student, isLoaded } = useStudent();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<{ opp: Opportunity; result: MatchResult }[]>([]);

  useEffect(() => {
    if (student) {
      const scored = mockOpportunities.map(opp => ({
        opp,
        result: calculateMatchScore(student, opp)
      })).sort((a, b) => b.result.overallScore - a.result.overallScore);
      setMatches(scored);
    }
  }, [student]);

  if (!isLoaded || !student) return null;

  const filtered = matches.filter(m =>
    m.opp.title.toLowerCase().includes(search.toLowerCase()) ||
    m.opp.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground mt-1">Discover roles matched to your verified skills.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <Input
            placeholder="Search roles, domains, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filters</Button>
          <Button variant="outline">Sort: Match Score</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ opp, result }, index) => (
          <OpportunityCard
            key={opp.id}
            index={index}
            opportunity={opp}
            matchResult={result}
            onViewDetails={() => {}}
            onApply={() => {}}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No opportunities found matching your search.
        </div>
      )}
    </div>
  );
}
