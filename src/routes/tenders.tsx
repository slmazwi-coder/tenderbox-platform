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
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle,
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

type StatusFilter = "all" | "open" | "closing-soon" | "closed";
type ViewMode = "list" | "detail";

interface TenderDetail {
  id: string;
  ref: string;
  title: string;
  entity: string;
  province: string;
  category: string;
  budget: number;
  closingDate: string;
  closingTime: string;
  briefingDate: string | null;
  briefingTime: string | null;
  briefingType: "Compulsory Physical Briefing" | "Virtual Briefing" | "No Briefing";
  briefingVenue: string | null;
  briefingLink: string | null;
  cidbGrade: string | null;
  status: "open" | "closing-soon" | "closed" | "awarded";
  description: string;
  scope: string;
  requirements: string[];
  submissionRequirements: string[];
}

const TENDER_DETAILS: Record<string, TenderDetail> = {
  "1": {
    id: "1",
    ref: "JHB-2026-014",
    title: "Stormwater Drainage System Upgrade - Alexandra Township",
    entity: "City of Johannesburg Metropolitan Municipality",
    province: "Gauteng",
    category: "Civil Engineering",
    budget: 48500000,
    closingDate: "2026-06-15",
    closingTime: "11:00 AM",
    briefingDate: "2026-05-28",
    briefingTime: "10:00 AM",
    briefingType: "Compulsory Physical Briefing",
    briefingVenue: "Johannesburg Civic Centre, Corner Braamfontein & Rissik St, Braamfontein",
    briefingLink: null,
    cidbGrade: "7CE",
    status: "open",
    description: "The City of Johannesburg Metropolitan Municipality invites experienced contractors to submit proposals for the upgrade and expansion of stormwater drainage infrastructure in Alexandra Township.",
    scope: "The project involves the construction of new stormwater drains, rehabilitation of existing drains, construction of catch pits and junction chambers, and associated earthworks.",
    requirements: [
      "Valid CIDB registration Grade 7CE or higher",
      "Minimum 3 similar completed projects",
      "Registered with CSD",
      "Valid SARS Tax Clearance Certificate",
      "BBBEE Level 1 or 2 certified contractor",
    ],
    submissionRequirements: [
      "Completed pricing schedule",
      "CIDB certificate of registration",
      "Company profile and experience",
      "Project methodology",
      "Key personnel CVs",
    ],
  },
  "2": {
    id: "2",
    ref: "ETH-2026-082",
    title: "Supply and Delivery of Medical Equipment - Regional Hospitals",
    entity: "eThekwini Metropolitan Municipality",
    province: "KwaZulu-Natal",
    category: "Medical Equipment",
    budget: 127500000,
    closingDate: "2026-06-22",
    closingTime: "11:00 AM",
    briefingDate: "2026-06-01",
    briefingTime: "09:00 AM",
    briefingType: "Compulsory Physical Briefing",
    briefingVenue: "eThekwini City Hall, Dr A.B Mqalo Hall, 1 Boria Avenue, Durban",
    briefingLink: null,
    cidbGrade: null,
    status: "open",
    description: "Supply, delivery, installation, and commissioning of medical equipment for regional hospitals within the eThekwini Metropolitan area.",
    scope: "Equipment includes diagnostic imaging systems, surgical equipment, patient monitoring systems, and hospital furniture for three regional hospitals.",
    requirements: [
      "ISO 13485 Medical Device Quality Management certification",
      "Valid supplier registration with SAHPRA",
      "Minimum 5 years experience in medical equipment supply",
      "Warranty and maintenance capability",
    ],
    submissionRequirements: [
      "Product specifications and catalogues",
      "Compliance certificates",
      "Maintenance proposal",
      "Delivery schedule",
    ],
  },
};

// Mock briefing attendance data
const BRIEFING_ATTENDANCE = [
  { no: 1, company: "Sizwe Construction (Pty) Ltd", attendee: "Thabo Mokoena", designation: "Managing Director", signIn: "2026-05-28T09:45:00", signOut: "2026-05-28T11:30:00", duration: "1h 45m", status: "Confirmed" },
  { no: 2, company: "Mega Civils JV", attendee: "Sarah Naidoo", designation: "Project Director", signIn: "2026-05-28T09:50:00", signOut: "2026-05-28T11:25:00", duration: "1h 35m", status: "Confirmed" },
  { no: 3, company: "Urban Infrastructure Partners", attendee: "John Smith", designation: "Site Engineer", signIn: "2026-05-28T09:55:00", signOut: "2026-05-28T11:20:00", duration: "1h 25m", status: "Confirmed" },
  { no: 4, company: "Coastal Construction Co", attendee: "Maria van Zyl", designation: "Contracts Manager", signIn: "2026-05-28T10:05:00", signOut: "2026-05-28T11:15:00", duration: "1h 10m", status: "Unverified" },
  { no: 5, company: "Highway Builders SA", attendee: "David Nkosi", designation: "Project Manager", signIn: "2026-05-28T10:00:00", signOut: "2026-05-28T11:30:00", duration: "1h 30m", status: "Confirmed" },
];

// Mock closing register data (for closed tenders)
const CLOSING_REGISTER = [
  { no: 1, company: "Sizwe Construction (Pty) Ltd", bidPrice: 47250000, submitTime: "2026-06-15T10:42:15", trackingId: "BID-JHB-2026-014-001" },
  { no: 2, company: "Mega Civils JV", bidPrice: 48500000, submitTime: "2026-06-15T10:15:33", trackingId: "BID-JHB-2026-014-002" },
  { no: 3, company: "Coastal Construction Co", bidPrice: 49120000, submitTime: "2026-06-15T09:58:47", trackingId: "BID-JHB-2026-014-003" },
  { no: 4, company: "Urban Infrastructure Partners", bidPrice: 51200000, submitTime: "2026-06-15T10:55:02", trackingId: "BID-JHB-2026-014-004" },
  { no: 5, company: "Highway Builders SA", bidPrice: 52350000, submitTime: "2026-06-15T10:33:28", trackingId: "BID-JHB-2026-014-005" },
];

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
    briefingType: "Compulsory Physical Briefing",
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
    briefingType: "Compulsory Physical Briefing",
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
    briefingType: "Virtual Briefing",
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
    briefingType: "No Briefing",
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
    briefingType: "Compulsory Physical Briefing",
    cidbGrade: "3ME",
    status: "open",
    description: "Installation of solar photovoltaic systems on municipal buildings across Nelson Mandela Bay.",
  },
];

type StatusFilter = "all" | "open" | "closing-soon" | "closed";
type ViewMode = "list" | "detail";
type DetailTab = "details" | "briefing" | "closing";

function TendersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("details");
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

  const selectedTender = selectedTenderId ? TENDERS.find((t) => t.id === selectedTenderId) : null;

  const handleViewDetails = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    setViewMode("detail");
    setDetailTab("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedTenderId(null);
  };

  if (viewMode === "detail" && selectedTender) {
    return (
      <TenderDetailView
        tender={selectedTender}
        detail={TENDER_DETAILS[selectedTender.id]}
        activeTab={detailTab}
        onTabChange={setDetailTab}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Open Tenders</h1>
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
          <TenderCard key={tender.id} tender={tender} onViewDetails={() => handleViewDetails(tender.id)} />
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

function TenderCard({ tender, onViewDetails }: { tender: (typeof TENDERS)[0]; onViewDetails: () => void }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    open: { label: "Open", className: "bg-success/10 text-success border-success/20" },
    "closing-soon": { label: "Closing Soon", className: "bg-warning/10 text-warning border-warning/20" },
    closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
  };

  const briefingConfig: Record<string, { label: string; className: string }> = {
    "Compulsory Physical Briefing": { label: "Compulsory Physical Briefing", className: "bg-warning/10 text-warning border-warning/20" },
    "Virtual Briefing": { label: "Virtual Briefing", className: "bg-primary/10 text-primary border-primary/20" },
    "No Briefing": { label: "No Briefing", className: "bg-muted text-muted-foreground border-border" },
  };

  const status = statusConfig[tender.status] ?? statusConfig.closed;
  const briefing = briefingConfig[tender.briefingType] ?? briefingConfig["No Briefing"];

  const getCountdown = () => {
    const closing = new Date(tender.closingDate);
    const now = new Date();
    const diff = closing.getTime() - now.getTime();
    
    if (diff <= 0) return { text: "Closed", urgent: false };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return { text: `Closes in ${days}d ${hours}h`, urgent: false };
    }
    if (hours > 0) {
      return { text: `Closes in ${hours}h ${minutes}m`, urgent: hours < 24 };
    }
    return { text: `Closes in ${minutes}m`, urgent: true };
  };

  const countdown = getCountdown();

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground">
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

          <h3 className="mt-3 text-lg font-semibold text-foreground">
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
              <DollarSign className="h-4 w-4" />
              {formatZAR(tender.budget)}
            </span>
            <span className={`inline-flex items-center gap-1.5 ${countdown.urgent ? "text-danger font-medium" : ""}`}>
              <Clock className={`h-4 w-4 ${countdown.urgent ? "text-danger" : ""}`} />
              {countdown.text}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${briefing.className}`}>
              {briefing.label}
            </span>
            {tender.briefingDate && (
              <span className="text-xs text-muted-foreground">
                Briefing: {formatDate(tender.briefingDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={onViewDetails}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Tender
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TenderDetailView({
  tender,
  detail,
  activeTab,
  onTabChange,
  onBack,
}: {
  tender: (typeof TENDERS)[0];
  detail: TenderDetail | undefined;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onBack: () => void;
}) {
  const tabs = [
    { id: "details" as DetailTab, label: "Tender Details" },
    { id: "briefing" as DetailTab, label: "Briefing Register" },
    { id: "closing" as DetailTab, label: "Closing Register" },
  ];

  const showClosingRegister = tender.status === "closed" || tender.status === "awarded";

  const filteredTabs = tabs.filter((tab) => {
    if (tab.id === "closing") return showClosingRegister;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Tenders
      </button>

      {/* Tender header */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-bold text-foreground">{tender.ref}</span>
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                tender.status === "open" ? "bg-success/10 text-success border-success/20" :
                tender.status === "closing-soon" ? "bg-warning/10 text-warning border-warning/20" :
                "bg-muted text-muted-foreground border-border"
              }`}>
                {tender.status === "open" ? "Open" : tender.status === "closing-soon" ? "Closing Soon" : "Closed"}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{tender.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{tender.entity} · {tender.province}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Budget</div>
            <div className="text-xl font-bold text-foreground">{formatZAR(tender.budget)}</div>
            <div className="text-sm text-muted-foreground">Closing: {formatDate(tender.closingDate)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={[
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "details" && (
        <TenderDetailsTab tender={tender} detail={detail} />
      )}
      {activeTab === "briefing" && (
        <BriefingRegister tender={tender} />
      )}
      {activeTab === "closing" && (
        <ClosingRegister tender={tender} />
      )}
    </div>
  );
}

function TenderDetailsTab({ tender, detail }: { tender: (typeof TENDERS)[0]; detail: TenderDetail | undefined }) {
  return (
    <div className="space-y-6">
      {/* Main info */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Tender Description</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {detail?.description || tender.description}
        </p>

        {detail?.scope && (
          <>
            <h3 className="mt-6 text-sm font-semibold text-foreground">Scope of Work</h3>
            <p className="mt-2 text-sm text-muted-foreground">{detail.scope}</p>
          </>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</div>
            <div className="mt-1 text-sm font-medium text-foreground">{tender.category}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Province</div>
            <div className="mt-1 text-sm font-medium text-foreground">{tender.province}</div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Closing Date</div>
            <div className="mt-1 text-sm font-medium text-foreground">{formatDate(tender.closingDate)}</div>
          </div>
          {tender.cidbGrade && (
            <div className="rounded-md border border-border bg-muted/30 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CIDB Grade Required</div>
              <div className="mt-1 text-sm font-medium text-foreground">Grade {tender.cidbGrade}</div>
            </div>
          )}
        </div>
      </div>

      {/* Briefing details */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Briefing Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Briefing Type</div>
            <div className={`mt-1 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
              tender.briefingType === "Compulsory Physical Briefing" ? "bg-warning/10 text-warning border-warning/20" :
              tender.briefingType === "Virtual Briefing" ? "bg-primary/10 text-primary border-primary/20" :
              "bg-muted text-muted-foreground border-border"
            }`}>
              {tender.briefingType}
            </div>
          </div>
          {tender.briefingDate && (
            <div className="rounded-md border border-border bg-muted/30 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Briefing Date</div>
              <div className="mt-1 text-sm font-medium text-foreground">{formatDate(tender.briefingDate)}</div>
            </div>
          )}
          {detail?.briefingVenue && (
            <div className="rounded-md border border-border bg-muted/30 p-4 sm:col-span-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Venue</div>
              <div className="mt-1 text-sm font-medium text-foreground">{detail.briefingVenue}</div>
            </div>
          )}
        </div>
      </div>

      {/* Requirements */}
      {detail?.requirements && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Tender Requirements</h2>
          <ul className="mt-4 space-y-2">
            {detail.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="mt-0.5 h-4 w-4 text-success shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission requirements */}
      {detail?.submissionRequirements && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Submission Requirements</h2>
          <ul className="mt-4 space-y-2">
            {detail.submissionRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Download className="h-4 w-4" />
          Download Tender Document
        </button>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Submit Bid
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function BriefingRegister({ tender }: { tender: (typeof TENDERS)[0] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Compulsory Briefing Attendance Register</h2>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Tender Ref: </span>
              <span className="font-medium">{tender.ref}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Briefing Date: </span>
              <span className="font-medium">{tender.briefingDate ? formatDate(tender.briefingDate) : "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">No.</th>
                <th className="px-6 py-3 font-medium">Company Name</th>
                <th className="px-6 py-3 font-medium">Attendee Name</th>
                <th className="px-6 py-3 font-medium">Designation</th>
                <th className="px-6 py-3 font-medium">Sign-in Time</th>
                <th className="px-6 py-3 font-medium">Sign-out Time</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {BRIEFING_ATTENDANCE.map((row, i) => (
                <tr key={row.no} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-3">{row.no}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{row.company}</td>
                  <td className="px-6 py-3 text-muted-foreground">{row.attendee}</td>
                  <td className="px-6 py-3 text-muted-foreground">{row.designation}</td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{formatDateTime(row.signIn)}</td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{formatDateTime(row.signOut)}</td>
                  <td className="px-6 py-3 text-muted-foreground">{row.duration}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                      row.status === "Confirmed"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border bg-warning/5 px-6 py-4">
          <p className="text-sm text-warning">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            <strong>Note:</strong> This register is publicly accessible for transparency. Contractors who did not attend are not eligible to submit bids.
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
        <Download className="h-4 w-4" />
        Export to PDF
      </button>
    </div>
  );
}

function ClosingRegister({ tender }: { tender: (typeof TENDERS)[0] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Tender Closing Register</h2>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Tender Ref: </span>
              <span className="font-medium">{tender.ref}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Closing Date: </span>
              <span className="font-medium">{formatDate(tender.closingDate)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Closing Time: </span>
              <span className="font-medium">11:00 AM</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Bids: </span>
              <span className="font-medium">{CLOSING_REGISTER.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">No.</th>
                <th className="px-6 py-3 font-medium">Company Name</th>
                <th className="px-6 py-3 font-medium">Total Bid Price (ZAR)</th>
                <th className="px-6 py-3 font-medium">Submission Time</th>
                <th className="px-6 py-3 font-medium">Tracking ID</th>
              </tr>
            </thead>
            <tbody>
              {CLOSING_REGISTER.sort((a, b) => a.bidPrice - b.bidPrice).map((row, i) => (
                <tr key={row.no} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-3">{row.no}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{row.company}</td>
                  <td className="px-6 py-3 font-mono font-medium text-foreground">{formatZAR(row.bidPrice)}</td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{formatDateTime(row.submitTime)}</td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{row.trackingId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border bg-success/5 px-6 py-4">
          <p className="text-sm text-success">
            <CheckCircle className="inline h-4 w-4 mr-1" />
            <strong>Note:</strong> This register was auto-generated at the closing time and is publicly accessible. Bid prices are published in accordance with transparency requirements.
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
        <Download className="h-4 w-4" />
        Export to PDF
      </button>
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