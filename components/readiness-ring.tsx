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
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{ backgroundColor: getColor() }}
        />

        <svg width={size} height={size} className="-rotate-90 relative">
          {/* Background track with gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            opacity={0.2}
          />
          {/* Animated progress with gradient */}
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
            style={{
              filter: "drop-shadow(0 0 4px currentColor)",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div className="text-center">
            <motion.span
              className="text-4xl font-bold"
              style={{ color: getColor() }}
            >
              {rounded}
            </motion.span>
            <span className="text-xl font-medium ml-0.5" style={{ color: getColor() }}>%</span>
          </motion.div>
        </div>
      </div>

      {/* Label and trend */}
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
            <span
              className="font-semibold"
              style={{ color: trend > 0 ? "var(--ng-success)" : "var(--ng-critical)" }}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
            <span>from last month</span>
          </p>
        )}
      </div>
    </div>
  );
}
