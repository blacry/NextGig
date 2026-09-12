import { getStudents, getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function TalentDiscoveryPage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile || profile.role !== "recruiter") {
    notFound();
  }

  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Talent Discovery</h2>
          <p className="text-muted-foreground mt-1">
            Find candidates based on verified skills, experience, projects, and career readiness.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students by skill, role, technology or project..." className="pl-10 h-11" />
        </div>
        <Button className="h-11 px-8">Search</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="h-8 cursor-pointer hover:bg-secondary">Skills</Badge>
        <Badge variant="outline" className="h-8 cursor-pointer hover:bg-secondary">Role</Badge>
        <Badge variant="outline" className="h-8 cursor-pointer hover:bg-secondary">Experience</Badge>
        <Badge variant="outline" className="h-8 cursor-pointer hover:bg-secondary">Location</Badge>
        <Badge variant="outline" className="h-8 cursor-pointer hover:bg-secondary">Education</Badge>
        <Badge variant="outline" className="h-8 cursor-pointer bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
          ✨ AI Skill Match
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {students.map((student) => {
          // Calculate mock match percentage based on skills count
          const matchPercentage = Math.min(100, Math.max(50, 60 + student.student_skills.length * 5));
          
          return (
            <Card key={student.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--ng-primary)]/10 flex items-center justify-center text-[var(--ng-primary)] font-bold text-xl">
                      {student.profiles?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{student.profiles?.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.degree} in {student.field}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{student.institution} &bull; Class of {student.year}</span>
                  </div>
                  {student.gpa && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium bg-muted px-1.5 py-0.5 rounded">GPA: {student.gpa}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Top Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {student.student_skills.slice(0, 5).map((sk) => (
                      <Badge key={sk.skills?.name} variant="secondary" className="text-xs font-medium">
                        {sk.skills?.name}
                        {sk.verification === "verified" && <CheckCircle className="w-3 h-3 ml-1 text-emerald-500" />}
                      </Badge>
                    ))}
                    {student.student_skills.length > 5 && (
                      <Badge variant="outline" className="text-xs">+{student.student_skills.length - 5} more</Badge>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">AI MATCH</span>
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{matchPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${matchPercentage}%` }} />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button className="w-full" asChild variant="outline">
                  <Link href={`/recruiter/${params.slug}/talent/${student.profiles?.slug || student.id}`}>
                    View Full Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
