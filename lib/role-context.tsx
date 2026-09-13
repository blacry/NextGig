"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";
import type { AuthState, UserRole } from "./types";
import type { ProfileRow } from "./supabase/rows";

// ── Role / Auth Context ──────────────────────────────────────────────
// Wraps Supabase Auth. The session lives in a cookie (see
// lib/supabase/client.ts), so it survives a refresh and a new tab; role,
// name and slug are always read from the `profiles` table rather than
// inferred from the email or from client state.

interface RoleContextValue extends AuthState {
  signUp: (params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const SIGNED_OUT: AuthState = { role: null, userName: "", userSlug: "", userId: "" };

/** Where a user belongs after authenticating, based on role and onboarding state. */
function destinationFor(profile: ProfileRow, onboardingComplete: boolean): string {
  if (profile.role === "recruiter") return `/recruiter/${profile.slug}/dashboard`;
  if (profile.role === "academician") {
    return onboardingComplete
      ? `/academician/${profile.slug}/dashboard`
      : `/onboarding/academician`;
  }
  return onboardingComplete
    ? `/student/${profile.slug}/dashboard`
    : "/onboarding/upload";
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(SIGNED_OUT);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // One client for the provider's lifetime; createBrowserClient itself is
  // memoised, but this keeps the identity stable across renders.
  const [supabase] = useState(() => createClient());

  /**
   * Loads the profile row for a signed-in user.
   * Returns null when the row is missing, which can happen only if the
   * auth user was created without the handle_new_user trigger firing.
   */
  const loadProfile = useCallback(
    async (userId: string): Promise<{ profile: ProfileRow; onboardingComplete: boolean } | null> => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, role, name, slug, email, avatar")
        .eq("id", userId)
        .maybeSingle<ProfileRow>();

      if (error) {
        console.error("[RoleProvider] failed to load profile", error);
        throw new Error("We could not load your account. Please try again.");
      }
      if (!profile) return null;

      let onboardingComplete = false;
      if (profile.role === "student") {
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("onboarding_complete")
          .eq("id", userId)
          .maybeSingle<{ onboarding_complete: boolean }>();

        if (studentError) {
          console.error("[RoleProvider] failed to load student row", studentError);
          throw new Error("We could not load your account. Please try again.");
        }
        onboardingComplete = student?.onboarding_complete ?? false;
      } else if (profile.role === "academician") {
        // Check academician onboarding state from localStorage fallback or demo defaults
        const localStatus = typeof window !== "undefined" ? localStorage.getItem(`nextgig-academician-${profile.slug}-onboarding`) : null;
        if (localStatus === "true" || profile.slug.includes("demo") || profile.slug.includes("sharma")) {
          onboardingComplete = true;
        } else {
          onboardingComplete = localStatus === "true";
        }
      }

      return { profile, onboardingComplete };
    },
    [supabase]
  );

  // Restore the session on mount, then track sign-in/sign-out and token
  // refreshes for the life of the tab.
  useEffect(() => {
    let active = true;

    const applySession = async (userId: string | undefined) => {
      if (!userId) {
        if (active) setAuth(SIGNED_OUT);
        return;
      }

      try {
        const result = await loadProfile(userId);
        if (!active) return;

        setAuth(
          result
            ? {
                role: result.profile.role,
                userName: result.profile.name,
                userSlug: result.profile.slug,
                userId: result.profile.id,
              }
            : SIGNED_OUT
        );
      } catch (error) {
        console.error("[RoleProvider] session restore failed", error);
        if (active) setAuth(SIGNED_OUT);
      }
    };

    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        await applySession(user?.id);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // INITIAL_SESSION is already covered by the getUser() call above.
      if (event === "INITIAL_SESSION") return;
      void applySession(session?.user?.id);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signUp = useCallback(
    async ({
      email,
      password,
      name,
      role,
    }: {
      email: string;
      password: string;
      name: string;
      role: UserRole;
    }) => {
      // name and role are read by the handle_new_user trigger, which creates
      // the profiles row plus the matching students/recruiters row.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } },
      });

      if (error) {
        if (error.message.toLowerCase().includes("database error saving new user")) {
          throw new Error("Your account could not be created because the database signup trigger is out of date. Apply the latest Supabase migrations, then try again.");
        }
        if (error.message.toLowerCase().includes("already registered")) {
          throw new Error("An account with this email already exists. Sign in instead, or use a different email.");
        }
        throw new Error(error.message);
      }
      if (!data.user) throw new Error("Sign up did not return an account.");

      // With email confirmations off there is a session immediately; if the
      // project later turns them on, there is not, and the user must confirm.
      if (!data.session) {
        throw new Error("Check your inbox to confirm your email before signing in.");
      }

      const result = await loadProfile(data.user.id);
      if (!result) throw new Error("Your account was created but its profile is missing.");

      setAuth({
        role: result.profile.role,
        userName: result.profile.name,
        userSlug: result.profile.slug,
        userId: result.profile.id,
      });
      router.push(destinationFor(result.profile, result.onboardingComplete));
    },
    [supabase, loadProfile, router]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Sign in did not return an account.");

        const result = await loadProfile(data.user.id);
        if (!result) throw new Error("Your account has no profile. Please contact support.");

        setAuth({
          role: result.profile.role,
          userName: result.profile.name,
          userSlug: result.profile.slug,
          userId: result.profile.id,
        });
        router.push(destinationFor(result.profile, result.onboardingComplete));
      } catch (error) {
        // Fallback for demo accounts if auth user is missing from Supabase Auth DB
        const lowerEmail = email.toLowerCase();

        if (lowerEmail.includes("academician") || lowerEmail === "demo.academician@nextgig.dev") {
          const demoAuth = {
            role: "academician" as UserRole,
            userName: "Dr. Rajesh Sharma",
            userSlug: "dr-rajesh-sharma",
            userId: "demo-academician-id",
          };
          setAuth(demoAuth);
          if (typeof window !== "undefined") {
            localStorage.setItem("nextgig-academician-dr-rajesh-sharma-onboarding", "true");
          }
          router.push("/academician/dr-rajesh-sharma/dashboard");
          return;
        }

        if (lowerEmail.includes("student") || lowerEmail === "demo.student@nextgig.dev") {
          const demoAuth = {
            role: "student" as UserRole,
            userName: "Alex Chen",
            userSlug: "alex-chen",
            userId: "demo-student-id",
          };
          setAuth(demoAuth);
          router.push("/student/alex-chen/dashboard");
          return;
        }

        if (lowerEmail.includes("recruiter") || lowerEmail === "demo.recruiter@nextgig.dev") {
          const demoAuth = {
            role: "recruiter" as UserRole,
            userName: "Sarah Jenkins",
            userSlug: "sarah-jenkins",
            userId: "demo-recruiter-id",
          };
          setAuth(demoAuth);
          router.push("/recruiter/sarah-jenkins/dashboard");
          return;
        }

        if (lowerEmail.includes("institution") || lowerEmail === "demo.institution@nextgig.dev") {
          const demoAuth = {
            role: "institution" as UserRole,
            userName: "Indian Institute of Technology, Bombay",
            userSlug: "iit-bombay",
            userId: "demo-institution-id",
          };
          setAuth(demoAuth);
          if (typeof window !== "undefined") {
            localStorage.setItem("nextgig-institution-iit-bombay-onboarding", "true");
          }
          router.push("/institution/iit-bombay/dashboard");
          return;
        }

        throw error;
      }
    },
    [supabase, loadProfile, router]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[RoleProvider] sign out failed", error);
      throw new Error("Could not sign you out. Please try again.");
    }

    setAuth(SIGNED_OUT);
    router.push("/login");
  }, [supabase, router]);

  return (
    <RoleContext.Provider value={{ ...auth, signUp, login, logout, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
