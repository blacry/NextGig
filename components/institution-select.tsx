"use client";

import { useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InstitutionSelectProps {
  value: string;
  contactEmail: string;
  onChange: (institution: string, contactEmail?: string) => void;
  hasError?: boolean;
}

const SUGGESTIONS = [
  "RV Institute of Technology, Bengaluru",
  "Indian Institute of Technology, Delhi",
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Karnataka",
];

export function InstitutionSelect({ value, contactEmail, onChange, hasError = false }: InstitutionSelectProps) {
  const [open, setOpen] = useState(false);
  const suggestions = SUGGESTIONS.filter((item) => item.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="relative">
        <Label htmlFor="institution" className="mb-1.5 block text-xs">
          College / University <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="institution"
            value={value}
            required
            autoComplete="organization"
            placeholder="Search or enter your institution"
            className={`pl-9 pr-9 ${hasError ? "border-destructive" : ""}`}
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          />
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {open && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-1 shadow-md">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(suggestion);
                  setOpen(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">
          This links your profile to your institution&apos;s dashboard.
        </p>
      </div>

      {value.trim() && suggestions.length === 0 && (
        <div>
          <Label htmlFor="institution-contact-email" className="mb-1.5 block text-xs">
            Institution contact email <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="institution-contact-email"
            type="email"
            value={contactEmail}
            placeholder="admin@institution.edu"
            onChange={(event) => onChange(value, event.target.value)}
          />
        </div>
      )}
    </div>
  );
}
