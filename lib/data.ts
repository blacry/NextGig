// ── NextGig Data Access ───────────────────────────────────────────────
// Every getter here talks to Supabase and returns the camelCase domain
// types from lib/types.ts, so callers never see snake_case rows.
//
// All of these run in Client Components (every page in this app is a client
// component), so they use the browser client from lib/supabase/client.ts —
// which carries the user's session, and therefore their RLS grants.
//
// Errors are thrown as DataError rather than swallowed. Call sites catch and
// surface them with `toast.error(...)`, matching how the onboarding flow and
// the rest of the app already report failures.

import { createClient } from "./supabase/client";
import { toSkillLevel } from "./skill-level";
import type {
  Academician,
  AcademicProfile,
  Application,
  ApplicationStage,
  ApplicationStageEntry,
  Assessment,
  Certification,
  Company,
  Education,
  LearningPath,
  Mentorship,
  Opportunity,
  OpportunitySkillRequirement,
  Project,
  Recruiter,
  Skill,
  SkillTaxonomyItem,
  Student,
} from "./types";
import type {
  ApplicationRow,
  AssessmentRow,
  CertificationRow,
  CompanyRow,
  LearningPathRow,
  OpportunityRow,
  OpportunitySkillRow,
  OpportunityWithCompanyRow,
  ProfileRow,
  ProjectRow,
  RecruiterRow,
  SkillRow,
  StudentRow,
  StudentSkillRow,
} from "./supabase/rows";

// ── Errors ────────────────────────────────────────────────────────────

/**
 * Thrown when a Supabase query fails. Carries a message safe to show in a
 * toast, with the underlying Postgres detail kept on `cause` for the console.
 */
export class DataError extends Error {
  constructor(operation: string, cause?: unknown) {
    super(`Could not load ${operation}. Please try again.`);
    this.name = "DataError";
    this.cause = cause;
  }
}

// ── Select fragments ──────────────────────────────────────────────────
// Declared once so the row types in database.types.ts and the actual
// selected columns cannot drift apart.

const STUDENT_SELECT = `
  id, degree, field, institution, year, gpa, bio, onboarding_complete,
  profiles!inner ( id, role, name, slug, email, avatar ),
  student_skills ( skill_id, level, verification, verified_at, verified_by, skills ( name, domain ) ),
  projects ( id, title, description, tech_stack, url, verified ),
  certifications ( id, name, issuer, date, verified ),
  assessments ( id, skill_id, score, max_score, level, date, skills ( name ) )
` as const;

const OPPORTUNITY_SELECT = `
  id, title, company_id, recruiter_id, domain, description, eligibility,
  location, type, duration, compensation, deadline, posted_at, active,
  opportunity_skills ( skill_id, required_level, preferred, skills ( name ) )
` as const;

const OPPORTUNITY_WITH_COMPANY_SELECT = `
  ${OPPORTUNITY_SELECT},
  companies ( id, name, logo, industry, size, location )
` as const;

const APPLICATION_SELECT = `
  id, student_id, opportunity_id, current_stage, applied_at,
  application_stage_history ( stage, occurred_at, note )
` as const;

// ── Row → domain mappers ──────────────────────────────────────────────

function toSkillTaxonomyItem(row: SkillRow): SkillTaxonomyItem {
  return {
    id: row.id,
    name: row.name,
    domain: row.domain,
    marketDemand: row.market_demand,
  };
}

function toSkill(row: StudentSkillRow): Skill {
  return {
    id: row.skill_id,
    // Fall back to the id when the catalog join is missing, so a skill row
    // never renders as a blank chip.
    name: row.skills?.name ?? row.skill_id,
    domain: row.skills?.domain ?? "general",
    level: toSkillLevel(row.level),
    verification: row.verification,
    ...(row.verified_at ? { verifiedAt: row.verified_at } : {}),
    ...(row.verified_by ? { verifiedBy: row.verified_by } : {}),
  };
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    techStack: row.tech_stack,
    ...(row.url ? { url: row.url } : {}),
    verified: row.verified,
  };
}

function toCertification(row: CertificationRow): Certification {
  return {
    id: row.id,
    name: row.name,
    // issuer and date are nullable: a CV often names a certification with
    // neither. Omitting the key keeps `Certification` honest instead of
    // inventing an empty string.
    ...(row.issuer ? { issuer: row.issuer } : {}),
    ...(row.date ? { date: row.date } : {}),
    verified: row.verified,
  };
}

function toAssessment(row: AssessmentRow): Assessment {
  return {
    id: row.id,
    // skill_id is nullable in the schema (a skill can be deleted out from
    // under an assessment), but Assessment.skillId is not. "" reads as
    // "unknown skill" and matches the fallback used for the name.
    skillId: row.skill_id ?? "",
    skillName: row.skills?.name ?? row.skill_id ?? "",
    score: row.score,
    maxScore: row.max_score,
    level: toSkillLevel(row.level),
    date: row.date,
  };
}

/**
 * Every education column is nullable — a student has a row from the moment
 * they sign up and does not fill these in until onboarding completes — so a
 * missing value omits the key rather than inventing "" or year 0.
 */
function toEducation(row: StudentRow): Education {
  return {
    ...(row.degree ? { degree: row.degree } : {}),
    ...(row.field ? { field: row.field } : {}),
    ...(row.institution ? { institution: row.institution } : {}),
    ...(row.year ? { year: Number(row.year) } : {}),
    ...(row.gpa === null || row.gpa === undefined ? {} : { gpa: Number(row.gpa) }),
  };
}

function toStudent(row: StudentRow): Student {
  const profile = row.profiles;

  return {
    id: row.id,
    name: profile?.name ?? "",
    slug: profile?.slug ?? "",
    email: profile?.email ?? "",
    ...(profile?.avatar ? { avatar: profile.avatar } : {}),
    education: toEducation(row),
    skills: row.student_skills.map(toSkill),
    projects: row.projects.map(toProject),
    certifications: row.certifications.map(toCertification),
    assessments: row.assessments.map(toAssessment),
    onboardingComplete: row.onboarding_complete,
    ...(row.bio ? { bio: row.bio } : {}),
  };
}

function toCompany(row: CompanyRow): Company {
  return {
    id: row.id,
    name: row.name,
    ...(row.logo ? { logo: row.logo } : {}),
    industry: row.industry,
    size: row.size,
    location: row.location,
  };
}

function toRecruiter(row: RecruiterRow): Recruiter {
  const profile = row.profiles;

  return {
    id: row.id,
    name: profile?.name ?? "",
    slug: profile?.slug ?? "",
    email: profile?.email ?? "",
    companyId: row.company_id ?? "",
    ...(profile?.avatar ? { avatar: profile.avatar } : {}),
  };
}

function toSkillRequirement(row: OpportunitySkillRow): OpportunitySkillRequirement {
  return {
    skillId: row.skill_id,
    skillName: row.skills?.name ?? row.skill_id,
    requiredLevel: toSkillLevel(row.required_level),
    preferred: row.preferred,
  };
}

function toOpportunity(row: OpportunityRow): Opportunity {
  return {
    id: row.id,
    title: row.title,
    // company_id, recruiter_id and deadline are nullable in the schema
    // (both FKs are ON DELETE SET NULL) but non-optional on Opportunity.
    // "" keeps the card rendering; an unresolved companyId simply yields
    // `company: undefined`, which OpportunityCard already handles.
    companyId: row.company_id ?? "",
    domain: row.domain,
    description: row.description,
    // `preferred` on the join row is what splits these two lists.
    requiredSkills: row.opportunity_skills.filter((s) => !s.preferred).map(toSkillRequirement),
    preferredSkills: row.opportunity_skills.filter((s) => s.preferred).map(toSkillRequirement),
    eligibility: row.eligibility,
    location: row.location,
    type: row.type,
    ...(row.duration ? { duration: row.duration } : {}),
    compensation: row.compensation,
    deadline: row.deadline ?? "",
    postedAt: row.posted_at,
    recruiterId: row.recruiter_id ?? "",
    active: row.active,
  };
}

function toStageEntry(row: ApplicationRow["application_stage_history"][number]): ApplicationStageEntry {
  return {
    stage: row.stage,
    timestamp: row.occurred_at,
    ...(row.note ? { note: row.note } : {}),
  };
}

function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    studentId: row.student_id,
    opportunityId: row.opportunity_id,
    currentStage: row.current_stage,
    stageHistory: [...row.application_stage_history]
      .map(toStageEntry)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    appliedAt: row.applied_at,
  };
}

function toLearningPath(row: LearningPathRow, skillIds: string[]): LearningPath {
  return {
    id: row.id,
    title: row.title,
    provider: row.provider,
    url: row.url,
    skillIds,
    duration: row.duration,
    level: row.level,
    rating: Number(row.rating),
  };
}

// ── Skill taxonomy ────────────────────────────────────────────────────

/** The full skill catalog, ordered by market demand. */
export async function getSkillTaxonomy(): Promise<SkillTaxonomyItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, domain, market_demand")
    .order("market_demand", { ascending: false })
    .returns<SkillRow[]>();

  if (error) throw new DataError("the skill catalog", error);
  return data.map(toSkillTaxonomyItem);
}

export async function getSkillTaxonomyItem(
  skillId: string
): Promise<SkillTaxonomyItem | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, domain, market_demand")
    .eq("id", skillId)
    .maybeSingle<SkillRow>();

  if (error) throw new DataError("that skill", error);
  return data ? toSkillTaxonomyItem(data) : undefined;
}

// ── Students ──────────────────────────────────────────────────────────

export async function getStudentBySlug(slug: string): Promise<Student | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_SELECT)
    .eq("profiles.slug", slug)
    .maybeSingle<StudentRow>();

  if (error) throw new DataError("that student profile", error);
  return data ? toStudent(data) : undefined;
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_SELECT)
    .eq("id", id)
    .maybeSingle<StudentRow>();

  if (error) throw new DataError("that student profile", error);
  return data ? toStudent(data) : undefined;
}

/**
 * Every student who has finished onboarding — the recruiter-side talent pool.
 * RLS restricts this to recruiters; a student calling it sees only themselves.
 */
export async function getStudents(): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_SELECT)
    .eq("onboarding_complete", true)
    .returns<StudentRow[]>();

  if (error) throw new DataError("the talent pool", error);
  return data.map(toStudent);
}

/**
 * Specific students by id, regardless of onboarding state.
 *
 * The applicant views resolve their candidates through this rather than
 * through getStudents(): an application is a fact about a student, and
 * filtering the lookup on `onboarding_complete` would silently drop a row
 * from a recruiter's pipeline.
 */
export async function getStudentsByIds(ids: string[]): Promise<Student[]> {
  if (ids.length === 0) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_SELECT)
    .in("id", ids)
    .returns<StudentRow[]>();

  if (error) throw new DataError("those candidates", error);
  return data.map(toStudent);
}

// ── Companies & recruiters ────────────────────────────────────────────

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("id, name, logo, industry, size, location")
    .order("name")
    .returns<CompanyRow[]>();

  if (error) throw new DataError("companies", error);
  return data.map(toCompany);
}

const RECRUITER_SELECT = `
  id, company_id,
  profiles!inner ( id, role, name, slug, email, avatar )
` as const;

export async function getRecruiterBySlug(slug: string): Promise<Recruiter | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiters")
    .select(RECRUITER_SELECT)
    .eq("profiles.slug", slug)
    .maybeSingle<RecruiterRow>();

  if (error) throw new DataError("that recruiter profile", error);
  return data ? toRecruiter(data) : undefined;
}

export async function getRecruiterById(id: string): Promise<Recruiter | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recruiters")
    .select(RECRUITER_SELECT)
    .eq("id", id)
    .maybeSingle<RecruiterRow>();

  if (error) throw new DataError("that recruiter profile", error);
  return data ? toRecruiter(data) : undefined;
}

// ── Opportunities ─────────────────────────────────────────────────────

/** All active postings, newest first. */
export async function getOpportunities(): Promise<Opportunity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("opportunities")
    .select(OPPORTUNITY_SELECT)
    .eq("active", true)
    .order("posted_at", { ascending: false })
    .returns<OpportunityRow[]>();

  if (error) throw new DataError("opportunities", error);
  return data.map(toOpportunity);
}

/**
 * Active postings with their company joined in.
 *
 * OpportunityCard needs the company name while rendering. Joining it here
 * keeps that lookup synchronous at the call site and avoids one query per
 * card, which is why getCompanyById no longer exists.
 */
export async function getOpportunitiesWithCompany(): Promise<
  { opportunity: Opportunity; company: Company | undefined }[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("opportunities")
    .select(OPPORTUNITY_WITH_COMPANY_SELECT)
    .eq("active", true)
    .order("posted_at", { ascending: false })
    .returns<OpportunityWithCompanyRow[]>();

  if (error) throw new DataError("opportunities", error);

  return data.map((row) => ({
    opportunity: toOpportunity(row),
    company: row.companies ? toCompany(row.companies) : undefined,
  }));
}

export async function getOpportunityById(id: string): Promise<Opportunity | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("opportunities")
    .select(OPPORTUNITY_SELECT)
    .eq("id", id)
    .maybeSingle<OpportunityRow>();

  if (error) throw new DataError("that opportunity", error);
  return data ? toOpportunity(data) : undefined;
}

/**
 * Specific opportunities with their company, active or not.
 *
 * Application history outlives the posting it points at, so the tracking
 * views cannot use getOpportunitiesWithCompany — that one filters on
 * `active` and would render an applied-to role that has since closed as a
 * blank card.
 */
export async function getOpportunitiesByIds(
  ids: string[]
): Promise<{ opportunity: Opportunity; company: Company | undefined }[]> {
  if (ids.length === 0) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("opportunities")
    .select(OPPORTUNITY_WITH_COMPANY_SELECT)
    .in("id", ids)
    .returns<OpportunityWithCompanyRow[]>();

  if (error) throw new DataError("those opportunities", error);

  return data.map((row) => ({
    opportunity: toOpportunity(row),
    company: row.companies ? toCompany(row.companies) : undefined,
  }));
}

export async function getOpportunitiesByRecruiterId(
  recruiterId: string
): Promise<Opportunity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("opportunities")
    .select(OPPORTUNITY_SELECT)
    .eq("recruiter_id", recruiterId)
    .order("posted_at", { ascending: false })
    .returns<OpportunityRow[]>();

  if (error) throw new DataError("your opportunities", error);
  return data.map(toOpportunity);
}

// ── Applications ──────────────────────────────────────────────────────

export async function getApplicationsByStudentId(
  studentId: string
): Promise<Application[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("student_id", studentId)
    .order("applied_at", { ascending: false })
    .returns<ApplicationRow[]>();

  if (error) throw new DataError("your applications", error);
  return data.map(toApplication);
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("id", id)
    .maybeSingle<ApplicationRow>();

  if (error) throw new DataError("that application", error);
  return data ? toApplication(data) : undefined;
}

export async function getApplicationsByOpportunityId(
  opportunityId: string
): Promise<Application[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("opportunity_id", opportunityId)
    .order("applied_at", { ascending: false })
    .returns<ApplicationRow[]>();

  if (error) throw new DataError("applications for this role", error);
  return data.map(toApplication);
}

/** Every application across a set of opportunities — the recruiter pipeline. */
export async function getApplicationsByOpportunityIds(
  opportunityIds: string[]
): Promise<Application[]> {
  if (opportunityIds.length === 0) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .in("opportunity_id", opportunityIds)
    .order("applied_at", { ascending: false })
    .returns<ApplicationRow[]>();

  if (error) throw new DataError("your applicants", error);
  return data.map(toApplication);
}

// ── Application writes ────────────────────────────────────────────────
// Both of these call a SECURITY DEFINER function rather than writing the
// tables directly. That is the whole mechanism for stage history: the
// function updates the application and appends exactly one timeline entry in
// the same transaction, and the client has no INSERT grant on
// application_stage_history at all — so a duplicate or forged entry is not
// something the UI can produce even by accident.

/** Thrown when a write is rejected by the database's own rules. */
export class WriteError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "WriteError";
    this.cause = cause;
  }
}

interface ApplicationRpcRow {
  id: string;
  student_id: string;
  opportunity_id: string;
  current_stage: ApplicationStage;
  applied_at: string;
}

/**
 * Maps the Postgres error codes the two functions raise onto messages that
 * can be shown to a user as-is.
 */
function toWriteError(
  error: { code?: string; message?: string } | null,
  fallback: string
): WriteError {
  const code = error?.code;

  if (code === "23505") {
    return new WriteError("You have already applied to this role.", error);
  }
  if (code === "42501") {
    return new WriteError(
      error?.message ?? "You are not allowed to do that.",
      error
    );
  }
  if (code === "P0002") {
    return new WriteError(error?.message ?? "That record no longer exists.", error);
  }
  if (code === "22023") {
    return new WriteError(error?.message ?? "That change is not allowed.", error);
  }
  return new WriteError(fallback, error);
}

/** Submits an application for the signed-in student. */
export async function applyToOpportunity(opportunityId: string): Promise<Application> {
  const supabase = createClient();
  const { data, error } = await supabase
    .rpc("apply_to_opportunity", { p_opportunity_id: opportunityId });

  const appData = data as unknown as ApplicationRpcRow | null;

  if (error || !appData) {
    throw toWriteError(error, "Could not submit your application. Please try again.");
  }

  return {
    id: appData.id,
    studentId: appData.student_id,
    opportunityId: appData.opportunity_id,
    currentStage: appData.current_stage,
    stageHistory: [{ stage: appData.current_stage, timestamp: appData.applied_at }],
    appliedAt: appData.applied_at,
  };
}

/**
 * Moves an application to a new stage.
 *
 * Authorisation lives in the database: the owning recruiter may set any
 * stage, the applying student may only withdraw, and a closed application
 * refuses every transition.
 */
export async function setApplicationStage(
  applicationId: string,
  stage: ApplicationStage,
  note?: string
): Promise<{ currentStage: ApplicationStage }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .rpc("set_application_stage", {
      p_application_id: applicationId,
      p_stage: stage,
      p_note: note?.trim() ? note.trim() : null,
    });

  const appData = data as unknown as ApplicationRpcRow | null;

  if (error || !appData) {
    throw toWriteError(error, "Could not update the application. Please try again.");
  }

  return { currentStage: appData.current_stage };
}

// ── Learning paths ────────────────────────────────────────────────────

const LEARNING_PATH_SELECT =
  "id, title, provider, url, duration, level, rating, learning_path_skills ( skill_id )" as const;

type LearningPathWithSkillsRow = LearningPathRow & {
  learning_path_skills: { skill_id: string }[];
};

/** The whole learning-path catalog, best-rated first. */
export async function getLearningPaths(): Promise<LearningPath[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("learning_paths")
    .select(LEARNING_PATH_SELECT)
    .order("rating", { ascending: false })
    .returns<LearningPathWithSkillsRow[]>();

  if (error) throw new DataError("learning paths", error);

  return data.map((row) =>
    toLearningPath(
      row,
      row.learning_path_skills.map((s) => s.skill_id)
    )
  );
}

/**
 * Learning paths covering any of `skillIds`.
 *
 * Two queries rather than one: the first finds the matching path ids, the
 * second loads those paths with their *complete* skill list, so a path that
 * teaches three skills still reports all three even when only one matched.
 */
export async function getLearningPathsForSkills(
  skillIds: string[]
): Promise<LearningPath[]> {
  if (skillIds.length === 0) return [];

  const supabase = createClient();

  const { data: matches, error: matchError } = await supabase
    .from("learning_path_skills")
    .select("learning_path_id")
    .in("skill_id", skillIds)
    .returns<{ learning_path_id: string }[]>();

  if (matchError) throw new DataError("learning paths", matchError);

  const pathIds = [...new Set(matches.map((m) => m.learning_path_id))];
  if (pathIds.length === 0) return [];

  const { data: paths, error: pathError } = await supabase
    .from("learning_paths")
    .select(LEARNING_PATH_SELECT)
    .in("id", pathIds)
    .order("rating", { ascending: false })
    .returns<LearningPathWithSkillsRow[]>();

  if (pathError) throw new DataError("learning paths", pathError);

  return paths.map((row) =>
    toLearningPath(
      row,
      row.learning_path_skills.map((s) => s.skill_id)
    )
  );
}

// ── Academician Data Access ──────────────────────────────────────────

const DEMO_ACADEMICIAN: Academician = {
  id: "demo-academician-id",
  name: "Dr. Ananya Sharma",
  slug: "ananya-sharma",
  email: "demo.academician@nextgig.dev",
  avatar: undefined,
  profile: {
    designation: "Associate Professor & Research Lead",
    department: "Computer Science & Engineering",
    institution: "Indian Institute of Information Technology",
    researchAreas: [
      "Explainable AI",
      "Curriculum Engineering",
      "Educational Data Mining",
      "Cloud Architectures",
    ],
    experienceYears: 8,
  },
  skills: [
    {
      id: "ai-ml",
      name: "AI / Machine Learning",
      domain: "data-ai",
      level: 5,
      verification: "industry-verified",
      verifiedAt: "2026-08-15",
      verifiedBy: "IEEE Computer Society",
    },
    {
      id: "teaching",
      name: "Teaching & Curriculum",
      domain: "general",
      level: 4,
      verification: "industry-verified",
      verifiedAt: "2026-06-20",
    },
    {
      id: "research",
      name: "Research & Publication",
      domain: "data-ai",
      level: 4,
      verification: "industry-verified",
      verifiedAt: "2026-07-10",
    },
    {
      id: "data-analytics",
      name: "Data Analytics",
      domain: "data-ai",
      level: 4,
      verification: "assessed",
    },
    {
      id: "communication",
      name: "Technical Communication",
      domain: "general",
      level: 5,
      verification: "project-verified",
    },
    {
      id: "cloud-aws",
      name: "Cloud / AWS Architecture",
      domain: "cloud",
      level: 3,
      verification: "assessed",
    },
    {
      id: "leadership",
      name: "Academic Leadership",
      domain: "general",
      level: 4,
      verification: "self-declared",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Explainable AI for Education (XAI-Edu)",
      description: "Interpretable student performance prediction and early retention intervention modeling.",
      techStack: ["PyTorch", "SHAP", "FastAPI", "Next.js"],
      url: "https://github.com/ananya-sharma/xai-edu",
      verified: true,
    },
    {
      id: "proj-2",
      title: "Student Learning Analytics Research",
      description: "Multi-modal classroom engagement tracking via edge machine vision and privacy-preserving federated analytics.",
      techStack: ["Python", "OpenCV", "TensorFlow Lite", "GCP"],
      verified: true,
    },
    {
      id: "proj-3",
      title: "Industry-Aligned AI Curriculum Framework",
      description: "Standardized competency rubrics and project blueprints adopted across 14 technical institutions.",
      techStack: ["Curriculum Design", "Skill Frameworks", "Accreditation"],
      verified: true,
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2026-03-15",
      verified: true,
    },
    {
      id: "cert-2",
      name: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      date: "2025-11-20",
      verified: true,
    },
    {
      id: "cert-3",
      name: "Higher Education Teaching Certificate",
      issuer: "Harvard Derek Bok Center",
      date: "2025-08-10",
      verified: true,
    },
    {
      id: "cert-4",
      name: "ACM Senior Member Accreditation",
      issuer: "Association for Computing Machinery",
      date: "2026-01-05",
      verified: true,
    },
  ],
  mentoring: [
    {
      id: "m-1",
      mentorId: "demo-academician-id",
      mentorName: "Dr. Ananya Sharma",
      menteeId: "mentee-1",
      menteeName: "Priya Nair",
      status: "active",
      focus: "Career transition to Applied ML Research",
      startDate: "2026-08-01",
      createdAt: "2026-07-28",
    },
    {
      id: "m-2",
      mentorId: "demo-academician-id",
      mentorName: "Dr. Ananya Sharma",
      menteeId: "mentee-2",
      menteeName: "Rahul Verma",
      status: "active",
      focus: "Research publication & experimentation workflow",
      startDate: "2026-08-10",
      createdAt: "2026-08-05",
    },
    {
      id: "m-3",
      mentorId: "demo-academician-id",
      mentorName: "Dr. Ananya Sharma",
      menteeId: "mentee-3",
      menteeName: "Meera Joshi",
      status: "active",
      focus: "Industry opportunities & tech talks portfolio",
      startDate: "2026-09-01",
      createdAt: "2026-08-25",
    },
    {
      id: "m-4",
      mentorId: "demo-academician-id",
      mentorName: "Dr. Ananya Sharma",
      menteeId: "mentee-4",
      menteeName: "Aarav Patel",
      status: "completed",
      focus: "B.Tech thesis review in Distributed LLMs",
      startDate: "2026-02-01",
      endDate: "2026-06-30",
      createdAt: "2026-01-20",
    },
  ],
  learning: [],
  bio: "Faculty member focused on AI/ML, applied research, curriculum development and industry-aligned learning. Open to research collaborations, faculty opportunities, consultancies, and mentoring aspiring researchers.",
};

const ACADEMIC_OPPORTUNITIES: { opportunity: Opportunity; company: Company }[] = [
  {
    opportunity: {
      id: "opp-acad-1",
      title: "AI/ML Research Fellow & Faculty Lead",
      companyId: "comp-nvidia",
      domain: "data-ai",
      description: "Collaborative research fellowship exploring efficient inference on accelerated architectures and academic curriculum translation.",
      requiredSkills: [
        { skillId: "ai-ml", skillName: "AI / Machine Learning", requiredLevel: 4, preferred: false },
        { skillId: "research", skillName: "Research & Publication", requiredLevel: 4, preferred: false },
      ],
      preferredSkills: [
        { skillId: "cloud-aws", skillName: "Cloud / AWS Architecture", requiredLevel: 3, preferred: true },
      ],
      eligibility: "Faculty / Ph.D. in CS/EE with prior ML publication record.",
      location: "Remote / Hybrid (Bengaluru, IN)",
      type: "contract",
      duration: "6 months",
      compensation: "₹1,80,000 / month grant",
      deadline: "2026-10-15",
      postedAt: "2026-09-01",
      recruiterId: "rec-nvidia",
      active: true,
    },
    company: {
      id: "comp-nvidia",
      name: "NVIDIA Applied Research",
      industry: "Semiconductors & AI",
      size: "Enterprise",
      location: "Santa Clara / Bengaluru",
    },
  },
  {
    opportunity: {
      id: "opp-acad-2",
      title: "AI Teaching & Learning Fellow",
      companyId: "comp-msft",
      domain: "data-ai",
      description: "Shape the next generation of university cloud & AI curricula in collaboration with Microsoft Azure Education.",
      requiredSkills: [
        { skillId: "teaching", skillName: "Teaching & Curriculum", requiredLevel: 4, preferred: false },
        { skillId: "cloud-aws", skillName: "Cloud / AWS Architecture", requiredLevel: 3, preferred: false },
      ],
      preferredSkills: [
        { skillId: "communication", skillName: "Technical Communication", requiredLevel: 4, preferred: true },
      ],
      eligibility: "Engineering faculty actively teaching undergraduate or postgraduate CS.",
      location: "Hybrid (Hyderabad, IN)",
      type: "contract",
      duration: "1 year",
      compensation: "₹2,20,000 / month",
      deadline: "2026-10-30",
      postedAt: "2026-08-20",
      recruiterId: "rec-msft",
      active: true,
    },
    company: {
      id: "comp-msft",
      name: "Microsoft Education Labs",
      industry: "Cloud & Enterprise Software",
      size: "Enterprise",
      location: "Redmond / Hyderabad",
    },
  },
  {
    opportunity: {
      id: "opp-acad-3",
      title: "Applied AI Researcher (Industry Immersion)",
      companyId: "comp-tcs",
      domain: "data-ai",
      description: "Faculty sabbatical and joint research program on Foundation Models in Healthcare and Enterprise Automation.",
      requiredSkills: [
        { skillId: "ai-ml", skillName: "AI / Machine Learning", requiredLevel: 4, preferred: false },
        { skillId: "data-analytics", skillName: "Data Analytics", requiredLevel: 4, preferred: false },
      ],
      preferredSkills: [
        { skillId: "leadership", skillName: "Academic Leadership", requiredLevel: 3, preferred: true },
      ],
      eligibility: "Assistant/Associate Professors with 3+ years research experience.",
      location: "On-site (Pune, IN)",
      type: "contract",
      duration: "6 months",
      compensation: "₹1,50,000 / month honorarium",
      deadline: "2026-11-05",
      postedAt: "2026-09-05",
      recruiterId: "rec-tcs",
      active: true,
    },
    company: {
      id: "comp-tcs",
      name: "TCS Research & Innovation",
      industry: "IT & Research Consulting",
      size: "Enterprise",
      location: "Pune, India",
    },
  },
  {
    opportunity: {
      id: "opp-acad-4",
      title: "Cloud Solutions Academic Consultant",
      companyId: "comp-aws",
      domain: "cloud",
      description: "Design lab architectures, evaluate capstone projects, and mentor university cloud accelerators.",
      requiredSkills: [
        { skillId: "cloud-aws", skillName: "Cloud / AWS Architecture", requiredLevel: 3, preferred: false },
        { skillId: "communication", skillName: "Technical Communication", requiredLevel: 4, preferred: false },
      ],
      preferredSkills: [
        { skillId: "teaching", skillName: "Teaching & Curriculum", requiredLevel: 3, preferred: true },
      ],
      eligibility: "Open to faculty with cloud certifications.",
      location: "Remote",
      type: "contract",
      duration: "3 months",
      compensation: "₹1,20,000 / month",
      deadline: "2026-09-30",
      postedAt: "2026-08-15",
      recruiterId: "rec-aws",
      active: true,
    },
    company: {
      id: "comp-aws",
      name: "AWS Academy",
      industry: "Cloud Infrastructure",
      size: "Enterprise",
      location: "Seattle / Delhi",
    },
  },
];

export async function getAcademicianBySlug(slug: string): Promise<Academician | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, name, slug, email, avatar")
      .eq("slug", slug)
      .maybeSingle<ProfileRow>();

    if (error || !data) {
      // Fall back to DEMO_ACADEMICIAN if slug matches or if database query returns null
      if (slug === "ananya-sharma" || slug === "demo-academician" || slug === "academician") {
        return DEMO_ACADEMICIAN;
      }
      return undefined;
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      email: data.email,
      avatar: data.avatar ?? undefined,
      profile: DEMO_ACADEMICIAN.profile,
      skills: DEMO_ACADEMICIAN.skills,
      projects: DEMO_ACADEMICIAN.projects,
      certifications: DEMO_ACADEMICIAN.certifications,
      mentoring: DEMO_ACADEMICIAN.mentoring,
      learning: DEMO_ACADEMICIAN.learning,
      bio: DEMO_ACADEMICIAN.bio,
    };
  } catch {
    // If Supabase call fails or is disconnected, return demo profile
    return DEMO_ACADEMICIAN;
  }
}

export async function getAcademicianOpportunities(): Promise<
  { opportunity: Opportunity; company: Company | undefined }[]
> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select(OPPORTUNITY_WITH_COMPANY_SELECT)
      .eq("active", true)
      .returns<OpportunityWithCompanyRow[]>();

    if (error || !data || data.length === 0) {
      return ACADEMIC_OPPORTUNITIES;
    }

    return [
      ...ACADEMIC_OPPORTUNITIES,
      ...data.map((row) => ({
        opportunity: toOpportunity(row),
        company: row.companies ? toCompany(row.companies) : undefined,
      })),
    ];
  } catch {
    return ACADEMIC_OPPORTUNITIES;
  }
}

export async function getMentorshipsByAcademicianId(
  _academicianId: string
): Promise<Mentorship[]> {
  return DEMO_ACADEMICIAN.mentoring;
}

