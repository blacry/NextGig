"use client";

import { motion } from "framer-motion";
import type { SkillLevel } from "@/lib/types";

// ── Skill Meter Component ────────────────────────────────────────────
// Horizontal bar showing current level with animated fill + target marker.

interface SkillMeterProps {
  skillName: string;
  currentLevel: SkillLevel | 0;
  targetLevel?: SkillLevel;
  maxLevel?: number;
}

export function SkillMeter({
  skillName,
  currentLevel,
  targetLevel,
  maxLevel = 5,
}: SkillMeterProps) {
  const currentPercent = (currentLevel / maxLevel) * 100;
  const targetPercent = targetLevel ? (targetLevel / maxLevel) * 100 : undefined;

  const getColor = () => {
    if (!targetLevel) return "var(--ng-primary)";
    if (currentLevel >= targetLevel) return "var(--ng-success)";
    if (currentLevel >= targetLevel - 1) return "var(--ng-warning)";
    return "var(--ng-critical)";
  };

  const levelLabels = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium">{skillName}</span>
        <span className="text-xs text-muted-foreground">
          {levelLabels[currentLevel] || "None"}
          {targetLevel && ` / ${levelLabels[targetLevel]} required`}
        </span>
      </div>
      <div className="relative h-2.5 bg-muted rounded-full overflow-visible">
        {/* Current level fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ backgroundColor: getColor() }}
          initial={{ width: 0 }}
          animate={{ width: `${currentPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* Target level marker */}
        {targetPercent !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/40 rounded-full"
            style={{ left: `${targetPercent}%` }}
            title={`Target: Level ${targetLevel}`}
          />
        )}
        {/* Level dots */}
        {Array.from({ length: maxLevel - 1 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-px h-2 bg-background/50"
            style={{ left: `${((i + 1) / maxLevel) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
