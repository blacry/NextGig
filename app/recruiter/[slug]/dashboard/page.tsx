import { getProfileBySlug, getOpportunitiesByRecruiterId, getApplicationsByOpportunityIds } from "@/lib/data";
import { notFound } from "next/navigation";
import { KpiCard } from "@/components/industry/kpi-card";
import { Briefcase, GraduationCap, Users, UserCheck, Percent, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function RecruiterDashboardPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const opportunities = await getOpportunitiesByRecruiterId(profile.id);
  
  const activeJobs = opportunities.filter(o => o.active && o.type !== "internship");
  const activeInternships = opportunities.filter(o => o.active && o.type === "internship");

  const opportunityIds = opportunities.map(o => o.id);
  const applications = await getApplicationsByOpportunityIds(opportunityIds);

  const shortlistedStages = ["interview", "assessment", "offer", "accepted"];
  const shortlistedCount = applications.filter(a => shortlistedStages.includes(a.current_stage)).length;

  const offersExtended = applications.filter(a => ["offer", "accepted"].includes(a.current_stage)).length;
  const offersAccepted = applications.filter(a => a.current_stage === "accepted").length;
  const offerAcceptRate = offersExtended > 0 ? Math.round((offersAccepted / offersExtended) * 100) : 0;

  const upcomingInterviews = applications.filter(a => a.current_stage === "interview").length;

  // Recent applicants (last 5)
  const recentApplicants = [...applications]
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 5);

  const getStageBadgeColor = (stage: string) => {
    switch(stage) {
      case "applied": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "screening": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "interview": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "assessment": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "offer": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "accepted": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "withdrawn": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Here is what is happening across your job postings today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Active Job Posts" value={activeJobs.length} icon={Briefcase} iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400" />
        <KpiCard title="Active Internships" value={activeInternships.length} icon={GraduationCap} iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400" />
        <KpiCard title="Total Applications" value={applications.length} icon={Users} iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400" />
        <KpiCard title="Shortlisted" value={shortlistedCount} icon={UserCheck} iconClassName="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400" />
        <KpiCard title="Offer Accept Rate" value={`${offerAcceptRate}%`} icon={Percent} iconClassName="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400" />
        <KpiCard title="Upcoming Interviews" value={upcomingInterviews} icon={Calendar} iconClassName="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplicants.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No applications yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant ID</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplicants.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium text-xs">{app.student_id.substring(0,8)}...</TableCell>
                      <TableCell>{opportunities.find(o => o.id === app.opportunity_id)?.title || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStageBadgeColor(app.current_stage)}>
                          {app.current_stage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(app.applied_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border">
                <span className="font-medium">Total Applications</span>
                <span className="font-bold text-lg">{applications.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
                <span className="font-medium">Screening</span>
                <span className="font-bold text-lg">{applications.filter(a => a.current_stage === "screening").length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400">
                <span className="font-medium">Interview / Assessment</span>
                <span className="font-bold text-lg">{applications.filter(a => ["interview", "assessment"].includes(a.current_stage)).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <span className="font-medium">Offers / Hired</span>
                <span className="font-bold text-lg">{applications.filter(a => ["offer", "accepted"].includes(a.current_stage)).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
