import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  Upload,
  Eye,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/compliance")({
  component: CompliancePage,
  head: () => ({
    meta: [
      { title: "Compliance Documents — Tenderbox" },
      {
        name: "description",
        content: "Manage and track compliance documents for tender eligibility.",
      },
    ],
  }),
});

type DocStatus = "Verified" | "Pending" | "Expired" | "Missing";
type DocCategory = "Company Registration" | "Tax & Finance" | "CIDB & Safety" | "B-BBEE" | "Banking";

interface ComplianceDoc {
  id: string;
  name: string;
  category: DocCategory;
  status: DocStatus;
  expiryDate: string | null;
  uploadDate: string | null;
  verifiedDate: string | null;
  required: boolean;
}

const COMPLIANCE_DOCS: ComplianceDoc[] = [
  // Company Registration
  {
    id: "1",
    name: "CIPC Company Registration",
    category: "Company Registration",
    status: "Verified",
    expiryDate: "2027-01-15",
    uploadDate: "2025-01-15",
    verifiedDate: "2025-01-20",
    required: true,
  },
  {
    id: "2",
    name: "CIPC Annual Return",
    category: "Company Registration",
    status: "Verified",
    expiryDate: "2026-06-30",
    uploadDate: "2025-06-15",
    verifiedDate: "2025-06-18",
    required: true,
  },
  // Tax & Finance
  {
    id: "3",
    name: "SARS Tax Clearance Certificate",
    category: "Tax & Finance",
    status: "Verified",
    expiryDate: "2026-08-15",
    uploadDate: "2025-08-20",
    verifiedDate: "2025-08-25",
    required: true,
  },
  {
    id: "4",
    name: "VAT Registration Certificate",
    category: "Tax & Finance",
    status: "Verified",
    expiryDate: null,
    uploadDate: "2025-01-10",
    verifiedDate: "2025-01-12",
    required: true,
  },
  {
    id: "5",
    name: "PAYE Registration",
    category: "Tax & Finance",
    status: "Verified",
    expiryDate: null,
    uploadDate: "2025-01-10",
    verifiedDate: "2025-01-12",
    required: false,
  },
  // CIDB & Safety
  {
    id: "6",
    name: "CIDB Certificate of Registration",
    category: "CIDB & Safety",
    status: "Verified",
    expiryDate: "2026-12-31",
    uploadDate: "2025-11-12",
    verifiedDate: "2025-11-15",
    required: true,
  },
  {
    id: "7",
    name: "CIDB Grading Certificate",
    category: "CIDB & Safety",
    status: "Verified",
    expiryDate: "2026-12-31",
    uploadDate: "2025-11-12",
    verifiedDate: "2025-11-15",
    required: true,
  },
  {
    id: "8",
    name: "OHSA Safety File",
    category: "CIDB & Safety",
    status: "Pending",
    expiryDate: "2026-06-10",
    uploadDate: "2026-05-18",
    verifiedDate: null,
    required: true,
  },
  {
    id: "9",
    name: "Workmen's Compensation Registration",
    category: "CIDB & Safety",
    status: "Verified",
    expiryDate: "2027-03-31",
    uploadDate: "2025-03-20",
    verifiedDate: "2025-03-25",
    required: true,
  },
  // B-BBEE
  {
    id: "10",
    name: "B-BBEE Certificate",
    category: "B-BBEE",
    status: "Verified",
    expiryDate: "2026-11-01",
    uploadDate: "2025-11-02",
    verifiedDate: "2025-11-10",
    required: true,
  },
  {
    id: "11",
    name: "B-BBEE Scorecard",
    category: "B-BBEE",
    status: "Verified",
    expiryDate: "2026-11-01",
    uploadDate: "2025-11-02",
    verifiedDate: "2025-11-10",
    required: true,
  },
  // Banking
  {
    id: "12",
    name: "Bank Confirmation Letter",
    category: "Banking",
    status: "Expired",
    expiryDate: "2026-04-30",
    uploadDate: "2025-04-30",
    verifiedDate: "2025-05-05",
    required: true,
  },
  {
    id: "13",
    name: "Proof of Banking Details",
    category: "Banking",
    status: "Verified",
    expiryDate: null,
    uploadDate: "2025-01-15",
    verifiedDate: "2025-01-17",
    required: true,
  },
];

function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DocStatus | "all">("all");

  const categories = ["all", ...new Set(COMPLIANCE_DOCS.map((d) => d.category))] as (DocCategory | "all")[];

  const filteredDocs = COMPLIANCE_DOCS.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: COMPLIANCE_DOCS.length,
    verified: COMPLIANCE_DOCS.filter((d) => d.status === "Verified").length,
    pending: COMPLIANCE_DOCS.filter((d) => d.status === "Pending").length,
    expired: COMPLIANCE_DOCS.filter((d) => d.status === "Expired").length,
    missing: COMPLIANCE_DOCS.filter((d) => d.status === "Missing").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your mandatory documents for tender eligibility
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <StatCard label="Total Documents" value={stats.total} icon={FileCheck2} accent="bg-primary/10 text-primary" />
        <StatCard label="Verified" value={stats.verified} icon={CheckCircle} accent="bg-success/10 text-success" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="bg-warning/10 text-warning" />
        <StatCard label="Expired" value={stats.expired} icon={AlertTriangle} accent="bg-danger/10 text-danger" />
        <StatCard label="Missing" value={stats.missing} icon={XCircle} accent="bg-destructive/15 text-destructive" />
      </div>

      {/* Alerts */}
      {(stats.expired > 0 || stats.missing > 0) && (
        <div className="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/5 p-4">
          <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-danger">
              {stats.expired + stats.missing} document(s) need attention
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stats.expired > 0 && `${stats.expired} expired document(s) must be renewed. `}
              {stats.missing > 0 && `${stats.missing} missing document(s) must be uploaded. `}
              Expired or missing mandatory documents may result in disqualification from tenders.
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DocCategory | "all")}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c !== "all").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocStatus | "all")}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
            <option value="Missing">Missing</option>
          </select>
        </div>
      </div>

      {/* Documents table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Document</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Expiry Date</th>
                <th className="px-6 py-3 font-medium">Verified</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, i) => (
                <DocRow key={doc.id} doc={doc} striped={i % 2 === 1} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocs.length === 0 && (
          <div className="p-12 text-center">
            <FileCheck2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No documents found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof ShieldCheck;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc, striped }: { doc: ComplianceDoc; striped: boolean }) {
  const statusConfig: Record<DocStatus, { label: string; className: string }> = {
    Verified: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
    Pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
    Expired: { label: "Expired", className: "bg-danger/10 text-danger border-danger/20" },
    Missing: { label: "Missing", className: "bg-destructive/15 text-destructive border-destructive/30" },
  };

  const status = statusConfig[doc.status];
  const needsAction = doc.status === "Missing" || doc.status === "Expired";

  return (
    <tr className={striped ? "bg-muted/30" : "bg-card"}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium text-foreground">{doc.name}</div>
            {doc.required && (
              <span className="text-[10px] text-danger font-medium">MANDATORY</span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-muted-foreground">{doc.category}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}>
          {doc.status}
        </span>
      </td>
      <td className={`px-6 py-4 ${
        doc.expiryDate && (doc.status === "Expired" || isExpiringSoon(doc.expiryDate))
          ? "text-danger font-medium"
          : "text-muted-foreground"
      }`}>
        {doc.expiryDate ? formatDate(doc.expiryDate) : "—"}
      </td>
      <td className="px-6 py-4 text-muted-foreground">
        {doc.verifiedDate ? formatDate(doc.verifiedDate) : "—"}
      </td>
      <td className="px-6 py-4 text-right">
        {needsAction ? (
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

function isExpiringSoon(dateStr: string): boolean {
  const ms = new Date(dateStr).getTime() - Date.now();
  return ms > 0 && ms < 30 * 24 * 3600 * 1000;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}