"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOpportunity(formData: FormData, skills: { skillId: string, requiredLevel: number, preferred: boolean }[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Get recruiter profile to get company_id and recruiter_id
  const { data: recruiter } = await supabase
    .from("recruiters")
    .select("id, company_id, profiles(slug)")
    .eq("id", user.id)
    .single();

  if (!recruiter || !recruiter.company_id) {
    throw new Error("Recruiter profile or company not found.");
  }

  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as "internship" | "full-time" | "contract";
  const duration = formData.get("duration") as string;
  const compensation = formData.get("compensation") as string;
  const deadline = formData.get("deadline") as string;
  const description = formData.get("description") as string;
  const eligibility = formData.get("eligibility") as string || "Open to all";

  // 1. Insert Opportunity
  const { data: opp, error: oppError } = await supabase
    .from("opportunities")
    .insert({
      title,
      location,
      type,
      duration: duration || null,
      compensation: compensation || "Not specified",
      deadline: deadline ? new Date(deadline).toISOString() : null,
      description,
      eligibility,
      domain: "software_engineering", // Defaulting domain for now
      company_id: recruiter.company_id,
      recruiter_id: recruiter.id,
      active: true
    })
    .select("id")
    .single();

  if (oppError || !opp) {
    console.error("Failed to create opportunity:", oppError);
    throw new Error("Failed to create opportunity.");
  }

  // 2. Insert Skills
  if (skills && skills.length > 0) {
    const skillsToInsert = skills.map(s => ({
      opportunity_id: opp.id,
      skill_id: s.skillId,
      required_level: s.requiredLevel,
      preferred: s.preferred
    }));

    const { error: skillError } = await supabase
      .from("opportunity_skills")
      .insert(skillsToInsert);

    if (skillError) {
      console.error("Failed to add skills:", skillError);
    }
  }

  // @ts-expect-error Types issue with nested select
  const slug = recruiter.profiles?.slug as string;
  revalidatePath(`/recruiter/${slug}/posting`);
  return { success: true };
}
