import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface RawStudent {
  id: string;
  degree: string;
  field: string;
  year: number;
  gpa: number | null;
  profiles: { name: string; email: string; slug: string } | null;
  student_skills: { level: number; skills: { name: string } | null }[];
  projects: { title: string; verified: boolean }[];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  // The institution tables are introduced by a migration that may be newer
  // than generated client types, so keep this query deliberately isolated.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to view this roster." }, { status: 401 });

  const { data: institution, error: institutionError } = await db
    .from("institutions")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (institutionError || !institution) {
    return NextResponse.json({ error: "Institution not found." }, { status: 404 });
  }

  const { data: students, error: studentsError } = await db
    .from("students")
    .select("id, degree, field, year, gpa, profiles(name, email, slug), student_skills(level, skills(name)), projects(title, verified)")
    .eq("institution_id", institution.id);

  if (studentsError) {
    console.error("[institution roster]", studentsError);
    return NextResponse.json({ error: "Could not load this institution's students." }, { status: 500 });
  }

  const roster = ((students ?? []) as RawStudent[]).map((student) => {
    const firstSkill = student.student_skills?.[0];
    const firstProject = student.projects?.[0];
    return {
      id: student.id,
      name: student.profiles?.name ?? "Unnamed student",
      email: student.profiles?.email ?? "",
      slug: student.profiles?.slug ?? "",
      degree: [student.degree, student.field].filter(Boolean).join(" "),
      year: student.year,
      gpa: student.gpa,
      topSkill: firstSkill?.skills?.name ?? "No skills added",
      projectTitle: firstProject?.title ?? "No project added",
      verificationStatus: firstProject?.verified ? "Verified" : "Pending Faculty Sign-off",
    };
  });

  return NextResponse.json({ students: roster });
}
