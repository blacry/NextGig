"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockOpportunities, mockStudents } from "@/lib/data";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { StatCard } from "@/components/stat-card";
import { MatchScore } from "@/components/match-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeatmapPreview } from "@/components/heatmap-preview";

// ── Recruiter Dashboard ──────────────────────────────────────────────

export default function RecruiterDashboardPage({ params }: { params: { slug: string } }) {
  // Use the first opportunity for the demo top pipeline
  const opp = mockOpportunities[0];
  const ranked = rankCandidatesForOpportunity(mockStudents, opp).slice(0, 5);

  // Mock heatmap data
  const heatmapData = [
    { skillName: "React", value: 95, label: "High demand, low supply" },
    { skillName: "Node.js", value: 80 },
    { skillName: "TypeScript", value: 85 },
    { skillName: "Python", value: 60 },
    { skillName: "Docker", value: 45 },
    { skillName: "AWS", value: 75 },
    { skillName: "Figma", value: 30 },
    { skillName: "SQL", value: 70 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your active pipelines and talent matches.</p>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Active Roles" value={3} trend={{ value: 1, label: "new this week" }} />
        <StatCard index={1} title="Total Candidates" value={124} trend={{ value: 12, label: "vs last week" }} />
        <StatCard index={2} title="Avg. Time to Hire" value={14} suffix=" days" trend={{ value: -2, label: "days vs avg" }} />
        <StatCard index={3} title="High Match Rate" value={68} suffix="%" description="Candidates > 80% match" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Top Pipeline */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Candidates Pipeline</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">For {opp.title}</p>
              </div>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead className="bg-muted/50 border-y border-border text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium">Candidate</th>
                      <th className="text-left font-medium">Match Score</th>
                      <th className="text-left font-medium">Verified Skills</th>
                      <th className="text-left font-medium">Status</th>
                      <th className="text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ranked.map((result, i) => {
                      const student = mockStudents.find(s => s.id === result.studentId)!;
                      const verified = student.skills.filter(s => s.verification !== "self-declared").length;
                      return (
                        <motion.tr
                          key={student.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <td>
                            <div className="font-medium text-sm">{student.name}</div>
                            <div className="text-xs text-muted-foreground">{student.education.institution}</div>
                          </td>
                          <td className="w-48">
                            <MatchScore score={result.overallScore} size="sm" showBreakdown={false} />
                          </td>
                          <td>
                            <Badge variant="secondary" className="font-normal text-xs">{verified} verified</Badge>
                          </td>
                          <td>
                            <span className="text-xs text-muted-foreground">New Match</span>
                          </td>
                          <td className="text-right">
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              View Profile
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Insights */}
        <div className="space-y-6">
          <Card className="ai-surface border-[var(--ng-primary)]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ng-primary)" stroke="none"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/></svg>
                AI Sourcing Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We noticed you&apos;re looking for <strong className="text-foreground">Next.js</strong> developers.
                Expanding your required skills to include <strong className="text-foreground">React + Node.js</strong> increases your talent pool by 312% with comparable capability.
              </p>
              <Button size="sm" variant="secondary" className="w-full">Adjust Requirements</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Skill Supply vs Demand</CardTitle>
              <p className="text-xs text-muted-foreground">Global marketplace trends</p>
            </CardHeader>
            <CardContent>
              <HeatmapPreview data={heatmapData} maxCols={4} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
