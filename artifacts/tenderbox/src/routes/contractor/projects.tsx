import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase, Plus, Search, Eye, Download, Calendar,
  MapPin, Building2, CheckCircle, Clock, AlertTriangle,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/contractor/projects")({ component: GuardedProjectsPage });

const CONTRACTOR_ROLES = ["contractor", "employee"];

type ProjectStatus = "Active" | "Completed" | "On Hold" | "Under Termination";

interface Project {
  id: string; name: string; client: string; location: string; province: string;
  sector: string; role: "Main Contractor" | "Subcontractor" | "JV Partner";
  startDate: string; endDate: string | null; status: ProjectStatus;
  contractValue: number; certifiedValue: number; completion: number;
  verificationStatus: "Verified" | "Pending" | "Not Submitted";
  description?: string; siteManager?: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: "1", name: "N3 Pavement Rehabilitation — Heidelberg", client: "SANRAL", location: "Heidelberg, Gauteng", province: "Gauteng", sector: "Roads", role: "Main Contractor", startDate: "2023-02-01", endDate: "2024-08-30", status: "Completed", contractValue: 84500000, certifiedValue: 84500000, completion: 100, verificationStatus: "Verified", description: "Full depth reclamation and pavement rehabilitation on N3 between Heidelberg and Alberton. 18km stretch including drainage upgrades.", siteManager: "Mr. S. Mkhize" },
  { id: "2", name: "Rehabilitation of Stormwater Drainage — Amathole", client: "Amathole District Municipality", location: "Amathole, Eastern Cape", province: "Eastern Cape", sector: "Stormwater", role: "Main Contractor", startDate: "2024-06-01", endDate: null, status: "Active", contractValue: 6890000, certifiedValue: 5245000, completion: 76, verificationStatus: "Verified", description: "Stormwater drainage rehabilitation in select urban areas.", siteManager: "Ms. T. Nkosi" },
  { id: "3", name: "Installation of Water Reticulation — KwaMashu", client: "eThekwini Water Services", location: "KwaMashu, KwaZulu-Natal", province: "KwaZulu-Natal", sector: "Water & Sanitation", role: "Main Contractor", startDate: "2023-09-15", endDate: "2025-01-30", status: "Completed", contractValue: 13450000, certifiedValue: 13450000, completion: 100, verificationStatus: "Verified", description: "Phase 2 water reticulation upgrade covering 5 suburbs.", siteManager: "Eng. P. Dlamini" },
  { id: "4", name: "Upgrading of Access Roads — Matatiele", client: "Matatiele Local Municipality", location: "Matatiele, Eastern Cape", province: "Eastern Cape", sector: "Roads", role: "Main Contractor", startDate: "2026-03-01", endDate: null, status: "Active", contractValue: 8450000, certifiedValue: 1200000, completion: 14, verificationStatus: "Pending", description: "Phase 2 of rural access road upgrade programme. 12km of gravel road regrading.", siteManager: "Mr. B. Cele" },
  { id: "5", name: "Solar PV Installation — Tshwane", client: "City of Tshwane", location: "Pretoria, Gauteng", province: "Gauteng", sector: "Renewable Energy", role: "JV Partner", startDate: "2025-07-01", endDate: "2026-01-31", status: "On Hold", contractValue: 22000000, certifiedValue: 8500000, completion: 38, verificationStatus: "Pending", description: "Installation of 2.4MWp rooftop solar PV across 18 municipal buildings.", siteManager: "Eng. R. Okafor" },
];

const SECTORS = ["Roads", "Civil Engineering", "Stormwater", "Water & Sanitation", "Building", "Renewable Energy"];
const PROVINCES = ["Eastern Cape", "Gauteng", "KwaZulu-Natal", "Limpopo", "Western Cape"];

function ProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", client: "", location: "", province: PROVINCES[0], sector: SECTORS[0], role: "Main Contractor" as Project["role"], startDate: "", contractValue: "", description: "", siteManager: "" });

  const filtered = projects.filter((p) => {
    const matchSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusConfig: Record<ProjectStatus, { label: string; cls: string; icon: typeof CheckCircle }> = {
    Active: { label: "Active", cls: "bg-success/10 text-success border-success/20", icon: CheckCircle },
    Completed: { label: "Completed", cls: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
    "On Hold": { label: "On Hold", cls: "bg-warning/10 text-warning border-warning/20", icon: Clock },
    "Under Termination": { label: "Under Termination", cls: "bg-danger/10 text-danger border-danger/20", icon: AlertTriangle },
  };

  const handleAddProject = () => {
    if (!form.name || !form.client || !form.startDate || !form.contractValue) { toast("Please fill in all required fields", "error"); return; }
    const newProject: Project = {
      id: String(Date.now()), name: form.name, client: form.client, location: form.location || form.province,
      province: form.province, sector: form.sector, role: form.role, startDate: form.startDate, endDate: null,
      status: "Active", contractValue: parseFloat(form.contractValue.replace(/[^0-9.]/g, "")),
      certifiedValue: 0, completion: 0, verificationStatus: "Not Submitted",
      description: form.description, siteManager: form.siteManager,
    };
    setProjects((prev) => [newProject, ...prev]);
    setShowAddModal(false);
    setForm({ name: "", client: "", location: "", province: PROVINCES[0], sector: SECTORS[0], role: "Main Contractor", startDate: "", contractValue: "", description: "", siteManager: "" });
    toast(`Project "${form.name}" added to your project register`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your active and completed government projects</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />Add New Project
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["Active", "Completed", "On Hold", "Under Termination"] as ProjectStatus[]).map((s) => {
          const count = projects.filter((p) => p.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "all" : s)} className={`rounded-lg border bg-card p-4 shadow-sm text-left transition-all ${statusFilter === s ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/30"}`}>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s}</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{count}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by project name or client..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Status</option>
          {(["Active", "Completed", "On Hold", "Under Termination"] as ProjectStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((project) => {
          const cfg = statusConfig[project.status];
          const StatusIcon = cfg.icon;
          const verCls = project.verificationStatus === "Verified" ? "text-success" : project.verificationStatus === "Pending" ? "text-warning" : "text-muted-foreground";
          return (
            <div key={project.id} className="rounded-lg border border-border bg-card p-6 shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.cls}`}><StatusIcon className="h-3 w-3" />{cfg.label}</span>
                    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{project.role}</span>
                    <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">{project.sector}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{project.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{project.client}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{project.location}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(project.startDate)} — {project.endDate ? formatDate(project.endDate) : "Ongoing"}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Completion: {project.completion}%</span>
                      <span>{formatZAR(project.certifiedValue)} certified of {formatZAR(project.contractValue)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full transition-all ${project.completion === 100 ? "bg-success" : project.completion > 50 ? "bg-primary" : "bg-warning"}`} style={{ width: `${project.completion}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{formatZAR(project.contractValue)}</div>
                    <div className={`text-xs font-medium ${verCls}`}>{project.verificationStatus === "Verified" ? "✓ " : "○ "}{project.verificationStatus}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewProject(project)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                      <Eye className="h-3.5 w-3.5" />View Details
                    </button>
                    <button onClick={() => toast(`Downloading certificate for ${project.name}`, "info")} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No projects found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or add a new project</p>
          </div>
        )}
      </div>

      {viewProject && (
        <Modal title={viewProject.name} onClose={() => setViewProject(null)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Client", value: viewProject.client }, { label: "Location", value: viewProject.location },
                { label: "Sector", value: viewProject.sector }, { label: "Role", value: viewProject.role },
                { label: "Contract Value", value: formatZAR(viewProject.contractValue) }, { label: "Certified to Date", value: formatZAR(viewProject.certifiedValue) },
                { label: "Start Date", value: formatDate(viewProject.startDate) }, { label: "End Date", value: viewProject.endDate ? formatDate(viewProject.endDate) : "Ongoing" },
                { label: "Completion", value: `${viewProject.completion}%` }, { label: "Site Manager", value: viewProject.siteManager ?? "—" },
                { label: "Verification", value: viewProject.verificationStatus }, { label: "Status", value: viewProject.status },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
            {viewProject.description && (
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Description</div>
                <p className="mt-1 text-sm text-muted-foreground">{viewProject.description}</p>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { toast(`Downloading project report`, "info"); setViewProject(null); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Download className="h-4 w-4" />Download Report
              </button>
              <button onClick={() => setViewProject(null)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {showAddModal && (
        <Modal title="Add New Project" onClose={() => setShowAddModal(false)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Project Name *", key: "name", placeholder: "e.g. Upgrading of Access Roads Phase 3" },
                { label: "Client / Employer *", key: "client", placeholder: "e.g. OR Tambo District Municipality" },
                { label: "Location", key: "location", placeholder: "e.g. Matatiele, Eastern Cape" },
                { label: "Site Manager", key: "siteManager", placeholder: "e.g. Mr. T. Nkosi" },
                { label: "Contract Value (ZAR) *", key: "contractValue", placeholder: "e.g. 12500000" },
                { label: "Start Date *", key: "startDate", type: "date", placeholder: "" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Province</label>
                <select value={form.province} onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sector</label>
                <select value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {SECTORS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your Role</label>
                <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Project["role"] }))} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Main Contractor</option><option>Subcontractor</option><option>JV Partner</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Project Description</label>
              <textarea placeholder="Brief description of the project scope..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleAddProject} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />Add Project
              </button>
              <button onClick={() => setShowAddModal(false)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}

function GuardedProjectsPage() {
  return (
    <RoleGuard allowedRoles={CONTRACTOR_ROLES}>
      <ProjectsPage />
    </RoleGuard>
  );
}
