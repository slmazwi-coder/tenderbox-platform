import { useRouterState } from "@tanstack/react-router";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/profile": "My Profile",
  "/compliance": "Compliance Documents",
  "/tenders": "Active Tenders",
  "/bids": "My Bids",
  "/payments": "Payments",
  "/projects": "Projects",
  "/reports": "Reports",
};

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[pathname] ?? "Tenderbox";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Tenderbox</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{title}</span>
      </div>

      <div className="flex items-center gap-3">
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
