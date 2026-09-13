"use client";

import { motion } from "framer-motion";
import { useAcademician } from "@/lib/academician-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Academician Dashboard ────────────────────────────────────────────

export default function AcademicianDashboardPage() {
  const { academician, opportunities, mentorships, applications, savedOpportunityIds, isLoaded } =
    useAcademician();

  if (!isLoaded || !academician) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const verifiedSkills = academician.skills.filter(
    (s) => s.verification !== "self-declared"
  ).length;
  const activeApplications = applications.filter((a) => a.status !== "Rejected").length;
  const activeMentorships = mentorships.filter((m) => m.status === "active").length;

  // Calculate profile completion
  const profileFields = [
    academician.profile.designation,
    academician.profile.department,
    academician.profile.institution,
    academician.profile.researchAreas && academician.profile.researchAreas.length > 0,
    academician.skills.length > 0,
    academician.projects.length > 0,
    academician.certifications.length > 0,
    academician.bio,
  ];
  const profileCompletion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {academician.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Build your professional profile, discover opportunities and grow your academic career.
        </p>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Completion</p>
                  <p className="text-3xl font-bold mt-2">{profileCompletion}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Strong profile health</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 dark:text-green-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skill Readiness</p>
                  <p className="text-3xl font-bold mt-2">78%</p>
                  <p className="text-xs text-muted-foreground mt-1">↑ 8% this month</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-blue-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                  <p className="text-3xl font-bold mt-2">{activeApplications}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {applications.filter((a) => a.status === "Interview").length} interviews pending
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600 dark:text-purple-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saved Opportunities</p>
                  <p className="text-3xl font-bold mt-2">{savedOpportunityIds.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">3 new matches</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 dark:text-amber-400">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Skills Overview */}
          <Card>
            <CardHeader>
              <CardTitle>My Skill Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Current professional capability across your core areas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {academician.skills.slice(0, 6).map((skill, i) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">Level {skill.level}/5</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.level / 5) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                        className={`h-full ${
                          skill.level >= 4
                            ? "bg-green-500"
                            : skill.level >= 3
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  Strongest: {academician.skills[0]?.name} — Level {academician.skills[0]?.level}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  {verifiedSkills} verified skills
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Opportunities</CardTitle>
              <p className="text-sm text-muted-foreground">
                Matched to your skills and preferences
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.slice(0, 3).map((item, i) => (
                  <motion.div
                    key={item.opportunity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.opportunity.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.company?.name}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {88 + i * 3}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {item.opportunity.location} · {item.opportunity.duration}
                    </p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {item.opportunity.requiredSkills.slice(0, 3).map((s) => (
                        <Badge key={s.skillId} variant="secondary" className="text-xs">
                          {s.skillName}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.opportunity.compensation}</span>
                      <Button size="sm">Apply Now</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Opportunities →
              </Button>
            </CardContent>
          </Card>

          {/* Career Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Career Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your professional momentum this semester
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ["Applications", applications.length],
                  ["Interviews", applications.filter((a) => a.status === "Interview").length],
                  ["Courses", 6],
                  ["Certificates", academician.certifications.length],
                ].map(([label, count]) => (
                  <div key={label} className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card className="border-[var(--ng-primary)]/20 bg-gradient-to-br from-background to-[var(--ng-primary)]/5">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ng-primary)">
                  <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                </svg>
                AI Career Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your AI/ML profile is highly competitive for research fellowships. Consider adding one publication or research project to strengthen your profile.
              </p>
              <Button size="sm" variant="secondary" className="w-full">
                View Recommendations
              </Button>
            </CardContent>
          </Card>

          {/* Mentoring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Mentorships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{activeMentorships}</span>
                  <span className="text-xs text-muted-foreground">mentees</span>
                </div>
                {mentorships.slice(0, 3).map((m) => (
                  <div key={m.id} className="border-l-2 border-[var(--ng-primary)] pl-3 py-2">
                    <p className="text-sm font-medium">{m.menteeName}</p>
                    <p className="text-xs text-muted-foreground">{m.focus}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <span className="mr-2">📄</span>
                Update Resume
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <span className="mr-2">✓</span>
                Request Project Verification
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-[var(--ng-primary)]">
                <span className="mr-2">✨</span>
                Chat with Career AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
