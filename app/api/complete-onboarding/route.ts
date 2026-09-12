import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeDate, normalizeOptionalText, nowIso } from "@/lib/normalize";
import type { SkillLevel } from "@/lib/types";

export const runtime = "nodejs";

interface ParsedSkill {
  id?: unknown;
  name?: unknown;
  level?: unknown;
}

interface ParsedProject {
  title?: unknown;
  description?: unknown;
  techStack?: unknown;
  url?: unknown;
}

interface ParsedCertification {
  name?: unknown;
  issuer?: unknown;
  date?: unknown;
}

interface SkillGradePayload {
  skillId: string;
  assessedLevel: SkillLevel; // <-- changed from number to SkillLevel
  score: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asTrimmedString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function asFiniteNumber(value: unknown): number | null {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
}

function toSkillLevel(value: unknown): SkillLevel {
  const parsed = asFiniteNumber(value);
  const rounded = Math.round(parsed ?? 1);
  return Math.min(5, Math.max(1, rounded)) as SkillLevel;
}

function toGraduationYear(value: unknown): number | null {
  const parsed = asFiniteNumber(value);
  if (parsed === null) return null;
  const year = Math.round(parsed);
  return year >= 1950 && year <= 2100 ? year : null;
}

function toGpa(value: unknown): number | null {
  const parsed = asFiniteNumber(value);
  if (parsed === null || parsed < 0) return null;
  return Math.min(99.99, Math.round(parsed * 100) / 100);
}

function toStringArray(value: unknown): string[] {
  return asArray(value)
    .map((entry) => asTrimmedString(entry))
    .filter((entry): entry is string => entry !== null);
}

function failure(step: string, error: unknown, message: string) {
  const details =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string"
      ? (error as { message: string }).message
      : typeof error === "object" && error !== null
      ? JSON.stringify(error)
      : String(error);
  console.error(`[complete-onboarding] ${step} failed`, { details, error });
  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV === "development" ? { details } : {}),
    },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  }

  const confirmedProfile = body.confirmedProfile;
  if (!isRecord(confirmedProfile)) {
    return NextResponse.json(
      { error: "confirmedProfile is required." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to finish onboarding." },
      { status: 401 }
    );
  }

  const studentId = user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", studentId)
    .maybeSingle<{ id: string; role: "student" | "recruiter" }>();

  if (profileError) {
    return failure("profile lookup", profileError, "Could not load your account.");
  }
  if (!profile) {
    return NextResponse.json(
      { error: "Your account has no profile yet. Please sign out and back in." },
      { status: 409 }
    );
  }
  if (profile.role !== "student") {
    return NextResponse.json(
      { error: "Only student accounts can complete student onboarding." },
      { status: 403 }
    );
  }

  const education = isRecord(confirmedProfile.education) ? confirmedProfile.education : {};

  const studentPayload = {
    id: studentId,
    degree: asTrimmedString(education.degree) ?? "Not specified",
    field: asTrimmedString(education.field) ?? "General",
    institution: asTrimmedString(education.institution) ?? "Not specified",
    year: toGraduationYear(education.year) ?? new Date().getFullYear(),
    gpa: toGpa(education.gpa),
    bio: asTrimmedString(confirmedProfile.bio),
    onboarding_complete: true,
  };

  const { data: savedStudent, error: studentError } = await supabase
    .from("students")
    .upsert(studentPayload, { onConflict: "id" })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (studentError) {
    return failure("students upsert", studentError, "Could not save your student profile.");
  }
  if (!savedStudent) {
    return failure(
      "students upsert",
      new Error("upsert affected zero rows"),
      "Could not save your student profile."
    );
  }

  const displayName = asTrimmedString(confirmedProfile.name);
  if (displayName) {
    const { error: nameError } = await supabase
      .from("profiles")
      .update({ name: displayName })
      .eq("id", studentId);

    if (nameError) {
      console.error("[complete-onboarding] profile name update failed", nameError);
    }
  }

  const claimedSkills = asArray(confirmedProfile.skills)
    .filter(isRecord)
    .map((skill: ParsedSkill) => ({
      id: asTrimmedString(skill.id),
      level: toSkillLevel(skill.level),
    }))
    .filter((skill): skill is { id: string; level: SkillLevel } => skill.id !== null);

  const assessmentResult = isRecord(body.assessmentResult) ? body.assessmentResult : {};
  const skillGrades = asArray(assessmentResult.skillGrades)
    .filter(isRecord)
    .map((grade) => {
      const skillId = asTrimmedString(grade.skillId);
      if (skillId === null) return null;
      return {
        skillId,
        assessedLevel: toSkillLevel(grade.assessedLevel),
        score: Math.min(100, Math.max(0, Math.round(asFiniteNumber(grade.score) ?? 0))),
      } satisfies SkillGradePayload;
    })
    .filter((grade): grade is SkillGradePayload => grade !== null);

  const gradeBySkillId = new Map(skillGrades.map((grade) => [grade.skillId, grade]));
  const claimedLevelById = new Map(claimedSkills.map((skill) => [skill.id, skill.level]));

  const candidateIds = [
    ...new Set([...claimedLevelById.keys(), ...gradeBySkillId.keys()]),
  ];

  const skippedSkills: string[] = [];

  if (candidateIds.length > 0) {
    const { data: knownSkills, error: skillLookupError } = await supabase
      .from("skills")
      .select("id")
      .in("id", candidateIds)
      .returns<{ id: string }[]>();

    if (skillLookupError) {
      return failure("skill lookup", skillLookupError, "Could not save your skills.");
    }

    const knownIds = new Set(knownSkills.map((skill) => skill.id));
    skippedSkills.push(...candidateIds.filter((id) => !knownIds.has(id)));

    const skillRows = candidateIds
      .filter((id) => knownIds.has(id))
      .map((id) => {
        const grade = gradeBySkillId.get(id);
        const claimedLevel = claimedLevelById.get(id) ?? (1 as SkillLevel);
        return {
          student_id: studentId,
          skill_id: id,
          level: grade ? grade.assessedLevel : claimedLevel,
          verification: grade ? ("assessed" as const) : ("self-declared" as const),
          verified_at: grade ? nowIso() : null,
          verified_by: grade ? "NextGig AI Assessment" : null,
        };
      });

    if (skillRows.length > 0) {
      const { error: skillsError } = await supabase
        .from("student_skills")
        .upsert(skillRows, { onConflict: "student_id,skill_id" });

      if (skillsError) {
        return failure("student_skills upsert", skillsError, "Could not save your skills.");
      }
    }

    const assessmentRows = [...gradeBySkillId.values()]
      .filter((grade) => knownIds.has(grade.skillId))
      .map((grade) => ({
        student_id: studentId,
        skill_id: grade.skillId,
        score: grade.score,
        max_score: 100,
        level: grade.assessedLevel,
        date: nowIso(),
      }));

    if (assessmentRows.length > 0) {
      const { error: assessmentsError } = await supabase
        .from("assessments")
        .insert(assessmentRows);

      if (assessmentsError) {
        return failure(
          "assessments insert",
          assessmentsError,
          "Could not save your assessment results."
        );
      }
    }
  }

  const projects = asArray(confirmedProfile.projects)
    .filter(isRecord)
    .map((project: ParsedProject) => ({
      title: asTrimmedString(project.title),
      description: asTrimmedString(project.description) ?? "",
      techStack: toStringArray(project.techStack),
      url: asTrimmedString(project.url),
    }))
    .filter((project) => project.title !== null);

  const { error: projectDeleteError } = await supabase
    .from("projects")
    .delete()
    .eq("student_id", studentId);

  if (projectDeleteError) {
    return failure("project cleanup", projectDeleteError, "Could not save your projects.");
  }

  if (projects.length > 0) {
    const { error: projectsError } = await supabase.from("projects").insert(
      projects.map((project) => ({
        student_id: studentId,
        title: project.title as string,
        description: project.description,
        tech_stack: project.techStack,
        url: project.url,
        verified: false,
      }))
    );

    if (projectsError) {
      return failure("projects insert", projectsError, "Could not save your projects.");
    }
  }

  const certifications = asArray(confirmedProfile.certifications)
    .filter(isRecord)
    .map((cert: ParsedCertification) => ({
      name: asTrimmedString(cert.name),
      issuer: normalizeOptionalText(cert.issuer),
      date: normalizeDate(cert.date),
    }))
    .filter((cert): cert is { name: string; issuer: string | null; date: string | null } =>
      cert.name !== null
    );

  const { error: certDeleteError } = await supabase
    .from("certifications")
    .delete()
    .eq("student_id", studentId);

  if (certDeleteError) {
    return failure(
      "certification cleanup",
      certDeleteError,
      "Could not save your certifications."
    );
  }

  if (certifications.length > 0) {
    const { error: certsError } = await supabase.from("certifications").insert(
      certifications.map((cert) => ({
        student_id: studentId,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        verified: false,
      }))
    );

    if (certsError) {
      return failure(
        "certifications insert",
        certsError,
        "Could not save your certifications."
      );
    }
  }

  return NextResponse.json({ ok: true, skippedSkills });
}