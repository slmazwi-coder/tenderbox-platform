import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  MapPin,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects — Tenderbox" },
      {
        name: "description",
        content: "Track your active and completed construction projects.",
      },
    ],
  }),
});

type ProjectStatus = "Active" | "Completed" | "On Hold" | "Under Termination";
type ProjectFilter = "all" | ProjectStatus;

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  province: string;
  sector: string;
  role: "Main Contractor" | "Subcontractor" | "JV Partner";
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  contractValue: number;
  certifiedValue: number;
  completion: number;
  verificationStatus: "Verified" | "Pending" | "Not Submitted";
}

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "N3 Pavement Rehabilitation — Heidelberg",
    client: "SANRAL",
    location: "Heidelberg, Gauteng",
    province: "Gauteng",
    sector: "Roads",
    role: "Main Contractor",
    startDate: "2023-02-01",
    endDate: "2024-08-30",
    status: "Completed",
    contractValue: 84500000,
    certifiedValue: 84500000,
    completion: 100,
    verificationStatus: "Verified",
  },
  {
    id: "2",
    name: "Sebokeng Stormwater Upgrade",
    client: "Emfuleni Local Municipality",
    location: "Sebokeng, Gauteng",
    province: "Gauteng",
    sector: "Stormwater",
    role: "Main Contractor",
    startDate: "2022-06-15",
    endDate: "2023-05-10",
    status: "Completed",
    contractValue: 22100000,
    certifiedValue: 22100000,
    completion: 100,
    verificationStatus: "Verified",
  },
  {
    id: "3",
    name: "Soshanguve Internal Roads",
    client: "City of Tshwane",
    location: "Soshanguve, Pretoria",
    province: "Gauteng",
    sector: "Roads",
    role: "Subcontractor",
    startDate: "2021-10-01",
    endDate: "2022-07-22",
    status: "Completed",
    contractValue: 11750000,
    certifiedValue: 11750000,
    completion: 100,
    verificationStatus: "Pending",
  },
  {
    id: "4",
    name: "Alexandra Township Water Infrastructure",
    client: "City of Johannesburg",
    location: "Alexandra, Johannesburg",
    province: "Gauteng",
    sector: "Water & Sanitation",
    role: "Main Contractor",
    startDate: "2024-09-01",
    endDate: null,
    status: "Active",
    contractValue: 125000000,
    certifiedValue: 47800000,
    completion: 38,
    verificationStatus: "Verified",
  },
  {
    id: "5",
    name: "Durban Harbour Road Access",
    client: "Transnet",
    location: "Durban, KwaZulu-Natal",
    province: "KwaZulu-Natal",
    sector: "Roads",
    role: "JV Partner",
    startDate: "2025-01-15",
    endDate: null,
    status: "Active",
    contractValue: 67500000,
    certifiedValue: 18900000,
    completion: 28,
    verificationStatus: "Not Submitted",
  },
  {
    id: "6",
    name: "Mamelodi Community Hall",
    client: "City of Tshwane",
    location: "Mamelodi, Pretoria",
    province: "Gauteng",
    sector: "Building",
    role: "Main Contractor",
    startDate: "2024-03-01",
    endDate: null,
    status: "On Hold",
    contractValue: 18500000,
    certifiedValue: 8200000,
    completion: 44,
    verificationStatus: "Verified",
  },
  {
    id: "7",
    name: "Midrand Stormwater Catchment",
    client: "City of Johannesburg",
    location: "Midrand, Gauteng",
    province: "Gauteng",
    sector: "Stormwater",
    role: "Main Contractor",
    startDate: "2025-06-01",
    endDate: null,
    status: "Active",
    contractValue: 56000000,
    certifiedValue: 0,
    completion: 0,
    verificationStatus: "Not Submitted",
  },
];

function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectFilter>("all");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: PROJECTS.filter((p) => p.status === "Active").length,
    completed: PROJECTS.filter((p) => p.status === "Completed").length,
    totalValue: PROJECTS.filter((p) => p.status === "Active").reduce((sum, p) => sum + p.contractValue, 0),
    certifiedValue: PROJECTS.filter((p) => p.status === "Active").reduce((sum, p) => sum + p.certifiedValue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your construction projects and experience record
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Active Projects"
          value={stats.active}
          icon={Briefcase}
          accent="bg-primary/10 text-primary"
        />
        <SummaryCard
          label="Completed Projects"
          value={stats.completed}
          icon={CheckCircle}
          accent="bg-success/10 text-success"
        />
        <SummaryCard
          label="Active Contract Value"
          value={formatZAR(stats.totalValue)}
          icon={Building2}
          accent="bg-accent/10 text-accent"
        />
        <SummaryCard
          label="Certified to Date"
          value={formatZAR(stats.certifiedValue)}
          icon={Calendar}
          accent="bg-warning/10 text-warning"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, clients, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectFilter)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Under Termination">Under Termination</option>
          </select>
        </div>
      </div>

      {/* Projects table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Contract Value</th>
                <th className="px-6 py-3 font-medium">Progress</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Verification</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, i) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  striped={i % 2 === 1}
                  expanded={expandedProject === project.id}
                  onToggle={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No projects found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
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
  value: string | number;
  icon: typeof Briefcase;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-xl font-semibold text-foreground">{value}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  striped,
  expanded,
  onToggle,
}: {
  project: Project;
  striped: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig: Record<ProjectStatus, { label: string; className: string; icon: typeof Clock }> = {
    Active: { label: "Active", className: "bg-primary/10 text-primary border-primary/20", icon: Briefcase },
    Completed: { label: "Completed", className: "bg-success/10 text-success border-success/20", icon: CheckCircle },
    "On Hold": { label: "On Hold", className: "bg-warning/10 text-warning border-warning/20", icon: AlertTriangle },
    "Under Termination": { label: "Under Termination", className: "bg-danger/10 text-danger border-danger/20", icon: AlertTriangle },
  };

  const verificationConfig: Record<Project["verificationStatus"], { label: string; className: string }> = {
    Verified: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
    Pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
    "Not Submitted": { label: "Not Submitted", className: "bg-muted text-muted-foreground border-border" },
  };

  const status = statusConfig[project.status];
  const verification = verificationConfig[project.verificationStatus];
  const StatusIcon = status.icon;

  return (
    <>
      <tr className={striped ? "bg-muted/30" : "bg-card"}>
        <td className="px-6 py-4">
          <div>
            <div className="font-medium text-foreground">{project.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.location}
              </span>
              <span>{project.sector}</span>
              <span className="font-medium text-foreground">{project.role}</span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-muted-foreground">{project.client}</td>
        <td className="px-6 py-4 font-medium text-foreground">{formatZAR(project.contractValue)}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${project.completion}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">{project.completion}%</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${status.className}`}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${verification.className}`}>
            {verification.label}
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
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className={striped ? "bg-muted/20" : "bg-muted/5"}>
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard label="Start Date" value={formatDate(project.startDate)} />
              <InfoCard
                label="End Date"
                value={project.endDate ? formatDate(project.endDate) : "In Progress"}
              />
              <InfoCard label="Certified Value" value={formatZAR(project.certifiedValue)} />
              <InfoCard
                label="Remaining Value"
                value={formatZAR(project.contractValue - project.certifiedValue)}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}