// ── Supabase environment ──────────────────────────────────────────────
// Reads the Supabase config from the environment and fails loudly when a
// variable is missing, rather than passing `undefined!` into the client and
// surfacing an unrelated "Invalid URL" error at the first query.
//
// NEXT_PUBLIC_* values are inlined at build time, so these must be referenced
// as static property accesses — not via a dynamic key.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local — see README.md for the Supabase setup steps.`
    );
  }
  return value;
}

export function getSupabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Service-role key. Server-only: it bypasses RLS, so it must never be
 * imported into a Client Component or referenced with a NEXT_PUBLIC_ prefix.
 */
export function getSupabaseServiceRoleKey(): string {
  return required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}
