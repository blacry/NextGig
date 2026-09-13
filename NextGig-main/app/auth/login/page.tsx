import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[420px]">
        <div className="glass-card-dark rounded-2xl border border-brand-700/30 p-7 h-96 animate-pulse" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
