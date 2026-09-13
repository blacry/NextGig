"use client";

import { Sidebar } from "@/components/layout/sidebar";

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar variant="institution" />
      <main className="flex-1 lg:pl-[260px] pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
