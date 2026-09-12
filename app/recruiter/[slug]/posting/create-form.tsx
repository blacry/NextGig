"use client";

import { useState } from "react";
import { createOpportunity } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { SkillRow } from "@/lib/supabase/rows";

export function CreateOpportunityForm({ skills }: { skills: SkillRow[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<{skillId: string, requiredLevel: number, preferred: boolean}[]>([]);

  const addSkill = (skillId: string) => {
    if (!selectedSkills.find(s => s.skillId === skillId)) {
      setSelectedSkills([...selectedSkills, { skillId, requiredLevel: 3, preferred: false }]);
    }
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.skillId !== skillId));
  };

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createOpportunity(formData, selectedSkills);
      // Reset or show success
      window.location.reload(); // Simple reload for now to reflect changes
    } catch (error) {
      console.error(error);
      alert("Failed to create opportunity");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" required placeholder="e.g. AI/ML Intern" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required placeholder="e.g. Remote, Bangalore" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue="internship">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" placeholder="e.g. 3-6 months (for internships)" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="compensation">Compensation / Stipend</Label>
          <Input id="compensation" name="compensation" placeholder="e.g. $20/hr, Competitive" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input id="deadline" name="deadline" type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required placeholder="Describe the role..." className="h-32" />
      </div>

      <div className="space-y-2 border p-4 rounded-lg bg-card">
        <Label>Skill Requirements</Label>
        <div className="flex gap-2 mb-4">
          <Select onValueChange={addSkill}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Add a skill..." />
            </SelectTrigger>
            <SelectContent>
              {skills.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedSkills.length > 0 && (
          <div className="space-y-3">
            {selectedSkills.map(s => {
              const skillObj = skills.find(sk => sk.id === s.skillId);
              return (
                <div key={s.skillId} className="flex items-center gap-4 bg-muted/50 p-2 rounded">
                  <div className="font-medium flex-1">{skillObj?.name}</div>
                  <Select
                    defaultValue={s.preferred ? "preferred" : "required"}
                    onValueChange={(val) => {
                      setSelectedSkills(prev => prev.map(sk => sk.skillId === s.skillId ? { ...sk, preferred: val === "preferred" } : sk));
                    }}
                  >
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Must Have</SelectItem>
                      <SelectItem value="preferred">Nice to Have</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(s.skillId)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto">
          {isSubmitting ? "Publishing..." : "Publish Opportunity"}
        </Button>
      </div>
    </form>
  );
}
