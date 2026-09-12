import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, CheckCircle } from "lucide-react";

export default async function AnalyticsPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const supabase = createClient();
  const { data: recruiter } = await supabase.from("recruiters").select("id").eq("id", profile.id).single();
  
  if (!recruiter) {
    notFound();
  }

  // Fetch opportunities and applications
  const { data: opps } = await supabase.from("opportunities").select("id").eq("recruiter_id", recruiter.id);
  const oppIds = (opps || []).map(o => o.id);
  
  let totalApps = 0;
  let hiredApps = 0;
  let stageBreakdown: Record<string, number> = {};

  if (oppIds.length > 0) {
    const { data: apps } = await supabase
      .from("applications")
      .select("id, current_stage")
      .in("opportunity_id", oppIds);
      
    if (apps) {
      totalApps = apps.length;
      hiredApps = apps.filter(a => a.current_stage === "hired" || a.current_stage === "accepted").length;
      
      apps.forEach(a => {
        stageBreakdown[a.current_stage] = (stageBreakdown[a.current_stage] || 0) + 1;
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hiring Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Track your recruitment performance and pipeline health.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Applications</div>
              <div className="text-2xl font-bold">{totalApps}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Hires</div>
              <div className="text-2xl font-bold">{hiredApps}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
              <div className="text-2xl font-bold">{totalApps > 0 ? Math.round((hiredApps / totalApps) * 100) : 0}%</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Time to Hire</div>
              <div className="text-2xl font-bold">14 days</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Stages</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stageBreakdown).length === 0 ? (
              <div className="text-sm text-muted-foreground">No applications in pipeline yet.</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(stageBreakdown).map(([stage, count]) => (
                  <div key={stage} className="flex justify-between items-center">
                    <span className="capitalize text-sm font-medium">{stage.replace('_', ' ')}</span>
                    <div className="flex items-center gap-4 w-2/3">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(count / totalApps) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
