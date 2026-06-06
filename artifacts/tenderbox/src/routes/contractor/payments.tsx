import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle, Lock, Download, ToggleLeft, ToggleRight,
  Shield, Fingerprint, ChevronDown, ChevronUp,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/contractor/payments")({ component: GuardedPaymentsPage });

const CONTRACTOR_ROLES = ["contractor", "employee"];

const STEP_DEFS = [
  { id: "qs", label: "QS Measurement", window: "7 days" },
  { id: "pa", label: "PA Certification", window: "5 days" },
  { id: "invoice", label: "Invoice Submitted", window: "—" },
  { id: "pm", label: "PM Sign-off", window: "4 days" },
  { id: "pmu", label: "PMU Sign-off", window: "3 days" },
  { id: "cfo", label: "CFO Sign-off", window: "3 days" },
  { id: "mm", label: "MM Sign-off", window: "3 days" },
  { id: "released", label: "PAYMENT RELEASED", window: "—" },
];

type StepId = "qs" | "pa" | "invoice" | "pm" | "pmu" | "cfo" | "mm" | "released";
interface Approval { completed: boolean; date: string | null; signedBy?: string }
type Approvals = Record<StepId, Approval>;

const INITIAL_APPROVALS: Approvals = {
  qs: { completed: true, date: "2026-05-20T10:30:00", signedBy: "Eng. D. Maphumulo (QS)" },
  pa: { completed: true, date: "2026-05-22T14:15:00", signedBy: "Arch. S. Pillay (PA)" },
  invoice: { completed: true, date: "2026-05-16T09:00:00" },
  pm: { completed: true, date: "2026-05-24T11:45:00", signedBy: "Mr. T. Mokoena (PM)" },
  pmu: { completed: false, date: null },
  cfo: { completed: false, date: null },
  mm: { completed: false, date: null },
  released: { completed: false, date: null },
};

const STEP_ORDER: StepId[] = ["qs", "pa", "invoice", "pm", "pmu", "cfo", "mm", "released"];
const SIGNER_NAMES: Record<StepId, string> = {
  qs: "QS Eng. D. Maphumulo", pa: "Arch. S. Pillay", invoice: "Sizwe Construction",
  pm: "PM Mr. T. Mokoena", pmu: "PMU Director Ms. B. Khumalo", cfo: "CFO Mr. R. van Wyk",
  mm: "Municipal Manager Mr. K. Ndlovu", released: "Tenderbox Payment Engine",
};

const PAYMENT_HISTORY = [
  { id: "PC-2025-047-002", period: "Apr 2026", amount: 2150000, releasedDate: "2026-05-08", daysTaken: 16, status: "paid" },
  { id: "PC-2025-047-001", period: "Mar 2026", amount: 1875000, releasedDate: "2026-04-12", daysTaken: 22, status: "paid" },
  { id: "PC-2025-046-003", period: "Feb 2026", amount: 3240000, releasedDate: "2026-03-28", daysTaken: 28, status: "paid" },
  { id: "PC-2025-045-002", period: "Jan 2026", amount: 2980000, releasedDate: "2026-02-28", daysTaken: 31, status: "overdue" },
];

function PaymentsPage() {
  const { toast } = useToast();
  const [contractorView, setContractorView] = useState(false);
  const [approvals, setApprovals] = useState<Approvals>(INITIAL_APPROVALS);
  const [signing, setSigning] = useState<StepId | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const daysRemaining = 22 - STEP_ORDER.filter((s) => s !== "invoice" && approvals[s].completed).length * 2;
  const clockColor = daysRemaining > 15 ? "text-success" : daysRemaining > 7 ? "text-warning" : "text-danger";
  const currentStep = STEP_ORDER.find((s) => !approvals[s].completed) ?? "released";
  const isReleased = approvals.released.completed;

  const handleSign = (stepId: StepId) => {
    if (stepId !== currentStep) return;
    setSigning(stepId);
    setTimeout(() => {
      setApprovals((prev) => {
        const updated = { ...prev, [stepId]: { completed: true, date: new Date().toISOString(), signedBy: SIGNER_NAMES[stepId] } };
        const nextIdx = STEP_ORDER.indexOf(stepId) + 1;
        const nextStep = STEP_ORDER[nextIdx];
        if (nextStep === "released") {
          updated.released = { completed: true, date: new Date().toISOString() };
          setTimeout(() => toast("Payment released — R1,245,000 transferred to your account", "success"), 200);
        } else {
          setTimeout(() => toast(`Signature recorded — ${SIGNER_NAMES[nextStep ?? stepId]} has been notified`, "success"), 200);
        }
        return updated;
      });
      setSigning(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Engine</h1>
          <p className="mt-1 text-sm text-muted-foreground">Automated escrow-based payment processing — 30 day outer limit</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setContractorView(!contractorView)} className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${contractorView ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"}`}>
            {contractorView ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {contractorView ? "Transparency View Active" : "Transparency View"}
          </button>
          <button onClick={() => toast("Generating payment report PDF…", "info")} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" />Export Report
          </button>
        </div>
      </div>

      {contractorView && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-foreground">Contractor Transparency View</div>
              <p className="mt-0.5 text-sm text-muted-foreground">You can see exactly where your payment is in the approval chain at all times. Any delay is visible and the responsible official is notified automatically.</p>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Active Payment Certificates (1)</h2>
        <div className={`rounded-lg border-2 bg-card shadow-sm overflow-hidden ${isReleased ? "border-success/30" : "border-warning/30"}`}>
          <div className={`px-6 py-4 ${isReleased ? "bg-success/10" : "bg-warning/10"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-mono text-sm font-bold text-foreground">PC-2025-047-003</div>
                <div className="mt-0.5 text-sm text-muted-foreground">TBX-2025-0031 · Rehabilitation of Stormwater Drainage System</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{formatZAR(1245000)}</div>
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${isReleased ? "border-success/30 bg-success/20 text-success" : "border-warning/30 bg-warning/20 text-warning"}`}>
                  {isReleased ? "Payment Released" : `Pending ${STEP_DEFS.find((s) => s.id === currentStep)?.label}`}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Contractor</div>
              <div className="font-medium text-foreground">Sizwe Construction (Pty) Ltd</div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Payment Chain Progress</div>
              <div className="space-y-2">
                {STEP_DEFS.map((step) => {
                  const stepId = step.id as StepId;
                  const approval = approvals[stepId];
                  const isCurrent = stepId === currentStep && !approval.completed;
                  const isSignable = isCurrent && !isReleased;
                  return (
                    <div key={step.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${approval.completed ? "border-success/20 bg-success/5" : isCurrent ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${approval.completed ? "bg-success/20 text-success" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {approval.completed ? <CheckCircle className="h-5 w-5" /> : isCurrent ? <div className="h-3 w-3 rounded-full bg-primary animate-pulse" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium ${approval.completed ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
                          {step.window !== "—" && <span className="text-xs text-muted-foreground shrink-0">{step.window}</span>}
                        </div>
                        {approval.completed && approval.date && <div className="text-xs text-muted-foreground">{approval.signedBy ?? "Completed"} · {formatDateTime(approval.date)}</div>}
                        {isCurrent && <div className="text-xs text-primary">Awaiting signature · {step.window} window</div>}
                      </div>
                      {isSignable && (
                        <button onClick={() => handleSign(stepId)} disabled={signing === stepId} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                          {signing === stepId ? <><Fingerprint className="h-3.5 w-3.5 animate-pulse" />Verifying…</> : <><Fingerprint className="h-3.5 w-3.5" />Sign</>}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">30-Day Statutory Window</div>
                <div className="mt-1 text-2xl font-bold">
                  <span className={clockColor}>{Math.max(0, daysRemaining)} days</span>{" "}
                  <span className="text-base font-normal text-muted-foreground">remaining</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Invoice submitted: 16 May 2026</div>
              </div>
              <CircularClock daysRemaining={Math.max(0, daysRemaining)} />
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-foreground">Escrow: Ring-fenced</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{formatZAR(1245000)}</div>
                  <span className="text-xs text-success">Funds confirmed available</span>
                </div>
              </div>
            </div>

            {contractorView && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="font-medium text-foreground">Your payment is being processed</h4>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Current step</div>
                    <div className="mt-0.5 font-semibold text-foreground">{STEP_DEFS.find((s) => s.id === currentStep)?.label ?? "Released"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Expected payment date</div>
                    <div className="mt-0.5 font-semibold text-foreground">{formatDate(new Date(Date.now() + Math.max(0, daysRemaining) * 86400000).toISOString())}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">You can see exactly where your payment is at all times. If any official exceeds their window, Tenderbox notifies them automatically.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Payment History</h2>
          <button onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            {showHistory ? "Hide" : "Show all"}
            {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {showHistory && (
          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Certificate No.</th>
                    <th className="px-6 py-3 font-medium">Period</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Released</th>
                    <th className="px-6 py-3 font-medium">Days Taken</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p, i) => (
                    <tr key={p.id} className={`${i % 2 === 1 ? "bg-muted/30" : "bg-card"} hover:bg-primary/5`}>
                      <td className="px-6 py-3 font-mono text-sm">{p.id}</td>
                      <td className="px-6 py-3 text-muted-foreground">{p.period}</td>
                      <td className="px-6 py-3 font-medium text-foreground">{formatZAR(p.amount)}</td>
                      <td className="px-6 py-3 text-muted-foreground">{formatDate(p.releasedDate)}</td>
                      <td className="px-6 py-3"><span className={`font-medium ${p.daysTaken < 20 ? "text-success" : p.daysTaken <= 28 ? "text-warning" : "text-danger"}`}>{p.daysTaken} days</span></td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${p.status === "paid" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"}`}>
                          {p.status === "paid" ? "Paid" : "Overdue"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => toast(`Downloading receipt for ${p.id}`, "info")} className="text-xs text-primary hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!showHistory && (
          <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            4 historical payments · Total {formatZAR(PAYMENT_HISTORY.reduce((s, p) => s + p.amount, 0))} released
          </div>
        )}
      </section>
    </div>
  );
}

function CircularClock({ daysRemaining }: { daysRemaining: number }) {
  const pct = Math.max(0, Math.min(100, (daysRemaining / 30) * 100));
  const circ = 2 * Math.PI * 35;
  const offset = circ * (1 - pct / 100);
  const stroke = daysRemaining > 15 ? "#1D9E75" : daysRemaining > 7 ? "#BA7517" : "#993C1D";
  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="35" className="stroke-muted" strokeWidth="6" fill="none" />
        <circle cx="36" cy="36" r="35" stroke={stroke} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${daysRemaining > 15 ? "text-success" : daysRemaining > 7 ? "text-warning" : "text-danger"}`}>{daysRemaining}</span>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}

function GuardedPaymentsPage() {
  return (
    <RoleGuard allowedRoles={CONTRACTOR_ROLES}>
      <PaymentsPage />
    </RoleGuard>
  );
}
