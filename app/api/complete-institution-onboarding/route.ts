import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      type,
      officialEmail,
      websiteUrl,
      phone,
      address,
      city,
      state,
      country,
      adminName,
      adminRole,
      cohortSize,
      programsOffered,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Institution name is required." },
        { status: 400 }
      );
    }

    if (!officialEmail || !officialEmail.trim()) {
      return NextResponse.json(
        { error: "Official contact email is required." },
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
        { error: "You must be signed in to complete institution onboarding." },
        { status: 401 }
      );
    }

    const institutionSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    let institutionId: string | null = null;

    const payload = {
      name: name.trim(),
      slug: institutionSlug,
      code: code ? code.trim() : null,
      type: type || "University",
      official_email: officialEmail.trim(),
      website_url: websiteUrl ? websiteUrl.trim() : null,
      phone: phone ? phone.trim() : null,
      address: address ? address.trim() : null,
      city: city ? city.trim() : "Not specified",
      state: state ? state.trim() : "Not specified",
      country: country ? country.trim() : "India",
      admin_name: adminName ? adminName.trim() : "Primary Admin",
      admin_role: adminRole ? adminRole.trim() : "Head of Training & Placements",
      cohort_size: cohortSize || null,
      programs_offered: Array.isArray(programsOffered) ? programsOffered : [],
      created_by: user.id,
    };

    // Upsert full institution row
    const { data: instData, error: upsertError } = await db
      .from("institutions")
      .upsert(payload, { onConflict: "slug" })
      .select("id")
      .single();

    if (upsertError) {
      console.warn("[complete-institution-onboarding] full upsert warning:", upsertError);
      // Fallback: lookup by slug if upsert fails due to missing optional columns pre-migration
      const { data: existing } = await db
        .from("institutions")
        .select("id")
        .eq("slug", institutionSlug)
        .maybeSingle();

      if (existing?.id) {
        institutionId = existing.id;
      } else {
        const { data: fallbackCreated } = await db
          .from("institutions")
          .insert({ name: name.trim(), slug: institutionSlug, created_by: user.id })
          .select("id")
          .single();
        institutionId = fallbackCreated?.id ?? null;
      }
    } else {
      institutionId = instData?.id ?? null;
    }

    if (institutionId) {
      // 1. Link profile -> institution_id
      await db
        .from("profiles")
        .update({ institution_id: institutionId })
        .eq("id", user.id);

      // 2. Insert into institution_members as admin
      await db.from("institution_members").upsert(
        {
          institution_id: institutionId,
          user_id: user.id,
          role: "admin",
          designation: adminRole || "Head of Training & Placements",
        },
        { onConflict: "institution_id, user_id" }
      );
    }

    return NextResponse.json({
      success: true,
      institutionSlug,
      institutionId,
      message: "Institution profile and database record created successfully.",
    });
  } catch (error) {
    console.error("[complete-institution-onboarding] error:", error);
    return NextResponse.json(
      { error: "Failed to process institution onboarding." },
      { status: 500 }
    );
  }
}
