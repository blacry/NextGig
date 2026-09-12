import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

// ── Browser Supabase client ───────────────────────────────────────────
// Used by every Client Component and by the getters in lib/data.ts. Stores
// the session in a cookie so the server (proxy.ts, route handlers) can read
// it too, which is what makes the session survive a refresh.
//
// createBrowserClient returns the same instance for a given URL/key pair, so
// calling this per query is cheap.

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
