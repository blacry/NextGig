"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { createClient } from "./supabase/client";
import {
  DataError,
  WriteError,
  applyToOpportunity,
  getApplicationsByStudentId,
  getStudentBySlug,
  setApplicationStage,
} from "./data";
import type {
  Application,
  ApplicationStage,
  ChatMessage,
  OnboardingState,
  Skill,
  Student,
} from "./types";

// ── Student Context ──────────────────────────────────────────────────
// Loads the active student's profile and applications from Supabase and
// writes changes straight back, so state survives a refresh and a new device.
//
// Application writes go through the apply_to_opportunity and
// set_application_stage database functions rather than through table writes:
// they are the single place stage history is appended, which is what keeps a
// timeline from gaining a duplicate entry when a retry or a double click
// sends the same change twice.
//
// Two things deliberately stay client-only:
//   - `onboarding`, which is in-flight wizard state persisted to sessionStorage
//     by the onboarding pages themselves and committed to Postgres by
//     /api/complete-onboarding at the end.
//   - `chatHistory`, which has no table in the schema; it stays in
//     localStorage, scoped per student slug.

interface StudentContextValue {
  student: Student | null;
  setStudent: (student: Student) => void;
  updateSkills: (skills: Skill[]) => Promise<void>;
  applications: Application[];
  addApplication: (opportunityId: string) => Promise<void>;
  withdrawApplication: (appId: string) => Promise<void>;
  onboarding: OnboardingState;
  setOnboarding: (state: OnboardingState) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  /** Re-reads the profile from Supabase; used after onboarding completes. */
  refresh: () => Promise<void>;
  isLoaded: boolean;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

function getChatStorageKey(slug: string) {
  return `nextgig-student-${slug}-chat`;
}

export function StudentProvider({
  children,
  studentSlug,
}: {
  children: React.ReactNode;
  studentSlug?: string;
}) {
  const [student, setStudentState] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [onboarding, setOnboardingState] = useState<OnboardingState>({ step: 1 });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [supabase] = useState(() => createClient());

  const load = useCallback(async () => {
    if (!studentSlug) {
      setIsLoaded(true);
      return;
    }

    try {
      const profile = await getStudentBySlug(studentSlug);
      setStudentState(profile ?? null);

      if (profile) {
        setApplications(await getApplicationsByStudentId(profile.id));
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("[StudentProvider] failed to load student", error);
      toast.error(
        error instanceof DataError
          ? error.message
          : "Could not load your profile. Please refresh the page."
      );
      setStudentState(null);
    } finally {
      setIsLoaded(true);
    }
  }, [studentSlug]);

  useEffect(() => {
    setIsLoaded(false);
    void load();
  }, [load]);

  // Chat history is browser-local; there is no table for it.
  useEffect(() => {
    if (!studentSlug) return;

    const stored = localStorage.getItem(getChatStorageKey(studentSlug));
    if (!stored) {
      setChatHistory([]);
      return;
    }

    try {
      setChatHistory(JSON.parse(stored) as ChatMessage[]);
    } catch {
      setChatHistory([]);
    }
  }, [studentSlug]);

  /** Local-only update, for callers that already persisted their change. */
  const setStudent = useCallback((next: Student) => {
    setStudentState(next);
  }, []);

  const updateSkills = useCallback(
    async (skills: Skill[]) => {
      if (!student) return;

      const rows = skills.map((skill) => ({
        student_id: student.id,
        skill_id: skill.id,
        level: skill.level,
        verification: skill.verification,
        verified_at: skill.verifiedAt ?? null,
        verified_by: skill.verifiedBy ?? null,
      }));

      const { error } = await supabase
        .from("student_skills")
        .upsert(rows, { onConflict: "student_id,skill_id" });

      if (error) {
        console.error("[StudentProvider] failed to update skills", error);
        toast.error("Could not save your skills. Please try again.");
        return;
      }

      setStudentState({ ...student, skills });
    },
    [student, supabase]
  );

  const addApplication = useCallback(
    async (opportunityId: string) => {
      if (!student) return;

      // Guard the obvious double-submit locally; the unique constraint on
      // (student_id, opportunity_id) is what actually enforces it.
      if (applications.some((app) => app.opportunityId === opportunityId)) {
        toast.error("You have already applied to this role.");
        return;
      }

      try {
        const application = await applyToOpportunity(opportunityId);
        setApplications((prev) => [application, ...prev]);
        toast.success("Application submitted.");
      } catch (error) {
        console.error("[StudentProvider] failed to apply", error);
        toast.error(
          error instanceof WriteError
            ? error.message
            : "Could not submit your application. Please try again."
        );
      }
    },
    [student, applications]
  );

  const withdrawApplication = useCallback(
    async (appId: string) => {
      const previous = applications;
      const occurredAt = new Date().toISOString();
      const stage: ApplicationStage = "withdrawn";

      // Optimistic, reverted on failure — withdrawing is a deliberate action
      // and the list should not sit still while the round-trip completes.
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? {
                ...app,
                currentStage: stage,
                stageHistory: [...app.stageHistory, { stage, timestamp: occurredAt }],
              }
            : app
        )
      );

      try {
        await setApplicationStage(appId, stage);
        toast.success("Application withdrawn.");
      } catch (error) {
        console.error("[StudentProvider] failed to withdraw application", error);
        setApplications(previous);
        toast.error(
          error instanceof WriteError
            ? error.message
            : "Could not withdraw the application. Please try again."
        );
      }
    },
    [applications]
  );

  // In-flight wizard state; committed to Postgres by /api/complete-onboarding.
  const setOnboarding = useCallback((state: OnboardingState) => {
    setOnboardingState(state);
  }, []);

  const addChatMessage = useCallback(
    (message: ChatMessage) => {
      setChatHistory((prev) => {
        const updated = [...prev, message];
        if (studentSlug) {
          localStorage.setItem(getChatStorageKey(studentSlug), JSON.stringify(updated));
        }
        return updated;
      });
    },
    [studentSlug]
  );

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
    if (studentSlug) {
      localStorage.removeItem(getChatStorageKey(studentSlug));
    }
  }, [studentSlug]);

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        updateSkills,
        applications,
        addApplication,
        withdrawApplication,
        onboarding,
        setOnboarding,
        chatHistory,
        addChatMessage,
        clearChatHistory,
        refresh: load,
        isLoaded,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent(): StudentContextValue {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
