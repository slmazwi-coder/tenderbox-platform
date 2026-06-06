import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText, Plus, Search, Filter, Building2, Calendar,
  DollarSign, Users, ChevronRight, Loader2,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/tenders")({ component: GuardedTendersPage });

const CLIENT_ROLES = ["client_entity"];

type TenderStatus = "draft" | "open" | "closed" | "under_evaluation" | "awarded";

interface Tender {
  id: string; ref: string; title: string; status: TenderStatus;
  closingDate: string | null; publishedDate: string | null;
  budget: number; bidsReceived: number; sector: string; cidbGrade: string;
  description: string;
}

const INITIAL_TENDERS: Tender[] = [
  { id: "1", ref: "TBX-2026-0058", title: "Solar PV Rooftop Installation Phase 2", status: "draft", closingDate: null, publishedDate: null, budget: 18000000, bidsReceived: 0, sector: "Renewable Energy", cidbGrade: "5ME", description: "Installation of 3.6MWp rooftop solar PV systems across 24 municipal facilities." },
  { id: "2", ref: "TBX-2026-0051", title: "Construction of Community Hall — Ward 7 Emalahleni", status: "open", closingDate: getFutureDate(16), publishedDate: getPastDate(14), budget: 3800000, bidsReceived: 3, sector: "Building", cidbGrade: "4GB", description: "Construction of a 650m² community hall including ablution facilities and parking." },
  { id: "3", ref: "TBX-2026-0047", title: "Upgrading of Stormwater System Phase 3 — Alexandra", status: "open", closingDate: getFutureDate(14), publishedDate: getPastDate(18), budget: 15200000, bidsReceived: 8, sector: "Civil — Stormwater", cidbGrade: "6CE", description: "Phase 3 stormwater system upgrade covering 7km of Alexandra township." },
  { id: "4", ref: "TBX-2026-0044", title: "Installation of Smart Water Meters — Soweto Cluster A", status: "draft", closingDate: null, publishedDate: null, budget: 45000000, bidsReceived: 0, sector: "Water & Sanitation", cidbGrade: "7ME", description: "Supply and installation of 45,000 smart water meters with AMI infrastructure." },
  { id: "5", ref: "TBX-2026-0039", title: "Sewer Reticulation Network Phase 2 — Diepkloof", status: "under_evaluation", closingDate: getPastDate(21), publishedDate: getPastDate(63), budget: 24500000, bidsReceived: 5, sector: "Civil — Sewer", cidbGrade: "6CE", description: "Phase 2 sewer reticulation network covering Diepkloof Zones 3–6." },
  { id: "6", ref: "TBX-2026-0031", title: "Rehabilitation of Access Roads — Ward 14 Randburg", status: "awarded", closingDate: getPastDate(37), publishedDate: getPastDate(79), budget: 8900000, bidsReceived: 12, sector: "Roads", cidbGrade: "5CE", description: "Road rehabilitation of 14 access roads totalling 8.2km in Ward 14." },
];

const STATUS_CFG: Record<TenderStatus, { label: string; cls: string }> = {
  draft:            { label: "Draft",            cls: "bg-muted text-muted-foreground border-border" },
  open:             { label: "Open",             cls: "bg-success/10 text-success border-success/20" },
  closed:           { label: "Closed",           cls: "bg-muted text-muted-foreground border-border" },
  under_evaluation: { label: "Under Evaluation", cls: "bg-warning/10 text-warning border-warning/20" },
  awarded:          { label: "Awarded",          cls: "bg-primary/10 text-primary border-primary/20" },
};

const SECTORS = ["Civil — Roads", "Civil — Stormwater", "Civil — Sewer", "Building", "Water & Sanitation", "Renewable Energy", "Electrical"];
const CIDB_GRADES = ["3CE", "4CE", "4GB", "5CE", "5ME", "6CE", "6GB", "7CE", "7ME"];

function TendersPage() {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<Tender[]>(INITIAL_TENDERS);
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [viewTender, setViewTender] = useState<Tender | null>(null);
  const [form, setForm] = useState({
    title: "", sector: SECTORS[0], cidbGrade: CIDB_GRADES[3], budget: "",
    closingDays: "21", description: "", briefingType: "Compulsory Physical Briefing",
  });

  const counts = {
    all: tenders.length,
    draft: tenders.filter((t) => t.status === "draft").length,
    open: tenders.filter((t) => t.status === "open").length,
    closed: tenders.filter((t) => t.status === "closed").length,
    under_evaluation: tenders.filter((t) => t.status === "under_evaluation").length,
    awarded: tenders.filter((t) => t.status === "awarded").length,
  };

  const filtered = tenders.filter((t) => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchSearch = searchQuery === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handlePublish = () => {
    if (!form.title || !form.budget) { toast("Please fill in all required fields", "error"); return; }
    setPublishing(true);
    setTimeout(() => {
      const year = new Date().getFullYear();
      const ref = `TBX-${year}-${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`;
      const newTender: Tender = {
        id: String(Date.now()), ref, title: form.title, status: "open",
        closingDate: getFutureDate(parseInt(form.closingDays)),
        publishedDate: new Date().toISOString().split("T")[0],
        budget: parseFloat(form.budget.replace(/[^0-9.]/g, "")),
        bidsReceived: 0, sector: form.sector, cidbGrade: form.cidbGrade,
        description: form.description,
      };
      setTenders((prev) => [newTender, ...prev]);
      setPublishing(false);
      setShowPublishModal(false);
      setForm({ title: "", sector: SECTORS[0], cidbGrade: CIDB_GRADES[3], budget: "", closingDays: "21", description: "", briefingType: "Compulsory Physical Briefing" });
      toast(`Tender ${ref} published to CSD & Tenderbox portal`, "success");
    }, 1800);
  };

  const handlePublishDraft = (tender: Tender) => {
    setTenders((prev) => prev.map((t) => t.id === tender.id ? {
      ...t, status: "open",
      publishedDate: new Date().toISOString().split("T")[0],
      closingDate: getFutureDate(21),
    } : t));
    toast(`Tender ${tender.ref} published`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tender Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all tenders published by City of Johannesburg SCM</p>
        </div>
        <button
          onClick={() => setShowPublishModal(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />Publish New Tender
        </button>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {(["all", "draft", "open", "under_evaluation", "closed", "awarded"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={["shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors", statusFilter === s ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"].join(" ")}
            >
              {s === "all" ? "All" : s === "under_evaluation" ? "Under Evaluation" : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="ml-1.5 inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-xs">{counts[s]}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tenders by title or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />{filtered.length} tender{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((tender) => {
          const cfg = STATUS_CFG[tender.status];
          const diff = tender.closingDate ? new Date(tender.closingDate).getTime() - Date.now() : null;
          const daysLeft = diff !== null ? Math.ceil(diff / 86400000) : null;
          return (
            <div key={tender.id} className="rounded-lg border border-border bg-card p-6 shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{tender.ref}</span>
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>
                    <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">CIDB {tender.cidbGrade}</span>
                    <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">{tender.sector}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{tender.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{formatZAR(tender.budget)}</span>
                    {tender.closingDate && (
                      <span className={`flex items-center gap-1.5 ${daysLeft !== null && daysLeft <= 7 && daysLeft > 0 ? "font-medium text-warning" : ""}`}>
                        <Calendar className="h-4 w-4" />
                        {daysLeft !== null && daysLeft > 0 ? `Closes in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}` : daysLeft !== null && daysLeft <= 0 ? `Closed ${formatDate(tender.closingDate)}` : formatDate(tender.closingDate)}
                      </span>
                    )}
                    {tender.status !== "draft" && (
                      <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{tender.bidsReceived} bid{tender.bidsReceived !== 1 ? "s" : ""} received</span>
                    )}
                    {tender.publishedDate && (
                      <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />Published {formatDate(tender.publishedDate)}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {tender.status === "draft" && (
                    <button
                      onClick={() => handlePublishDraft(tender)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Plus className="h-3.5 w-3.5" />Publish
                    </button>
                  )}
                  <button
                    onClick={() => setViewTender(tender)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    View Details<ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No tenders found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or publish a new tender</p>
          </div>
        )}
      </div>

      {viewTender && (
        <Modal title={viewTender.ref} onClose={() => setViewTender(null)} size="lg">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">{viewTender.title}</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Status", value: STATUS_CFG[viewTender.status].label },
                { label: "Sector", value: viewTender.sector },
                { label: "Budget", value: formatZAR(viewTender.budget) },
                { label: "CIDB Grade", value: viewTender.cidbGrade },
                { label: "Published", value: viewTender.publishedDate ? formatDate(viewTender.publishedDate) : "Not yet" },
                { label: "Closing Date", value: viewTender.closingDate ? formatDate(viewTender.closingDate) : "Not set" },
                { label: "Bids Received", value: String(viewTender.bidsReceived) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            {viewTender.description && (
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Description</div>
                <p className="mt-1 text-sm text-muted-foreground">{viewTender.description}</p>
              </div>
            )}
            <button onClick={() => setViewTender(null)} className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
          </div>
        </Modal>
      )}

      {showPublishModal && (
        <Modal title="Publish New Tender" onClose={() => !publishing && setShowPublishModal(false)} size="lg">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tender Title *</label>
              <input
                type="text"
                placeholder="e.g. Upgrading of Access Roads Phase 3 — Ward 14"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sector</label>
                <select value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {SECTORS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Min CIDB Grade</label>
                <select value={form.cidbGrade} onChange={(e) => setForm((p) => ({ ...p, cidbGrade: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {CIDB_GRADES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estimated Budget (ZAR) *</label>
                <input
                  type="number"
                  placeholder="e.g. 12500000"
                  value={form.budget}
                  onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {form.budget && <p className="mt-0.5 text-xs text-muted-foreground">{formatZAR(parseFloat(form.budget) || 0)}</p>}
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Closing Window (days)</label>
                <select value={form.closingDays} onChange={(e) => setForm((p) => ({ ...p, closingDays: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="14">14 days</option>
                  <option value="21">21 days</option>
                  <option value="30">30 days</option>
                  <option value="45">45 days</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Briefing Type</label>
                <select value={form.briefingType} onChange={(e) => setForm((p) => ({ ...p, briefingType: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Compulsory Physical Briefing</option>
                  <option>Virtual Briefing</option>
                  <option>No Briefing Required</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Scope of Work</label>
              <textarea
                rows={3}
                placeholder="Brief description of the procurement scope..."
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="rounded-md border border-warning/20 bg-warning/5 p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">MFMA Notice:</strong> This tender will be automatically published to the Central Supplier Database (CSD) and the Tenderbox public portal upon submission. Ensure all SCM policy approvals are in place.
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {publishing ? <><Loader2 className="h-4 w-4 animate-spin" />Publishing…</> : <><Plus className="h-4 w-4" />Publish Tender</>}
              </button>
              <button onClick={() => setShowPublishModal(false)} disabled={publishing} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function getFutureDate(days: number) { return new Date(Date.now() + days * 86400000).toISOString().split("T")[0]; }
function getPastDate(days: number) { return new Date(Date.now() - days * 86400000).toISOString().split("T")[0]; }
function formatDate(d: string) { return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }); }
function formatZAR(n: number) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n); }

function GuardedTendersPage() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><TendersPage /></RoleGuard>;
}
