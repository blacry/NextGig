"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole } from "@/lib/role-context";
import type { InstitutionDetails } from "@/lib/types";

const INSTITUTION_TYPES = ["University", "Institute of Technology", "College", "Autonomous Institute", "Polytechnic"];
const COHORT_SIZES = ["Under 500 students", "500 - 1,000 students", "1,000 - 3,000 students", "3,000 - 10,000 students", "10,000+ students"];

export default function InstitutionOnboardingPage() {
  const { userName } = useRole();
  const router = useRouter();
  const [form, setForm] = useState<InstitutionDetails>({ name: "", code: "", type: "University", officialEmail: "", websiteUrl: "", phone: "", address: "", city: "", state: "", country: "India", adminName: userName, adminRole: "Head of Training & Placements", cohortSize: "", programsOffered: [] });
  const [programs, setPrograms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof InstitutionDetails>(key: K, value: InstitutionDetails[K]) => setForm((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    const details = { ...form, programsOffered: programs.split(",").map((program) => program.trim()).filter(Boolean) };
    try {
      const response = await fetch("/api/complete-institution-onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(details) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not create the institution workspace.");
      const institutionSlug = payload.institutionSlug as string;
      localStorage.setItem(`nextgig-institution-${institutionSlug}-details`, JSON.stringify(details));
      localStorage.setItem(`nextgig-institution-${institutionSlug}-onboarding`, "true");
      toast.success("Institution workspace created.");
      router.replace(`/institution/${institutionSlug}/dashboard`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the institution workspace.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ng-primary)]"><Building2 className="h-5 w-5 text-white" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight">Create your institution workspace</h1><p className="mt-1 text-sm text-muted-foreground">Set up the campus profile your students, faculty, and placement team will use.</p></div>
      </div>
      <Card>
        <CardHeader><CardTitle>Institution details</CardTitle><CardDescription>Fields marked required are needed to create and identify your campus dashboard.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-7">
            <section className="space-y-4">
              <h2 className="text-sm font-semibold">Campus profile</h2>
              <div className="grid gap-4 sm:grid-cols-[1fr_160px]"><Field label="Institution name" htmlFor="institution-name" required><Input id="institution-name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Indian Institute of Technology Bombay" required /></Field><Field label="Short code" htmlFor="institution-code"><Input id="institution-code" value={form.code} onChange={(event) => update("code", event.target.value.toUpperCase())} placeholder="e.g. IITB" /></Field></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Institution type" htmlFor="institution-type" required><Select id="institution-type" value={form.type} onChange={(event) => update("type", event.target.value)} options={INSTITUTION_TYPES} /></Field><Field label="Official contact email" htmlFor="institution-email" required><Input id="institution-email" type="email" value={form.officialEmail} onChange={(event) => update("officialEmail", event.target.value)} placeholder="placements@institution.edu" required /></Field></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Website" htmlFor="institution-website"><Input id="institution-website" type="url" value={form.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://institution.edu" /></Field><Field label="Phone" htmlFor="institution-phone"><Input id="institution-phone" type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+91 12345 67890" /></Field></div>
            </section>
            <section className="space-y-4 border-t pt-6">
              <h2 className="text-sm font-semibold">Campus location</h2>
              <Field label="Street address" htmlFor="institution-address"><Input id="institution-address" value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Main campus address" /></Field>
              <div className="grid gap-4 sm:grid-cols-3"><Field label="City" htmlFor="institution-city" required><Input id="institution-city" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Mumbai" required /></Field><Field label="State / region" htmlFor="institution-state" required><Input id="institution-state" value={form.state} onChange={(event) => update("state", event.target.value)} placeholder="Maharashtra" required /></Field><Field label="Country" htmlFor="institution-country" required><Input id="institution-country" value={form.country} onChange={(event) => update("country", event.target.value)} required /></Field></div>
            </section>
            <section className="space-y-4 border-t pt-6">
              <h2 className="text-sm font-semibold">Primary dashboard administrator</h2>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" htmlFor="admin-name" required><Input id="admin-name" value={form.adminName} onChange={(event) => update("adminName", event.target.value)} required /></Field><Field label="Role / designation" htmlFor="admin-role" required><Input id="admin-role" value={form.adminRole} onChange={(event) => update("adminRole", event.target.value)} required /></Field></div>
            </section>
            <section className="space-y-4 border-t pt-6">
              <h2 className="text-sm font-semibold">Student community</h2>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Student cohort size" htmlFor="cohort-size"><Select id="cohort-size" value={form.cohortSize ?? ""} onChange={(event) => update("cohortSize", event.target.value)} options={COHORT_SIZES} placeholder="Select size" /></Field><Field label="Programs offered" htmlFor="programs"><Input id="programs" value={programs} onChange={(event) => setPrograms(event.target.value)} placeholder="B.Tech, M.Tech, MBA" /></Field></div>
              <p className="text-xs text-muted-foreground">Separate programs with commas. You can update these details later.</p>
            </section>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground"><CheckCircle2 className="mr-2 inline h-4 w-4 text-[var(--ng-primary)]" />Your workspace is created for your institution and its administrators—not for an individual student profile.</div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating workspace..." : "Create institution workspace"}{!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function Field({ children, htmlFor, label, required = false }: { children: React.ReactNode; htmlFor: string; label: string; required?: boolean }) {
  return <div><Label htmlFor={htmlFor} className="mb-1.5 block text-xs">{label}{required && <span className="text-destructive"> *</span>}</Label>{children}</div>;
}

function Select({ id, onChange, options, placeholder, value }: { id: string; onChange: React.ChangeEventHandler<HTMLSelectElement>; options: string[]; placeholder?: string; value: string }) {
  return <select id={id} value={value} onChange={onChange} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">{placeholder && <option value="">{placeholder}</option>}{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}
