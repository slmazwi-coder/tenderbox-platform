import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, AlertTriangle, Fingerprint,
  Shield, Award, Clock, Info, ChevronDown, ChevronUp,
  FileText, Eye, Printer, CheckSquare, Square, Loader2,
  AlertOctagon, Scale, Users, DollarSign, FileCheck,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/gate2")({ component: GuardedGate2Page });

const CLIENT_ROLES = ["client_entity"];

// ============================================================
// MOCK DATA - OR Tambo District Municipality / Sizwe Construction
// ============================================================

const TENDER_PARTICULARS = {
  ref: "TBX-2025-0039",
  description: "Rehabilitation of Municipal Road Infrastructure — OR Tambo District Municipality Phase 3",
  entity: "OR Tambo District Municipality",
  advertisedDate: "15 January 2025",
  closingDate: "28 February 2025",
  closingTime: "11:00",
  bidsReceived: 5,
  pce: 12500000,
  pceLower: 11875000,
  pceUpper: 13750000,
  contractForm: "GCC 2015 (Red Book)",
  evaluationSystem: "80/20 — less than R50M municipal contract",
  briefingType: "Compulsory Site Inspection",
  briefingDate: "22 January 2025, 10:00",
  becMembers: [
    { name: "Mr. T. Zwane", role: "SCM Manager (BEC Chairperson)" },
    { name: "Ms. P. Ngcobo", role: "Chief Financial Officer" },
    { name: "Eng. S. Buthelezi", role: "Technical Director" },
    { name: "Mr. M. Zondi", role: "Roads Infrastructure Manager" },
    { name: "Adv. N. Mkhize", role: "Legal Advisor" },
  ],
};

const COMPLIANCE_ITEMS = [
  { id: 1, label: "Valid SARS Tax Clearance Certificate", short: "Tax Clearance" },
  { id: 2, label: "CIDB Registration and Grade Match", short: "CIDB Grade" },
  { id: 3, label: "CSD Registration Active", short: "CSD Status" },
  { id: 4, label: "Compulsory Briefing Attendance", short: "Briefing" },
  { id: 5, label: "SBD 1 — Invitation to Bid (submitted and signed)", short: "SBD 1" },
  { id: 6, label: "SBD 3.3 — Pricing Schedule (submitted and completed)", short: "SBD 3.3" },
  { id: 7, label: "SBD 4 — Declaration of Interest (submitted and signed)", short: "SBD 4" },
  { id: 8, label: "SBD 6.1 — Preference Points Claim (submitted if applicable)", short: "SBD 6.1" },
  { id: 9, label: "SBD 8 — Declaration of Past Supply Chain Practices (submitted)", short: "SBD 8" },
  { id: 10, label: "SBD 9 — Certificate of Independent Bid Determination (submitted)", short: "SBD 9" },
  { id: 11, label: "Valid BBBEE Certificate or sworn affidavit", short: "BBBEE" },
  { id: 12, label: "Company Registration Documents", short: "Company Reg" },
];

interface ComplianceResult {
  bidderId: string;
  bidder: string;
  items: { itemId: number; submitted: boolean; compliant: boolean; reason?: string }[];
  overallPass: boolean;
  disqualifyReason?: string;
}

const COMPLIANCE_RESULTS: ComplianceResult[] = [
  {
    bidderId: "1",
    bidder: "Sizwe Construction (Pty) Ltd",
    items: COMPLIANCE_ITEMS.map((item) => ({ itemId: item.id, submitted: true, compliant: true })),
    overallPass: true,
  },
  {
    bidderId: "2",
    bidder: "Mokoena Civils and Construction",
    items: COMPLIANCE_ITEMS.map((item) => ({ itemId: item.id, submitted: true, compliant: true })),
    overallPass: true,
  },
  {
    bidderId: "3",
    bidder: "Khoza Roadworks (Pty) Ltd",
    items: COMPLIANCE_ITEMS.map((item) => ({ itemId: item.id, submitted: true, compliant: true })),
    overallPass: true,
  },
  {
    bidderId: "4",
    bidder: "Ntuli Civil Works CC",
    items: COMPLIANCE_ITEMS.map((item) => ({
      itemId: item.id,
      submitted: item.id === 6 ? false : true,
      compliant: item.id === 6 ? false : true,
      reason: item.id === 6 ? "SBD 3.3 pricing schedule submitted but Schedule B contains arithmetic errors totaling R45,000. Clarification requested on 2025-03-05 but not received." : undefined,
    })),
    overallPass: false,
    disqualifyReason: "Non-compliant — SBD 3.3 pricing schedule contains unresolved arithmetic errors. Bid disqualified from further evaluation.",
  },
  {
    bidderId: "5",
    bidder: "Dlamini Infrastructure Solutions",
    items: COMPLIANCE_ITEMS.map((item) => ({
      itemId: item.id,
      submitted: item.id === 2 ? false : true,
      compliant: item.id === 2 ? false : true,
      reason: item.id === 2 ? "CIDB registration Grade 4CE — minimum required is Grade 6CE for this contract value." : undefined,
    })),
    overallPass: false,
    disqualifyReason: "Non-compliant — CIDB Grade 4CE does not meet the minimum required Grade 6CE. Bid disqualified from further evaluation.",
  },
];

interface FunctionalityScore {
  bidderId: string;
  bidder: string;
  criteria: { name: string; weighting: number; maxPoints: number; awarded: number; motivation: string }[];
  totalScore: number;
  threshold: number;
  passes: boolean;
}

const FUNCTIONALITY_SCORES: FunctionalityScore[] = [
  {
    bidderId: "1",
    bidder: "Sizwe Construction (Pty) Ltd",
    criteria: [
      { name: "Relevant Project Experience (≥5 similar projects)", weighting: 25, maxPoints: 100, awarded: 92, motivation: "Exceptional track record with 18 completed municipal road rehabilitation projects. References from 4 metros verified including City of Cape Town and Nelson Mandela Bay." },
      { name: "Key Personnel Qualifications & Experience", weighting: 20, maxPoints: 100, awarded: 88, motivation: "Project Manager Pr. Eng (ECSA). Site Agent has 18 years road construction experience. Professional team fully registered." },
      { name: "Methodology and Work Programme", weighting: 20, maxPoints: 100, awarded: 85, motivation: "Detailed methodology with 12-week programme. Critical path identified with float. Traffic management plan included." },
      { name: "Plant and Equipment Availability", weighting: 15, maxPoints: 100, awarded: 90, motivation: "Owns 4 excavators, 3 asphalt pavers, 2 graders. Full fleet available. No reliance on hire equipment." },
      { name: "Financial Capacity", weighting: 10, maxPoints: 100, awarded: 82, motivation: "Audited financials show R22M working capital. Bank letter confirms R15M credit facility." },
      { name: "Health, Safety & Environmental Plan", weighting: 10, maxPoints: 100, awarded: 88, motivation: "OSHAct compliant plan with appointed HCS. Traffic accommodation plan detailed. Environmental management plan approved." },
    ],
    totalScore: 87.4,
    threshold: 60,
    passes: true,
  },
  {
    bidderId: "2",
    bidder: "Mokoena Civils and Construction",
    criteria: [
      { name: "Relevant Project Experience (≥5 similar projects)", weighting: 25, maxPoints: 100, awarded: 78, motivation: "6 completed road projects verified. Smaller scale than required but acceptable. References positive." },
      { name: "Key Personnel Qualifications & Experience", weighting: 20, maxPoints: 100, awarded: 72, motivation: "PM has 10 years experience. Professional registration pending SACNASP verification. Site Agent CVL adequate." },
      { name: "Methodology and Work Programme", weighting: 20, maxPoints: 100, awarded: 68, motivation: "Methodology adequate but programme lacks detail on critical activities. Minor gaps in resource allocation." },
      { name: "Plant and Equipment Availability", weighting: 15, maxPoints: 100, awarded: 65, motivation: "Owns 40% of required equipment. 60% to be hired. Risk mitigation proposed." },
      { name: "Financial Capacity", weighting: 10, maxPoints: 100, awarded: 70, motivation: "R10M working capital shown. Credit facility R8M confirmed. Adequate for contract." },
      { name: "Health, Safety & Environmental Plan", weighting: 10, maxPoints: 100, awarded: 72, motivation: "H&S plan meets minimum requirements. Traffic management adequate. EMP submitted." },
    ],
    totalScore: 71.4,
    threshold: 60,
    passes: true,
  },
  {
    bidderId: "3",
    bidder: "Khoza Roadworks (Pty) Ltd",
    criteria: [
      { name: "Relevant Project Experience (≥5 similar projects)", weighting: 25, maxPoints: 100, awarded: 75, motivation: "7 completed projects. References from 3 municipalities positive. Scale acceptable." },
      { name: "Key Personnel Qualifications & Experience", weighting: 20, maxPoints: 100, awarded: 70, motivation: "PM registered with ECSA. Site Agent experience adequate. Team meets requirements." },
      { name: "Methodology and Work Programme", weighting: 20, maxPoints: 100, awarded: 72, motivation: "Methodology sound. Programme shows 14 weeks. Some methodology gaps but acceptable." },
      { name: "Plant and Equipment Availability", weighting: 15, maxPoints: 100, awarded: 68, motivation: "Equipment list provided. 55% owned. Balance on hire with confirmed quotes." },
      { name: "Financial Capacity", weighting: 10, maxPoints: 100, awarded: 72, motivation: "R8M working capital. Credit facility R6M. Acceptable for contract value." },
      { name: "Health, Safety & Environmental Plan", weighting: 10, maxPoints: 100, awarded: 75, motivation: "H&S plan adequate. Traffic management included. EMP approved." },
    ],
    totalScore: 72.3,
    threshold: 60,
    passes: true,
  },
];

interface PriceScore {
  bidderId: string;
  bidder: string;
  price: number;
  withinPce: boolean;
  pricePoints: number;
  bbbeeLevel: string;
  bbbeePoints: number;
  totalScore: number;
  rank: number;
}

const PRICE_SCORES: PriceScore[] = [
  { bidderId: "1", bidder: "Sizwe Construction (Pty) Ltd", price: 11850000, withinPce: true, pricePoints: 80, bbbeeLevel: "Level 1", bbbeePoints: 20, totalScore: 100, rank: 1 },
  { bidderId: "2", bidder: "Mokoena Civils and Construction", price: 12150000, withinPce: true, pricePoints: 76.02, bbbeeLevel: "Level 2", bbbeePoints: 16, totalScore: 92.02, rank: 2 },
  { bidderId: "3", bidder: "Khoza Roadworks (Pty) Ltd", price: 11450000, withinPce: true, pricePoints: 75.32, bbbeeLevel: "Level 1", bbbeePoints: 20, totalScore: 95.32, rank: 3 },
];

const RED_FLAG_CHECKS = [
  { id: 1, name: "Administrative Compliance", result: "pass" as const, detail: "All submitted bids meet administrative requirements.", severity: "none" },
  { id: 2, name: "SARS Tax Compliance", result: "pass" as const, detail: "All bidders have valid SARS tax clearance certificates.", severity: "none" },
  { id: 3, name: "CIDB Grade Verification", result: "pass" as const, detail: "Qualifying bidders hold required CIDB grades.", severity: "none" },
  { id: 4, name: "CSD Registration Status", result: "pass" as const, detail: "All qualifying bidders active on Central Supplier Database.", severity: "none" },
  { id: 5, name: "Briefing Attendance Confirmed", result: "pass" as const, detail: "All qualifying bidders signed the compulsory briefing register.", severity: "none" },
  { id: 6, name: "Bid Rigging Price Pattern Analysis", result: "pass" as const, detail: "No statistically significant price clustering detected.", severity: "none" },
  { id: 7, name: "Shell Company Detection", result: "pass" as const, detail: "All entities have CIPC active status with trading history > 5 years.", severity: "none" },
  { id: 8, name: "Evaluator Conflict of Interest", result: "pass" as const, detail: "No conflicts declared by any BEC member.", severity: "none" },
  { id: 9, name: "PCE Bracket Compliance", result: "pass" as const, detail: "All qualifying bids fall within PCE bracket (R11.875M - R13.75M).", severity: "none" },
  { id: 10, name: "Abnormally Low Tender Check", result: "pass" as const, detail: "No bid falls below 80% of PCE lower limit.", severity: "none" },
  { id: 11, name: "Beneficial Ownership Cross-Check", result: "pass" as const, detail: "No shared beneficial owners between qualifying bidders found.", severity: "none" },
  { id: 12, name: "Repeat Winner Pattern", result: "pass" as const, detail: "Sizwe Construction won 3 municipal tenders in 2024. Within normal pattern for active contractor.", severity: "none" },
];

const BEC_RECOMMENDATION = {
  recommendedBidder: "Sizwe Construction (Pty) Ltd",
  contractAmount: 11850000,
  vatAmount: 1777500,
  totalAmount: 13627500,
  motivation: "Sizwe Construction (Pty) Ltd achieved the highest combined score (100 points) and demonstrated exceptional capability across all evaluation criteria. The company has an outstanding track record in municipal road infrastructure, with 18 verified completed projects and positive references from multiple metros. Their methodology is comprehensive, plant and equipment is fully owned, and financial capacity is adequate for the contract value. All compliance requirements are met and no red flags were identified.",
  becMembers: [
    { name: "Mr. T. Zwane", role: "SCM Manager (BEC Chairperson)", signed: true, date: "2025-04-15", time: "09:30" },
    { name: "Ms. P. Ngcobo", role: "Chief Financial Officer", signed: true, date: "2025-04-15", time: "11:45" },
    { name: "Eng. S. Buthelezi", role: "Technical Director", signed: true, date: "2025-04-16", time: "14:20" },
    { name: "Mr. M. Zondi", role: "Roads Infrastructure Manager", signed: true, date: "2025-04-16", time: "16:00" },
    { name: "Adv. N. Mkhize", role: "Legal Advisor", signed: true, date: "2025-04-17", time: "10:15" },
  ],
  submittedDate: "17 April 2025",
};

type BacMemberId = "cfo" | "scm" | "tech" | "mm" | "legal";
interface BacMember {
  id: BacMemberId; title: string; name: string; role: string;
  status: "signed" | "in_progress" | "awaiting"; signedAt: string | null;
}

const BAC_MEMBERS: BacMember[] = [
  { id: "cfo", title: "Chief Financial Officer", name: "Ms. P. Ngcobo", role: "CFO", status: "signed", signedAt: "2025-04-20T10:30:00" },
  { id: "scm", title: "SCM Manager", name: "Mr. T. Zwane", role: "SCM Director", status: "signed", signedAt: "2025-04-20T14:45:00" },
  { id: "tech", title: "Technical Evaluator", name: "Eng. S. Buthelezi", role: "Technical Evaluator", status: "awaiting", signedAt: null },
  { id: "mm", title: "Municipal Manager", name: "Mr. S. Mthethwa", role: "Municipal Manager", status: "awaiting", signedAt: null },
  { id: "legal", title: "Legal Advisor", name: "Adv. N. Mkhize", role: "Legal Advisor", status: "awaiting", signedAt: null },
];

const BAC_ORDER: BacMemberId[] = ["cfo", "scm", "tech", "mm", "legal"];

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

function CollapsiblePanel({ title, children, badge }: { title: string; children: React.ReactNode; badge?: { text: string; type: "success" | "danger" } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground">{title}</span>
          {badge && (
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              badge.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
            }`}>
              {badge.text}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
}

// ============================================================
// SECTION 1: TENDER PARTICULARS
// ============================================================

function Section1TenderParticulars() {
  return (
    <div className="space-y-4">
      <SectionHeader number={1} title="TENDER PARTICULARS" />
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tender Reference</p>
              <p className="font-semibold text-foreground">{TENDER_PARTICULARS.ref}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Full Description</p>
              <p className="text-sm text-foreground">{TENDER_PARTICULARS.description}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Issuing Entity</p>
              <p className="text-sm font-medium text-foreground">{TENDER_PARTICULARS.entity}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date of Advertisement</p>
              <p className="text-sm text-foreground">{TENDER_PARTICULARS.advertisedDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Closing Date and Time</p>
              <p className="text-sm text-foreground">{TENDER_PARTICULARS.closingDate} at {TENDER_PARTICULARS.closingTime}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bids Received</p>
              <p className="text-lg font-bold text-foreground">{TENDER_PARTICULARS.bidsReceived}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">PCE Value (ZAR)</p>
              <p className="text-lg font-bold text-primary">{formatZAR(TENDER_PARTICULARS.pce)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">PCE Lower (-5%)</p>
                <p className="text-sm font-medium text-foreground">{formatZAR(TENDER_PARTICULARS.pceLower)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">PCE Upper (+10%)</p>
                <p className="text-sm font-medium text-foreground">{formatZAR(TENDER_PARTICULARS.pceUpper)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contract Form</p>
              <p className="text-sm text-foreground">{TENDER_PARTICULARS.contractForm}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Evaluation System</p>
              <p className="text-sm text-foreground">{TENDER_PARTICULARS.evaluationSystem}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Briefing Type</p>
              <p className="text-sm text-foreground">{TENDER_PARTICULARS.briefingType}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3">BEC Composition</h3>
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {TENDER_PARTICULARS.becMembers.map((member, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-4 py-2">{member.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 2: ADMINISTRATIVE COMPLIANCE
// ============================================================

function Section2Compliance() {
  return (
    <div className="space-y-4">
      <SectionHeader number={2} title="ADMINISTRATIVE COMPLIANCE CHECKLIST" />
      <p className="text-sm text-muted-foreground">Stage 1 — Mandatory documentation check. Bidders failing any required item are disqualified.</p>
      
      {COMPLIANCE_RESULTS.map((result) => (
        <CollapsiblePanel
          key={result.bidderId}
          title={result.bidder}
          badge={{ text: result.overallPass ? "Compliant" : "Disqualified", type: result.overallPass ? "success" : "danger" }}
        >
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Requirement</th>
                <th className="px-3 py-2 text-center font-medium">Submitted</th>
                <th className="px-3 py-2 text-center font-medium">Compliant</th>
                <th className="px-3 py-2 text-left font-medium">Reason (if non-compliant)</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item) => {
                const ci = COMPLIANCE_ITEMS.find(c => c.id === item.itemId);
                return (
                  <tr key={item.itemId} className={item.itemId % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-3 py-2">{ci?.label}</td>
                    <td className="px-3 py-2 text-center">
                      {item.submitted 
                        ? <CheckCircle className="h-4 w-4 text-success mx-auto" />
                        : <XCircle className="h-4 w-4 text-danger mx-auto" />}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.compliant 
                        ? <CheckCircle className="h-4 w-4 text-success mx-auto" />
                        : <XCircle className="h-4 w-4 text-danger mx-auto" />}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {item.reason || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={`mt-4 p-3 rounded-lg ${result.overallPass ? "bg-success/10 border border-success/20" : "bg-danger/10 border border-danger/20"}`}>
            <p className={`font-semibold ${result.overallPass ? "text-success" : "text-danger"}`}>
              {result.overallPass 
                ? "✓ Compliant — Proceeds to Stage 2 (Functionality Evaluation)"
                : `✗ Disqualified — ${result.disqualifyReason}`}
            </p>
          </div>
        </CollapsiblePanel>
      ))}
    </div>
  );
}

// ============================================================
// SECTION 3: FUNCTIONALITY SCORING
// ============================================================

function Section3Functionality() {
  return (
    <div className="space-y-4">
      <SectionHeader number={3} title="FUNCTIONALITY SCORING MATRIX" />
      <p className="text-sm text-muted-foreground">Stage 2 — Only bidders who passed Stage 1 are evaluated. Minimum threshold: {FUNCTIONALITY_SCORES[0]?.threshold} points.</p>
      
      {FUNCTIONALITY_SCORES.map((score) => (
        <div key={score.bidderId} className="border border-border rounded-lg overflow-hidden mb-4">
          <div className="bg-card px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{score.bidder}</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${score.passes ? "text-success" : "text-danger"}`}>
                  Score: {score.totalScore}/100
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  score.passes ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                }`}>
                  {score.passes ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Criterion</th>
                <th className="px-4 py-2 text-center font-medium">Weight</th>
                <th className="px-4 py-2 text-center font-medium">Max Pts</th>
                <th className="px-4 py-2 text-center font-medium">Awarded</th>
                <th className="px-4 py-2 text-center font-medium">Weighted Score</th>
              </tr>
            </thead>
            <tbody>
              {score.criteria.map((c, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2 text-center">{c.weighting}%</td>
                  <td className="px-4 py-2 text-center">{c.maxPoints}</td>
                  <td className="px-4 py-2 text-center font-medium">{c.awarded}</td>
                  <td className="px-4 py-2 text-center">{((c.awarded / c.maxPoints) * c.weighting).toFixed(1)}</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-semibold">
                <td className="px-4 py-3" colSpan={4}>Total Functionality Score</td>
                <td className="px-4 py-3 text-center">{score.totalScore.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
          <div className="p-4 border-t border-border">
            <h4 className="font-medium text-foreground mb-2">BEC Motivation for Scores</h4>
            <div className="space-y-2">
              {score.criteria.map((c, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-foreground">{c.name}:</span>
                  <span className="text-muted-foreground ml-2">{c.motivation}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`p-4 ${score.passes ? "bg-success/10" : "bg-danger/10"}`}>
            <p className={`font-semibold ${score.passes ? "text-success" : "text-danger"}`}>
              {score.passes 
                ? `✓ Meets threshold (${score.threshold} points) — Proceeds to Stage 3`
                : `✗ Below minimum threshold (${score.threshold} points) — Disqualified`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// SECTION 4: PRICE AND BBBEE SCORING
// ============================================================

function Section4PriceScoring() {
  const lowestPrice = Math.min(...PRICE_SCORES.map(p => p.price));
  
  return (
    <div className="space-y-4">
      <SectionHeader number={4} title="PRICE AND BBBEE SCORING" />
      <p className="text-sm text-muted-foreground">Stage 3 — Price and BBBEE points. Highest total score (out of 100) wins.</p>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Bidder Name</th>
              <th className="px-4 py-3 text-right font-medium">Bid Price (ZAR)</th>
              <th className="px-4 py-3 text-center font-medium">Within PCE</th>
              <th className="px-4 py-3 text-center font-medium">Price Points Formula</th>
              <th className="px-4 py-3 text-center font-medium">Price Points</th>
              <th className="px-4 py-3 text-center font-medium">BBBEE Level</th>
              <th className="px-4 py-3 text-center font-medium">BBBEE Points</th>
              <th className="px-4 py-3 text-center font-medium">Total Score</th>
              <th className="px-4 py-3 text-center font-medium">Rank</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_SCORES.map((score) => (
              <tr key={score.bidderId} className={`${score.rank === 1 ? "bg-yellow-50" : ""}`}>
                <td className={`px-4 py-3 font-medium ${score.rank === 1 ? "bg-yellow-50" : ""}`}>{score.bidder}</td>
                <td className={`px-4 py-3 text-right font-mono ${score.rank === 1 ? "bg-yellow-50" : ""}`}>{formatZAR(score.price)}</td>
                <td className={`px-4 py-3 text-center ${score.rank === 1 ? "bg-yellow-50" : ""}`}>
                  {score.withinPce ? <span className="text-success font-medium">Yes</span> : <span className="text-danger font-medium">No</span>}
                </td>
                <td className={`px-4 py-3 text-xs font-mono text-muted-foreground text-center ${score.rank === 1 ? "bg-yellow-50" : ""}`}>
                  80 × (1 − ({formatZAR(score.price)} − {formatZAR(lowestPrice)}) ÷ {formatZAR(lowestPrice)})
                </td>
                <td className={`px-4 py-3 text-center font-semibold ${score.rank === 1 ? "bg-yellow-50" : ""}`}>{score.pricePoints.toFixed(2)}</td>
                <td className={`px-4 py-3 text-center ${score.rank === 1 ? "bg-yellow-50" : ""}`}>{score.bbbeeLevel}</td>
                <td className={`px-4 py-3 text-center ${score.rank === 1 ? "bg-yellow-50" : ""}`}>{score.bbbeePoints}</td>
                <td className={`px-4 py-3 text-center font-bold ${score.rank === 1 ? "bg-yellow-50" : ""}`}>{score.totalScore.toFixed(2)}</td>
                <td className={`px-4 py-3 text-center ${score.rank === 1 ? "bg-yellow-50" : ""}`}>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    score.rank === 1 ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {score.rank}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h4 className="font-semibold text-foreground mb-2">Evaluation Notes</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• All bids fall within PCE bracket ({formatZAR(TENDER_PARTICULARS.pceLower)} to {formatZAR(TENDER_PARTICULARS.pceUpper)})</li>
          <li>• No penalties applied — all bids within acceptable bracket</li>
          <li>• Price scoring formula: 80 × (1 − (Bid − Lowest) ÷ Lowest)</li>
          <li>• Lowest bid: {formatZAR(lowestPrice)} | Highest bid: {formatZAR(Math.max(...PRICE_SCORES.map(p => p.price)))}</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 5: RED FLAG ENGINE
// ============================================================

function Section5RedFlags() {
  const flagCount = RED_FLAG_CHECKS.filter(c => c.result === "flag").length;
  
  return (
    <div className="space-y-4">
      <SectionHeader number={5} title="RED FLAG ENGINE RESULTS" />
      <p className="text-sm text-muted-foreground">Automated integrity checks across 12 verification dimensions.</p>
      
      <div className="grid gap-3">
        {RED_FLAG_CHECKS.map((check) => (
          <div key={check.id} className={`p-4 rounded-lg border ${
            check.result === "flag" ? "bg-red-50 border-red-200" : "bg-card border-border"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                check.result === "pass" ? "bg-success/20 text-success" : "bg-red-100 text-red-600"
              }`}>
                {check.result === "pass" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{check.name}</span>
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                    check.result === "pass" ? "bg-success/10 text-success" : "bg-red-100 text-red-600"
                  }`}>
                    {check.result === "pass" ? "PASS" : "FLAG"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{check.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {flagCount === 0 && (
        <div className="rounded-lg border border-success/20 bg-success/5 p-4">
          <p className="text-success font-medium">✓ All automated integrity checks passed. No red flags identified.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SECTION 6: BEC RECOMMENDATION
// ============================================================

function Section6Recommendation() {
  return (
    <div className="space-y-4">
      <SectionHeader number={6} title="BEC RECOMMENDATION" />
      
      <div className="border-2 border-primary/30 rounded-lg p-6 bg-card">
        <div className="text-center mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Recommended Bidder</p>
          <h3 className="text-xl font-bold text-foreground mt-1">{BEC_RECOMMENDATION.recommendedBidder}</h3>
          <p className="text-sm text-muted-foreground mt-1">Contract Value Excluding VAT</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatZAR(BEC_RECOMMENDATION.contractAmount)}</p>
          <p className="text-sm text-muted-foreground mt-1">VAT ({formatZAR(BEC_RECOMMENDATION.vatAmount)}) | Total: {formatZAR(BEC_RECOMMENDATION.totalAmount)}</p>
        </div>
        
        <div className="border-t border-border pt-4 mb-4">
          <h4 className="font-semibold text-foreground mb-2">Written Motivation</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{BEC_RECOMMENDATION.motivation}</p>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="font-semibold text-foreground mb-3">BEC Members — Signatures</h4>
          <div className="space-y-2">
            {BEC_RECOMMENDATION.becMembers.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{member.date} at {member.time}</p>
                    <p className="text-xs text-success font-medium">Signed</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg text-center">
          <p className="text-sm font-medium text-primary">BEC Report Submitted to BAC: {BEC_RECOMMENDATION.submittedDate}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 7: BAC SIGN-OFF
// ============================================================

function Section7BacSignOff({ 
  sectionsViewed, 
  currentUserId, 
  onSign, 
  onDeviate,
  signingId,
  confirmed,
  onConfirm,
  bac,
}: { 
  sectionsViewed: number; 
  currentUserId: BacMemberId;
  onSign: () => void;
  onDeviate: () => void;
  signingId: string | null;
  confirmed: boolean;
  onConfirm: () => void;
  bac: BacMember[];
}) {
  const currentBacStep = bac.find(m => m.status !== "signed")?.id ?? null;
  const currentMember = bac.find(m => m.id === currentUserId);
  const isCurrentUserTurn = currentUserId === currentBacStep;
  const canSign = isCurrentUserTurn && sectionsViewed >= 6 && confirmed;
  
  return (
    <div className="space-y-4">
      <SectionHeader number={7} title="BAC SIGN-OFF" />
      
      {sectionsViewed < 6 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm text-warning">
              Sections 1–6 must be fully scrolled through before the BAC sign-off becomes available. Continue scrolling to unlock.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {bac.map(member => {
          const isCurrent = member.id === currentBacStep;
          const daysElapsed = member.signedAt 
            ? Math.floor((Date.now() - new Date(member.signedAt).getTime()) / 86400000)
            : member.status !== "signed" 
              ? Math.floor((Date.now() - new Date("2025-04-17").getTime()) / 86400000)
              : 0;
          
          return (
            <div key={member.id} className={[
              "rounded-lg border p-4 transition-all",
              member.status === "signed" ? "border-success/20 bg-success/5" 
                : isCurrent && canSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            ].join(" ")}>
              <div className="flex items-center gap-4">
                <div className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  member.status === "signed" ? "bg-success/20 text-success" 
                    : isCurrent && canSign ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                ].join(" ")}>
                  {member.status === "signed" 
                    ? <CheckCircle className="h-5 w-5" />
                    : isCurrent && canSign 
                    ? <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    : <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.title}</p>
                  {member.status === "signed" && member.signedAt && (
                    <p className="text-xs text-success mt-0.5">Signed {formatDateTime(member.signedAt)}</p>
                  )}
                  {isCurrent && !canSign && sectionsViewed < 6 && (
                    <p className="text-xs text-warning mt-0.5">Pending — scroll through all sections to unlock</p>
                  )}
                  {isCurrent && canSign && (
                    <p className="text-xs text-primary mt-0.5">Your turn — sign below</p>
                  )}
                  {member.status === "awaiting" && !isCurrent && (
                    <p className="text-xs text-muted-foreground mt-0.5">{daysElapsed} days elapsed</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {canSign && currentMember && (
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
          <h4 className="font-semibold text-foreground mb-4">Your Declaration</h4>
          <div className="bg-white rounded-lg p-4 border border-border mb-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              I, {currentMember.name}, in my capacity as {currentMember.role} on the Bid Adjudication Committee of {TENDER_PARTICULARS.entity}, confirm that I have read and considered the full Bid Evaluation Report for tender {TENDER_PARTICULARS.ref} and I ratify the recommendation to award to {BEC_RECOMMENDATION.recommendedBidder} at a contract value of {formatZAR(BEC_RECOMMENDATION.totalAmount)} (ZAR inclusive of VAT).

              I am aware that any deviation from this recommendation will be automatically and irrevocably reported to the Auditor-General of South Africa.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onConfirm} className="flex items-center gap-2">
              {confirmed 
                ? <CheckSquare className="h-5 w-5 text-primary" />
                : <Square className="h-5 w-5 text-muted-foreground" />}
              <span className="text-foreground">I confirm I have read the full Bid Evaluation Report</span>
            </button>
          </div>
          
          <button
            onClick={onSign}
            disabled={!confirmed || signingId !== null}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a365d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a365d]/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signingId === currentUserId 
              ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</>
              : <><Fingerprint className="h-4 w-4" />Sign & Ratify Recommendation</>}
          </button>
          
          <button
            onClick={onDeviate}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Award to Different Bidder
          </button>
        </div>
      )}
      
      <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
        <div className="flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Auditor General Reporting</p>
            <p className="mt-1 text-sm text-muted-foreground">
              All signatures are cryptographically timestamped and tamper-evident. Any BAC recommendation deviating from automated scoring requires written motivation. Inadequate motivation is automatically reported to the Auditor General.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DEVIATION MODAL
// ============================================================

function DeviationModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (justification: string) => void }) {
  const [justification, setJustification] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = () => {
    if (justification.length < 100) {
      setError(`Justification must be at least 100 characters. Currently ${justification.length} characters.`);
      return;
    }
    onSubmit(justification);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-card rounded-lg border shadow-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Deviate from Recommendation</h2>
          <p className="text-sm text-muted-foreground mt-1">Provide written justification for awarding to a different bidder</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-warning">
                This deviation will be automatically reported to the Auditor-General of South Africa and recorded permanently in the audit trail.
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Justification (minimum 100 characters)</label>
            <textarea
              value={justification}
              onChange={(e) => { setJustification(e.target.value); setError(""); }}
              className="w-full h-32 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Provide detailed justification for deviating from the recommended bidder..."
            />
            <p className="text-xs text-muted-foreground mt-1">{justification.length}/100 characters minimum</p>
            {error && <p className="text-xs text-danger mt-1">{error}</p>}
          </div>
        </div>
        <div className="p-6 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            Submit Deviation
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

function Gate2Page() {
  const { toast } = useToast();
  const [view, setView] = useState<"summary" | "full">("summary");
  const [sectionsViewed, setSectionsViewed] = useState(0);
  const [bac, setBac] = useState<BacMember[]>(BAC_MEMBERS);
  const [signingId, setSigningId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showDeviation, setShowDeviation] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const currentUserId: BacMemberId = "tech"; // Mock current user
  const signedCount = bac.filter(m => m.status === "signed").length;
  const flagCount = RED_FLAG_CHECKS.filter(c => c.result === "flag").length;
  
  // Track sections scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1 && idx + 1 > sectionsViewed) {
              setSectionsViewed(idx + 1);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
    
    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [sectionsViewed]);
  
  const handleSign = () => {
    setSigningId(currentUserId);
    setTimeout(() => {
      setBac(prev => prev.map(m =>
        m.id === currentUserId ? { ...m, status: "signed" as const, signedAt: new Date().toISOString() } : m
      ));
      setSigningId(null);
      setConfirmed(false);
      toast(`Signature recorded — ${BAC_MEMBERS.find(m => m.id === currentUserId)?.name} has signed`, "success");
    }, 2000);
  };
  
  const handleDeviation = (justification: string) => {
    toast(`Deviation submitted — logged to audit trail and reported to Auditor-General`, "warning");
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
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Gate 2 — Bid Adjudication</span>
            </div>
            <h1 className="mt-2 text-xl font-bold text-foreground">{TENDER_PARTICULARS.ref}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{TENDER_PARTICULARS.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 text-center">
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <div className="text-lg font-bold text-foreground">{TENDER_PARTICULARS.bidsReceived}</div>
              <div className="text-xs text-muted-foreground">Bids Received</div>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <div className="text-lg font-bold text-success">{COMPLIANCE_RESULTS.filter(r => r.overallPass).length}</div>
              <div className="text-xs text-muted-foreground">Passed Stage 1</div>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <div className="text-lg font-bold text-primary">{signedCount}/{bac.length}</div>
              <div className="text-xs text-muted-foreground">BAC Signed</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setView("summary")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${view === "summary" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Eye className="h-4 w-4" />
          Summary View
        </button>
        <button
          onClick={() => setView("full")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${view === "full" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <FileText className="h-4 w-4" />
          Full BER View
        </button>
      </div>
      
      {/* Summary View */}
      {view === "summary" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Recommended Bidder</span>
              </div>
              <p className="text-lg font-bold text-foreground">{BEC_RECOMMENDATION.recommendedBidder}</p>
              <p className="text-sm text-muted-foreground">{formatZAR(BEC_RECOMMENDATION.contractAmount)}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-semibold text-foreground">Stage 1 Results</span>
              </div>
              <p className="text-lg font-bold text-success">{COMPLIANCE_RESULTS.filter(r => r.overallPass).length} Passed</p>
              <p className="text-sm text-muted-foreground">{COMPLIANCE_RESULTS.filter(r => !r.overallPass).length} Disqualified</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">BAC Status</span>
              </div>
              <p className="text-lg font-bold text-primary">{signedCount}/{bac.length} Signed</p>
              <p className="text-sm text-muted-foreground">{flagCount} red flags raised</p>
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="bg-muted/60 px-6 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Evaluation Summary</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Bidder</th>
                  <th className="px-6 py-3 font-medium text-center">Stage 1</th>
                  <th className="px-6 py-3 font-medium text-center">Stage 2</th>
                  <th className="px-6 py-3 font-medium text-center">Stage 3</th>
                  <th className="px-6 py-3 font-medium text-center">Rank</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bidder: "Sizwe Construction (Pty) Ltd", s1: true, s2: 87.4, s3: 100, rank: 1 },
                  { bidder: "Khoza Roadworks (Pty) Ltd", s1: true, s2: 72.3, s3: 95.32, rank: 3 },
                  { bidder: "Mokoena Civils and Construction", s1: true, s2: 71.4, s3: 92.02, rank: 2 },
                  { bidder: "Ntuli Civil Works CC", s1: false, s2: null, s3: null, rank: "—" },
                  { bidder: "Dlamini Infrastructure Solutions", s1: false, s2: null, s3: null, rank: "—" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                    <td className="px-6 py-3 font-medium">{row.bidder}</td>
                    <td className="px-6 py-3 text-center">
                      {row.s1 ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : <XCircle className="h-4 w-4 text-danger mx-auto" />}
                    </td>
                    <td className="px-6 py-3 text-center">{row.s2 !== null ? `${row.s2}/100` : "—"}</td>
                    <td className="px-6 py-3 text-center">{row.s3 !== null ? row.s3.toFixed(2) : "—"}</td>
                    <td className="px-6 py-3 text-center">
                      {typeof row.rank === "number" ? (
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${row.rank === 1 ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"}`}>
                          {row.rank}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            onClick={() => setView("full")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <FileText className="h-4 w-4" />
            View Full Bid Evaluation Report
          </button>
        </div>
      )}
      
      {/* Full BER View */}
      {view === "full" && (
        <div className="space-y-8">
          <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Printer className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">FULL BID EVALUATION REPORT</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {TENDER_PARTICULARS.entity} · Tender {TENDER_PARTICULARS.ref} · Generated {formatDate(new Date().toISOString())}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              BAC members must read all sections before signing. This document is cryptographically sealed.
            </p>
          </div>
          
          <div ref={(el) => { sectionRefs.current[0] = el; }}>
            <Section1TenderParticulars />
          </div>
          
          <div ref={(el) => { sectionRefs.current[1] = el; }}>
            <Section2Compliance />
          </div>
          
          <div ref={(el) => { sectionRefs.current[2] = el; }}>
            <Section3Functionality />
          </div>
          
          <div ref={(el) => { sectionRefs.current[3] = el; }}>
            <Section4PriceScoring />
          </div>
          
          <div ref={(el) => { sectionRefs.current[4] = el; }}>
            <Section5RedFlags />
          </div>
          
          <div ref={(el) => { sectionRefs.current[5] = el; }}>
            <Section6Recommendation />
          </div>
          
          <div ref={(el) => { sectionRefs.current[6] = el; }}>
            <Section7BacSignOff 
              sectionsViewed={sectionsViewed}
              currentUserId={currentUserId}
              onSign={handleSign}
              onDeviate={() => setShowDeviation(true)}
              signingId={signingId}
              confirmed={confirmed}
              onConfirm={() => setConfirmed(!confirmed)}
              bac={bac}
            />
          </div>
          
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
            <p>Tenderbox Platform · {TENDER_PARTICULARS.entity} · Tender {TENDER_PARTICULARS.ref}</p>
            <p className="mt-1">This document was automatically generated and is legally binding. All timestamps are in South African Standard Time (SAST).</p>
          </div>
        </div>
      )}
      
      <DeviationModal 
        isOpen={showDeviation} 
        onClose={() => setShowDeviation(false)} 
        onSubmit={handleDeviation}
      />
    </div>
  );
}

function GuardedGate2Page() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><Gate2Page /></RoleGuard>;
}