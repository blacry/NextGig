"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LectureCard } from "@/components/lecture-card";
import { getLectures, DataError } from "@/lib/data";
import { useStudent } from "@/lib/student-context";
import type { Lecture } from "@/lib/types";

export default function StudentLecturesPage() {
  const { isLoaded } = useStudent(); const [lectures, setLectures] = useState<Lecture[]>([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  async function load() { setLoading(true); setError(null); try { setLectures(await getLectures()); } catch (cause) { const message = cause instanceof DataError ? cause.message : "Could not load lectures."; setError(message); toast.error(message); } finally { setLoading(false); } }
  useEffect(() => { if (isLoaded) void load(); }, [isLoaded]);
  useEffect(() => { const handler = () => void load(); window.addEventListener("focus", handler); return () => window.removeEventListener("focus", handler); }, []);
  const filtered = useMemo(() => lectures.filter((lecture) => `${lecture.title} ${lecture.academicianName} ${lecture.course ?? ""}`.toLowerCase().includes(search.toLowerCase())), [lectures, search]);
  if (!isLoaded) return null;
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold tracking-tight">Live lectures</h1><p className="mt-1 text-muted-foreground">Join upcoming sessions hosted by academicians.</p></div><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics, courses, or hosts…" />{loading ? <Card size="sm" className="h-auto"><CardContent className="p-6 text-sm text-muted-foreground">Loading upcoming lectures…</CardContent></Card> : error ? <Card size="sm" className="h-auto"><CardContent className="flex items-center justify-between gap-3 p-6 text-sm"><span>{error}</span><Button size="sm" variant="outline" onClick={() => void load()}>Retry</Button></CardContent></Card> : filtered.length ? <div className="grid gap-3 md:grid-cols-2">{filtered.map((lecture) => <LectureCard key={lecture.id} lecture={lecture} />)}</div> : <Card size="sm" className="h-auto"><CardContent className="p-8 text-center text-sm text-muted-foreground">No upcoming lectures match your search.</CardContent></Card>}</div>;
}
