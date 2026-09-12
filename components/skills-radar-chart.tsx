"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Skill } from "@/lib/types";

// ── Skills Radar Chart Component ─────────────────────────────────────
// Spider/radar chart showing skill proficiency across domains

interface SkillsRadarChartProps {
  skills: Skill[];
  size?: number;
}

interface DomainScore {
  domain: string;
  label: string;
  score: number;
  color: string;
}

const DOMAIN_CONFIG = {
  frontend: { label: "Frontend", color: "#3B82F6" },
  backend: { label: "Backend", color: "#10B981" },
  "data-ai": { label: "Data & AI", color: "#8B5CF6" },
  cloud: { label: "Cloud", color: "#06B6D4" },
  devops: { label: "DevOps", color: "#F97316" },
  mobile: { label: "Mobile", color: "#EC4899" },
};

export function SkillsRadarChart({ skills, size = 280 }: SkillsRadarChartProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Calculate average level per domain
  const domainScores: DomainScore[] = Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
    const domainSkills = skills.filter((s) => s.domain === key);
    const avgLevel = domainSkills.length > 0
      ? domainSkills.reduce((sum, s) => sum + s.level, 0) / domainSkills.length
      : 0;

    return {
      domain: key,
      label: config.label,
      score: (avgLevel / 5) * 100, // Convert to percentage
      color: config.color,
    };
  });

  const center = size / 2;
  const radius = (size / 2) - 40;
  const angleStep = (Math.PI * 2) / domainScores.length;

  // Calculate polygon points
  const getPoint = (index: number, percentage: number) => {
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const r = (radius * percentage) / 100;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate path for the data polygon
  const dataPoints = domainScores.map((d, i) => getPoint(i, d.score));
  const dataPath = dataPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + ' Z';

  // Generate grid circles (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level) => {
          const r = (radius * level) / 100;
          return (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Grid lines (axes) */}
        {domainScores.map((_, index) => {
          const endPoint = getPoint(index, 100);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Data polygon with gradient fill */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--ng-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--ng-primary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <motion.path
          d={dataPath}
          fill="url(#radarGradient)"
          stroke="var(--ng-primary)"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={animate ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {domainScores.map((domain, index) => {
          const point = getPoint(index, domain.score);
          return (
            <motion.g key={domain.domain}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={domain.color}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={animate ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              />
            </motion.g>
          );
        })}

        {/* Labels */}
        {domainScores.map((domain, index) => {
          const labelPoint = getPoint(index, 115);
          return (
            <motion.text
              key={`label-${domain.domain}`}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-foreground"
              initial={{ opacity: 0 }}
              animate={animate ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              {domain.label}
            </motion.text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        {domainScores.map((domain) => (
          <div key={domain.domain} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: domain.color }}
            />
            <span className="text-muted-foreground">
              {domain.label}: {(domain.score / 20).toFixed(1)}/5
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
