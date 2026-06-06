import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Download, Lock, Filter } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/auditor/trail")({ component: GuardedTrailPage });

const AUDITOR_ROLES = ["auditor"];

type EventType =
  | "USER_LOGIN" | "TENDER_PUBLISHED" | "BID_SUBMITTED"
  | "COMPLIANCE_PASS" | "COMPLIANCE_FAIL" | "GATE2_SCORED"
  | "BAC_SIGNATURE" | "PAYMENT_SIGNOFF" | "PAYMENT_RELEASED"
  | "VARIATION_APPROVED" | "FLAG_RAISED" | "IRREGULARITY_LOGGED"
  | "DOCUMENT_UPLOADED" | "PROFILE_UPDATED";

interface AuditEvent {
  id: string; timestamp: string; eventType: EventType;
  user: string; role: string; entity: string;
  project: string; detail: string; ip: string;
}

const EVENT_COLORS: Record<EventType, string> = {
  USER_LOGIN:          "bg-muted text-muted-foreground",
  TENDER_PUBLISHED:    "bg-primary/10 text-primary",
  BID_SUBMITTED:       "bg-primary/10 text-primary",
  COMPLIANCE_PASS:     "bg-success/10 text-success",
  COMPLIANCE_FAIL:     "bg-danger/10 text-danger",
  GATE2_SCORED:        "bg-primary/10 text-primary",
  BAC_SIGNATURE:       "bg-success/10 text-success",
  PAYMENT_SIGNOFF:     "bg-success/10 text-success",
  PAYMENT_RELEASED:    "bg-success/10 text-success",
  VARIATION_APPROVED:  "bg-warning/10 text-warning",
  FLAG_RAISED:         "bg-danger/10 text-danger",
  IRREGULARITY_LOGGED: "bg-danger/10 text-danger",
  DOCUMENT_UPLOADED:   "bg-muted text-muted-foreground",
  PROFILE_UPDATED:     "bg-muted text-muted-foreground",
};

const ALL_EVENTS: AuditEvent[] = [
  { id: "e01", timestamp: "2026-06-06T08:30:15", eventType: "BAC_SIGNATURE",      user: "Mr. R. van Wyk",       role: "CFO",                  entity: "City of Johannesburg",      project: "TBX-2026-0039", detail: "Gate 2 CFO sign-off — recommending Sizwe Construction",            ip: "10.8.4.41" },
  { id: "e02", timestamp: "2026-06-06T08:14:32", eventType: "USER_LOGIN",         user: "Ms. N. Dlamini",       role: "SCM Manager",          entity: "City of Johannesburg",      project: "",              detail: "Successful login — session started",                                ip: "10.8.4.22" },
  { id: "e03", timestamp: "2026-06-05T16:42:08", eventType: "FLAG_RAISED",        user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0051", detail: "B-BBEE Level 1 certificate flagged — SANAS verification failed",    ip: "10.0.0.1" },
  { id: "e04", timestamp: "2026-06-05T14:10:22", eventType: "PAYMENT_SIGNOFF",    user: "Mr. R. van Wyk",       role: "CFO",                  entity: "City of Johannesburg",      project: "PC-2026-031-001", detail: "CFO sign-off — R 2,180,000 to Mokoena Infrastructure Group",       ip: "10.8.4.41" },
  { id: "e05", timestamp: "2026-06-05T09:22:44", eventType: "TENDER_PUBLISHED",   user: "Ms. N. Dlamini",       role: "SCM Manager",          entity: "City of Johannesburg",      project: "TBX-2026-0051", detail: "Community Hall Ward 7 Emalahleni published to CSD portal",          ip: "10.8.4.22" },
  { id: "e06", timestamp: "2026-06-04T15:51:18", eventType: "GATE2_SCORED",       user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0039", detail: "5 bids auto-scored — Sizwe Construction ranked #1 with 89.2/100",  ip: "10.0.0.1" },
  { id: "e07", timestamp: "2026-06-04T10:15:00", eventType: "BAC_SIGNATURE",      user: "Mr. R. van Wyk",       role: "CFO",                  entity: "City of Johannesburg",      project: "TBX-2026-0039", detail: "BAC CFO sign-off — in agreement with system recommendation",         ip: "10.8.4.41" },
  { id: "e08", timestamp: "2026-06-04T09:04:55", eventType: "COMPLIANCE_PASS",    user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0039", detail: "Gate 1 compliance check passed — all 5 bidders compliant",          ip: "10.0.0.1" },
  { id: "e09", timestamp: "2026-06-03T14:30:00", eventType: "BAC_SIGNATURE",      user: "Ms. N. Dlamini",       role: "SCM Manager",          entity: "City of Johannesburg",      project: "TBX-2026-0039", detail: "BAC SCM Manager sign-off — concurs with automated scoring",          ip: "10.8.4.22" },
  { id: "e10", timestamp: "2026-06-02T11:05:33", eventType: "COMPLIANCE_PASS",    user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0039", detail: "Tax clearance verified for all 5 bidders via SARS live API",         ip: "10.0.0.1" },
  { id: "e11", timestamp: "2026-06-01T09:18:45", eventType: "BID_SUBMITTED",      user: "Ndaba Projects CC",    role: "Contractor",           entity: "Ndaba Projects CC",         project: "TBX-2026-0039", detail: "Bid submitted 3 min before deadline — anomaly auto-flagged",         ip: "197.80.42.19" },
  { id: "e12", timestamp: "2026-05-31T16:32:12", eventType: "BID_SUBMITTED",      user: "Sizwe Construction",   role: "Contractor",           entity: "Sizwe Construction (Pty) Ltd",project:"TBX-2026-0039", detail: "Bid submission — R 24,100,000 (incl. VAT)",                        ip: "196.35.18.44" },
  { id: "e13", timestamp: "2026-05-30T13:22:05", eventType: "FLAG_RAISED",        user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0039", detail: "Submission time pattern anomaly — Ndaba Projects (3rd occurrence)",  ip: "10.0.0.1" },
  { id: "e14", timestamp: "2026-05-28T09:00:00", eventType: "VARIATION_APPROVED", user: "Mr. K. Ndlovu",        role: "Municipal Manager",    entity: "City of Johannesburg",      project: "TBX-2025-0088", detail: "Variation R 7,400,000 approved (+16.4%) — underground services",     ip: "10.8.4.88" },
  { id: "e15", timestamp: "2026-05-15T08:22:14", eventType: "PAYMENT_RELEASED",   user: "Tenderbox Escrow",     role: "System",               entity: "Tenderbox Platform",        project: "PC-2025-047-003", detail: "EFT released — R 1,245,000 to Sizwe Construction Pty Ltd",         ip: "10.0.0.1" },
  { id: "e16", timestamp: "2026-05-10T14:55:30", eventType: "IRREGULARITY_LOGGED",user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0031", detail: "BAC deviation auto-reported — rank 3 awarded over rank 1 bidder",   ip: "10.0.0.1" },
  { id: "e17", timestamp: "2026-05-01T11:30:00", eventType: "DOCUMENT_UPLOADED",  user: "Ntuli Civil Works CC", role: "Contractor",           entity: "Ntuli Civil Works CC",      project: "TBX-2026-0039", detail: "B-BBEE certificate uploaded — Level 2 (expires 2027-03-31)",         ip: "105.188.73.12" },
  { id: "e18", timestamp: "2026-04-28T16:02:18", eventType: "TENDER_PUBLISHED",   user: "Ms. N. Dlamini",       role: "SCM Manager",          entity: "City of Johannesburg",      project: "TBX-2026-0047", detail: "Stormwater System Phase 3 published — CIDB 6CE, R 15.2M",           ip: "10.8.4.22" },
  { id: "e19", timestamp: "2026-04-15T10:44:02", eventType: "BAC_SIGNATURE",      user: "Ms. N. Dlamini",       role: "SCM Manager",          entity: "City of Johannesburg",      project: "TBX-2026-0031", detail: "BAC deviation — rank 3 bidder recommended; written motivation filed", ip: "10.8.4.22" },
  { id: "e20", timestamp: "2026-04-14T09:12:00", eventType: "COMPLIANCE_FAIL",    user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0031", detail: "CSD status lapsed for 1 bidder — disqualified from evaluation",      ip: "10.0.0.1" },
  { id: "e21", timestamp: "2026-03-20T08:18:55", eventType: "PROFILE_UPDATED",    user: "Khoza Engineering",    role: "Contractor",           entity: "Khoza Engineering (Pty) Ltd",project: "",             detail: "CIDB grade updated 4CE → 5CE — renewal certificate attached",        ip: "41.185.22.9" },
  { id: "e22", timestamp: "2026-02-28T14:05:11", eventType: "FLAG_RAISED",        user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2026-0044", detail: "Director cross-reference flag — shared director Khoza/Ndaba entities",ip: "10.0.0.1" },
  { id: "e23", timestamp: "2026-02-14T09:30:00", eventType: "USER_LOGIN",         user: "Mr. K. Ndlovu",        role: "Municipal Manager",    entity: "City of Johannesburg",      project: "",              detail: "Successful login — session started",                                ip: "10.8.4.88" },
  { id: "e24", timestamp: "2026-01-10T11:22:38", eventType: "IRREGULARITY_LOGGED",user: "Tenderbox AI Engine",  role: "System",               entity: "Tenderbox Platform",        project: "TBX-2025-0088", detail: "BAC quorum incomplete (4/5) — irregularity logged automatically",    ip: "10.0.0.1" },
];

const EVENT_TYPE_OPTIONS: EventType[] = [
  "USER_LOGIN","TENDER_PUBLISHED","BID_SUBMITTED","COMPLIANCE_PASS","COMPLIANCE_FAIL",
  "GATE2_SCORED","BAC_SIGNATURE","PAYMENT_SIGNOFF","PAYMENT_RELEASED",
  "VARIATION_APPROVED","FLAG_RAISED","IRREGULARITY_LOGGED","DOCUMENT_UPLOADED","PROFILE_UPDATED",
];

const ROLE_OPTIONS = [...new Set(ALL_EVENTS.map((e) => e.role))].sort();

function TrailPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<EventType | "">("");
  const [filterRole, setFilterRole] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      if (filterType && e.eventType !== filterType) return false;
      if (filterRole && e.role !== filterRole) return false;
      if (dateFrom && e.timestamp < dateFrom) return false;
      if (dateTo   && e.timestamp > dateTo + "T23:59:59") return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.user.toLowerCase().includes(q) ||
          e.project.toLowerCase().includes(q) ||
          e.detail.toLowerCase().includes(q) ||
          e.entity.toLowerCase().includes(q) ||
          e.ip.includes(q)
        );
      }
      return true;
    });
  }, [search, filterType, filterRole, dateFrom, dateTo]);

  const handleExportCSV = () => {
    const header = ["Timestamp","Event Type","User","Role","Entity","Project","Detail","IP Address"].join(",");
    const rows = filtered.map((e) =>
      [e.timestamp, e.eventType, `"${e.user}"`, `"${e.role}"`, `"${e.entity}"`, e.project, `"${e.detail}"`, e.ip].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `tenderbox-audit-trail-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Audit Trail</h1>
            <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              <Lock className="h-3 w-3" />Immutable · Read Only
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Every system event is cryptographically timestamped and tamper-evident · {ALL_EVENTS.length} total events</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Download className="h-4 w-4" />Export CSV ({filtered.length})
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />Filters
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search user, project, detail, IP…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as EventType | "")}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Event Types</option>
            {EVENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Roles</option>
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="flex gap-2 items-center">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <span className="text-xs text-muted-foreground shrink-0">to</span>
            <input type="date" value={dateTo}   onChange={(e) => setDateTo(e.target.value)}   className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        {(search || filterType || filterRole || dateFrom || dateTo) && (
          <button onClick={() => { setSearch(""); setFilterType(""); setFilterRole(""); setDateFrom(""); setDateTo(""); }} className="mt-2 text-xs text-muted-foreground hover:text-foreground underline">Clear filters</button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/40 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{filtered.length} events</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" />All records are read-only</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Timestamp</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Event Type</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">User</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Role</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Entity</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Project</th>
                <th className="px-4 py-3 font-medium">Detail</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className={i % 2 === 1 ? "bg-muted/20" : "bg-card"}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{formatTs(e.timestamp)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${EVENT_COLORS[e.eventType]}`}>
                      {e.eventType.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">{e.user}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{e.role}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{e.entity}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary whitespace-nowrap">{e.project || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[260px]">{e.detail}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{e.ip}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-muted-foreground">No events match the current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatTs(ts: string) {
  return new Date(ts).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function GuardedTrailPage() {
  return <RoleGuard allowedRoles={AUDITOR_ROLES}><TrailPage /></RoleGuard>;
}
