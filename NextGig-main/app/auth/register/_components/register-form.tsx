"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  Building2,
  BookOpen,
  University,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const roleConfig = {
  student: { label: "Student", icon: GraduationCap, redirect: "/onboarding/student" },
  industry: { label: "Company", icon: Building2, redirect: "/onboarding/industry" },
  academician: { label: "Academician", icon: BookOpen, redirect: "/onboarding/academician" },
  institution: { label: "Institution", icon: University, redirect: "/onboarding/institution" },
};

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, "You must accept the terms"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = (searchParams.get("role") ?? "student") as keyof typeof roleConfig;
  const role = roleConfig[roleParam] ?? roleConfig.student;
  const RoleIcon = role.icon;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { authClient } = await import("@/lib/auth-client");
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message ?? "Registration failed");
        return;
      }

      toast.success("Account created! Setting up your profile...");
      router.push(role.redirect);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const { authClient } = await import("@/lib/auth-client");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: role.redirect,
      });
    } catch {
      toast.error("Google sign-up failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="glass-card-dark rounded-2xl border border-brand-700/30 p-7 space-y-5">
        {/* Back */}
        <Link
          href="/auth/select-role"
          className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to roles
        </Link>

        {/* Role badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-800/60 border border-brand-700/50">
          <RoleIcon className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-brand-400 text-xs font-medium">{role.label}</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-100">Create your account</h1>
          <p className="text-brand-400/70 text-sm">Join NextGig and start your journey today.</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          className="w-full glass-card border border-brand-700/30 hover:border-brand-400/30 py-2.5 rounded-xl text-sm font-medium text-brand-400 hover:text-brand-100 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-800/60" />
          <span className="text-brand-700 text-xs">or</span>
          <div className="flex-1 h-px bg-brand-800/60" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs text-brand-400 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              {...register("name")}
              className="input-dark w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs text-brand-400 font-medium">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              className="input-dark w-full px-3.5 py-2.5 rounded-xl text-sm"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs text-brand-400 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="input-dark w-full px-3.5 py-2.5 rounded-xl text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400/60 hover:text-brand-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="space-y-1 pt-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${req.test(password) ? "text-brand-400" : "text-brand-700"}`} />
                    <span className={`text-xs ${req.test(password) ? "text-brand-400" : "text-brand-700"}`}>{req.label}</span>
                  </div>
                ))}
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs text-brand-400 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="input-dark w-full px-3.5 py-2.5 rounded-xl text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400/60 hover:text-brand-400"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" {...register("terms")} className="w-3.5 h-3.5 mt-0.5 rounded accent-brand-400" />
            <span className="text-xs text-brand-400/70 leading-snug">
              I agree to the{" "}
              <Link href="/terms" className="text-brand-400 hover:text-brand-100 transition-colors">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-brand-400 hover:text-brand-100 transition-colors">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="text-red-400 text-xs">{errors.terms.message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
            ) : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-brand-400/60">
          Already have an account?{" "}
          <Link href={`/auth/login?role=${roleParam}`} className="text-brand-400 hover:text-brand-100 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
