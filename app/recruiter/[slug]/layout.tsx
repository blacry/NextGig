"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/shared";
import { useRole } from "@/lib/role-context";

// ── Recruiter Layout Wrapper ─────────────────────────────────────────

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Force dark mode wrapper for recruiter persona
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    return () => root.removeAttribute("data-theme");
  }, []);

  useEffect(() => {
    if (!isLoading && role !== "recruiter") {
      router.push("/login");
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== "recruiter") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar variant="recruiter" />
      <main className="main-with-sidebar min-h-screen flex flex-col pb-16 lg:pb-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-muted-foreground hidden lg:block">
            Recruiter Workspace
          </h2>
          <div className="flex-1 lg:hidden" />
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
