import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { Modal } from "@/components/Modal";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/auditor/flags")({ component: GuardedFlagsPage });

const AUDITOR_ROLES = ["auditor"];

type Severity = "HIGH" | "MEDIUM" | "LOW";
type FlagStatus = "Open" | "Under Review" | "Resolved";
type FlagType =
  | "BID_MANIPULATION" | "BBBEE_FRAUDULENT" | "DIRECTOR_CONFLICT"
  | "PRICE_CLUSTERING" | "VARIATION_EXCESS" | "LATE_PAYMENT"
  | "CIDB_EXPIRED" | "TAX_LAPSE" | "IP_DUPLICATE" | "SUBMISSION_ANOMALY";

interface RedFlag {
  id: string; severity: Severity; flagType: FlagType;
  tenderRef: string; contractor: string | null; description: string;
  detectedAt: string; status: FlagStatus; resolvedAt: string | null;
  assignedTo: string | null; notes: string;
}

const FLAGS: RedFlag[] = [
  { id: "f01", severity: "HIGH", flagType: "BBBEE_FRAUDULENT",   tenderRef: "TBX-2026-0051", contractor: "Sizwe Construction (Pty) Ltd", description: "B-BBEE Level 1 certificate submitted by Sizwe Construction could not be verified against SANAS accredited verification agency database. Certificate number B1-2025-1142 appears invalid.",       detectedAt: "2026-06-05T16:42:08", status: "Open",         resolvedAt: null,            assignedTo: null,                          notes: "" },
  { id: "f02", severity: "HIGH", flagType: "DIRECTOR_CONFLICT",  tenderRef: "TBX-2026-0044", contractor: null,                          description: "Cross-reference of CIPC director data reveals Mr. T. Khoza (ID 780412-xxx) is listed as a director of both Khoza Engineering (Pty) Ltd and Ndaba Projects CC, which are competing bidders.",           detectedAt: "2026-02-28T14:05:11", status: "Under Review", resolvedAt: null,            assignedTo: "Ms. N. Dlamini (SCM Manager)", notes: "SCM Manager investigating. Both companies served notices 01 Mar 2026." },
  { id: "f03", severity: "HIGH", flagType: "BID_MANIPULATION",   tenderRef: "TBX-2026-0039", contractor: "Ndaba Projects CC",           description: "Ndaba Projects CC submitted its bid exactly 3 minutes before the closing deadline. AI analysis of submission metadata indicates this is the third occurrence across different tenders. Statistical probability of coincidence <0.3%.", detectedAt: "2026-05-30T13:22:05", status: "Open",         resolvedAt: null,            assignedTo: null,                          notes: "" },
  { id: "f04", severity: "MEDIUM", flagType: "VARIATION_EXCESS", tenderRef: "TBX-2025-0088", contractor: "Mokoena Infrastructure Group", description: "Variation order TBX-2025-0088-VO-003 approved by Municipal Manager amounts to R 7,400,000 (16.4% of original contract value of R 45,000,000), exceeding the 15% threshold that requires Council approval under MFMA.", detectedAt: "2026-05-28T09:10:00", status: "Under Review", resolvedAt: null,            assignedTo: "Adv. P. Cele (Legal Advisor)",notes: "Legal advisor reviewing whether retrospective Council resolution is required." },
  { id: "f05", severity: "MEDIUM", flagType: "LATE_PAYMENT",     tenderRef: "TBX-2026-0039", contractor: "Ntuli Civil Works CC",         description: "Payment certificate PC-2026-039-004 (R 890,000) has been in the approval chain for 25 days. At the current processing rate the 30-day MFMA s65 statutory limit will be breached within 5 days.",                 detectedAt: "2026-06-04T08:00:00", status: "Open",         resolvedAt: null,            assignedTo: null,                          notes: "" },
  { id: "f06", severity: "MEDIUM", flagType: "PRICE_CLUSTERING", tenderRef: "TBX-2026-0031", contractor: null,                          description: "Three bids for TBX-2026-0031 were clustered within a 2.1% price band (R 8.82M – R 8.99M). While above the 2% alert threshold, analysis of the bid documents did not reveal collusion artefacts.",                  detectedAt: "2026-04-01T10:00:00", status: "Resolved",     resolvedAt: "2026-04-10T14:30:00", assignedTo: "Ms. N. Dlamini (SCM Manager)", notes: "Independent investigation completed. No evidence of collusion. Normal market pricing confirmed by quantity surveyor." },
  { id: "f07", severity: "LOW",   flagType: "CIDB_EXPIRED",      tenderRef: "TBX-2025-0062", contractor: "Khoza Engineering (Pty) Ltd",  description: "CIDB grade renewal for Khoza Engineering (Pty) Ltd (Grade 5ME) was 12 days past the renewal deadline at time of bid submission. The grade was subsequently renewed before contract award.",                    detectedAt: "2026-03-15T11:00:00", status: "Under Review", resolvedAt: null,            assignedTo: "Ms. N. Dlamini (SCM Manager)", notes: "CIDB confirmed renewal backdated. Legal opinion sought on validity of bid." },
  { id: "f08", severity: "LOW",   flagType: "TAX_LAPSE",         tenderRef: "TBX-2023-0082", contractor: "Sizwe Construction (Pty) Ltd", description: "Tax clearance status for Sizwe Construction (Pty) Ltd lapsed for a period of 9 days during execution of TBX-2023-0082. Progress payment was held pending renewal. Clearance was renewed within the statutory 7-day cure window.", detectedAt: "2024-08-15T09:00:00", status: "Resolved",     resolvedAt: "2024-08-24T11:00:00", assignedTo: null,                          notes: "Tax clearance renewed. Payment released after verification. Contractor cautioned." },
  { id: "f09", severity: "LOW",   flagType: "SUBMISSION_ANOMALY",tenderRef: "TBX-2026-0047", contractor: "Mokoena Infrastructure Group", description: "Submission timestamp metadata indicates the bid document was last modified 2 minutes before the portal submission. No anomaly detected in the document content itself.",                                              detectedAt: "2026-05-19T08:00:00", status: "Resolved",     resolvedAt: "2026-05-20T14:00:00", assignedTo: null,                          notes: "Reviewed by SCM Manager. Normal behaviour — contractor made final corrections. Closed." },
];

const SEV_ORDER: Severity[] = ["HIGH", "MEDIUM", "LOW"];

const SEV_CFG: Record<Severity, { cls: string; badgeCls: string; label: string }> = {
  HIGH:   { cls: "border-danger/30 bg-danger/5",   badgeCls: "bg-danger/10 text-danger border-danger/20",    label: "High Severity" },
  MEDIUM: { cls: "border-warning/30 bg-warning/5", badgeCls: "bg-warning/10 text-warning border-warning/20", label: "Medium Severity" },
  LOW:    { cls: "border-border bg-muted/20",       badgeCls: "bg-muted text-muted-foreground border-border",  label: "Low Severity" },
};

const STATUS_CFG: Record<FlagStatus, string> = {
  "Open":         "bg-danger/10 text-danger border-danger/20",
  "Under Review": "bg-warning/10 text-warning border-warning/20",
  "Resolved":     "bg-success/10 text-success border-success/20",
};

const FLAG_TYPE_LABELS: Record<FlagType, string> = {
  BID_MANIPULATION:  "Bid Manipulation",
  BBBEE_FRAUDULENT:  "B-BBEE Fraudulent",
  DIRECTOR_CONFLICT: "Director Conflict",
  PRICE_CLUSTERING:  "Price Clustering",
  VARIATION_EXCESS:  "Variation Excess",
  LATE_PAYMENT:      "Late Payment",
  CIDB_EXPIRED:      "CIDB Expired",
  TAX_LAPSE:         "Tax Lapse",
  IP_DUPLICATE:      "IP Duplicate",
  SUBMISSION_ANOMALY:"Submission Anomaly",
};

function FlagsPage() {
  const [filterType, setFilterType] = useState<FlagType | "">("");
  const [filterStatus, setFilterStatus] = useState<FlagStatus | "">("");
  const [viewFlag, setViewFlag] = useState<RedFlag | null>(null);

  const filtered = FLAGS.filter((f) => {
    if (filterType && f.flagType !== filterType) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    return true;
  });

  const openCount = FLAGS.filter((f) => f.status === "Open").length;
  const reviewCount = FLAGS.filter((f) => f.status === "Under Review").length;
  const highCount = FLAGS.filter((f) => f.severity === "HIGH").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Red Flag Report</h1>
          <p className="mt-1 text-sm text-muted-foreground">All automated integrity flags raised by the Tenderbox AI engine · {FLAGS.length} total</p>
        </div>
        <div className="flex flex-wrap gap-3 text-center">
          {[
            { label: "High Severity", value: highCount, cls: "text-danger" },
            { label: "Open",          value: openCount, cls: "text-warning" },
            { label: "Under Review",  value: reviewCount, cls: "text-primary" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="rounded-lg border border-border bg-card px-4 py-3">
              <div className={`text-xl font-bold ${cls}`}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as FlagType | "")} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Flag Types</option>
          {(Object.keys(FLAG_TYPE_LABELS) as FlagType[]).map((t) => <option key={t} value={t}>{FLAG_TYPE_LABELS[t]}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FlagStatus | "")} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Statuses</option>
          {(["Open", "Under Review", "Resolved"] as FlagStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {(filterType || filterStatus) && (
          <button onClick={() => { setFilterType(""); setFilterStatus(""); }} className="text-xs text-muted-foreground hover:text-foreground underline">Clear</button>
        )}
        <span className="ml-auto text-xs text-muted-foreground self-center">{filtered.length} flag{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {SEV_ORDER.map((sev) => {
        const sevFlags = filtered.filter((f) => f.severity === sev);
        if (sevFlags.length === 0) return null;
        const cfg = SEV_CFG[sev];
        return (
          <section key={sev} className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${sev === "HIGH" ? "text-danger" : sev === "MEDIUM" ? "text-warning" : "text-muted-foreground"}`} />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{cfg.label} — {sevFlags.length} flag{sevFlags.length !== 1 ? "s" : ""}</h2>
            </div>
            {sevFlags.map((flag) => (
              <div key={flag.id} className={`rounded-lg border-2 p-5 shadow-sm ${cfg.cls}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">{flag.tenderRef}</span>
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.badgeCls}`}>{sev}</span>
                      <span className="inline-flex rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{FLAG_TYPE_LABELS[flag.flagType]}</span>
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_CFG[flag.status]}`}>
                        {flag.status === "Resolved" && <CheckCircle className="mr-1 h-3 w-3" />}{flag.status}
                      </span>
                    </div>
                    {flag.contractor && <div className="mt-1.5 text-xs text-muted-foreground">Entity: {flag.contractor}</div>}
                    <p className="mt-2 text-sm text-foreground">{flag.description}</p>
                    {flag.notes && (
                      <div className="mt-2 rounded-md border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Review note: </span>{flag.notes}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                      <span>Detected: {formatDate(flag.detectedAt)}</span>
                      {flag.resolvedAt && <span>Resolved: {formatDate(flag.resolvedAt)}</span>}
                      {flag.assignedTo && <span>Assigned: {flag.assignedTo}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => setViewFlag(flag)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Eye className="h-3.5 w-3.5" />Details
                  </button>
                </div>
              </div>
            ))}
          </section>
        );
      })}

      {viewFlag && (
        <Modal title={`Flag Detail — ${viewFlag.tenderRef}`} onClose={() => setViewFlag(null)} size="lg">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold uppercase ${SEV_CFG[viewFlag.severity].badgeCls}`}>{viewFlag.severity}</span>
              <span className="inline-flex rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground uppercase">{FLAG_TYPE_LABELS[viewFlag.flagType]}</span>
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_CFG[viewFlag.status]}`}>{viewFlag.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Tender Reference", value: viewFlag.tenderRef },
                { label: "Detected", value: formatDate(viewFlag.detectedAt) },
                { label: "Entity / Contractor", value: viewFlag.contractor ?? "Multiple / System" },
                { label: "Assigned To", value: viewFlag.assignedTo ?? "Unassigned" },
                { label: "Resolved Date", value: viewFlag.resolvedAt ? formatDate(viewFlag.resolvedAt) : "Not yet resolved" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">Description</div>
              <p className="text-sm text-foreground">{viewFlag.description}</p>
            </div>
            {viewFlag.notes && (
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">Review Notes</div>
                <p className="text-sm text-muted-foreground">{viewFlag.notes}</p>
              </div>
            )}
            <button onClick={() => setViewFlag(null)} className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function GuardedFlagsPage() {
  return <RoleGuard allowedRoles={AUDITOR_ROLES}><FlagsPage /></RoleGuard>;
}
