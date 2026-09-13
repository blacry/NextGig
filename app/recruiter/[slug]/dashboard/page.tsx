"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRecruiter } from "@/lib/recruiter-context";
import { rankCandidatesForOpportunity } from "@/lib/matching";
import { setApplicationStage, updateOpportunityRequirements } from "@/lib/data";
import { TERMINAL_STAGES, type ApplicationStage } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { MatchScore } from "@/components/match-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/shared";

const stages: ApplicationStage[] = ["applied", "screening", "interview", "assessment", "offer", "accepted", "rejected"];
const stageLabel = (stage: string) => stage.charAt(0).toUpperCase() + stage.slice(1);

export default function RecruiterDashboardPage() {
  const { recruiter, company, opportunities, candidates, applications, isLoaded, refresh } = useRecruiter();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [detailSkill, setDetailSkill] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Array<{ skillId: string; skillName: string; requiredLevel: number; preferred: boolean }>>([]);

  const featured = opportunities.find((o) => o.id === selectedId) ?? opportunities[0];
  const ranked = useMemo(() => featured ? rankCandidatesForOpportunity(candidates, featured).slice(0, 6) : [], [featured, candidates]);
  const candidateById = useMemo(() => new Map(candidates.map((c) => [c.id, c])), [candidates]);
  const appByStudent = useMemo(() => new Map(applications.filter((a) => a.opportunityId === featured?.id).map((a) => [a.studentId, a])), [applications, featured]);

  const supply = useMemo(() => {
    if (!featured || candidates.length === 0) return [];
    return [...featured.requiredSkills, ...featured.preferredSkills].map((requirement) => {
      const qualified = candidates.filter((candidate) => candidate.skills.some((skill) => skill.id === requirement.skillId && skill.level >= requirement.requiredLevel)).length;
      return { ...requirement, qualified, percentage: Math.round((qualified / candidates.length) * 100) };
    }).sort((a, b) => a.percentage - b.percentage);
  }, [featured, candidates]);

  const openEditor = () => {
    if (!featured) return;
    setDraft([...featured.requiredSkills, ...featured.preferredSkills].map((r) => ({ ...r, requiredLevel: Number(r.requiredLevel) })));
    setEditing(true);
  };
  const saveRequirements = async () => {
    if (!featured) return;
    setSaving(true);
    try {
      await updateOpportunityRequirements(featured.id, draft);
      await refresh();
      setEditing(false);
      toast.success("Requirements updated");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update requirements"); }
    finally { setSaving(false); }
  };
  const changeStage = async (applicationId: string, stage: ApplicationStage) => {
    try { await setApplicationStage(applicationId, stage); await refresh(); toast.success("Pipeline stage updated"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not update stage"); }
  };

  if (!isLoaded) return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>;
  const activeRoles = opportunities.filter((o) => o.active).length;
  const highMatchRate = featured && candidates.length ? Math.round((rankCandidatesForOpportunity(candidates, featured).filter((r) => r.overallScore > 80).length / candidates.length) * 100) : 0;

  return <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
      <p className="mt-1 text-muted-foreground">{company ? `Overview of ${company.name}'s active pipelines and talent matches.` : "Overview of your active pipelines and talent matches."}</p>
    </motion.div>

    <div className="card-grid card-grid-3 lg:grid-cols-4">
      <StatCard index={0} title="Active Roles" value={activeRoles} description={`${opportunities.length} posted in total`} />
      <StatCard index={1} title="Total Candidates" value={candidates.length} description="Onboarded and searchable" />
      <StatCard index={2} title="Applications" value={applications.length} description="Across your roles" />
      <StatCard index={3} title="High Match Rate" value={highMatchRate} suffix="%" description="Candidates above 80%" />
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium" htmlFor="dashboard-role">Analyze role</label>
      <select id="dashboard-role" value={featured?.id ?? ""} onChange={(e) => { setSelectedId(e.target.value); setDetailSkill(null); }} className="h-10 min-w-56 rounded-md border border-input bg-background px-3 text-sm">
        {opportunities.length === 0 && <option value="">No roles yet</option>}
        {opportunities.map((opportunity) => <option key={opportunity.id} value={opportunity.id}>{opportunity.title}</option>)}
      </select>
      {featured && <Button variant="outline" onClick={() => router.push(`/recruiter/${recruiter?.slug}/opportunities?role=${featured.id}`)}>View role</Button>}
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-3"><div><CardTitle>Top Candidate Pipeline</CardTitle><p className="mt-1 text-sm text-muted-foreground">{featured ? `Best matches for ${featured.title}` : "Post an opportunity to start matching."}</p></div><Button size="sm" variant="outline" disabled={!featured} onClick={() => router.push(`/recruiter/${recruiter?.slug}/opportunities?role=${featured?.id}&view=pipeline`)}>View All</Button></CardHeader>
        <CardContent className="space-y-3">
          {ranked.length ? ranked.map((result, index) => { const student = candidateById.get(result.studentId); if (!student) return null; const app = appByStudent.get(student.id); return <motion.div key={student.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-semibold">{student.name}</p><Badge variant="secondary">{app ? stageLabel(app.currentStage) : "New match"}</Badge></div><p className="truncate text-xs text-muted-foreground">{student.education.institution || student.education.field || "Profile available"}</p></div>
            <div className="w-full sm:w-48"><MatchScore score={result.overallScore} size="sm" showBreakdown={false} /></div>
            {app && !TERMINAL_STAGES.includes(app.currentStage) && <select aria-label={`Stage for ${student.name}`} value={app.currentStage} onChange={(e) => void changeStage(app.id, e.target.value as ApplicationStage)} className="h-9 rounded-md border border-input bg-background px-2 text-xs"><option value={app.currentStage}>{stageLabel(app.currentStage)}</option>{stages.filter((stage) => stage !== app.currentStage).map((stage) => <option key={stage} value={stage}>{stageLabel(stage)}</option>)}</select>}
            <Button size="sm" variant="ghost" onClick={() => router.push(`/student/${student.slug}/portfolio`)}>View Profile</Button>
          </motion.div>; }) : <div className="py-8 text-center text-sm text-muted-foreground">{featured ? "No onboarded candidates to rank yet." : "Post an opportunity to start matching candidates."}</div>}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-[var(--ng-primary)]/30 bg-[var(--ng-primary)]/5"><CardHeader className="pb-2"><CardTitle className="text-sm">Sourcing Insight</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">{supply[0] ? <><strong className="text-foreground">{supply[0].skillName}</strong> is the scarcest requirement with {supply[0].percentage}% pool coverage.</> : "Select a role to see supply signals."}</p><Button size="sm" variant="secondary" className="mt-4 w-full" disabled={!featured} onClick={openEditor}>Adjust Requirements</Button></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm">Skill Supply vs Demand</CardTitle><p className="text-xs text-muted-foreground">Click a skill for qualified-candidate detail</p></CardHeader><CardContent>{supply.length ? <div className="space-y-2">{supply.map((item) => <button key={item.skillId} onClick={() => setDetailSkill(detailSkill === item.skillId ? null : item.skillId)} className="w-full rounded-lg p-2 text-left hover:bg-muted/60"><div className="mb-1 flex justify-between gap-2 text-xs"><span className="truncate">{item.skillName}{item.preferred ? " · preferred" : ""}</span><span className="font-semibold">{item.percentage}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${item.percentage < 40 ? "bg-[var(--ng-critical)]" : item.percentage < 70 ? "bg-[var(--ng-warning)]" : "bg-[var(--ng-success)]"}`} style={{ width: `${item.percentage}%` }} /></div>{detailSkill === item.skillId && <p className="mt-2 text-xs text-muted-foreground">{item.qualified} of {candidates.length} candidates meet Level {item.requiredLevel}.</p>}</button>)}</div> : <p className="py-4 text-center text-sm text-muted-foreground">No requirements to analyze.</p>}</CardContent></Card>
      </div>
    </div>

    {editing && featured && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><Card className="max-h-[90vh] w-full max-w-lg overflow-auto"><CardHeader><CardTitle>Adjust requirements</CardTitle><p className="text-sm text-muted-foreground">Tune the skills for {featured.title}.</p></CardHeader><CardContent className="space-y-3">{draft.map((item, index) => <div key={item.skillId} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-lg border p-3"><span className="min-w-0 truncate text-sm font-medium">{item.skillName}</span><select value={item.requiredLevel} onChange={(e) => setDraft((current) => current.map((r, i) => i === index ? { ...r, requiredLevel: Number(e.target.value) } : r))} className="h-9 rounded-md border border-input bg-background px-2 text-sm">{[1,2,3,4,5].map((level) => <option key={level} value={level}>L{level}</option>)}</select><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={item.preferred} onChange={(e) => setDraft((current) => current.map((r, i) => i === index ? { ...r, preferred: e.target.checked } : r))} /> Preferred</label></div>)}<div className="flex justify-end gap-2 pt-3"><Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button><Button disabled={saving} onClick={() => void saveRequirements()}>{saving ? "Saving..." : "Save changes"}</Button></div></CardContent></Card></div>}
  </div>;
}
