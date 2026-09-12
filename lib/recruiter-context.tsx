"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import {
  DataError,
  getCompanies,
  getOpportunitiesByRecruiterId,
  getRecruiterBySlug,
  getStudents,
} from "./data";
import type { Company, Opportunity, Recruiter, Student } from "./types";

// ── Recruiter Context ────────────────────────────────────────────────
// The recruiter-side counterpart to StudentProvider: loads the recruiter's
// own profile, their postings, their company, and the talent pool from
// Supabase. Mirrors StudentProvider's shape (isLoaded, refresh, toast-based
// error reporting) so both sides of the app behave the same way.
//
// The talent pool is every onboarded student; RLS grants recruiters read
// access to student rows, and returns nothing for other roles.

interface RecruiterContextValue {
  recruiter: Recruiter | null;
  company: Company | null;
  opportunities: Opportunity[];
  candidates: Student[];
  refresh: () => Promise<void>;
  isLoaded: boolean;
}

const RecruiterContext = createContext<RecruiterContextValue | undefined>(undefined);

export function RecruiterProvider({
  children,
  recruiterSlug,
}: {
  children: React.ReactNode;
  recruiterSlug?: string;
}) {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [candidates, setCandidates] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!recruiterSlug) {
      setIsLoaded(true);
      return;
    }

    try {
      const profile = await getRecruiterBySlug(recruiterSlug);
      setRecruiter(profile ?? null);

      if (!profile) {
        setCompany(null);
        setOpportunities([]);
        setCandidates([]);
        return;
      }

      const [postings, pool, companies] = await Promise.all([
        getOpportunitiesByRecruiterId(profile.id),
        getStudents(),
        getCompanies(),
      ]);

      setOpportunities(postings);
      setCandidates(pool);
      setCompany(companies.find((c) => c.id === profile.companyId) ?? (companies.length > 0 ? companies[0] : null));
    } catch (error) {
      console.error("[RecruiterProvider] failed to load workspace", error);
      toast.error(
        error instanceof DataError
          ? error.message
          : "Could not load your workspace. Please refresh the page."
      );
      setRecruiter(null);
    } finally {
      setIsLoaded(true);
    }
  }, [recruiterSlug]);

  useEffect(() => {
    setIsLoaded(false);
    void load();
  }, [load]);

  return (
    <RecruiterContext.Provider
      value={{ recruiter, company, opportunities, candidates, refresh: load, isLoaded }}
    >
      {children}
    </RecruiterContext.Provider>
  );
}

export function useRecruiter(): RecruiterContextValue {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error("useRecruiter must be used within a RecruiterProvider");
  }
  return context;
}
