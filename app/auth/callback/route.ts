import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();

  // Exchange the OAuth authorization code for a Supabase session.
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[OAuth callback] code exchange failed:", exchangeError);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Get the authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[OAuth callback] user lookup failed:", userError);
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Load the user's profile.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, slug")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    console.error("[OAuth callback] profile lookup failed:", profileError);
    return NextResponse.redirect(`${origin}/login?error=profile`);
  }

  // Recruiters go directly to their dashboard.
  if (profile.role === "recruiter") {
    return NextResponse.redirect(
      `${origin}/recruiter/${profile.slug}/dashboard`
    );
  }

  // Students need their onboarding state checked.
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (studentError) {
    console.error(
      "[OAuth callback] student lookup failed:",
      studentError
    );

    return NextResponse.redirect(`${origin}/login?error=profile`);
  }

  if (student?.onboarding_complete === true) {
    return NextResponse.redirect(
      `${origin}/student/${profile.slug}/dashboard`
    );
  }

  return NextResponse.redirect(`${origin}/onboarding/upload`);
}