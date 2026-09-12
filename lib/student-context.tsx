"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type {
  Student,
  Skill,
  Application,
  OnboardingState,
  ChatMessage,
  AssessmentQuestion,
  AssessmentAnswer,
  AssessmentResult,
} from "./types";
import { mockStudents, mockApplications } from "./data";

// ── Student Context ──────────────────────────────────────────────────
// Manages the active student's profile, onboarding state, applications,
// and AI chat history. All state is persisted to localStorage per user.

interface StudentContextValue {
  student: Student | null;
  setStudent: (student: Student) => void;
  updateSkills: (skills: Skill[]) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (appId: string, updates: Partial<Application>) => void;
  onboarding: OnboardingState;
  setOnboarding: (state: OnboardingState) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  isLoaded: boolean;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

function getStorageKey(slug: string, suffix: string) {
  return `nextgig-student-${slug}-${suffix}`;
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

  // Load student data from mock data or localStorage
  useEffect(() => {
    if (!studentSlug) {
      setIsLoaded(true);
      return;
    }

    // Try localStorage first (for onboarded students)
    const storedStudent = localStorage.getItem(getStorageKey(studentSlug, "profile"));
    if (storedStudent) {
      try {
        setStudentState(JSON.parse(storedStudent));
      } catch {
        // Fall back to mock data
        const mock = mockStudents.find((s) => s.slug === studentSlug);
        if (mock) setStudentState(mock);
      }
    } else {
      // Fall back to mock data
      const mock = mockStudents.find((s) => s.slug === studentSlug);
      if (mock) setStudentState(mock);
    }

    // Load applications
    const storedApps = localStorage.getItem(getStorageKey(studentSlug, "applications"));
    if (storedApps) {
      try {
        setApplications(JSON.parse(storedApps));
      } catch {
        setApplications(mockApplications.filter((a) => {
          const mock = mockStudents.find((s) => s.slug === studentSlug);
          return mock && a.studentId === mock.id;
        }));
      }
    } else {
      setApplications(mockApplications.filter((a) => {
        const mock = mockStudents.find((s) => s.slug === studentSlug);
        return mock && a.studentId === mock.id;
      }));
    }

    // Load onboarding state
    const storedOnboarding = localStorage.getItem(getStorageKey(studentSlug, "onboarding"));
    if (storedOnboarding) {
      try {
        setOnboardingState(JSON.parse(storedOnboarding));
      } catch {
        setOnboardingState({ step: 1 });
      }
    }

    // Load chat history (AI memory persistence)
    const storedChat = localStorage.getItem(getStorageKey(studentSlug, "chat"));
    if (storedChat) {
      try {
        setChatHistory(JSON.parse(storedChat));
      } catch {
        setChatHistory([]);
      }
    }

    setIsLoaded(true);
  }, [studentSlug]);

  // Persist student profile
  const setStudent = useCallback(
    (s: Student) => {
      setStudentState(s);
      if (s.slug) {
        localStorage.setItem(getStorageKey(s.slug, "profile"), JSON.stringify(s));
      }
    },
    []
  );

  // Update skills
  const updateSkills = useCallback(
    (skills: Skill[]) => {
      setStudentState((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, skills };
        localStorage.setItem(getStorageKey(prev.slug, "profile"), JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // Applications
  const addApplication = useCallback(
    (app: Application) => {
      setApplications((prev) => {
        const updated = [...prev, app];
        if (studentSlug) {
          localStorage.setItem(getStorageKey(studentSlug, "applications"), JSON.stringify(updated));
        }
        return updated;
      });
    },
    [studentSlug]
  );

  const updateApplication = useCallback(
    (appId: string, updates: Partial<Application>) => {
      setApplications((prev) => {
        const updated = prev.map((a) =>
          a.id === appId ? { ...a, ...updates } : a
        );
        if (studentSlug) {
          localStorage.setItem(getStorageKey(studentSlug, "applications"), JSON.stringify(updated));
        }
        return updated;
      });
    },
    [studentSlug]
  );

  // Onboarding
  const setOnboarding = useCallback(
    (state: OnboardingState) => {
      setOnboardingState(state);
      if (studentSlug) {
        localStorage.setItem(getStorageKey(studentSlug, "onboarding"), JSON.stringify(state));
      }
    },
    [studentSlug]
  );

  // Chat history (AI memory)
  const addChatMessage = useCallback(
    (message: ChatMessage) => {
      setChatHistory((prev) => {
        const updated = [...prev, message];
        if (studentSlug) {
          localStorage.setItem(getStorageKey(studentSlug, "chat"), JSON.stringify(updated));
        }
        return updated;
      });
    },
    [studentSlug]
  );

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
    if (studentSlug) {
      localStorage.removeItem(getStorageKey(studentSlug, "chat"));
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
        updateApplication,
        onboarding,
        setOnboarding,
        chatHistory,
        addChatMessage,
        clearChatHistory,
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
