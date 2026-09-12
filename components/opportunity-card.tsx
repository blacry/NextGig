"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchScore } from "./match-score";
import type { Opportunity, MatchResult } from "@/lib/types";
import { getCompanyById } from "@/lib/data";

// ── Opportunity Card ─────────────────────────────────────────────────
// Shows role, company, match %, key skills, CTA — all visible.

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchResult?: MatchResult;
  matchReason?: string;
  onViewDetails?: () => void;
  onApply?: () => void;
  index?: number;
}

export function OpportunityCard({
  opportunity,
  matchResult,
  matchReason,
  onViewDetails,
  onApply,
  index = 0,
}: OpportunityCardProps) {
  const company = getCompanyById(opportunity.companyId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Card className="group cursor-pointer hover:border-[var(--ng-primary)]/30 transition-all duration-200 hover:shadow-md">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground">
                {company?.name || "Company"} · {opportunity.location}
              </p>
            </div>
            {matchResult && (
              <MatchScore
                score={matchResult.overallScore}
                size="sm"
                showBreakdown={false}
              />
            )}
          </div>

          {/* Match reason */}
          {matchReason && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{matchReason}</p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.requiredSkills.slice(0, 4).map((skill) => (
              <Badge key={skill.skillId} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto min-h-0 min-w-0">
                {skill.skillName}
              </Badge>
            ))}
            {opportunity.requiredSkills.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto min-h-0 min-w-0">
                +{opportunity.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              {opportunity.type}
            </span>
            <span>{opportunity.compensation}</span>
            {opportunity.duration && <span>{opportunity.duration}</span>}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onViewDetails}
              className="flex-1 h-8 text-xs min-h-0"
            >
              View Details
            </Button>
            <Button
              size="sm"
              onClick={onApply}
              className="flex-1 h-8 text-xs min-h-0"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
