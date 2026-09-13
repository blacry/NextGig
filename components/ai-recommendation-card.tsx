"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── AI Recommendation Card ───────────────────────────────────────────
// Light-blue surface with sparkle icon, "why" text, and action button.

interface AIRecommendationCardProps {
  title: string;
  reason: string;
  actionLabel: string;
  onAction?: () => void;
  className?: string;
}

export function AIRecommendationCard({
  title,
  reason,
  actionLabel,
  onAction,
  className = "",
}: AIRecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className={`ai-surface border-[var(--ng-soft)] overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Sparkle icon */}
            <div className="w-8 h-8 rounded-lg bg-[var(--ng-primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ng-primary)" stroke="none">
                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{reason}</p>
              <Button size="sm" variant="outline" onClick={onAction} className="h-7 text-xs min-h-0 min-w-0">
                {actionLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
