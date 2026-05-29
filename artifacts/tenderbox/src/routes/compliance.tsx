import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck, FileCheck2, Upload, Eye, Plus, AlertTriangle,
  CheckCircle, Clock, XCircle, Search, Filter, X, Loader2,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

export const Route = createFileRoute("/compliance")({ component: CompliancePage });

type DocStatus = "Verified" | "Pending" | "Expired" | "Missing";

interface ComplianceDoc {
  id: string;
  name: string;
  category: string;
  status: DocStatus;
  expiryDate: string | null;
  uploadDate: string | null;
  verifiedDate: string | null;
  required: boolean;
  verifiedBy?: string;
  fileSize?: string;
}

const INITIAL_DOCS: ComplianceDoc[] = [
  { id: "1", name: "CIPC Company Registration", category: "Company Registration", status: "Verified", expiryDate: "2027-01-15", uploadDate: "2025-01-15", verifiedDate: "2025-01-20", required: true, verifiedBy: "CIPC Verification System", fileSize: "1.2 MB" },
  { id: "2", name: "CIPC Annual Return", category: "Company Registration", status: "Verified", expiryDate: "2026-06-30", uploadDate: "2025-06-15", verifiedDate: "2025-06-18", required: true, verifiedBy: "CIPC Verification System", fileSize: "0.8 MB" },
  { id: "3", name: "SARS Tax Clearance Certificate", category: "Tax & Finance", status: "Verified", expiryDate: "2026-08-15", uploadDate: "2025-08-20", verifiedDate: "2025-08-25", required: true, verifiedBy: "SARS API", fileSize: "0.5 MB" },
  { id: "4", name: "VAT Registration Certificate", category: "Tax & Finance", status: "Verified", expiryDate: null, uploadDate: "2025-01-10", verifiedDate: "2025-01-12", required: true, verifiedBy: "SARS API", fileSize: "0.3 MB" },
  { id: "5", name: "PAYE Registration", category: "Tax & Finance", status: "Verified", expiryDate: null, uploadDate: "2025-01-10", verifiedDate: "2025-01-12", required: false, verifiedBy: "SARS API", fileSize: "0.3 MB" },
  { id: "6", name: "CIDB Certificate of Registration", category: "CIDB & Safety", status: "Verified", expiryDate: "2026-12-31", uploadDate: "2025-11-12", verifiedDate: "2025-11-15", required: true, verifiedBy: "CIDB API", fileSize: "1.1 MB" },
  { id: "7", name: "CIDB Grading Certificate", category: "CIDB & Safety", status: "Verified", expiryDate: "2026-12-31", uploadDate: "2025-11-12", verifiedDate: "2025-11-15", required: true, verifiedBy: "CIDB API", fileSize: "0.9 MB" },
  { id: "8", name: "OHSA Safety File", category: "CIDB & Safety", status: "Pending", expiryDate: "2026-06-10", uploadDate: "2026-05-18", verifiedDate: null, required: true, fileSize: "3.4 MB" },
  { id: "9", name: "Workmen's Compensation Registration", category: "CIDB & Safety", status: "Verified", expiryDate: "2027-03-31", uploadDate: "2025-03-20", verifiedDate: "2025-03-25", required: true, verifiedBy: "COID Fund", fileSize: "0.6 MB" },
  { id: "10", name: "B-BBEE Certificate", category: "B-BBEE", status: "Verified", expiryDate: "2026-11-01", uploadDate: "2025-11-02", verifiedDate: "2025-11-10", required: true, verifiedBy: "Empowerdex (Accredited Agency)", fileSize: "2.1 MB" },
  { id: "11", name: "B-BBEE Scorecard", category: "B-BBEE", status: "Verified", expiryDate: "2026-11-01", uploadDate: "2025-11-02", verifiedDate: "2025-11-10", required: true, verifiedBy: "Empowerdex (Accredited Agency)", fileSize: "1.8 MB" },
  { id: "12", name: "Bank Confirmation Letter", category: "Banking", status: "Expired", expiryDate: "2026-04-30", uploadDate: "2025-04-30", verifiedDate: "2025-05-05", required: true, verifiedBy: "FNB Corporate Banking", fileSize: "0.4 MB" },
  { id: "13", name: "Proof of Banking Details", category: "Banking", status: "Verified", expiryDate: null, uploadDate: "2025-01-15", verifiedDate: "2025-01-17", required: true, verifiedBy: "FNB Corporate Banking", fileSize: "0.2 MB" },
];

function CompliancePage() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<ComplianceDoc[]>(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<DocStatus | "all">("all");
  const [uploadModal, setUploadModal] = useState<ComplianceDoc | null>(null);
  const [viewModal, setViewModal] = useState<ComplianceDoc | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = ["all", ...Array.from(new Set(docs.map((d) => d.category)))];

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch = searchQuery === "" || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: docs.length,
    verified: docs.filter((d) => d.status === "Verified").length,
    pending: docs.filter((d) => d.status === "Pending").length,
    expired: docs.filter((d) => d.status === "Expired").length,
    missing: docs.filter((d) => d.status === "Missing").length,
  };

  const handleUpload = (doc: ComplianceDoc) => {
    setUploadModal(doc);
    setUploadProgress(0);
    setUploading(false);
  };

  const simulateUpload = () => {
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setDocs((prev) =>
            prev.map((d) =>
              d.id === uploadModal!.id
                ? { ...d, status: "Pending", uploadDate: new Date().toISOString().split("T")[0], verifiedDate: null, fileSize: "1.4 MB" }
                : d
            )
          );
          setUploadModal(null);
          setUploading(false);
          toast("Document uploaded successfully — pending verification", "success");
          // Simulate verification after 3s
          setTimeout(() => {
            setDocs((prev) =>
              prev.map((d) =>
                d.id === uploadModal!.id
                  ? { ...d, status: "Verified", verifiedDate: new Date().toISOString().split("T")[0], verifiedBy: "Tenderbox Verification System" }
                  : d
              )
            );
            toast("Document verified — compliance record updated", "success");
          }, 3000);
        }, 400);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your mandatory documents for tender eligibility</p>
        </div>
        <button
          onClick={() => setUploadModal({ id: "new", name: "", category: "Company Registration", status: "Missing", expiryDate: null, uploadDate: null, verifiedDate: null, required: true })}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total, icon: FileCheck2, cls: "bg-primary/10 text-primary" },
          { label: "Verified", value: stats.verified, icon: CheckCircle, cls: "bg-success/10 text-success" },
          { label: "Pending", value: stats.pending, icon: Clock, cls: "bg-warning/10 text-warning" },
          { label: "Expired", value: stats.expired, icon: AlertTriangle, cls: "bg-danger/10 text-danger" },
          { label: "Missing", value: stats.missing, icon: XCircle, cls: "bg-destructive/15 text-destructive" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-2xl font-semibold text-foreground">{s.value}</div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-md ${s.cls}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {(stats.expired > 0 || stats.missing > 0) && (
        <div className="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/5 p-4">
          <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-danger">{stats.expired + stats.missing} document(s) need attention</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stats.expired > 0 && `${stats.expired} expired document(s) must be renewed. `}
              {stats.missing > 0 && `${stats.missing} missing document(s) must be uploaded. `}
              Expired or missing mandatory documents will block bid submission.
            </div>
          </div>
        </div>
      )}

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
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as DocStatus | "all")} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
            <option value="Missing">Missing</option>
          </select>
        </div>
      </div>

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
              {filteredDocs.map((doc, i) => {
                const statusCfg: Record<DocStatus, { label: string; cls: string }> = {
                  Verified: { label: "Verified", cls: "bg-success/10 text-success border-success/20" },
                  Pending: { label: "Pending Review", cls: "bg-warning/10 text-warning border-warning/20" },
                  Expired: { label: "Expired", cls: "bg-danger/10 text-danger border-danger/20" },
                  Missing: { label: "Missing", cls: "bg-destructive/15 text-destructive border-destructive/30" },
                };
                const cfg = statusCfg[doc.status];
                const needsUpload = doc.status === "Missing" || doc.status === "Expired";
                const expiryWarning = doc.expiryDate && (doc.status === "Expired" || isExpiringSoon(doc.expiryDate));
                return (
                  <tr key={doc.id} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-medium text-foreground">{doc.name}</div>
                          {doc.required && <span className="text-[10px] text-danger font-medium">MANDATORY</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{doc.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                    <td className={`px-6 py-4 ${expiryWarning ? "text-danger font-medium" : "text-muted-foreground"}`}>
                      {doc.expiryDate ? formatDate(doc.expiryDate) : "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{doc.verifiedDate ? formatDate(doc.verifiedDate) : "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {needsUpload ? (
                          <button onClick={() => handleUpload(doc)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                            <Upload className="h-3.5 w-3.5" />
                            {doc.status === "Expired" ? "Renew" : "Upload"}
                          </button>
                        ) : (
                          <>
                            <button onClick={() => setViewModal(doc)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            {doc.status === "Pending" && (
                              <button onClick={() => handleUpload(doc)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                                <Upload className="h-3.5 w-3.5" />
                                Re-upload
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredDocs.length === 0 && (
          <div className="p-12 text-center">
            <FileCheck2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No documents found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <Modal title={uploadModal.id === "new" ? "Upload New Document" : `Upload — ${uploadModal.name}`} onClose={() => !uploading && setUploadModal(null)}>
          <div className="space-y-4">
            {uploadModal.id === "new" && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Document Type</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>CIPC Company Registration</option>
                  <option>SARS Tax Clearance Certificate</option>
                  <option>CIDB Certificate of Registration</option>
                  <option>B-BBEE Certificate</option>
                  <option>Bank Confirmation Letter</option>
                  <option>OHSA Safety File</option>
                  <option>Other</option>
                </select>
              </div>
            )}

            {!uploading ? (
              <>
                <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-10">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Drop your file here or click to browse</p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF, JPG or PNG — max 10 MB</p>
                  </div>
                  <button onClick={simulateUpload} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <Upload className="h-4 w-4" />
                    Select File & Upload
                  </button>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Uploaded documents are automatically verified against the relevant government database (CIPC, SARS, CIDB). Verification typically takes 1–2 business days.
                </div>
              </>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {uploadProgress < 100 ? "Uploading document..." : "Processing complete"}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% — Uploading to secure document store...</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewModal && (
        <Modal title={viewModal.name} onClose={() => setViewModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Status", value: viewModal.status },
                { label: "Category", value: viewModal.category },
                { label: "Upload Date", value: viewModal.uploadDate ? formatDate(viewModal.uploadDate) : "—" },
                { label: "Expiry Date", value: viewModal.expiryDate ? formatDate(viewModal.expiryDate) : "No expiry" },
                { label: "Verified Date", value: viewModal.verifiedDate ? formatDate(viewModal.verifiedDate) : "—" },
                { label: "Verified By", value: viewModal.verifiedBy ?? "—" },
                { label: "File Size", value: viewModal.fileSize ?? "—" },
                { label: "Mandatory", value: viewModal.required ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { toast("Document downloaded", "success"); setViewModal(null); }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Download Document
              </button>
              <button onClick={() => setViewModal(null)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function isExpiringSoon(dateStr: string): boolean {
  const ms = new Date(dateStr).getTime() - Date.now();
  return ms > 0 && ms < 30 * 24 * 3600 * 1000;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
