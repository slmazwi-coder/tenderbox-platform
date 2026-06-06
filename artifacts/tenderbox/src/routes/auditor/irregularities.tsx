import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, TrendingUp, Clock, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "@/components/Modal";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/auditor/irregularities")({ component: GuardedIrregPage });

const AUDITOR_ROLES = ["auditor"];

type IrregType = "BAC_DEVIATION" | "VARIATION_EXCESS" | "LATE_PAYMENT";
type IrregStatus = "Under Investigation" | "Reported to AG" | "Resolved" | "Escalated";

interface Irregularity {
  id: string; type: IrregType; project: string; tenderRef: string;
  contractor: string; value: number | null; responsibleOfficial: string;
  role: string; justification: string; detectedAt: string;
  reportedToAGAt: string | null; status: IrregStatus; detail: string;
}

const IRREGULARITIES: Irregularity[] = [
  {
    id: "i01", type: "BAC_DEVIATION", project: "Rehabilitation of Access Roads — Ward 14 Randburg",
    tenderRef: "TBX-2026-0031", contractor: "Ntuli Civil Works CC (Rank 3)",
    value: 8900000, responsibleOfficial: "Ms. N. Dlamini", role: "SCM Manager",
    justification: "Rank 1 bidder (Sizwe Construction) has two outstanding defect notices from prior contracts. BAC considered this performance risk outweighs the scoring margin.",
    detectedAt: "2026-05-10T14:55:30", reportedToAGAt: "2026-05-11T08:00:00",
    status: "Reported to AG",
    detail: "The automated scoring ranked Sizwe Construction #1 with 89.2/100. The BAC awarded to Ntuli Civil Works CC (rank 3, 78.4/100). The motivation cites previous performance issues; however, no formal performance rating exists in the system for the prior contracts referenced. This constitutes a material deviation requiring AG scrutiny under MFMA s111.",
  },
  {
    id: "i02", type: "BAC_DEVIATION", project: "Bus Rapid Transit Infrastructure Phase 1",
    tenderRef: "TBX-2025-0088", contractor: "Mokoena Infrastructure Group",
    value: 45000000, responsibleOfficial: "Mr. S. Mahlangu", role: "Municipal Manager Representative",
    justification: "Mr. Mahlangu was absent due to a family emergency on the day of the BAC session. The remaining 4 members constituted a quorum per SCM Policy clause 7.4.",
    detectedAt: "2026-01-10T11:22:38", reportedToAGAt: "2026-01-11T08:00:00",
    status: "Resolved",
    detail: "BAC proceeded with 4/5 members. SCM Policy clause 7.4 permits a quorum of 4 for contracts below R 50M where the absent member's role is optional. Legal opinion confirmed the session was valid. Irregularity closed.",
  },
  {
    id: "i03", type: "BAC_DEVIATION", project: "Solar PV Rooftop Installation Phase 1",
    tenderRef: "TBX-2025-0062", contractor: "Khoza Engineering (Pty) Ltd",
    value: 22000000, responsibleOfficial: "Eng. K. Mokoena", role: "Technical Expert",
    justification: "Technical expert abstained from signing due to a perceived conflict. No written conflict declaration was filed. Chair proceeded with 4 remaining signatures.",
    detectedAt: "2026-01-22T09:00:00", reportedToAGAt: "2026-01-23T08:00:00",
    status: "Under Investigation",
    detail: "Eng. K. Mokoena abstained citing a perceived conflict but no Form COI-01 was submitted to the SCM office. Tenderbox flagged the incomplete BAC record automatically. The AG office has requested the original session minutes and a signed conflict declaration. Investigation ongoing.",
  },
  {
    id: "i04", type: "VARIATION_EXCESS", project: "Bus Rapid Transit Infrastructure Phase 1",
    tenderRef: "TBX-2025-0088", contractor: "Mokoena Infrastructure Group",
    value: 7400000, responsibleOfficial: "Mr. K. Ndlovu", role: "Municipal Manager",
    justification: "Underground services relocation required by City Power could not have been foreseen at tender stage. Engineer's instruction issued under JBCC clause 18.1. Variation is a bona fide necessity.",
    detectedAt: "2026-05-28T09:10:00", reportedToAGAt: null,
    status: "Under Investigation",
    detail: "Original contract value: R 45,000,000. Variation VO-003 adds R 7,400,000 (+16.4%), exceeding the 15% threshold of R 6,750,000 that requires Council approval under MFMA s33. The Municipal Manager approved without tabling the matter at Council. The legal advisor has been asked to obtain a retrospective Council resolution.",
  },
  {
    id: "i05", type: "VARIATION_EXCESS", project: "Solar PV Rooftop Installation Phase 1",
    tenderRef: "TBX-2025-0062", contractor: "Khoza Engineering (Pty) Ltd",
    value: 3760000, responsibleOfficial: "Eng. K. Mokoena", role: "Technical Expert / Project Engineer",
    justification: "Roof structural remedial works required at 3 sites due to pre-existing defects not visible during site inspection. Engineer's instruction EI-007 issued.",
    detectedAt: "2026-04-15T11:00:00", reportedToAGAt: null,
    status: "Under Investigation",
    detail: "Original contract: R 19,500,000. VO-001 adds R 3,760,000 (+19.3%), exceeding the 15% Council-approval threshold. Unlike TBX-2025-0088, the technical expert who signed the engineer's instruction is also the BAC member under investigation for a potential conflict. This creates a compound irregularity. Escalated to SCM Director.",
  },
  {
    id: "i06", type: "LATE_PAYMENT", project: "Sewer Reticulation Network Phase 1 — Diepkloof",
    tenderRef: "TBX-2024-0039", contractor: "Sizwe Construction (Pty) Ltd",
    value: 1890000, responsibleOfficial: "Mr. K. Ndlovu", role: "Municipal Manager",
    justification: "Municipal Manager was on official international travel for 10 days. Acting MM was not authorised to sign payment certificates above R 500,000 under the delegation register.",
    detectedAt: "2025-09-15T08:00:00", reportedToAGAt: "2025-09-16T08:00:00",
    status: "Reported to AG",
    detail: "Payment certificate PC-2025-031-002 was in the chain for 38 days before release. The 30-day MFMA s65 limit was breached by 8 days. Sizwe Construction invoiced R 47,250 in mora interest (prime + 2%). The municipality paid the interest claim. The delegation register has since been updated to allow the acting MM to sign certificates up to R 5M.",
  },
  {
    id: "i07", type: "LATE_PAYMENT", project: "Bus Rapid Transit Infrastructure Phase 1",
    tenderRef: "TBX-2025-0088", contractor: "Mokoena Infrastructure Group",
    value: 3200000, responsibleOfficial: "Mr. R. van Wyk", role: "Chief Financial Officer",
    justification: "Budget vote confirmation for the infrastructure programme was delayed by National Treasury. CFO placed a discretionary hold on all payments above R 1M pending budget confirmation.",
    detectedAt: "2026-03-10T08:00:00", reportedToAGAt: "2026-03-11T08:00:00",
    status: "Escalated",
    detail: "PC-2024-022-005 was delayed 44 days in total, breaching the 30-day MFMA limit by 14 days. Contractor submitted a formal dispute notice and claim for mora interest of R 102,400. National Treasury has been copied on the AG report. The CFO's discretionary hold is not a recognised justification under MFMA s65. Escalated to Provincial Treasury.",
  },
];

const TYPE_CFG: Record<IrregType, { label: string; icon: typeof Scale; cls: string }> = {
  BAC_DEVIATION:   { label: "BAC Deviations",         icon: Scale,      cls: "text-warning" },
  VARIATION_EXCESS:{ label: "Variations Exceeding 15%",icon: TrendingUp, cls: "text-danger"  },
  LATE_PAYMENT:    { label: "Late Payments (>30 days)",icon: Clock,      cls: "text-danger"  },
};

const STATUS_CFG: Record<IrregStatus, string> = {
  "Under Investigation": "bg-warning/10 text-warning border-warning/20",
  "Reported to AG":      "bg-danger/10 text-danger border-danger/20",
  "Resolved":            "bg-success/10 text-success border-success/20",
  "Escalated":           "bg-danger/20 text-danger border-danger/40",
};

function IrregPage() {
  const [viewItem, setViewItem] = useState<Irregularity | null>(null);
  const [expanded, setExpanded] = useState<IrregType | null>(null);

  const typeSections: IrregType[] = ["BAC_DEVIATION", "VARIATION_EXCESS", "LATE_PAYMENT"];

  const totals = {
    BAC_DEVIATION:    IRREGULARITIES.filter((i) => i.type === "BAC_DEVIATION").length,
    VARIATION_EXCESS: IRREGULARITIES.filter((i) => i.type === "VARIATION_EXCESS").length,
    LATE_PAYMENT:     IRREGULARITIES.filter((i) => i.type === "LATE_PAYMENT").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Procurement Irregularities</h1>
        <p className="mt-1 text-sm text-muted-foreground">All deviations, excess variations, and statutory breaches — auto-reported under MFMA · {IRREGULARITIES.length} total</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {typeSections.map((type) => {
          const cfg = TYPE_CFG[type];
          const unresolvedCount = IRREGULARITIES.filter((i) => i.type === type && i.status !== "Resolved").length;
          return (
            <div key={type} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <cfg.icon className={`h-5 w-5 ${cfg.cls}`} />
                <span className="text-xs font-medium text-muted-foreground">{cfg.label}</span>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">{totals[type]}</span>
                {unresolvedCount > 0 && (
                  <span className="mb-0.5 text-sm font-medium text-warning">{unresolvedCount} unresolved</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {typeSections.map((type) => {
        const items = IRREGULARITIES.filter((i) => i.type === type);
        const cfg = TYPE_CFG[type];
        const isExpanded = expanded !== type;
        return (
          <section key={type} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === type ? null : type)}
              className="w-full flex items-center justify-between px-6 py-4 border-b border-border hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <cfg.icon className={`h-5 w-5 ${cfg.cls}`} />
                <div>
                  <div className="font-semibold text-foreground">{cfg.label}</div>
                  <div className="text-xs text-muted-foreground">{items.length} irregularit{items.length !== 1 ? "ies" : "y"} · {items.filter((i) => i.status !== "Resolved").length} unresolved</div>
                </div>
              </div>
              {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
            </button>

            {isExpanded && (
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="px-6 py-5 hover:bg-muted/20 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-foreground">{item.tenderRef}</span>
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_CFG[item.status]}`}>{item.status}</span>
                        </div>
                        <p className="mt-1.5 text-sm font-medium text-foreground">{item.project}</p>
                        <p className="text-xs text-muted-foreground">{item.contractor}</p>
                        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-3 text-xs text-muted-foreground">
                          {item.value !== null && (
                            <span><strong className="text-foreground">Value:</strong> {formatZAR(item.value)}</span>
                          )}
                          <span><strong className="text-foreground">Official:</strong> {item.responsibleOfficial} ({item.role})</span>
                          <span><strong className="text-foreground">Detected:</strong> {formatDate(item.detectedAt)}</span>
                          {item.reportedToAGAt && (
                            <span><strong className="text-foreground">Reported to AG:</strong> {formatDate(item.reportedToAGAt)}</span>
                          )}
                        </div>
                        <div className="mt-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">
                          <span className="font-semibold text-foreground">Justification on file: </span>
                          <span className="text-muted-foreground">{item.justification}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewItem(item)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5" />Full Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {viewItem && (
        <Modal title={`Irregularity — ${viewItem.tenderRef}`} onClose={() => setViewItem(null)} size="lg">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground uppercase">{viewItem.type.replace(/_/g, " ")}</span>
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_CFG[viewItem.status]}`}>{viewItem.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Tender Reference",    value: viewItem.tenderRef },
                { label: "Project",             value: viewItem.project },
                { label: "Contractor",          value: viewItem.contractor },
                { label: "Value Involved",      value: viewItem.value !== null ? formatZAR(viewItem.value) : "N/A" },
                { label: "Responsible Official",value: viewItem.responsibleOfficial },
                { label: "Role",                value: viewItem.role },
                { label: "Detected",            value: formatDate(viewItem.detectedAt) },
                { label: "Reported to AG",      value: viewItem.reportedToAGAt ? formatDate(viewItem.reportedToAGAt) : "Not yet" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">Justification on File</div>
              <p className="text-sm text-muted-foreground">{viewItem.justification}</p>
            </div>
            <div className="rounded-md border border-warning/20 bg-warning/5 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">AG Assessment</div>
              <p className="text-sm text-muted-foreground">{viewItem.detail}</p>
            </div>
            <button onClick={() => setViewItem(null)} className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}

function GuardedIrregPage() {
  return <RoleGuard allowedRoles={AUDITOR_ROLES}><IrregPage /></RoleGuard>;
}
