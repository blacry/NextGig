import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Role → dashboard path mapping
const ROLE_DASHBOARDS: Record<string, string> = {
  student: "/student",
  academician: "/academician",
  industry: "/industry",
  institution_admin: "/institution",
  super_admin: "/admin",
};

// Protected route prefixes and their allowed roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/student": ["student", "super_admin"],
  "/industry": ["industry", "super_admin"],
  "/academician": ["academician", "super_admin"],
  "/institution": ["institution_admin", "super_admin"],
  "/admin": ["super_admin"],
  "/onboarding": ["student", "academician", "industry", "institution_admin"],
};

// Auth routes — redirect to dashboard if already logged in
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/select-role"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionCookie = await getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/student", req.url));
  }

  // Check protected routes
  for (const [prefix, _] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
      // Role check will happen in individual layouts via server-side session
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/industry/:path*",
    "/academician/:path*",
    "/institution/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/select-role",
  ],
};
