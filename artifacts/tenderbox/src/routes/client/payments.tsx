import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Fingerprint, Loader2, Lock, AlertTriangle, 
  FileText, X, Printer, ChevronDown, ChevronUp, CheckSquare, Square,
  Image, Calendar, Users, BarChart3, ExternalLink } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/payments")({ component: GuardedPaymentsPage });

const CLIENT_ROLES = ["client_entity"];

// ============================================================
// MOCK DATA - Full Payment Certificate
// ============================================================

const CERTIFICATE_DATA = {
  header: {
    certNumber: "PC-2025-047-003",
    tenderRef: "TBX-2025-0047",
    projectName: "Rehabilitation of Stormwater Drainage System — Amathole District",
    contractor: "Sizwe Construction (Pty) Ltd",
    contractorReg: "2015/123456/07",
    principalAgent: "Arch. S. Pillay",
    paFirm: "Pillay & Associates Architects",
    qsName: "Eng. D. Maphumulo",
    qsFirm: "Maphumulo Quantity Surveyors",
    certificateNumber: 3,
    periodFrom: "01 May 2026",
    periodTo: "31 May 2026",
    dateIssued: "05 June 2026",
    commencementDate: "15 January 2025",
    originalContractSum: 12450000,
    currentContractSum: 12890000,
  },
  summary: {
    grossAmount: 1245000,
    retentionRate: 10,
    retentionAmount: 124500,
    netAmount: 1120500,
    vatRate: 15,
    vatAmount: 168075,
    totalPayable: 1288575,
  },
  measurementItems: [
    { billNo: "1.1", description: "Site establishment and preliminaries", unit: "month", qtyThis: 1, rate: 85000, amountThis: 85000, qtyCum: 17, amountCum: 1445000 },
    { billNo: "2.1", description: "Excavation for stormwater channels", unit: "m³", qtyThis: 245, rate: 285, amountThis: 69825, qtyCum: 1820, amountCum: 518700 },
    { billNo: "2.2", description: "Bedding and haunching material", unit: "m³", qtyThis: 78, rate: 420, amountThis: 32760, qtyCum: 540, amountCum: 226800 },
    { billNo: "2.3", description: "Supply and lay concrete channel base", unit: "m³", qtyThis: 45, rate: 1850, amountThis: 83250, qtyCum: 320, amountCum: 592000 },
    { billNo: "3.1", description: "Supply and install 600mm diameter uPVC pipe", unit: "m", qtyThis: 180, rate: 920, amountThis: 165600, qtyCum: 890, amountCum: 818800 },
    { billNo: "3.2", description: "Supply and install 450mm diameter uPVC pipe", unit: "m", qtyThis: 120, rate: 680, amountThis: 81600, qtyCum: 650, amountCum: 442000 },
    { billNo: "4.1", description: "Precast concrete headwalls", unit: "no", qtyThis: 8, rate: 4500, amountThis: 36000, qtyCum: 24, amountCum: 108000 },
    { billNo: "4.2", description: "Masonry wingwalls and aprons", unit: "m³", qtyThis: 18, rate: 2100, amountThis: 37800, qtyCum: 45, amountCum: 94500 },
    { billNo: "5.1", description: "Subsoil drainage behind retaining walls", unit: "m", qtyThis: 95, rate: 380, amountThis: 36100, qtyCum: 420, amountCum: 159600 },
    { billNo: "6.1", description: "Backfill and compaction", unit: "m³", qtyThis: 320, rate: 180, amountThis: 57600, qtyCum: 1890, amountCum: 340200 },
    { billNo: "7.1", description: "Concrete safety barriers", unit: "m", qtyThis: 60, rate: 650, amountThis: 39000, qtyCum: 280, amountCum: 182000 },
    { billNo: "8.1", description: "Site rehabilitation and landscaping", unit: "sum", qtyThis: 0, rate: 0, amountThis: 0, qtyCum: 1, amountCum: 95000 },
  ],
  variationOrders: [
    { voNo: "VO-001", description: "Additional rock excavation in Sections 2-4 due to unforeseen hard material", approvedAmount: 185000, amountThisPeriod: 185000, authorisedBy: "Mr. T. Mokoena", dateApproved: "2026-04-15" },
    { voNo: "VO-002", description: "Extended pipe bedding scope to accommodate changed ground conditions", approvedAmount: 72000, amountThisPeriod: 72000, authorisedBy: "Mr. T. Mokoena", dateApproved: "2026-04-22" },
  ],
  runningAccount: [
    { certNo: "PC-2025-047-001", period: "Jan 2026", gross: 1650000, retention: 165000, net: 1485000, datePaid: "2026-02-12", daysTaken: 18, status: "paid" },
    { certNo: "PC-2025-047-002", period: "Feb-Mar 2026", gross: 2150000, retention: 215000, net: 1935000, datePaid: "2026-04-08", daysTaken: 16, status: "paid" },
    { certNo: "PC-2025-047-003", period: "Apr 2026", gross: 1950000, retention: 195000, net: 1755000, datePaid: "2026-05-08", daysTaken: 20, status: "paid" },
    { certNo: "PC-2025-047-004 (this)", period: "May 2026", gross: 1245000, retention: 124500, net: 1120500, datePaid: null, daysTaken: null, status: "pending" },
  ],
  retention: {
    accumulated: 599500,
    released: 0,
    balance: 599500,
  },
  supportingEvidence: {
    siteDiaries: [
      { date: "2026-05-02", summary: "Site establishment complete. Excavation crew mobilized. Weather: Clear" },
      { date: "2026-05-05", summary: "Excavation ongoing Section 2. Hard rock encountered at depth 1.2m — VO initiated" },
      { date: "2026-05-08", summary: "Pipe laying commenced Section 3. Bedding material placement verified by QS" },
      { date: "2026-05-12", summary: "Heavy rainfall — no work. Site protected and drainage maintained" },
      { date: "2026-05-15", summary: "Concrete pour for headwalls HW-12 to HW-15. Slump test passed" },
      { date: "2026-05-19", summary: "Backfill and compaction Section 4. Density tests completed — all pass" },
      { date: "2026-05-22", summary: "Safety barrier installation commenced. Line and level confirmed" },
      { date: "2026-05-26", summary: "Site walk with PA and QS for measurement. All works verified" },
      { date: "2026-05-29", summary: "Final clean-up and preparation for handover of Section 3" },
    ],
    photographs: [
      { id: 1, caption: "Excavation in progress - Section 2", date: "2026-05-05" },
      { id: 2, caption: "Hard rock encountered - VO documentation", date: "2026-05-05" },
      { id: 3, caption: "Pipe laying - Section 3 alignment", date: "2026-05-08" },
      { id: 4, caption: "Bedding material placement and compaction", date: "2026-05-10" },
      { id: 5, caption: "Concrete pour - headwalls HW-12", date: "2026-05-15" },
      { id: 6, caption: "Slump test documentation", date: "2026-05-15" },
      { id: 7, caption: "Backfill and compaction - density testing", date: "2026-05-19" },
      { id: 8, caption: "Safety barrier installation", date: "2026-05-22" },
      { id: 9, caption: "Section 3 progress - pre-handover inspection", date: "2026-05-26" },
    ],
    attendanceRegister: { period: "May 2026", totalDays: 22, avgAttendance: 94 },
    programmeProgress: {
      planned: 85,
      actual: 82,
      note: "Minor delay due to VO-001 rock excavation - recovery programme approved",
    },
  },
};

type SignatoryRole = "qs" | "pa" | "pm" | "pmu" | "cfo" | "mm";
interface Signatory {
  role: SignatoryRole;
  name: string;
  registration?: string;
  firm?: string;
  status: "signed" | "pending" | "awaiting";
  signedAt?: string;
}

const SIGNATORIES: Signatory[] = [
  { role: "qs", name: "Eng. D. Maphumulo", registration: "SACPCMP 2019/4567", firm: "Maphumulo Quantity Surveyors", status: "signed", signedAt: "2026-05-20T10:30:00" },
  { role: "pa", name: "Arch. S. Pillay", firm: "Pillay & Associates Architects", status: "signed", signedAt: "2026-05-22T14:15:00" },
  { role: "pm", name: "Mr. T. Mokoena", status: "signed", signedAt: "2026-05-24T11:45:00" },
  { role: "pmu", name: "Ms. B. Khumalo", status: "pending" },
  { role: "cfo", name: "Mr. R. van Wyk", status: "awaiting" },
  { role: "mm", name: "Mr. K. Ndlovu", status: "awaiting" },
];

const DECLARATIONS: Record<SignatoryRole, string> = {
  qs: `I, [name], registered as [SACPCMP registration] confirm that I have physically measured the works described in this certificate and that the quantities, rates and amounts are accurate to the best of my professional knowledge and belief. Measurement was conducted in accordance with the applicable standard method of measurement.`,
  pa: `I, [name], as Principal Agent on this contract, certify that the works described in this certificate have been executed in accordance with the contract documents and that the amounts stated are properly due and payable to the contractor.`,
  pm: `I, [name], as Client Project Manager, confirm that this payment certificate is consistent with the bi-weekly progress reports, daily site diary records, and site inspection reports for the measurement period. The certified work corresponds to observed and recorded progress.`,
  pmu: `I, [name], as Project Management Unit Manager, confirm that the certified amount is within the approved cash flow projection for this period and that no unresolved compliance issues exist that would affect this payment.`,
  cfo: `I, [name], as Chief Financial Officer, confirm that funds in the amount of [net amount] are available and ring-fenced in the project escrow account for this payment and that the payment is within the approved project budget.`,
  mm: `I, [name], as Accounting Officer of [municipality], confirm that this payment certificate has been properly compiled, certified, and reviewed through the full approval chain. I authorise the release of [total including VAT] to [contractor] in settlement of payment certificate number [number] for the period ending [date].`,
};

const ROLE_LABELS: Record<SignatoryRole, string> = {
  qs: "Quantity Surveyor",
  pa: "Principal Agent",
  pm: "Project Manager",
  pmu: "PMU Manager",
  cfo: "Chief Financial Officer",
  mm: "Municipal Manager",
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2nd" });
}

// ============================================================
// COMPONENTS
// ============================================================

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b-2 border-primary/30 pb-2 mb-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-primary">{title}</h3>
    </div>
  );
}

function DataRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-muted/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-foreground font-bold" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

// ============================================================
// PAYMENT CERTIFICATE DOCUMENT
// ============================================================

function PaymentCertificateDocument({ 
  onSign, signingRole, confirmedRoles, onConfirm, signatories 
}: { 
  onSign: (role: SignatoryRole) => void; 
  signingRole: SignatoryRole | null;
  confirmedRoles: Set<SignatoryRole>;
  onConfirm: (role: SignatoryRole) => void;
  signatories: Signatory[];
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>("all");
  
  const currentSignatoryOrder: SignatoryRole[] = ["qs", "pa", "pm", "pmu", "cfo", "mm"];
  const currentRole = currentSignatoryOrder.find(role => 
    signatories.find(s => s.role === role)?.status === "pending"
  );
  const canSign = signingRole === null && confirmedRoles.has(signingRole || "pmu");
  
  const runningTotals = CERTIFICATE_DATA.runningAccount.reduce(
    (acc, cert) => ({
      gross: acc.gross + cert.gross,
      retention: acc.retention + cert.retention,
      net: acc.net + cert.net,
    }),
    { gross: 0, retention: 0, net: 0 }
  );
  
  const pctExpended = ((runningTotals.gross + CERTIFICATE_DATA.summary.grossAmount) / CERTIFICATE_DATA.header.currentContractSum) * 100;
  
  return (
    <div className="space-y-8">
      {/* Document Header */}
      <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Printer className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">PAYMENT CERTIFICATE</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {CERTIFICATE_DATA.header.projectName}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Certificate {CERTIFICATE_DATA.header.certificateNumber} of {formatDate(CERTIFICATE_DATA.header.dateIssued)}
        </p>
      </div>
      
      {/* Section 1: Certificate Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="CERTIFICATE HEADER" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <DataRow label="Project Name" value={CERTIFICATE_DATA.header.projectName} />
          <DataRow label="Contract Number" value={CERTIFICATE_DATA.header.tenderRef} />
          <DataRow label="Contractor" value={CERTIFICATE_DATA.header.contractor} />
          <DataRow label="Registration No." value={CERTIFICATE_DATA.header.contractorReg} />
          <DataRow label="Principal Agent" value={`${CERTIFICATE_DATA.header.principalAgent}, ${CERTIFICATE_DATA.header.paFirm}`} />
          <DataRow label="QS Name & Firm" value={`${CERTIFICATE_DATA.header.qsName}, ${CERTIFICATE_DATA.header.qsFirm}`} />
          <DataRow label="Certificate Number" value={`${CERTIFICATE_DATA.header.certificateNumber}`} />
          <DataRow label="Period of Measurement" value={`${CERTIFICATE_DATA.header.periodFrom} to ${CERTIFICATE_DATA.header.periodTo}`} />
          <DataRow label="Date of Issue" value={formatDate(CERTIFICATE_DATA.header.dateIssued)} />
          <DataRow label="Contract Commencement" value={formatDate(CERTIFICATE_DATA.header.commencementDate)} />
          <DataRow label="Original Contract Sum" value={formatZAR(CERTIFICATE_DATA.header.originalContractSum)} />
          <DataRow label="Current Contract Sum" value={formatZAR(CERTIFICATE_DATA.header.currentContractSum)} highlight />
        </div>
      </div>
      
      {/* Section 2: Summary of This Certificate */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="SUMMARY OF THIS CERTIFICATE" />
        <div className="space-y-1 text-sm">
          <DataRow label="Gross Amount Certified This Period" value={formatZAR(CERTIFICATE_DATA.summary.grossAmount)} />
          <DataRow label={`Retention Deducted (${CERTIFICATE_DATA.summary.retentionRate}%)`} value={formatZAR(CERTIFICATE_DATA.summary.retentionAmount)} />
          <DataRow label="Net Amount Due This Period" value={formatZAR(CERTIFICATE_DATA.summary.netAmount)} />
          <DataRow label={`VAT at ${CERTIFICATE_DATA.summary.vatRate}%`} value={formatZAR(CERTIFICATE_DATA.summary.vatAmount)} />
          <div className="mt-3 pt-3 border-t-2 border-primary/20">
            <DataRow label="TOTAL AMOUNT PAYABLE INCLUDING VAT" value={formatZAR(CERTIFICATE_DATA.summary.totalPayable)} highlight />
          </div>
        </div>
      </div>
      
      {/* Section 3: Detailed Measurement Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="DETAILED MEASUREMENT BREAKDOWN" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Bill No.</th>
                <th className="px-3 py-2 text-left font-medium">Description</th>
                <th className="px-3 py-2 text-center font-medium">Unit</th>
                <th className="px-3 py-2 text-right font-medium">Qty This</th>
                <th className="px-3 py-2 text-right font-medium">Rate (ZAR)</th>
                <th className="px-3 py-2 text-right font-medium">Amount This</th>
                <th className="px-3 py-2 text-right font-medium">Cum. Qty</th>
                <th className="px-3 py-2 text-right font-medium">Cum. Amount</th>
              </tr>
            </thead>
            <tbody>
              {CERTIFICATE_DATA.measurementItems.map((item, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-3 py-2 font-mono">{item.billNo}</td>
                  <td className="px-3 py-2">{item.description}</td>
                  <td className="px-3 py-2 text-center">{item.unit}</td>
                  <td className="px-3 py-2 text-right">{item.qtyThis > 0 ? item.qtyThis.toLocaleString() : "—"}</td>
                  <td className="px-3 py-2 text-right">{item.rate > 0 ? formatZAR(item.rate) : "—"}</td>
                  <td className="px-3 py-2 text-right font-medium">{item.amountThis > 0 ? formatZAR(item.amountThis) : "—"}</td>
                  <td className="px-3 py-2 text-right">{item.qtyCum.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">{formatZAR(item.amountCum)}</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-semibold">
                <td colSpan={5} className="px-3 py-2">TOTAL THIS CERTIFICATE</td>
                <td className="px-3 py-2 text-right">{formatZAR(CERTIFICATE_DATA.summary.grossAmount)}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Section 4: Variation Orders */}
      {CERTIFICATE_DATA.variationOrders.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <SectionHeader title="VARIATION ORDERS INCLUDED THIS PERIOD" />
          <table className="w-full text-xs">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-3 py-2 text-left font-medium">VO No.</th>
                <th className="px-3 py-2 text-left font-medium">Description</th>
                <th className="px-3 py-2 text-right font-medium">Approved (ZAR)</th>
                <th className="px-3 py-2 text-right font-medium">This Period</th>
                <th className="px-3 py-2 text-left font-medium">Authorised By</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {CERTIFICATE_DATA.variationOrders.map((vo, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-3 py-2 font-mono">{vo.voNo}</td>
                  <td className="px-3 py-2">{vo.description}</td>
                  <td className="px-3 py-2 text-right">{formatZAR(vo.approvedAmount)}</td>
                  <td className="px-3 py-2 text-right">{formatZAR(vo.amountThisPeriod)}</td>
                  <td className="px-3 py-2">{vo.authorisedBy}</td>
                  <td className="px-3 py-2">{formatDate(vo.dateApproved)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Section 5: Running Account Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="RUNNING ACCOUNT SUMMARY" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Cert No.</th>
                <th className="px-3 py-2 text-left font-medium">Period</th>
                <th className="px-3 py-2 text-right font-medium">Gross (ZAR)</th>
                <th className="px-3 py-2 text-right font-medium">Retention (ZAR)</th>
                <th className="px-3 py-2 text-right font-medium">Net (ZAR)</th>
                <th className="px-3 py-2 text-left font-medium">Date Paid</th>
                <th className="px-3 py-2 text-center font-medium">Days</th>
                <th className="px-3 py-2 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {CERTIFICATE_DATA.runningAccount.map((cert, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-3 py-2 font-mono">{cert.certNo}</td>
                  <td className="px-3 py-2">{cert.period}</td>
                  <td className="px-3 py-2 text-right">{formatZAR(cert.gross)}</td>
                  <td className="px-3 py-2 text-right">{formatZAR(cert.retention)}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatZAR(cert.net)}</td>
                  <td className="px-3 py-2">{cert.datePaid ? formatDate(cert.datePaid) : "—"}</td>
                  <td className="px-3 py-2 text-center">{cert.daysTaken || "—"}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${cert.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {cert.status}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-semibold">
                <td colSpan={2} className="px-3 py-2">RUNNING TOTALS</td>
                <td className="px-3 py-2 text-right">{formatZAR(runningTotals.gross)}</td>
                <td className="px-3 py-2 text-right">{formatZAR(runningTotals.retention)}</td>
                <td className="px-3 py-2 text-right">{formatZAR(runningTotals.net)}</td>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Percentage of Contract Sum Expended</span>
            <span className="font-bold text-primary">{pctExpended.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, pctExpended)}%` }} />
          </div>
        </div>
      </div>
      
      {/* Section 6: Retention Account */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="RETENTION ACCOUNT" />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Retention Accumulated to Date</p>
            <p className="text-lg font-bold text-foreground">{formatZAR(CERTIFICATE_DATA.retention.accumulated)}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Retention Released to Date</p>
            <p className="text-lg font-bold text-muted-foreground">{formatZAR(CERTIFICATE_DATA.retention.released)}</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg col-span-2">
            <p className="text-xs text-muted-foreground">Current Retention Balance</p>
            <p className="text-xl font-bold text-primary">{formatZAR(CERTIFICATE_DATA.retention.balance)}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
          <p className="font-medium text-foreground">Retention Release Triggers</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• 50% at practical completion certificate issued</li>
            <li>• 50% at end of defects liability period (DLP)</li>
          </ul>
        </div>
      </div>
      
      {/* Section 7: Supporting Evidence */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="SUPPORTING EVIDENCE" />
        
        {/* Site Diaries */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Daily Site Diary Entries</span>
            </div>
            <span className="text-xs text-muted-foreground">{CERTIFICATE_DATA.supportingEvidence.siteDiaries.length} entries</span>
          </div>
          <div className="space-y-1">
            {CERTIFICATE_DATA.supportingEvidence.siteDiaries.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded text-xs">
                <span className="font-mono text-muted-foreground w-24">{entry.date}</span>
                <span className="text-foreground flex-1">{entry.summary}</span>
                <button className="text-primary hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Site Photographs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Site Photographs</span>
            </div>
            <span className="text-xs text-muted-foreground">{CERTIFICATE_DATA.supportingEvidence.photographs.length} photos</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {CERTIFICATE_DATA.supportingEvidence.photographs.map((photo, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                <div className="text-center p-2">
                  <div className="text-xs text-muted-foreground">{photo.date}</div>
                  <div className="text-[10px] text-foreground mt-1 truncate">{photo.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Attendance Register */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Attendance Register</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Period: {CERTIFICATE_DATA.supportingEvidence.attendanceRegister.period}</span>
              <span className="text-xs text-muted-foreground">{CERTIFICATE_DATA.supportingEvidence.attendanceRegister.totalDays} days, {CERTIFICATE_DATA.supportingEvidence.attendanceRegister.avgAttendance}% avg attendance</span>
              <button className="text-xs text-primary hover:underline">Open</button>
            </div>
          </div>
        </div>
        
        {/* Programme Progress */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Programme Progress</span>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Planned vs Actual Progress</span>
              <span className="text-sm font-medium">{CERTIFICATE_DATA.supportingEvidence.programmeProgress.actual}% / {CERTIFICATE_DATA.supportingEvidence.programmeProgress.planned}%</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Planned</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${CERTIFICATE_DATA.supportingEvidence.programmeProgress.planned}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Actual</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: `${CERTIFICATE_DATA.supportingEvidence.programmeProgress.actual}%` }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{CERTIFICATE_DATA.supportingEvidence.programmeProgress.note}</p>
          </div>
        </div>
      </div>
      
      {/* Section 8: Signatory Declarations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader title="SIGNATORY DECLARATIONS" />
        
        {signatories.map((signatory, idx) => {
          const isCurrentUser = signatory.role === currentRole;
          const canUserSign = isCurrentUser && !signingRole;
          const isConfirmed = confirmedRoles.has(signatory.role);
          
          return (
            <div key={signatory.role} className={`mb-6 p-4 rounded-lg border ${
              signatory.status === "signed" ? "border-success/20 bg-success/5" 
                : canUserSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    signatory.status === "signed" ? "bg-success/20 text-success" 
                      : canUserSign ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {signatory.status === "signed" 
                      ? <CheckCircle className="h-4 w-4" />
                      : canUserSign ? <Clock className="h-4 w-4" />
                      : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{signatory.name}</p>
                    <p className="text-xs text-muted-foreground">{ROLE_LABELS[signatory.role]}{signatory.firm ? ` — ${signatory.firm}` : ""}</p>
                    {signatory.registration && <p className="text-xs text-muted-foreground">{signatory.registration}</p>}
                  </div>
                </div>
                <div className="text-right">
                  {signatory.status === "signed" && signatory.signedAt && (
                    <>
                      <Lock className="h-4 w-4 text-success mb-1 ml-auto" />
                      <p className="text-xs text-success">{formatDateTime(signatory.signedAt)}</p>
                    </>
                  )}
                  {signatory.status === "pending" && <span className="text-xs text-warning">Pending signature</span>}
                  {signatory.status === "awaiting" && <span className="text-xs text-muted-foreground">Awaiting turn</span>}
                </div>
              </div>
              
              {signatory.status === "signed" && (
                <div className="text-xs text-muted-foreground italic mt-2 p-2 bg-white rounded">
                  Declaration signed and recorded.
                </div>
              )}
              
              {canUserSign && (
                <>
                  <div className="bg-white rounded-lg p-4 border border-border mb-4">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {DECLARATIONS[signatory.role]
                        .replace("[name]", signatory.name)
                        .replace("[SACPCMP registration]", signatory.registration || "")
                        .replace("[net amount]", formatZAR(CERTIFICATE_DATA.summary.netAmount))
                        .replace("[total including VAT]", formatZAR(CERTIFICATE_DATA.summary.totalPayable))
                        .replace("[municipality]", "Amathole District Municipality")
                        .replace("[contractor]", CERTIFICATE_DATA.header.contractor)
                        .replace("[number]", CERTIFICATE_DATA.header.certNumber)
                        .replace("[date]", CERTIFICATE_DATA.header.periodTo)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => onConfirm(signatory.role)}
                      className="flex items-center gap-2 text-sm"
                    >
                      {isConfirmed 
                        ? <CheckSquare className="h-5 w-5 text-primary" />
                        : <Square className="h-5 w-5 text-muted-foreground" />}
                      <span className="text-foreground">I confirm I have reviewed this certificate in full</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onSign(signatory.role)}
                    disabled={!isConfirmed || signingRole !== null}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signingRole === signatory.role 
                      ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</>
                      : <><Fingerprint className="h-4 w-4" />Sign & Authorise Payment</>}
                  </button>
                </>
              )}
            </div>
          );
        })}
        
        <div className="mt-4 p-3 bg-danger/5 border border-danger/20 rounded-lg text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              All signatures are cryptographically timestamped and tamper-evident. Once signed, the declaration is locked and cannot be reversed. Any discrepancy discovered after signing will trigger an automatic audit alert.
            </p>
          </div>
        </div>
      </div>
      
      {/* Document Footer */}
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        <p>Tenderbox Payment Engine · {CERTIFICATE_DATA.header.projectName}</p>
        <p className="mt-1">Certificate {CERTIFICATE_DATA.header.certNumber} · Generated {formatDate(CERTIFICATE_DATA.header.dateIssued)}</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

function PaymentsPage() {
  const { toast } = useToast();
  const [certs, setCerts] = useState<Certificate[]>(INITIAL_CERTS);
  const [signingCertId, setSigningCertId] = useState<string | null>(null);
  const [viewingCertId, setViewingCertId] = useState<string | null>(null);
  const [signingRole, setSigningRole] = useState<SignatoryRole | null>(null);
  const [confirmedRoles, setConfirmedRoles] = useState<Set<SignatoryRole>>(new Set());
  const [documentViewed, setDocumentViewed] = useState(false);
  
  const currentUserRole: SignatoryRole = "pmu"; // Mock current user
  const currentUserName = "Ms. B. Khumalo";
  
  const handleSign = (role: SignatoryRole) => {
    if (!confirmedRoles.has(role)) return;
    setSigningRole(role);
    setTimeout(() => {
      setSigningRole(null);
      setConfirmedRoles(new Set());
      toast(`Signature recorded — ${ROLE_LABELS[role]} ${currentUserName} has signed`, "success");
      // In real app, would update cert state here
    }, 2000);
  };
  
  const handleConfirm = (role: SignatoryRole) => {
    setConfirmedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(role)) {
        newSet.delete(role);
      } else {
        newSet.add(role);
      }
      return newSet;
    });
    setDocumentViewed(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Oversight</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor and sign payment certificates across municipal projects</p>
        </div>
      </div>
      
      {viewingCertId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-auto">
          <div className="max-w-5xl mx-auto my-8 bg-card rounded-lg border shadow-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b p-4">
              <div>
                <h2 className="font-bold text-foreground">Full Payment Certificate</h2>
                <p className="text-sm text-muted-foreground">Review complete document before signing</p>
              </div>
              <button
                onClick={() => { setViewingCertId(null); setDocumentViewed(false); }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
            <div className="p-6">
              <PaymentCertificateDocument 
                onSign={handleSign}
                signingRole={signingRole}
                confirmedRoles={confirmedRoles}
                onConfirm={handleConfirm}
                signatories={SIGNATORIES}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {certs.map((cert) => {
          const currentStep = getStep(cert.approvals);
          const isReleased = currentStep === "done";
          const remaining = daysRemaining(cert.daysElapsed);
          const stepLabel = isReleased ? "Payment Released" : STEP_DEFS.find((s) => s.id === currentStep)?.label ?? currentStep;
          const canSign = !isReleased && CLIENT_STEPS.includes(currentStep as StepId);
          const isSigning = signingCertId === cert.id;
          
          // Check if current user should sign this cert
          const userStepOrder = ["pmu", "cfo", "mm"];
          const userNeedsToSign = !isReleased && userStepOrder.includes(currentStep);
          
          return (
            <div key={cert.id} className={["rounded-lg border-2 bg-card shadow-sm overflow-hidden", isReleased ? "border-success/20" : countdownBg(remaining)].join(" ")}>
              <div className="flex flex-wrap items-start justify-between gap-4 p-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{cert.ref}</span>
                    <span className={["inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", isReleased ? "border-success/20 bg-success/10 text-success" : "border-warning/20 bg-warning/10 text-warning"].join(" ")}>
                      {isReleased ? "Released" : `Pending: ${stepLabel}`}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">{formatZAR(cert.amount)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {cert.contractor} · {cert.tenderRef}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{cert.tenderTitle}</div>
                </div>

                <div className="flex items-center gap-5">
                  {!isReleased && (
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative h-14 w-14">
                        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r="22" className="stroke-muted" strokeWidth="5" fill="none" />
                          <circle cx="26" cy="26" r="22" stroke={remaining > 15 ? "#1D9E75" : remaining > 7 ? "#BA7517" : "#993C1D"} strokeWidth="5" fill="none" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - Math.max(0, Math.min(100, (remaining / 30) * 100)) / 100)} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xs font-bold ${countdownCls(remaining)}`}>{remaining}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">days left</span>
                    </div>
                  )}
                  
                  {userNeedsToSign && (
                    <button
                      onClick={() => setViewingCertId(cert.id)}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <FileText className="h-4 w-4" />
                      View & Sign Certificate
                    </button>
                  )}
                  
                  {!userNeedsToSign && !isReleased && (
                    <button
                      onClick={() => setViewingCertId(cert.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <FileText className="h-4 w-4" />
                      View Document
                    </button>
                  )}
                  
                  {isReleased && <CheckCircle className="h-8 w-8 text-success" />}
                </div>
              </div>

              <div className="border-t border-border/50 bg-muted/30 px-6 py-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {STEP_DEFS.map((step, idx) => {
                    const approval = cert.approvals[step.id];
                    const isCurr = step.id === currentStep;
                    return (
                      <div key={step.id} className="flex items-center gap-1.5 shrink-0">
                        {idx > 0 && <div className={`h-px w-4 ${approval.completed || isCurr ? "bg-success/50" : "bg-border"}`} />}
                        <div className={["flex flex-col items-center gap-0.5", approval.completed ? "text-success" : isCurr ? "text-primary" : "text-muted-foreground"].join(" ")}>
                          <div className={["flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold", approval.completed ? "bg-success/20" : isCurr ? "bg-primary/20" : "bg-muted"].join(" ")}>
                            {approval.completed ? "✓" : idx + 1}
                          </div>
                          <span className="text-[9px] whitespace-nowrap">{step.label.split(" ")[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isReleased && remaining <= 7 && (
                <div className="border-t border-danger/20 bg-danger/5 px-6 py-2 flex items-center gap-2 text-xs text-danger">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{remaining <= 0 ? "MFMA 30-day limit breached — automatic AG escalation initiated" : `Only ${remaining} days remaining — action required to avoid MFMA violation`}</span>
                </div>
              )}

              {isReleased && (
                <div className="border-t border-success/20 bg-success/5 px-6 py-2 flex items-center gap-2 text-xs text-success">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Payment released — EFT processed · Invoice date: {formatDate(cert.invoiceDate)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// DATA AND HELPERS
// ============================================================

type StepId = "qs" | "pa" | "invoice" | "pm" | "pmu" | "cfo" | "mm" | "released";

const STEP_DEFS: { id: StepId; label: string }[] = [
  { id: "qs", label: "QS Measurement" },
  { id: "pa", label: "PA Certification" },
  { id: "invoice", label: "Invoice Submitted" },
  { id: "pm", label: "PM Sign-off" },
  { id: "pmu", label: "PMU Sign-off" },
  { id: "cfo", label: "CFO Sign-off" },
  { id: "mm", label: "MM Sign-off" },
  { id: "released", label: "Payment Released" },
];
const STEP_ORDER: StepId[] = STEP_DEFS.map((s) => s.id);

const CLIENT_STEPS: StepId[] = ["pmu", "cfo", "mm"];

type Approval = { completed: boolean; date: string | null; by?: string };
type Approvals = Record<StepId, Approval>;

interface Certificate {
  id: string; ref: string; tenderRef: string; tenderTitle: string;
  contractor: string; amount: number; invoiceDate: string;
  approvals: Approvals; daysElapsed: number;
}

function makeApprovals(steps: StepId[]): Approvals {
  const all: Approvals = {
    qs: { completed: false, date: null }, pa: { completed: false, date: null },
    invoice: { completed: false, date: null }, pm: { completed: false, date: null },
    pmu: { completed: false, date: null }, cfo: { completed: false, date: null },
    mm: { completed: false, date: null }, released: { completed: false, date: null },
  };
  steps.forEach((s, i) => {
    const d = new Date(Date.now() - (steps.length - i) * 2 * 86400000).toISOString();
    all[s] = { completed: true, date: d, by: signerLabel(s) };
  });
  return all;
}

function signerLabel(s: StepId): string {
  const m: Record<StepId, string> = {
    qs: "Eng. D. Maphumulo (QS)", pa: "Arch. S. Pillay (PA)", invoice: "Contractor",
    pm: "Mr. T. Mokoena (PM)", pmu: "Ms. B. Khumalo (PMU)", cfo: "Mr. R. van Wyk (CFO)",
    mm: "Mr. K. Ndlovu (MM)", released: "Tenderbox Payment Engine",
  };
  return m[s];
}

const INITIAL_CERTS: Certificate[] = [
  {
    id: "1", ref: "PC-2025-047-003", tenderRef: "TBX-2025-0047",
    tenderTitle: "Rehabilitation of Stormwater Drainage — Amathole", contractor: "Sizwe Construction (Pty) Ltd",
    amount: 1245000, invoiceDate: "2026-05-16", daysElapsed: 8,
    approvals: makeApprovals(["qs", "pa", "invoice", "pm"]),
  },
  {
    id: "2", ref: "PC-2026-031-001", tenderRef: "TBX-2026-0031",
    tenderTitle: "Rehabilitation of Access Roads — Ward 14 Randburg", contractor: "Mokoena Infrastructure Group",
    amount: 2180000, invoiceDate: "2026-05-28", daysElapsed: 19,
    approvals: makeApprovals(["qs", "pa", "invoice", "pm", "pmu"]),
  },
  {
    id: "3", ref: "PC-2026-039-004", tenderRef: "TBX-2026-0039",
    tenderTitle: "Sewer Reticulation Network Phase 2 — Diepkloof", contractor: "Ntuli Civil Works CC",
    amount: 890000, invoiceDate: "2026-05-10", daysElapsed: 25,
    approvals: makeApprovals(["qs", "pa", "invoice", "pm", "pmu", "cfo"]),
  },
  {
    id: "4", ref: "PC-2026-048-001", tenderRef: "TBX-2026-0048",
    tenderTitle: "Community Hall Construction — Ward 7 Emalahleni", contractor: "Khoza Engineering (Pty) Ltd",
    amount: 3450000, invoiceDate: "2026-06-02", daysElapsed: 4,
    approvals: makeApprovals(["qs"]),
  },
];

function getStep(approvals: Approvals): StepId | "done" {
  for (const s of STEP_ORDER) {
    if (!approvals[s].completed) return s;
  }
  return "done";
}

function daysRemaining(daysElapsed: number) { return Math.max(0, 30 - daysElapsed); }
function countdownCls(days: number) { return days > 15 ? "text-success" : days > 7 ? "text-warning" : "text-danger"; }
function countdownBg(days: number) { return days > 15 ? "border-success/20 bg-success/5" : days > 7 ? "border-warning/20 bg-warning/5" : "border-danger/20 bg-danger/5"; }

function formatDate(d: string) { return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }); }
function formatZAR(n: number) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n); }

function GuardedPaymentsPage() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><PaymentsPage /></RoleGuard>;
}