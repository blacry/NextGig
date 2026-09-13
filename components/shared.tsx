"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// ── Empty State Component ────────────────────────────────────────────
// Explains what's missing and what to do next.

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">{actionLabel}</Button>
      )}
    </motion.div>
  );
}

// ── Skeleton Card ────────────────────────────────────────────────────
// Shimmer-animated skeleton for loading states.

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-5 space-y-3 ${className}`}>
      <div className="h-4 w-2/3 bg-muted rounded animate-shimmer" />
      <div className="h-3 w-full bg-muted rounded animate-shimmer" />
      <div className="h-3 w-4/5 bg-muted rounded animate-shimmer" />
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-16 bg-muted rounded-full animate-shimmer" />
        <div className="h-6 w-20 bg-muted rounded-full animate-shimmer" />
        <div className="h-6 w-14 bg-muted rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

// ── Theme Toggle ─────────────────────────────────────────────────────

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Import at component level to avoid server-side issues
  const { useTheme } = require("@/lib/theme-context");
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`w-9 h-9 p-0 min-h-0 min-w-0 ${className}`}
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        animate={{ rotate: resolvedTheme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {resolvedTheme === "light" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </motion.div>
    </Button>
  );
}
