import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Send, CreditCard, ShieldCheck, ArrowRight, type LucideIcon } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { useProfile } from "@/lib/auth";

export const Route = createFileRoute("/contractor")({ component: ContractorDashboard });

const CONTRACTOR_ROLES = ["contractor", "employee"];

const STATS: { label: string; value: string; hint: string; icon: LucideIcon; accent: string; to: string }[] = [
  { label: "Active Tenders", value: "24", hint: "8 closing this week", icon: FileText, accent: "bg-primary/10 text-primary", to: "/contractor/tenders" },
  { label: "Submitted Bids", value: "12", hint: "3 under review", icon: Send, accent: "bg-accent/10 text-accent", to: "/contractor/bids" },
  { label: "Payments Due", value: "R 184,500", hint: "2 invoices overdue", icon: CreditCard, accent: "bg-warning/10 text-warning", to: "/contractor/payments" },
  { label: "Compliance Score", value: "92%", hint: "1 document expiring", icon: ShieldCheck, accent: "bg-success/10 text-success", to: "/compliance" },
];

const ACTIVITY = [
  { ref: "JHB-2026-014", entity: "City of Johannesburg", date: "29 May 2026", status: "approved", to: "/contractor/bids" },
  { ref: "ETH-2026-082", entity: "eThekwini Municipality", date: "02 Jun 2026", status: "pending", to: "/contractor/bids" },
  { ref: "CPT-2026-031", entity: "City of Cape Town", date: "11 Jun 2026", status: "pending", to: "/contractor/tenders" },
  { ref: "TSH-2026-007", entity: "City of Tshwane", date: "18 Jun 2026", status: "rejected", to: "/contractor/bids" },
];

const STATUS_MAP: Record<string, string> = {
  approved: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  rejected: "bg-danger/10 text-danger border-danger/20",
};

function Dashboard() {
  const profile = useProfile();
  const name = profile?.display_name ?? "Contractor";

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Welcome back, {name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Here's a snapshot of your tendering activity and compliance status.</p>
          </div>
          <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Contractor
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-lg border border-border bg-card p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all block">
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
          <Link to="/contractor/tenders" className="inline-flex items-center justify-between gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <span>View Open Tenders</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contractor/profile" className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span>Update Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contractor/payments" className="inline-flex items-center justify-between gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <span>Check Payments</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Tender Activity</h2>
          <Link to="/contractor/bids" className="text-xs text-primary hover:underline">View all bids →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Reference</th>
                <th className="px-6 py-3 font-medium">Entity</th>
                <th className="px-6 py-3 font-medium">Closing Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY.map((row, i) => (
                <tr key={row.ref} className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-primary/5 transition-colors`}>
                  <td className="px-6 py-3 font-mono font-medium text-foreground">{row.ref}</td>
                  <td className="px-6 py-3 text-muted-foreground">{row.entity}</td>
                  <td className="px-6 py-3 text-muted-foreground">{row.date}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_MAP[row.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link to={row.to} className="text-xs text-primary hover:underline">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ContractorDashboard() {
  return (
    <RoleGuard allowedRoles={CONTRACTOR_ROLES}>
      <Dashboard />
    </RoleGuard>
  );
}
