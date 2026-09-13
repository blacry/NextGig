import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "For Students", href: "/#students" },
    { label: "For Companies", href: "/#companies" },
    { label: "For Academicians", href: "/#teachers" },
    { label: "For Institutions", href: "/#institutes" },
  ],
  Features: [
    { label: "Skill Assessment", href: "/#features" },
    { label: "Internship Portal", href: "/#features" },
    { label: "Digital Portfolio", href: "/#features" },
    { label: "Analytics Dashboard", href: "/#features" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-brand-800/60 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-100" />
              </div>
              <span className="text-brand-100 font-semibold text-lg">NextGig</span>
            </Link>
            <p className="text-brand-400/70 text-xs leading-relaxed">
              Bridging the gap between academia and industry through intelligent skill mapping,
              internships, and placements.
            </p>
            <p className="text-brand-700 text-xs">
              Built for SIH 26044 · Ministry of Ayush, AIIA
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-4">
              <h4 className="text-brand-100 text-xs font-semibold uppercase tracking-widest">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-brand-400/70 text-xs hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-800/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-700 text-xs">
            © {new Date().getFullYear()} NextGig. All rights reserved.
          </p>
          <p className="text-brand-700 text-xs">
            Made with ♥ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
