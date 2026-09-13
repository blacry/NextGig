"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRecruiter } from "@/lib/recruiter-context";
import { setApplicationStage, setOpportunityActive } from "@/lib/data";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import type { ApplicationStage } from "@/lib/types";
import { MatchScore } from "@/components/match-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/shared";

export default function RecruiterOpportunitiesPage() {
  const { recruiter, opportunities, applications, candidates, isLoaded, refresh } = useRecruiter();
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const selectedRole = params.get("role");
  const pipelineMode = params.get("view") === "pipeline";
  const pipelineRole = opportunities.find((o) => o.id === selectedRole) ?? opportunities[0];
  const pipelineRows = pipelineRole ? rankCandidatesForOpportunity(candidates, pipelineRole).filter((result) => applications.some((a) => a.opportunityId === pipelineRole.id && a.studentId === result.studentId)) : [];
  const filtered = useMemo(() => opportunities.filter((o) => (!activeOnly || o.active) && `${o.title} ${o.domain} ${o.location}`.toLowerCase().includes(search.toLowerCase())), [opportunities, activeOnly, search]);
  const toggle = async (id: string, active: boolean) => { setBusy(id); try { await setOpportunityActive(id, !active); await refresh(); toast.success(active ? "Role paused" : "Role activated"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update role"); } finally { setBusy(null); } };
  if (!isLoaded) return <div className="card-grid card-grid-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight">Opportunities</h1><p className="mt-1 text-muted-foreground">Manage your roles and move qualified candidates through each pipeline.</p></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total roles</p><p className="mt-1 text-2xl font-bold">{opportunities.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Active roles</p><p className="mt-1 text-2xl font-bold text-[var(--ng-success)]">{opportunities.filter((o) => o.active).length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Applications</p><p className="mt-1 text-2xl font-bold">{applications.length}</p></CardContent></Card></div>
    <div className="flex flex-col gap-3 sm:flex-row"><Input placeholder="Search roles, domains, or locations..." value={search} onChange={(e) => setSearch(e.target.value)} /><Button variant={activeOnly ? "default" : "outline"} onClick={() => setActiveOnly((value) => !value)}>{activeOnly ? "Active only" : "All roles"}</Button></div>
    {pipelineMode && pipelineRole && <Card><CardHeader><CardTitle>Candidate pipeline · {pipelineRole.title}</CardTitle></CardHeader><CardContent className="space-y-3">{pipelineRows.length ? pipelineRows.map((result) => { const candidate = candidates.find((c) => c.id === result.studentId); const application = applications.find((a) => a.opportunityId === pipelineRole.id && a.studentId === result.studentId); if (!candidate || !application) return null; return <div key={application.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="font-medium">{candidate.name}</p><p className="text-xs text-muted-foreground">{candidate.education.institution || "Profile available"}</p></div><div className="w-full sm:w-44"><MatchScore score={result.overallScore} size="sm" showBreakdown={false} /></div><select aria-label={`Stage for ${candidate.name}`} value={application.currentStage} onChange={async (e) => { try { await setApplicationStage(application.id, e.target.value as ApplicationStage); await refresh(); toast.success("Stage updated"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update stage"); } }} className="h-9 rounded-md border border-input bg-background px-2 text-xs"><option value={application.currentStage}>{application.currentStage}</option><option value="screening">Screening</option><option value="interview">Interview</option><option value="assessment">Assessment</option><option value="offer">Offer</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select><Button size="sm" variant="ghost" onClick={() => router.push(`/student/${candidate.slug}/portfolio`)}>Profile</Button></div>; }) : <p className="py-8 text-center text-sm text-muted-foreground">No applicants for this role yet.</p>}</CardContent></Card>}
    <div className="space-y-4">{filtered.map((opportunity) => { const count = applications.filter((a) => a.opportunityId === opportunity.id).length; const isSelected = selectedRole === opportunity.id; return <Card key={opportunity.id} className={isSelected ? "border-[var(--ng-primary)]" : ""}><CardHeader className="flex flex-row items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><CardTitle className="truncate">{opportunity.title}</CardTitle><Badge variant={opportunity.active ? "default" : "secondary"}>{opportunity.active ? "Active" : "Paused"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{opportunity.domain} · {opportunity.location} · {opportunity.type}</p></div><span className="shrink-0 text-sm text-muted-foreground">{count} applicant{count === 1 ? "" : "s"}</span></CardHeader><CardContent><p className="line-clamp-2 text-sm text-muted-foreground">{opportunity.description}</p><div className="mt-4 flex flex-wrap gap-2">{opportunity.requiredSkills.slice(0, 5).map((skill) => <Badge key={skill.skillId} variant="outline">{skill.skillName} · L{skill.requiredLevel}</Badge>)}</div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => router.push(`/recruiter/${recruiter?.slug}/opportunities?role=${opportunity.id}&view=pipeline`)}>Open pipeline</Button><Button variant="outline" onClick={() => router.push(`/recruiter/${recruiter?.slug}/talent?role=${opportunity.id}`)}>Find talent</Button><Button variant="ghost" disabled={busy === opportunity.id} onClick={() => void toggle(opportunity.id, opportunity.active)}>{busy === opportunity.id ? "Saving..." : opportunity.active ? "Pause role" : "Activate role"}</Button></div></CardContent></Card>; })}</div>
    {filtered.length === 0 && <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No opportunities match your filters.</CardContent></Card>}
  </div>;
}
