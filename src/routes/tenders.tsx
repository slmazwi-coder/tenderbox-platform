import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Download,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/tenders")({
  component: TendersPage,
  head: () => ({
    meta: [
      { title: "Active Tenders — Tenderbox" },
      {
        name: "description",
        content: "Browse and apply for government tenders from South African municipalities and public sector entities.",
      },
    ],
  }),
});

// Mock data for demonstration
const TENDERS = [
  {
    id: "1",
    ref: "JHB-2026-014",
    title: "Stormwater Drainage System Upgrade - Alexandra Township",
    entity: "City of Johannesburg Metropolitan Municipality",
    province: "Gauteng",
    category: "Civil Engineering",
    budget: 48500000,
    closingDate: "2026-06-15",
    briefingDate: "2026-05-28",
    briefingType: "Non-mandatory",
    cidbGrade: "7CE",
    status: "open",
    description: "Upgrade and expansion of stormwater drainage infrastructure in Alexandra township.",
  },
  {
    id: "2",
    ref: "ETH-2026-082",
    title: "Supply and Delivery of Medical Equipment - Regional Hospitals",
    entity: "eThekwini Metropolitan Municipality",
    province: "KwaZulu-Natal",
    category: "Medical Equipment",
    budget: 127500000,
    closingDate: "2026-06-22",
    briefingDate: "2026-06-01",
    briefingType: "Mandatory",
    cidbGrade: null,
    status: "open",
    description: "Supply, delivery, installation, and commissioning of medical equipment for regional hospitals.",
  },
  {
    id: "3",
    ref: "CPT-2026-031",
    title: "Resurfacing of Major Arterial Roads - Phase 2",
    entity: "City of Cape Town",
    province: "Western Cape",
    category: "Roads & Transport",
    budget: 89200000,
    closingDate: "2026-06-29",
    briefingDate: "2026-06-10",
    briefingType: "Non-mandatory",
    cidbGrade: "6CE",
    status: "open",
    description: "Road resurfacing and rehabilitation of major arterial roads in the Cape Town metropolitan area.",
  },
  {
    id: "4",
    ref: "TSH-2026-007",
    title: "Construction of Community Hall - Soshanguve",
    entity: "City of Tshwane Metropolitan Municipality",
    province: "Gauteng",
    category: "Building Construction",
    budget: 18500000,
    closingDate: "2026-05-30",
    briefingDate: null,
    briefingType: null,
    cidbGrade: "4GB",
    status: "closing-soon",
    description: "Construction of a new community hall including ablution facilities and parking area.",
  },
  {
    id: "5",
    ref: "NMB-2026-045",
    title: "Installation of Solar PV Systems - Municipal Buildings",
    entity: "Nelson Mandela Bay Municipality",
    province: "Eastern Cape",
    category: "Renewable Energy",
    budget: 32400000,
    closingDate: "2026-07-10",
    briefingDate: "2026-06-20",
    briefingType: "Mandatory",
    cidbGrade: "3ME",
    status: "open",
    description: "Installation of solar photovoltaic systems on municipal buildings across Nelson Mandela Bay.",
  },
];

type StatusFilter = "all" | "open" | "closing-soon" | "closed";

function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [provinceFilter, setProvinceFilter] = useState("all");

  const provinces = ["all", ...new Set(TENDERS.map((t) => t.province))];

  const filteredTenders = TENDERS.filter((tender) => {
    const matchesSearch =
      searchQuery === "" ||
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.entity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tender.status === statusFilter;

    const matchesProvince =
      provinceFilter === "all" || tender.province === provinceFilter;

    return matchesSearch && matchesStatus && matchesProvince;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Active Tenders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse government tenders from municipalities across South Africa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            <Download className="h-4 w-4" />
            Export List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, reference, or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closing-soon">Closing Soon</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province === "all" ? "All Provinces" : province}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTenders.length} tender{filteredTenders.length !== 1 ? "s" : ""}
      </div>

      {/* Tenders list */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => (
          <TenderCard key={tender.id} tender={tender} />
        ))}

        {filteredTenders.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No tenders found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TenderCard({ tender }: { tender: (typeof TENDERS)[0] }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    open: { label: "Open", className: "bg-success/10 text-success border-success/20" },
    "closing-soon": { label: "Closing Soon", className: "bg-warning/10 text-warning border-warning/20" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
  };

  const status = statusConfig[tender.status] ?? statusConfig.closed;

  return (
    <div className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {tender.ref}
            </span>
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
            {tender.cidbGrade && (
              <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                CIDB {tender.cidbGrade}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary">
            {tender.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {tender.entity}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {tender.province}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Closes {formatDate(tender.closingDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              {formatZAR(tender.budget)}
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {tender.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            View Details
            <ChevronRight className="h-4 w-4" />
          </button>
          {tender.briefingDate && (
            <span className="text-xs text-muted-foreground">
              {tender.briefingType === "Mandatory" ? "Mandatory" : "Non-mandatory"} briefing: {formatDate(tender.briefingDate)}
            </span>
          )}
        </div>
      </div>
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