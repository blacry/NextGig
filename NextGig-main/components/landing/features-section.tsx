import {
  Brain,
  Map,
  Briefcase,
  GraduationCap,
  BarChart3,
  Shield,
  BookOpen,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Skill Assessment",
    description:
      "Complete industry-curated questionnaires. Get a detailed skill profile with radar charts and personalized gap analysis powered by Gemini AI.",
  },
  {
    icon: Map,
    title: "Smart Skill Mapping",
    description:
      "Platform maps your skills against industry benchmarks and recommends the most relevant career paths, roles, and learning programs.",
  },
  {
    icon: Briefcase,
    title: "Internship & Job Portal",
    description:
      "Companies post internships, apprenticeships, and entry-level jobs. Get AI-matched opportunities based on your skill profile.",
  },
  {
    icon: GraduationCap,
    title: "Digital Portfolio",
    description:
      "Maintain a verified digital portfolio showcasing skills, certifications, projects, and internships. Share your unique profile link with recruiters.",
  },
  {
    icon: BookOpen,
    title: "Industry Learning Programs",
    description:
      "Access certification courses, workshops, bootcamps, and mentorship programs published directly by top companies.",
  },
  {
    icon: Users,
    title: "Academician Portal",
    description:
      "Dedicated portal for faculty to explore Faculty Development Programs, industrial training, consultancy, and research collaborations.",
  },
  {
    icon: BarChart3,
    title: "Institution Analytics",
    description:
      "Institutions monitor student skill development, internship participation, and placement progress through real-time dashboards.",
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    description:
      "Role-based access control, secure document management, and verified credential system for resumes, certificates, and reports.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-700/50 bg-brand-800/40 text-xs text-brand-400 font-medium uppercase tracking-wide">
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-100">
            Everything you need to succeed
          </h2>
          <p className="text-brand-400 max-w-2xl mx-auto">
            A complete lifecycle platform — from skill discovery to placement — built for every
            stakeholder in the academia-industry ecosystem.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 space-y-4 hover:border-brand-400/25 hover:bg-brand-800/60 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-800 border border-brand-700/50 flex items-center justify-center group-hover:bg-brand-700/60 transition-colors">
                <feature.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-brand-100 font-semibold text-sm">{feature.title}</h3>
                <p className="text-brand-400/80 text-xs leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
