import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, AlertTriangle, Scale, Clock, ArrowRight, type LucideIcon } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/auditor")({ component: GuardedDashboard });

const AUDITOR_ROLES = ["auditor"];

const STATS: { label: string; value: string; hint: string; icon: LucideIcon; accent: string; to: string }[] = [
  { label: "Projects Monitored",       value: "24",  hint: "All municipal projects on-chain", icon: Shield,        accent: "bg-primary/10 text-primary",  to: "/projects" },
  { label: "Active Red Flags",          value: "7",   hint: "3 high severity",                 icon: AlertTriangle, accent: "bg-danger/10 text-danger",    to: "/auditor/flags" },
  { label: "BAC Deviations This Year",  value: "3",   hint: "Auto-reported to AG",             icon: Scale,         accent: "bg-warning/10 text-warning",  to: "/auditor/irregularities" },
  { label: "Overdue Payments (>30d)",   value: "2",   hint: "MFMA s65 breach logged",          icon: Clock,         accent: "bg-danger/10 text-danger",    to: "/auditor/irregularities" },
];

const ALERTS = [
  { sev: "HIGH",   icon: "🔴", text: "TBX-2026-0051 — B-BBEE Level 1 certificate flagged as potentially fraudulent",                          time: "1 hour ago" },
  { sev: "HIGH",   icon: "🔴", text: "TBX-2026-0044 — Shared director detected between Khoza Engineering and Ndaba Projects CC",              time: "2 days ago" },
  { sev: "HIGH",   icon: "🔴", text: "TBX-2026-0039 — Submission time anomaly: Ndaba Projects submitted 3 min before deadline (3rd occurrence)", time: "4 days ago" },
  { sev: "MEDIUM", icon: "🟠", text: "TBX-2025-0088 — Variation order of R 7.4M approved (+16.4% of contract value) — threshold breach",       time: "1 week ago" },
  { sev: "MEDIUM", icon: "🟠", text: "PC-2026-039-004 — Payment certificate approaching 30-day MFMA limit (25 days elapsed)",                  time: "1 week ago" },
  { sev: "LOW",    icon: "🟡", text: "TBX-2025-0062 — Khoza Engineering CIDB grade renewal 12 days overdue",                                   time: "10 days ago" },
  { sev: "LOW",    icon: "🟡", text: "TBX-2026-0047 — Late submission pattern: one bidder submitted 3 min before closing",                     time: "12 days ago" },
];

const SEV_CLS: Record<string, string> = {
  HIGH:   "border-danger/20 bg-danger/5 text-danger",
  MEDIUM: "border-warning/20 bg-warning/5 text-warning",
  LOW:    "border-border bg-muted/30 text-muted-foreground",
};

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Office of the Auditor-General — Procurement Monitor</h1>
            <p className="mt-1 text-sm text-muted-foreground">Real-time tamper-evident oversight of all municipal procurement activity · FY 2026/27</p>
          </div>
          <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Auditor General
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link key={s.label} to={s.to} className="block rounded-lg border border-border bg-card p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Access</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link to="/auditor/trail" className="inline-flex items-center justify-between gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <span>Full Audit Trail</span><ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/auditor/flags" className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span>Red Flag Report</span><ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/auditor/irregularities" className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span>Irregularities Report</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active Red Flag Alerts</h2>
        </div>
        <ul className="divide-y divide-border">
          {ALERTS.map((a, i) => (
            <li key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
              <span className="mt-0.5 text-lg leading-none">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{a.text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
              </div>
              <span className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide ${SEV_CLS[a.sev]}`}>
                {a.sev}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-6 py-3">
          <Link to="/auditor/flags" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            View full red flag report <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function GuardedDashboard() {
  return <RoleGuard allowedRoles={AUDITOR_ROLES}><Dashboard /></RoleGuard>;
}
