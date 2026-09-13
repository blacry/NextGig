"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, ChevronDown, PlusCircle, Mail, Check, HelpCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InstitutionSelectProps {
  value: string;
  contactEmail: string;
  onChange: (institution: string, contactEmail?: string) => void;
  hasError?: boolean;
}

const DEFAULT_REGISTERED = [
  "RV Institute of Technology, Bengaluru",
  "Indian Institute of Technology, Delhi",
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Karnataka",
  "BITS Pilani, Pilani Campus",
  "Indian Institute of Science, Bengaluru",
];

export function InstitutionSelect({
  value,
  contactEmail,
  onChange,
  hasError = false,
}: InstitutionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [institutionsList, setInstitutionsList] = useState<string[]>(DEFAULT_REGISTERED);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mode state: "registered" or "other"
  const [mode, setMode] = useState<"registered" | "other">(() => {
    if (value && !DEFAULT_REGISTERED.includes(value) && value !== "Others / College Not Listed") {
      return "other";
    }
    return "registered";
  });

  // Track custom college name locally for 100% responsive typing
  const [customCollegeName, setCustomCollegeName] = useState(() => {
    return value && !DEFAULT_REGISTERED.includes(value) && value !== "Others / College Not Listed"
      ? value
      : "";
  });

  // Track custom contact email locally
  const [customEmail, setCustomEmail] = useState(contactEmail || "");

  // Dynamically fetch registered institutions from backend DB
  useEffect(() => {
    let isMounted = true;
    async function fetchInstitutions() {
      try {
        const res = await fetch("/api/institutions");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.institutions) && data.institutions.length > 0) {
            setInstitutionsList(data.institutions);
            if (data.institutions.includes(value)) {
              setMode("registered");
              setSearchTerm(value);
            }
          }
        }
      } catch (err) {
        console.warn("[InstitutionSelect] Dynamic fetch fallback", err);
      }
    }
    fetchInstitutions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync external value if in registered mode
  useEffect(() => {
    if (mode === "registered") {
      setSearchTerm(value || "");
    }
  }, [value, mode]);

  // Sync contact email from props if updated externally
  useEffect(() => {
    if (contactEmail !== undefined && contactEmail !== customEmail) {
      setCustomEmail(contactEmail);
    }
  }, [contactEmail]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredInstitutions = institutionsList.filter((inst) =>
    inst.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleSelectRegistered = (instName: string) => {
    setMode("registered");
    setSearchTerm(instName);
    setCustomCollegeName("");
    setCustomEmail("");
    onChange(instName, "");
    setIsOpen(false);
  };

  const handleSelectOther = () => {
    setMode("other");
    setSearchTerm("Others / College Not Listed");
    setIsOpen(false);
    onChange(customCollegeName, customEmail);
  };

  const handleCustomCollegeChange = (name: string) => {
    setCustomCollegeName(name);
    onChange(name, customEmail);
  };

  const handleCustomEmailChange = (email: string) => {
    setCustomEmail(email);
    onChange(customCollegeName, email);
  };

  const isInvalid =
    hasError &&
    (mode === "registered"
      ? !value.trim()
      : !customCollegeName.trim() || !customEmail.trim() || !customEmail.includes("@"));

  return (
    <div className="space-y-3 relative" ref={dropdownRef}>
      <Label htmlFor="institution-search-input" className="text-xs mb-1.5 block font-medium">
        College / University <span className="text-destructive">*</span>
      </Label>

      {/* Main Select Input Box */}
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
        <Input
          id="institution-search-input"
          value={mode === "other" ? "Others / College Not Listed" : searchTerm}
          onChange={(e) => {
            if (mode === "other") {
              setMode("registered");
            }
            setSearchTerm(e.target.value);
            onChange(e.target.value, customEmail);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search registered colleges or select Others..."
          className={`pl-9 pr-9 ${isInvalid ? "border-destructive ring-1 ring-destructive" : ""}`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {hasError && (mode === "other" ? !customCollegeName.trim() : !value.trim()) && (
        <p className="text-xs text-destructive flex items-center gap-1 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Please select or enter your college / university name to continue.</span>
        </p>
      )}

      {/* Dynamic Searchable Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-border bg-popover p-1.5 shadow-2xl text-popover-foreground max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40 mb-1">
            <span>Registered Portal Institutions</span>
            <span className="text-[10px] text-[var(--ng-primary)] font-normal">Live Catalog</span>
          </div>

          {filteredInstitutions.length > 0 ? (
            filteredInstitutions.map((inst) => (
              <button
                key={inst}
                type="button"
                className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  value === inst && mode === "registered"
                    ? "bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] font-semibold"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleSelectRegistered(inst)}
              >
                <span>{inst}</span>
                {value === inst && mode === "registered" && (
                  <Check className="w-3.5 h-3.5 text-[var(--ng-primary)] shrink-0" />
                )}
              </button>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-muted-foreground">
              No matching registered college found.
            </div>
          )}

          <div className="my-1 border-t border-border/60" />

          {/* "Others / College Not Listed" Option */}
          <button
            type="button"
            className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${
              mode === "other"
                ? "bg-[var(--ng-primary)]/10 text-[var(--ng-primary)] font-semibold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={handleSelectOther}
          >
            <PlusCircle className="w-4 h-4 text-[var(--ng-primary)] shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Others / College Not Listed</p>
              <p className="text-[10px] text-muted-foreground">
                Enter your custom college name & official admin email
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Custom College Prompt Card for "Others" selection */}
      {mode === "other" && (
        <div className="p-4 rounded-xl border border-[var(--ng-primary)]/40 bg-[var(--ng-primary)]/5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ng-primary)]">
              <HelpCircle className="w-4 h-4" />
              <span>College Lead Capture — Request Campus Onboarding</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setMode("registered");
                setSearchTerm("");
                onChange("", "");
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground underline"
            >
              Choose from registered list
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-clg-name-input" className="text-xs mb-1 block font-medium">
                Full College / University Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="custom-clg-name-input"
                  value={customCollegeName}
                  onChange={(e) => handleCustomCollegeChange(e.target.value)}
                  placeholder="e.g. St. Xavier's College, Mumbai"
                  className={`pl-9 ${hasError && !customCollegeName.trim() ? "border-destructive ring-1 ring-destructive" : ""}`}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="custom-clg-email-input" className="text-xs mb-1 block font-medium">
                Official College / Placement Contact Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="custom-clg-email-input"
                  type="email"
                  value={customEmail}
                  onChange={(e) => handleCustomEmailChange(e.target.value)}
                  placeholder="e.g. placements@college.edu.in / admin@college.edu"
                  className={`pl-9 ${hasError && (!customEmail || !customEmail.includes("@")) ? "border-destructive ring-1 ring-destructive" : ""}`}
                  required
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Our admin team will use this email to contact your institution to complete campus registration on NextGig.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
