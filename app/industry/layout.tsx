import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Star, 
  Target, 
  Building, 
  LineChart, 
  Lightbulb, 
  Settings,
  Search,
  Bell
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/industry", icon: LayoutDashboard },
  { label: "Talent Discovery", href: "/industry/talent", icon: Users },
  { label: "Job & Internship Posting", href: "/industry/posting", icon: Briefcase },
  { label: "Applications", href: "/industry/applications", icon: FileText },
  { label: "Shortlisted Candidates", href: "/industry/shortlisted", icon: Star },
  { label: "Skill Requirements", href: "/industry/requirements", icon: Target },
  { label: "Institution Connect", href: "/industry/connect", icon: Building },
  { label: "Hiring Analytics", href: "/industry/analytics", icon: LineChart },
  { label: "Industry Insights", href: "/industry/insights", icon: Lightbulb },
];

export default function IndustryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[280px] bg-[#062d2a] text-[#a9d8c5] flex flex-col z-20 overflow-y-auto">
        <div className="h-[82px] p-5 border-b border-[#17443f] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#b7e8be] text-[#174f43] flex items-center justify-center font-black text-xl">
            SB
          </div>
          <div>
            <b className="block text-white font-bold tracking-tight text-lg leading-tight font-heading">SkillBridge</b>
            <small className="text-[#9bc7b7] text-xs">Industry Portal</small>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold tracking-[1.3px] text-[#6fa697] uppercase">Industry</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0e4640] hover:text-white transition-colors text-[13px] font-semibold text-[#9ed0be]"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="px-3 py-2 mt-4 text-[10px] font-extrabold tracking-[1.3px] text-[#6fa697] uppercase">Account</div>
          <Link
            href="/industry/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0e4640] hover:text-white transition-colors text-[13px] font-semibold text-[#9ed0be]"
          >
            <Building className="w-4 h-4" />
            <span>Company Profile</span>
          </Link>
          <Link
            href="/industry/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0e4640] hover:text-white transition-colors text-[13px] font-semibold text-[#9ed0be]"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[280px] flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-[82px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Dashboard</h1>
            <span className="text-xs text-slate-500 dark:text-slate-400">Industry overview</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates, skills..." 
                className="w-[280px] h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-[#062d2a]/20"
              />
            </div>
            <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800">
              <Bell className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <div className="w-10 h-10 rounded-full bg-[#062d2a] text-white flex items-center justify-center font-bold text-xs">
              TA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
