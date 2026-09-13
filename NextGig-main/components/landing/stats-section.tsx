const stats = [
  { value: "50,000+", label: "Students Registered" },
  { value: "1,200+", label: "Industry Partners" },
  { value: "8,500+", label: "Internships Posted" },
  { value: "92%", label: "Placement Rate" },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y border-brand-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-3xl md:text-4xl font-bold text-brand-100">{stat.value}</p>
              <p className="text-sm text-brand-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
