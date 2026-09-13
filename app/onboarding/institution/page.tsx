"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/lib/role-context";

export default function InstitutionOnboardingPage() {
  const { userName, userSlug } = useRole();
  const router = useRouter();
  const [name, setName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/complete-institution-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, officialEmail, city, state, adminName: userName }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not save institution details.");
      toast.success("Institution details saved.");
      router.push(`/institution/${payload.institutionSlug || userSlug}/dashboard`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save institution details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ng-primary)]"><Building2 className="h-5 w-5 text-white" /></div>
          <CardTitle>Set up your institution</CardTitle>
          <CardDescription>Enter the basic details for the institution workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="institution-name">Institution name</Label><Input id="institution-name" className="mt-1.5" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. RV Institute of Technology" required /></div>
            <div><Label htmlFor="official-email">Official contact email</Label><Input id="official-email" type="email" className="mt-1.5" value={officialEmail} onChange={(event) => setOfficialEmail(event.target.value)} placeholder="admin@institution.edu" required /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="institution-city">City</Label><Input id="institution-city" className="mt-1.5" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Bengaluru" required /></div><div><Label htmlFor="institution-state">State / Region</Label><Input id="institution-state" className="mt-1.5" value={state} onChange={(event) => setState(event.target.value)} placeholder="Karnataka" required /></div></div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Saving details..." : "Create institution workspace"}{!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
