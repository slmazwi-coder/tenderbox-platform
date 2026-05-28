import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
        content: "Company profile, compliance documents and experience log for your tendering entity.",
      },
    ],
  }),
});

// Step 7: Updated realistic demo data - Contractor 1: Fully compliant
const CONTRACTOR = {
  company_name: "Sizwe Construction (Pty) Ltd",
  cipc_number: "2015/123456/07",
  csd_number: "MAAA0034521",
  vat_number: "4123456789",
  cidb_grade: "7CE",
  bbbee_level: 1,
  profile_type: "Contractor",
  sectors: "Civil Engineering, Roads, Stormwater, Water & Sanitation",
  tender_readiness_score: 94,
  score_breakdown: {
    documents: 100,
    experience: 92,
    profile_completeness: 90,
  },
};

type DocStatus = "Verified" | "Pending" | "Expired" | "Missing";
type DocRow = {
  type: string;
  status: DocStatus;
  expiry: string | null;
  uploaded: string | null;
};

// Step 7: All 8 compliance documents verified for Contractor 1
const MANDATORY_DOCS: DocRow[] = [
  { type: "CIDB Certificate of Registration", status: "Verified", expiry: "2026-12-31", uploaded: "2025-11-12" },
  { type: "CSD Registration", status: "Verified", expiry: "2026-09-30", uploaded: "2025-09-04" },
  { type: "SARS Tax Clearance Certificate", status: "Verified", expiry: "2026-08-15", uploaded: "2025-08-20" },
  { type: "BBBEE Certificate", status: "Verified", expiry: "2026-11-01", uploaded: "2025-11-02" },
  { type: "CIPC Company Registration", status: "Verified", expiry: "2027-01-15", uploaded: "2025-01-15" },
  { type: "Workmen's Compensation Registration", status: "Verified", expiry: "2027-03-31", uploaded: "2025-03-20" },
  { type: "OHSA Safety File", status: "Verified", expiry: "2026-06-10", uploaded: "2025-06-01" },
  { type: "Bank Confirmation Letter", status: "Verified", expiry: "2027-06-30", uploaded: "2025-04-30" },
];

// Step 7: Updated project experience data
const EXPERIENCE = [
  {
    project: "Rehabilitation of Stormwater Drainage System",
    client: "Amathole District Municipality",
    role: "Main Contractor",
    sector: "Stormwater",
    value: 6890000,
    start: "2024-06-01",
    end: "2025-03-30",
    completion: "Completed",
    verification: "Verified",
  },
  {
    project: "Installation of Water Reticulation Network — KwaMashu",
    client: "eThekwini Water Services",
    role: "Main Contractor",
    sector: "Water & Sanitation",
    value: 13450000,
    start: "2023-09-15",
    end: "2025-01-30",
    completion: "Completed",
    verification: "Verified",
  },
  {
    project: "Upgrading of Matatiele Access Roads Phase 2",
    client: "Matatiele Local Municipality",
    role: "Main Contractor",
    sector: "Roads",
    value: 8450000,
    start: "2024-02-01",
    end: null,
    completion: "In Progress",
    verification: "Verified",
  },
  {
    project: "Construction of Community Hall — Mthatha",
    client: "OR Tambo District Municipality",
    role: "Main Contractor",
    sector: "Building",
    value: 3200000,
    start: "2025-04-15",
    end: null,
    completion: "In Progress",
    verification: "Pending",
  },
];

// --- Page ---
function ProfilePage() {
  const [tab, setTab] = useState<"overview" | "compliance" | "experience">(
    "overview",
  );

  const tabs = [
    { id: "overview" as const, label: "Profile Overview" },
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
            <Pill className="bg-success text-success-foreground">
              CSD: {c.csd_number}
            </Pill>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="CIPC Number" value={c.cipc_number} />
          <Field label="VAT Number" value={c.vat_number} />
          <Field label="Tender Readiness" value={`${c.tender_readiness_score}%`} />
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
  const { tone, label, ringClass, textClass } = (() => {
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
  })();

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
            <span className={`text-4xl font-bold ${textClass}`}>{score}</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Documents</span>
              <span className="font-medium">{breakdown.documents}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success" style={{ width: `${breakdown.documents}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Experience</span>
              <span className="font-medium">{breakdown.experience}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success" style={{ width: `${breakdown.experience}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Profile Completeness</span>
              <span className="font-medium">{breakdown.profile_completeness}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success" style={{ width: `${breakdown.profile_completeness}%` }} />
            </div>
          </div>
        </div>

        <div className={`rounded-lg border-2 border-${tone}/20 bg-${tone}/10 p-4`}>
          <div className={`text-lg font-bold ${textClass}`}>{label}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            All systems go for bidding
          </div>
        </div>
      </div>
    </section>
  );
}

// --- TAB 2: Compliance ---
function ComplianceTab() {
  const verified = MANDATORY_DOCS.filter((d) => d.status === "Verified").length;
  const total = MANDATORY_DOCS.length;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <ShieldCheck className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Compliance Status: Verified</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {verified} of {total} mandatory documents verified and current
            </p>
          </div>
        </div>
      </section>

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

  return (
    <tr className={striped ? "bg-muted/30" : "bg-card"}>
      <td className="px-6 py-3 font-medium text-foreground">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-success" />
          {doc.type}
        </div>
      </td>
      <td className="px-6 py-3">
        <span className="inline-flex items-center rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          {doc.status}
        </span>
      </td>
      <td className="px-6 py-3 text-muted-foreground">
        {doc.expiry ? formatDate(doc.expiry) : "—"}
      </td>
      <td className="px-6 py-3 text-muted-foreground">
        {doc.uploaded ? formatDate(doc.uploaded) : "—"}
      </td>
      <td className="px-6 py-3 text-right">
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      </td>
    </tr>
  );
}

// --- TAB 3: Experience ---
function ExperienceTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Project Experience Record
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Verified project history for functionality scoring
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
                  <td className="px-6 py-3 font-medium text-foreground">{formatZAR(p.value)}</td>
                  <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(p.start)} – {p.end ? formatDate(p.end) : "Ongoing"}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                      p.completion === "Completed"
                        ? "border-success/20 bg-success/10 text-success"
                        : "border-warning/20 bg-warning/10 text-warning"
                    }`}>
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