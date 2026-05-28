import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  PieChart,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: ReportsPage
});

const BID_HISTORY = [
  { month: "Nov 2025", submitted: 5, awarded: 1, value: 125000000 },
  { month: "Dec 2025", submitted: 3, awarded: 2, value: 89000000 },
  { month: "Jan 2026", submitted: 4, awarded: 0, value: 156000000 },
  { month: "Feb 2026", submitted: 6, awarded: 1, value: 234000000 },
  { month: "Mar 2026", submitted: 5, awarded: 2, value: 178000000 },
  { month: "Apr 2026", submitted: 7, awarded: 1, value: 312000000 },
];

const SECTOR_PERFORMANCE = [
  { sector: "Roads & Transport", bids: 12, awarded: 4, winRate: 33 },
  { sector: "Civil Engineering", bids: 8, awarded: 2, winRate: 25 },
  { sector: "Stormwater", bids: 5, awarded: 2, winRate: 40 },
  { sector: "Water & Sanitation", bids: 4, awarded: 1, winRate: 25 },
  { sector: "Building", bids: 6, awarded: 1, winRate: 17 },
  { sector: "Renewable Energy", bids: 3, awarded: 1, winRate: 33 },
];

const STATUS_DISTRIBUTION = [
  { status: "Awarded", count: 7, percentage: 18, color: "bg-success" },
  { status: "Under Review", count: 12, percentage: 32, color: "bg-warning" },
  { status: "Rejected", count: 8, percentage: 21, color: "bg-danger" },
  { status: "Draft", count: 11, percentage: 29, color: "bg-muted" },
];

function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  const totalBids = BID_HISTORY.reduce((sum, m) => sum + m.submitted, 0);
  const totalAwarded = BID_HISTORY.reduce((sum, m) => sum + m.awarded, 0);
  const totalValue = BID_HISTORY.reduce((sum, m) => sum + m.value, 0);
  const winRate = totalBids > 0 ? Math.round((totalAwarded / totalBids) * 100) : 0;

  const maxBids = Math.max(...BID_HISTORY.map((m) => m.submitted));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your tendering performance and success metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Total Bids"
          value={totalBids}
          subLabel="submitted"
          icon={FileText}
          accent="bg-primary/10 text-primary"
          trend={+2}
        />
        <SummaryCard
          label="Win Rate"
          value={`${winRate}%`}
          subLabel={`${totalAwarded} awarded`}
          icon={TrendingUp}
          accent="bg-success/10 text-success"
          trend={+5}
        />
        <SummaryCard
          label="Total Contract Value"
          value={formatZAR(totalValue)}
          subLabel="across all bids"
          icon={BarChart3}
          accent="bg-accent/10 text-accent"
          trend={+18}
        />
        <SummaryCard
          label="Avg. Bid Value"
          value={formatZAR(Math.round(totalValue / totalBids))}
          subLabel="per submission"
          icon={PieChart}
          accent="bg-warning/10 text-warning"
          trend={-3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bid history bar chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Bid Activity History
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary" />
                Submitted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-success" />
                Awarded
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-2 h-48">
            {BID_HISTORY.map((month) => (
              <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full justify-center gap-1">
                  <div
                    className="w-6 rounded-t bg-primary"
                    style={{ height: `${(month.submitted / maxBids) * 100}%` }}
                    title={`${month.submitted} bids`}
                  />
                  <div
                    className="w-6 rounded-t bg-success"
                    style={{ height: `${(month.awarded / maxBids) * 100}%` }}
                    title={`${month.awarded} awarded`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status distribution */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Bid Status Distribution
          </h2>

          <div className="mt-6 space-y-3">
            {STATUS_DISTRIBUTION.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.status}</span>
                  <span className="font-medium text-foreground">{item.count}</span>
                </div>
                <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <div className="text-xs text-muted-foreground">Total Bids</div>
            <div className="text-2xl font-semibold text-foreground">{totalBids}</div>
          </div>
        </div>
      </div>

      {/* Sector performance table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Performance by Sector
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Sector</th>
                <th className="px-6 py-3 font-medium">Bids Submitted</th>
                <th className="px-6 py-3 font-medium">Contracts Won</th>
                <th className="px-6 py-3 font-medium">Win Rate</th>
                <th className="px-6 py-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_PERFORMANCE.map((sector, i) => (
                <tr key={sector.sector} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-4 font-medium text-foreground">{sector.sector}</td>
                  <td className="px-6 py-4 text-muted-foreground">{sector.bids}</td>
                  <td className="px-6 py-4 text-muted-foreground">{sector.awarded}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${
                            sector.winRate >= 30 ? "bg-success" : sector.winRate >= 20 ? "bg-warning" : "bg-danger"
                          }`}
                          style={{ width: `${sector.winRate}%` }}
                        />
                      </div>
                      <span className="font-medium text-foreground">{sector.winRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      sector.winRate >= 30 ? "text-success" : sector.winRate >= 20 ? "text-warning" : "text-danger"
                    }`}>
                      {sector.winRate >= 20 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {sector.winRate >= 30 ? "Above avg" : sector.winRate >= 20 ? "Average" : "Below avg"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InsightCard
          title="Strongest Performance"
          description="Stormwater sector has your highest win rate at 40%. Focus more bids in this sector."
          icon={TrendingUp}
          accent="bg-success/10 text-success"
        />
        <InsightCard
          title="Opportunity Gap"
          description="Building sector shows only 17% win rate. Consider strengthening your profile or targeting smaller contracts."
          icon={Activity}
          accent="bg-warning/10 text-warning"
        />
        <InsightCard
          title="Compliance Alert"
          description="1 compliance document expired. This may affect your eligibility for 3 active tenders."
          icon={Calendar}
          accent="bg-danger/10 text-danger"
        />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  subLabel,
  icon: Icon,
  accent,
  trend,
}: {
  label: string;
  value: string | number;
  subLabel: string;
  icon: typeof BarChart3;
  accent: string;
  trend: number;
}) {
  const isPositive = trend >= 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{subLabel}</span>
            <span className={`flex items-center gap-0.5 ${isPositive ? "text-success" : "text-danger"}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          </div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  description: string;
  icon: typeof BarChart3;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function formatZAR(amount: number) {
  if (amount >= 1000000000) {
    return `R ${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `R ${(amount / 1000000).toFixed(0)}M`;
  }
  if (amount >= 1000) {
    return `R ${(amount / 1000).toFixed(0)}K`;
  }
  return `R ${amount}`;
}