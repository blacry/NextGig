"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeRecruiterOnboarding(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to complete onboarding.");
  }

  // Get user profile to get slug
  const { data: profile } = await supabase
    .from("profiles")
    .select("slug, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "recruiter") {
    throw new Error("Invalid profile or not a recruiter.");
  }

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const size = formData.get("size") as string;
  const location = formData.get("location") as string;
  const logo = formData.get("logo") as string | null;

  if (!name || !industry || !size || !location) {
    throw new Error("Missing required company fields.");
  }

  // 1. Insert into companies
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name,
      industry,
      size,
      location,
      logo: logo || null,
    })
    .select("id")
    .single();

  if (companyError || !company) {
    throw new Error(companyError?.message || "Failed to create company.");
  }

  // 2. Update recruiter record with company_id
  const { error: recruiterError } = await supabase
    .from("recruiters")
    .update({ company_id: company.id })
    .eq("id", user.id);

  if (recruiterError) {
    throw new Error(recruiterError.message || "Failed to update recruiter profile.");
  }

  revalidatePath(`/recruiter/${profile.slug}`);
  redirect(`/recruiter/${profile.slug}/dashboard`);
}
