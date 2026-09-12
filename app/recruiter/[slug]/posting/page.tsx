import { getProfileBySlug, getOpportunitiesByRecruiterId } from "@/lib/data";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateOpportunityForm } from "./create-form";
import { MapPin, Clock, Users, Building } from "lucide-react";
import Link from "next/link";
import { SkillRow } from "@/lib/supabase/rows";

export default async function JobPostingPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const supabase = createClient();
  const { data: recruiter } = await supabase.from("recruiters").select("id").eq("id", profile.id).single();
  
  if (!recruiter) {
    notFound();
  }

  const opportunities = await getOpportunitiesByRecruiterId(recruiter.id);
  
  // Fetch skills for the dropdown
  const { data: skillsData } = await supabase.from("skills").select("*").order("name");
  const skills = (skillsData || []) as SkillRow[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job & Internship Posting</h2>
          <p className="text-muted-foreground mt-1">
            Manage your opportunities and create new postings.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Opportunities ({opportunities.length})</TabsTrigger>
          <TabsTrigger value="new">Create New Post</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
              <h3 className="text-lg font-medium mb-2">No active opportunities</h3>
              <p className="text-muted-foreground mb-4">You haven't posted any jobs or internships yet.</p>
              <Button asChild>
                <label htmlFor="new-post-trigger" className="cursor-pointer">Create Your First Post</label>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <Card key={opp.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant={opp.active ? "default" : "secondary"} className="mb-2">
                          {opp.active ? "Active" : "Closed"}
                        </Badge>
                        <CardTitle className="text-xl">{opp.title}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize mt-1">{opp.type}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {opp.location}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {opp.duration || "N/A"}</div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Skills Needed</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.opportunity_skills?.slice(0, 4).map(sk => (
                          <Badge key={sk.skill_id} variant="secondary" className="text-xs">
                            {sk.skills?.name}
                          </Badge>
                        ))}
                        {(opp.opportunity_skills?.length || 0) > 4 && (
                          <Badge variant="outline" className="text-xs">+{opp.opportunity_skills.length - 4}</Badge>
                        )}
                        {(!opp.opportunity_skills || opp.opportunity_skills.length === 0) && (
                          <span className="text-xs text-muted-foreground">No specific skills listed</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-[var(--ng-primary)]" />
                        <span className="font-medium">-- Applications</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/recruiter/${params.slug}/applications?opp=${opp.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Create New Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateOpportunityForm skills={skills} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Invisible trigger to switch tabs from empty state */}
      <input type="radio" id="new-post-trigger" name="tab-switcher" className="hidden" onClick={() => {
        const trigger = document.querySelector('[value="new"]') as HTMLElement;
        if (trigger) trigger.click();
      }} />
    </div>
  );
}
