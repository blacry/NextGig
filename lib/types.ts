// ── NextGig Type Definitions ──────────────────────────────────────────
// Shared TypeScript interfaces used across the entire application.
// All types are exported from this single file for consistency.
//
// Where a domain type is really just the database's own vocabulary, it is
// derived from the generated enums rather than restated, so the two cannot
// drift apart. Everything else stays hand-written and camelCase: lib/data.ts
// maps snake_case rows into these shapes.

import type { Enums } from "./supabase/database.types";

// ── Skill System ─────────────────────────────────────────────────────

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type VerificationType =
  | "self-declared"
  | "assessed"
  | "project-verified"
  | "industry-verified";

export type SkillDomain = "frontend" | "backend" | "data-ai" | "cloud" | "devops" | "mobile" | "general";

export interface Skill {
  id: string;
  name: string;
  domain: SkillDomain;
  level: SkillLevel;
  verification: VerificationType;
  /** Optional: when the skill was last verified */
  verifiedAt?: string;
  /** Optional: who/what verified it */
  verifiedBy?: string;
}

export interface SkillTaxonomyItem {
  id: string;
  name: string;
  domain: SkillDomain;
  /** Market demand percentage (0-100) */
  marketDemand: number;
}

// ── Student ──────────────────────────────────────────────────────────

/**
 * Everything here is optional because it is: a student exists from the
 * moment they sign up, and their education is unknown until they finish
 * onboarding. The matching database columns are nullable to match.
 */
export interface Education {
  degree?: string;
  field?: string;
  institution?: string;
  /** Graduation year. */
  year?: number;
  gpa?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  url?: string;
  verified: boolean;
}

export interface Certification {
  id: string;
  name: string;
  /** Absent when the CV named no issuing body. */
  issuer?: string;
  /** ISO `YYYY-MM-DD`. Absent when the CV carried no usable date. */
  date?: string;
  verified: boolean;
}

export interface Assessment {
  id: string;
  skillId: string;
  skillName: string;
  score: number;
  maxScore: number;
  level: SkillLevel;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  slug: string;
  email: string;
  avatar?: string;
  education: Education;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  assessments: Assessment[];
  onboardingComplete: boolean;
  /** Summary text from parsed CV */
  bio?: string;
}

// ── Company & Recruiter ──────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
}

export interface Recruiter {
  id: string;
  name: string;
  slug: string;
  email: string;
  companyId: string;
  avatar?: string;
}

// ── Opportunity ──────────────────────────────────────────────────────

export interface OpportunitySkillRequirement {
  skillId: string;
  skillName: string;
  requiredLevel: SkillLevel;
  preferred: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  companyId: string;
  domain: SkillDomain;
  description: string;
  requiredSkills: OpportunitySkillRequirement[];
  preferredSkills: OpportunitySkillRequirement[];
  eligibility: string;
  location: string;
  type: "internship" | "full-time" | "contract";
  duration?: string;
  compensation: string;
  deadline: string;
  postedAt: string;
  recruiterId: string;
  active: boolean;
}

// ── Application Lifecycle ────────────────────────────────────────────

/**
 * The application pipeline, derived from the `application_stage` database
 * enum so the two can never drift apart. To change the vocabulary, alter the
 * enum in Postgres and regenerate database.types.ts — do not edit this alias.
 *
 * Current values: applied, screening, interview, assessment, offer, accepted,
 * rejected, withdrawn.
 */
export type ApplicationStage = Enums<"application_stage">;

/** Stages an application can no longer move on from. */
export const TERMINAL_STAGES: readonly ApplicationStage[] = [
  "accepted",
  "rejected",
  "withdrawn",
];

export interface ApplicationStageEntry {
  stage: ApplicationStage;
  timestamp: string;
  note?: string;
}

export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  currentStage: ApplicationStage;
  stageHistory: ApplicationStageEntry[];
  appliedAt: string;
}

// ── Matching ─────────────────────────────────────────────────────────

export interface MatchBreakdown {
  skillMatch: number;       // 0-100, weight 60%
  educationMatch: number;   // 0-100, weight 15%
  experienceMatch: number;  // 0-100, weight 10%
  verificationBonus: number; // 0-100, weight 15%
  /** Per-skill detail */
  skillDetails: {
    skillName: string;
    studentLevel: SkillLevel | 0;
    requiredLevel: SkillLevel;
    met: boolean;
    verification: VerificationType | "none";
  }[];
}

export interface MatchResult {
  studentId: string;
  opportunityId: string;
  overallScore: number; // 0-100
  breakdown: MatchBreakdown;
}

// ── Gap Analysis ─────────────────────────────────────────────────────

export type GapSeverity = "critical" | "moderate" | "emerging";

export interface SkillGap {
  skillName: string;
  skillId: string;
  currentLevel: SkillLevel | 0;
  requiredLevel: SkillLevel;
  severity: GapSeverity;
  /** The opportunity requirement driving this gap */
  requirement: string;
  /** AI-generated explanation (populated after API call) */
  explanation?: string;
}

// ── Learning ─────────────────────────────────────────────────────────

export interface LearningPath {
  id: string;
  title: string;
  provider: string;
  url: string;
  skillIds: string[];
  duration: string;
  /**
   * Difficulty as the database stores it: `learning_paths.level` is numeric,
   * not the beginner/intermediate/advanced enum this field used to declare.
   */
  level: number;
  rating: number;
}

// ── Assessment / Onboarding ──────────────────────────────────────────

export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "objective" | "subjective";

export interface AssessmentQuestion {
  id: string;
  skillId: string;
  skillName: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
}

export interface SkillGrade {
  skillId: string;
  skillName: string;
  claimedLevel: SkillLevel;
  assessedLevel: SkillLevel;
  score: number;
  feedback: string;
}

export interface AssessmentResult {
  overallScore: number;
  overallGrade: string;
  skillGrades: SkillGrade[];
  recommendations: string[];
  cvTips: string[];
}

export interface OnboardingState {
  step: 1 | 2 | 3 | 4 | 5;
  resumeText?: string;
  parsedProfile?: Partial<Student>;
  confirmedProfile?: Partial<Student>;
  assessmentQuestions?: AssessmentQuestion[];
  assessmentAnswers?: AssessmentAnswer[];
  assessmentResult?: AssessmentResult;
}

// ── Chat / AI Assistant ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ── Auth Context ─────────────────────────────────────────────────────

export type UserRole = "student" | "recruiter";

export interface AuthState {
  role: UserRole | null;
  userName: string;
  userSlug: string;
  userId: string;
}
