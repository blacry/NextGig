import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

// ── Server Supabase client ────────────────────────────────────────────
// For route handlers and Server Components. Reads the session from the
// request cookies, so queries run as the signed-in user and RLS applies.
//
// Every page in this app is a Client Component, so in practice this is used
// by app/api/* route handlers.

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a context where cookies are read-only (a Server
          // Component render). The session refresh is handled by proxy.ts,
          // so this is safe to ignore.
        }
      },
    },
  });
}
