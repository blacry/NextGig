import Link from "next/link";
import { GraduationCap, Building2, BookOpen, University, ArrowRight } from "lucide-react";

const roles = [
  {
    id: "student",
    icon: GraduationCap,
    title: "For Students",
    tagline: "Discover. Apply. Grow.",
    description:
      "Get AI-matched internships and jobs based on your skill profile. Build a verified digital portfolio. Track every application in one place.",
    features: [
      "Skill assessment & radar profile",
      "AI-matched opportunities",
      "Digital portfolio with verified badges",
      "Application tracking dashboard",
    ],
    cta: "Start as Student",
    href: "/auth/register?role=student",
    color: "from-brand-700/30 to-brand-800/20",
    borderColor: "border-brand-400/20",
  },
  {
    id: "industry",
    icon: Building2,
    title: "For Companies",
    tagline: "Post. Discover. Hire.",
    description:
      "Post internships and jobs. Discover pre-screened candidates matched by skill compatibility. Publish training programs to build your future talent pipeline.",
    features: [
      "Post internships & job openings",
      "AI-ranked candidate shortlisting",
      "Recruitment analytics dashboard",
      "Publish learning programs",
    ],
    cta: "Join as Company",
    href: "/auth/register?role=industry",
    color: "from-brand-700/20 to-brand-800/10",
    borderColor: "border-brand-700/30",
  },
  {
    id: "academician",
    icon: BookOpen,
    title: "For Teachers",
    tagline: "Collaborate. Research. Impact.",
    description:
      "Explore Faculty Development Programs, industrial training, consultancy opportunities, and collaborative research projects with leading companies.",
    features: [
      "Faculty internship listings",
      "FDP & workshop opportunities",
      "Research collaboration portal",
      "Industry mentorship programs",
    ],
    cta: "Join as Academician",
    href: "/auth/register?role=academician",
    color: "from-brand-700/20 to-brand-800/10",
    borderColor: "border-brand-700/30",
  },
  {
    id: "institution",
    icon: University,
    title: "For Institutes",
    tagline: "Monitor. Partner. Excel.",
    description:
      "Monitor student skill development, internship participation, and placement outcomes through real-time dashboards and analytics.",
    features: [
      "Student progress monitoring",
      "Placement rate analytics",
      "Industry collaboration management",
      "Skill gap trend reports",
    ],
    cta: "Register Institution",
    href: "/auth/register?role=institution",
    color: "from-brand-700/20 to-brand-800/10",
    borderColor: "border-brand-700/30",
  },
];

export function RolesSection() {
  return (
    <section id="roles" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-700/50 bg-brand-800/40 text-xs text-brand-400 font-medium uppercase tracking-wide">
            Who is NextGig for?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-100">
            One platform, four powerful portals
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`glass-card rounded-2xl p-7 border ${role.borderColor} bg-gradient-to-br ${role.color} hover:scale-[1.01] transition-all duration-300 group`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-800/60 border border-brand-700/50 flex items-center justify-center flex-shrink-0">
                  <role.icon className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-brand-100 font-bold text-lg">{role.title}</h3>
                  <p className="text-brand-400 text-xs font-medium mt-0.5">{role.tagline}</p>
                </div>
              </div>

              <p className="text-brand-400/80 text-sm leading-relaxed mb-5">{role.description}</p>

              <ul className="space-y-2 mb-6">
                {role.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-brand-400">
                    <span className="w-1 h-1 rounded-full bg-brand-400 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href={role.href}
                className="inline-flex items-center gap-2 text-xs font-medium text-brand-100 hover:text-brand-400 transition-colors group-hover:gap-3"
              >
                {role.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
