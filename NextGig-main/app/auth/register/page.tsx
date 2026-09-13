import { Suspense } from "react";
import { RegisterForm } from "./_components/register-form";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[420px]">
        <div className="glass-card-dark rounded-2xl border border-brand-700/30 p-7 h-96 animate-pulse" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
