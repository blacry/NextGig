import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/industry/kpi-card";
import { ProgressBar } from "@/components/industry/progress-bar";
import { Briefcase, FileText, Star, TrendingUp, Info } from "lucide-react";

export default function IndustryDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading mb-2">Good Morning, Talent Team 👋</h2>
          <p className="text-muted-foreground">Discover skilled talent, manage hiring, and connect with the SkillBridge ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <option>2026–27</option>
            <option>2025–26</option>
          </select>
          <Button className="bg-[#b7e8be] hover:bg-[#a6d8ae] text-[#174f43] font-semibold">
            + Create Opportunity
          </Button>
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl p-4 flex items-start gap-3 text-sm text-emerald-800 dark:text-emerald-200">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-bold">Skill-based hiring:</span> Match candidates using verified skills, projects, certifications and career readiness—not just degrees.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Job Posts"
          value="24"
          icon={Briefcase}
          trend={{ value: "8.4%", isPositive: true }}
          iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
        />
        <KpiCard
          title="Active Internships"
          value="18"
          icon={TrendingUp}
          trend={{ value: "12.2%", isPositive: true }}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        />
        <KpiCard
          title="Applications"
          value="486"
          icon={FileText}
          trend={{ value: "16.8%", isPositive: true }}
          iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        />
        <KpiCard
          title="Shortlisted Candidates"
          value="72"
          icon={Star}
          trend={{ value: "9.5%", isPositive: true }}
          iconClassName="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
        />
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Talent Skill Distribution</CardTitle>
                <CardDescription>Available talent</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar label="AI / ML" percentage={78} colorClass="bg-emerald-400" />
            <ProgressBar label="Software Development" percentage={84} colorClass="bg-teal-600" />
            <ProgressBar label="Data Analytics" percentage={71} colorClass="bg-blue-400" />
            <ProgressBar label="Cloud / DevOps" percentage={67} colorClass="bg-purple-400" />
            <ProgressBar label="Cybersecurity" percentage={54} colorClass="bg-orange-400" />
            <ProgressBar label="UI/UX" percentage={62} colorClass="bg-blue-400" />
            <ProgressBar label="Communication" percentage={81} colorClass="bg-emerald-400" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Hiring Activity</CardTitle>
                <CardDescription>Latest opportunities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { role: "Google Cloud Intern", stats: "42 applications · 8 shortlisted", badge: "Active", color: "bg-blue-100 text-blue-700" },
              { role: "AI/ML Engineer", stats: "67 applications · 12 shortlisted", badge: "Active", color: "bg-purple-100 text-purple-700" },
              { role: "Frontend Developer", stats: "54 applications · 9 shortlisted", badge: "Active", color: "bg-emerald-100 text-emerald-700" },
              { role: "Data Analyst", stats: "38 applications · 7 shortlisted", badge: "Active", color: "bg-orange-100 text-orange-700" },
            ].map((opp, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/50 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm">{opp.role}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{opp.stats}</p>
                </div>
                <Badge variant="secondary" className={opp.color}>{opp.badge}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
            <CardDescription>Current cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { step: "Applications", val: 486 },
                { step: "Reviewed", val: 294 },
                { step: "Shortlisted", val: 72 },
                { step: "Interview", val: 39 },
                { step: "Selected", val: 18 },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm font-semibold">
                  <span>{row.step}</span>
                  <span>{row.val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Skill Demand</CardTitle>
            <CardDescription>Open roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar label="Python" percentage={86} colorClass="bg-teal-600" />
            <ProgressBar label="Cloud / AWS" percentage={74} colorClass="bg-blue-400" />
            <ProgressBar label="React" percentage={68} colorClass="bg-purple-400" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time to Hire</CardTitle>
            <CardDescription>Average duration</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center">
            <div className="text-5xl font-black font-heading mb-2">18 days</div>
            <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium mb-4">↓ 3.2 days faster than previous cycle</p>
            <Badge className="w-fit">Healthy hiring velocity</Badge>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
