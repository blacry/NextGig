import type { Metadata } from "next";
import Link from "next/link";
import { Zap, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-950 dot-pattern relative flex flex-col">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-700/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-700/10 blur-3xl" />
      </div>

      {/* Minimal header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-brand-700 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-brand-100" />
          </div>
          <span className="text-brand-100 font-semibold text-base">NextGig</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-brand-400/60 text-sm hidden sm:block">Need help?</span>
          <Link
            href="/contact"
            className="text-sm text-brand-400 border border-brand-700/50 rounded-lg px-3.5 py-1.5 hover:border-brand-400/40 hover:text-brand-100 transition-all"
          >
            Contact us
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Help button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="w-9 h-9 rounded-full glass-card border border-brand-700/50 flex items-center justify-center hover:border-brand-400/40 transition-colors">
          <HelpCircle className="w-4 h-4 text-brand-400" />
        </button>
      </div>
    </div>
  );
}
