// ── NextGig Deterministic Matching Engine ─────────────────────────────
//
// ╔═══════════════════════════════════════════════════════════════════╗
// ║  BOUNDARY: This module is the DETERMINISTIC scorer.              ║
// ║  The AI (lib/ai.ts) NEVER generates match scores — only         ║
// ║  explanations, extractions, and recommendations.                 ║
// ║  Match percentages shown in the UI come ONLY from this file.     ║
// ╚═══════════════════════════════════════════════════════════════════╝
//
// Scoring weights:
//   - Skill match:        60%
//   - Education match:    15%
//   - Experience match:   10%
//   - Verification bonus: 15%

import type {
  Student,
  Opportunity,
  MatchResult,
  MatchBreakdown,
  SkillGap,
  GapSeverity,
  SkillLevel,
  VerificationType,
} from "./types";

// ── Verification Tier Weights ────────────────────────────────────────
// Higher verification = more trustworthy = higher weight in matching.

const VERIFICATION_WEIGHTS: Record<VerificationType, number> = {
  "self-declared": 0.5,
  "assessed": 0.75,
  "project-verified": 0.85,
  "industry-verified": 1.0,
};

// ── Domain Relevance Map ─────────────────────────────────────────────
// Maps degree fields to opportunity domains for education matching.

const DOMAIN_RELEVANCE: Record<string, string[]> = {
  "Computer Science": ["frontend", "backend", "data-ai", "cloud", "devops", "mobile", "general"],
  "Data Science": ["data-ai", "backend", "cloud"],
  "Information Technology": ["frontend", "backend", "cloud", "devops"],
  "Artificial Intelligence": ["data-ai", "backend", "cloud"],
  "Electronics & Communication": ["backend", "general"],
  "Electrical Engineering": ["general"],
};

// ── Core Matching Functions ──────────────────────────────────────────

/**
 * Calculate the match score between a student and an opportunity.
 * Returns a MatchResult with overall percentage and detailed breakdown.
 *
 * The score is computed deterministically — no AI involved.
 */
export function calculateMatchScore(
  student: Student,
  opportunity: Opportunity
): MatchResult {
  const breakdown = calculateBreakdown(student, opportunity);

  // Weighted combination
  const overallScore = Math.round(
    breakdown.skillMatch * 0.6 +
    breakdown.educationMatch * 0.15 +
    breakdown.experienceMatch * 0.1 +
    breakdown.verificationBonus * 0.15
  );

  return {
    studentId: student.id,
    opportunityId: opportunity.id,
    overallScore: Math.min(100, Math.max(0, overallScore)),
    breakdown,
  };
}

function calculateBreakdown(
  student: Student,
  opportunity: Opportunity
): MatchBreakdown {
  // ── 1. Skill Match (60% weight) ──
  const allRequirements = [
    ...opportunity.requiredSkills,
    ...opportunity.preferredSkills,
  ];

  const skillDetails = allRequirements.map((req) => {
    const studentSkill = student.skills.find((s) => s.id === req.skillId);
    const studentLevel = studentSkill ? studentSkill.level : 0;
    const verification = studentSkill ? studentSkill.verification : "none" as const;

    return {
      skillName: req.skillName,
      studentLevel: studentLevel as SkillLevel | 0,
      requiredLevel: req.requiredLevel,
      met: studentLevel >= req.requiredLevel,
      verification: verification as VerificationType | "none",
    };
  });

  // Required skills are worth more than preferred
  const requiredCount = opportunity.requiredSkills.length;
  const preferredCount = opportunity.preferredSkills.length;
  const totalWeight = requiredCount * 2 + preferredCount; // required skills count double

  let skillScore = 0;
  skillDetails.forEach((detail, index) => {
    const isRequired = index < requiredCount;
    const weight = isRequired ? 2 : 1;

    if (detail.studentLevel === 0) {
      // Skill not present at all
      skillScore += 0;
    } else if (detail.met) {
      // Skill meets or exceeds requirement
      const verificationMultiplier =
        detail.verification !== "none"
          ? VERIFICATION_WEIGHTS[detail.verification]
          : 0.5;
      skillScore += weight * verificationMultiplier;
    } else {
      // Skill present but below required level
      const ratio = detail.studentLevel / detail.requiredLevel;
      skillScore += weight * ratio * 0.7; // partial credit
    }
  });

  const skillMatch = totalWeight > 0
    ? Math.round((skillScore / totalWeight) * 100)
    : 0;

  // ── 2. Education Match (15% weight) ──
  const relevantDomains = DOMAIN_RELEVANCE[student.education.field] || [];
  const educationMatch = relevantDomains.includes(opportunity.domain)
    ? Math.min(100, 60 + (student.education.gpa || 7) * 5)
    : 30; // Base score for non-relevant degrees

  // ── 3. Experience Match (10% weight) ──
  const projectCount = student.projects.length;
  const certCount = student.certifications.length;
  const verifiedProjects = student.projects.filter((p) => p.verified).length;

  const experienceMatch = Math.min(
    100,
    projectCount * 15 + certCount * 10 + verifiedProjects * 10
  );

  // ── 4. Verification Bonus (15% weight) ──
  const verifiedSkillCount = student.skills.filter(
    (s) => s.verification !== "self-declared"
  ).length;
  const totalSkillCount = student.skills.length;

  const verificationBonus =
    totalSkillCount > 0
      ? Math.round((verifiedSkillCount / totalSkillCount) * 100)
      : 0;

  return {
    skillMatch: Math.min(100, skillMatch),
    educationMatch: Math.min(100, educationMatch),
    experienceMatch: Math.min(100, experienceMatch),
    verificationBonus: Math.min(100, verificationBonus),
    skillDetails,
  };
}

/**
 * Rank all students against a specific opportunity.
 * Returns sorted MatchResults (highest score first).
 */
export function rankCandidatesForOpportunity(
  students: Student[],
  opportunity: Opportunity
): MatchResult[] {
  return students
    .map((student) => calculateMatchScore(student, opportunity))
    .sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Identify skill gaps for a student vs. a target opportunity.
 * Returns gaps classified as critical, moderate, or emerging.
 */
export function identifySkillGaps(
  student: Student,
  opportunity: Opportunity
): SkillGap[] {
  const allRequirements = [
    ...opportunity.requiredSkills.map((r) => ({ ...r, isRequired: true })),
    ...opportunity.preferredSkills.map((r) => ({ ...r, isRequired: false })),
  ];

  const gaps: SkillGap[] = [];

  for (const req of allRequirements) {
    const studentSkill = student.skills.find((s) => s.id === req.skillId);
    const currentLevel = studentSkill ? studentSkill.level : 0;

    if (currentLevel < req.requiredLevel) {
      const deficit = req.requiredLevel - currentLevel;
      let severity: GapSeverity;

      if (req.isRequired && deficit >= 2) {
        severity = "critical";
      } else if (req.isRequired && deficit >= 1) {
        severity = "moderate";
      } else {
        severity = "emerging";
      }

      gaps.push({
        skillName: req.skillName,
        skillId: req.skillId,
        currentLevel: currentLevel as SkillLevel | 0,
        requiredLevel: req.requiredLevel,
        severity,
        requirement: req.isRequired
          ? `Required at Level ${req.requiredLevel} for ${opportunity.title}`
          : `Preferred at Level ${req.requiredLevel} for ${opportunity.title}`,
      });
    }
  }

  // Sort: critical first, then moderate, then emerging
  const severityOrder: Record<GapSeverity, number> = {
    critical: 0,
    moderate: 1,
    emerging: 2,
  };
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return gaps;
}

/**
 * Calculate overall placement readiness for a student across all opportunities.
 * Returns a percentage representing how prepared they are for the best match.
 */
export function calculatePlacementReadiness(
  student: Student,
  opportunities: Opportunity[]
): { readiness: number; bestMatchId: string | null; trend: number } {
  if (opportunities.length === 0) {
    return { readiness: 0, bestMatchId: null, trend: 0 };
  }

  const scores = opportunities.map((opp) =>
    calculateMatchScore(student, opp)
  );
  scores.sort((a, b) => b.overallScore - a.overallScore);

  const bestMatch = scores[0];
  const top3Avg = scores
    .slice(0, 3)
    .reduce((sum, s) => sum + s.overallScore, 0) / Math.min(3, scores.length);

  // Readiness is a blend of best match and top-3 average
  const readiness = Math.round(bestMatch.overallScore * 0.6 + top3Avg * 0.4);

  // Simulate a positive trend for the demo (would be computed from historical data in production)
  const trend = Math.round(Math.random() * 8 + 2); // +2% to +10%

  return {
    readiness,
    bestMatchId: bestMatch.opportunityId,
    trend,
  };
}

/**
 * Generate a human-readable match reason for a student-opportunity pair.
 * This is a deterministic summary — NOT an AI-generated explanation.
 */
export function generateMatchReason(result: MatchResult): string {
  const { breakdown } = result;
  const metSkills = breakdown.skillDetails.filter((d) => d.met);
  const totalSkills = breakdown.skillDetails.length;
  const verifiedMet = metSkills.filter(
    (d) => d.verification === "industry-verified" || d.verification === "project-verified"
  );

  const parts: string[] = [];

  if (metSkills.length === totalSkills) {
    parts.push("Meets all skill requirements");
  } else if (metSkills.length > totalSkills * 0.7) {
    parts.push(`Meets ${metSkills.length}/${totalSkills} skill requirements`);
  } else {
    parts.push(
      `Meets ${metSkills.length}/${totalSkills} skills, gaps in ${
        totalSkills - metSkills.length
      } areas`
    );
  }

  if (verifiedMet.length > 0) {
    parts.push(
      `${verifiedMet.length} skill${verifiedMet.length > 1 ? "s" : ""} verified through industry/projects`
    );
  }

  if (breakdown.educationMatch > 80) {
    parts.push("Strong educational fit");
  }

  if (breakdown.experienceMatch > 70) {
    parts.push("Solid project portfolio");
  }

  return parts.join(". ") + ".";
}
