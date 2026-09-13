import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="glass-card rounded-3xl p-12 border border-brand-700/30 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700/20 via-transparent to-brand-800/10 pointer-events-none" />

          <div className="relative space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-100 leading-tight">
              Ready to bridge the gap between
              <span className="text-brand-400"> academia and industry?</span>
            </h2>
            <p className="text-brand-400 text-lg max-w-2xl mx-auto">
              Join 50,000+ students, 1,200+ companies, and 500+ institutions already using NextGig
              to transform careers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/auth/select-role"
                className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-sm"
              >
                Get Started for Free →
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3.5 rounded-xl font-medium text-sm text-brand-400 border border-brand-700/50 hover:border-brand-400/40 hover:text-brand-100 transition-all"
              >
                Already have an account? Login
              </Link>
            </div>
            <p className="text-brand-700 text-xs">
              No credit card required · Free for students & academicians
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
