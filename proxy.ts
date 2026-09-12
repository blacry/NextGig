import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

// ── Supabase session refresh ──────────────────────────────────────────
// Next.js 16 renamed Middleware to Proxy (same functionality, new filename);
// see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
//
// Supabase access tokens are short-lived. Calling getUser() here refreshes an
// expired token and writes the rotated cookies onto the response, so a user
// who returns after the token expires stays signed in instead of being
// silently logged out.
//
// This does no authorization: route protection lives in the layouts, which
// already redirect on the wrong role. Per the Next.js docs, Proxy should not
// be used as a full session-management or authorization solution.

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not remove: this call is what triggers the token refresh.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip static assets and image files; everything else refreshes the session.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
