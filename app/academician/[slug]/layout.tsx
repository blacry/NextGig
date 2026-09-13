"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/shared";
import { AcademicianProvider, useAcademician } from "@/lib/academician-context";
import { useRole } from "@/lib/role-context";

// ── Academician Layout Wrapper ───────────────────────────────────────

function AcademicianLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoaded, academician } = useAcademician();
  const { role, isLoading: isAuthLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    // No session, or a different role following an academician link.
    if (role !== "academician" && role !== null) {
      router.push("/login");
      return;
    }

    // Allow academicians to view even if not fully loaded (demo mode)
    // if (isLoaded && !academician) {
    //   router.push("/login");
    // }
  }, [isAuthLoading, role, isLoaded, academician, router]);

  if (!isLoaded) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar variant="academician" />
      <main className="main-with-sidebar min-h-screen flex flex-col pb-16 lg:pb-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-muted-foreground hidden lg:block">
            {academician
              ? `Good ${new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, ${academician.name.split(" ")[0]}`
              : "Academician Portal"}
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

export default function AcademicianLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <AcademicianProvider academicianSlug={slug}>
      <AcademicianLayoutContent>{children}</AcademicianLayoutContent>
    </AcademicianProvider>
  );
}
