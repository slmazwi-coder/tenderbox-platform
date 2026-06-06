import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  CheckCircle, Clock, Fingerprint, Loader2, Lock, AlertTriangle, 
  FileText, X, Printer, CheckSquare, Square, Shield, DollarSign,
  ClipboardCheck, Wrench, Users, Calendar, Check
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/gate1")({ component: GuardedGate1Page });

const CLIENT_ROLES = ["client_entity"];

// ============================================================
// MOCK DATA - TRACK A: FINANCIAL APPROVAL
// ============================================================

const TRACK_A_DATA = {
  project: {
    name: "Sewer Reticulation Network Phase 2 — Diepkloof Township",
    idpRef: "IDP-2026-INF-047",
    tenderRef: "TBX-2026-0039",
  },
  pceBreakdown: [
    { item: "Labour and workmanship", amount: 2850000 },
    { item: "Materials and supplies", amount: 3420000 },
    { item: "Plant and equipment hire", amount: 680000 },
    { item: "Preliminaries and general conditions", amount: 520000 },
    { item: "Contingency (10%)", amount: 747000 },
    { item: "Professional fees (engineering)", amount: 380000 },
  ],
  pceTotal: 8597000,
  pceLower: 8167150,
  pceUpper: 9456700,
  budgetLine: "Vote 7.4 — Sanitation Infrastructure — Ward Allocation 2026/27",
  budgetAmount: 12000000,
  fundsAvailable: true,
  cashFlow: [
    { quarter: "Q1 (Jul-Sep 2026)", amount: 2150000, description: "Site establishment and excavation" },
    { quarter: "Q2 (Oct-Dec 2026)", amount: 3200000, description: "Pipe laying and drainage" },
    { quarter: "Q3 (Jan-Mar 2027)", amount: 2450000, description: "Structures and backfill" },
    { quarter: "Q4 (Apr-Jun 2027)", amount: 1450000, description: "Completion and commissioning" },
  ],
  procurementMethod: "Open Competitive Bidding — 80/20 PPPFA",
  procurementMotivation: "Contract value exceeds R1,000,000 threshold. No single source justification applicable. 80/20 system appropriate for contracts below R50M.",
};

const TRACK_A_SIGNATORIES = [
  { role: "pmu_manager", name: "Ms. B. Khumalo", status: "signed", signedAt: "2026-06-03T09:15:00" },
  { role: "cfo", name: "Mr. R. van Wyk", status: "signed", signedAt: "2026-06-03T14:30:00" },
  { role: "mm", name: "Mr. K. Ndlovu", status: "pending" },
];

// ============================================================
// MOCK DATA - TRACK B: SCM COMPLIANCE
// ============================================================

const TRACK_B_ITEMS = [
  { id: 1, label: "Scope of work is clearly defined and unambiguous", confirmed: true, notes: "Detailed scope document attached" },
  { id: 2, label: "Technical specifications are complete and not unduly restrictive", confirmed: true, notes: "Specs reviewed by Technical team" },
  { id: 3, label: "BOQ is complete and priced correctly by the QS", confirmed: true, notes: "BOQ verified by Eng. Maphumulo on 2026-05-28" },
  { id: 4, label: "Evaluation criteria and weightings are defined and fair", confirmed: true, notes: "80/20 system applied with 6 functionality criteria" },
  { id: 5, label: "PPPFA points system is correctly applied (80/20 or 90/10)", confirmed: true, notes: "80/20 confirmed for contracts < R50M" },
  { id: 6, label: "All SBD forms are included in the tender package", confirmed: true, notes: "SBD 1, 3.3, 4, 6.1, 8, 9 included" },
  { id: 7, label: "CIDB grade requirement is correctly determined", confirmed: true, notes: "Grade 6CE required based on contract value" },
  { id: 8, label: "EPWP requirements and local labour targets are included", confirmed: false, notes: "EPWP compliance clause added. Local labour target: 30% of workforce hours" },
  { id: 9, label: "Special conditions of contract are legally sound", confirmed: true, notes: "GCC 2015 with standard municipal SCC" },
  { id: 10, label: "Tender advertisement period meets minimum requirements", confirmed: true, notes: "21 days as per MFMA s19" },
  { id: 11, label: "Compulsory briefing arrangements are confirmed", confirmed: true, notes: "Site inspection scheduled for 2026-06-15" },
];

const TRACK_B_SIGNATORIES = [
  { role: "scm_manager", name: "Ms. N. Dlamini", status: "signed", signedAt: "2026-06-04T10:00:00" },
  { role: "legal", name: "Adv. P. Cele", status: "signed", signedAt: "2026-06-04T15:45:00" },
  { role: "pmu_manager", name: "Ms. B. Khumalo", status: "pending" },
];

// ============================================================
// MOCK DATA - TRACK C: TECHNICAL COMPLIANCE
// ============================================================

const TRACK_C_ITEMS = [
  { id: 1, label: "Drawings and specifications are complete", confirmed: true, notes: "120 drawings, 3 technical specs — all approved" },
  { id: 2, label: "OHS pre-construction risk assessment completed", confirmed: true, notes: "HIRA document ref: OHS-2026-039 signed 2026-05-20" },
  { id: 3, label: "Environmental Authorisation status", confirmed: true, notes: "EA Number: EA/2024/0347 — Obtained 2024-08-15", status: "obtained" },
  { id: 4, label: "NEMA screening outcome", confirmed: true, notes: "Listed activity triggered — Basic Assessment completed", status: "approved" },
  { id: 5, label: "Heritage impact assessment if applicable", confirmed: true, notes: "No heritage sites identified in project area", status: "not_required" },
  { id: 6, label: "Servitudes and land availability confirmed", confirmed: true, notes: "All servitudes registered. Municipal land confirmed available" },
  { id: 7, label: "Utility relocations identified and planned", confirmed: false, notes: "Eskom line crossing identified — relocation scheduled for Q1" },
];

const TRACK_C_SIGNATORIES = [
  { role: "engineer", name: "Eng. K. Mokoena", status: "signed", signedAt: "2026-06-02T11:30:00" },
  { role: "pmu_manager", name: "Ms. B. Khumalo", status: "signed", signedAt: "2026-06-03T08:45:00" },
  { role: "mm", name: "Mr. K. Ndlovu", status: "pending" },
];

// ============================================================
// ROLE LABELS AND DECLARATIONS
// ============================================================

const ROLE_LABELS: Record<string, string> = {
  pmu_manager: "PMU Manager",
  cfo: "Chief Financial Officer",
  mm: "Municipal Manager",
  scm_manager: "SCM Manager",
  legal: "Legal Advisor",
  engineer: "Technical Engineer",
};

const TRACK_DECLARATIONS: Record<string, Record<string, string>> = {
  track_a: {
    pmu_manager: `I, [name], as Project Management Unit Manager, confirm that the cash flow projection for this project has been reviewed against the approved municipal budget and that sufficient funds are available in budget line [budget_line] to cover the full project cost of [total]. I confirm that the procurement method selected is appropriate for this contract and that all financial controls have been considered.`,
    cfo: `I, [name], as Chief Financial Officer, confirm that the funds in the amount of [budget_amount] are available and have been ring-fenced in budget line [budget_line] for this project. I confirm that the cash flow projection is within the municipality's financial capacity and that no other committed expenditure will affect this project's funding.`,
    mm: `I, [name], as Municipal Manager and Accounting Officer, authorise the release of this project for tender purposes. I confirm that the financial controls, budget availability, and procurement method have been properly considered and comply with MFMA requirements. The total approved budget of [budget_amount] is confirmed.`,
  },
  track_b: {
    scm_manager: `I, [name], as SCM Manager, confirm that all items in the tender compliance checklist have been reviewed and confirmed where marked. The tender package is complete, legally sound, and ready for advertisement. I confirm compliance with PPPFA regulations, MFMA supply chain management requirements, and all municipal procurement policies.`,
    legal: `I, [name], as Legal Advisor, have reviewed the special conditions of contract and all SBD forms included in the tender package. I confirm that the tender documentation is legally sound, does not contain unduly restrictive conditions, and complies with all applicable legislation including the PPPFA, MFMA, and CIDB requirements.`,
    pmu_manager: `I, [name], as PMU Manager, confirm that the tender package has been properly compiled through the full SCM process and that all required approvals have been obtained. I authorise the publication of this tender on the municipal website and e-tender portal.`,
  },
  track_c: {
    engineer: `I, [name], as the responsible Professional Engineer, confirm that all technical documentation including drawings, specifications, and designs are complete and have been prepared in accordance with applicable standards. The OHS risk assessment has been completed and all regulatory requirements have been addressed.`,
    pmu_manager: `I, [name], as PMU Manager, confirm that the technical and compliance requirements for this project have been properly addressed. All environmental authorisations, heritage assessments, and utility relocation plans are in place or scheduled. The project is technically ready for construction tender.`,
    mm: `I, [name], as Municipal Manager, confirm that this project has met all technical and compliance requirements as verified by the professional team. I authorise the Gate 1 approval and the commencement of the tender process.`,
  },
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

function SectionHeader({ icon: Icon, title, color = "primary" }: { icon: any; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/30">
      <Icon className={`h-5 w-5 text-${color}`} />
      <h3 className={`text-sm font-bold uppercase tracking-wide text-${color}`}>{title}</h3>
    </div>
  );
}

function DataRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-2 border-b border-muted/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-foreground font-bold" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

// ============================================================
// TRACK A: FINANCIAL APPROVAL DOCUMENT
// ============================================================

function TrackADocument({ onSign, signingRole, confirmedRole, onConfirm, signatories }: {
  onSign: (role: string) => void;
  signingRole: string | null;
  confirmedRole: string | null;
  onConfirm: () => void;
  signatories: typeof TRACK_A_SIGNATORIES;
}) {
  const pceSubtotal = TRACK_A_DATA.pceBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = (TRACK_A_DATA.pceTotal + TRACK_A_DATA.pceBreakdown[5].amount) * 0.15;
  const grandTotal = TRACK_A_DATA.pceTotal + TRACK_A_DATA.pceBreakdown[5].amount + vatAmount;
  
  const currentRole = signatories.find(s => s.status === "pending")?.role;
  const canUserSign = signingRole === null && confirmedRole !== null;
  
  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">TRACK A — FINANCIAL APPROVAL DOCUMENT</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {TRACK_A_DATA.project.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          IDP Ref: {TRACK_A_DATA.project.idpRef} · Tender Ref: {TRACK_A_DATA.project.tenderRef}
        </p>
      </div>
      
      {/* Project Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={FileText} title="PROJECT INFORMATION" />
        <div className="space-y-1 text-sm">
          <DataRow label="Project Name" value={TRACK_A_DATA.project.name} />
          <DataRow label="IDP Reference" value={TRACK_A_DATA.project.idpRef} />
          <DataRow label="Tender Reference" value={TRACK_A_DATA.project.tenderRef} />
        </div>
      </div>
      
      {/* PCE Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={ClipboardCheck} title="PROFESSIONAL COST ESTIMATE (PCE)" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Item</th>
                <th className="px-4 py-2 text-right font-medium">Amount (ZAR)</th>
              </tr>
            </thead>
            <tbody>
              {TRACK_A_DATA.pceBreakdown.map((item, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-4 py-2">{item.item}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatZAR(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-semibold">
                <td className="px-4 py-2">Subtotal (before VAT)</td>
                <td className="px-4 py-2 text-right font-mono">{formatZAR(pceSubtotal)}</td>
              </tr>
              <tr className="font-semibold">
                <td className="px-4 py-2">VAT @ 15%</td>
                <td className="px-4 py-2 text-right font-mono">{formatZAR(vatAmount)}</td>
              </tr>
              <tr className="bg-primary/20 text-lg font-bold">
                <td className="px-4 py-2">TOTAL PCE (incl. VAT)</td>
                <td className="px-4 py-2 text-right font-mono">{formatZAR(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bidding Bracket */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={DollarSign} title="BIDDING BRACKET" />
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">PCE Lower (-5%)</p>
            <p className="text-lg font-bold text-foreground">{formatZAR(TRACK_A_DATA.pceLower)}</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg text-center border-2 border-primary/30">
            <p className="text-xs text-muted-foreground">PCE Value</p>
            <p className="text-lg font-bold text-primary">{formatZAR(TRACK_A_DATA.pceTotal)}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">PCE Upper (+10%)</p>
            <p className="text-lg font-bold text-foreground">{formatZAR(TRACK_A_DATA.pceUpper)}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Bids outside this bracket will be automatically flagged for special adjudication
        </p>
      </div>
      
      {/* Budget Confirmation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={Shield} title="BUDGET CONFIRMATION" />
        <div className="space-y-1 text-sm">
          <DataRow label="Budget Line Reference" value={TRACK_A_DATA.budgetLine} />
          <DataRow label="Budget Amount Available" value={formatZAR(TRACK_A_DATA.budgetAmount)} highlight />
          <DataRow label="Funds Available" value={TRACK_A_DATA.fundsAvailable ? "✓ Confirmed — Available and Uncommitted" : "✗ Not Available"} />
        </div>
      </div>
      
      {/* Cash Flow Projection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={Calendar} title="CASH FLOW PROJECTION" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Quarter</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-right font-medium">Amount (ZAR)</th>
              </tr>
            </thead>
            <tbody>
              {TRACK_A_DATA.cashFlow.map((cf, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-4 py-2 font-medium">{cf.quarter}</td>
                  <td className="px-4 py-2 text-muted-foreground">{cf.description}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatZAR(cf.amount)}</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-semibold">
                <td colSpan={2} className="px-4 py-2">TOTAL PROJECT COST</td>
                <td className="px-4 py-2 text-right font-mono">{formatZAR(TRACK_A_DATA.cashFlow.reduce((sum, cf) => sum + cf.amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Procurement Method */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={Users} title="PROCUREMENT METHOD" />
        <div className="space-y-1 text-sm">
          <DataRow label="Recommended Method" value={TRACK_A_DATA.procurementMethod} />
          <div className="pt-2">
            <p className="text-xs text-muted-foreground font-medium">Motivation:</p>
            <p className="text-sm text-foreground mt-1">{TRACK_A_DATA.procurementMotivation}</p>
          </div>
        </div>
      </div>
      
      {/* Sign-off Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={Fingerprint} title="TRACK A SIGN-OFF" />
        
        {signatories.map((signatory) => {
          const isCurrentUser = signatory.role === currentRole;
          const canUserSign = isCurrentUser && signingRole === null;
          
          return (
            <div key={signatory.role} className={`mb-4 p-4 rounded-lg border ${
              signatory.status === "signed" ? "border-success/20 bg-success/5" 
                : canUserSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    signatory.status === "signed" ? "bg-success/20 text-success" 
                      : canUserSign ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {signatory.status === "signed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{signatory.name}</p>
                    <p className="text-xs text-muted-foreground">{ROLE_LABELS[signatory.role]}</p>
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
                </div>
              </div>
              
              {canUserSign && (
                <>
                  <div className="bg-white rounded-lg p-4 border border-border mb-4 mt-3">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {TRACK_DECLARATIONS.track_a[signatory.role]
                        .replace("[name]", signatory.name)
                        .replace("[budget_line]", TRACK_A_DATA.budgetLine)
                        .replace("[total]", formatZAR(grandTotal))
                        .replace("[budget_amount]", formatZAR(TRACK_A_DATA.budgetAmount))}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={onConfirm} className="flex items-center gap-2 text-sm">
                      {confirmedRole === signatory.role 
                        ? <CheckSquare className="h-5 w-5 text-primary" />
                        : <Square className="h-5 w-5 text-muted-foreground" />}
                      <span className="text-foreground">I confirm I have reviewed this document in full</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onSign(signatory.role)}
                    disabled={confirmedRole !== signatory.role || signingRole !== null}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signingRole === signatory.role 
                      ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</>
                      : <><Fingerprint className="h-4 w-4" />Sign & Approve</>}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TRACK B: SCM COMPLIANCE DOCUMENT
// ============================================================

function TrackBDocument({ onSign, signingRole, confirmedRole, onConfirm, signatories }: {
  onSign: (role: string) => void;
  signingRole: string | null;
  confirmedRole: string | null;
  onConfirm: () => void;
  signatories: typeof TRACK_B_SIGNATORIES;
}) {
  const confirmedCount = TRACK_B_ITEMS.filter(i => i.confirmed).length;
  const currentRole = signatories.find(s => s.status === "pending")?.role;
  const canUserSign = signingRole === null && confirmedRole !== null;
  
  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">TRACK B — SCM TENDER PACKAGE COMPLIANCE</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {TRACK_A_DATA.project.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Tender Ref: {TRACK_A_DATA.project.tenderRef}
        </p>
      </div>
      
      {/* Compliance Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader icon={CheckCircle} title="COMPLIANCE CHECKLIST" />
          <div className="text-sm">
            <span className="font-bold text-success">{confirmedCount}</span>
            <span className="text-muted-foreground"> / {TRACK_B_ITEMS.length} confirmed</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {TRACK_B_ITEMS.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border ${
              item.confirmed ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  item.confirmed ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                }`}>
                  {item.confirmed ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {confirmedCount < TRACK_B_ITEMS.length && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              {TRACK_B_ITEMS.length - confirmedCount} item(s) still pending confirmation before tender can be published
            </p>
          </div>
        )}
      </div>
      
      {/* Sign-off Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={Fingerprint} title="TRACK B SIGN-OFF" />
        
        {signatories.map((signatory) => {
          const isCurrentUser = signatory.role === currentRole;
          const canUserSign = isCurrentUser && signingRole === null;
          
          return (
            <div key={signatory.role} className={`mb-4 p-4 rounded-lg border ${
              signatory.status === "signed" ? "border-success/20 bg-success/5" 
                : canUserSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    signatory.status === "signed" ? "bg-success/20 text-success" 
                      : canUserSign ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {signatory.status === "signed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{signatory.name}</p>
                    <p className="text-xs text-muted-foreground">{ROLE_LABELS[signatory.role]}</p>
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
                </div>
              </div>
              
              {canUserSign && (
                <>
                  <div className="bg-white rounded-lg p-4 border border-border mb-4 mt-3">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {TRACK_DECLARATIONS.track_b[signatory.role].replace("[name]", signatory.name)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={onConfirm} className="flex items-center gap-2 text-sm">
                      {confirmedRole === signatory.role 
                        ? <CheckSquare className="h-5 w-5 text-primary" />
                        : <Square className="h-5 w-5 text-muted-foreground" />}
                      <span className="text-foreground">I confirm I have reviewed this checklist in full</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onSign(signatory.role)}
                    disabled={confirmedRole !== signatory.role || signingRole !== null}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signingRole === signatory.role 
                      ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</>
                      : <><Fingerprint className="h-4 w-4" />Sign & Confirm Compliance</>}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TRACK C: TECHNICAL COMPLIANCE DOCUMENT
// ============================================================

function TrackCDocument({ onSign, signingRole, confirmedRole, onConfirm, signatories }: {
  onSign: (role: string) => void;
  signingRole: string | null;
  confirmedRole: string | null;
  onConfirm: () => void;
  signatories: typeof TRACK_C_SIGNATORIES;
}) {
  const confirmedCount = TRACK_C_ITEMS.filter(i => i.confirmed).length;
  const currentRole = signatories.find(s => s.status === "pending")?.role;
  const canUserSign = signingRole === null && confirmedRole !== null;
  
  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Wrench className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">TRACK C — TECHNICAL & COMPLIANCE CONFIRMATION</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {TRACK_A_DATA.project.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Tender Ref: {TRACK_A_DATA.project.tenderRef}
        </p>
      </div>
      
      {/* Technical Compliance Items */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={CheckCircle} title="COMPLIANCE ITEMS" />
        <div className="space-y-3">
          {TRACK_C_ITEMS.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg border ${
              item.confirmed ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  item.confirmed ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                }`}>
                  {item.confirmed ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.status && (
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        item.status === "obtained" || item.status === "approved" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {item.status === "obtained" ? "EA Obtained" : item.status === "approved" ? "Approved" : item.status === "not_required" ? "Not Required" : item.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sign-off Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={Fingerprint} title="TRACK C SIGN-OFF" />
        
        {signatories.map((signatory) => {
          const isCurrentUser = signatory.role === currentRole;
          const canUserSign = isCurrentUser && signingRole === null;
          
          return (
            <div key={signatory.role} className={`mb-4 p-4 rounded-lg border ${
              signatory.status === "signed" ? "border-success/20 bg-success/5" 
                : canUserSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    signatory.status === "signed" ? "bg-success/20 text-success" 
                      : canUserSign ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {signatory.status === "signed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{signatory.name}</p>
                    <p className="text-xs text-muted-foreground">{ROLE_LABELS[signatory.role]}</p>
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
                </div>
              </div>
              
              {canUserSign && (
                <>
                  <div className="bg-white rounded-lg p-4 border border-border mb-4 mt-3">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {TRACK_DECLARATIONS.track_c[signatory.role].replace("[name]", signatory.name)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={onConfirm} className="flex items-center gap-2 text-sm">
                      {confirmedRole === signatory.role 
                        ? <CheckSquare className="h-5 w-5 text-primary" />
                        : <Square className="h-5 w-5 text-muted-foreground" />}
                      <span className="text-foreground">I confirm I have reviewed this document in full</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onSign(signatory.role)}
                    disabled={confirmedRole !== signatory.role || signingRole !== null}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signingRole === signatory.role 
                      ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</>
                      : <><Fingerprint className="h-4 w-4" />Sign & Confirm Technical Readiness</>}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

function Gate1Page() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"a" | "b" | "c">("a");
  const [signingRole, setSigningRole] = useState<string | null>(null);
  const [confirmedRole, setConfirmedRole] = useState<string | null>(null);
  const [trackAConfirmed, setTrackAConfirmed] = useState<string | null>(null);
  const [trackBConfirmed, setTrackBConfirmed] = useState<string | null>(null);
  const [trackCConfirmed, setTrackCConfirmed] = useState<string | null>(null);
  
  const currentUserRole = "pmu_manager"; // Mock current user
  
  // Track completion status
  const trackAComplete = TRACK_A_SIGNATORIES.every(s => s.status === "signed");
  const trackBComplete = TRACK_B_SIGNATORIES.every(s => s.status === "signed");
  const trackCComplete = TRACK_C_SIGNATORIES.every(s => s.status === "signed");
  const allTracksComplete = trackAComplete && trackBComplete && trackCComplete;
  
  const tracksCompleted = [trackAComplete, trackBComplete, trackCComplete].filter(Boolean).length;
  
  const handleSign = (track: "a" | "b" | "c", role: string) => {
    setSigningRole(role);
    setTimeout(() => {
      setSigningRole(null);
      toast(`Signature recorded — ${ROLE_LABELS[role]} has signed Track ${track.toUpperCase()}`, "success");
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Gate 1 — Budget & Tender Compliance</span>
            </div>
            <h1 className="mt-2 text-xl font-bold text-foreground">{TRACK_A_DATA.project.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">IDP: {TRACK_A_DATA.project.idpRef} · Tender: {TRACK_A_DATA.project.tenderRef}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 text-center">
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <div className="text-lg font-bold text-foreground">{tracksCompleted}/3</div>
              <div className="text-xs text-muted-foreground">Tracks Complete</div>
            </div>
            <div className={`rounded-lg border px-4 py-2 ${allTracksComplete ? "border-success/30 bg-success/10" : "border-warning/30 bg-warning/10"}`}>
              <div className={`text-lg font-bold ${allTracksComplete ? "text-success" : "text-warning"}`}>
                {allTracksComplete ? "GATE 1 OPEN" : "PENDING"}
              </div>
              <div className="text-xs text-muted-foreground">Gate Status</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Track Status Indicator */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-lg border p-4 ${trackAComplete ? "border-success/30 bg-success/5" : "border-border bg-card"}`}>
          <div className="flex items-center gap-2 mb-2">
            {trackAComplete ? <CheckCircle className="h-5 w-5 text-success" /> : <Clock className="h-5 w-5 text-warning" />}
            <span className="font-semibold text-foreground">Track A</span>
          </div>
          <p className="text-xs text-muted-foreground">Financial Approval</p>
          <p className="text-xs text-success mt-1">
            {TRACK_A_SIGNATORIES.filter(s => s.status === "signed").length}/{TRACK_A_SIGNATORIES.length} signed
          </p>
        </div>
        <div className={`rounded-lg border p-4 ${trackBComplete ? "border-success/30 bg-success/5" : "border-border bg-card"}`}>
          <div className="flex items-center gap-2 mb-2">
            {trackBComplete ? <CheckCircle className="h-5 w-5 text-success" /> : <Clock className="h-5 w-5 text-warning" />}
            <span className="font-semibold text-foreground">Track B</span>
          </div>
          <p className="text-xs text-muted-foreground">SCM Compliance</p>
          <p className="text-xs text-success mt-1">
            {TRACK_B_SIGNATORIES.filter(s => s.status === "signed").length}/{TRACK_B_SIGNATORIES.length} signed
          </p>
        </div>
        <div className={`rounded-lg border p-4 ${trackCComplete ? "border-success/30 bg-success/5" : "border-border bg-card"}`}>
          <div className="flex items-center gap-2 mb-2">
            {trackCComplete ? <CheckCircle className="h-5 w-5 text-success" /> : <Clock className="h-5 w-5 text-warning" />}
            <span className="font-semibold text-foreground">Track C</span>
          </div>
          <p className="text-xs text-muted-foreground">Technical Compliance</p>
          <p className="text-xs text-success mt-1">
            {TRACK_C_SIGNATORIES.filter(s => s.status === "signed").length}/{TRACK_C_SIGNATORIES.length} signed
          </p>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setActiveTab("a")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "a" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <DollarSign className="h-4 w-4" />
          Track A — Financial
        </button>
        <button
          onClick={() => setActiveTab("b")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "b" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <ClipboardCheck className="h-4 w-4" />
          Track B — SCM
        </button>
        <button
          onClick={() => setActiveTab("c")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "c" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Wrench className="h-4 w-4" />
          Track C — Technical
        </button>
      </div>
      
      {/* Track Documents */}
      {activeTab === "a" && (
        <TrackADocument
          onSign={(role) => handleSign("a", role)}
          signingRole={signingRole}
          confirmedRole={trackAConfirmed}
          onConfirm={() => setTrackAConfirmed(currentUserRole)}
          signatories={TRACK_A_SIGNATORIES.map(s => s.role === currentUserRole && s.status === "pending" ? { ...s, status: "pending" as const } : s)}
        />
      )}
      
      {activeTab === "b" && (
        <TrackBDocument
          onSign={(role) => handleSign("b", role)}
          signingRole={signingRole}
          confirmedRole={trackBConfirmed}
          onConfirm={() => setTrackBConfirmed(currentUserRole)}
          signatories={TRACK_B_SIGNATORIES}
        />
      )}
      
      {activeTab === "c" && (
        <TrackCDocument
          onSign={(role) => handleSign("c", role)}
          signingRole={signingRole}
          confirmedRole={trackCConfirmed}
          onConfirm={() => setTrackCConfirmed(currentUserRole)}
          signatories={TRACK_C_SIGNATORIES}
        />
      )}
      
      {/* Gate 1 Status */}
      {allTracksComplete && (
        <div className="rounded-lg border-2 border-success/30 bg-success/5 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-success" />
            <h2 className="text-xl font-bold text-success">GATE 1 APPROVED</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            All three tracks have been signed. Tender can now be published on the municipal website and e-tender portal.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-success px-6 py-3 text-sm font-semibold text-white hover:bg-success/90">
            <FileText className="h-4 w-4" />
            Proceed to Tender Publication
          </button>
        </div>
      )}
    </div>
  );
}

function GuardedGate1Page() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><Gate1Page /></RoleGuard>;
}