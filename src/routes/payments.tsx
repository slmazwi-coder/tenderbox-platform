import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Lock,
  AlertTriangle,
  Shield,
  Calendar,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/payments")({
  component: PaymentsPage,
  head: () => ({
    meta: [
      { title: "Payment Engine — Tenderbox" },
      {
        name: "description",
        content: "Automated escrow-based payment processing — 30 day outer limit",
      },
    ],
  }),
});

// Payment chain steps
const PAYMENT_STEPS = [
  { id: "qs", label: "QS Measurement" },
  { id: "pa", label: "PA Certification" },
  { id: "invoice", label: "Invoice Submitted" },
  { id: "pm", label: "PM Sign-off" },
  { id: "pmu", label: "PMU Sign-off" },
  { id: "cfo", label: "CFO Sign-off" },
  { id: "mm", label: "MM Sign-off" },
  { id: "released", label: "PAYMENT RELEASED" },
];

// Step 7: Active payment certificate for Tender TBX-2025-0031
const ACTIVE_CERTIFICATES = [
  {
    id: "1",
    certificateNumber: "PC-2025-047-003",
    tenderRef: "TBX-2025-0031",
    tenderTitle: "Rehabilitation of Stormwater Drainage System",
    contractorName: "Sizwe Construction (Pty) Ltd",
    certifiedAmount: 1245000,
    status: "pending_pmu",
    invoiceDate: "2026-05-16",
    daysRemaining: 22,
    clockStatus: "warning" as const,
    escrowStatus: "available" as const,
    escrowBalance: 1245000,
    currentStep: "pmu",
    approvals: {
      qs: { completed: true, date: "2026-05-20T10:30:00" },
      pa: { completed: true, date: "2026-05-22T14:15:00" },
      invoice: { completed: true, date: "2026-05-16T09:00:00" },
      pm: { completed: true, date: "2026-05-24T11:45:00" },
      pmu: { completed: false, date: null },
      cfo: { completed: false, date: null },
      mm: { completed: false, date: null },
      released: { completed: false, date: null },
    },
  },
];

// Step 7: Payment history
const PAYMENT_HISTORY = [
  { id: "PC-2025-047-002", period: "Apr 2026", amount: 2150000, releasedDate: "2026-05-08", daysTaken: 16, status: "paid" },
  { id: "PC-2025-047-001", period: "Mar 2026", amount: 1875000, releasedDate: "2026-04-12", daysTaken: 22, status: "paid" },
  { id: "PC-2025-046-003", period: "Feb 2026", amount: 3240000, releasedDate: "2026-03-28", daysTaken: 28, status: "paid" },
  { id: "PC-2025-045-002", period: "Jan 2026", amount: 2980000, releasedDate: "2026-02-28", daysTaken: 31, status: "overdue" },
];

function PaymentsPage() {
  const [contractorView, setContractorView] = useState(false);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const selectedCertificate = ACTIVE_CERTIFICATES.find((c) => c.id === selectedCert);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Engine</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automated escrow-based payment processing — 30 day outer limit
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setContractorView(!contractorView)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              contractorView
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {contractorView ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {contractorView ? "Contractor View Active" : "Switch to Contractor View"}
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Contractor View Notice */}
      {contractorView && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-foreground">Contractor Transparency View</div>
              <p className="mt-1 text-sm text-muted-foreground">
                You can see exactly where your payment is in the approval chain at all times. 
                Any delays are visible and the responsible official is notified.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Active Payment Certificates */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Active Payment Certificates ({ACTIVE_CERTIFICATES.length})
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ACTIVE_CERTIFICATES.map((cert) => (
            <PaymentCertificateCard
              key={cert.id}
              certificate={cert}
              selected={selectedCert === cert.id}
              onSelect={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}
              contractorView={contractorView}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Payment History */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Payment History</h2>
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Certificate No.</th>
                  <th className="px-6 py-3 font-medium">Period</th>
                  <th className="px-6 py-3 font-medium">Certified Amount</th>
                  <th className="px-6 py-3 font-medium">Released Date</th>
                  <th className="px-6 py-3 font-medium">Days Taken</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {PAYMENT_HISTORY.map((payment, i) => (
                  <tr key={payment.id} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                    <td className="px-6 py-3 font-mono text-sm">{payment.id}</td>
                    <td className="px-6 py-3 text-muted-foreground">{payment.period}</td>
                    <td className="px-6 py-3 font-medium text-foreground">{formatZAR(payment.amount)}</td>
                    <td className="px-6 py-3 text-muted-foreground">{formatDate(payment.releasedDate)}</td>
                    <td className="px-6 py-3">
                      <span className={`font-medium ${
                        payment.daysTaken < 20 ? "text-success" :
                        payment.daysTaken <= 28 ? "text-warning" :
                        payment.daysTaken <= 30 ? "text-danger" :
                        "text-danger font-bold"
                      }`}>
                        {payment.daysTaken} days
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-danger/10 text-danger border-danger/20"
                      }`}>
                        {payment.status === "paid" ? "Paid" : "Overdue"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contractor View Message */}
      {contractorView && selectedCertificate && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground">Your Payment Status</h3>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Current Step</div>
              <div className="mt-1 text-xl font-bold text-foreground">
                {PAYMENT_STEPS.find((s) => s.id === selectedCertificate.currentStep)?.label}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Expected Payment Date</div>
              <div className="mt-1 text-xl font-bold text-foreground">
                {formatDate(addDays(new Date(), selectedCertificate.daysRemaining))}
              </div>
            </div>
          </div>

          {selectedCertificate.daysRemaining < 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-md border border-danger/20 bg-danger/5 p-4">
              <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-danger">Your payment is overdue</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  The responsible official has been notified. Interest is accumulating at 1.5% per day.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PaymentCertificateCard({
  certificate,
  selected,
  onSelect,
}: {
  certificate: (typeof ACTIVE_CERTIFICATES)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const clockColor = certificate.daysRemaining > 15 ? "text-success" : certificate.daysRemaining > 7 ? "text-warning" : "text-danger";

  return (
    <div
      className={`rounded-lg border-2 bg-card shadow-sm overflow-hidden transition-all border-warning/30 ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* Colored Header */}
      <div className="bg-warning/10 px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-mono text-sm font-bold text-foreground">{certificate.certificateNumber}</div>
            <div className="mt-1 text-sm text-muted-foreground">{certificate.tenderRef}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{certificate.tenderTitle}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{formatZAR(certificate.certifiedAmount)}</div>
            <span className="inline-flex items-center rounded-md border border-warning/30 bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
              Pending PMU Sign-off
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Contractor Name */}
        <div className="mb-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contractor</div>
          <div className="mt-1 font-medium text-foreground">{certificate.contractorName}</div>
        </div>

        {/* Payment Chain Stepper */}
        <div className="mb-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Payment Chain Progress
          </div>
          <div className="flex items-center justify-between">
            {PAYMENT_STEPS.map((step, i) => {
              const approval = certificate.approvals[step.id as keyof typeof certificate.approvals];
              const isCompleted = approval?.completed;
              const isCurrent = step.id === certificate.currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-success/20 text-success" :
                      isCurrent ? "bg-primary/20 text-primary animate-pulse" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : isCurrent ? (
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div className="mt-1 text-[10px] text-center max-w-[50px] text-muted-foreground">
                      {step.label.split(" ")[0]}
                    </div>
                  </div>
                  {i < PAYMENT_STEPS.length - 1 && (
                    <div className={`h-0.5 w-4 mx-1 ${
                      isCompleted ? "bg-success" : "bg-muted"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 30-Day Clock */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 mb-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              30-Day Statutory Window
            </div>
            <div className="mt-1 text-2xl font-bold">
              <span className={clockColor}>
                {certificate.daysRemaining} days
              </span>{" "}
              remaining
            </div>
          </div>
          <CircularClock daysRemaining={certificate.daysRemaining} />
        </div>

        {/* Escrow Status */}
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">Escrow: Ring-fenced</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{formatZAR(certificate.escrowBalance)}</div>
              <span className="text-xs text-success">Funds available</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onSelect}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {selected ? "Hide Details" : "View Details"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CircularClock({ daysRemaining }: { daysRemaining: number }) {
  const maxDays = 30;
  const percentage = Math.max(0, Math.min(100, (daysRemaining / maxDays) * 100));
  const circumference = 2 * Math.PI * 35;
  const offset = circumference * (1 - percentage / 100);

  const strokeColor = daysRemaining > 15 ? "#1D9E75" : daysRemaining > 7 ? "#BA7517" : "#993C1D";

  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="35" className="stroke-muted" strokeWidth="6" fill="none" />
        <circle cx="36" cy="36" r="35" stroke={strokeColor} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${daysRemaining > 15 ? "text-success" : daysRemaining > 7 ? "text-warning" : "text-danger"}`}>
          {daysRemaining}
        </span>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}