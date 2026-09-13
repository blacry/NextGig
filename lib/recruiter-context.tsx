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
  getApplicationsByOpportunityIds,
  getRecruiterBySlug,
  getStudents,
} from "./data";
import type { Application, Company, Opportunity, Recruiter, Student } from "./types";

// ── Recruiter Context ────────────────────────────────────────────────
// The recruiter-side counterpart to StudentProvider: loads the recruiter's
// own profile, their postings, their company, applications, and the talent pool from
// Supabase. Mirrors StudentProvider's shape (isLoaded, refresh, toast-based
// error reporting) so both sides of the app behave the same way.

interface RecruiterContextValue {
  recruiter: Recruiter | null;
  company: Company | null;
  opportunities: Opportunity[];
  candidates: Student[];
  applications: Application[];
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
  const [applications, setApplications] = useState<Application[]>([]);
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
        setApplications([]);
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

      const oppIds = postings.map((p) => p.id);
      if (oppIds.length > 0) {
        const apps = await getApplicationsByOpportunityIds(oppIds);
        setApplications(apps);
      } else {
        setApplications([]);
      }
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
      value={{ recruiter, company, opportunities, candidates, applications, refresh: load, isLoaded }}
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
