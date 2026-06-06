import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Monitor, MonitorOff, LogOut } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoContext";
import { useAuth } from "@/contexts/AuthContext";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/contractor":          "Dashboard",
  "/contractor/profile":  "My Profile",
  "/contractor/tenders":  "Active Tenders",
  "/contractor/bids":     "My Bids",
  "/contractor/payments": "Payments",
  "/contractor/projects": "Projects",
  "/client":              "Dashboard",
  "/client/tenders":      "Tender Management",
  "/client/gate2":        "Gate 2 — Adjudication",
  "/client/payments":     "Payment Oversight",
  "/client/projects":     "Active Projects",
  "/consultant":   "Dashboard",
  "/professional": "Dashboard",
  "/psc":          "Dashboard",
  "/org":          "Dashboard",
  "/supplier":     "Dashboard",
  "/auditor":                  "Dashboard",
  "/auditor/trail":            "Audit Trail",
  "/auditor/flags":            "Red Flag Report",
  "/auditor/irregularities":   "Procurement Irregularities",
  "/profile":    "My Profile",
  "/compliance": "Compliance Documents",
  "/tenders":    "Active Tenders",
  "/evaluation": "Gate 2 — Evaluation",
  "/bids":       "My Bids",
  "/payments":   "Payments",
  "/projects":   "Projects",
  "/reports":    "Reports",
  "/demo":       "Demo Mode",
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "Tenderbox";
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.display_name ?? user?.email ?? "User";
  const roleLabel = profile?.role
    ? profile.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Authenticated";
  const initials = getInitials(profile?.display_name ?? user?.email);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth/login" });
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Tenderbox</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDemoMode}
          className={[
            "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
            isDemoMode
              ? "border-warning/40 bg-warning/10 text-warning hover:bg-warning/20"
              : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
          ].join(" ")}
        >
          {isDemoMode ? <MonitorOff className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
          {isDemoMode ? "Exit Demo" : "Demo Mode"}
        </button>

        <div className="text-right leading-tight">
          <div className="text-sm font-medium text-foreground">{displayName}</div>
          <div className="text-xs text-muted-foreground">{roleLabel}</div>
        </div>

        <div className="flex h-9 w-9 select-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initials}
        </div>

        <button
          onClick={handleSignOut}
          title="Sign out"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
