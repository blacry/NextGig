import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/rows";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[OAuth Callback] Session exchange failed:", exchangeError);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[OAuth Callback] Failed to fetch authenticated user:", userError);
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  // If a specific valid relative redirect was requested, honor it
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // 1. Fetch user's profile from Postgres
  let { data: profile } = await supabase
    .from("profiles")
    .select("id, role, name, slug, email, avatar")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  // 2. If user is signing in with GitHub for the first time without an existing profile row,
  // provision a student profile automatically so they can proceed directly to onboarding/dashboard.
  if (!profile) {
    const rawName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      user.email?.split("@")[0] ||
      "Learner";

    const baseSlug = (
      user.user_metadata?.user_name ||
      rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    )
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || `learner-${user.id.slice(0, 6)}`;

    const { data: newProfile, error: profileInsertError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          name: rawName,
          email: user.email || "",
          slug: baseSlug,
          role: "student",
          avatar: user.user_metadata?.avatar_url || null,
        },
        { onConflict: "id" }
      )
      .select("id, role, name, slug, email, avatar")
      .maybeSingle<ProfileRow>();

    if (profileInsertError) {
      console.warn("[OAuth Callback] Profile auto-provisioning note:", profileInsertError);
    }
    profile = newProfile ?? null;
  }

  // 3. Resolve role-based destination:
  const userRole = (profile?.role as string) || "student";

  // - Recruiter -> Recruiter Workspace Dashboard
  if (userRole === "recruiter") {
    return NextResponse.redirect(
      `${origin}/recruiter/${profile?.slug || "sarah-jenkins"}/dashboard`
    );
  }

  // - Academician -> Academician Workspace Dashboard
  if (userRole === "academician") {
    return NextResponse.redirect(
      `${origin}/academician/${profile?.slug || "ananya-sharma"}/dashboard`
    );
  }

  // - Student / Learner -> Check if onboarding is complete
  if (userRole === "student") {
    const { data: student } = await supabase
      .from("students")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle<{ onboarding_complete: boolean }>();

    if (student?.onboarding_complete && profile?.slug) {
      return NextResponse.redirect(`${origin}/student/${profile.slug}/dashboard`);
    }

    // New/in-progress student -> Onboarding flow
    return NextResponse.redirect(`${origin}/onboarding/upload`);
  }

  // Fallback destination for other roles or unassigned
  return NextResponse.redirect(`${origin}/onboarding/upload`);
}