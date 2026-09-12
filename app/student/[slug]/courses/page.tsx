"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStudent } from "@/lib/student-context";
import { DataError, getLearningPaths } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/shared";
import { YouTubeCourseCard } from "@/components/youtube-course-card";
import type { LearningPath } from "@/lib/types";

// ── Courses Page ─────────────────────────────────────────────────────

interface YouTubeCourse {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  description: string;
  relevance: number;
}

export default function CoursesPage() {
  const { student, isLoaded } = useStudent();
  const router = useRouter();
  const [courses, setCourses] = useState<LearningPath[]>([]);
  const [youtubeCourses, setYoutubeCourses] = useState<YouTubeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingYoutube, setLoadingYoutube] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const paths = await getLearningPaths();
        if (!active) return;
        setCourses(paths);
      } catch (error) {
        console.error("[courses] failed to load", error);
        if (active) {
          toast.error(
            error instanceof DataError
              ? error.message
              : "Could not load courses. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  // Load personalized YouTube recommendations
  useEffect(() => {
    if (!student) return;

    let active = true;
    const loadYoutubeCourses = async () => {
      setLoadingYoutube(true);
      try {
        const skills = student.skills.map((skill) => skill.name);
        const response = await fetch("/api/youtube-courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills,
            context: `Student in ${student.education.field} looking to improve their career skills`,
          }),
        });

        if (!response.ok) throw new Error("Failed to load recommendations");
        const data = await response.json();
        if (active) setYoutubeCourses(data.courses || []);
      } catch (error) {
        console.error("[courses] failed to load YouTube recommendations", error);
      } finally {
        if (active) setLoadingYoutube(false);
      }
    };

    void loadYoutubeCourses();
    return () => {
      active = false;
    };
  }, [student]);

  if (!isLoaded || !student) return null;

  // Apply filters
  const filtered = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.provider.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === null || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const levelCount = {
    all: courses.length,
    beginner: courses.filter((c) => c.level === 1).length,
    intermediate: courses.filter((c) => c.level === 2).length,
    advanced: courses.filter((c) => c.level === 3).length,
  };

  const getLevelLabel = (level: number): string => {
    if (level === 1) return "beginner";
    if (level === 2) return "intermediate";
    if (level === 3) return "advanced";
    return "beginner";
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Learning Courses</h1>
        <p className="text-muted-foreground mt-1">
          Curated courses to enhance your skills and close gaps.
        </p>
      </motion.div>

      {/* AI-powered YouTube recommendations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Recommended for you</h2>
            <p className="text-sm text-muted-foreground">AI-picked YouTube lessons based on your skills and goals.</p>
          </div>
          <Badge variant="secondary" className="shrink-0">✨ Personalized</Badge>
        </div>
        {loadingYoutube ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : youtubeCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeCourses.slice(0, 6).map((course, index) => (
              <YouTubeCourseCard key={`${course.videoId}-${index}`} {...course} index={index} />
            ))}
          </div>
        ) : (
          <Card><CardContent className="p-5 text-sm text-muted-foreground">Personalized recommendations will appear here soon.</CardContent></Card>
        )}
      </section>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            placeholder="Search courses by title or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Level:</span>
          <Badge
            variant={filterLevel === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterLevel(null)}
          >
            All ({levelCount.all})
          </Badge>
          <Badge
            variant={filterLevel === 1 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterLevel(1)}
          >
            Beginner ({levelCount.beginner})
          </Badge>
          <Badge
            variant={filterLevel === 2 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterLevel(2)}
          >
            Intermediate ({levelCount.intermediate})
          </Badge>
          <Badge
            variant={filterLevel === 3 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterLevel(3)}
          >
            Advanced ({levelCount.advanced})
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:border-[var(--ng-primary)]/30 transition-all duration-200 hover:shadow-lg relative overflow-hidden group">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--ng-primary)]/0 via-[var(--ng-primary)]/0 to-[var(--ng-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <CardContent className="p-5 relative h-full flex flex-col">
                    {/* Provider Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                        {course.provider}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-600">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-[var(--ng-primary)] transition-colors">
                      {course.title}
                    </h3>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1 capitalize">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {course.duration}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 capitalize"
                      >
                        {getLevelLabel(course.level)}
                      </Badge>
                    </div>

                    {/* Skills covered */}
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-2">
                        Covers {course.skillIds.length} skill{course.skillIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* CTA */}
                    <Button
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => window.open(course.url, '_blank')}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-1.5"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
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
                    className="text-muted-foreground"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">No courses found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
