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
  getAcademicianBySlug,
  getAcademicianOpportunities,
  getMentorshipsByAcademicianId,
} from "./data";
import type { Academician, Company, Mentorship, Opportunity } from "./types";

// ── Academician Context ──────────────────────────────────────────────
// Manages the authenticated academician's profile, mentoring sessions,
// academic/research opportunities, and application state.

interface OpportunityWithCompany {
  opportunity: Opportunity;
  company: Company | undefined;
}

interface AcademicianContextValue {
  academician: Academician | null;
  opportunities: OpportunityWithCompany[];
  mentorships: Mentorship[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;
  applications: { opportunityId: string; status: string; appliedAt: string }[];
  applyToOpportunity: (opportunityId: string) => Promise<void>;
  refresh: () => Promise<void>;
  isLoaded: boolean;
}

const AcademicianContext = createContext<AcademicianContextValue | undefined>(undefined);

export function AcademicianProvider({
  children,
  academicianSlug,
}: {
  children: React.ReactNode;
  academicianSlug?: string;
}) {
  const [academician, setAcademician] = useState<Academician | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityWithCompany[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>([
    "opp-acad-1",
    "opp-acad-2",
  ]);
  const [applications, setApplications] = useState<
    { opportunityId: string; status: string; appliedAt: string }[]
  >([
    { opportunityId: "opp-acad-1", status: "Applied", appliedAt: "2026-09-02" },
    { opportunityId: "opp-acad-3", status: "Interview", appliedAt: "2026-08-28" },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!academicianSlug) {
      setIsLoaded(true);
      return;
    }

    try {
      const [profile, opps] = await Promise.all([
        getAcademicianBySlug(academicianSlug),
        getAcademicianOpportunities(),
      ]);

      setAcademician(profile ?? null);
      setOpportunities(opps);

      if (profile) {
        const sessions = await getMentorshipsByAcademicianId(profile.id);
        setMentorships(sessions);
      }
    } catch (error) {
      console.error("[AcademicianProvider] failed to load workspace", error);
      toast.error(
        error instanceof DataError
          ? error.message
          : "Could not load academician profile. Please refresh."
      );
      setAcademician(null);
    } finally {
      setIsLoaded(true);
    }
  }, [academicianSlug]);

  useEffect(() => {
    setIsLoaded(false);
    void load();
  }, [load]);

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    toast.success("Opportunity preferences updated");
  };

  const applyToOpportunity = async (opportunityId: string) => {
    if (applications.some((a) => a.opportunityId === opportunityId)) {
      toast.error("You have already applied for this opportunity.");
      return;
    }
    const newApp = {
      opportunityId,
      status: "Applied",
      appliedAt: new Date().toISOString().split("T")[0],
    };
    setApplications((prev) => [newApp, ...prev]);
    toast.success("Application submitted successfully!");
  };

  return (
    <AcademicianContext.Provider
      value={{
        academician,
        opportunities,
        mentorships,
        savedOpportunityIds,
        toggleSaveOpportunity,
        applications,
        applyToOpportunity,
        refresh: load,
        isLoaded,
      }}
    >
      {children}
    </AcademicianContext.Provider>
  );
}

export function useAcademician(): AcademicianContextValue {
  const context = useContext(AcademicianContext);
  if (!context) {
    throw new Error("useAcademician must be used within an AcademicianProvider");
  }
  return context;
}
