import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Send,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ArrowUpDown,
  ChevronRight,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/bids")({
  component: BidsPage,
  head: () => ({
    meta: [
      { title: "My Bids — Tenderbox" },
      {
        name: "description",
        content: "Track your submitted bids, their status, and evaluation results.",
      },
    ],
  }),
});

// Mock bid data
const BIDS = [
  {
    id: "1",
    trackingId: "BID-2026-0142",
    tenderRef: "JHB-2026-014",
    tenderTitle: "Stormwater Drainage System Upgrade - Alexandra Township",
    entity: "City of Johannesburg",
    submissionDate: "2026-05-20T14:32:00",
    closingDate: "2026-06-15",
    bidAmount: 47850000,
    status: "under_review",
    scores: {
      compliance: 92,
      functionality: 85,
      price: 78,
      bbbee: 95,
      total: 86.8,
    },
    rank: null,
    redFlags: [],
  },
  {
    id: "2",
    trackingId: "BID-2026-0138",
    tenderRef: "ETH-2026-082",
    tenderTitle: "Supply and Delivery of Medical Equipment",
    entity: "eThekwini Municipality",
    submissionDate: "2026-05-18T09:15:00",
    closingDate: "2026-06-22",
    bidAmount: 124200000,
    status: "awarded",
    scores: {
      compliance: 100,
      functionality: 88,
      price: 82,
      bbbee: 95,
      total: 89.5,
    },
    rank: 1,
    redFlags: [],
  },
  {
    id: "3",
    trackingId: "BID-2026-0129",
    tenderRef: "TSH-2026-007",
    tenderTitle: "Construction of Community Hall - Soshanguve",
    entity: "City of Tshwane",
    submissionDate: "2026-05-15T16:45:00",
    closingDate: "2026-05-30",
    bidAmount: 18200000,
    status: "rejected",
    scores: {
      compliance: 72,
      functionality: 68,
      price: 75,
      bbbee: 95,
      total: 74.2,
    },
    rank: 4,
    redFlags: ["Compliance score below threshold"],
  },
  {
    id: "4",
    trackingId: "BID-2026-0115",
    tenderRef: "CPT-2026-031",
    tenderTitle: "Resurfacing of Major Arterial Roads - Phase 2",
    entity: "City of Cape Town",
    submissionDate: "2026-05-10T11:20:00",
    closingDate: "2026-06-29",
    bidAmount: 88500000,
    status: "under_review",
    scores: {
      compliance: 88,
      functionality: null,
      price: null,
      bbbee: 95,
      total: null,
    },
    rank: null,
    redFlags: [],
  },
  {
    id: "5",
    trackingId: "BID-2026-0108",
    tenderRef: "NMB-2026-045",
    tenderTitle: "Installation of Solar PV Systems",
    entity: "Nelson Mandela Bay",
    submissionDate: "2026-05-05T08:30:00",
    closingDate: "2026-07-10",
    bidAmount: 31800000,
    status: "draft",
    scores: {
      compliance: null,
      functionality: null,
      price: null,
      bbbee: 95,
      total: null,
    },
    rank: null,
    redFlags: [],
  },
];

type StatusFilter = "all" | "draft" | "under_review" | "awarded" | "rejected";
type SortField = "submissionDate" | "bidAmount" | "totalScore";
type SortOrder = "asc" | "desc";

function BidsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("submissionDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [expandedBid, setExpandedBid] = useState<string | null>(null);

  const filteredBids = BIDS
    .filter((bid) => statusFilter === "all" || bid.status === statusFilter)
    .sort((a, b) => {
      let aVal: number | string | null = null;
      let bVal: number | string | null = null;

      if (sortField === "submissionDate") {
        aVal = a.submissionDate;
        bVal = b.submissionDate;
      } else if (sortField === "bidAmount") {
        aVal = a.bidAmount;
        bVal = b.bidAmount;
      } else if (sortField === "totalScore") {
        aVal = a.scores.total;
        bVal = b.scores.total;
      }

      if (aVal === null) return 1;
      if (bVal === null) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const statusCounts = {
    all: BIDS.length,
    draft: BIDS.filter((b) => b.status === "draft").length,
    under_review: BIDS.filter((b) => b.status === "under_review").length,
    awarded: BIDS.filter((b) => b.status === "awarded").length,
    rejected: BIDS.filter((b) => b.status === "rejected").length,
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Bids</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your submitted bids and evaluate results
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Submit New Bid
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Bids"
          value={BIDS.length}
          icon={FileText}
          accent="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="Under Review"
          value={statusCounts.under_review}
          icon={Clock}
          accent="bg-warning/10 text-warning"
        />
        <SummaryCard
          label="Awarded"
          value={statusCounts.awarded}
          icon={CheckCircle}
          accent="bg-success/10 text-success"
        />
        <SummaryCard
          label="Draft"
          value={statusCounts.draft}
          icon={AlertTriangle}
          accent="bg-muted text-muted-foreground"
        />
      </div>

      {/* Filters */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {(["all", "draft", "under_review", "awarded", "rejected"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={[
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                statusFilter === status
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {status === "all" ? "All Bids" : status === "under_review" ? "Under Review" : capitalize(status)}
              <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bids table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Tracking ID</th>
                <th className="px-6 py-3 font-medium">Tender</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
                <th
                  className="px-6 py-3 font-medium cursor-pointer select-none hover:text-foreground"
                  onClick={() => toggleSort("bidAmount")}
                >
                  <span className="inline-flex items-center gap-1">
                    Bid Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th
                  className="px-6 py-3 font-medium cursor-pointer select-none hover:text-foreground"
                  onClick={() => toggleSort("totalScore")}
                >
                  <span className="inline-flex items-center gap-1">
                    Total Score
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-6 py-3 font-medium">Rank</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.map((bid, i) => (
                <BidRow
                  key={bid.id}
                  bid={bid}
                  striped={i % 2 === 1}
                  expanded={expandedBid === bid.id}
                  onToggle={() => setExpandedBid(expandedBid === bid.id ? null : bid.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredBids.length === 0 && (
          <div className="p-12 text-center">
            <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No bids found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {statusFilter === "all" ? "Start by submitting your first bid" : "No bids match this filter"}
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
}: {
  label: string;
  value: number;
  icon: typeof FileText;
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

function BidRow({
  bid,
  striped,
  expanded,
  onToggle,
}: {
  bid: (typeof BIDS)[0];
  striped: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
    draft: {
      label: "Draft",
      className: "bg-muted text-muted-foreground border-border",
      icon: AlertTriangle,
    },
    under_review: {
      label: "Under Review",
      className: "bg-warning/10 text-warning border-warning/20",
      icon: Clock,
    },
    awarded: {
      label: "Awarded",
      className: "bg-success/10 text-success border-success/20",
      icon: CheckCircle,
    },
    rejected: {
      label: "Rejected",
      className: "bg-danger/10 text-danger border-danger/20",
      icon: XCircle,
    },
  };

  const status = statusConfig[bid.status] ?? statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <>
      <tr className={striped ? "bg-muted/30" : "bg-card"}>
        <td className="px-6 py-4">
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {bid.trackingId}
          </span>
        </td>
        <td className="px-6 py-4">
          <div>
            <div className="font-medium text-foreground">{bid.tenderRef}</div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {bid.tenderTitle}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-muted-foreground">
          {formatDateTime(bid.submissionDate)}
        </td>
        <td className="px-6 py-4 font-medium text-foreground">
          {formatZAR(bid.bidAmount)}
        </td>
        <td className="px-6 py-4">
          {bid.scores.total !== null ? (
            <span className={`font-medium ${
              bid.scores.total >= 80 ? "text-success" :
              bid.scores.total >= 60 ? "text-warning" :
              "text-danger"
            }`}>
              {bid.scores.total.toFixed(1)}%
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="px-6 py-4">
          {bid.rank !== null ? (
            <span className={`inline-flex items-center justify-center rounded-full h-8 w-8 text-sm font-bold ${
              bid.rank === 1 ? "bg-success text-success-foreground" :
              "bg-muted text-foreground"
            }`}>
              #{bid.rank}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}>
            <StatusIcon className="h-3 w-3" />
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
            <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className={striped ? "bg-muted/20" : "bg-muted/5"}>
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreCard label="Compliance" score={bid.scores.compliance} />
              <ScoreCard label="Functionality" score={bid.scores.functionality} />
              <ScoreCard label="Price" score={bid.scores.price} />
              <ScoreCard label="B-BBEE" score={bid.scores.bbbee} />
            </div>
            {bid.redFlags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-start gap-2 rounded-md border border-danger/20 bg-danger/5 p-3">
                  <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-danger">Red Flags</div>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {bid.redFlags.map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-xl font-semibold ${
        score === null ? "text-muted-foreground" :
        score >= 80 ? "text-success" :
        score >= 60 ? "text-warning" :
        "text-danger"
      }`}>
        {score !== null ? `${score}%` : "—"}
      </div>
    </div>
  );
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}