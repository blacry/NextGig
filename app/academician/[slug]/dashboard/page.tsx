"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LectureCard } from "@/components/lecture-card";
import { useAcademician } from "@/lib/academician-context";

export default function AcademicianDashboard() {
  const { academician, lectures, isLoaded } = useAcademician();
  if (!isLoaded || !academician) return null;
  const upcoming = lectures.filter((lecture) => lecture.status === "published" && new Date(lecture.scheduledStart) >= new Date());
  return <div className="space-y-6">
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 p-6 text-white shadow-lg"><p className="text-sm text-white/75">Academic workspace</p><h1 className="mt-1 text-3xl font-bold">Welcome, {academician.name.split(" ")[0]}</h1><p className="mt-2 max-w-2xl text-sm text-white/85">Share practical knowledge with students through focused, live sessions.</p><Link href={`/academician/${academician.slug}/lectures`} className="mt-5 inline-flex h-8 items-center rounded-lg bg-white px-3 text-sm font-medium text-indigo-700 hover:bg-white/90">Host a lecture</Link></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{[["Upcoming", upcoming.length], ["Published", lectures.filter((l) => l.status === "published").length], ["Total sessions", lectures.length]].map(([label, value]) => <Card key={label as string} size="sm" className="h-auto"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></CardContent></Card>)}</div>
    <section className="space-y-3"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Upcoming lectures</h2><p className="text-sm text-muted-foreground">Your next sessions, at a glance.</p></div><Link className="text-sm font-medium text-[var(--ng-primary)] hover:underline" href={`/academician/${academician.slug}/lectures`}>Manage all</Link></div>{upcoming.length ? <div className="grid gap-3 md:grid-cols-2">{upcoming.slice(0, 4).map((lecture) => <LectureCard key={lecture.id} lecture={lecture} manage />)}</div> : <Card size="sm" className="h-auto"><CardContent className="p-6 text-center text-sm text-muted-foreground">No upcoming lectures yet. Create your first session to get started.</CardContent></Card>}</section>
  </div>;
}
