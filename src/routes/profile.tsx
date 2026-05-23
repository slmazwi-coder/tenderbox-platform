import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Upload,
  Eye,
  Plus,
  Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "My Profile — Tenderbox" },
      {
        name: "description",
        content:
          "Company profile, compliance documents and experience log for your tendering entity.",
      },
    ],
  }),
});

// --- Mocked contractor data (mirrors seeded 'Sizwe Construction') ---
const CONTRACTOR = {
  company_name: "Sizwe Construction (Pty) Ltd",
  cipc_number: "2015/123456/07",
  csd_number: "MAAA0123456",
  vat_number: "4123456789",
  cidb_grade: "7CE",
  bbbee_level: 1,
  profile_type: "Contractor",
  sectors: "Civil Engineering, Roads, Stormwater",
  tender_readiness_score: 92.5,
  score_breakdown: {
    documents: 96,
    experience: 90,
    profile_completeness: 88,
  },
};

type DocStatus = "Verified" | "Pending" | "Expired" | "Missing";
type DocRow = {
  type: string;
  status: DocStatus;
  expiry: string | null;
  uploaded: string | null;
};

const MANDATORY_DOCS: DocRow[] = [
  { type: "CIDB Certificate",         status: "Verified", expiry: "2026-12-31", uploaded: "2025-11-12" },
  { type: "CSD Registration",         status: "Verified", expiry: "2026-09-30", uploaded: "2025-09-04" },
  { type: "SARS Tax Clearance",       status: "Verified", expiry: "2026-08-15", uploaded: "2025-08-20" },
  { type: "BBBEE Certificate",        status: "Verified", expiry: "2026-11-01", uploaded: "2025-11-02" },
  { type: "CIPC Company Registration",status: "Verified", expiry: "2027-01-15", uploaded: "2025-01-15" },
  { type: "Safety File",              status: "Pending",  expiry: "2026-06-10", uploaded: "2026-05-18" },
  { type: "Bank Confirmation Letter", status: "Expired",  expiry: "2026-04-30", uploaded: "2025-04-30" },
  { type: "Director ID Documents",    status: "Missing",  expiry: null,         uploaded: null },
];

const EXPERIENCE = [
  {
    project: "N3 Pavement Rehabilitation — Heidelberg",
    client: "SANRAL",
    role: "Main Contractor",
    sector: "Roads",
    value: 84500000,
    start: "2023-02-01",
    end: "2024-08-30",
    completion: "Completed",
    verification: "Verified",
  },
  {
    project: "Sebokeng Stormwater Upgrade",
    client: "Emfuleni Local Municipality",
    role: "Main Contractor",
    sector: "Stormwater",
    value: 22100000,
    start: "2022-06-15",
    end: "2023-05-10",
    completion: "Completed",
    verification: "Verified",
  },
  {
    project: "Soshanguve Internal Roads",
    client: "City of Tshwane",
    role: "Subcontractor",
    sector: "Roads",
    value: 11750000,
    start: "2021-10-01",
    end: "2022-07-22",
    completion: "Completed",
    verification: "Pending",
  },
];

// --- Page ---
function ProfilePage() {
  const [tab, setTab] = useState<"overview" | "compliance" | "experience">(
    "overview",
  );

  const tabs = [
    { id: "overview" as const,   label: "Profile Overview" },
    { id: "compliance" as const, label: "Compliance Center" },
    { id: "experience" as const, label: "Experience Log" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab nav */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "compliance" && <ComplianceTab />}
      {tab === "experience" && <ExperienceTab />}
    </div>
  );
}

// --- TAB 1: Overview ---
function OverviewTab() {
  const c = CONTRACTOR;
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{c.company_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.profile_type} · {c.sectors}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill className="bg-primary text-primary-foreground">
              CIDB Grade {c.cidb_grade}
            </Pill>
            <Pill className="bg-success text-success-foreground">
              BBBEE Level {c.bbbee_level}
            </Pill>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="CIPC Number"  value={c.cipc_number} />
          <Field label="CSD Number"   value={c.csd_number} />
          <Field label="VAT Number"   value={c.vat_number} />
        </div>
      </section>

      <ReadinessCard
        score={c.tender_readiness_score}
        breakdown={c.score_breakdown}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function ReadinessCard({
  score,
  breakdown,
}: {
  score: number;
  breakdown: { documents: number; experience: number; profile_completeness: number };
}) {
  const { tone, label, ringClass, textClass } = useMemo(() => {
    if (score >= 80)
      return {
        tone: "success",
        label: "Tender Ready",
        ringClass: "stroke-success",
        textClass: "text-success",
      };
    if (score >= 60)
      return {
        tone: "warning",
        label: "Needs Attention",
        ringClass: "stroke-warning",
        textClass: "text-warning",
      };
    return {
      tone: "danger",
      label: "Not Ready",
      ringClass: "stroke-danger",
      textClass: "text-danger",
    };
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Tender Readiness Score
      </h2>

      <div className="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
        <div className="relative flex h-44 w-44 items-center justify-center shrink-0">
          <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80" cy="80" r={radius}
              className="stroke-muted"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80" cy="80" r={radius}
              className={ringClass}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold ${textClass}`}>
              {Math.round(score)}
            </div>
            <div className="text-xs text-muted-foreground">out of 100</div>
            <div className={`mt-1 text-xs font-semibold uppercase tracking-wide ${textClass}`}>
              {label}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <BreakdownRow label="Documents"           weight={40} value={breakdown.documents} />
          <BreakdownRow label="Experience"          weight={35} value={breakdown.experience} />
          <BreakdownRow label="Profile Completeness" weight={25} value={breakdown.profile_completeness} />
        </div>
      </div>

      {tone !== "success" && (
        <div className={`mt-6 flex items-start gap-3 rounded-md border p-3 text-sm ${
          tone === "warning"
            ? "border-warning/30 bg-warning/10 text-warning"
            : "border-danger/30 bg-danger/10 text-danger"
        }`}>
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Your readiness score has room to improve. Resolve the items in the
            Compliance Center to qualify for more tenders.
          </span>
        </div>
      )}
    </section>
  );
}

function BreakdownRow({
  label,
  weight,
  value,
}: {
  label: string;
  weight: number;
  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            weight {weight}%
          </span>
        </span>
        <span className="text-sm font-semibold text-foreground">{value}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// --- TAB 2: Compliance ---
function ComplianceTab() {
  const verifiedCount = MANDATORY_DOCS.filter((d) => d.status === "Verified").length;
  const total = MANDATORY_DOCS.length;
  const hasCritical = MANDATORY_DOCS.some(
    (d) => d.status === "Expired" || d.status === "Missing",
  );

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success/10 text-success">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {verifiedCount} of {total} mandatory documents verified
              </div>
              <div className="text-xs text-muted-foreground">
                Keep all certificates current to remain eligible for tenders.
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-foreground">
            {Math.round((verifiedCount / total) * 100)}%
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success"
            style={{ width: `${(verifiedCount / total) * 100}%` }}
          />
        </div>
      </section>

      {hasCritical && (
        <div className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          <ShieldAlert className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">Critical compliance issue</div>
            <div className="mt-0.5">
              One or more mandatory documents are expired or missing. Resolve
              these to avoid disqualification on open tenders.
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <section className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Document</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Expiry Date</th>
                <th className="px-6 py-3 font-medium">Upload Date</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {MANDATORY_DOCS.map((d, i) => (
                <ComplianceRow key={d.type} doc={d} striped={i % 2 === 1} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ComplianceRow({ doc, striped }: { doc: DocRow; striped: boolean }) {
  const needsUpload = doc.status === "Missing" || doc.status === "Expired";
  const expiringSoon = (() => {
    if (!doc.expiry) return false;
    const ms = new Date(doc.expiry).getTime() - Date.now();
    return ms > 0 && ms < 30 * 24 * 3600 * 1000;
  })();

  return (
    <tr className={striped ? "bg-muted/30" : "bg-card"}>
      <td className="px-6 py-3 font-medium text-foreground">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-muted-foreground" />
          {doc.type}
        </div>
      </td>
      <td className="px-6 py-3">
        <DocStatusBadge status={doc.status} />
      </td>
      <td className={`px-6 py-3 ${
        doc.expiry && (expiringSoon || doc.status === "Expired")
          ? "text-danger font-medium"
          : "text-muted-foreground"
      }`}>
        {doc.expiry ? formatDate(doc.expiry) : "—"}
      </td>
      <td className="px-6 py-3 text-muted-foreground">
        {doc.uploaded ? formatDate(doc.uploaded) : "—"}
      </td>
      <td className="px-6 py-3 text-right">
        {needsUpload ? (
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
        ) : (
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        )}
      </td>
    </tr>
  );
}

function DocStatusBadge({ status }: { status: DocStatus }) {
  const map: Record<DocStatus, string> = {
    Verified: "bg-success/10 text-success border-success/20",
    Pending:  "bg-warning/10 text-warning border-warning/20",
    Expired:  "bg-danger/10 text-danger border-danger/20",
    Missing:  "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

// --- TAB 3: Experience ---
function ExperienceTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Completed Projects
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Verified project history is used to evaluate your functionality score.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      <section className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Sector</th>
                <th className="px-6 py-3 font-medium">Value</th>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium">Completion</th>
                <th className="px-6 py-3 font-medium">Verification</th>
                <th className="px-6 py-3 font-medium text-right">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {EXPERIENCE.map((p, i) => (
                <tr key={p.project} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {p.project}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{p.client}</td>
                  <td className="px-6 py-3 text-muted-foreground">{p.role}</td>
                  <td className="px-6 py-3 text-muted-foreground">{p.sector}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{formatZAR(p.value)}</td>
                  <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(p.start)} – {formatDate(p.end)}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {p.completion}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                      p.verification === "Verified"
                        ? "border-success/20 bg-success/10 text-success"
                        : "border-warning/20 bg-warning/10 text-warning"
                    }`}>
                      {p.verification}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
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

// --- helpers ---
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}
