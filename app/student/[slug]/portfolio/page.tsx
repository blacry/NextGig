import type { ReactNode } from "react";
import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Star,
  Terminal,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";
import { ShareButton } from "./ShareButton";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface RawProfile {
  id: string;
  role: string;
  name: string;
  slug: string;
  email: string;
  avatar: string | null;
}

interface RawSkill {
  name: string;
  domain: string;
}

interface RawStudentSkill {
  skill_id: string;
  level: number;
  verification: string;
  skills: RawSkill | RawSkill[] | null;
}

interface RawProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[] | null;
  url: string | null;
  verified: boolean;
}

interface RawCertification {
  id: string;
  name: string;
  issuer: string | null;
  date: string | null;
  verified: boolean;
}

interface RawAssessment {
  id: string;
  skill_id: string | null;
  score: number;
  max_score: number;
  level: number;
  date: string;
  skills: RawSkill | RawSkill[] | null;
}

interface RawStudent {
  id: string;
  degree: string | null;
  field: string | null;
  institution: string | null;
  year: number | null;
  gpa: number | null;
  bio: string | null;
  onboarding_complete: boolean;

  profiles: RawProfile | RawProfile[];

  student_skills: RawStudentSkill[];

  projects: RawProject[];

  certifications: RawCertification[];

  assessments: RawAssessment[];
}

function getSingle<T>(
  value: T | T[] | null | undefined
): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

async function getPublicPortfolio(
  slug: string
): Promise<RawStudent | null> {
  const supabase = createClient(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data, error } = await supabase
    .from("students")
    .select(`
      id,
      degree,
      field,
      institution,
      year,
      gpa,
      bio,
      onboarding_complete,

      profiles!inner (
        id,
        role,
        name,
        slug,
        email,
        avatar
      ),

      student_skills (
        skill_id,
        level,
        verification,
        skills (
          name,
          domain
        )
      ),

      projects (
        id,
        title,
        description,
        tech_stack,
        url,
        verified
      ),

      certifications (
        id,
        name,
        issuer,
        date,
        verified
      ),

      assessments (
        id,
        skill_id,
        score,
        max_score,
        level,
        date,
        skills (
          name,
          domain
        )
      )
    `)
    .eq("profiles.slug", slug)
    .eq("onboarding_complete", true)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load public portfolio:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return data as unknown as RawStudent;
}

export async function generateMetadata({
  params,
}: PageProps) {
  const { slug } = await params;

  const student = await getPublicPortfolio(slug);

  const profile = getSingle(student?.profiles);

  if (!profile) {
    return {
      title: "Digital Passport | NextGig",
    };
  }

  return {
    title: `${profile.name} | NextGig Digital Passport`,
    description: `Verified digital professional passport for ${profile.name}.`,
  };
}

export default async function PublicPortfolioPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const student = await getPublicPortfolio(slug);

  if (!student) {
    return <NotFound />;
  }

  const profile = getSingle(student.profiles);

  if (!profile || profile.role !== "student") {
    return <NotFound />;
  }

  const skills = student.student_skills ?? [];
  const projects = student.projects ?? [];
  const certifications =
    student.certifications ?? [];
  const assessments =
    student.assessments ?? [];

  const verifiedSkills = skills.filter(
    (skill) =>
      skill.verification !== "self-declared"
  );

  const skillIndex =
    skills.length > 0
      ? Math.round(
          (skills.reduce(
            (total, skill) =>
              total + Number(skill.level || 0),
            0
          ) /
            skills.length /
            5) *
            100
        )
      : 0;

  const verificationPercentage =
    skills.length > 0
      ? Math.round(
          (verifiedSkills.length /
            skills.length) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07090d] px-4 py-8 text-white sm:px-6 sm:py-12">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--ng-primary)]/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {/* BRAND */}

        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ng-primary)]">
              <span className="text-sm font-bold text-white">
                N
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold">
                NextGig
              </p>

              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Skill Intelligence Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[9px] font-medium tracking-wide text-emerald-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              VERIFIED DIGITAL IDENTITY
            </div>

            <ShareButton
              slug={slug}
              title={`${profile.name}'s Digital Passport`}
              description={`Verified digital professional passport for ${profile.name} on the NextGig Skill Intelligence Network.`}
            />
          </div>
        </header>

        {/* MAIN PASSPORT */}

        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#10141b] shadow-2xl shadow-black/40">
          {/* PASSPORT HEADER */}

          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30">
                  Digital Passport
                </p>

                <h1 className="mt-1 text-lg font-semibold tracking-tight">
                  PROFESSIONAL IDENTITY
                </h1>
              </div>

              <div className="text-right">
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Passport No.
                </p>

                <p className="mt-1 font-mono text-[10px] text-white/60">
                  NG-
                  {student.id
                    .slice(0, 8)
                    .toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* IDENTITY */}

          <div className="grid lg:grid-cols-[220px_1fr]">
            {/* PHOTO */}

            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <div className="relative mx-auto w-full max-w-[175px]">
                <div className="aspect-[4/5] overflow-hidden rounded-xl border border-white/15 bg-white/5">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={`${profile.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-bold text-white/20">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>

                {/* VERIFIED SEAL */}

                <div className="absolute -bottom-5 -right-5 flex h-16 w-16 rotate-6 items-center justify-center rounded-full border border-emerald-400/40 bg-[#10141b] shadow-xl">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full border border-dashed border-emerald-400/50">
                    <BadgeCheck className="h-5 w-5 text-emerald-400" />

                    <span className="mt-0.5 text-[6px] font-bold tracking-[0.15em] text-emerald-400">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-9 text-center">
                <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Identity Status
                </p>

                <p className="mt-1 text-[11px] font-semibold tracking-wider text-emerald-400">
                  VERIFIED
                </p>
              </div>
            </div>

            {/* PERSONAL DETAILS */}

            <div className="p-6 sm:p-8">
              <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                <PassportField
                  label="Full Name"
                  value={profile.name}
                />

                <PassportField
                  label="Professional ID"
                  value={profile.slug}
                  mono
                />

                <PassportField
                  label="Degree"
                  value={
                    student.degree ||
                    "Not specified"
                  }
                />

                <PassportField
                  label="Field"
                  value={
                    student.field ||
                    "Not specified"
                  }
                />

                <PassportField
                  label="Institution"
                  value={
                    student.institution ||
                    "Not specified"
                  }
                />

                <PassportField
                  label="Graduation"
                  value={
                    student.year
                      ? String(student.year)
                      : "Not specified"
                  }
                />
              </div>

              {/* BIO */}

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
                  Professional Summary
                </p>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
                  {student.bio ||
                    "Verified professional profile on the NextGig Skill Intelligence Network."}
                </p>
              </div>

              {/* STATUS */}

              <div className="mt-7 flex flex-wrap gap-2">
                <StatusChip
                  icon={
                    <ShieldCheck className="h-3.5 w-3.5" />
                  }
                  text="Identity Verified"
                />

                <StatusChip
                  icon={
                    <BadgeCheck className="h-3.5 w-3.5" />
                  }
                  text={`${verifiedSkills.length} Skills Verified`}
                />

                <StatusChip
                  icon={
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  }
                  text="Onboarding Complete"
                />
              </div>
            </div>
          </div>

          {/* SECURITY STRIP */}

          <div className="border-y border-white/10 bg-black/20 px-6 py-3 sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-mono text-[8px] tracking-[0.2em] text-white/20">
                NEXTGIG // SKILL INTELLIGENCE // VERIFIED
              </span>

              <span className="font-mono text-[8px] tracking-[0.15em] text-white/20">
                ID/
                {student.id
                  .slice(0, 12)
                  .toUpperCase()}
              </span>
            </div>
          </div>

          {/* ================================================== */}
          {/* SECTION 01 — SKILL PASSPORT                       */}
          {/* ================================================== */}

          <div className="p-6 sm:p-8">
            <SectionHeader
              number="01"
              title="Skill Passport"
              icon={
                <Terminal className="h-5 w-5" />
              }
              right={
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {skillIndex}
                  </p>

                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                    Skill Index
                  </p>
                </div>
              }
            />

            {skills.length === 0 ? (
              <EmptyState text="No skills recorded." />
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => {
                  const skillInfo = getSingle(
                    skill.skills
                  );

                  return (
                    <div
                      key={skill.skill_id}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-[var(--ng-primary)]/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {skillInfo?.name ||
                              skill.skill_id}
                          </h3>

                          <p className="mt-1 text-[9px] capitalize text-white/30">
                            {formatDomain(
                              skillInfo?.domain ||
                                "general"
                            )}
                          </p>
                        </div>

                        {skill.verification !==
                          "self-declared" && (
                          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                        )}
                      </div>

                      <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map(
                          (point) => (
                            <div
                              key={point}
                              className={`h-1.5 flex-1 rounded-full ${
                                point <=
                                Number(
                                  skill.level
                                )
                                  ? "bg-[var(--ng-primary)]"
                                  : "bg-white/10"
                              }`}
                            />
                          )
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[8px] uppercase tracking-wider text-white/25">
                          Level{" "}
                          {Number(
                            skill.level
                          )}
                        </span>

                        <span className="text-[8px] text-white/25">
                          {formatVerification(
                            skill.verification
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================== */}
        {/* QUICK STATS                                            */}
        {/* ==================================================== */}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PassportStat
            value={String(skills.length)}
            label="Skills"
          />

          <PassportStat
            value={`${verificationPercentage}%`}
            label="Verified"
          />

          <PassportStat
            value={String(projects.length)}
            label="Projects"
          />

          <PassportStat
            value={String(
              certifications.length
            )}
            label="Credentials"
          />
        </div>

        {/* ==================================================== */}
        {/* EDUCATION + CREDENTIALS                               */}
        {/* ==================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* EDUCATION */}

          <PassportSection
            number="02"
            title="Education"
            icon={
              <GraduationCap className="h-5 w-5" />
            }
          >
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--ng-primary)]" />

              <div className="absolute bottom-0 left-[4px] top-4 w-px bg-white/10" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">
                    {student.degree ||
                      "Academic Qualification"}
                  </h3>

                  <p className="mt-1 text-xs text-[var(--ng-primary)]">
                    {student.field ||
                      "Field not specified"}
                  </p>

                  <p className="mt-2 text-xs text-white/35">
                    {student.institution ||
                      "Institution not specified"}
                  </p>
                </div>

                {student.year && (
                  <span className="shrink-0 font-mono text-[9px] text-white/25">
                    {student.year}
                  </span>
                )}
              </div>

              {student.gpa !== null &&
                student.gpa !== undefined && (
                  <div className="mt-5 inline-flex rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2">
                    <span className="text-sm font-bold">
                      {student.gpa}
                    </span>

                    <span className="ml-1 text-[10px] text-white/30">
                      GPA
                    </span>
                  </div>
                )}
            </div>
          </PassportSection>

          {/* CREDENTIALS */}

          <PassportSection
            number="03"
            title="Credentials"
            icon={
              <Award className="h-5 w-5" />
            }
          >
            {certifications.length === 0 ? (
              <EmptyState text="No credentials recorded." />
            ) : (
              <div className="space-y-3">
                {certifications.map(
                  (certification) => (
                    <div
                      key={certification.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--ng-primary)]/10 text-[var(--ng-primary)]">
                        <Award className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {certification.name}
                        </p>

                        <p className="mt-1 truncate text-[9px] text-white/30">
                          {certification.issuer ||
                            "Issuer not specified"}
                        </p>
                      </div>

                      {certification.verified && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </PassportSection>
        </div>

        {/* ==================================================== */}
        {/* PROJECTS                                               */}
        {/* ==================================================== */}

        <PassportSection
          number="04"
          title="Professional Work"
          icon={
            <BriefcaseBusiness className="h-5 w-5" />
          }
          className="mt-6"
        >
          {projects.length === 0 ? (
            <EmptyState text="No projects recorded." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-[var(--ng-primary)]/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {project.title}
                        </h3>

                        {project.verified && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        )}
                      </div>
                    </div>

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${project.title}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:bg-white/5 hover:text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/45">
                    {project.description ||
                      "No project description provided."}
                  </p>

                  {project.tech_stack &&
                    project.tech_stack.length >
                      0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tech_stack.map(
                          (technology) => (
                            <span
                              key={technology}
                              className="rounded-md border border-white/10 px-2 py-1 text-[9px] text-white/35"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    )}
                </article>
              ))}
            </div>
          )}
        </PassportSection>

        {/* ==================================================== */}
        {/* ASSESSMENTS                                            */}
        {/* ==================================================== */}

        <PassportSection
          number="05"
          title="Assessment Record"
          icon={
            <Star className="h-5 w-5" />
          }
          className="mt-6"
        >
          {assessments.length === 0 ? (
            <EmptyState text="No assessments completed." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assessments.map(
                (assessment) => {
                  const assessmentSkill =
                    getSingle(
                      assessment.skills
                    );

                  const percentage =
                    Number(
                      assessment.max_score
                    ) > 0
                      ? Math.round(
                          (Number(
                            assessment.score
                          ) /
                            Number(
                              assessment.max_score
                            )) *
                            100
                        )
                      : 0;

                  const safePercentage =
                    Math.max(
                      0,
                      Math.min(
                        100,
                        percentage
                      )
                    );

                  return (
                    <div
                      key={assessment.id}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {assessmentSkill
                              ?.name ||
                              assessment.skill_id ||
                              "Assessment"}
                          </p>

                          <p className="mt-1 text-[9px] text-white/30">
                            Level{" "}
                            {Number(
                              assessment.level
                            )}
                          </p>
                        </div>

                        <p className="text-xl font-bold text-[var(--ng-primary)]">
                          {safePercentage}%
                        </p>
                      </div>

                      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[var(--ng-primary)]"
                          style={{
                            width: `${safePercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-[8px] text-white/20">
                        {assessment.score} /{" "}
                        {assessment.max_score}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </PassportSection>

        {/* FOOTER */}

        <footer className="mt-8 border-t border-white/10 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />

              <p className="text-[10px] text-white/30">
                Verified through the NextGig
                Skill Intelligence Network.
              </p>
            </div>

            <p className="font-mono text-[9px] tracking-[0.15em] text-white/20">
              NG-ID/
              {student.id
                .slice(0, 12)
                .toUpperCase()}
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* ============================================================= */
/* SMALL COMPONENTS                                               */
/* ============================================================= */

function PassportField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] uppercase tracking-[0.3em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm font-medium text-white/80 ${
          mono
            ? "font-mono text-[10px]"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusChip({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-[9px] text-emerald-400">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function PassportStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#10141b] px-4 py-5">
      <p className="text-2xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  icon,
  right,
}: {
  number: string;
  title: string;
  icon: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ng-primary)]/10 text-[var(--ng-primary)]">
          {icon}
        </div>

        <div>
          <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--ng-primary)]">
            Section {number}
          </p>

          <h2 className="mt-0.5 text-lg font-semibold">
            {title}
          </h2>
        </div>
      </div>

      {right}
    </div>
  );
}

function PassportSection({
  number,
  title,
  icon,
  children,
  className = "",
}: {
  number: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-[#10141b] p-6 sm:p-7 ${className}`}
    >
      <SectionHeader
        number={number}
        title={title}
        icon={icon}
      />

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-9 text-center">
      <p className="text-xs text-white/25">
        {text}
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-6 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <ShieldCheck className="h-7 w-7 text-white/30" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold">
          Digital passport not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/40">
          This passport does not exist or the
          student has not completed verification.
        </p>

        <p className="mt-6 text-[9px] uppercase tracking-[0.25em] text-white/20">
          NextGig · Skill Intelligence Network
        </p>
      </div>
    </main>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map(
      (part) => part.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDomain(domain: string) {
  return domain
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatVerification(
  verification: string
) {
  return verification
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}