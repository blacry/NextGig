const testimonials = [
  {
    quote:
      "NextGig's skill assessment showed me exactly where I was lacking. Within 3 months of following their recommendations, I landed a ₹25k/month internship at a top startup.",
    name: "Arjun Sharma",
    role: "B.Tech CSE, 3rd Year",
    institution: "NIT Trichy",
    initials: "AS",
  },
  {
    quote:
      "We posted 12 internship openings and received 200+ applications — all pre-screened by skill match. Our time-to-hire dropped by 60%. Incredible platform.",
    name: "Priya Mehta",
    role: "HR Manager",
    institution: "Infosys Ltd.",
    initials: "PM",
  },
  {
    quote:
      "As a faculty member, finding relevant FDPs used to be a nightmare. NextGig's academician portal connected me with three industry research projects in my first week.",
    name: "Dr. Ramesh Kumar",
    role: "Associate Professor, ECE",
    institution: "VIT Vellore",
    initials: "RK",
  },
  {
    quote:
      "Our placement rate went from 68% to 89% in one academic year after adopting NextGig. The analytics dashboard alone is worth it — we can now intervene early for at-risk students.",
    name: "Prof. Sunita Joshi",
    role: "Training & Placement Officer",
    institution: "BITS Pilani",
    initials: "SJ",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-brand-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-700/50 bg-brand-800/40 text-xs text-brand-400 font-medium uppercase tracking-wide">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-100">
            Trusted by students, companies & institutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
              <p className="text-brand-400/90 text-sm leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-brand-800/60">
                <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-brand-100 text-xs font-bold flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-brand-100 text-sm font-medium">{t.name}</p>
                  <p className="text-brand-400 text-xs">{t.role} · {t.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
