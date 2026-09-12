import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeRecruiterOnboarding } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function RecruiterOnboardingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if already onboarded
  const { data: recruiter } = await supabase
    .from("recruiters")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (recruiter?.company_id) {
    const { data: profile } = await supabase.from("profiles").select("slug").eq("id", user.id).single();
    if (profile?.slug) {
      redirect(`/recruiter/${profile.slug}/dashboard`);
    } else {
      redirect("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6" data-theme="dark">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[var(--ng-primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tell us about your company to start discovering talent.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>
              This information will be visible to potential candidates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={completeRecruiterOnboarding} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" name="name" required placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" required placeholder="e.g. Technology, Finance" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Input id="size" name="size" required placeholder="e.g. 1-10, 50-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" required placeholder="e.g. San Francisco, CA" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL (Optional)</Label>
                <Input id="logo" name="logo" type="url" placeholder="https://example.com/logo.png" />
              </div>
              <Button type="submit" className="w-full">
                Complete Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
