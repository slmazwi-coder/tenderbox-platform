import { useRouterState, Link } from "@tanstack/react-router";
import { Monitor, MonitorOff } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoContext";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/profile": "My Profile",
  "/compliance": "Compliance Documents",
  "/tenders": "Active Tenders",
  "/evaluation": "Gate 2 — Evaluation",
  "/bids": "My Bids",
  "/payments": "Payments",
  "/projects": "Projects",
  "/reports": "Reports",
  "/demo": "Demo Mode",
};

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "Tenderbox";
  const { isDemoMode, toggleDemoMode } = useDemoMode();

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
          {isDemoMode ? (
            <MonitorOff className="h-3.5 w-3.5" />
          ) : (
            <Monitor className="h-3.5 w-3.5" />
          )}
          {isDemoMode ? "Exit Demo" : "Demo Mode"}
        </button>

        <div className="text-right leading-tight">
          <div className="text-sm font-medium text-foreground">Thabo Mokoena</div>
          <div className="text-xs text-muted-foreground">Procurement Officer</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          TM
        </div>
      </div>
    </header>
  );
}
