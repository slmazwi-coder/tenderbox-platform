import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, AlertTriangle, Fingerprint, Lock, Clock, Info,
  ChevronDown, ChevronUp, FileText, X, Printer, CheckSquare, Square,
  Loader2, Calendar, Users, Camera, Image, ClipboardList, DollarSign,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/payments")({ component: GuardedPaymentsPage });

const CLIENT_ROLES = ["client_entity"];

// ============================================================
// MOCK DATA - Amathole District Municipality
// ============================================================

const CERTIFICATE_DATA = {
  header: {
    certNumber: "PC-2025-047-003",
    tenderRef: "TBX-2025-0047",
    projectName: "Construction of Stormwater Drainage Infrastructure — Mthatha Township Phase 2",
    contractor: "Sizwe Construction (Pty) Ltd",
    contractorReg: "2015/123456/07",
    principalAgent: "Eng. S. Ndlovu",
    paFirm: "Ndlovu Consulting Engineers",
    qsName: "Mr. T. Mkhize",
    qsFirm: "Mkhize Quantity Surveyors",
    certificateNumber: 3,
    periodFrom: "01 May 2026",
    periodTo: "31 May 2026",
    dateIssued: "05 June 2026",
    commencementDate: "15 January 2025",
    originalCompletion: "14 July 2026",
    revisedCompletion: "15 September 2026",
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
    // Preliminaries and General
    { section: "Preliminaries and General", billNo: "1.1", description: "Site establishment and preliminaries", unit: "month", qtyThis: 1, rate: 85000, amountThis: 85000, qtyCum: 17, amountCum: 1445000 },
    // Earthworks
    { section: "Earthworks", billNo: "2.1", description: "Excavation for stormwater channels", unit: "m³", qtyThis: 245, rate: 285, amountThis: 69825, qtyCum: 1820, amountCum: 518700 },
    { section: "Earthworks", billNo: "2.2", description: "Bedding and haunching material", unit: "m³", qtyThis: 78, rate: 420, amountThis: 32760, qtyCum: 540, amountCum: 226800 },
    { section: "Earthworks", billNo: "2.3", description: "Backfill and compaction", unit: "m³", qtyThis: 320, rate: 180, amountThis: 57600, qtyCum: 1890, amountCum: 340200 },
    // Concrete
    { section: "Concrete", billNo: "3.1", description: "Concrete channel base", unit: "m³", qtyThis: 45, rate: 1850, amountThis: 83250, qtyCum: 320, amountCum: 592000 },
    { section: "Concrete", billNo: "3.2", description: "Precast concrete headwalls", unit: "no", qtyThis: 8, rate: 4500, amountThis: 36000, qtyCum: 24, amountCum: 108000 },
    { section: "Concrete", billNo: "3.3", description: "Masonry wingwalls and aprons", unit: "m³", qtyThis: 18, rate: 2100, amountThis: 37800, qtyCum: 45, amountCum: 94500 },
    // Drainage
    { section: "Drainage", billNo: "4.1", description: "Supply and install 600mm diameter uPVC pipe", unit: "m", qtyThis: 180, rate: 920, amountThis: 165600, qtyCum: 890, amountCum: 818800 },
    { section: "Drainage", billNo: "4.2", description: "Supply and install 450mm diameter uPVC pipe", unit: "m", qtyThis: 120, rate: 680, amountThis: 81600, qtyCum: 650, amountCum: 442000 },
    { section: "Drainage", billNo: "4.3", description: "Subsoil drainage behind structures", unit: "m", qtyThis: 95, rate: 380, amountThis: 36100, qtyCum: 420, amountCum: 159600 },
    // Surfacing
    { section: "Surfacing", billNo: "5.1", description: "Concrete safety barriers", unit: "m", qtyThis: 60, rate: 650, amountThis: 39000, qtyCum: 280, amountCum: 182000 },
    { section: "Surfacing", billNo: "5.2", description: "Road reinstatement over trench", unit: "m²", qtyThis: 450, rate: 280, amountThis: 126000, qtyCum: 1200, amountCum: 336000 },
    // Contingencies
    { section: "Contingencies", billNo: "6.1", description: "Unforeseen items — approved VO", unit: "sum", qtyThis: 1, rate: 125465, amountThis: 125465, qtyCum: 2, amountCum: 250465 },
  ],
  variationOrders: [
    { voNo: "VO-001", description: "Additional rock excavation in Sections 2-4 due to unforeseen hard material", approvedAmount: 185000, amountThisPeriod: 0, authorisedBy: "Mr. T. Mokoena", dateApproved: "2026-04-15" },
    { voNo: "VO-002", description: "Extended pipe bedding scope to accommodate changed ground conditions", approvedAmount: 72000, amountThisPeriod: 72000, authorisedBy: "Mr. T. Mokoena", dateApproved: "2026-04-22" },
    { voNo: "VO-003", description: "Additional headwalls due to revised drainage design", approvedAmount: 95000, amountThisPeriod: 95000, authorisedBy: "Mr. T. Mokoena", dateApproved: "2026-05-10" },
  ],
  runningAccount: [
    { certNo: "PC-2025-047-001", period: "Jan 2026", gross: 1650000, retention: 165000, net: 1485000, datePaid: "2026-02-12", daysTaken: 18, status: "released" },
    { certNo: "PC-2025-047-002", period: "Feb-Mar 2026", gross: 2150000, retention: 215000, net: 1935000, datePaid: "2026-04-08", daysTaken: 16, status: "released" },
    { certNo: "PC-2025-047-003", period: "Apr 2026", gross: 1950000, retention: 195000, net: 1755000, datePaid: "2026-05-08", daysTaken: 20, status: "released" },
    { certNo: "PC-2025-047-004 (this)", period: "May 2026", gross: 1245000, retention: 124500, net: 1120500, datePaid: null, daysTaken: null, status: "pending" },
  ],
  retention: {
    rate: 10,
    accumulated: 699500,
    released: 0,
    balance: 699500,
  },
  siteDiaries: [
    { date: "2026-05-02", weather: "Clear, 22°C", work: "Site establishment complete. Excavation crew mobilized. Material delivery confirmed.", workers: 24, local: 18 },
    { date: "2026-05-05", weather: "Overcast, 18°C", work: "Excavation ongoing Section 2. Hard rock encountered at depth 1.2m — VO initiated. QS measurement taken.", workers: 22, local: 16 },
    { date: "2026-05-08", weather: "Light rain, 15°C", work: "Pipe laying commenced Section 3. Bedding material placement verified by QS. Traffic management in place.", workers: 20, local: 15 },
    { date: "2026-05-12", weather: "Heavy rain, 12°C", work: "No work — site closed due to heavy rainfall. Site protected and drainage maintained.", workers: 0, local: 0 },
    { date: "2026-05-15", weather: "Clear, 20°C", work: "Concrete pour for headwalls HW-12 to HW-15. Slump test passed (75mm). Curing commenced.", workers: 18, local: 14 },
    { date: "2026-05-19", weather: "Clear, 24°C", work: "Backfill and compaction Section 4. Density tests completed — all pass (95% mod AASHTO).", workers: 16, local: 12 },
    { date: "2026-05-22", weather: "Clear, 21°C", work: "Safety barrier installation commenced. Line and level confirmed by surveyor.", workers: 14, local: 11 },
    { date: "2026-05-26", weather: "Partly cloudy, 19°C", work: "Site walk with PA and QS for measurement. All works verified. Pothole repairs Section 1.", workers: 20, local: 15 },
    { date: "2026-05-29", weather: "Clear, 23°C", work: "Final clean-up and preparation for handover of Section 3. Reinstatement completed.", workers: 18, local: 14 },
  ],
  photographs: [
    { id: 1, caption: "Excavation in progress - Section 2", date: "2026-05-05", location: "S2+200" },
    { id: 2, caption: "Hard rock encountered - VO documentation", date: "2026-05-05", location: "S2+350" },
    { id: 3, caption: "Pipe laying - Section 3 alignment", date: "2026-05-08", location: "S3+000" },
    { id: 4, caption: "Bedding material placement", date: "2026-05-08", location: "S3+100" },
    { id: 5, caption: "Concrete pour - headwalls HW-12", date: "2026-05-15", location: "S2+450" },
    { id: 6, caption: "Slump test documentation", date: "2026-05-15", location: "S2+450" },
    { id: 7, caption: "Backfill compaction testing", date: "2026-05-19", location: "S4+000" },
    { id: 8, caption: "Safety barrier installation", date: "2026-05-22", location: "S1+500" },
  ],
  programme: [
    { activity: "Site establishment", planned: 100, actual: 100 },
    { activity: "Excavation", planned: 85, actual: 80 },
    { activity: "Pipe laying", planned: 70, actual: 65 },
    { activity: "Concrete structures", planned: 60, actual: 55 },
    { activity: "Backfill and reinstatement", planned: 45, actual: 40 },
    { activity: "Safety barriers", planned: 20, actual: 15 },
  ],
};

const SIGNATORIES = [
  { role: "qs", title: "Quantity Surveyor", name: "Mr. T. Mkhize", firm: "Mkhize Quantity Surveyors", status: "signed", signedAt: "2026-05-20T10:30:00", declaration: "qs" },
  { role: "pa", title: "Principal Agent", name: "Eng. S. Ndlovu", firm: "Ndlovu Consulting Engineers", status: "signed", signedAt: "2026-05-22T14:15:00", declaration: "pa" },
  { role: "pm", title: "Project Manager", name: "Mr. T. Mokoena", firm: "Amathole DM", status: "signed", signedAt: "2026-05-24T11:45:00", declaration: "pm" },
  { role: "pmu", title: "PMU Manager", name: "Ms. B. Khumalo", firm: "Amathole DM", status: "pending", signedAt: null, declaration: "pmu" },
  { role: "cfo", title: "Chief Financial Officer", name: "Mr. R. van Wyk", firm: "Amathole DM", status: "awaiting", signedAt: null, declaration: "cfo" },
  { role: "mm", title: "Municipal Manager", name: "Mr. K. Ndlovu", firm: "Amathole DM", status: "awaiting", signedAt: null, declaration: "mm" },
];

const DECLARATIONS: Record<string, string> = {
  qs: `I, [name], confirm that I have physically measured the works described in this certificate and that the quantities, rates and amounts are accurate to the best of my professional knowledge. Measurement was conducted in accordance with the applicable standard method of measurement.`,
  pa: `I, [name], as Principal Agent, certify that the works described in this certificate have been executed in accordance with the contract documents and that the amounts stated are properly due and payable to the contractor.`,
  pm: `I, [name], as Client Project Manager, confirm that this payment certificate is consistent with the bi-weekly progress reports, daily site diary records, and site inspection reports for the measurement period and that the certified work corresponds to recorded and observed progress on site.`,
  pmu: `I, [name], as Project Management Unit Manager, confirm that the certified amount is within the approved cash flow projection for this period and that no unresolved compliance issues exist that would affect this payment.`,
  cfo: `I, [name], as Chief Financial Officer, confirm that funds in the amount of [net_amount] are available and ring-fenced in the project escrow account for this payment and that the payment is within the approved project budget and within the authorised quarterly reservation.`,
  mm: `I, [name], as Accounting Officer of [municipality], confirm that this payment certificate has been properly compiled, certified and reviewed through the full approval chain. I authorise the release of [total_amount] to [contractor] in settlement of payment certificate number [cert_number] for the period ending [end_date]. I am aware that this release instruction is transmitted directly to the escrow account and takes effect immediately.`,
};

const CERTIFICATES = [
  { id: "1", ref: "PC-2025-047-003", contractor: "Sizwe Construction (Pty) Ltd", amount: 1245000, currentStep: "pmu", daysElapsed: 8, daysRemaining: 22 },
  { id: "2", ref: "PC-2026-031-001", contractor: "Mokoena Infrastructure Group", amount: 2180000, currentStep: "cfo", daysElapsed: 19, daysRemaining: 11 },
  { id: "3", ref: "PC-2026-039-004", contractor: "Ntuli Civil Works CC", amount: 890000, currentStep: "mm", daysElapsed: 25, daysRemaining: 5 },
];

// ============================================================
// HELPERS
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
// SECTIONS
// ============================================================

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b-2 border-primary/30 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {number}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}

function ExpandableItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-2">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted">
        <span className="font-medium text-foreground">{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
}

// Section 1: Certificate Summary
function Section1Summary() {
  return (
    <div className="space-y-4">
      <SectionHeader number={1} title="CERTIFICATE SUMMARY" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="col-span-2 rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Gross Amount Certified</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatZAR(CERTIFICATE_DATA.summary.grossAmount)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Retention (10%)</p>
          <p className="text-xl font-bold text-foreground mt-1">{formatZAR(CERTIFICATE_DATA.summary.retentionAmount)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Net Amount Due</p>
          <p className="text-xl font-bold text-foreground mt-1">{formatZAR(CERTIFICATE_DATA.summary.netAmount)}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Payable (incl VAT)</p>
          <p className="text-2xl font-bold text-primary mt-1">{formatZAR(CERTIFICATE_DATA.summary.totalPayable)}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div><span className="text-muted-foreground">VAT (15%):</span> <span className="font-medium">{formatZAR(CERTIFICATE_DATA.summary.vatAmount)}</span></div>
        <div><span className="text-muted-foreground">Retention Rate:</span> <span className="font-medium">{CERTIFICATE_DATA.summary.retentionRate}%</span></div>
        <div><span className="text-muted-foreground">Net Amount:</span> <span className="font-medium">{formatZAR(CERTIFICATE_DATA.summary.netAmount)}</span></div>
      </div>
    </div>
  );
}

// Section 2: Measurement Breakdown
function Section2Measurement() {
  const sections = [...new Set(CERTIFICATE_DATA.measurementItems.map(item => item.section))];
  
  return (
    <div className="space-y-4">
      <SectionHeader number={2} title="DETAILED MEASUREMENT BREAKDOWN" />
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Bill</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="px-3 py-2 text-center font-medium">Unit</th>
              <th className="px-3 py-2 text-right font-medium">Qty</th>
              <th className="px-3 py-2 text-right font-medium">Rate</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
              <th className="px-3 py-2 text-right font-medium">Cum Qty</th>
              <th className="px-3 py-2 text-right font-medium">Cum Amount</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(section => {
              const items = CERTIFICATE_DATA.measurementItems.filter(i => i.section === section);
              const sectionTotal = items.reduce((sum, i) => sum + i.amountThis, 0);
              return (
                <>
                  <tr key={section} className="bg-primary/10 font-semibold">
                    <td colSpan={8} className="px-3 py-2">{section}</td>
                  </tr>
                  {items.map((item, idx) => (
                    <tr key={item.billNo} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
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
                  <tr className="bg-muted/50 font-semibold text-sm">
                    <td colSpan={5} className="px-3 py-2">Section Subtotal</td>
                    <td className="px-3 py-2 text-right">{formatZAR(sectionTotal)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </>
              );
            })}
            <tr className="bg-primary/20 font-bold text-lg">
              <td colSpan={5} className="px-3 py-3">GRAND TOTAL THIS CERTIFICATE</td>
              <td className="px-3 py-3 text-right">{formatZAR(CERTIFICATE_DATA.summary.grossAmount)}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Section 3: Variation Orders
function Section3Variations() {
  if (CERTIFICATE_DATA.variationOrders.length === 0) {
    return (
      <div className="space-y-4">
        <SectionHeader number={3} title="VARIATION ORDERS THIS PERIOD" />
        <p className="text-sm text-muted-foreground">No variation orders this period.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <SectionHeader number={3} title="VARIATION ORDERS THIS PERIOD" />
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
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
            {CERTIFICATE_DATA.variationOrders.map((vo, idx) => (
              <tr key={vo.voNo} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
                <td className="px-3 py-2 font-mono">{vo.voNo}</td>
                <td className="px-3 py-2">{vo.description}</td>
                <td className="px-3 py-2 text-right">{formatZAR(vo.approvedAmount)}</td>
                <td className="px-3 py-2 text-right">{vo.amountThisPeriod > 0 ? formatZAR(vo.amountThisPeriod) : "—"}</td>
                <td className="px-3 py-2">{vo.authorisedBy}</td>
                <td className="px-3 py-2">{formatDate(vo.dateApproved)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Section 4: Running Account
function Section4RunningAccount() {
  const totals = CERTIFICATE_DATA.runningAccount.reduce((acc, cert) => ({
    gross: acc.gross + cert.gross,
    retention: acc.retention + cert.retention,
    net: acc.net + cert.net,
  }), { gross: 0, retention: 0, net: 0 });
  
  const pctExpended = ((totals.gross + CERTIFICATE_DATA.summary.grossAmount) / CERTIFICATE_DATA.header.currentContractSum) * 100;
  
  return (
    <div className="space-y-4">
      <SectionHeader number={4} title="RUNNING ACCOUNT SUMMARY" />
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Cert No.</th>
              <th className="px-3 py-2 text-left font-medium">Period</th>
              <th className="px-3 py-2 text-right font-medium">Gross (ZAR)</th>
              <th className="px-3 py-2 text-right font-medium">Retention</th>
              <th className="px-3 py-2 text-right font-medium">Net (ZAR)</th>
              <th className="px-3 py-2 text-left font-medium">Date Paid</th>
              <th className="px-3 py-2 text-center font-medium">Days</th>
              <th className="px-3 py-2 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {CERTIFICATE_DATA.runningAccount.map((cert, idx) => (
              <tr key={cert.certNo} className={idx % 2 === 1 ? "bg-muted/30" : ""}>
                <td className="px-3 py-2 font-mono">{cert.certNo}</td>
                <td className="px-3 py-2">{cert.period}</td>
                <td className="px-3 py-2 text-right">{formatZAR(cert.gross)}</td>
                <td className="px-3 py-2 text-right">{formatZAR(cert.retention)}</td>
                <td className="px-3 py-2 text-right font-medium">{formatZAR(cert.net)}</td>
                <td className="px-3 py-2">{cert.datePaid ? formatDate(cert.datePaid) : "—"}</td>
                <td className="px-3 py-2 text-center">{cert.daysTaken || "—"}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                    cert.status === "released" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {cert.status}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="bg-primary/10 font-semibold">
              <td colSpan={2} className="px-3 py-2">Running Totals</td>
              <td className="px-3 py-2 text-right">{formatZAR(totals.gross + CERTIFICATE_DATA.summary.grossAmount)}</td>
              <td className="px-3 py-2 text-right">{formatZAR(totals.retention + CERTIFICATE_DATA.summary.retentionAmount)}</td>
              <td className="px-3 py-2 text-right">{formatZAR(totals.net + CERTIFICATE_DATA.summary.netAmount)}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Contract Expenditure</span>
          <span className="text-sm font-bold text-primary">{pctExpended.toFixed(1)}% of approved contract sum</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, pctExpended)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>R0</span>
          <span>{formatZAR(CERTIFICATE_DATA.header.currentContractSum)}</span>
        </div>
      </div>
    </div>
  );
}

// Section 5: Retention Account
function Section5Retention() {
  return (
    <div className="space-y-4">
      <SectionHeader number={5} title="RETENTION ACCOUNT" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Retention Rate</p>
          <p className="text-xl font-bold text-foreground mt-1">{CERTIFICATE_DATA.retention.rate}%</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Accumulated to Date</p>
          <p className="text-xl font-bold text-foreground mt-1">{formatZAR(CERTIFICATE_DATA.retention.accumulated)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Released to Date</p>
          <p className="text-xl font-bold text-muted-foreground mt-1">{formatZAR(CERTIFICATE_DATA.retention.released)}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Balance</p>
          <p className="text-xl font-bold text-primary mt-1">{formatZAR(CERTIFICATE_DATA.retention.balance)}</p>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground mb-2">Release Schedule</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• 50% at Practical Completion Certificate issued</li>
          <li>• 50% at end of Defects Liability Period (DLP)</li>
        </ul>
      </div>
    </div>
  );
}

// Section 6: Supporting Evidence
function Section6Evidence() {
  return (
    <div className="space-y-4">
      <SectionHeader number={6} title="SUPPORTING EVIDENCE" />
      
      {/* Site Diaries */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Daily Site Diary Entries</h3>
        </div>
        <div className="space-y-2">
          {CERTIFICATE_DATA.siteDiaries.map((entry, idx) => (
            <ExpandableItem key={idx} title={`${entry.date} — ${entry.weather}`}>
              <p className="text-sm text-foreground mb-3">{entry.work}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Workers on site: {entry.workers}</span>
                <span>Local employment: {entry.local}</span>
              </div>
            </ExpandableItem>
          ))}
        </div>
      </div>
      
      {/* Photographs */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Image className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Site Photographs</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CERTIFICATE_DATA.photographs.map((photo) => (
            <div key={photo.id} className="aspect-square bg-muted rounded-lg flex items-center justify-center p-2">
              <div className="text-center">
                <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">{photo.caption}</p>
                <p className="text-[10px] text-muted-foreground">{photo.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Attendance */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Biometric Attendance Register</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-muted-foreground">Total worker days:</span> <span className="font-medium">184</span></div>
          <div><span className="text-muted-foreground">Local employment:</span> <span className="font-medium">78%</span></div>
          <div><span className="text-muted-foreground">Safety officer present:</span> <span className="font-medium">100%</span></div>
        </div>
      </div>
      
      {/* Programme */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Programme Progress</h3>
        </div>
        <div className="space-y-3">
          {CERTIFICATE_DATA.programme.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{item.activity}</span>
                <span className="text-muted-foreground">Planned: {item.planned}% | Actual: {item.actual}%</span>
              </div>
              <div className="flex h-2 gap-1">
                <div className="flex-1 bg-primary/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.planned}%` }} />
                </div>
                <div className="flex-1 bg-success/30 rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: `${item.actual}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Section 7: Signatory Sign-off
function Section7SignOff({ 
  signatories, 
  currentUserRole, 
  onSign, 
  signingId, 
  confirmed, 
  onConfirm 
}: { 
  signatories: typeof SIGNATORIES;
  currentUserRole: string;
  onSign: () => void;
  signingId: string | null;
  confirmed: boolean;
  onConfirm: () => void;
}) {
  const getDeclaration = (s: typeof SIGNATORIES[0]) => {
    const template = DECLARATIONS[s.declaration] || "";
    return template
      .replace("[name]", s.name)
      .replace("[net_amount]", formatZAR(CERTIFICATE_DATA.summary.netAmount))
      .replace("[total_amount]", formatZAR(CERTIFICATE_DATA.summary.totalPayable))
      .replace("[municipality]", "Amathole District Municipality")
      .replace("[contractor]", CERTIFICATE_DATA.header.contractor)
      .replace("[cert_number]", CERTIFICATE_DATA.header.certNumber)
      .replace("[end_date]", CERTIFICATE_DATA.header.periodTo);
  };
  
  return (
    <div className="space-y-4">
      <SectionHeader number={7} title="SIGNATORY DECLARATIONS AND SIGN-OFF" />
      <div className="space-y-4">
        {signatories.map((s, idx) => {
          const isCurrentUser = s.role === currentUserRole;
          const canSign = isCurrentUser && s.status === "pending";
          
          return (
            <div key={s.role} className={`rounded-lg border p-4 ${
              s.status === "signed" ? "border-success/20 bg-success/5" 
                : canSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            }`}>
              <div className="flex items-center gap-4 mb-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  s.status === "signed" ? "bg-success/20 text-success" 
                    : canSign ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {s.status === "signed" ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.title} — {s.firm}</p>
                  {s.status === "signed" && s.signedAt && (
                    <p className="text-xs text-success mt-0.5">Signed {formatDateTime(s.signedAt)}</p>
                  )}
                  {s.status === "awaiting" && (
                    <p className="text-xs text-muted-foreground mt-0.5">Not yet reached</p>
                  )}
                </div>
              </div>
              
              {s.status === "signed" && (
                <div className="bg-white rounded-lg border border-border p-3 text-sm text-muted-foreground">
                  {getDeclaration(s)}
                </div>
              )}
              
              {canSign && (
                <>
                  <div className="bg-white rounded-lg border border-border p-4 text-sm text-foreground mb-4">
                    {getDeclaration(s)}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={onConfirm} className="flex items-center gap-2">
                      {confirmed ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                      <span className="text-foreground">I confirm I have reviewed this payment certificate and all supporting evidence in full</span>
                    </button>
                  </div>
                  <button
                    onClick={onSign}
                    disabled={!confirmed || signingId !== null}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a365d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a365d]/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signingId === s.role ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</> : <><Fingerprint className="h-4 w-4" />Sign & Authorise Payment</>}
                  </button>
                </>
              )}
              
              {s.status === "signed" && (
                <div className="flex items-center gap-2 mt-3 text-xs text-success">
                  <Lock className="h-3 w-3" />
                  <span>Signature recorded and locked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            All signatures are cryptographically timestamped and tamper-evident. Payment is released directly to the contractor's escrow account upon Municipal Manager sign-off.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DOCUMENT VIEW MODAL
// ============================================================

function DocumentViewModal({ certificateId, onClose }: { certificateId: string; onClose: () => void }) {
  const [signatories, setSignatories] = useState(SIGNATORIES);
  const [signingId, setSigningId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const currentUserRole = "pmu"; // Mock current user
  
  const handleSign = () => {
    setSigningId(currentUserRole);
    setTimeout(() => {
      setSignatories(prev => prev.map(s => 
        s.role === currentUserRole ? { ...s, status: "signed" as const, signedAt: new Date().toISOString() } : s
      ));
      setSigningId(null);
      setConfirmed(false);
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-auto">
      <div className="max-w-5xl mx-auto my-8 bg-card rounded-lg border shadow-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b p-4">
          <div>
            <h2 className="font-bold text-foreground">Payment Certificate</h2>
            <p className="text-sm text-muted-foreground">{CERTIFICATE_DATA.header.projectName}</p>
          </div>
          <button onClick={onClose} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-muted">
            <X className="h-4 w-4" /> Close
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Certificate Header */}
          <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Printer className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">PAYMENT CERTIFICATE</h2>
            </div>
            <p className="text-sm text-muted-foreground">Certificate {CERTIFICATE_DATA.header.certificateNumber} — {formatDate(CERTIFICATE_DATA.header.dateIssued)}</p>
          </div>
          
          {/* Header Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div><p className="text-xs text-muted-foreground">Project</p><p className="font-medium">{CERTIFICATE_DATA.header.projectName}</p></div>
                <div><p className="text-xs text-muted-foreground">Contractor</p><p className="font-medium">{CERTIFICATE_DATA.header.contractor}</p></div>
                <div><p className="text-xs text-muted-foreground">Registration</p><p className="font-medium">{CERTIFICATE_DATA.header.contractorReg}</p></div>
                <div><p className="text-xs text-muted-foreground">Principal Agent</p><p className="font-medium">{CERTIFICATE_DATA.header.principalAgent}, {CERTIFICATE_DATA.header.paFirm}</p></div>
                <div><p className="text-xs text-muted-foreground">Quantity Surveyor</p><p className="font-medium">{CERTIFICATE_DATA.header.qsName}, {CERTIFICATE_DATA.header.qsFirm}</p></div>
              </div>
              <div className="space-y-3">
                <div><p className="text-xs text-muted-foreground">Certificate Number</p><p className="font-medium font-mono">{CERTIFICATE_DATA.header.certNumber}</p></div>
                <div><p className="text-xs text-muted-foreground">Period</p><p className="font-medium">{CERTIFICATE_DATA.header.periodFrom} to {CERTIFICATE_DATA.header.periodTo}</p></div>
                <div><p className="text-xs text-muted-foreground">Original Contract Sum</p><p className="font-medium">{formatZAR(CERTIFICATE_DATA.header.originalContractSum)}</p></div>
                <div><p className="text-xs text-muted-foreground">Current Contract Sum</p><p className="font-medium text-primary">{formatZAR(CERTIFICATE_DATA.header.currentContractSum)}</p></div>
                <div><p className="text-xs text-muted-foreground">Commencement / Completion</p><p className="font-medium">{formatDate(CERTIFICATE_DATA.header.commencementDate)} / {formatDate(CERTIFICATE_DATA.header.revisedCompletion)}</p></div>
              </div>
            </div>
          </div>
          
          {/* Sections */}
          <Section1Summary />
          <Section2Measurement />
          <Section3Variations />
          <Section4RunningAccount />
          <Section5Retention />
          <Section6Evidence />
          <Section7SignOff 
            signatories={signatories}
            currentUserRole={currentUserRole}
            onSign={handleSign}
            signingId={signingId}
            confirmed={confirmed}
            onConfirm={() => setConfirmed(!confirmed)}
          />
          
          {/* Footer */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
            <p>Tenderbox Payment Engine — Amathole District Municipality</p>
            <p className="mt-1">Certificate {CERTIFICATE_DATA.header.certNumber} — All timestamps in South African Standard Time (SAST)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

function PaymentsPage() {
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
  
  const stepLabels: Record<string, string> = {
    qs: "QS Measurement",
    pa: "PA Certification",
    pm: "PM Sign-off",
    pmu: "PMU Sign-off",
    cfo: "CFO Sign-off",
    mm: "MM Sign-off",
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Oversight</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor and sign payment certificates across municipal projects</p>
        </div>
      </div>
      
      {selectedCertId && (
        <DocumentViewModal certificateId={selectedCertId} onClose={() => setSelectedCertId(null)} />
      )}
      
      <div className="space-y-4">
        {CERTIFICATES.map((cert) => {
          const daysColor = cert.daysRemaining > 15 ? "text-success" : cert.daysRemaining > 7 ? "text-warning" : "text-danger";
          
          return (
            <div key={cert.id} className={`rounded-lg border-2 bg-card shadow-sm overflow-hidden ${
              cert.daysRemaining <= 7 ? "border-danger/30" : cert.daysRemaining <= 15 ? "border-warning/30" : "border-border"
            }`}>
              <div className="flex flex-wrap items-start justify-between gap-4 p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{cert.ref}</span>
                    <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {stepLabels[cert.currentStep]}
                    </span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-foreground">{formatZAR(cert.amount)}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{cert.contractor}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${daysColor}`}>{cert.daysRemaining}</p>
                    <p className="text-xs text-muted-foreground">days remaining</p>
                  </div>
                  <button
                    onClick={() => setSelectedCertId(cert.id)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <FileText className="h-4 w-4" />
                    View & Sign
                  </button>
                </div>
              </div>
              <div className="border-t border-border/50 bg-muted/30 px-6 py-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Day {cert.daysElapsed} of 30</span>
                  <span className="mx-2">•</span>
                  <span>{cert.currentStep.toUpperCase()} pending</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuardedPaymentsPage() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><PaymentsPage /></RoleGuard>;
}