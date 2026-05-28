import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ShieldAlert,
  FileText,
  Download,
  ChevronRight,
  Award,
  BadgeCheck,
  Eye,
  AlertOctagon,
} from "lucide-react";

export const Route = createFileRoute("/evaluation")({
  component: EvaluationPage,
  head: () => ({
    meta: [
      { title: "Gate 2 — Evaluation — Tenderbox" },
      {
        name: "description",
        content: "Automated bid evaluation and adjudication workflow.",
      },
    ],
  }),
});

// Step 7: Gate 2 evaluation for Tender TBX-2025-0039
const EVALUATION_DATA = {
  tenderRef: "TBX-2025-0039",
  tenderTitle: "Installation of Water Reticulation Network — Phase 3",
  entity: "OR Tambo District Municipality",
  status: "evaluation_complete" as const,
  evaluationStarted: "2026-05-15",
  daysSinceStart: 5,
  stats: {
    totalBids: 7,
    disqualified: 2,
    belowThreshold: 0,
    proceeding: 5,
  },
};

// Step 7: Evaluation scores for Tender 3
const BIDDERS = [
  {
    id: "1",
    rank: 1,
    company: "Sizwe Construction (Pty) Ltd",
    compliance: 100,
    functionality: 92,
    price: 78,
    bbbee: 95,
    total: 87.4,
    redFlags: 0,
    status: "recommended" as const,
    flags: [],
  },
  {
    id: "2",
    rank: 2,
    company: "Mokoena Infrastructure",
    compliance: 95,
    functionality: 85,
    price: 75,
    bbbee: 90,
    total: 82.1,
    redFlags: 0,
    status: "proceeding" as const,
    flags: [],
  },
  {
    id: "3",
    rank: 3,
    company: "Dlamini Civils",
    compliance: 90,
    functionality: 82,
    price: 72,
    bbbee: 88,
    total: 79.8,
    redFlags: 0,
    status: "proceeding" as const,
    flags: [],
  },
  {
    id: "4",
    rank: 4,
    company: "Ndaba Projects",
    compliance: 88,
    functionality: 78,
    price: 70,
    bbbee: 85,
    total: 76.2,
    redFlags: 0,
    status: "proceeding" as const,
    flags: [],
  },
  {
    id: "5",
    rank: 5,
    company: "Khoza Engineering",
    compliance: 85,
    functionality: 75,
    price: 68,
    bbbee: 80,
    total: 71.5,
    redFlags: 0,
    status: "proceeding" as const,
    flags: [],
  },
  {
    id: "6",
    rank: 6,
    company: "Ntuli Civil Works",
    compliance: 72,
    functionality: 65,
    price: 82,
    bbbee: 75,
    total: null,
    redFlags: 1,
    status: "disqualified" as const,
    flags: [{ type: "Abnormally low tender", severity: "High", detail: "Bid price is 19% below PCE lower estimate" }],
  },
  {
    id: "7",
    rank: 7,
    company: "Ubuntu Infrastructure",
    compliance: 68,
    functionality: 58,
    price: 65,
    bbbee: 70,
    total: null,
    redFlags: 1,
    status: "disqualified" as const,
    flags: [{ type: "CIDB grade insufficient", severity: "High", detail: "Required Grade 6CE, contractor is Grade 4CE" }],
  },
];

const INTEGRITY_CHECKS = [
  { check: "Administrative compliance check", status: "pass" as const },
  { check: "Tax compliance (SARS TCS)", status: "pass" as const },
  { check: "CIDB grade verification", status: "alert" as const },
  { check: "CSD registration status", status: "pass" as const },
  { check: "Briefing attendance confirmed", status: "pass" as const },
  { check: "Bid rigging pattern analysis", status: "pass" as const },
  { check: "Shell company detection", status: "pass" as const },
  { check: "Evaluator conflict of interest check", status: "pass" as const },
  { check: "PCE bracket compliance", status: "alert" as const },
  { check: "Abnormally low tender check", status: "alert" as const },
  { check: "Beneficial ownership cross-check", status: "pass" as const },
  { check: "Repeat winner pattern check", status: "pass" as const },
];

const BAC_MEMBERS = [
  { role: "BEC Chairperson", name: "Adv. P. Nkosi", status: "signed" as const, signedDate: "2026-05-18T14:30:00" },
  { role: "BAC Member — Senior Manager", name: "Mr. S. Mthembu", status: "signed" as const, signedDate: "2026-05-19T09:15:00" },
  { role: "BAC Member — CFO", name: "Ms. R. Pillay", status: "pending" as const, notifiedDate: "2026-05-20" },
  { role: "BAC Member — SCM Manager", name: "Mr. T. Dlamini", status: "pending" as const, notifiedDate: "2026-05-20" },
  { role: "BAC Member — Technical Expert", name: "Eng. M. Singh", status: "pending" as const, notifiedDate: "2026-05-20" },
  { role: "Municipal Manager", name: "Mr. K. Ndlovu", status: "pending" as const, notifiedDate: "2026-05-20" },
];

function EvaluationPage() {
  const [selectedBidder, setSelectedBidder] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Gate Status Banner */}
      <div className="rounded-lg border-2 border-warning/30 bg-warning/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gate 2 — Bid Adjudication</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                {EVALUATION_DATA.tenderRef}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{EVALUATION_DATA.tenderTitle}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-warning/20 px-4 py-2 text-lg font-bold text-warning">
              <Clock className="h-5 w-5" />
              Evaluation Complete — Awaiting BAC Sign-off
            </span>
            <span className="text-sm text-muted-foreground">
              Day {EVALUATION_DATA.daysSinceStart} since evaluation started
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Automated Scoring Summary */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Automated Scoring Summary</h2>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Bids Received" value={EVALUATION_DATA.stats.totalBids} />
          <StatCard label="Bids Disqualified" value={EVALUATION_DATA.stats.disqualified} variant="danger" />
          <StatCard label="Below Threshold" value={EVALUATION_DATA.stats.belowThreshold} variant="warning" />
          <StatCard label="Proceeding to Ranking" value={EVALUATION_DATA.stats.proceeding} variant="success" />
        </div>

        {/* Ranked Bidder Table */}
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <h3 className="font-semibold text-foreground">Ranked Bidders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium w-16">Rank</th>
                  <th className="px-4 py-3 font-medium">Company Name</th>
                  <th className="px-4 py-3 font-medium text-center">Compliance</th>
                  <th className="px-4 py-3 font-medium text-center">Functionality</th>
                  <th className="px-4 py-3 font-medium text-center">Price</th>
                  <th className="px-4 py-3 font-medium text-center">BBBEE</th>
                  <th className="px-4 py-3 font-medium text-center">Total</th>
                  <th className="px-4 py-3 font-medium text-center">Red Flags</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {BIDDERS.map((bidder) => (
                  <BidderRow
                    key={bidder.id}
                    bidder={bidder}
                    selected={selectedBidder === bidder.id}
                    onSelect={() => setSelectedBidder(bidder.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2: Red Flag Engine */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Automated Integrity Checks</h2>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRITY_CHECKS.map((check, i) => (
              <div key={i} className="flex items-center gap-3">
                {check.status === "pass" ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/10">
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  </div>
                )}
                <span className="text-sm text-foreground">{check.check}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Gate 2 Sign-off Workflow */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Bid Adjudication Committee (BAC) Sign-off</h2>
        <p className="text-sm text-muted-foreground -mt-2">
          All members must biometrically sign before the award is released
        </p>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Sign-off Progress</h3>
              <span className="text-sm font-medium text-foreground">
                {BAC_MEMBERS.filter((m) => m.status === "signed").length} of {BAC_MEMBERS.length} signatures received
              </span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-all"
                style={{ width: `${(BAC_MEMBERS.filter((m) => m.status === "signed").length / BAC_MEMBERS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Sign-off Status</th>
                  <th className="px-6 py-3 font-medium">Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {BAC_MEMBERS.map((member, i) => (
                  <BACMemberRow key={i} member={member} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deviation warning notice */}
        <div className="rounded-lg border-2 border-warning/30 bg-warning/10 p-6">
          <div className="flex items-start gap-3">
            <AlertOctagon className="h-6 w-6 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">System Rule — Mandatory Deviation Reporting</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                If the BAC awards other than the top-ranked bidder, a written justification is mandatory and this deviation is automatically reported to the Auditor-General.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const accentClass = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  }[variant];

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <div className={`h-8 w-8 rounded-md ${accentClass} flex items-center justify-center`}>
          <FileText className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function BidderRow({
  bidder,
  selected,
  onSelect,
}: {
  bidder: (typeof BIDDERS)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const getRowClass = () => {
    if (bidder.status === "disqualified") return "bg-danger/5";
    if (bidder.rank === 1) return "bg-warning/10";
    if (bidder.rank <= 3) return "bg-success/5";
    return selected ? "bg-primary/5" : "";
  };

  const getRankBadge = () => {
    if (bidder.status === "disqualified") {
      return (
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-danger/20 text-danger font-bold text-sm">
          <XCircle className="h-4 w-4" />
        </span>
      );
    }
    if (bidder.rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-warning text-warning-foreground font-bold text-sm">
          <Award className="h-4 w-4" />
          #1
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground font-bold text-sm">
        #{bidder.rank}
      </span>
    );
  };

  const getStatusBadge = () => {
    switch (bidder.status) {
      case "recommended":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
            <BadgeCheck className="h-3 w-3" />
            Recommended
          </span>
        );
      case "proceeding":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success">
            <CheckCircle className="h-3 w-3" />
            Proceeding
          </span>
        );
      case "disqualified":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-danger/20 bg-danger/10 px-2 py-1 text-xs font-medium text-danger line-through">
            <XCircle className="h-3 w-3" />
            Disqualified
          </span>
        );
    }
  };

  const getScoreClass = (score: number | null, threshold = 70) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-success font-medium";
    if (score >= threshold) return "text-foreground font-medium";
    return "text-danger";
  };

  return (
    <tr className={`${getRowClass()} cursor-pointer transition-colors`} onClick={onSelect}>
      <td className="px-4 py-3">{getRankBadge()}</td>
      <td className="px-4 py-3 font-medium text-foreground">{bidder.company}</td>
      <td className={`px-4 py-3 text-center ${getScoreClass(bidder.compliance, 70)}`}>{bidder.compliance}%</td>
      <td className={`px-4 py-3 text-center ${getScoreClass(bidder.functionality, 60)}`}>{bidder.functionality}%</td>
      <td className={`px-4 py-3 text-center ${getScoreClass(bidder.price, 70)}`}>{bidder.price}%</td>
      <td className={`px-4 py-3 text-center ${getScoreClass(bidder.bbbee, 70)}`}>{bidder.bbbee}%</td>
      <td className={`px-4 py-3 text-center font-bold ${bidder.total ? "text-foreground" : "text-muted-foreground"}`}>
        {bidder.total ? `${bidder.total.toFixed(1)}%` : "—"}
      </td>
      <td className="px-4 py-3 text-center">
        {bidder.redFlags > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-1 text-xs font-medium text-danger">
            <AlertTriangle className="h-3 w-3" />
            {bidder.redFlags}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
          </span>
        )}
      </td>
      <td className="px-4 py-3">{getStatusBadge()}</td>
    </tr>
  );
}

function BACMemberRow({ member }: { member: (typeof BAC_MEMBERS)[0] }) {
  if (member.role === "BEC Chairperson") {
    return (
      <tr className="">
        <td className="px-6 py-4 font-medium text-foreground">{member.role}</td>
        <td className="px-6 py-4 text-muted-foreground">{member.name}</td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            <CheckCircle className="h-3 w-3" />
            Recommendation submitted
          </span>
        </td>
        <td className="px-6 py-4 text-muted-foreground">{member.signedDate ? formatDateTime(member.signedDate) : "—"}</td>
      </tr>
    );
  }

  return (
    <tr className="">
      <td className="px-6 py-4 font-medium text-foreground">{member.role}</td>
      <td className="px-6 py-4 text-muted-foreground">{member.name}</td>
      <td className="px-6 py-4">
        {member.status === "signed" ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success">
            <CheckCircle className="h-3 w-3" />
            Signed — {formatDateTime(member.signedDate!)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-warning/20 bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
            <Clock className="h-3 w-3" />
            Pending — Notified {member.notifiedDate}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-muted-foreground">
        {member.status === "signed" && member.signedDate ? formatDateTime(member.signedDate) : "—"}
      </td>
    </tr>
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