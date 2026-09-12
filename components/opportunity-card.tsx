"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MatchScore } from "./match-score";
import type { Company, Opportunity, MatchResult } from "@/lib/types";

// ── Opportunity Card with Modals ─────────────────────────────────────

interface OpportunityCardProps {
  opportunity: Opportunity;
  company?: Company;
  matchResult?: MatchResult;
  matchReason?: string;
  onViewDetails?: () => void;
  onApply?: () => void;
  index?: number;
}

export function OpportunityCard({
  opportunity,
  company,
  matchResult,
  matchReason,
  onViewDetails,
  onApply,
  index = 0,
}: OpportunityCardProps) {
  const isApplied = !onApply;
  const [showDetails, setShowDetails] = useState(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
    onViewDetails?.();
  };

  const handleApply = () => {
    setShowApplyConfirm(true);
  };

  const confirmApply = () => {
    onApply?.();
    setShowApplyConfirm(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <Card className="group cursor-pointer hover:border-[var(--ng-primary)]/30 transition-all duration-200 hover:shadow-lg relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ng-primary)]/0 via-[var(--ng-primary)]/0 to-[var(--ng-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <CardContent className="p-5 relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                {/* Company Logo or Initial */}
                <div className="flex items-center gap-3 mb-2">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-10 h-10 rounded-lg object-cover bg-muted"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--ng-primary)]/20 to-[var(--ng-primary)]/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-[var(--ng-primary)]">
                        {company?.name?.charAt(0) || "C"}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate group-hover:text-[var(--ng-primary)] transition-colors">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {company?.name || "Company"}
                    </p>
                  </div>
                </div>
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
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {matchReason}
              </p>
            )}

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {opportunity.requiredSkills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill.skillId}
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 h-auto min-h-0 min-w-0 font-medium"
                >
                  {skill.skillName}
                </Badge>
              ))}
              {opportunity.requiredSkills.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 h-auto min-h-0 min-w-0"
                >
                  +{opportunity.requiredSkills.length - 4}
                </Badge>
              )}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1 capitalize">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                {opportunity.type}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                {opportunity.compensation}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewDetails}
                className="flex-1 h-9 text-xs min-h-0"
              >
                View Details
              </Button>
              {isApplied ? (
                <Button
                  size="sm"
                  disabled
                  className="flex-1 h-9 text-xs min-h-0 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border border-emerald-500/20"
                >
                  ✓ Applied
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleApply}
                  className="flex-1 h-9 text-xs min-h-0"
                >
                  Apply Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-3 mb-2">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 rounded-lg object-cover bg-muted"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--ng-primary)]/20 to-[var(--ng-primary)]/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-[var(--ng-primary)]">
                    {company?.name?.charAt(0) || "C"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <DialogTitle className="text-xl">{opportunity.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {company?.name || "Company"} · {opportunity.location}
                </DialogDescription>
              </div>
              {matchResult && (
                <MatchScore score={matchResult.overallScore} size="md" />
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Type:</span>
                <Badge className="capitalize">{opportunity.type}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Compensation:</span>
                <span className="font-medium">{opportunity.compensation}</span>
              </div>
              {opportunity.duration && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{opportunity.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Deadline:</span>
                <span className="font-medium">
                  {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">About the Role</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="font-semibold mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredSkills.map((skill) => (
                  <Badge key={skill.skillId} variant="secondary">
                    {skill.skillName} (Level {skill.requiredLevel})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            {opportunity.preferredSkills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Preferred Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.preferredSkills.map((skill) => (
                    <Badge key={skill.skillId} variant="outline">
                      {skill.skillName} (Level {skill.requiredLevel})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            <div>
              <h4 className="font-semibold mb-2">Eligibility</h4>
              <p className="text-sm text-muted-foreground">{opportunity.eligibility}</p>
            </div>

            {/* Action */}
            {!isApplied && (
              <Button onClick={handleApply} className="w-full">
                Apply for this Role
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Confirmation Modal */}
      <Dialog open={showApplyConfirm} onOpenChange={setShowApplyConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply for <strong>{opportunity.title}</strong> at{" "}
              <strong>{company?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--ng-primary)]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Your skill passport will be submitted
              </p>
              <p className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--ng-primary)]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                You'll receive updates on your application status
              </p>
              {matchResult && (
                <p className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[var(--ng-primary)]"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Your match score: <strong>{matchResult.overallScore}%</strong>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowApplyConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={confirmApply} className="flex-1">
                Confirm Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
