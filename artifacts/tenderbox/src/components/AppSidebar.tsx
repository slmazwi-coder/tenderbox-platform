import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, User, ShieldCheck, FileText, Send, CreditCard, Briefcase,
  BarChart3, Scale, Presentation, ClipboardList,
  GraduationCap, BookOpen, AlertTriangle, Search, type LucideIcon,
} from "lucide-react";
import { useProfile } from "@/lib/auth";

interface NavItem { title: string; url: string; icon: LucideIcon }

const CONTRACTOR_NAV: NavItem[] = [
  { title: "Dashboard",     url: "/contractor",          icon: Home },
  { title: "My Profile",    url: "/contractor/profile",  icon: User },
  { title: "Compliance",    url: "/compliance",          icon: ShieldCheck },
  { title: "Active Tenders",url: "/contractor/tenders",  icon: FileText },
  { title: "My Bids",       url: "/contractor/bids",     icon: Send },
  { title: "Payments",      url: "/contractor/payments", icon: CreditCard },
  { title: "Projects",      url: "/contractor/projects", icon: Briefcase },
  { title: "Reports",       url: "/reports",             icon: BarChart3 },
];

const CLIENT_NAV: NavItem[] = [
  { title: "Dashboard",         url: "/client",          icon: Home },
  { title: "Tenders",           url: "/client/tenders",  icon: FileText },
  { title: "Gate 2 Adjudication",url: "/client/gate2",   icon: Scale },
  { title: "Payments",          url: "/client/payments", icon: CreditCard },
  { title: "Projects",          url: "/client/projects", icon: Briefcase },
  { title: "Reports",           url: "/reports",         icon: BarChart3 },
];

const CONSULTANT_NAV: NavItem[] = [
  { title: "Dashboard",       url: "/consultant", icon: Home },
  { title: "My Appointments", url: "/tenders",    icon: Search },
  { title: "Projects",        url: "/projects",   icon: Briefcase },
  { title: "Certificates",    url: "/compliance", icon: GraduationCap },
  { title: "Site Diary",      url: "/projects",   icon: BookOpen },
  { title: "Payments",        url: "/payments",   icon: CreditCard },
  { title: "Reports",         url: "/reports",    icon: BarChart3 },
];

const AUDITOR_NAV: NavItem[] = [
  { title: "Dashboard",                  url: "/auditor",  icon: Home },
  { title: "Audit Trail",                url: "/reports",  icon: ClipboardList },
  { title: "Red Flags",                  url: "/reports",  icon: AlertTriangle },
  { title: "Procurement Irregularities", url: "/reports",  icon: ShieldCheck },
  { title: "Payment Reports",            url: "/payments", icon: CreditCard },
  { title: "All Projects",               url: "/projects", icon: Briefcase },
];

const DEFAULT_NAV = (dashUrl: string): NavItem[] => [
  { title: "Dashboard", url: dashUrl,    icon: Home },
  { title: "Projects",  url: "/projects",icon: Briefcase },
  { title: "Reports",   url: "/reports", icon: BarChart3 },
];

const ROLE_PORTALS: Record<string, string> = {
  contractor:    "Contractor Portal",
  employee:      "Contractor Portal",
  client_entity: "Client Portal",
  consultant:    "Consultant Portal",
  professional:  "Professional Portal",
  psc_community: "PSC Portal",
  integrated_org:"Organisation Portal",
  supplier:      "Supplier Portal",
  auditor:       "Auditor Portal",
};

const ROLE_DASHBOARDS: Record<string, string> = {
  contractor:    "/contractor",
  employee:      "/contractor",
  client_entity: "/client",
  consultant:    "/consultant",
  professional:  "/professional",
  psc_community: "/psc",
  integrated_org:"/org",
  supplier:      "/supplier",
  auditor:       "/auditor",
};

function getNavItems(role: string | undefined | null): NavItem[] {
  switch (role) {
    case "contractor":
    case "employee":      return CONTRACTOR_NAV;
    case "client_entity": return CLIENT_NAV;
    case "consultant":    return CONSULTANT_NAV;
    case "auditor":       return AUDITOR_NAV;
    default:              return DEFAULT_NAV(ROLE_DASHBOARDS[role ?? ""] ?? "/contractor");
  }
}

const demoItem: NavItem = { title: "Demo Flow", url: "/demo", icon: Presentation };

const DASHBOARD_PATHS = new Set(Object.values(ROLE_DASHBOARDS));

function isActive(pathname: string, url: string): boolean {
  if (DASHBOARD_PATHS.has(url)) return pathname === url;
  return pathname === url || pathname.startsWith(url + "/");
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profile = useProfile();
  const role = profile?.role ?? undefined;
  const navItems = getNavItems(role);
  const portalLabel = ROLE_PORTALS[role ?? ""] ?? "Procurement Portal";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <Link to="/landing" className="block">
          <div className="text-xl font-bold tracking-wide text-white">TENDERBOX</div>
          <div className="text-xs text-white/60 mt-0.5">Procurement Platform</div>
        </Link>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
            {portalLabel}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.url);
          return (
            <Link
              key={`${item.title}-${item.url}`}
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

        <div className="my-2 border-t border-sidebar-border" />

        <Link
          to={demoItem.url}
          className={[
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            pathname === demoItem.url
              ? "bg-warning/20 text-warning-foreground font-medium"
              : "text-white/80 hover:bg-sidebar-accent hover:text-white",
          ].join(" ")}
        >
          <demoItem.icon className="h-4 w-4 shrink-0" />
          <span>{demoItem.title}</span>
        </Link>
      </nav>

      <div className="px-6 py-4 border-t border-sidebar-border text-[11px] text-white/60">
        v1.2 · Gov SA
      </div>
    </aside>
  );
}
