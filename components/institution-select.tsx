"use client";

import { useState, useEffect } from "react";
import { Building2, ChevronDown, PlusCircle, Mail, Check, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InstitutionSelectProps {
  value: string;
  contactEmail: string;
  onChange: (institution: string, contactEmail?: string) => void;
  hasError?: boolean;
}

const REGISTERED_INSTITUTIONS = [
  "RV Institute of Technology, Bengaluru",
  "Indian Institute of Technology, Delhi",
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Karnataka",
];

export function InstitutionSelect({
  value,
  contactEmail,
  onChange,
  hasError = false,
}: InstitutionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOther, setIsOther] = useState(false);

  // Check if current value is in registered list
  const isRegistered = REGISTERED_INSTITUTIONS.includes(value);

  useEffect(() => {
    if (value && !isRegistered && value !== "Others / Not Listed") {
      setIsOther(true);
    }
  }, [value, isRegistered]);

  const filteredSuggestions = REGISTERED_INSTITUTIONS.filter((inst) =>
    inst.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelectRegistered = (instName: string) => {
    setIsOther(false);
    onChange(instName, "");
    setIsOpen(false);
  };

  const handleSelectOther = () => {
    setIsOther(true);
    if (isRegistered || !value) {
      onChange("", contactEmail);
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Label htmlFor="institution-select-input" className="text-xs mb-1.5 block font-medium">
          College / University <span className="text-destructive">*</span>
        </Label>

        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="institution-select-input"
            value={isOther ? "Others / Not Listed" : value}
            onChange={(e) => {
              if (!isOther) {
                onChange(e.target.value, contactEmail);
              }
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => window.setTimeout(() => setIsOpen(false), 200)}
            placeholder="Search registered colleges or select Others"
            className={`pl-9 pr-9 ${hasError && !value.trim() ? "border-destructive" : ""}`}
            autoComplete="off"
            readOnly={isOther}
            onClick={() => setIsOpen(true)}
          />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-lg border border-border bg-popover p-1.5 shadow-xl text-popover-foreground">
            <div className="text-[11px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider">
              Registered Institutions
            </div>

            {filteredSuggestions.map((inst) => (
              <button
                key={inst}
                type="button"
                className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${
                  value === inst && !isOther
                    ? "bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] font-semibold"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectRegistered(inst)}
              >
                <span>{inst}</span>
                {value === inst && !isOther && <Check className="w-3.5 h-3.5 text-[var(--ng-primary)]" />}
              </button>
            ))}

            <div className="my-1 border-t border-border/60" />

            {/* "Others" Option */}
            <button
              type="button"
              className={`flex items-center gap-2.5 w-full rounded-md px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                isOther
                  ? "bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSelectOther}
            >
              <PlusCircle className="w-4 h-4 text-[var(--ng-primary)] shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Others / College Not Listed</p>
                <p className="text-[10px] text-muted-foreground">Select this to enter your custom college name & email</p>
              </div>
            </button>
          </div>
        )}

        <p className="mt-1 text-[11px] text-muted-foreground">
          This links your profile to your institution&apos;s dashboard.
        </p>
      </div>

      {/* Prompt Card for "Others" selection */}
      {isOther && (
        <div className="p-4 rounded-xl border border-[var(--ng-primary)]/40 bg-[var(--ng-primary)]/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ng-primary)]">
              <HelpCircle className="w-4 h-4" />
              <span>College Not Listed — Provide Details</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOther(false);
                onChange("", "");
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground underline"
            >
              Back to registered list
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-clg-name" className="text-xs mb-1 block font-medium">
                Full College / University Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="custom-clg-name"
                  value={value === "Others / Not Listed" ? "" : value}
                  onChange={(e) => onChange(e.target.value, contactEmail)}
                  placeholder="e.g. St. Xavier's College, Mumbai"
                  className={`pl-9 ${hasError && !value.trim() ? "border-destructive" : ""}`}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="custom-clg-email" className="text-xs mb-1 block font-medium">
                College Official / Placement Contact Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="custom-clg-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => onChange(value, e.target.value)}
                  placeholder="e.g. placements@college.edu.in"
                  className="pl-9"
                  required
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Our admin team will reach out to this email to contact & register your institution on NextGig.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
