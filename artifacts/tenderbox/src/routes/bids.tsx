import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Send, Eye, Clock, CheckCircle, XCircle, AlertTriangle,
  FileText, ArrowUpDown, Plus, ChevronDown, ChevronUp, Building2,
  DollarSign, Loader2,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

export const Route = createFileRoute("/bids")({ component: BidsPage });

const TENDERS_FOR_BID = [
  { ref: "TBX-2025-0047", title: "Upgrading of Matatiele Access Roads Phase 2", entity: "Matatiele Local Municipality", cidb: "5CE", closing: "14 days" },
  { ref: "TBX-2025-0051", title: "Construction of Community Hall — Ward 7 Emalahleni", entity: "Emalahleni Local Municipality", cidb: "4GB", closing: "7 days" },
  { ref: "NMB-2026-045", title: "Installation of Solar PV Systems", entity: "Nelson Mandela Bay", cidb: "4CE", closing: "45 days" },
];

const DOCS_CHECKLIST = [
  "Company Profile & B-BBEE Certificate",
  "CIDB Grading Certificate",
  "SARS Tax Clearance Certificate",
  "Bill of Quantities (BoQ)",
  "Method Statement",
  "Key Personnel CVs",
  "Plant & Equipment Schedule",
  "Financial Statements (3 years)",
];

interface Bid {
  id: string;
  trackingId: string;
  tenderRef: string;
  tenderTitle: string;
  entity: string;
  submissionDate: string;
  closingDate: string;
  bidAmount: number;
  status: "draft" | "under_review" | "awarded" | "rejected";
  scores: { compliance: number | null; functionality: number | null; price: number | null; bbbee: number | null; total: number | null };
  rank: number | null;
  redFlags: string[];
}

const INITIAL_BIDS: Bid[] = [
  { id: "1", trackingId: "BID-2026-0142", tenderRef: "JHB-2026-014", tenderTitle: "Stormwater Drainage System Upgrade - Alexandra Township", entity: "City of Johannesburg", submissionDate: "2026-05-20T14:32:00", closingDate: "2026-06-15", bidAmount: 47850000, status: "under_review", scores: { compliance: 92, functionality: 85, price: 78, bbbee: 95, total: 86.8 }, rank: null, redFlags: [] },
  { id: "2", trackingId: "BID-2026-0138", tenderRef: "ETH-2026-082", tenderTitle: "Supply and Delivery of Medical Equipment", entity: "eThekwini Municipality", submissionDate: "2026-05-18T09:15:00", closingDate: "2026-06-22", bidAmount: 124200000, status: "awarded", scores: { compliance: 100, functionality: 88, price: 82, bbbee: 95, total: 89.5 }, rank: 1, redFlags: [] },
  { id: "3", trackingId: "BID-2026-0129", tenderRef: "TSH-2026-007", tenderTitle: "Construction of Community Hall - Soshanguve", entity: "City of Tshwane", submissionDate: "2026-05-15T16:45:00", closingDate: "2026-05-30", bidAmount: 18200000, status: "rejected", scores: { compliance: 72, functionality: 68, price: 75, bbbee: 95, total: 74.2 }, rank: 4, redFlags: ["Compliance score below 80% threshold"] },
  { id: "4", trackingId: "BID-2026-0115", tenderRef: "CPT-2026-031", tenderTitle: "Resurfacing of Major Arterial Roads - Phase 2", entity: "City of Cape Town", submissionDate: "2026-05-10T11:20:00", closingDate: "2026-06-29", bidAmount: 88500000, status: "under_review", scores: { compliance: 88, functionality: null, price: null, bbbee: 95, total: null }, rank: null, redFlags: [] },
  { id: "5", trackingId: "BID-2026-0108", tenderRef: "NMB-2026-045", tenderTitle: "Installation of Solar PV Systems", entity: "Nelson Mandela Bay", submissionDate: "2026-05-05T08:30:00", closingDate: "2026-07-10", bidAmount: 31800000, status: "draft", scores: { compliance: null, functionality: null, price: null, bbbee: 95, total: null }, rank: null, redFlags: [] },
];

type StatusFilter = "all" | "draft" | "under_review" | "awarded" | "rejected";

function BidsPage() {
  const { toast } = useToast();
  const [bids, setBids] = useState<Bid[]>(INITIAL_BIDS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<"submissionDate" | "bidAmount" | "totalScore">("submissionDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedBid, setExpandedBid] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New bid form state
  const [selectedTender, setSelectedTender] = useState(TENDERS_FOR_BID[0].ref);
  const [bidAmount, setBidAmount] = useState("");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const filteredBids = bids
    .filter((b) => statusFilter === "all" || b.status === statusFilter)
    .sort((a, b) => {
      const aVal = sortField === "submissionDate" ? a.submissionDate : sortField === "bidAmount" ? a.bidAmount : a.scores.total;
      const bVal = sortField === "submissionDate" ? b.submissionDate : sortField === "bidAmount" ? b.bidAmount : b.scores.total;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      return sortOrder === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });

  const counts = {
    all: bids.length,
    draft: bids.filter((b) => b.status === "draft").length,
    under_review: bids.filter((b) => b.status === "under_review").length,
    awarded: bids.filter((b) => b.status === "awarded").length,
    rejected: bids.filter((b) => b.status === "rejected").length,
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("desc"); }
  };

  const handleSubmitBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast("Please enter a valid bid amount", "error");
      return;
    }
    const docsChecked = Object.values(checkedDocs).filter(Boolean).length;
    if (docsChecked < 4) {
      toast("Please confirm at least 4 supporting documents are attached", "warning");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const tender = TENDERS_FOR_BID.find((t) => t.ref === selectedTender)!;
      const trackingId = `BID-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const newBid: Bid = {
        id: String(Date.now()),
        trackingId,
        tenderRef: tender.ref,
        tenderTitle: tender.title,
        entity: tender.entity,
        submissionDate: new Date().toISOString(),
        closingDate: new Date(Date.now() + parseInt(tender.closing) * 86400000).toISOString().split("T")[0],
        bidAmount: parseFloat(bidAmount.replace(/[^0-9.]/g, "")),
        status: "under_review",
        scores: { compliance: 88, functionality: null, price: null, bbbee: 95, total: null },
        rank: null,
        redFlags: [],
      };
      setBids((prev) => [newBid, ...prev]);
      setSubmitting(false);
      setShowSubmitModal(false);
      setBidAmount("");
      setCheckedDocs({});
      toast(`Bid submitted — Tracking ID: ${trackingId}`, "success");
    }, 2000);
  };

  const submitDraftBid = (bid: Bid) => {
    setBids((prev) => prev.map((b) => b.id === bid.id ? { ...b, status: "under_review", submissionDate: new Date().toISOString() } : b));
    toast(`Bid ${bid.trackingId} submitted for evaluation`, "success");
  };

  const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "bg-muted text-muted-foreground border-border" },
    under_review: { label: "Under Review", cls: "bg-warning/10 text-warning border-warning/20" },
    awarded: { label: "Awarded", cls: "bg-success/10 text-success border-success/20" },
    rejected: { label: "Rejected", cls: "bg-danger/10 text-danger border-danger/20" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Bids</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your submitted bids and evaluation results</p>
        </div>
        <button onClick={() => setShowSubmitModal(true)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Submit New Bid
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Bids", value: bids.length, cls: "bg-primary/10 text-primary" },
          { label: "Under Review", value: counts.under_review, cls: "bg-warning/10 text-warning" },
          { label: "Awarded", value: counts.awarded, cls: "bg-success/10 text-success" },
          { label: "Draft", value: counts.draft, cls: "bg-muted text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {(["all", "draft", "under_review", "awarded", "rejected"] as StatusFilter[]).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={["border-b-2 px-1 py-3 text-sm font-medium transition-colors", statusFilter === s ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"].join(" ")}>
              {s === "all" ? "All Bids" : s === "under_review" ? "Under Review" : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">{counts[s]}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Tracking ID</th>
                <th className="px-6 py-3 font-medium">Tender</th>
                <th className="px-6 py-3 font-medium cursor-pointer" onClick={() => toggleSort("submissionDate")}>
                  <span className="inline-flex items-center gap-1">Submitted <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-6 py-3 font-medium cursor-pointer" onClick={() => toggleSort("bidAmount")}>
                  <span className="inline-flex items-center gap-1">Bid Amount <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-6 py-3 font-medium cursor-pointer" onClick={() => toggleSort("totalScore")}>
                  <span className="inline-flex items-center gap-1">Score <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-6 py-3 font-medium">Rank</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.map((bid, i) => {
                const cfg = STATUS_CFG[bid.status];
                const isExpanded = expandedBid === bid.id;
                return (
                  <>
                    <tr key={bid.id} className={`${i % 2 === 1 ? "bg-muted/30" : "bg-card"} hover:bg-primary/5 transition-colors`}>
                      <td className="px-6 py-4 font-mono text-xs font-medium text-muted-foreground">{bid.trackingId}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{bid.tenderRef}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{bid.tenderTitle}</div>
                        <div className="text-xs text-muted-foreground">{bid.entity}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{formatDateTime(bid.submissionDate)}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{formatZAR(bid.bidAmount)}</td>
                      <td className="px-6 py-4">
                        {bid.scores.total !== null ? (
                          <span className={`font-medium ${bid.scores.total >= 80 ? "text-success" : bid.scores.total >= 60 ? "text-warning" : "text-danger"}`}>
                            {bid.scores.total.toFixed(1)}%
                          </span>
                        ) : <span className="text-muted-foreground text-xs">Pending</span>}
                      </td>
                      <td className="px-6 py-4">
                        {bid.rank !== null ? (
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${bid.rank === 1 ? "bg-success text-success-foreground" : "bg-muted text-foreground"}`}>
                            #{bid.rank}
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {bid.status === "draft" && (
                            <button onClick={() => submitDraftBid(bid)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                              <Send className="h-3.5 w-3.5" />
                              Submit
                            </button>
                          )}
                          {bid.status === "awarded" && (
                            <button onClick={() => toast("Downloading award letter…", "info")} className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20">
                              Award Letter
                            </button>
                          )}
                          <button onClick={() => setExpandedBid(isExpanded ? null : bid.id)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                            <Eye className="h-3.5 w-3.5" />
                            {isExpanded ? "Hide" : "Details"}
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${bid.id}-exp`} className="bg-muted/10">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                              { label: "Compliance", score: bid.scores.compliance },
                              { label: "Functionality", score: bid.scores.functionality },
                              { label: "Price", score: bid.scores.price },
                              { label: "B-BBEE", score: bid.scores.bbbee },
                            ].map(({ label, score }) => (
                              <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                                <div className={`mt-1 text-xl font-semibold ${score === null ? "text-muted-foreground" : score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-danger"}`}>
                                  {score !== null ? `${score}%` : "—"}
                                </div>
                              </div>
                            ))}
                          </div>
                          {bid.redFlags.length > 0 && (
                            <div className="mt-3 flex items-start gap-2 rounded-md border border-danger/20 bg-danger/5 p-3">
                              <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-danger">Red Flags</div>
                                {bid.redFlags.map((f, i) => <p key={i} className="text-sm text-muted-foreground">{f}</p>)}
                              </div>
                            </div>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button onClick={() => toast("Downloading bid document…", "info")} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                              <FileText className="h-3.5 w-3.5" />
                              Download Bid Document
                            </button>
                            <Link to="/tenders" className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                              View Tender
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredBids.length === 0 && (
          <div className="p-12 text-center">
            <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No bids found</h3>
            <p className="mt-1 text-sm text-muted-foreground">{statusFilter === "all" ? "Submit your first bid to get started" : "No bids match this filter"}</p>
          </div>
        )}
      </div>

      {/* Submit New Bid Modal */}
      {showSubmitModal && (
        <Modal title="Submit New Bid" onClose={() => !submitting && setShowSubmitModal(false)} size="lg">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Select Tender *</label>
              <select value={selectedTender} onChange={(e) => setSelectedTender(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                {TENDERS_FOR_BID.map((t) => (
                  <option key={t.ref} value={t.ref}>{t.ref} — {t.title}</option>
                ))}
              </select>
              {(() => {
                const t = TENDERS_FOR_BID.find((t) => t.ref === selectedTender)!;
                return (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{t.entity}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Closes in {t.closing}</span>
                    <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-primary">CIDB {t.cidb}</span>
                  </div>
                );
              })()}
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Bid Price (ZAR) *</label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="e.g. 12500000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {bidAmount && <p className="mt-1 text-xs text-muted-foreground">{formatZAR(parseFloat(bidAmount) || 0)}</p>}
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Supporting Documents *</label>
              <p className="mt-0.5 text-xs text-muted-foreground">Confirm the following documents are attached to your bid submission:</p>
              <div className="mt-2 space-y-2">
                {DOCS_CHECKLIST.map((doc) => (
                  <label key={doc} className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2 hover:bg-muted/60">
                    <input
                      type="checkbox"
                      checked={checkedDocs[doc] ?? false}
                      onChange={(e) => setCheckedDocs((prev) => ({ ...prev, [doc]: e.target.checked }))}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="text-sm text-foreground">{doc}</span>
                    {checkedDocs[doc] && <CheckCircle className="ml-auto h-4 w-4 text-success" />}
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {Object.values(checkedDocs).filter(Boolean).length} of {DOCS_CHECKLIST.length} confirmed
              </p>
            </div>

            <div className="rounded-md border border-warning/20 bg-warning/5 p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">Declaration:</strong> By submitting this bid, Sizwe Construction (Pty) Ltd confirms that all information is accurate and that the company is compliant with all MFMA procurement requirements.
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={handleSubmitBid} disabled={submitting} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting bid…</> : <><Send className="h-4 w-4" /> Submit Bid</>}
              </button>
              <button onClick={() => setShowSubmitModal(false)} disabled={submitting} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}
