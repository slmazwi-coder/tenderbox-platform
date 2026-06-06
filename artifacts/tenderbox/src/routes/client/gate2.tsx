import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle, XCircle, AlertTriangle, Fingerprint,
  Shield, Award, Clock, Loader2, Info,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/gate2")({ component: GuardedGate2Page });

const CLIENT_ROLES = ["client_entity"];

const TENDERS_FOR_GATE2 = [
  { ref: "TBX-2026-0039", title: "Sewer Reticulation Network Phase 2 — Diepkloof", closed: "15 May 2026" },
];

interface Bidder {
  id: string; company: string; compliance: boolean; functionality: number;
  price: number; bbbee: number; total: number; rank: number;
  flags: string[]; recommended: boolean;
}

const BIDDERS: Bidder[] = [
  { id: "1", company: "Sizwe Construction (Pty) Ltd", compliance: true, functionality: 88.0, price: 78.4, bbbee: 20, total: 89.2, rank: 1, flags: [], recommended: true },
  { id: "2", company: "Mokoena Infrastructure Group", compliance: true, functionality: 82.0, price: 71.2, bbbee: 16, total: 79.2, rank: 2, flags: [], recommended: false },
  { id: "3", company: "Ntuli Civil Works CC", compliance: true, functionality: 78.0, price: 80.0, bbbee: 12, total: 78.4, rank: 3, flags: [], recommended: false },
  { id: "4", company: "Khoza Engineering (Pty) Ltd", compliance: true, functionality: 74.0, price: 68.8, bbbee: 20, total: 76.2, rank: 4, flags: [], recommended: false },
  { id: "5", company: "Ndaba Projects CC", compliance: true, functionality: 70.0, price: 72.0, bbbee: 8, total: 68.4, rank: 5, flags: ["Submission time anomaly — bid submitted 3 min before deadline. Pattern detected in 2 prior tenders."], recommended: false },
];

interface IntegrityCheck {
  id: number; label: string; description: string;
  status: "pass" | "flag" | "pending"; flagDetail?: string;
}

const INTEGRITY_CHECKS: IntegrityCheck[] = [
  { id: 1, label: "Duplicate IP Submission Detection", description: "All bids submitted from distinct IP addresses with no overlap.", status: "pass" },
  { id: 2, label: "Document Template Fingerprint Match", description: "No shared formatting artefacts detected between competing bid documents.", status: "pass" },
  { id: 3, label: "Price Clustering Analysis", description: "Bid prices show normal market spread; no clustering within 2% band.", status: "pass" },
  { id: 4, label: "Director Cross-Reference Check", description: "No shared directors or beneficial owners between competing bidders.", status: "pass" },
  { id: 5, label: "Shell Company Registry Scan", description: "All entities match CIPC active status with trading history > 2 years.", status: "pass" },
  { id: 6, label: "Abnormally Low Bid Price Detection", description: "No bid price falls below 80% of the engineer's estimate.", status: "pass" },
  { id: 7, label: "CIDB Grade Verification", description: "All bidders hold valid CIDB Grade 6CE or higher.", status: "pass" },
  { id: 8, label: "CSD Registration Currency", description: "All bidders are active and current on the Central Supplier Database.", status: "pass" },
  { id: 9, label: "Tax Clearance Verification", description: "SARS tax clearance confirmed for all 5 bidders via live API.", status: "pass" },
  { id: 10, label: "B-BBEE Certificate Authenticity", description: "All B-BBEE certificates verified against the SANAS accredited verification agency.", status: "pass" },
  { id: 11, label: "Compulsory Briefing Attendance Confirmed", description: "All bidders signed the compulsory briefing register.", status: "pass" },
  { id: 12, label: "Submission Time Pattern Analysis", description: "AI analysis of submission timestamps and metadata.", status: "flag", flagDetail: "Ndaba Projects CC submitted exactly 3 minutes before closing — identical pattern detected in 2 previous municipal tenders. Recommend enhanced scrutiny of this bid." },
];

type BacMemberId = "cfo" | "scm" | "tech" | "mm" | "legal";
interface BacMember {
  id: BacMemberId; title: string; name: string;
  status: "signed" | "in_progress" | "awaiting"; signedAt: string | null; windowDays: number;
}

const INITIAL_BAC: BacMember[] = [
  { id: "cfo",   title: "Chief Financial Officer",        name: "Mr. R. van Wyk",      status: "signed",      signedAt: "2026-06-04T10:15:00", windowDays: 5 },
  { id: "scm",   title: "SCM Manager",                    name: "Ms. N. Dlamini",      status: "signed",      signedAt: "2026-06-04T14:30:00", windowDays: 5 },
  { id: "tech",  title: "Technical Expert",               name: "Eng. K. Mokoena",     status: "in_progress", signedAt: null,                   windowDays: 5 },
  { id: "mm",    title: "Municipal Manager Representative",name: "Mr. S. Mahlangu",    status: "awaiting",    signedAt: null,                   windowDays: 5 },
  { id: "legal", title: "Legal Advisor",                  name: "Adv. P. Cele",        status: "awaiting",    signedAt: null,                   windowDays: 5 },
];

const BAC_ORDER: BacMemberId[] = ["cfo", "scm", "tech", "mm", "legal"];

function Gate2Page() {
  const { toast } = useToast();
  const [bac, setBac] = useState<BacMember[]>(INITIAL_BAC);
  const [signingId, setSigningId] = useState<BacMemberId | null>(null);
  const [activeTab, setActiveTab] = useState<"scoring" | "integrity" | "bac">("scoring");

  const currentBacStep = bac.find((m) => m.status !== "signed")?.id ?? null;
  const allSigned = bac.every((m) => m.status === "signed");
  const signedCount = bac.filter((m) => m.status === "signed").length;

  const handleBacSign = (memberId: BacMemberId) => {
    if (memberId !== currentBacStep) return;
    setSigningId(memberId);
    setTimeout(() => {
      setBac((prev) => {
        const updated = prev.map((m) =>
          m.id === memberId ? { ...m, status: "signed" as const, signedAt: new Date().toISOString() } : m
        );
        const nextIdx = BAC_ORDER.indexOf(memberId) + 1;
        const next = updated[nextIdx];
        if (next) {
          setTimeout(() => toast(`${next.title} ${next.name} has been notified to sign`, "info"), 100);
        } else {
          setTimeout(() => toast("BAC quorum complete — award recommendation submitted to MM", "success"), 100);
        }
        return updated;
      });
      setSigningId(null);
    }, 2000);
  };

  const tabs = [
    { id: "scoring" as const,   label: "Scoring Summary" },
    { id: "integrity" as const, label: "Red Flag Engine" },
    { id: "bac" as const,       label: `BAC Sign-off (${signedCount}/${bac.length})` },
  ];

  const flagCount = INTEGRITY_CHECKS.filter((c) => c.status === "flag").length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Gate 2 — Adjudication in Progress</span>
            </div>
            <h1 className="mt-2 text-xl font-bold text-foreground">TBX-2026-0039</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Sewer Reticulation Network Phase 2 — Diepkloof · Closed 15 May 2026</p>
          </div>
          <div className="flex flex-wrap gap-3 text-center">
            {[
              { label: "Bids Received", value: "5" },
              { label: "Integrity Flags", value: String(flagCount), warn: flagCount > 0 },
              { label: "BAC Signed", value: `${signedCount}/${bac.length}` },
            ].map(({ label, value, warn }) => (
              <div key={label} className="rounded-md border border-border bg-card px-4 py-3 min-w-[90px]">
                <div className="text-2xl font-bold text-foreground" style={{ color: warn ? "var(--color-warning)" : undefined }}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
        {allSigned && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
            <CheckCircle className="h-4 w-4" />BAC quorum complete — Award recommendation issued to Municipal Manager
          </div>
        )}
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={["border-b-2 px-1 py-3 text-sm font-medium transition-colors", activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"].join(" ")}>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "scoring" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Compliance Stage", value: "Pass/Fail", sub: "5 / 5 compliant" },
              { label: "Functionality Weight", value: "20 pts", sub: "Scored out of 100" },
              { label: "Price Weight", value: "80 pts", sub: "Lowest responsive bid" },
              { label: "B-BBEE Weight", value: "20 pts", sub: "Preference points" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                <div className="mt-1 text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted/50 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Automated Scoring — Ranked Results</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Rank</th>
                    <th className="px-6 py-3 font-medium">Bidder</th>
                    <th className="px-6 py-3 font-medium">Compliance</th>
                    <th className="px-6 py-3 font-medium">Functionality</th>
                    <th className="px-6 py-3 font-medium">Price Pts</th>
                    <th className="px-6 py-3 font-medium">B-BBEE</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {BIDDERS.map((b, i) => (
                    <tr key={b.id} className={`${i % 2 === 1 ? "bg-muted/30" : "bg-card"} ${b.recommended ? "ring-1 ring-inset ring-success/30" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${b.rank === 1 ? "bg-success text-success-foreground" : "bg-muted text-foreground"}`}>
                            #{b.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{b.company}</div>
                        {b.recommended && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                            <Award className="h-3 w-3" />Recommended
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {b.compliance
                          ? <CheckCircle className="h-5 w-5 text-success" />
                          : <XCircle className="h-5 w-5 text-danger" />}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${b.functionality}%` }} />
                          </div>
                          <span className="font-medium text-foreground">{b.functionality.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{b.price.toFixed(1)}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{b.bbbee}</td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${b.total >= 85 ? "text-success" : b.total >= 70 ? "text-foreground" : "text-warning"}`}>
                          {b.total.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {b.flags.length > 0
                          ? <span className="inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning"><AlertTriangle className="h-3 w-3" />{b.flags.length}</span>
                          : <span className="text-xs text-muted-foreground">None</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "integrity" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <Shield className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Tenderbox Integrity Engine — 12 automated checks completed</p>
              <p className="text-xs text-muted-foreground">{INTEGRITY_CHECKS.filter((c) => c.status === "pass").length} passed · {INTEGRITY_CHECKS.filter((c) => c.status === "flag").length} flag{INTEGRITY_CHECKS.filter((c) => c.status === "flag").length !== 1 ? "s" : ""} raised · All results logged to audit trail</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 w-10 font-medium">#</th>
                    <th className="px-6 py-3 font-medium">Check</th>
                    <th className="px-6 py-3 font-medium">Result</th>
                    <th className="px-6 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {INTEGRITY_CHECKS.map((check, i) => (
                    <tr key={check.id} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                      <td className="px-6 py-3 text-muted-foreground">{check.id}</td>
                      <td className="px-6 py-3 font-medium text-foreground">{check.label}</td>
                      <td className="px-6 py-3">
                        {check.status === "pass"
                          ? <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium text-success"><CheckCircle className="h-3 w-3" />Pass</span>
                          : check.status === "flag"
                          ? <span className="inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning"><AlertTriangle className="h-3 w-3" />Flag</span>
                          : <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"><Clock className="h-3 w-3" />Pending</span>
                        }
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground max-w-xs">
                        {check.status === "flag" && check.flagDetail
                          ? <span className="text-warning">{check.flagDetail}</span>
                          : check.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {flagCount > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Red Flag — Enhanced Scrutiny Required</p>
                  <p className="mt-1 text-muted-foreground">The BAC must consider the flagged bid with enhanced scrutiny. BAC deviation from the automated recommendation must be recorded with written motivation. Any material deviation is automatically reported to the Auditor General.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "bac" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Bid Adjudication Committee — Electronic Sign-off</p>
                <p className="mt-1 text-sm text-muted-foreground">Each BAC member has a 5-day window to review and sign. Failure to sign within the window triggers an automatic escalation notice to the Municipal Manager and SCM Director.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {bac.map((member) => {
              const isCurrent = member.id === currentBacStep;
              const canSign = isCurrent && !allSigned;
              return (
                <div key={member.id} className={["rounded-lg border p-4 transition-all", member.status === "signed" ? "border-success/20 bg-success/5" : isCurrent ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"].join(" ")}>
                  <div className="flex items-center gap-4">
                    <div className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-full", member.status === "signed" ? "bg-success/20 text-success" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"].join(" ")}>
                      {member.status === "signed"
                        ? <CheckCircle className="h-5 w-5" />
                        : isCurrent
                        ? <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                        : <div className="h-2.5 w-2.5 rounded-full bg-current" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.title}</div>
                      {member.status === "signed" && member.signedAt && (
                        <div className="text-xs text-success mt-0.5">Signed {formatDateTime(member.signedAt)}</div>
                      )}
                      {isCurrent && <div className="text-xs text-primary mt-0.5">Awaiting signature — {member.windowDays}-day window</div>}
                      {member.status === "awaiting" && !isCurrent && <div className="text-xs text-muted-foreground mt-0.5">Waiting in queue</div>}
                    </div>
                    {canSign && (
                      <button
                        onClick={() => handleBacSign(member.id)}
                        disabled={signingId === member.id}
                        className="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                      >
                        {signingId === member.id
                          ? <><Fingerprint className="h-4 w-4 animate-pulse" />Verifying…</>
                          : <><Fingerprint className="h-4 w-4" />Sign & Approve</>}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Auditor General Reporting</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Any BAC recommendation that deviates from the automated scoring result requires written motivation signed by all BAC members. Deviations without adequate motivation are <strong>automatically reported to the Auditor General</strong> via the Tenderbox compliance engine. All sign-offs are cryptographically timestamped and tamper-evident.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function GuardedGate2Page() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><Gate2Page /></RoleGuard>;
}
