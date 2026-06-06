import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle, Clock, Fingerprint, Loader2, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/payments")({ component: GuardedPaymentsPage });

const CLIENT_ROLES = ["client_entity"];

type StepId = "qs" | "pa" | "invoice" | "pm" | "pmu" | "cfo" | "mm" | "released";

const STEP_DEFS: { id: StepId; label: string }[] = [
  { id: "qs",       label: "QS Measurement" },
  { id: "pa",       label: "PA Certification" },
  { id: "invoice",  label: "Invoice Submitted" },
  { id: "pm",       label: "PM Sign-off" },
  { id: "pmu",      label: "PMU Sign-off" },
  { id: "cfo",      label: "CFO Sign-off" },
  { id: "mm",       label: "MM Sign-off" },
  { id: "released", label: "Payment Released" },
];
const STEP_ORDER: StepId[] = STEP_DEFS.map((s) => s.id);

const CLIENT_STEPS: StepId[] = ["pmu", "cfo", "mm"];

type Approval = { completed: boolean; date: string | null; by?: string };
type Approvals = Record<StepId, Approval>;

interface Certificate {
  id: string; ref: string; tenderRef: string; tenderTitle: string;
  contractor: string; amount: number; invoiceDate: string;
  approvals: Approvals; daysElapsed: number;
}

function makeApprovals(steps: StepId[]): Approvals {
  const all: Approvals = {
    qs: { completed: false, date: null }, pa: { completed: false, date: null },
    invoice: { completed: false, date: null }, pm: { completed: false, date: null },
    pmu: { completed: false, date: null }, cfo: { completed: false, date: null },
    mm: { completed: false, date: null }, released: { completed: false, date: null },
  };
  steps.forEach((s, i) => {
    const d = new Date(Date.now() - (steps.length - i) * 2 * 86400000).toISOString();
    all[s] = { completed: true, date: d, by: signerLabel(s) };
  });
  return all;
}

function signerLabel(s: StepId): string {
  const m: Record<StepId, string> = {
    qs: "Eng. D. Maphumulo (QS)", pa: "Arch. S. Pillay (PA)", invoice: "Contractor",
    pm: "Mr. T. Mokoena (PM)", pmu: "Ms. B. Khumalo (PMU)", cfo: "Mr. R. van Wyk (CFO)",
    mm: "Mr. K. Ndlovu (MM)", released: "Tenderbox Payment Engine",
  };
  return m[s];
}

const INITIAL_CERTS: Certificate[] = [
  {
    id: "1", ref: "PC-2025-047-003", tenderRef: "TBX-2025-0047",
    tenderTitle: "Rehabilitation of Stormwater Drainage — Amathole", contractor: "Sizwe Construction (Pty) Ltd",
    amount: 1245000, invoiceDate: "2026-05-16", daysElapsed: 8,
    approvals: makeApprovals(["qs", "pa", "invoice", "pm"]),
  },
  {
    id: "2", ref: "PC-2026-031-001", tenderRef: "TBX-2026-0031",
    tenderTitle: "Rehabilitation of Access Roads — Ward 14 Randburg", contractor: "Mokoena Infrastructure Group",
    amount: 2180000, invoiceDate: "2026-05-28", daysElapsed: 19,
    approvals: makeApprovals(["qs", "pa", "invoice", "pm", "pmu"]),
  },
  {
    id: "3", ref: "PC-2026-039-004", tenderRef: "TBX-2026-0039",
    tenderTitle: "Sewer Reticulation Network Phase 2 — Diepkloof", contractor: "Ntuli Civil Works CC",
    amount: 890000, invoiceDate: "2026-05-10", daysElapsed: 25,
    approvals: makeApprovals(["qs", "pa", "invoice", "pm", "pmu", "cfo"]),
  },
  {
    id: "4", ref: "PC-2026-048-001", tenderRef: "TBX-2026-0048",
    tenderTitle: "Community Hall Construction — Ward 7 Emalahleni", contractor: "Khoza Engineering (Pty) Ltd",
    amount: 3450000, invoiceDate: "2026-06-02", daysElapsed: 4,
    approvals: makeApprovals(["qs"]),
  },
];

function getStep(approvals: Approvals): StepId | "done" {
  for (const s of STEP_ORDER) {
    if (!approvals[s].completed) return s;
  }
  return "done";
}

function daysRemaining(daysElapsed: number) { return Math.max(0, 30 - daysElapsed); }
function countdownCls(days: number) { return days > 15 ? "text-success" : days > 7 ? "text-warning" : "text-danger"; }
function countdownBg(days: number) { return days > 15 ? "border-success/20 bg-success/5" : days > 7 ? "border-warning/20 bg-warning/5" : "border-danger/20 bg-danger/5"; }

function PaymentsPage() {
  const { toast } = useToast();
  const [certs, setCerts] = useState<Certificate[]>(INITIAL_CERTS);
  const [signingCertId, setSigningCertId] = useState<string | null>(null);

  const handleSign = (certId: string) => {
    setSigningCertId(certId);
    setTimeout(() => {
      setCerts((prev) => prev.map((c) => {
        if (c.id !== certId) return c;
        const currentStep = getStep(c.approvals);
        if (currentStep === "done") return c;
        const newApprovals = {
          ...c.approvals,
          [currentStep]: { completed: true, date: new Date().toISOString(), by: signerLabel(currentStep) },
        };
        const nextStep = STEP_ORDER[STEP_ORDER.indexOf(currentStep) + 1] as StepId | undefined;
        if (nextStep === "released") {
          newApprovals.released = { completed: true, date: new Date().toISOString(), by: "Tenderbox Payment Engine" };
          setTimeout(() => toast(`Payment released — ${formatZAR(c.amount)} to ${c.contractor}`, "success"), 200);
        } else if (nextStep) {
          setTimeout(() => toast(`Signed — ${signerLabel(nextStep)} notified`, "success"), 200);
        }
        return { ...c, approvals: newApprovals };
      }));
      setSigningCertId(null);
    }, 2000);
  };

  const totalOutstanding = certs.filter((c) => getStep(c.approvals) !== "done").reduce((s, c) => s + c.amount, 0);
  const overdue = certs.filter((c) => daysRemaining(c.daysElapsed) <= 7 && getStep(c.approvals) !== "done").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Oversight</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor all active payment certificates across municipal projects</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
            <div className="text-xl font-bold text-foreground">{formatZAR(totalOutstanding)}</div>
            <div className="text-xs text-muted-foreground">Total outstanding</div>
          </div>
          {overdue > 0 && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-center">
              <div className="text-xl font-bold text-danger">{overdue}</div>
              <div className="text-xs text-muted-foreground">Near deadline</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {certs.map((cert) => {
          const currentStep = getStep(cert.approvals);
          const isReleased = currentStep === "done";
          const remaining = daysRemaining(cert.daysElapsed);
          const stepLabel = isReleased ? "Payment Released" : STEP_DEFS.find((s) => s.id === currentStep)?.label ?? currentStep;
          const canSign = !isReleased && CLIENT_STEPS.includes(currentStep as StepId);
          const isSigning = signingCertId === cert.id;
          const pct = Math.max(0, Math.min(100, (remaining / 30) * 100));
          const circ = 2 * Math.PI * 22;
          const strokeColor = remaining > 15 ? "#1D9E75" : remaining > 7 ? "#BA7517" : "#993C1D";

          return (
            <div key={cert.id} className={["rounded-lg border-2 bg-card shadow-sm overflow-hidden", isReleased ? "border-success/20" : countdownBg(remaining)].join(" ")}>
              <div className="flex flex-wrap items-start justify-between gap-4 p-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{cert.ref}</span>
                    <span className={["inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", isReleased ? "border-success/20 bg-success/10 text-success" : "border-warning/20 bg-warning/10 text-warning"].join(" ")}>
                      {isReleased ? "Released" : `Pending: ${stepLabel}`}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">{formatZAR(cert.amount)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {cert.contractor} · {cert.tenderRef}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{cert.tenderTitle}</div>
                </div>

                <div className="flex items-center gap-5">
                  {!isReleased && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative h-14 w-14">
                        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r="22" className="stroke-muted" strokeWidth="5" fill="none" />
                          <circle cx="26" cy="26" r="22" stroke={strokeColor} strokeWidth="5" fill="none" strokeLinecap="round"
                            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-bold ${countdownCls(remaining)}`}>{remaining}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">days left</span>
                    </div>
                  )}

                  {canSign && (
                    <button
                      onClick={() => handleSign(cert.id)}
                      disabled={isSigning}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                    >
                      {isSigning
                        ? <><Loader2 className="h-4 w-4 animate-spin" />Signing…</>
                        : <><Fingerprint className="h-4 w-4" />Sign Off</>}
                    </button>
                  )}
                  {isReleased && <CheckCircle className="h-8 w-8 text-success" />}
                </div>
              </div>

              <div className="border-t border-border/50 bg-muted/30 px-6 py-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {STEP_DEFS.map((step, idx) => {
                    const approval = cert.approvals[step.id];
                    const isCurr = step.id === currentStep;
                    return (
                      <div key={step.id} className="flex items-center gap-1.5 shrink-0">
                        {idx > 0 && <div className={`h-px w-4 ${approval.completed || isCurr ? "bg-success/50" : "bg-border"}`} />}
                        <div className={["flex flex-col items-center gap-0.5", approval.completed ? "text-success" : isCurr ? "text-primary" : "text-muted-foreground"].join(" ")}>
                          <div className={["flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold", approval.completed ? "bg-success/20" : isCurr ? "bg-primary/20" : "bg-muted"].join(" ")}>
                            {approval.completed ? "✓" : idx + 1}
                          </div>
                          <span className="text-[9px] whitespace-nowrap">{step.label.split(" ")[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isReleased && remaining <= 7 && (
                <div className="border-t border-danger/20 bg-danger/5 px-6 py-2 flex items-center gap-2 text-xs text-danger">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{remaining <= 0 ? "MFMA 30-day limit breached — automatic AG escalation initiated" : `Only ${remaining} days remaining — action required to avoid MFMA violation`}</span>
                </div>
              )}

              {isReleased && (
                <div className="border-t border-success/20 bg-success/5 px-6 py-2 flex items-center gap-2 text-xs text-success">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Payment released — EFT processed · Invoice date: {formatDate(cert.invoiceDate)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(d: string) { return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }); }
function formatZAR(n: number) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n); }

function GuardedPaymentsPage() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><PaymentsPage /></RoleGuard>;
}
