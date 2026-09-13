"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

// ── Readiness Ring Component ─────────────────────────────────────────
// Circular progress for placement readiness with animated stroke.

interface ReadinessRingProps {
  value: number;
  trend?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ReadinessRing({
  value,
  trend,
  size = 160,
  strokeWidth = 10,
  label = "Placement Ready",
}: ReadinessRingProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getColor = () => {
    if (value >= 75) return "var(--ng-success)";
    if (value >= 50) return "var(--ng-warning)";
    return "var(--ng-critical)";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (value / 100) * circumference,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color: getColor() }}
          >
            {rounded}
          </motion.span>
          <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">%</span>
        </div>
      </div>

      {/* Label and trend */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">
            <span style={{ color: trend > 0 ? "var(--ng-success)" : "var(--ng-critical)" }}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>{" "}
            from last month
          </p>
        )}
      </div>
    </div>
  );
}
