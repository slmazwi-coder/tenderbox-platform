import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ClipboardCheck, CreditCard, Briefcase, ArrowRight, type LucideIcon } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client")({ component: ClientDashboard });

const CLIENT_ROLES = ["client_entity"];

const STATS: { label: string; value: string; hint: string; icon: LucideIcon; accent: string; to: string }[] = [
  { label: "Active Tenders", value: "5", hint: "2 closing within 14 days", icon: FileText, accent: "bg-primary/10 text-primary", to: "/client/tenders" },
  { label: "Pending Gate Approvals", value: "3", hint: "Gate 2 adjudication queue", icon: ClipboardCheck, accent: "bg-warning/10 text-warning", to: "/client/gate2" },
  { label: "Payments Due This Month", value: "R 2.4M", hint: "4 certificates in chain", icon: CreditCard, accent: "bg-success/10 text-success", to: "/client/payments" },
  { label: "Active Projects", value: "8", hint: "2 delayed, 1 critical", icon: Briefcase, accent: "bg-accent/10 text-accent", to: "/client/projects" },
];

const ACTIVITY = [
  { icon: "✅", text: "Gate 2 sign-off completed for TBX-2026-0031 — award recommendation issued to MM", time: "2 hours ago" },
  { icon: "📄", text: "Tender TBX-2026-0047 published — Upgrading of Stormwater System Phase 3", time: "Yesterday" },
  { icon: "💰", text: "Payment R 1,245,000 released to Sizwe Construction (Pty) Ltd — PC-2025-047-003", time: "Yesterday" },
  { icon: "⚠️", text: "Red flag raised on TBX-2026-0039 — submission time anomaly detected for Ndaba Projects", time: "2 days ago" },
  { icon: "📋", text: "BAC quorum confirmed for TBX-2026-0039 adjudication — session 10 Jun 2026", time: "3 days ago" },
  { icon: "🔔", text: "OHSA compliance certificate expired for Ntuli Civil Works CC — progress payment blocked", time: "4 days ago" },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">City of Johannesburg — SCM Office</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Municipal Finance Management Act Procurement Dashboard · FY 2026/27
            </p>
          </div>
          <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Client Entity
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="block rounded-lg border border-border bg-card p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-md ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            to="/client/tenders"
            className="inline-flex items-center justify-between gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span>Publish New Tender</span><ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/client/gate2"
            className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>View Gate 2 Pending</span><ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/client/payments"
            className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>Review Payments</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-border">
          {ACTIVITY.map((item, i) => (
            <li key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
              <span className="mt-0.5 text-lg leading-none">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ClientDashboard() {
  return (
    <RoleGuard allowedRoles={CLIENT_ROLES}>
      <Dashboard />
    </RoleGuard>
  );
}
