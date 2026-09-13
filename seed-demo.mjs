/**
 * seed-demo.mjs
 * Creates (or recreates) the two demo accounts in Supabase.
 *
 * Run once:  node seed-demo.mjs
 *
 * Requires: @supabase/supabase-js (already in node_modules)
 * Reads:    NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Read .env.local manually (no dotenv dep needed) ──────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, ".env.local");
const envLines = readFileSync(envPath, "utf8").split("\n");
const env = {};
for (const line of envLines) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) env[key.trim()] = rest.join("=").trim();
}

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"]?.replace(/\/$/, "");
const SERVICE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Admin client — bypasses RLS
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Demo account definitions ──────────────────────────────────────────
const DEMO_PASSWORD = "demo-password-123";

const DEMO_USERS = [
  {
    email: "demo.student@nextgig.dev",
    name: "Demo Student",
    role: "student",
    slug: "demo-student",
    profile: {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "Demo University",
      year: 2025,
      gpa: 3.8,
      bio: "A pre-seeded demo student account for exploring NextGig.",
      onboarding_complete: true,
    },
  },
  {
    email: "demo.recruiter@nextgig.dev",
    name: "Demo Recruiter",
    role: "recruiter",
    slug: "demo-recruiter",
  },
];

// ── Helper: upsert auth user via Admin API ───────────────────────────
async function upsertAuthUser(email, password, name, role) {
  // Check if the user already exists
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users?.find((u) => u.email === email);

  if (existing) {
    console.log(`  ↻ Auth user already exists: ${email}`);
    // Update password just in case
    await admin.auth.admin.updateUserById(existing.id, { password });
    return existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,          // skip email confirmation
    user_metadata: { name, role },
  });

  if (error) throw new Error(`createUser(${email}): ${error.message}`);
  console.log(`  ✓ Created auth user: ${email}`);
  return data.user.id;
}

// ── Seed ─────────────────────────────────────────────────────────────
async function seed() {
  for (const demo of DEMO_USERS) {
    console.log(`\nSeeding ${demo.role}: ${demo.email}`);

    const userId = await upsertAuthUser(demo.email, DEMO_PASSWORD, demo.name, demo.role);

    // profiles row
    const { error: profileErr } = await admin.from("profiles").upsert(
      {
        id: userId,
        email: demo.email,
        name: demo.name,
        role: demo.role,
        slug: demo.slug,
        avatar: null,
      },
      { onConflict: "id" }
    );
    if (profileErr) throw new Error(`profiles upsert: ${profileErr.message}`);
    console.log(`  ✓ profiles row OK`);

    if (demo.role === "student") {
      const { error: studentErr } = await admin.from("students").upsert(
        { id: userId, ...demo.profile },
        { onConflict: "id" }
      );
      if (studentErr) throw new Error(`students upsert: ${studentErr.message}`);
      console.log(`  ✓ students row OK`);
    }

    if (demo.role === "recruiter") {
      // Find or create a demo company first
      let companyId;
      const { data: existingCompany } = await admin
        .from("companies")
        .select("id")
        .eq("name", "NextGig Demo Corp")
        .maybeSingle();

      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        const { data: newCompany, error: companyErr } = await admin
          .from("companies")
          .insert({
            name: "NextGig Demo Corp",
            industry: "Technology",
            size: "startup",
            location: "San Francisco, CA",
          })
          .select("id")
          .single();
        if (companyErr) throw new Error(`companies insert: ${companyErr.message}`);
        companyId = newCompany.id;
        console.log(`  ✓ demo company created`);
      }

      const { error: recruiterErr } = await admin.from("recruiters").upsert(
        { id: userId, company_id: companyId },
        { onConflict: "id" }
      );
      if (recruiterErr) throw new Error(`recruiters upsert: ${recruiterErr.message}`);
      console.log(`  ✓ recruiters row OK`);
    }
  }

  console.log("\n✅ Demo accounts ready!");
  console.log("   Student:   demo.student@nextgig.dev  /  demo-password-123");
  console.log("   Recruiter: demo.recruiter@nextgig.dev  /  demo-password-123");
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
