import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck, FileCheck2, Upload, Eye, Plus, Briefcase,
  CheckCircle, Clock, AlertTriangle, Loader2,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

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
  score_breakdown: { documents: 100, experience: 92, profile_completeness: 90 },
};

type DocStatus = "Verified" | "Pending" | "Expired" | "Missing";
interface DocRow {
  id: string;
  type: string;
  status: DocStatus;
  expiry: string | null;
  uploaded: string | null;
  verifiedBy?: string;
}

const INITIAL_DOCS: DocRow[] = [
  { id: "1", type: "CIDB Certificate of Registration", status: "Verified", expiry: "2026-12-31", uploaded: "2025-11-12", verifiedBy: "CIDB API" },
  { id: "2", type: "CSD Registration", status: "Verified", expiry: "2026-09-30", uploaded: "2025-09-04", verifiedBy: "CSD Database" },
  { id: "3", type: "SARS Tax Clearance Certificate", status: "Verified", expiry: "2026-08-15", uploaded: "2025-08-20", verifiedBy: "SARS API" },
  { id: "4", type: "B-BBEE Certificate", status: "Verified", expiry: "2026-11-01", uploaded: "2025-11-02", verifiedBy: "Empowerdex" },
  { id: "5", type: "CIPC Company Registration", status: "Verified", expiry: "2027-01-15", uploaded: "2025-01-15", verifiedBy: "CIPC" },
  { id: "6", type: "Workmen's Compensation Registration", status: "Verified", expiry: "2027-03-31", uploaded: "2025-03-20", verifiedBy: "COID Fund" },
  { id: "7", type: "OHSA Safety File", status: "Verified", expiry: "2026-06-10", uploaded: "2025-06-01", verifiedBy: "Safety Inspector" },
  { id: "8", type: "Bank Confirmation Letter", status: "Verified", expiry: "2027-06-30", uploaded: "2025-04-30", verifiedBy: "FNB Corporate" },
];

interface ExperienceEntry {
  id: string;
  project: string;
  client: string;
  role: string;
  sector: string;
  value: number;
  start: string;
  end: string | null;
  completion: "Completed" | "In Progress";
  verification: "Verified" | "Pending" | "Not Submitted";
}

const INITIAL_EXPERIENCE: ExperienceEntry[] = [
  { id: "1", project: "Rehabilitation of Stormwater Drainage System", client: "Amathole District Municipality", role: "Main Contractor", sector: "Stormwater", value: 6890000, start: "2024-06-01", end: "2025-03-30", completion: "Completed", verification: "Verified" },
  { id: "2", project: "Installation of Water Reticulation Network — KwaMashu", client: "eThekwini Water Services", role: "Main Contractor", sector: "Water & Sanitation", value: 13450000, start: "2023-09-15", end: "2025-01-30", completion: "Completed", verification: "Verified" },
  { id: "3", project: "Upgrading of Matatiele Access Roads Phase 2", client: "Matatiele Local Municipality", role: "Main Contractor", sector: "Roads", value: 8450000, start: "2024-02-01", end: null, completion: "In Progress", verification: "Verified" },
  { id: "4", project: "Construction of Community Hall — Mthatha", client: "OR Tambo District Municipality", role: "Main Contractor", sector: "Building", value: 3200000, start: "2025-04-15", end: null, completion: "In Progress", verification: "Pending" },
];

const SECTORS = ["Roads", "Civil Engineering", "Stormwater", "Water & Sanitation", "Building", "Renewable Energy"];

function ProfilePage() {
  const [tab, setTab] = useState<"overview" | "compliance" | "experience">("overview");
  const tabs = [
    { id: "overview" as const, label: "Profile Overview" },
    { id: "compliance" as const, label: "Compliance Center" },
    { id: "experience" as const, label: "Experience Log" },
  ];
  return (
    <div className="space-y-6">
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={["border-b-2 px-1 py-3 text-sm font-medium transition-colors", tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"].join(" ")}>
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

// --- Overview Tab ---
function OverviewTab() {
  const { toast } = useToast();
  const c = CONTRACTOR;
  const [editing, setEditing] = useState(false);
  const [sectorText, setSectorText] = useState(c.sectors);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{c.company_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{c.profile_type} · {sectorText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">CIDB Grade {c.cidb_grade}</span>
            <span className="inline-flex items-center rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">BBBEE Level {c.bbbee_level}</span>
            <span className="inline-flex items-center rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">CSD: {c.csd_number}</span>
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              Edit Profile
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "CIPC Number", value: c.cipc_number },
            { label: "VAT Number", value: c.vat_number },
            { label: "Tender Readiness", value: `${c.tender_readiness_score}%` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-md border border-border bg-muted/30 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <ReadinessCard score={c.tender_readiness_score} breakdown={c.score_breakdown} />

      {editing && (
        <Modal title="Edit Profile" onClose={() => setEditing(false)}>
          <div className="space-y-4">
            {[
              { label: "Company Name", value: c.company_name },
              { label: "CIPC Number", value: c.cipc_number },
              { label: "CSD Number", value: c.csd_number },
              { label: "VAT Number", value: c.vat_number },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
                <input defaultValue={value} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sectors of Operation</label>
              <input value={sectorText} onChange={(e) => setSectorText(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setEditing(false); toast("Profile updated successfully", "success"); }} className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Save Changes
              </button>
              <button onClick={() => setEditing(false)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ReadinessCard({ score, breakdown }: { score: number; breakdown: { documents: number; experience: number; profile_completeness: number } }) {
  const isReady = score >= 80;
  const textClass = isReady ? "text-success" : "text-warning";
  const ringClass = isReady ? "stroke-success" : "stroke-warning";
  const label = isReady ? "Tender Ready" : "Needs Attention";
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tender Readiness Score</h2>
      <div className="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
        <div className="relative flex h-44 w-44 items-center justify-center shrink-0">
          <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} className="stroke-muted" strokeWidth="12" fill="none" />
            <circle cx="80" cy="80" r={radius} className={ringClass} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${textClass}`}>{score}</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          {[
            { label: "Documents", value: breakdown.documents },
            { label: "Experience", value: breakdown.experience },
            { label: "Profile Completeness", value: breakdown.profile_completeness },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium">{value}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${value >= 80 ? "bg-success" : "bg-warning"}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className={`rounded-lg border-2 p-4 ${isReady ? "border-success/20 bg-success/10" : "border-warning/20 bg-warning/10"}`}>
          <div className={`text-lg font-bold ${textClass}`}>{label}</div>
          <div className="mt-1 text-sm text-muted-foreground">All systems go for bidding</div>
        </div>
      </div>
    </section>
  );
}

// --- Compliance Tab ---
function ComplianceTab() {
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocRow[]>(INITIAL_DOCS);
  const [uploadingDoc, setUploadingDoc] = useState<DocRow | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocRow | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const verified = docs.filter((d) => d.status === "Verified").length;

  const simulateUpload = (doc: DocRow) => {
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 15;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, status: "Pending", uploaded: new Date().toISOString().split("T")[0] } : d));
          setUploadingDoc(null);
          setUploading(false);
          toast("Document uploaded — pending verification", "success");
          setTimeout(() => {
            setDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, status: "Verified", verifiedBy: "Tenderbox Verification Engine" } : d));
            toast("Document verified automatically", "success");
          }, 3000);
        }, 300);
      } else {
        setUploadProgress(progress);
      }
    }, 220);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <ShieldCheck className="h-8 w-8 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Compliance Status: Verified</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{verified} of {docs.length} mandatory documents verified and current</p>
            </div>
          </div>
          <button onClick={() => setUploadingDoc({ id: "new", type: "", status: "Missing", expiry: null, uploaded: null })} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" />Upload Document
          </button>
        </div>
      </section>

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
              {docs.map((doc, i) => {
                const statusCfg: Record<DocStatus, string> = {
                  Verified: "border-success/20 bg-success/10 text-success",
                  Pending: "border-warning/20 bg-warning/10 text-warning",
                  Expired: "border-danger/20 bg-danger/10 text-danger",
                  Missing: "border-destructive/30 bg-destructive/10 text-destructive",
                };
                const needsUpload = doc.status === "Missing" || doc.status === "Expired";
                return (
                  <tr key={doc.id} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                    <td className="px-6 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className={`h-4 w-4 ${doc.status === "Verified" ? "text-success" : "text-muted-foreground"}`} />
                        {doc.type}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusCfg[doc.status]}`}>{doc.status}</span>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{doc.expiry ? formatDate(doc.expiry) : "—"}</td>
                    <td className="px-6 py-3 text-muted-foreground">{doc.uploaded ? formatDate(doc.uploaded) : "—"}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {needsUpload ? (
                          <button onClick={() => { setUploadProgress(0); setUploading(false); setUploadingDoc(doc); }} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                            <Upload className="h-3.5 w-3.5" />{doc.status === "Expired" ? "Renew" : "Upload"}
                          </button>
                        ) : (
                          <button onClick={() => setViewingDoc(doc)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                            <Eye className="h-3.5 w-3.5" />View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upload Modal */}
      {uploadingDoc && (
        <Modal title={uploadingDoc.id === "new" ? "Upload Compliance Document" : `Upload — ${uploadingDoc.type}`} onClose={() => !uploading && setUploadingDoc(null)}>
          <div className="space-y-4">
            {uploadingDoc.id === "new" && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Document Type</label>
                <select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {docs.map((d) => <option key={d.id}>{d.type}</option>)}
                </select>
              </div>
            )}
            {!uploading ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-10">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop your file here or click to browse</p>
                  <p className="mt-1 text-xs text-muted-foreground">PDF, JPG or PNG — max 10 MB</p>
                </div>
                <button onClick={() => { setUploadProgress(0); simulateUpload(uploadingDoc.id === "new" ? docs[0] : uploadingDoc); }} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Upload className="h-4 w-4" />Select File & Upload
                </button>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">{uploadProgress < 100 ? "Uploading document…" : "Complete"}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% — Uploading to encrypted document vault…</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewingDoc && (
        <Modal title={viewingDoc.type} onClose={() => setViewingDoc(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Status", value: viewingDoc.status },
                { label: "Upload Date", value: viewingDoc.uploaded ? formatDate(viewingDoc.uploaded) : "—" },
                { label: "Expiry Date", value: viewingDoc.expiry ? formatDate(viewingDoc.expiry) : "No expiry" },
                { label: "Verified By", value: viewingDoc.verifiedBy ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { toast("Document downloaded", "success"); setViewingDoc(null); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Download Document
              </button>
              <button onClick={() => setViewingDoc(null)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- Experience Tab ---
function ExperienceTab() {
  const { toast } = useToast();
  const [experience, setExperience] = useState<ExperienceEntry[]>(INITIAL_EXPERIENCE);
  const [showAdd, setShowAdd] = useState(false);
  const [viewEntry, setViewEntry] = useState<ExperienceEntry | null>(null);
  const [form, setForm] = useState({ project: "", client: "", role: "Main Contractor", sector: SECTORS[0], value: "", start: "", end: "", completion: "In Progress" as "Completed" | "In Progress" });

  const handleAdd = () => {
    if (!form.project || !form.client || !form.value || !form.start) {
      toast("Please fill in all required fields", "error");
      return;
    }
    const entry: ExperienceEntry = {
      id: String(Date.now()),
      project: form.project,
      client: form.client,
      role: form.role,
      sector: form.sector,
      value: parseFloat(form.value.replace(/[^0-9.]/g, "")),
      start: form.start,
      end: form.end || null,
      completion: form.completion,
      verification: "Pending",
    };
    setExperience((prev) => [entry, ...prev]);
    setShowAdd(false);
    setForm({ project: "", client: "", role: "Main Contractor", sector: SECTORS[0], value: "", start: "", end: "", completion: "In Progress" });
    toast("Project experience added — pending verification", "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Project Experience Record</h2>
          <p className="mt-1 text-xs text-muted-foreground">Verified project history for functionality scoring</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />Add New Project
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
              {experience.map((p, i) => (
                <tr key={p.id} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="line-clamp-2">{p.project}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{p.client}</td>
                  <td className="px-6 py-3 text-muted-foreground">{p.role}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{formatZAR(p.value)}</td>
                  <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(p.start)} – {p.end ? formatDate(p.end) : "Ongoing"}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${p.completion === "Completed" ? "border-success/20 bg-success/10 text-success" : "border-warning/20 bg-warning/10 text-warning"}`}>
                      {p.completion === "Completed" ? <><CheckCircle className="mr-1 h-3 w-3" />{p.completion}</> : <><Clock className="mr-1 h-3 w-3" />{p.completion}</>}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${p.verification === "Verified" ? "border-success/20 bg-success/10 text-success" : p.verification === "Pending" ? "border-warning/20 bg-warning/10 text-warning" : "border-border text-muted-foreground"}`}>
                      {p.verification}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => setViewEntry(p)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                      <Eye className="h-3.5 w-3.5" />View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Experience Modal */}
      {showAdd && (
        <Modal title="Add Project Experience" onClose={() => setShowAdd(false)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Project Name *", key: "project", placeholder: "e.g. Stormwater Upgrade Phase 3" },
                { label: "Client / Employer *", key: "client", placeholder: "e.g. OR Tambo District Municipality" },
                { label: "Contract Value (ZAR) *", key: "value", placeholder: "e.g. 5500000" },
                { label: "Start Date *", key: "start", type: "date" },
                { label: "End Date", key: "end", type: "date" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sector</label>
                <select value={form.sector} onChange={(e) => setForm((prev) => ({ ...prev, sector: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</label>
                <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Main Contractor</option>
                  <option>Subcontractor</option>
                  <option>JV Partner</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</label>
                <select value={form.completion} onChange={(e) => setForm((prev) => ({ ...prev, completion: e.target.value as "Completed" | "In Progress" }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleAdd} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />Add Project
              </button>
              <button onClick={() => setShowAdd(false)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Certificate Modal */}
      {viewEntry && (
        <Modal title={viewEntry.project} onClose={() => setViewEntry(null)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Client", value: viewEntry.client },
                { label: "Sector", value: viewEntry.sector },
                { label: "Role", value: viewEntry.role },
                { label: "Contract Value", value: formatZAR(viewEntry.value) },
                { label: "Start Date", value: formatDate(viewEntry.start) },
                { label: "End Date", value: viewEntry.end ? formatDate(viewEntry.end) : "Ongoing" },
                { label: "Completion", value: viewEntry.completion },
                { label: "Verification", value: viewEntry.verification },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { toast(`Downloading completion certificate for ${viewEntry.project}`, "info"); setViewEntry(null); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Download Completion Certificate
              </button>
              <button onClick={() => setViewEntry(null)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}
