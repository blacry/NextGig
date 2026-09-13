"use client";

import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/shared";
import { AcademicianProvider, useAcademician } from "@/lib/academician-context";
import { useRole } from "@/lib/role-context";

function Content({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useRole(); const { isLoaded, academician } = useAcademician(); const router = useRouter();
  useEffect(() => { if (!isLoading && role !== "academician") router.push("/login"); else if (!isLoading && isLoaded && !academician) router.push("/login"); }, [isLoading, role, isLoaded, academician, router]);
  useEffect(() => { document.documentElement.setAttribute("data-theme", "academician"); return () => document.documentElement.removeAttribute("data-theme"); }, []);
  if (isLoading || !isLoaded || role !== "academician" || !academician) return null;
  return <div className="min-h-screen bg-background"><Sidebar variant="academician" /><main className="main-with-sidebar min-h-screen pb-16 lg:pb-0"><header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/85 px-6 backdrop-blur-sm"><span className="hidden text-sm font-medium text-muted-foreground lg:block">Academic Workspace</span><span className="flex-1 lg:hidden" /><ThemeToggle /></header><div className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</div></main></div>;
}
export default function AcademicianLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) { const { slug } = use(params); return <AcademicianProvider slug={slug}><Content>{children}</Content></AcademicianProvider>; }
