import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function RequirementsPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const supabase = createClient();
  const { data: recruiter } = await supabase.from("recruiters").select("id").eq("id", profile.id).single();
  
  if (!recruiter) {
    notFound();
  }

  // Get skills requested by this recruiter in their opportunities
  const { data: opps } = await supabase
    .from("opportunities")
    .select("id")
    .eq("recruiter_id", recruiter.id);
    
  const oppIds = (opps || []).map(o => o.id);
  
  let requiredSkills: any[] = [];
  if (oppIds.length > 0) {
    const { data: skillsData } = await supabase
      .from("opportunity_skills")
      .select("skill_id, skills(name)")
      .in("opportunity_id", oppIds);
      
    // Count skill frequencies
    const skillCounts: Record<string, {name: string, count: number}> = {};
    skillsData?.forEach((s: any) => {
      const name = s.skills?.name;
      if (name) {
        if (!skillCounts[name]) skillCounts[name] = { name, count: 0 };
        skillCounts[name].count++;
      }
    });
    
    requiredSkills = Object.values(skillCounts).sort((a, b) => b.count - a.count);
  }

  // Mock data for industry demand vs talent
  const industryDemand = [
    { name: "Generative AI", demand: 91 },
    { name: "Cloud Security", demand: 82 },
    { name: "MLOps", demand: 77 },
    { name: "Data Engineering", demand: 71 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Skill Requirements</h2>
          <p className="text-muted-foreground mt-1">
            Define and analyze the skill demand for your organization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Organization's Most Requested Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requiredSkills.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                No skills requested yet. Post opportunities to define your skill requirements.
              </div>
            ) : (
              requiredSkills.slice(0, 5).map((skill, index) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">
                      {index + 1}
                    </span>
                    {skill.name}
                  </div>
                  <span className="text-muted-foreground text-sm">{skill.count} postings</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Demand vs Available Talent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {industryDemand.map(item => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground font-bold">{item.demand}% Gap</span>
                </div>
                <Progress value={item.demand} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
