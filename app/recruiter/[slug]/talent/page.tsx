"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useRecruiter } from "@/lib/recruiter-context";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MatchScore } from "@/components/match-score";
import { SkeletonCard } from "@/components/shared";

export default function TalentPoolPage() {
  const { recruiter, candidates, opportunities, isLoaded } = useRecruiter();
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [verificationOnly, setVerificationOnly] = useState(false);
  const [roleId, setRoleId] = useState(params.get("role") ?? opportunities[0]?.id ?? "");
  const role = opportunities.find((o) => o.id === roleId);
  const ranked = useMemo(() => role ? rankCandidatesForOpportunity(candidates, role) : candidates.map((candidate) => ({ studentId: candidate.id, overallScore: 0 })), [candidates, role]);
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const filtered = ranked.filter((result) => { const candidate = byId.get(result.studentId); if (!candidate) return false; const haystack = `${candidate.name} ${candidate.education.field ?? ""} ${candidate.education.institution ?? ""} ${candidate.skills.map((s) => s.name).join(" ")}`.toLowerCase(); return haystack.includes(search.toLowerCase()) && (!verificationOnly || candidate.skills.some((s) => s.verification !== "self-declared")); });
  if (!isLoaded) return <div className="card-grid card-grid-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1><p className="mt-1 text-muted-foreground">Search and shortlist candidates from the onboarded talent network.</p></div>
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><Input placeholder="Search by name, skill, field, or institution..." value={search} onChange={(e) => setSearch(e.target.value)} /><select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm md:w-64"><option value="">All candidates</option>{opportunities.map((opportunity) => <option key={opportunity.id} value={opportunity.id}>{opportunity.title}</option>)}</select><Button variant={verificationOnly ? "default" : "outline"} onClick={() => setVerificationOnly((value) => !value)}>Verified skills</Button></CardContent></Card>
    <p className="text-sm text-muted-foreground">Showing {filtered.length} candidate{filtered.length === 1 ? "" : "s"}{role ? ` ranked for ${role.title}` : ""}.</p>
    <div className="card-grid card-grid-3">{filtered.map((result) => { const candidate = byId.get(result.studentId); if (!candidate) return null; const verified = candidate.skills.filter((skill) => skill.verification !== "self-declared").length; return <Card key={candidate.id} className="h-full"><CardContent className="flex h-full flex-col p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-semibold">{candidate.name}</h2><p className="truncate text-xs text-muted-foreground">{candidate.education.field || "Student"} · {candidate.education.institution || "Education pending"}</p></div>{role && <div className="w-24 shrink-0"><MatchScore score={result.overallScore} size="sm" showBreakdown={false} /></div>}</div><div className="mt-4 flex flex-wrap gap-1.5">{candidate.skills.slice(0, 6).map((skill) => <Badge key={skill.id} variant={skill.verification !== "self-declared" ? "default" : "outline"}>{skill.name} L{skill.level}</Badge>)}</div><div className="mt-auto flex items-center justify-between gap-2 pt-5"><span className="text-xs text-muted-foreground">{verified} verified skill{verified === 1 ? "" : "s"}</span><Button size="sm" variant="outline" onClick={() => router.push(`/student/${candidate.slug}/portfolio`)}>View profile</Button></div></CardContent></Card>; })}</div>
    {filtered.length === 0 && <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No candidates match your search.</CardContent></Card>}
  </div>;
}
