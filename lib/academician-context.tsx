"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DataError, getAcademicianBySlug, getLectures, type LectureInput, createLecture, updateLecture, deleteLecture } from "./data";
import type { Academician, Lecture } from "./types";

interface Value {
  academician: Academician | null;
  lectures: Lecture[];
  isLoaded: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: LectureInput) => Promise<void>;
  update: (id: string, input: Partial<LectureInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}
const Context = createContext<Value | undefined>(undefined);

export function AcademicianProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [academician, setAcademician] = useState<Academician | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      setError(null);
      const profile = await getAcademicianBySlug(slug);
      setAcademician(profile ?? null);
      if (profile) setLectures(await getLectures({ ownerId: profile.id, upcomingOnly: false }));
    } catch (cause) {
      console.error("[academician] load failed", cause);
      setError(cause instanceof DataError ? cause.message : "Could not load your academician workspace.");
    } finally { setIsLoaded(true); }
  }, [slug]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);
  const value: Value = {
    academician, lectures, isLoaded, error, refresh,
    create: async (input) => { if (!academician) throw new Error("Academician profile is unavailable."); await createLecture(academician.id, input); await refresh(); },
    update: async (id, input) => { await updateLecture(id, input); await refresh(); },
    remove: async (id) => { await deleteLecture(id); await refresh(); },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAcademician() { const value = useContext(Context); if (!value) throw new Error("useAcademician must be used within AcademicianProvider"); return value; }
