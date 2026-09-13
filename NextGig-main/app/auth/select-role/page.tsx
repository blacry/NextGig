import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  BookOpen,
  University,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = { title: "Select Role" };

const roles = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student",
    description: "Find internships, assess skills, build your portfolio",
    href: "/auth/login?role=student",
    registerHref: "/auth/register?role=student",
  },
  {
    id: "industry",
    icon: Building2,
    title: "Company",
    description: "Post opportunities, discover talent, publish programs",
    href: "/auth/login?role=industry",
    registerHref: "/auth/register?role=industry",
  },
  {
    id: "academician",
    icon: BookOpen,
    title: "Academician",
    description: "Explore FDPs, research projects, faculty internships",
    href: "/auth/login?role=academician",
    registerHref: "/auth/register?role=academician",
  },
  {
    id: "institution",
    icon: University,
    title: "Institution",
    description: "Monitor students, analytics, manage industry tie-ups",
    href: "/auth/login?role=institution",
    registerHref: "/auth/register?role=institution",
  },
];

export default function SelectRolePage() {
  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-brand-100">Who are you?</h1>
        <p className="text-brand-400 text-sm">
          Select your role to get a personalized experience
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={role.href}
            className="glass-card rounded-2xl p-5 border border-brand-700/30 hover:border-brand-400/30 hover:bg-brand-800/60 transition-all duration-200 group flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-800/60 border border-brand-700/40 flex items-center justify-center group-hover:bg-brand-700/50 transition-colors">
              <role.icon className="w-5 h-5 text-brand-400 group-hover:text-brand-100 transition-colors" />
            </div>
            <div>
              <p className="text-brand-100 font-semibold text-sm mb-1">{role.title}</p>
              <p className="text-brand-400/70 text-xs leading-snug">{role.description}</p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs text-brand-400 group-hover:text-brand-100 transition-colors">
              <span>Continue</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Already have account */}
      <p className="text-center text-brand-400/60 text-xs mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-brand-400 hover:text-brand-100 transition-colors underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
