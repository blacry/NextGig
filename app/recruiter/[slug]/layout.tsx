"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  Building2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import { GlobalHeader, GlobalFooter } from "@/components/GlobalHeader";
import { useRole } from "@/lib/role-context";
import { RecruiterProvider, useRecruiter } from "@/lib/recruiter-context";

// ── Vridhi Recruiter Sidebar Navigation Component ────────────────────

function RecruiterSidebarNav({ slug, onCloseMobile }: { slug: string; onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { userName, logout } = useRole();
  const { recruiter, company } = useRecruiter();

  const navItems = [
    {
      label: "Dashboard",
      href: `/recruiter/${slug}/dashboard`,
      icon: LayoutDashboard,
      active: pathname === `/recruiter/${slug}/dashboard`,
    },
    {
      label: "Opportunities",
      href: `/opportunities`,
      icon: Briefcase,
      active: pathname.startsWith(`/opportunities`),
    },
    {
      label: "Talent Pool",
      href: `/students`,
      icon: Users,
      active: pathname.startsWith(`/students`),
    },
    {
      label: "Applications",
      href: `/recruiter/${slug}/dashboard#applications`,
      icon: FileCheck,
      active: false,
    },
    {
      label: "Analytics",
      href: `/recruiter/${slug}/dashboard#analytics`,
      icon: BarChart3,
      active: false,
    },
  ];

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white border-r border-[#D9E1EA] text-[#172033] py-5 px-4 select-none">
      <div className="space-y-6">
        {/* Workspace Brand Badge */}
        <div className="px-2 pb-4 border-b border-[#E2E8F0] space-y-1">
          <div className="flex items-center gap-2 text-[#123B6D]">
            <Building2 className="w-5 h-5 text-[#1E5AA8]" />
            <span className="font-extrabold text-sm tracking-tight">VRIDHI</span>
          </div>
          <div className="text-[11px] font-bold text-[#1E5AA8] uppercase tracking-wider">
            {company?.name ? `${company.name} Workspace` : "Recruiter Workspace"}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Recruiter Workspace Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  item.active
                    ? "bg-[#EBF3FC] text-[#1E5AA8] shadow-2xs border-l-4 border-[#1E5AA8]"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#123B6D]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.active ? "text-[#1E5AA8]" : "text-[#64748B]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.active && <span className="w-1.5 h-1.5 rounded-full bg-[#1E5AA8]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile & Sign Out Footer */}
      <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#1E5AA8]/10 border border-[#1E5AA8]/30 flex items-center justify-center text-[#1E5AA8] font-bold text-xs shrink-0">
            {recruiter?.name ? recruiter.name.charAt(0) : "R"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#123B6D] truncate">
              {recruiter?.name || userName || "Sarah Jenkins"}
            </div>
            <div className="text-[10.5px] text-[#5B6575] truncate">
              {company?.name || "Industry Partner"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#D95C5C] hover:bg-red-50 transition-colors border border-red-200/60 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ── Recruiter Main Layout ────────────────────────────────────────────

function RecruiterLayoutContent({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans antialiased selection:bg-[#123B6D]/15 selection:text-[#123B6D]">
      {/* 1. Global Vridhi Government Header */}
      <GlobalHeader />

      {/* 2. Main Content Frame with Sidebar */}
      <div className="flex-1 flex max-w-[1440px] mx-auto w-full relative">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block w-64 shrink-0 min-h-[calc(100vh-140px)] sticky top-[95px] self-start">
          <RecruiterSidebarNav slug={slug} />
        </div>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
                  <span className="font-extrabold text-xs text-[#123B6D] uppercase tracking-wider">
                    Recruiter Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-md text-[#64748B] hover:text-[#123B6D]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <RecruiterSidebarNav slug={slug} onCloseMobile={() => setMobileDrawerOpen(false)} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Workspace Main Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 min-w-0 max-w-full">
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-[#CBD5E1] shadow-2xs">
            <span className="text-xs font-bold text-[#123B6D] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1E5AA8]" /> Recruiter Workspace
            </span>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#EBF3FC] text-[#1E5AA8] font-bold text-xs flex items-center gap-1.5 border border-[#1E5AA8]/30 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* 3. Global Vridhi Footer */}
      <GlobalFooter />
    </div>
  );
}

export default function RecruiterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <RecruiterProvider recruiterSlug={slug}>
      <RecruiterLayoutContent slug={slug}>{children}</RecruiterLayoutContent>
    </RecruiterProvider>
  );
}
