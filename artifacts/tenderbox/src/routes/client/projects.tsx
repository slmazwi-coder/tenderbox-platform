import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Eye, Calendar, Building2, MapPin,
  CheckCircle, Clock, AlertTriangle, XCircle,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/projects")({ component: GuardedProjectsPage });

const CLIENT_ROLES = ["client_entity"];

type ProgrammeStatus = "On Track" | "Delayed" | "Critical" | "Completed";

interface Project {
  id: string; name: string; tenderRef: string; contractor: string;
  location: string; sector: string; contractValue: number; certifiedValue: number;
  startDate: string; endDate: string | null; completion: number;
  programmeStatus: ProgrammeStatus; lastSiteDiary: string | null;
  pm: string; delays?: string;
}

const PROJECTS: Project[] = [
  { id: "1", name: "N3 Pavement Rehabilitation — Heidelberg Section", tenderRef: "TBX-2025-0012", contractor: "Sizwe Construction (Pty) Ltd", location: "Heidelberg, Gauteng", sector: "Roads", contractValue: 84500000, certifiedValue: 18590000, startDate: "2026-01-15", endDate: null, completion: 22, programmeStatus: "On Track", lastSiteDiary: "2026-06-05", pm: "Eng. M. Sithole" },
  { id: "2", name: "Stormwater Drainage Rehab — Amathole Phase 2", tenderRef: "TBX-2024-0047", contractor: "Sizwe Construction (Pty) Ltd", location: "Amathole, Eastern Cape", sector: "Stormwater", contractValue: 6890000, certifiedValue: 5245000, startDate: "2024-06-01", endDate: null, completion: 76, programmeStatus: "On Track", lastSiteDiary: "2026-06-04", pm: "Ms. T. Nkosi" },
  { id: "3", name: "Upgrading of Access Roads — Matatiele Phase 2", tenderRef: "TBX-2025-0047", contractor: "Sizwe Construction (Pty) Ltd", location: "Matatiele, Eastern Cape", sector: "Roads", contractValue: 8450000, certifiedValue: 1200000, startDate: "2026-03-01", endDate: null, completion: 14, programmeStatus: "Delayed", lastSiteDiary: "2026-06-01", pm: "Mr. B. Cele", delays: "Programme 3 weeks behind due to rainy season. Contractor submitted extension request 28 May 2026." },
  { id: "4", name: "Community Hall Construction — Ward 7 Emalahleni", tenderRef: "TBX-2025-0051", contractor: "Ntuli Civil Works CC", location: "Emalahleni, Mpumalanga", sector: "Building", contractValue: 3200000, certifiedValue: 1216000, startDate: "2025-04-15", endDate: null, completion: 38, programmeStatus: "On Track", lastSiteDiary: "2026-06-03", pm: "Eng. P. Dlamini" },
  { id: "5", name: "Solar PV Rooftop Installation Phase 1 — Municipal Buildings", tenderRef: "TBX-2025-0062", contractor: "Khoza Engineering (Pty) Ltd", location: "Pretoria, Gauteng", sector: "Renewable Energy", contractValue: 22000000, certifiedValue: 8360000, startDate: "2025-07-01", endDate: null, completion: 38, programmeStatus: "Critical", lastSiteDiary: "2026-05-25", pm: "Eng. R. Okafor", delays: "Roof structure defects discovered at 3 sites requiring remedial work. Cost overrun estimated at R1.2M. Engineer's instruction issued." },
  { id: "6", name: "Sewer Reticulation Network Phase 2 — Diepkloof", tenderRef: "TBX-2026-0039", contractor: "Mokoena Infrastructure Group", location: "Soweto, Gauteng", sector: "Civil — Sewer", contractValue: 24500000, certifiedValue: 0, startDate: "2026-07-01", endDate: null, completion: 0, programmeStatus: "On Track", lastSiteDiary: null, pm: "Ms. B. Khumalo" },
  { id: "7", name: "Bus Rapid Transit Infrastructure Phase 1", tenderRef: "TBX-2025-0088", contractor: "Mokoena Infrastructure Group", location: "Johannesburg CBD, Gauteng", sector: "Roads", contractValue: 45000000, certifiedValue: 5400000, startDate: "2025-11-01", endDate: null, completion: 12, programmeStatus: "Delayed", lastSiteDiary: "2026-05-28", pm: "Eng. T. Mthembu", delays: "Underground services relocation took 6 weeks longer than planned. Revised programme submitted by contractor." },
  { id: "8", name: "Water Reticulation Network — KwaMashu Phase 2 (Complete)", tenderRef: "TBX-2023-0082", contractor: "Sizwe Construction (Pty) Ltd", location: "KwaMashu, KwaZulu-Natal", sector: "Water & Sanitation", contractValue: 13450000, certifiedValue: 13450000, startDate: "2023-09-15", endDate: "2025-01-30", completion: 100, programmeStatus: "Completed", lastSiteDiary: "2025-01-28", pm: "Eng. P. Dlamini" },
];

type StatusFilter = ProgrammeStatus | "all";

const STATUS_CFG: Record<ProgrammeStatus, { label: string; cls: string; icon: typeof CheckCircle }> = {
  "On Track": { label: "On Track",  cls: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  "Delayed":  { label: "Delayed",   cls: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  "Critical": { label: "Critical",  cls: "bg-danger/10 text-danger border-danger/20",    icon: AlertTriangle },
  "Completed":{ label: "Completed", cls: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
};

const PROGRESS_BAR: Record<ProgrammeStatus, string> = {
  "On Track": "bg-success", "Delayed": "bg-warning", "Critical": "bg-danger", "Completed": "bg-primary",
};

function ProjectsPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewProject, setViewProject] = useState<Project | null>(null);

  const counts: Record<StatusFilter, number> = {
    all: PROJECTS.length,
    "On Track": PROJECTS.filter((p) => p.programmeStatus === "On Track").length,
    "Delayed":  PROJECTS.filter((p) => p.programmeStatus === "Delayed").length,
    "Critical": PROJECTS.filter((p) => p.programmeStatus === "Critical").length,
    "Completed":PROJECTS.filter((p) => p.programmeStatus === "Completed").length,
  };

  const filtered = PROJECTS.filter((p) => {
    const matchStatus = statusFilter === "all" || p.programmeStatus === statusFilter;
    const matchSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tenderRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Active Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">Programme status for all municipal projects under construction</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["On Track", "Delayed", "Critical", "Completed"] as ProgrammeStatus[]).map((s) => {
          const cfg = STATUS_CFG[s];
          const StatusIcon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={["rounded-lg border bg-card p-4 shadow-sm text-left transition-all", statusFilter === s ? "ring-2 ring-primary" : "border-border hover:border-primary/30"].join(" ")}
            >
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${cfg.cls.split(" ").find((c) => c.startsWith("text-"))}`} />
                <span className="text-xs font-medium text-muted-foreground">{s}</span>
              </div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{counts[s]}</div>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by project name, contractor, or tender reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Contractor</th>
                <th className="px-6 py-3 font-medium">Value</th>
                <th className="px-6 py-3 font-medium">Start Date</th>
                <th className="px-6 py-3 font-medium">Progress</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Last Diary</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((proj, i) => {
                const cfg = STATUS_CFG[proj.programmeStatus];
                const StatusIcon = cfg.icon;
                const daysSinceDiary = proj.lastSiteDiary
                  ? Math.floor((Date.now() - new Date(proj.lastSiteDiary).getTime()) / 86400000)
                  : null;
                return (
                  <tr key={proj.id} className={[i % 2 === 1 ? "bg-muted/30" : "bg-card", "hover:bg-primary/5 transition-colors"].join(" ")}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground max-w-[200px] line-clamp-2">{proj.name}</div>
                      <div className="text-xs text-muted-foreground">{proj.tenderRef}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">{proj.contractor}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{proj.location.split(",")[0]}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{formatZAR(proj.contractValue)}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{formatDate(proj.startDate)}</td>
                    <td className="px-6 py-4 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${PROGRESS_BAR[proj.programmeStatus]}`} style={{ width: `${proj.completion}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{proj.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.cls}`}>
                        <StatusIcon className="h-3 w-3" />{cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {proj.lastSiteDiary ? (
                        <div>
                          <div className="text-xs text-muted-foreground">{formatDate(proj.lastSiteDiary)}</div>
                          {daysSinceDiary !== null && (
                            <div className={`text-[10px] ${daysSinceDiary > 14 ? "text-danger" : daysSinceDiary > 7 ? "text-warning" : "text-muted-foreground"}`}>
                              {daysSinceDiary === 0 ? "Today" : `${daysSinceDiary}d ago`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not started</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setViewProject(proj)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5" />View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No projects found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {viewProject && (
        <Modal title={viewProject.name} onClose={() => setViewProject(null)} size="lg">
          <div className="space-y-4">
            <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${STATUS_CFG[viewProject.programmeStatus].cls}`}>
              {(() => { const Ic = STATUS_CFG[viewProject.programmeStatus].icon; return <Ic className="h-4 w-4" />; })()}
              Programme Status: {viewProject.programmeStatus}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Tender Reference", value: viewProject.tenderRef },
                { label: "Contractor", value: viewProject.contractor },
                { label: "Project Manager", value: viewProject.pm },
                { label: "Sector", value: viewProject.sector },
                { label: "Location", value: viewProject.location },
                { label: "Contract Value", value: formatZAR(viewProject.contractValue) },
                { label: "Certified to Date", value: formatZAR(viewProject.certifiedValue) },
                { label: "Start Date", value: formatDate(viewProject.startDate) },
                { label: "End Date", value: viewProject.endDate ? formatDate(viewProject.endDate) : "Ongoing" },
                { label: "Completion", value: `${viewProject.completion}%` },
                { label: "Last Site Diary", value: viewProject.lastSiteDiary ? formatDate(viewProject.lastSiteDiary) : "None" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            {viewProject.completion < 100 && (
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Programme completion</span><span>{viewProject.completion}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${PROGRESS_BAR[viewProject.programmeStatus]}`} style={{ width: `${viewProject.completion}%` }} />
                </div>
              </div>
            )}
            {viewProject.delays && (
              <div className="rounded-md border border-warning/20 bg-warning/5 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-warning mb-1">Delay Notes</div>
                <p className="text-sm text-muted-foreground">{viewProject.delays}</p>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { toast("Opening project report…", "info"); setViewProject(null); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                View Full Project Report
              </button>
              <button onClick={() => setViewProject(null)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(d: string) { return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }); }
function formatZAR(n: number) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n); }

function GuardedProjectsPage() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><ProjectsPage /></RoleGuard>;
}
