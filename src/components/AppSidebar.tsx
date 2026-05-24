import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  User,
  ShieldCheck,
  FileText,
  Send,
  CreditCard,
  Briefcase,
  BarChart3,
  Scale,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "My Profile", url: "/profile", icon: User },
  { title: "Compliance Documents", url: "/compliance", icon: ShieldCheck },
  { title: "Active Tenders", url: "/tenders", icon: FileText },
  { title: "Gate 2 — Evaluation", url: "/evaluation", icon: Scale },
  { title: "My Bids", url: "/bids", icon: Send },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Projects", url: "/projects", icon: Briefcase },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="text-xl font-bold tracking-wide text-white">TENDERBOX</div>
        <div className="text-xs text-white/70 mt-0.5">Procurement Platform</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-white font-medium"
                  : "text-white/80 hover:bg-sidebar-accent hover:text-white",
              ].join(" ")}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-sidebar-border text-[11px] text-white/60">
        v1.0 · Gov SA
      </div>
    </aside>
  );
}
