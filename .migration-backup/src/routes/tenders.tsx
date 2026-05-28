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
type DetailTab = "details" | "briefing" | "closing";

// Step 7: Updated realistic demo data
const TENDERS = [
  {
    id: "1",
    ref: "TBX-2025-0047",
    title: "Upgrading of Matatiele Access Roads Phase 2",
    entity: "Matatiele Local Municipality",
    province: "Eastern Cape",
    category: "Civil — Roads",
    budget: 8450000,
    closingDate: getFutureDate(14),
    briefingDate: getPastDate(21),
    briefingType: "Compulsory Physical Briefing",
    cidbGrade: "5CE",
    status: "open" as const,
    description: "Phase 2 of the Matatiele access roads upgrading project covering 12km of rural road rehabilitation.",
  },
  {
    id: "2",
    ref: "TBX-2025-0051",
    title: "Construction of Community Hall — Ward 7 Emalahleni",
    entity: "Emalahleni Local Municipality",
    province: "Eastern Cape",
    category: "Building",
    budget: 3200000,
    closingDate: getFutureDate(7),
    briefingDate: getPastDate(14),
    briefingType: "Virtual Briefing",
    cidbGrade: "4GB",
    status: "closing-soon" as const,
    description: "Construction of a new community hall including ablution facilities, kitchen, and parking area.",
  },
  {
    id: "3",
    ref: "TBX-2025-0039",
    title: "Installation of Water Reticulation Network — Phase 3",
    entity: "OR Tambo District Municipality",
    province: "Eastern Cape",
    category: "Civil — Water",
    budget: 14750000,
    closingDate: getPastDate(5),
    briefingDate: getPastDate(28),
    briefingType: "Compulsory Physical Briefing",
    cidbGrade: "6CE",
    status: "closed" as const,
    description: "Phase 3 water reticulation network covering 5 villages in the OR Tambo district.",
  },
  {
    id: "4",
    ref: "TBX-2025-0031",
    title: "Rehabilitation of Stormwater Drainage System",
    entity: "Amathole District Municipality",
    province: "Eastern Cape",
    category: "Civil",
    budget: 6890000,
    closingDate: getPastDate(30),
    briefingDate: getPastDate(45),
    briefingType: "Compulsory Physical Briefing",
    cidbGrade: "5CE",
    status: "awarded" as const,
    description: "Stormwater drainage rehabilitation in select urban areas within Amathole district.",
  },
];

// Mock briefing attendance for Tender 1
const BRIEFING_ATTENDANCE_1 = [
  { no: 1, company: "Sizwe Construction (Pty) Ltd", attendee: "Thabo Mokoena", designation: "Managing Director", signIn: "2026-05-07T09:45:00", signOut: "2026-05-07T11:30:00", duration: "1h 45m", status: "Confirmed" },
  { no: 2, company: "Mokoena Infrastructure Group", attendee: "Sarah Naidoo", designation: "Project Director", signIn: "2026-05-07T09:50:00", signOut: "2026-05-07T11:25:00", duration: "1h 35m", status: "Confirmed" },
  { no: 3, company: "Ntuli Civil Works CC", attendee: "John Ntuli", designation: "Site Engineer", signIn: "2026-05-07T10:05:00", signOut: "2026-05-07T11:20:00", duration: "1h 15m", status: "Unverified" },
  { no: 4, company: "Khoza Engineering", attendee: "Maria Khoza", designation: "Contracts Manager", signIn: "2026-05-07T09:55:00", signOut: "2026-05-07T11:30:00", duration: "1h 35m", status: "Confirmed" },
];

// Step 7: Closing register for Tender 3 - shows bids in order
const CLOSING_REGISTER_3 = [
  { no: 1, company: "Sizwe Construction (Pty) Ltd", bidPrice: 13450000, submitTime: "2026-05-15T10:42:15", trackingId: "BID-TBX-2025-0039-001" },
  { no: 2, company: "Mokoena Infrastructure", bidPrice: 14200000, submitTime: "2026-05-15T09:28:33", trackingId: "BID-TBX-2025-0039-002" },
  { no: 3, company: "Ntuli Civil Works", bidPrice: 11900000, submitTime: "2026-05-15T10:15:47", trackingId: "BID-TBX-2025-0039-003" },
  { no: 4, company: "Khoza Engineering", bidPrice: 15100000, submitTime: "2026-05-15T08:55:02", trackingId: "BID-TBX-2025-0039-004" },
  { no: 5, company: "Ndaba Projects", bidPrice: 14890000, submitTime: "2026-05-15T10:33:28", trackingId: "BID-TBX-2025-0039-005" },
  { no: 6, company: "Dlamini Civils", bidPrice: 13750000, submitTime: "2026-05-15T11:02:44", trackingId: "BID-TBX-2025-0039-006" },
  { no: 7, company: "Ubuntu Infrastructure", bidPrice: 16200000, submitTime: "2026-05-15T09:44:18", trackingId: "BID-TBX-2025-0039-007" },
];

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
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Download className="h-4 w-4" />
          Export List
        </button>
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
    awarded: { label: "Awarded", className: "bg-primary/10 text-primary border-primary/20" },
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
    
    if (days > 0) {
      return { text: `Closes in ${days}d ${hours}h`, urgent: days <= 3 };
    }
    return { text: `Closes in ${hours}h`, urgent: true };
  };

  const countdown = getCountdown();

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground">{tender.ref}</span>
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
            {tender.cidbGrade && (
              <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                CIDB {tender.cidbGrade}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-foreground">{tender.title}</h3>

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
  activeTab,
  onTabChange,
  onBack,
}: {
  tender: (typeof TENDERS)[0];
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onBack: () => void;
}) {
  const showClosingRegister = tender.status === "closed" || tender.status === "awarded";

  const tabs = [
    { id: "details" as DetailTab, label: "Tender Details" },
    { id: "briefing" as DetailTab, label: "Briefing Register" },
    { id: "closing" as DetailTab, label: "Closing Register", condition: showClosingRegister },
  ].filter(t => t.condition !== false);

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
                tender.status === "awarded" ? "bg-primary/10 text-primary border-primary/20" :
                "bg-muted text-muted-foreground border-border"
              }`}>
                {tender.status === "open" ? "Open" : tender.status === "closing-soon" ? "Closing Soon" : tender.status === "awarded" ? "Awarded" : "Closed"}
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
          {tabs.map((tab) => (
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
      {activeTab === "details" && <TenderDetailsTab tender={tender} />}
      {activeTab === "briefing" && <BriefingRegister tender={tender} />}
      {activeTab === "closing" && <ClosingRegister tender={tender} />}
    </div>
  );
}

function TenderDetailsTab({ tender }: { tender: (typeof TENDERS)[0] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Tender Description</h2>
        <p className="mt-2 text-sm text-muted-foreground">{tender.description}</p>

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
        </div>
      </div>

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
              {BRIEFING_ATTENDANCE_1.map((row, i) => (
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
              <span className="font-medium">{CLOSING_REGISTER_3.length}</span>
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
              {CLOSING_REGISTER_3.sort((a, b) => a.bidPrice - b.bidPrice).map((row, i) => (
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

// Helper functions
function getFutureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function getPastDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
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