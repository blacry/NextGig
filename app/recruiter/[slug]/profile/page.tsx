import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default async function CompanyProfilePage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const supabase = createClient();
  const { data: recruiter } = await supabase.from("recruiters").select("id, company_id").eq("id", profile.id).single();
  
  if (!recruiter || !recruiter.company_id) {
    notFound();
  }

  const { data: company } = await supabase.from("companies").select("*").eq("id", recruiter.company_id).single();
  
  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground mt-1">
            Manage your company's identity and hiring presence.
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl bg-[var(--ng-primary)]/10 flex items-center justify-center text-[var(--ng-primary)] font-bold text-2xl">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-xl">{company.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {company.industry} &bull; {company.size} employees &bull; {company.location}
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">Verified Company</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" defaultValue={company.name} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" defaultValue={company.industry} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <Input id="size" defaultValue={company.size || ""} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={company.location || ""} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about">About Company</Label>
              <Textarea id="about" className="h-24" defaultValue="We build innovative products." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Snapshot (2026-27)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">Active Opportunities</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">18</div>
                <div className="text-sm text-muted-foreground">Selected Candidates</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-sm text-muted-foreground">Institution Partnerships</div>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Core Skill Families</div>
              </div>
            </div>

            <h4 className="font-semibold mt-6 mb-3">Skills We Hire For</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">AI/ML</Badge>
              <Badge variant="secondary">AWS</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">SQL</Badge>
              <Badge variant="secondary">Communication</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
