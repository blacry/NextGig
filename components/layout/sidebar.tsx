"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role-context";
import { useStudent } from "@/lib/student-context";
import { useRecruiter } from "@/lib/recruiter-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ── Sidebar Navigation ───────────────────────────────────────────────
// Unified sidebar sharing the same nav primitive for both student (light)
// and recruiter (dark). Theme is driven by data-theme on the wrapper.

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getStudentNavItems(slug: string): NavItem[] {
  return [
    {
      label: "Dashboard",
      href: `/student/${slug}/dashboard`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    },
    {
      label: "My Skills",
      href: `/student/${slug}/skills`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    },
    {
      label: "Skill Gap",
      href: `/student/${slug}/skill-gap`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    },
    {
      label: "Opportunities",
      href: `/student/${slug}/opportunities`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    },
    {
      label: "Skill Passport",
      href: `/student/${slug}/portfolio`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    },
    {
      label: "AI Assistant",
      href: `/student/${slug}/ai`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/></svg>,
    },
  ];
}

function getRecruiterNavItems(slug: string): NavItem[] {
  return [
    {
      label: "Dashboard",
      href: `/recruiter/${slug}/dashboard`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
    },
    {
      label: "Opportunities",
      href: `/recruiter/${slug}/opportunities`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    },
    {
      label: "Talent Pool",
      href: `/recruiter/${slug}/talent`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
  ];
}

interface SidebarProps {
  variant: "student" | "recruiter";
}

function UserAvatar({ variant }: { variant: "student" | "recruiter" }) {
  const { userName } = useRole();
  const { student } = variant === "student" ? useStudent() : { student: null };
  const { recruiter } = variant === "recruiter" ? useRecruiter() : { recruiter: null };

  const avatar = variant === "student" ? student?.avatar : recruiter?.avatar;
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={userName || "User"}
        className="w-8 h-8 rounded-full object-cover bg-[var(--ng-primary)]/10"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-[var(--ng-primary)]/10 flex items-center justify-center">
      <span className="text-xs font-semibold text-[var(--ng-primary)]">{initial}</span>
    </div>
  );
}

export function Sidebar({ variant }: SidebarProps) {
  const { userSlug, userName, logout } = useRole();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = variant === "student"
    ? getStudentNavItems(userSlug)
    : getRecruiterNavItems(userSlug);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href={variant === "student" ? `/student/${userSlug}/dashboard` : `/recruiter/${userSlug}/dashboard`} className="flex items-center gap-2.5 min-h-0 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--ng-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-base tracking-tight">NextGig</span>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative min-h-[44px]",
                isActive
                  ? "text-[var(--ng-primary)] bg-[var(--ng-soft)]/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--ng-primary)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className={isActive ? "text-[var(--ng-primary)]" : ""}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <UserAvatar variant={variant} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{variant}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-foreground h-9 min-h-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] border-r border-border bg-sidebar z-30">
        <NavContent />
      </aside>

      {/* Mobile hamburger + sheet */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href={variant === "student" ? `/student/${userSlug}/dashboard` : `/recruiter/${userSlug}/dashboard`} className="flex items-center gap-2 min-h-0 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[var(--ng-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-semibold text-sm">NextGig</span>
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger>
            <span className={buttonVariants({ variant: "ghost", size: "sm", className: "w-9 h-9 p-0 min-h-0 min-w-0 flex items-center justify-center cursor-pointer" })}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom nav for student mobile */}
      {variant === "student" && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border px-2 py-1.5 flex justify-around">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-xs min-h-[44px] min-w-[44px] justify-center",
                  isActive ? "text-[var(--ng-primary)]" : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
