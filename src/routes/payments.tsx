import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  FileText,
  Calendar,
  ArrowUpDown,
} from "lucide-react";

export const Route = createFileRoute("/payments")({
  component: PaymentsPage,
  head: () => ({
    meta: [
      { title: "Payments — Tenderbox" },
      {
        name: "description",
        content: "Track payment certificates, approval workflow, and payment history.",
      },
    ],
  }),
});

// Mock payment certificate data
const PAYMENTS = [
  {
    id: "1",
    certificateNumber: "PC-2026-0042",
    tenderRef: "ETH-2026-082",
    tenderTitle: "Supply and Delivery of Medical Equipment",
    contractorName: "Sizwe Construction (Pty) Ltd",
    certifiedAmount: 2450000,
    invoiceDate: "2026-05-10",
    dueDate: "2026-06-09",
    status: "pending_cfo",
    approvals: {
      qs: true, qsDate: "2026-05-15",
      pa: true, paDate: "2026-05-16",
      pm: true, pmDate: "2026-05-17",
      pmu: true, pmuDate: "2026-05-18",
      cfo: false, cfoDate: null,
      mm: false, mmDate: null,
    },
  },
  {
    id: "2",
    certificateNumber: "PC-2026-0038",
    tenderRef: "ETH-2026-082",
    tenderTitle: "Supply and Delivery of Medical Equipment",
    contractorName: "Sizwe Construction (Pty) Ltd",
    certifiedAmount: 1820000,
    invoiceDate: "2026-04-15",
    dueDate: "2026-05-15",
    status: "overdue",
    approvals: {
      qs: true, qsDate: "2026-04-18",
      pa: true, paDate: "2026-04-19",
      pm: true, pmDate: "2026-04-20",
      pmu: true, pmuDate: "2026-04-21",
      cfo: false, cfoDate: null,
      mm: false, mmDate: null,
    },
  },
  {
    id: "3",
    certificateNumber: "PC-2026-0031",
    tenderRef: "NMB-2026-045",
    tenderTitle: "Installation of Solar PV Systems",
    contractorName: "Sizwe Construction (Pty) Ltd",
    certifiedAmount: 892000,
    invoiceDate: "2026-05-01",
    dueDate: "2026-05-31",
    status: "pending_pmu",
    approvals: {
      qs: true, qsDate: "2026-05-03",
      pa: true, paDate: "2026-05-04",
      pm: true, pmDate: "2026-05-05",
      pmu: false, pmuDate: null,
      cfo: false, cfoDate: null,
      mm: false, mmDate: null,
    },
  },
  {
    id: "4",
    certificateNumber: "PC-2026-0028",
    tenderRef: "ETH-2026-082",
    tenderTitle: "Supply and Delivery of Medical Equipment",
    contractorName: "Sizwe Construction (Pty) Ltd",
    certifiedAmount: 3150000,
    invoiceDate: "2026-03-20",
    dueDate: "2026-04-19",
    status: "paid",
    approvals: {
      qs: true, qsDate: "2026-03-22",
      pa: true, paDate: "2026-03-23",
      pm: true, pmDate: "2026-03-24",
      pmu: true, pmuDate: "2026-03-25",
      cfo: true, cfoDate: "2026-04-01",
      mm: true, mmDate: "2026-04-05",
    },
  },
  {
    id: "5",
    certificateNumber: "PC-2026-0025",
    tenderRef: "NMB-2026-045",
    tenderTitle: "Installation of Solar PV Systems",
    contractorName: "Sizwe Construction (Pty) Ltd",
    certifiedAmount: 567000,
    invoiceDate: "2026-04-05",
    dueDate: "2026-05-05",
    status: "paid",
    approvals: {
      qs: true, qsDate: "2026-04-07",
      pa: true, paDate: "2026-04-08",
      pm: true, pmDate: "2026-04-09",
      pmu: true, pmuDate: "2026-04-10",
      cfo: true, cfoDate: "2026-04-20",
      mm: true, mmDate: "2026-04-25",
    },
  },
];

type StatusFilter = "all" | "pending" | "pending_pmu" | "pending_cfo" | "overdue" | "paid";

function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedCert, setExpandedCert] = useState<string | null>(null);

  const filteredPayments = PAYMENTS.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return p.status.startsWith("pending");
    return p.status === statusFilter;
  });

  const totalPending = PAYMENTS
    .filter((p) => p.status.startsWith("pending") || p.status === "overdue")
    .reduce((sum, p) => sum + p.certifiedAmount, 0);

  const totalOverdue = PAYMENTS
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + p.certifiedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Payment certificates and approval workflow tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Pending"
          value={formatZAR(PAYMENTS.filter((p) => p.status.startsWith("pending")).reduce((s, p) => s + p.certifiedAmount, 0))}
          icon={Clock}
          accent="bg-warning/10 text-warning"
          count={PAYMENTS.filter((p) => p.status.startsWith("pending")).length}
        />
        <SummaryCard
          label="Overdue"
          value={formatZAR(totalOverdue)}
          icon={AlertCircle}
          accent="bg-danger/10 text-danger"
          count={PAYMENTS.filter((p) => p.status === "overdue").length}
        />
        <SummaryCard
          label="Paid This Month"
          value={formatZAR(PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.certifiedAmount, 0))}
          icon={CheckCircle}
          accent="bg-success/10 text-success"
          count={PAYMENTS.filter((p) => p.status === "paid").length}
        />
        <SummaryCard
          label="Total Outstanding"
          value={formatZAR(totalPending)}
          icon={CreditCard}
          accent="bg-primary/10 text-primary"
          count={PAYMENTS.filter((p) => p.status.startsWith("pending") || p.status === "overdue").length}
        />
      </div>

      {/* Filters */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "all" as StatusFilter, label: "All" },
            { id: "pending" as StatusFilter, label: "Pending Approval" },
            { id: "pending_pmu" as StatusFilter, label: "Awaiting PMU" },
            { id: "pending_cfo" as StatusFilter, label: "Awaiting CFO" },
            { id: "overdue" as StatusFilter, label: "Overdue" },
            { id: "paid" as StatusFilter, label: "Paid" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={[
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                statusFilter === item.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Payments table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Certificate</th>
                <th className="px-6 py-3 font-medium">Tender</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Invoice Date</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, i) => (
                <PaymentRow
                  key={payment.id}
                  payment={payment}
                  striped={i % 2 === 1}
                  expanded={expandedCert === payment.id}
                  onToggle={() => setExpandedCert(expandedCert === payment.id ? null : payment.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No payments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No payment certificates match this filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
  count,
}: {
  label: string;
  value: string;
  icon: typeof CreditCard;
  accent: string;
  count: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-xl font-semibold text-foreground">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{count} certificate(s)</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function PaymentRow({
  payment,
  striped,
  expanded,
  onToggle,
}: {
  payment: (typeof PAYMENTS)[0];
  striped: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending_pmu: { label: "Awaiting PMU", className: "bg-warning/10 text-warning border-warning/20" },
    pending_cfo: { label: "Awaiting CFO", className: "bg-warning/10 text-warning border-warning/20" },
    overdue: { label: "Overdue", className: "bg-danger/10 text-danger border-danger/20" },
    paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  };

  const status = statusConfig[payment.status] ?? statusConfig.pending_pmu;
  const isOverdue = payment.status === "overdue" || (payment.status !== "paid" && new Date(payment.dueDate) < new Date());

  return (
    <>
      <tr className={striped ? "bg-muted/30" : "bg-card"}>
        <td className="px-6 py-4">
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {payment.certificateNumber}
          </span>
        </td>
        <td className="px-6 py-4">
          <div>
            <div className="font-medium text-foreground">{payment.tenderRef}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {payment.tenderTitle}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 font-medium text-foreground">
          {formatZAR(payment.certifiedAmount)}
        </td>
        <td className="px-6 py-4 text-muted-foreground">
          {formatDate(payment.invoiceDate)}
        </td>
        <td className={`px-6 py-4 ${isOverdue ? "text-danger font-medium" : "text-muted-foreground"}`}>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(payment.dueDate)}
            {isOverdue && <AlertCircle className="h-4 w-4" />}
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onToggle}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <Eye className="h-3.5 w-3.5" />
              {expanded ? "Hide" : "Details"}
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className={striped ? "bg-muted/20" : "bg-muted/5"}>
          <td colSpan={7} className="px-6 py-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Approval Workflow</h4>
              <div className="flex flex-wrap items-center gap-2">
                <ApprovalStep
                  label="QS"
                  name="Quantity Surveyor"
                  approved={payment.approvals.qs}
                  date={payment.approvals.qsDate}
                  index={0}
                  total={6}
                />
                <ApprovalStep
                  label="PA"
                  name="Project Architect"
                  approved={payment.approvals.pa}
                  date={payment.approvals.paDate}
                  index={1}
                  total={6}
                />
                <ApprovalStep
                  label="PM"
                  name="Project Manager"
                  approved={payment.approvals.pm}
                  date={payment.approvals.pmDate}
                  index={2}
                  total={6}
                />
                <ApprovalStep
                  label="PMU"
                  name="Project Management Unit"
                  approved={payment.approvals.pmu}
                  date={payment.approvals.pmuDate}
                  index={3}
                  total={6}
                />
                <ApprovalStep
                  label="CFO"
                  name="Chief Financial Officer"
                  approved={payment.approvals.cfo}
                  date={payment.approvals.cfoDate}
                  index={4}
                  total={6}
                />
                <ApprovalStep
                  label="MM"
                  name="Municipal Manager"
                  approved={payment.approvals.mm}
                  date={payment.approvals.mmDate}
                  index={5}
                  total={6}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ApprovalStep({
  label,
  name,
  approved,
  date,
  index,
  total,
}: {
  label: string;
  name: string;
  approved: boolean;
  date: string | null;
  index: number;
  total: number;
}) {
  const isLast = index === total - 1;
  
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
            approved
              ? "border-success bg-success/10 text-success"
              : "border-muted-foreground/30 bg-muted text-muted-foreground"
          }`}
          title={name}
        >
          {approved ? <CheckCircle className="h-5 w-5" /> : label}
        </div>
        <div className="mt-1 text-xs font-medium text-foreground">{label}</div>
        <div className="text-[10px] text-muted-foreground text-center max-w-[60px]">
          {date ? formatDate(date) : "Pending"}
        </div>
      </div>
      {!isLast && (
        <div className={`h-0.5 w-6 mx-1 ${
          approved ? "bg-success" : "bg-muted-foreground/30"
        }`} />
      )}
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