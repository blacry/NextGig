"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "For Students", href: "/#students" },
  { label: "For Teachers", href: "/#teachers" },
  { label: "For Institutes", href: "/#institutes" },
  { label: "For Companies", href: "/#companies" },
  { label: "About", href: "/#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-900/90 backdrop-blur-xl border-b border-brand-700/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center group-hover:bg-brand-400/30 transition-colors">
            <Zap className="w-4 h-4 text-brand-100" />
          </div>
          <span className="text-brand-100 font-semibold text-lg tracking-tight">NextGig</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-brand-400 hover:text-brand-100 transition-colors rounded-md hover:bg-brand-800/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm text-brand-400 hover:text-brand-100 transition-colors rounded-md border border-brand-700/50 hover:border-brand-400/40"
          >
            Login
          </Link>
          <Link
            href="/auth/select-role"
            className="px-4 py-2 text-sm font-medium rounded-md btn-primary flex items-center gap-1.5"
          >
            Get Started
            <span>→</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-brand-400 hover:text-brand-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-900/95 backdrop-blur-xl border-b border-brand-700/30 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-brand-400 hover:text-brand-100 rounded-md hover:bg-brand-800/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/auth/login" className="px-4 py-2.5 text-center text-sm text-brand-400 border border-brand-700/50 rounded-md">Login</Link>
            <Link href="/auth/select-role" className="px-4 py-2.5 text-center text-sm font-medium btn-primary rounded-md">Get Started →</Link>
          </div>
        </div>
      )}
    </header>
  );
}
