"use client";

import { RoleProvider } from "@/lib/role-context";
import { ThemeProvider } from "@/lib/theme-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RoleProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
