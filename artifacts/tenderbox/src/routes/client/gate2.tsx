import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, AlertTriangle, Fingerprint,
  Shield, Award, Clock, Info, ChevronDown, ChevronUp,
  FileText, Eye, Printer, CheckSquare, Square, Loader2,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { RoleGuard } from "@/components/RoleGuard";

export const Route = createFileRoute("/client/gate2")({ component: GuardedGate2Page });

const CLIENT_ROLES = ["client_entity"];

// ============================================================
// MOCK DATA
// ============================================================

const TENDER_PARTICULARS = {
  ref: "TBX-2026-0039",
  description: "Sewer Reticulation Network Phase 2 — Diepkloof Township",
  entity: "Amathole District Municipality",
  advertisedDate: "01 April 2026",
  closingDate: "15 May 2026",
  closingTime: "11:00",
  bidsReceived: 5,
  pce: 8500000,
  pceLower: 8075000,
  pceUpper: 9350000,
  contractForm: "GCC 2015 (Red Book)",
  evaluationSystem: "80/20 — less than R50M municipal contract",
  briefingType: "Compulsory Site Inspection",
  briefingDate: "08 April 2026, 10:00",
  becMembers: [
    { name: "Ms. N. Dlamini", role: "SCM Manager (BEC Chairperson)" },
    { name: "Mr. R. van Wyk", role: "Chief Financial Officer" },
    { name: "Eng. K. Mokoena", role: "Technical Engineer" },
    { name: "Mr. S. Mahlangu", role: "Municipal Infrastructure Expert" },
    { name: "Adv. P. Cele", role: "Legal Advisor" },
  ],
};

const COMPLIANCE_ITEMS = [
  { id: 1, label: "Valid Tax Clearance Certificate (SARS TCS)", required: true },
  { id: 2, label: "CIDB Registration and Grade (CE 6 or higher)", required: true },
  { id: 3, label: "CSD Registration Status (Active)", required: true },
  { id: 4, label: "Compulsory Briefing Attendance", required: true },
  { id: 5, label: "SBD 1 — Invitation to Bid (submitted and signed)", required: true },
  { id: 6, label: "SBD 3.3 — Pricing Schedule (submitted and completed)", required: true },
  { id: 7, label: "SBD 4 — Declaration of Interest (submitted and signed)", required: true },
  { id: 8, label: "SBD 6.1 — Preference Points Claim (submitted if applicable)", required: false },
  { id: 9, label: "SBD 8 — Declaration of Bidder Past SCM Practices (submitted)", required: true },
  { id: 10, label: "SBD 9 — Certificate of Independent Bid Determination (submitted)", required: true },
  { id: 11, label: "Valid BBBEE Certificate or Sworn Affidavit", required: true },
  { id: 12, label: "Company Registration Documents (CIPR/CIPC)", required: true },
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
    bidder: "Mokoena Infrastructure Group",
    items: COMPLIANCE_ITEMS.map((item) => ({ itemId: item.id, submitted: true, compliant: true })),
    overallPass: true,
  },
  {
    bidderId: "3",
    bidder: "Ntuli Civil Works CC",
    items: COMPLIANCE_ITEMS.map((item) => ({ 
      itemId: item.id, 
      submitted: item.id !== 8 || true,
      compliant: item.id !== 6 || true,
      reason: item.id === 6 ? "Pricing schedule has arithmetic errors in Schedule A" : undefined
    })),
    overallPass: false,
    disqualifyReason: "SBD 3.3 non-compliant — pricing schedule contains arithmetic errors that were not resolved during clarification.",
  },
  {
    bidderId: "4",
    bidder: "Khoza Engineering (Pty) Ltd",
    items: COMPLIANCE_ITEMS.map((item) => ({ itemId: item.id, submitted: true, compliant: true })),
    overallPass: true,
  },
  {
    bidderId: "5",
    bidder: "Ndaba Projects CC",
    items: COMPLIANCE_ITEMS.map((item) => ({ 
      itemId: item.id, 
      submitted: item.id !== 2 ? true : false,
      compliant: item.id !== 2 ? true : false,
      reason: item.id === 2 ? "CIDB registration Grade 4CE — does not meet minimum Grade 6CE requirement" : undefined
    })),
    overallPass: false,
    disqualifyReason: "CIDB Grade 4CE does not meet the minimum required Grade 6CE for this tender.",
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
      { name: "Relevant Project Experience (≥5 similar projects)", weighting: 25, maxPoints: 100, awarded: 88, motivation: "Excellent track record with 12 completed municipal sewer projects. References from City of Johannesburg and Ekurhuleni verified." },
      { name: "Key Personnel Qualifications & Experience", weighting: 20, maxPoints: 100, awarded: 85, motivation: "Project Manager Pr. Eng registered. Site Agent has 15 years sewer installation experience. Team composition meets requirements." },
      { name: "Methodology and Work Programme", weighting: 20, maxPoints: 100, awarded: 92, motivation: "Comprehensive methodology with detailed programme. Critical path identified. Resource histogram included. Phased approach appropriate for scope." },
      { name: "Plant and Equipment Availability", weighting: 15, maxPoints: 100, awarded: 90, motivation: "Owns 3 excavators, 2 compactors, pipe laser system. No reliance on hire equipment. Maintenance records submitted." },
      { name: "Financial Capacity", weighting: 10, maxPoints: 100, awarded: 85, motivation: "Audited financials show R15M working capital. Bank letter confirms R8M credit facility. Adequate for contract value." },
      { name: "Health, Safety & Environmental Plan", weighting: 10, maxPoints: 100, awarded: 88, motivation: "OSHAct compliant plan with appointed HCS. Environmental impact assessment submitted. Fall protection and confined space procedures detailed." },
    ],
    totalScore: 88.4,
    threshold: 70,
    passes: true,
  },
  {
    bidderId: "2",
    bidder: "Mokoena Infrastructure Group",
    criteria: [
      { name: "Relevant Project Experience (≥5 similar projects)", weighting: 25, maxPoints: 100, awarded: 78, motivation: "8 completed projects verified. Smaller scale than required but quality acceptable. Client references positive." },
      { name: "Key Personnel Qualifications & Experience", weighting: 20, maxPoints: 100, awarded: 80, motivation: "PM has 8 years experience. Professional registration pending verification. Site Agent CVL submitted." },
      { name: "Methodology and Work Programme", weighting: 20, maxPoints: 100, awarded: 82, motivation: "Methodology adequate. Programme shows 18-month duration. Some methodology gaps identified but acceptable." },
      { name: "Plant and Equipment Availability", weighting: 15, maxPoints: 100, awarded: 75, motivation: "Some equipment to be hired. Owns 60% of required. Acceptable risk mitigation proposed." },
      { name: "Financial Capacity", weighting: 10, maxPoints: 100, awarded: 80, motivation: "R8M working capital shown. Bank letter provided for R5M facility. Adequate for contract value." },
      { name: "Health, Safety & Environmental Plan", weighting: 10, maxPoints: 100, awarded: 85, motivation: "Comprehensive H&S plan. OHSAct compliance confirmed. Environmental management plan detailed." },
    ],
    totalScore: 79.6,
    threshold: 70,
    passes: true,
  },
  {
    bidderId: "4",
    bidder: "Khoza Engineering (Pty) Ltd",
    criteria: [
      { name: "Relevant Project Experience (≥5 similar projects)", weighting: 25, maxPoints: 100, awarded: 72, motivation: "5 projects completed. Scale comparable. References from 3 municipalities received and verified." },
      { name: "Key Personnel Qualifications & Experience", weighting: 20, maxPoints: 100, awarded: 70, motivation: "PM registered with ECSA. Site Agent CV requires updating. Team structure acceptable." },
      { name: "Methodology and Work Programme", weighting: 20, maxPoints: 100, awarded: 68, motivation: "Basic methodology provided. Programme needs clarification on critical activities. Minor gaps noted." },
      { name: "Plant and Equipment Availability", weighting: 15, maxPoints: 100, awarded: 72, motivation: "Equipment list provided. 70% owned, remainder on hire. Risk acceptable." },
      { name: "Financial Capacity", weighting: 10, maxPoints: 100, awarded: 78, motivation: "Audited financials show R6M working capital. Credit facility R4M confirmed." },
      { name: "Health, Safety & Environmental Plan", weighting: 10, maxPoints: 100, awarded: 74, motivation: "H&S plan meets minimum requirements. OSHA compliance confirmed. EMP submitted." },
    ],
    totalScore: 72.2,
    threshold: 70,
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
  penalty?: string;
}

const PRICE_SCORES: PriceScore[] = [
  { bidderId: "1", bidder: "Sizwe Construction (Pty) Ltd", price: 7840000, withinPce: true, pricePoints: 80, bbbeeLevel: "Level 1", bbbeePoints: 20, totalScore: 100, rank: 1 },
  { bidderId: "4", bidder: "Khoza Engineering (Pty) Ltd", price: 6880000, withinPce: true, pricePoints: 72.35, bbbeeLevel: "Level 1", bbbeePoints: 20, totalScore: 92.35, rank: 2 },
  { bidderId: "2", bidder: "Mokoena Infrastructure Group", price: 7120000, withinPce: true, pricePoints: 76.08, bbbeeLevel: "Level 2", bbbeePoints: 16, totalScore: 92.08, rank: 3 },
];

const INTEGRITY_CHECKS = [
  { id: 1, name: "Duplicate IP Submission Detection", result: "pass" as const, detail: "All 4 bids submitted from distinct IP addresses with no geographic overlap.", severity: "none" },
  { id: 2, name: "Document Template Fingerprint Match", result: "pass" as const, detail: "No shared formatting artifacts, macros, or metadata detected between competing bid documents.", severity: "none" },
  { id: 3, name: "Price Clustering Analysis", result: "pass" as const, detail: "Bid prices show normal market spread (R6.88M to R7.84M). No clustering within 5% band.", severity: "none" },
  { id: 4, name: "Director Cross-Reference Check", result: "pass" as const, detail: "No shared directors, shareholders, or beneficial owners between competing bidders found in CIPC database.", severity: "none" },
  { id: 5, name: "Shell Company Registry Scan", result: "pass" as const, detail: "All 4 entities have CIPC active status with trading history exceeding 5 years. No dormant or shelf companies detected.", severity: "none" },
  { id: 6, name: "Abnormally Low Bid Price Detection", result: "pass" as const, detail: "Lowest bid (R6.88M) is 19% below PCE. No bid falls below 80% of PCE threshold.", severity: "none" },
  { id: 7, name: "CIDB Grade Verification", result: "pass" as const, detail: "All qualifying bidders hold valid CIDB Grade 6CE or higher. Grades verified via CIDB API.", severity: "none" },
  { id: 8, name: "CSD Registration Currency", result: "pass" as const, detail: "All 4 bidders are active and current on Central Supplier Database. No restricted suppliers identified.", severity: "none" },
  { id: 9, name: "Tax Clearance Verification", result: "pass" as const, detail: "SARS tax clearance confirmed for all 4 bidders via live TCS API. Valid for minimum 30 days.", severity: "none" },
  { id: 10, name: "B-BBEE Certificate Authenticity", result: "pass" as const, detail: "All B-BBEE certificates verified against SANAS accredited verification agencies. Levels confirmed.", severity: "none" },
  { id: 11, name: "Compulsory Briefing Attendance Confirmed", result: "pass" as const, detail: "All 4 bidders signed the compulsory briefing register on 08 April 2026. Attendance verified.", severity: "none" },
  { id: 12, name: "Submission Time Pattern Analysis", result: "flag" as const, detail: "Ndaba Projects CC submitted exactly 3 minutes before closing. This submission pattern (3-min pre-deadline) detected in 2 prior municipal tenders where those bids were later disqualified. RECOMMENDATION: Enhanced scrutiny of this bidder's pricing and methodology.", severity: "high" },
];

const BEC_RECOMMENDATION = {
  recommendedBidder: "Sizwe Construction (Pty) Ltd",
  contractAmount: 7840000,
  motivation: "Sizwe Construction (Pty) Ltd achieved the highest combined score (100 points) meeting all evaluation criteria. The company has extensive experience with similar municipal sewer projects, qualified personnel, adequate financial capacity, and a comprehensive methodology. All compliance requirements met. No red flags identified in the integrity checks.",
  becMembers: [
    { name: "Ms. N. Dlamini", role: "SCM Manager", signed: true, date: "2026-06-04" },
    { name: "Mr. R. van Wyk", role: "Chief Financial Officer", signed: true, date: "2026-06-04" },
    { name: "Eng. K. Mokoena", role: "Technical Engineer", signed: true, date: "2026-06-04" },
    { name: "Mr. S. Mahlangu", role: "Municipal Infrastructure Expert", signed: true, date: "2026-06-04" },
    { name: "Adv. P. Cele", role: "Legal Advisor", signed: true, date: "2026-06-04" },
  ],
  signOffDate: "04 June 2026",
};

type BacMemberId = "cfo" | "scm" | "tech" | "mm" | "legal";
interface BacMember {
  id: BacMemberId; title: string; name: string; role: string;
  status: "signed" | "in_progress" | "awaiting"; signedAt: string | null;
}

const BAC_MEMBERS: BacMember[] = [
  { id: "cfo", title: "Chief Financial Officer", name: "Mr. R. van Wyk", role: "CFO", status: "signed", signedAt: "2026-06-04T10:15:00" },
  { id: "scm", title: "SCM Manager", name: "Ms. N. Dlamini", role: "SCM Director", status: "signed", signedAt: "2026-06-04T14:30:00" },
  { id: "tech", title: "Technical Expert", name: "Eng. K. Mokoena", role: "Technical Evaluator", status: "awaiting", signedAt: null },
  { id: "mm", title: "Municipal Manager Representative", name: "Mr. S. Mahlangu", role: "Municipal Manager", status: "awaiting", signedAt: null },
  { id: "legal", title: "Legal Advisor", name: "Adv. P. Cele", role: "Legal Advisor", status: "awaiting", signedAt: null },
];

const BAC_ORDER: BacMemberId[] = ["cfo", "scm", "tech", "mm", "legal"];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatDateTime(d: string): string {
  return new Date(d).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2nd" });
}

// ============================================================
// COMPONENTS
// ============================================================

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b-2 border-primary/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {number}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}

function CollapsiblePanel({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
      >
        <span className="font-medium text-foreground">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
}

// ============================================================
// SECTIONS
// ============================================================

function Section1TenderParticulars() {
  return (
    <div className="space-y-4">
      <SectionHeader number={1} title="TENDER PARTICULARS" />
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div><span className="font-semibold text-muted-foreground">Tender Reference:</span> <span className="text-foreground">{TENDER_PARTICULARS.ref}</span></div>
          <div><span className="font-semibold text-muted-foreground">Issuing Entity:</span> <span className="text-foreground">{TENDER_PARTICULARS.entity}</span></div>
          <div className="col-span-2"><span className="font-semibold text-muted-foreground">Description:</span> <span className="text-foreground">{TENDER_PARTICULARS.description}</span></div>
          <div><span className="font-semibold text-muted-foreground">Date of Advertisement:</span> <span className="text-foreground">{TENDER_PARTICULARS.advertisedDate}</span></div>
          <div><span className="font-semibold text-muted-foreground">Closing Date:</span> <span className="text-foreground">{TENDER_PARTICULARS.closingDate} at {TENDER_PARTICULARS.closingTime}</span></div>
          <div><span className="font-semibold text-muted-foreground">Bids Received:</span> <span className="text-foreground font-bold">{TENDER_PARTICULARS.bidsReceived}</span></div>
          <div><span className="font-semibold text-muted-foreground">Evaluation System:</span> <span className="text-foreground">{TENDER_PARTICULARS.evaluationSystem}</span></div>
          <div><span className="font-semibold text-muted-foreground">PCE Value:</span> <span className="text-foreground font-bold">{formatZAR(TENDER_PARTICULARS.pce)}</span></div>
          <div><span className="font-semibold text-muted-foreground">PCE Lower Bracket (-5%):</span> <span className="text-foreground">{formatZAR(TENDER_PARTICULARS.pceLower)}</span></div>
          <div><span className="font-semibold text-muted-foreground">PCE Upper Bracket (+10%):</span> <span className="text-foreground">{formatZAR(TENDER_PARTICULARS.pceUpper)}</span></div>
          <div><span className="font-semibold text-muted-foreground">Contract Form:</span> <span className="text-foreground">{TENDER_PARTICULARS.contractForm}</span></div>
          <div><span className="font-semibold text-muted-foreground">Briefing Type:</span> <span className="text-foreground">{TENDER_PARTICULARS.briefingType}</span></div>
          <div><span className="font-semibold text-muted-foreground">Briefing Date:</span> <span className="text-foreground">{TENDER_PARTICULARS.briefingDate}</span></div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3">BEC Composition</h3>
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Role</th>
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

function Section2Compliance() {
  return (
    <div className="space-y-4">
      <SectionHeader number={2} title="ADMINISTRATIVE COMPLIANCE CHECKLIST" />
      <p className="text-sm text-muted-foreground">Stage 1 — Mandatory documentation check. Bidders who fail any required item are disqualified.</p>
      
      {COMPLIANCE_RESULTS.map((result) => (
        <CollapsiblePanel key={result.bidderId} title={`${result.bidder} — ${result.overallPass ? "✓ Compliant" : "✗ Disqualified"}`}>
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Requirement</th>
                <th className="px-3 py-2 font-medium text-center">Submitted</th>
                <th className="px-3 py-2 font-medium text-center">Compliant</th>
                <th className="px-3 py-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item) => {
                const complianceItem = COMPLIANCE_ITEMS.find(ci => ci.id === item.itemId);
                return (
                  <tr key={item.itemId} className={item.itemId % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="px-3 py-2">{complianceItem?.label}</td>
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
                    <td className="px-3 py-2 text-muted-foreground text-xs">{item.reason || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={`mt-4 p-3 rounded-lg ${result.overallPass ? "bg-success/10 border border-success/20" : "bg-danger/10 border border-danger/20"}`}>
            <p className={`font-semibold ${result.overallPass ? "text-success" : "text-danger"}`}>
              {result.overallPass 
                ? "✓ Compliant — Proceed to Stage 2 (Functionality Evaluation)"
                : `✗ Disqualified — ${result.disqualifyReason}`}
            </p>
          </div>
        </CollapsiblePanel>
      ))}
    </div>
  );
}

function Section3Functionality() {
  return (
    <div className="space-y-4">
      <SectionHeader number={3} title="FUNCTIONALITY SCORING MATRIX" />
      <p className="text-sm text-muted-foreground">Stage 2 — Only bidders who passed Stage 1 are evaluated. Minimum threshold: 70 points out of 100.</p>
      
      {FUNCTIONALITY_SCORES.map((score) => (
        <div key={score.bidderId} className="border border-border rounded-lg overflow-hidden mb-4">
          <div className="bg-card px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{score.bidder}</span>
              <span className={`text-sm font-medium ${score.passes ? "text-success" : "text-danger"}`}>
                Score: {score.totalScore}/100 — {score.passes ? "✓ Passes" : "✗ Below Threshold"}
              </span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Criterion</th>
                <th className="px-4 py-2 font-medium text-center">Weight (%)</th>
                <th className="px-4 py-2 font-medium text-center">Max Points</th>
                <th className="px-4 py-2 font-medium text-center">Awarded</th>
                <th className="px-4 py-2 font-medium text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {score.criteria.map((c, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2 text-center">{c.weighting}%</td>
                  <td className="px-4 py-2 text-center">{c.maxPoints}</td>
                  <td className="px-4 py-2 text-center font-medium">{c.awarded}</td>
                  <td className="px-4 py-2 text-center">{((c.awarded / c.maxPoints) * c.weighting).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-primary/10 font-semibold">
                <td className="px-4 py-3" colSpan={4}>Total Functionality Score</td>
                <td className="px-4 py-3 text-center">{score.totalScore.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
          <div className="p-4 bg-muted/30 border-t border-border">
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
                ? `✓ Meets threshold (${score.threshold}%) — Proceed to Stage 3 (Price & BBBEE)`
                : `✗ Below minimum threshold (${score.threshold}%) — Disqualified`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section4PriceScoring() {
  const lowestPrice = Math.min(...PRICE_SCORES.map(p => p.price));
  
  return (
    <div className="space-y-4">
      <SectionHeader number={4} title="PRICE AND BBBEE SCORING" />
      <p className="text-sm text-muted-foreground">Stage 3 — Price and BBBEE points (80/20 system). Highest total score wins.</p>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Bidder</th>
              <th className="px-4 py-3 font-medium text-right">Bid Price (ZAR)</th>
              <th className="px-4 py-3 font-medium text-center">Within PCE</th>
              <th className="px-4 py-3 font-medium text-center">Price Points Formula</th>
              <th className="px-4 py-3 font-medium text-center">Price Points</th>
              <th className="px-4 py-3 font-medium text-center">BBBEE Level</th>
              <th className="px-4 py-3 font-medium text-center">BBBEE Points</th>
              <th className="px-4 py-3 font-medium text-center">Total Score</th>
              <th className="px-4 py-3 font-medium text-center">Rank</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_SCORES.map((score) => {
              return (
                <tr key={score.bidderId} className={score.rank === 1 ? "bg-primary/10" : ""}>
                  <td className="px-4 py-3 font-medium">{score.bidder}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatZAR(score.price)}</td>
                  <td className="px-4 py-3 text-center">
                    {score.withinPce 
                      ? <CheckCircle className="h-4 w-4 text-success mx-auto" />
                      : <AlertTriangle className="h-4 w-4 text-warning mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground text-center">
                    80 × (1 - ({formatZAR(score.price)} - {formatZAR(lowestPrice)}) / {formatZAR(lowestPrice)})
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">{score.pricePoints.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">{score.bbbeeLevel}</td>
                  <td className="px-4 py-3 text-center">{score.bbbeePoints}</td>
                  <td className="px-4 py-3 text-center font-bold">{score.totalScore.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${score.rank === 1 ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                      {score.rank}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <h4 className="font-semibold text-foreground mb-2">Evaluation Notes</h4>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>All bids fall within PCE bracket ({formatZAR(TENDER_PARTICULARS.pceLower)} to {formatZAR(TENDER_PARTICULARS.pceUpper)})</li>
          <li>PCE Range: {formatZAR(TENDER_PARTICULARS.pceLower)} to {formatZAR(TENDER_PARTICULARS.pceUpper)}</li>
          <li>Lowest evaluated bid: {formatZAR(lowestPrice)}</li>
          <li>Highest evaluated bid: {formatZAR(Math.max(...PRICE_SCORES.map(p => p.price)))}</li>
        </ul>
      </div>
    </div>
  );
}

function Section5RedFlags() {
  const flagCount = INTEGRITY_CHECKS.filter(c => c.result === "flag").length;
  
  return (
    <div className="space-y-4">
      <SectionHeader number={5} title="RED FLAG ENGINE RESULTS" />
      <p className="text-sm text-muted-foreground">Automated integrity checks across 12 verification dimensions. Flags require BAC consideration.</p>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="px-4 py-3 font-medium w-8">#</th>
              <th className="px-4 py-3 font-medium">Check Name</th>
              <th className="px-4 py-3 font-medium text-center">Result</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {INTEGRITY_CHECKS.map((check) => (
              <tr key={check.id} className={check.result === "flag" ? "bg-warning/10" : ""}>
                <td className="px-4 py-3 text-muted-foreground">{check.id}</td>
                <td className="px-4 py-3 font-medium">{check.name}</td>
                <td className="px-4 py-3 text-center">
                  {check.result === "pass" 
                    ? <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success">
                        <CheckCircle className="h-3 w-3" /> Pass
                      </span>
                    : <span className="inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                        <AlertTriangle className="h-3 w-3" /> Flag
                      </span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-md">
                  <span className={check.severity === "high" ? "text-warning font-medium" : ""}>
                    {check.detail}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {flagCount > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Red Flag — Enhanced Scrutiny Required</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {flagCount} automated check(s) flagged. BAC must consider flagged bids with enhanced scrutiny. 
                BAC deviation from automated recommendation must be recorded with written motivation. 
                Material deviations are automatically reported to the Auditor General.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section6Recommendation() {
  return (
    <div className="space-y-4">
      <SectionHeader number={6} title="BEC RECOMMENDATION" />
      
      <div className="border-2 border-primary/30 rounded-lg p-6 bg-card">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Recommendation</p>
          <h3 className="text-xl font-bold text-foreground mt-1">{BEC_RECOMMENDATION.recommendedBidder}</h3>
          <p className="text-2xl font-bold text-primary mt-2">{formatZAR(BEC_RECOMMENDATION.contractAmount)}</p>
        </div>
        
        <div className="border-t border-border pt-4 mb-4">
          <h4 className="font-semibold text-foreground mb-2">Motivation</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{BEC_RECOMMENDATION.motivation}</p>
        </div>
        
        <div className="border-t border-border pt-4">
          <h4 className="font-semibold text-foreground mb-3">BEC Members — Signatures</h4>
          <div className="space-y-3">
            {BEC_RECOMMENDATION.becMembers.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <CheckCircle className="h-5 w-5 text-success mb-1 ml-auto" />
                  <p className="text-xs text-success font-medium">Signed {member.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg text-center">
          <p className="text-sm font-medium text-primary">BEC Sign-off Date: {BEC_RECOMMENDATION.signOffDate}</p>
        </div>
      </div>
    </div>
  );
}

function Section7BacSignOff({ sectionsViewed, currentUserId }: { sectionsViewed: number; currentUserId: BacMemberId }) {
  const { toast } = useToast();
  const [bac, setBac] = useState<BacMember[]>(BAC_MEMBERS);
  const [signingId, setSigningId] = useState<BacMemberId | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  
  const currentBacStep = bac.find(m => m.status !== "signed")?.id ?? null;
  
  const canCurrentUserSign = currentUserId === currentBacStep && sectionsViewed >= 7;
  
  const handleSign = (memberId: BacMemberId) => {
    if (memberId !== currentBacStep || !confirmed) return;
    setSigningId(memberId);
    setTimeout(() => {
      setBac(prev => {
        const updated = prev.map(m =>
          m.id === memberId ? { ...m, status: "signed" as const, signedAt: new Date().toISOString() } : m
        );
        const nextIdx = BAC_ORDER.indexOf(memberId) + 1;
        const next = updated[nextIdx];
        if (next) {
          setTimeout(() => toast(`Notification sent to ${next.title} ${next.name}`, "info"), 100);
        } else {
          setTimeout(() => toast("BAC quorum complete — award submitted to Municipal Manager", "success"), 100);
        }
        return updated;
      });
      setSigningId(null);
      setConfirmed(false);
    }, 2000);
  };
  
  const currentMember = bac.find(m => m.id === currentUserId);
  
  return (
    <div className="space-y-4">
      <SectionHeader number={7} title="BAC SIGN-OFF" />
      
      {!canCurrentUserSign && sectionsViewed < 7 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm text-warning font-medium">
              Sections 1–6 must be viewed before the BAC sign-off becomes available. 
              Scroll through all sections to unlock this area.
            </p>
          </div>
        </div>
      )}
      
      {canCurrentUserSign && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Bid Adjudication Committee — Electronic Sign-off</p>
              <p className="text-xs text-muted-foreground mt-1">Each BAC member has a 5-day window. Failure to sign triggers escalation to Municipal Manager.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {bac.map(member => {
          const isCurrent = member.id === currentBacStep;
          return (
            <div key={member.id} className={[
              "rounded-lg border p-4 transition-all",
              member.status === "signed" ? "border-success/20 bg-success/5" 
                : isCurrent && canCurrentUserSign ? "border-primary/30 bg-primary/5" 
                : "border-border bg-muted/20"
            ].join(" ")}>
              <div className="flex items-center gap-4">
                <div className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  member.status === "signed" ? "bg-success/20 text-success" 
                    : isCurrent && canCurrentUserSign ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                ].join(" ")}>
                  {member.status === "signed" 
                    ? <CheckCircle className="h-5 w-5" />
                    : isCurrent && canCurrentUserSign 
                    ? <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    : <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.title}</div>
                  {member.status === "signed" && member.signedAt && (
                    <div className="text-xs text-success mt-0.5">Signed {formatDateTime(member.signedAt)}</div>
                  )}
                  {isCurrent && canCurrentUserSign && <div className="text-xs text-primary mt-0.5">Action required — 5-day window</div>}
                  {member.status === "awaiting" && !isCurrent && <div className="text-xs text-muted-foreground mt-0.5">Waiting in queue</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {canCurrentUserSign && currentMember && (
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
          <h4 className="font-semibold text-foreground mb-4">Your Declaration</h4>
          <div className="bg-white rounded-lg p-4 border border-border mb-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              I, {currentMember.name}, in my capacity as {currentMember.role} on the Bid Adjudication Committee of {TENDER_PARTICULARS.entity}, confirm that I have read and considered the full Bid Evaluation Report for tender {TENDER_PARTICULARS.ref} and I ratify the recommendation to award to {BEC_RECOMMENDATION.recommendedBidder} at a contract value of {formatZAR(BEC_RECOMMENDATION.contractAmount)} (ZAR).
              
              I understand that any deviation from this recommendation will be automatically reported to the Auditor-General.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setConfirmed(!confirmed)}
              className="flex items-center gap-2 text-sm"
            >
              {confirmed 
                ? <CheckSquare className="h-5 w-5 text-primary" />
                : <Square className="h-5 w-5 text-muted-foreground" />}
              <span className="text-foreground">I confirm I have read the full report</span>
            </button>
          </div>
          
          <button
            onClick={() => handleSign(currentMember.id)}
            disabled={!confirmed || signingId === currentMember.id}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signingId === currentMember.id 
              ? <><Loader2 className="h-4 w-4 animate-spin" />Verifying and Signing…</>
              : <><Fingerprint className="h-4 w-4" />Sign & Ratify Recommendation</>}
          </button>
        </div>
      )}
      
      <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Auditor General Reporting</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Any BAC recommendation deviating from automated scoring requires written motivation signed by all BAC members. 
              Inadequate motivation is automatically reported to the Auditor General. All sign-offs are cryptographically timestamped and tamper-evident.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

function Gate2Page() {
  const [view, setView] = useState<"overview" | "full">("overview");
  const [sectionsViewed, setSectionsViewed] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const currentUserId: BacMemberId = "tech"; // Mock current user
  const flagCount = INTEGRITY_CHECKS.filter(c => c.result === "flag").length;
  const signedCount = BAC_MEMBERS.filter(m => m.status === "signed").length;
  
  // Track which sections have been scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (sectionIndex !== -1 && sectionIndex + 1 > sectionsViewed) {
              setSectionsViewed(sectionIndex + 1);
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
            <p className="mt-0.5 text-sm text-muted-foreground">{TENDER_PARTICULARS.description} · Closed {TENDER_PARTICULARS.closingDate}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 text-center">
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <div className="text-lg font-bold text-foreground">{PRICE_SCORES.length + 2}</div>
              <div className="text-xs text-muted-foreground">Bids Received</div>
            </div>
            <div className={`rounded-lg border px-4 py-2 ${flagCount > 0 ? "border-warning/30 bg-warning/10" : "border-success/20 bg-success/5"}`}>
              <div className={`text-lg font-bold ${flagCount > 0 ? "text-warning" : "text-success"}`}>{flagCount}</div>
              <div className="text-xs text-muted-foreground">Red Flags</div>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-2">
              <div className="text-lg font-bold text-foreground">{signedCount}/{BAC_MEMBERS.length}</div>
              <div className="text-xs text-muted-foreground">BAC Signed</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setView("overview")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${view === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Eye className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setView("full")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${view === "full" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <FileText className="h-4 w-4" />
          Full Bid Evaluation Report
        </button>
      </div>
      
      {/* Overview View */}
      {view === "overview" && (
        <div className="space-y-6">
          {/* Summary Cards */}
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
                <span className="font-semibold text-foreground">Compliance Results</span>
              </div>
              <p className="text-lg font-bold text-success">{COMPLIANCE_RESULTS.filter(r => r.overallPass).length} Passed</p>
              <p className="text-sm text-muted-foreground">{COMPLIANCE_RESULTS.filter(r => !r.overallPass).length} Disqualified</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">BAC Status</span>
              </div>
              <p className="text-lg font-bold text-primary">{signedCount}/{BAC_MEMBERS.length} Signed</p>
              <p className="text-sm text-muted-foreground">{flagCount} red flags raised</p>
            </div>
          </div>
          
          {/* Quick Stats Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="bg-muted/60 px-6 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Evaluation Summary</h3>
            </div>
            <div className="overflow-x-auto">
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
                    { bidder: "Sizwe Construction (Pty) Ltd", s1: true, s2: 88.4, s3: 100, rank: 1 },
                    { bidder: "Khoza Engineering (Pty) Ltd", s1: true, s2: 72.2, s3: 92.35, rank: 2 },
                    { bidder: "Mokoena Infrastructure Group", s1: true, s2: 79.6, s3: 92.08, rank: 3 },
                    { bidder: "Ntuli Civil Works CC", s1: false, s2: null, s3: null, rank: "—" },
                    { bidder: "Ndaba Projects CC", s1: false, s2: null, s3: null, rank: "—" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                      <td className="px-6 py-3 font-medium">{row.bidder}</td>
                      <td className="px-6 py-3 text-center">
                        {row.s1 
                          ? <CheckCircle className="h-4 w-4 text-success mx-auto" />
                          : <XCircle className="h-4 w-4 text-danger mx-auto" />}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {row.s2 !== null ? `${row.s2}/100` : "—"}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {row.s3 !== null ? row.s3.toFixed(2) : "—"}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.rank === "number" && row.rank === 1 
                          ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground text-xs font-bold">1</span>
                          : row.rank === "—" 
                          ? <span className="text-muted-foreground">—</span>
                          : <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">{row.rank}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      
      {/* Full Bid Evaluation Report View */}
      {view === "full" && (
        <div className="space-y-8">
          {/* Document Header */}
          <div className="rounded-lg border-2 border-primary/30 bg-card p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Printer className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">FULL BID EVALUATION REPORT</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {TENDER_PARTICULARS.entity} · Tender {TENDER_PARTICULARS.ref} · Generated {new Date().toLocaleDateString("en-ZA")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              BAC members must read all sections before signing. This document is cryptographically sealed.
            </p>
          </div>
          
          {/* Section 1 */}
          <div ref={(el) => { sectionRefs.current[0] = el; }}>
            <Section1TenderParticulars />
          </div>
          
          {/* Section 2 */}
          <div ref={(el) => { sectionRefs.current[1] = el; }}>
            <Section2Compliance />
          </div>
          
          {/* Section 3 */}
          <div ref={(el) => { sectionRefs.current[2] = el; }}>
            <Section3Functionality />
          </div>
          
          {/* Section 4 */}
          <div ref={(el) => { sectionRefs.current[3] = el; }}>
            <Section4PriceScoring />
          </div>
          
          {/* Section 5 */}
          <div ref={(el) => { sectionRefs.current[4] = el; }}>
            <Section5RedFlags />
          </div>
          
          {/* Section 6 */}
          <div ref={(el) => { sectionRefs.current[5] = el; }}>
            <Section6Recommendation />
          </div>
          
          {/* Section 7 */}
          <div ref={(el) => { sectionRefs.current[6] = el; }}>
            <Section7BacSignOff sectionsViewed={sectionsViewed} currentUserId={currentUserId} />
          </div>
          
          {/* Footer */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
            <p>Tenderbox Platform · {TENDER_PARTICULARS.entity} · Tender {TENDER_PARTICULARS.ref}</p>
            <p className="mt-1">This document was automatically generated and is legally binding. All timestamps are in South African Standard Time (SAST).</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GuardedGate2Page() {
  return <RoleGuard allowedRoles={CLIENT_ROLES}><Gate2Page /></RoleGuard>;
}