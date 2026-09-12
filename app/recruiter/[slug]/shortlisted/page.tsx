import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Phone, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function ShortlistedPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const supabase = createClient();
  const { data: recruiter } = await supabase.from("recruiters").select("id").eq("id", profile.id).single();
  
  if (!recruiter) {
    notFound();
  }

  // Fetch applications that are shortlisted (e.g., screening, interview, assessment, offer)
  const { data: applicationsData, error } = await supabase
    .from("applications")
    .select(`
      id,
      current_stage,
      applied_at,
      opportunities!inner (id, title, recruiter_id),
      students (
        id,
        degree,
        field,
        institution,
        year,
        profiles (name, slug, email)
      )
    `)
    .eq("opportunities.recruiter_id", recruiter.id)
    .in("current_stage", ["screening", "interview", "assessment", "offer"])
    .order("applied_at", { ascending: false });

  const applications = applicationsData || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shortlisted Candidates</h2>
          <p className="text-muted-foreground mt-1">
            Candidates currently advancing through your active hiring pipelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed">
            <h3 className="text-lg font-medium mb-2">No shortlisted candidates</h3>
            <p className="text-muted-foreground mb-4">Move candidates to screening or interview stages to see them here.</p>
            <Button asChild variant="outline">
              <Link href={`/recruiter/${params.slug}/applications`}>View All Applications</Link>
            </Button>
          </div>
        ) : (
          applications.map((app: any) => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--ng-primary)]/10 flex items-center justify-center text-[var(--ng-primary)] font-bold text-xl">
                      {app.students?.profiles?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{app.students?.profiles?.name}</h3>
                      <p className="text-sm font-medium text-[var(--ng-primary)] mt-1">{app.opportunities?.title}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 flex-1 space-y-4">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{app.students?.degree} in {app.students?.field}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{app.students?.institution} (Class of {app.students?.year})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{app.students?.profiles?.email}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg border flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current Stage</div>
                    <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                      {app.current_stage}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Applied</div>
                    <div className="text-sm font-medium">{formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/recruiter/${params.slug}/talent/${app.students?.profiles?.slug}`}>
                      Review Profile
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
