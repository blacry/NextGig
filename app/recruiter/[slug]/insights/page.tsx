import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Globe, Zap, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function InsightsPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Industry Insights</h2>
          <p className="text-muted-foreground mt-1">
            Stay ahead with real-time market intelligence and skill trends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg">Trending Skills (Q3 2026)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Generative AI</span>
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-100">+45%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">MLOps</span>
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-100">+32%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Cloud Native Apps</span>
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-100">+28%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Cybersecurity</span>
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-100">+22%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Web3 Development</span>
                <Badge variant="secondary" className="text-red-600 bg-red-100">-12%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Compensation Benchmarks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Software Engineer (Entry)</span>
                  <span>$80k - $120k</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[60%]" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>AI/ML Engineer (Entry)</span>
                  <span>$100k - $150k</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[75%]" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Data Analyst (Entry)</span>
                  <span>$65k - $95k</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[45%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg">Global Hiring Sentiment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[180px] text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">Strong</div>
              <p className="text-sm text-muted-foreground">
                Hiring sentiment in technology remains strong with a focus on specialized AI talent and cloud infrastructure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Emerging Roles (Next 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">AI Prompt Engineer</h4>
              </div>
              <p className="text-sm text-muted-foreground">High demand across all sectors to maximize value from LLMs.</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">Sustainable Tech Architect</h4>
              </div>
              <p className="text-sm text-muted-foreground">Focus on optimizing compute resources and green cloud deployments.</p>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">Spatial Computing Dev</h4>
              </div>
              <p className="text-sm text-muted-foreground">Growing need for AR/VR talent for enterprise applications.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
