import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function ApplicationsPage({ params, searchParams }: { params: { slug: string }, searchParams: { opp?: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const supabase = createClient();
  const { data: recruiter } = await supabase.from("recruiters").select("id").eq("id", profile.id).single();
  
  if (!recruiter) {
    notFound();
  }

  // Fetch opportunities for the filter
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title")
    .eq("recruiter_id", recruiter.id);

  // Determine which opportunity to filter by (or all if opp is missing/invalid)
  const oppFilter = searchParams.opp;
  let applicationsQuery = supabase
    .from("applications")
    .select(`
      id,
      current_stage,
      applied_at,
      opportunities!inner (id, title, recruiter_id),
      students (
        id,
        degree,
        institution,
        profiles (name, slug)
      )
    `)
    .eq("opportunities.recruiter_id", recruiter.id);

  if (oppFilter && oppFilter !== "all") {
    applicationsQuery = applicationsQuery.eq("opportunity_id", oppFilter);
  }

  const { data: applicationsData, error } = await applicationsQuery;
  const applications = applicationsData || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground mt-1">
            Review and manage candidates in your recruitment pipeline.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-card p-2 rounded-lg border">
        <Tabs defaultValue={oppFilter || "all"} className="w-full">
          <TabsList className="bg-transparent overflow-x-auto justify-start flex-nowrap w-full">
            <Link href={`/recruiter/${params.slug}/applications`} passHref legacyBehavior>
              <TabsTrigger value="all" asChild>
                <a>All Roles</a>
              </TabsTrigger>
            </Link>
            {opportunities?.map(opp => (
              <Link key={opp.id} href={`/recruiter/${params.slug}/applications?opp=${opp.id}`} passHref legacyBehavior>
                <TabsTrigger value={opp.id} asChild>
                  <a>{opp.title}</a>
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--ng-primary)]/10 flex items-center justify-center text-[var(--ng-primary)] font-bold text-xs">
                          {app.students?.profiles?.name?.charAt(0) || "?"}
                        </div>
                        {app.students?.profiles?.name}
                      </div>
                    </TableCell>
                    <TableCell>{app.opportunities?.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">{app.students?.institution}</div>
                      <div className="text-xs text-muted-foreground">{app.students?.degree}</div>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        app.current_stage === 'rejected' ? 'destructive' :
                        app.current_stage === 'hired' ? 'default' :
                        app.current_stage === 'offer' ? 'default' :
                        'secondary'
                      } className="capitalize">
                        {app.current_stage.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/recruiter/${params.slug}/talent/${app.students?.profiles?.slug}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button variant="secondary" size="sm">Update Status</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
