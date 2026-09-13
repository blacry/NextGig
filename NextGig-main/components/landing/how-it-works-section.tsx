const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Sign up with your role — Student, Academician, Company, or Institution. Complete your profile in minutes.",
  },
  {
    step: "02",
    title: "Assess Your Skills",
    description:
      "Take domain-specific assessments curated by industry experts. Get an AI-powered skill radar and gap analysis.",
  },
  {
    step: "03",
    title: "Discover Opportunities",
    description:
      "Browse AI-matched internships, jobs, FDPs, and learning programs. Apply with one click using your digital portfolio.",
  },
  {
    step: "04",
    title: "Track & Grow",
    description:
      "Monitor applications, complete internships, earn verified badges, and watch your profile strengthen over time.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-brand-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-700/50 bg-brand-800/40 text-xs text-brand-400 font-medium uppercase tracking-wide">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-100">
            From signup to your dream role
          </h2>
          <p className="text-brand-400 max-w-xl mx-auto">
            A simple, guided journey that gets you from where you are to where you want to be.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-700/50 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 relative">
              {/* Step number */}
              <div className="relative z-10 w-16 h-16 rounded-2xl glass-card border-brand-700/50 flex flex-col items-center justify-center">
                <span className="text-brand-700 text-xs font-medium">{step.step}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-brand-100 font-semibold text-sm">{step.title}</h3>
                <p className="text-brand-400/80 text-xs leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
