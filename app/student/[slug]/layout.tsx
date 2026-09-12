"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/shared";
import { StudentProvider, useStudent } from "@/lib/student-context";

// ── Student Layout Wrapper ───────────────────────────────────────────

function StudentLayoutContent({ children, slug }: { children: React.ReactNode; slug: string }) {
  const { isLoaded, student } = useStudent();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !student) {
      router.push("/login");
    }
  }, [isLoaded, student, router]);

  if (!isLoaded || !student) {
    return null; // or a full-page loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar variant="student" />
      <main className="main-with-sidebar min-h-screen flex flex-col pb-16 lg:pb-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-muted-foreground hidden lg:block">
            Welcome back, {student.name.split(" ")[0]}
          </h2>
          <div className="flex-1 lg:hidden" /> {/* Spacer for mobile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <StudentProvider studentSlug={slug}>
      <StudentLayoutContent slug={slug}>{children}</StudentLayoutContent>
    </StudentProvider>
  );
}
