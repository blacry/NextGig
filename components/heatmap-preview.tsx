"use client";

import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SkillTaxonomyItem } from "@/lib/types";

// ── Heatmap Preview Component ────────────────────────────────────────
// Simple skill-demand-vs-capability grid (reusable for Institution page later).

interface HeatmapCell {
  skillName: string;
  value: number; // 0-100
  label?: string;
}

interface HeatmapPreviewProps {
  title?: string;
  data: HeatmapCell[];
  maxCols?: number;
}

export function HeatmapPreview({ title, data, maxCols = 6 }: HeatmapPreviewProps) {
  const getColor = (value: number) => {
    if (value >= 80) return "var(--ng-success)";
    if (value >= 60) return "var(--ng-primary)";
    if (value >= 40) return "var(--ng-warning)";
    if (value >= 20) return "var(--ng-critical)";
    return "var(--muted)";
  };

  const getOpacity = (value: number) => {
    return 0.3 + (value / 100) * 0.7;
  };

  return (
    <div>
      {title && <h4 className="text-sm font-medium mb-3">{title}</h4>}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${Math.min(maxCols, data.length)}, 1fr)` }}
      >
        {data.map((cell, i) => (
          <Tooltip key={cell.skillName}>
            <TooltipTrigger>
              <motion.div
                className="aspect-square rounded-md flex items-center justify-center cursor-default"
                style={{
                  backgroundColor: getColor(cell.value),
                  opacity: getOpacity(cell.value),
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: getOpacity(cell.value) }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-[9px] font-medium text-white truncate px-1">
                  {cell.value}
                </span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-medium">{cell.skillName}</p>
              <p className="text-xs text-muted-foreground">{cell.label || `${cell.value}% demand`}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
