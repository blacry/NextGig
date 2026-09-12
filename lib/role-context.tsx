"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UserRole, AuthState } from "./types";

// ── Role Context ─────────────────────────────────────────────────────
// Frontend-only dummy auth. Stores role + user info in localStorage
// so a refresh doesn't kick the user back to /login.
// This gets swapped for Insforge later.

interface RoleContextValue extends AuthState {
  login: (role: UserRole, name: string, slug: string, id: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = "nextgig-auth";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    role: null,
    userName: "",
    userSlug: "",
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthState;
        if (parsed.role && parsed.userSlug) {
          setAuth(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (role: UserRole, name: string, slug: string, id: string) => {
      const newAuth: AuthState = { role, userName: name, userSlug: slug, userId: id };
      setAuth(newAuth);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuth));

      if (role === "student") {
        router.push(`/onboarding/upload`);
      } else {
        router.push(`/recruiter/${slug}/dashboard`);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setAuth({ role: null, userName: "", userSlug: "", userId: "" });
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  }, [router]);

  return (
    <RoleContext.Provider value={{ ...auth, login, logout, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
