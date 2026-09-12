"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

// ── Match Score Component ────────────────────────────────────────────
// Always renders the % next to its reasoning breakdown, never alone.

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  breakdown?: {
    skillMatch: number;
    educationMatch: number;
    experienceMatch: number;
    verificationBonus: number;
  };
  reason?: string;
  showBreakdown?: boolean;
}

export function MatchScore({
  score,
  size = "md",
  breakdown,
  reason,
  showBreakdown = true,
}: MatchScoreProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [score, count]);

  const sizes = {
    sm: { ring: 48, stroke: 4, text: "text-sm", label: "text-xs" },
    md: { ring: 72, stroke: 5, text: "text-xl", label: "text-xs" },
    lg: { ring: 96, stroke: 6, text: "text-2xl", label: "text-sm" },
  };

  const s = sizes[size];
  const radius = (s.ring - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const getColor = () => {
    if (score >= 75) return "var(--ng-success)";
    if (score >= 50) return "var(--ng-warning)";
    return "var(--ng-critical)";
  };

  return (
    <div className="flex items-start gap-4">
      {/* Animated ring */}
      <div className="relative flex-shrink-0" style={{ width: s.ring, height: s.ring }}>
        <svg width={s.ring} height={s.ring} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={s.stroke}
          />
          {/* Progress circle */}
          <motion.circle
            cx={s.ring / 2}
            cy={s.ring / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className={`font-bold ${s.text}`} style={{ color: getColor() }}>
            {rounded}
          </motion.span>
        </div>
      </div>

      {/* Reasoning breakdown — NEVER a bare percentage */}
      {showBreakdown && (
        <div className="flex-1 min-w-0">
          {reason && (
            <p className={`${s.label} text-muted-foreground mb-2`}>{reason}</p>
          )}
          {breakdown && (
            <div className="space-y-1.5">
              <BreakdownBar label="Skills" value={breakdown.skillMatch} weight="60%" />
              <BreakdownBar label="Education" value={breakdown.educationMatch} weight="15%" />
              <BreakdownBar label="Experience" value={breakdown.experienceMatch} weight="10%" />
              <BreakdownBar label="Verification" value={breakdown.verificationBonus} weight="15%" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BreakdownBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-muted-foreground shrink-0">
        {label} <span className="text-[10px] opacity-60">({weight})</span>
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor:
              value >= 75
                ? "var(--ng-success)"
                : value >= 50
                ? "var(--ng-warning)"
                : "var(--ng-critical)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <span className="w-8 text-right font-medium">{value}%</span>
    </div>
  );
}
