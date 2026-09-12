"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStudent } from "@/lib/student-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/verification-badge";
import { SkillMeter } from "@/components/skill-meter";
import type { Skill, SkillDomain } from "@/lib/types";

// ── My Skills Page ───────────────────────────────────────────────────

const DOMAIN_COLORS: Record<SkillDomain, string> = {
  frontend: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  backend: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "data-ai": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  cloud: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  devops: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  mobile: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  general: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
};

const DOMAIN_LABELS: Record<SkillDomain, string> = {
  frontend: "Frontend",
  backend: "Backend",
  "data-ai": "Data & AI",
  cloud: "Cloud",
  devops: "DevOps",
  mobile: "Mobile",
  general: "General",
};

export default function MySkillsPage() {
  const { student, isLoaded } = useStudent();
  const [groupedSkills, setGroupedSkills] = useState<Record<SkillDomain, Skill[]>>({
    frontend: [],
    backend: [],
    "data-ai": [],
    cloud: [],
    devops: [],
    mobile: [],
    general: [],
  });

  useEffect(() => {
    if (!student) return;

    const grouped = student.skills.reduce((acc, skill) => {
      if (!acc[skill.domain]) {
        acc[skill.domain] = [];
      }
      acc[skill.domain].push(skill);
      return acc;
    }, {} as Record<SkillDomain, Skill[]>);

    // Sort skills within each domain by level (highest first)
    Object.keys(grouped).forEach((domain) => {
      grouped[domain as SkillDomain].sort((a, b) => b.level - a.level);
    });

    setGroupedSkills(grouped);
  }, [student]);

  if (!isLoaded || !student) return null;

  const totalSkills = student.skills.length;
  const verifiedSkills = student.skills.filter((s) => s.verification !== "self-declared").length;
  const avgLevel =
    totalSkills > 0
      ? (student.skills.reduce((sum, s) => sum + s.level, 0) / totalSkills).toFixed(1)
      : "0";

  const skillsByDomain = Object.entries(groupedSkills).filter(([_, skills]) => skills.length > 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
        <p className="text-muted-foreground mt-1">
          Your verified skill inventory and proficiency levels.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Skills</p>
                  <p className="text-3xl font-bold mt-1">{totalSkills}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--ng-primary)]/10 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ng-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-3xl font-bold mt-1">
                    {verifiedSkills}
                    <span className="text-lg text-muted-foreground ml-1">/ {totalSkills}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Level</p>
                  <p className="text-3xl font-bold mt-1">{avgLevel}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-600"
                  >
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Skills by Domain */}
      <div className="space-y-6">
        {skillsByDomain.map(([domain, skills], domainIndex) => (
          <motion.div
            key={domain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + domainIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline" className={DOMAIN_COLORS[domain as SkillDomain]}>
                      {DOMAIN_LABELS[domain as SkillDomain]}
                    </Badge>
                    <span className="text-muted-foreground text-sm font-normal">
                      {skills.length} {skills.length === 1 ? "skill" : "skills"}
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-base">{skill.name}</h4>
                            <VerificationBadge type={skill.verification} size="sm" />
                          </div>
                          <SkillMeter
                            skillName=""
                            currentLevel={skill.level}
                            maxLevel={5}
                          />
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-[var(--ng-primary)]">
                            {skill.level}
                          </p>
                          <p className="text-xs text-muted-foreground">/ 5</p>
                        </div>
                      </div>
                      {skill.verifiedAt && (
                        <p className="text-xs text-muted-foreground">
                          Verified on {new Date(skill.verifiedAt).toLocaleDateString()}
                          {skill.verifiedBy && ` by ${skill.verifiedBy}`}
                        </p>
                      )}
                      {index < skills.length - 1 && (
                        <div className="border-b border-border mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {totalSkills === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">No skills added yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete the onboarding process or update your resume to add skills.
            </p>
            <Button>Add Skills</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
