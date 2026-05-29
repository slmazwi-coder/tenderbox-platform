import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3, Download, TrendingUp, TrendingDown,
  FileText, Activity, CheckCircle,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const BID_HISTORY_ALL = [
  { month: "Sep 2025", submitted: 3, awarded: 1, value: 67000000 },
  { month: "Oct 2025", submitted: 4, awarded: 0, value: 98000000 },
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

const REPORTS = [
  { id: "1", name: "Bid Performance Summary", period: "6 months", generated: "28 May 2026", type: "Performance" },
  { id: "2", name: "Compliance Audit Trail", period: "12 months", generated: "20 May 2026", type: "Compliance" },
  { id: "3", name: "Payment Analytics Report", period: "6 months", generated: "15 May 2026", type: "Payments" },
  { id: "4", name: "Gate 2 Evaluation Log", period: "TBX-2025-0039", generated: "15 May 2026", type: "Evaluation" },
  { id: "5", name: "AG Procurement Report", period: "2025/2026 FY", generated: "01 May 2026", type: "Regulatory" },
];

function ReportsPage() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<"3months" | "6months" | "12months">("6months");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const monthCount = period === "3months" ? 3 : period === "6months" ? 6 : 8;
  const data = BID_HISTORY_ALL.slice(-monthCount);

  const totalBids = data.reduce((s, m) => s + m.submitted, 0);
  const totalAwarded = data.reduce((s, m) => s + m.awarded, 0);
  const totalValue = data.reduce((s, m) => s + m.value, 0);
  const winRate = totalBids > 0 ? Math.round((totalAwarded / totalBids) * 100) : 0;
  const maxBids = Math.max(...data.map((m) => m.submitted));

  const handleDownload = (report: typeof REPORTS[0]) => {
    setGeneratingId(report.id);
    toast(`Generating ${report.name}…`, "info");
    setTimeout(() => {
      setGeneratingId(null);
      toast(`${report.name} downloaded successfully`, "success");
    }, 2000);
  };

  const handleExportAll = () => {
    toast("Preparing full analytics export…", "info");
    setTimeout(() => toast("Analytics package exported — 5 reports included", "success"), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your tendering performance and success metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-border bg-card overflow-hidden">
            {(["3months", "6months", "12months"] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-2 text-xs font-medium transition-colors ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {p === "3months" ? "3M" : p === "6months" ? "6M" : "12M"}
              </button>
            ))}
          </div>
          <button onClick={handleExportAll} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" />Export All
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Bids Submitted", value: String(totalBids), icon: FileText, trend: "+3 vs previous", up: true, cls: "bg-primary/10 text-primary" },
          { label: "Bids Awarded", value: String(totalAwarded), icon: CheckCircle, trend: `${winRate}% win rate`, up: winRate > 20, cls: "bg-success/10 text-success" },
          { label: "Total Bid Value", value: formatZAR(totalValue), icon: Activity, trend: "across all tenders", up: true, cls: "bg-accent/10 text-accent" },
          { label: "Win Rate", value: `${winRate}%`, icon: BarChart3, trend: winRate >= 25 ? "Above sector avg" : "Below sector avg", up: winRate >= 25, cls: winRate >= 25 ? "bg-success/10 text-success" : "bg-warning/10 text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-xl font-bold text-foreground truncate">{s.value}</div>
                <div className={`mt-1 flex items-center gap-1 text-xs ${s.up ? "text-success" : "text-warning"}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.trend}
                </div>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${s.cls}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bid Activity Chart */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Bid Activity — {period === "3months" ? "3 Months" : period === "6months" ? "6 Months" : "12 Months"}</h2>
          <button onClick={() => { toast("Generating bid activity chart PDF…", "info"); setTimeout(() => toast("Chart exported", "success"), 1500); }} className="text-xs text-primary hover:underline">Export chart</button>
        </div>
        <div className="flex items-end gap-2 h-40">
          {data.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "120px", justifyContent: "flex-end" }}>
                <div
                  className="w-full rounded-t-sm bg-primary/60 hover:bg-primary transition-colors cursor-pointer"
                  style={{ height: `${Math.max(4, (m.submitted / maxBids) * 100)}px` }}
                  title={`${m.submitted} submitted`}
                />
                {m.awarded > 0 && (
                  <div
                    className="w-3/4 rounded-t-sm bg-success"
                    style={{ height: `${Math.max(4, (m.awarded / maxBids) * 100)}px`, marginTop: "-2px" }}
                    title={`${m.awarded} awarded`}
                  />
                )}
              </div>
              <div className="text-[10px] text-muted-foreground text-center">{m.month.split(" ")[0]}</div>
              <div className="text-[10px] font-medium text-foreground">{m.submitted}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-primary/60 inline-block" /> Submitted</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-success inline-block" /> Awarded</span>
        </div>
      </div>

      {/* Sector Performance */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sector Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Sector</th>
                <th className="px-6 py-3 font-medium text-center">Bids</th>
                <th className="px-6 py-3 font-medium text-center">Awarded</th>
                <th className="px-6 py-3 font-medium">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_PERFORMANCE.map((s, i) => (
                <tr key={s.sector} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-3 font-medium text-foreground">{s.sector}</td>
                  <td className="px-6 py-3 text-center text-muted-foreground">{s.bids}</td>
                  <td className="px-6 py-3 text-center font-medium text-success">{s.awarded}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full ${s.winRate >= 30 ? "bg-success" : s.winRate >= 20 ? "bg-primary" : "bg-warning"}`} style={{ width: `${s.winRate}%` }} />
                      </div>
                      <span className={`w-10 text-right text-xs font-medium ${s.winRate >= 30 ? "text-success" : s.winRate >= 20 ? "text-primary" : "text-warning"}`}>{s.winRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Reports */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Generated Reports</h2>
        </div>
        <div className="divide-y divide-border">
          {REPORTS.map((report) => (
            <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{report.name}</div>
                  <div className="text-xs text-muted-foreground">Period: {report.period} · Generated: {report.generated}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">{report.type}</span>
                <button
                  onClick={() => handleDownload(report)}
                  disabled={generatingId === report.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60 disabled:cursor-wait"
                >
                  <Download className={`h-3.5 w-3.5 ${generatingId === report.id ? "animate-bounce" : ""}`} />
                  {generatingId === report.id ? "Generating…" : "Download"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-6 py-3 bg-muted/30">
          <button
            onClick={() => {
              toast("Scheduling new report generation…", "info");
              setTimeout(() => toast("Report scheduled — you will be notified when ready", "success"), 1500);
            }}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <BarChart3 className="h-4 w-4" />
            Generate new custom report
          </button>
        </div>
      </div>
    </div>
  );
}

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}
