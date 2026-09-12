"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

// ── Stat Card Component ──────────────────────────────────────────────
// Metric card with animated count-up for dashboard stats.

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
  index?: number;
}

export function StatCard({
  title,
  value,
  suffix = "",
  prefix = "",
  description,
  trend,
  icon,
  index = 0,
}: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1,
      ease: "easeOut",
      delay: index * 0.1,
    });
    return controls.stop;
  }, [value, count, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="hover:shadow-lg hover:border-[var(--ng-primary)]/20 transition-all duration-200 relative overflow-hidden group">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ng-primary)]/0 via-transparent to-[var(--ng-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
              <div className="flex items-baseline gap-1 mt-2">
                {prefix && <span className="text-lg text-muted-foreground">{prefix}</span>}
                <motion.span className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  {rounded}
                </motion.span>
                {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
              )}
              {trend && (
                <p className="text-xs mt-2 flex items-center gap-1">
                  <span
                    className="font-semibold flex items-center gap-0.5"
                    style={{
                      color: trend.value > 0 ? "var(--ng-success)" : "var(--ng-critical)",
                    }}
                  >
                    {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-muted-foreground">{trend.label}</span>
                </p>
              )}
            </div>
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--ng-primary)]/10 to-[var(--ng-primary)]/5 flex items-center justify-center text-[var(--ng-primary)] group-hover:scale-110 transition-transform duration-200">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
