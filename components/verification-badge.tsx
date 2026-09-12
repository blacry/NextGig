"use client";

import { Badge } from "@/components/ui/badge";
import type { VerificationType } from "@/lib/types";

// ── Verification Badge Component ─────────────────────────────────────
// Four visually distinct states with inline SVG icons.

const config: Record<
  VerificationType,
  { label: string; className: string; icon: React.ReactNode }
> = {
  "self-declared": {
    label: "Self-Declared",
    className: "bg-muted text-muted-foreground border-muted-foreground/20 hover:bg-muted",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
  },
  assessed: {
    label: "Assessed",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/15",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  "project-verified": {
    label: "Project-Verified",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  "industry-verified": {
    label: "Industry-Verified",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
};

interface VerificationBadgeProps {
  type: VerificationType;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function VerificationBadge({
  type,
  showLabel = true,
  size = "sm",
}: VerificationBadgeProps) {
  const c = config[type];

  return (
    <Badge
      variant="outline"
      className={`${c.className} gap-1 ${
        size === "sm" ? "text-[10px] px-1.5 py-0.5 h-auto min-h-0 min-w-0" : "text-xs px-2 py-1 h-auto min-h-0 min-w-0"
      } transition-colors duration-150`}
    >
      {c.icon}
      {showLabel && <span>{c.label}</span>}
    </Badge>
  );
}
