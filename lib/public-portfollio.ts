import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

export interface PublicPortfolio {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  email?: string;

  education: {
    degree?: string;
    field?: string;
    institution?: string;
    year?: number;
    gpa?: number;
  };

  bio?: string;

  skills: {
    id: string;
    name: string;
    domain: string;
    level: number;
    verification: string;
  }[];

  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    url?: string;
    verified: boolean;
  }[];

  certifications: {
    id: string;
    name: string;
    issuer?: string;
    date?: string;
    verified: boolean;
  }[];

  assessments: {
    id: string;
    skillName: string;
    score: number;
    maxScore: number;
    level: number;
    date: string;
  }[];

  verified: boolean;
}

export async function getPublicPortfolio(
  slug: string
): Promise<PublicPortfolio | null> {
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
        verified_at,
        verified_by,

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
          name
        )
      )
    `)
    .eq("profiles.slug", slug)
    .eq("onboarding_complete", true)
    .maybeSingle();

  if (error) {
    console.error("[Public Portfolio]", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const profile = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles;

  if (!profile || profile.role !== "student") {
    return null;
  }

  const studentSkills = Array.isArray(data.student_skills)
    ? data.student_skills
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects
    : [];

  const certifications = Array.isArray(data.certifications)
    ? data.certifications
    : [];

  const assessments = Array.isArray(data.assessments)
    ? data.assessments
    : [];

  return {
    id: data.id,
    name: profile.name,
    slug: profile.slug,
    ...(profile.avatar ? { avatar: profile.avatar } : {}),
    ...(profile.email ? { email: profile.email } : {}),

    education: {
      ...(data.degree ? { degree: data.degree } : {}),
      ...(data.field ? { field: data.field } : {}),
      ...(data.institution
        ? { institution: data.institution }
        : {}),
      ...(data.year
        ? { year: Number(data.year) }
        : {}),
      ...(data.gpa !== null && data.gpa !== undefined
        ? { gpa: Number(data.gpa) }
        : {}),
    },

    ...(data.bio ? { bio: data.bio } : {}),

    skills: studentSkills.map((skill: any) => ({
      id: skill.skill_id,
      name: skill.skills?.name ?? skill.skill_id,
      domain: skill.skills?.domain ?? "general",
      level: Number(skill.level),
      verification: skill.verification,
    })),

    projects: projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      techStack: project.tech_stack ?? [],
      ...(project.url ? { url: project.url } : {}),
      verified: Boolean(project.verified),
    })),

    certifications: certifications.map((certification: any) => ({
      id: certification.id,
      name: certification.name,
      ...(certification.issuer
        ? { issuer: certification.issuer }
        : {}),
      ...(certification.date
        ? { date: certification.date }
        : {}),
      verified: Boolean(certification.verified),
    })),

    assessments: assessments.map((assessment: any) => ({
      id: assessment.id,
      skillName:
        assessment.skills?.name ??
        assessment.skill_id ??
        "Assessment",
      score: Number(assessment.score),
      maxScore: Number(assessment.max_score),
      level: Number(assessment.level),
      date: assessment.date,
    })),

    verified: Boolean(data.onboarding_complete),
  };
}