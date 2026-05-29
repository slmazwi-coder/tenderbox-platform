import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle, CheckCircle, Clock, XCircle, FileText,
  Award, BadgeCheck, AlertOctagon, Fingerprint, Download,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { useToast } from "@/contexts/ToastContext";

export const Route = createFileRoute("/evaluation")({ component: EvaluationPage });

const EVALUATION_DATA = {
  tenderRef: "TBX-2025-0039",
  tenderTitle: "Installation of Water Reticulation Network — Phase 3",
  entity: "OR Tambo District Municipality",
  daysSinceStart: 5,
  stats: { totalBids: 7, disqualified: 2, belowThreshold: 0, proceeding: 5 },
};

const BIDDERS = [
  { id: "1", rank: 1, company: "Sizwe Construction (Pty) Ltd", compliance: 100, functionality: 92, price: 78, bbbee: 95, total: 87.4, redFlags: 0, status: "recommended" as const, flags: [] },
  { id: "2", rank: 2, company: "Mokoena Infrastructure", compliance: 95, functionality: 85, price: 75, bbbee: 90, total: 82.1, redFlags: 0, status: "proceeding" as const, flags: [] },
  { id: "3", rank: 3, company: "Dlamini Civils", compliance: 90, functionality: 82, price: 72, bbbee: 88, total: 79.8, redFlags: 0, status: "proceeding" as const, flags: [] },
  { id: "4", rank: 4, company: "Ndaba Projects", compliance: 88, functionality: 78, price: 70, bbbee: 85, total: 76.2, redFlags: 0, status: "proceeding" as const, flags: [] },
  { id: "5", rank: 5, company: "Khoza Engineering", compliance: 85, functionality: 75, price: 68, bbbee: 80, total: 71.5, redFlags: 0, status: "proceeding" as const, flags: [] },
  { id: "6", rank: 6, company: "Ntuli Civil Works", compliance: 72, functionality: 65, price: 82, bbbee: 75, total: null, redFlags: 1, status: "disqualified" as const, flags: [{ type: "Abnormally low tender", severity: "High", detail: "Bid price is 19% below PCE lower estimate of R14.1M. Triggers mandatory referral to National Treasury." }] },
  { id: "7", rank: 7, company: "Ubuntu Infrastructure", compliance: 68, functionality: 58, price: 65, bbbee: 70, total: null, redFlags: 1, status: "disqualified" as const, flags: [{ type: "CIDB grade insufficient", severity: "High", detail: "Required Grade 6CE — contractor is registered Grade 4CE. Administrative disqualification." }] },
];

const INTEGRITY_CHECKS = [
  { check: "Administrative compliance check", status: "pass" as const, detail: "All 7 bidders passed format and submission requirements" },
  { check: "Tax compliance (SARS TCS)", status: "pass" as const, detail: "All tax clearance certificates verified against SARS database" },
  { check: "CIDB grade verification", status: "alert" as const, detail: "Ubuntu Infrastructure failed — Grade 4CE vs required 6CE" },
  { check: "CSD registration status", status: "pass" as const, detail: "All bidders confirmed on Central Supplier Database" },
  { check: "Briefing attendance confirmed", status: "pass" as const, detail: "6 of 7 bidders attended compulsory briefing" },
  { check: "Bid rigging pattern analysis", status: "pass" as const, detail: "No collusive bidding patterns detected" },
  { check: "Shell company detection", status: "pass" as const, detail: "All companies passed beneficial ownership cross-check" },
  { check: "Evaluator conflict of interest check", status: "pass" as const, detail: "No evaluator relationships detected with any bidder" },
  { check: "PCE bracket compliance", status: "alert" as const, detail: "Ntuli Civil Works bid falls below PCE lower estimate" },
  { check: "Abnormally low tender check", status: "alert" as const, detail: "Ntuli Civil Works flagged — 19% below PCE lower bound" },
  { check: "Beneficial ownership cross-check", status: "pass" as const, detail: "No conflicting ownership interests identified" },
  { check: "Repeat winner pattern check", status: "pass" as const, detail: "No anomalous award concentration detected" },
];

type BACStatus = "signed" | "pending" | "overdue";
interface BACMember { role: string; name: string; status: BACStatus; signedDate?: string; notifiedDate?: string; daysOverdue?: number }

const INITIAL_BAC: BACMember[] = [
  { role: "BEC Chairperson", name: "Adv. P. Nkosi", status: "signed", signedDate: "2026-05-18T14:30:00" },
  { role: "BAC Member — Senior Manager", name: "Mr. S. Mthembu", status: "signed", signedDate: "2026-05-19T09:15:00" },
  { role: "BAC Member — CFO", name: "Ms. R. Pillay", status: "pending", notifiedDate: "2026-05-20" },
  { role: "BAC Member — SCM Manager", name: "Mr. T. Dlamini", status: "pending", notifiedDate: "2026-05-20" },
  { role: "BAC Member — Technical Expert", name: "Eng. M. Singh", status: "pending", notifiedDate: "2026-05-20" },
  { role: "Municipal Manager", name: "Mr. K. Ndlovu", status: "pending", notifiedDate: "2026-05-20" },
];

function EvaluationPage() {
  const { toast } = useToast();
  const [bacMembers, setBacMembers] = useState<BACMember[]>(INITIAL_BAC);
  const [flagModal, setFlagModal] = useState<(typeof BIDDERS)[0] | null>(null);
  const [checkModal, setCheckModal] = useState<(typeof INTEGRITY_CHECKS)[0] | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);

  const signedCount = bacMembers.filter((m) => m.status === "signed").length;
  const allSigned = signedCount === bacMembers.length;

  const handleSignOff = (role: string) => {
    setSigningId(role);
    setTimeout(() => {
      setBacMembers((prev) =>
        prev.map((m) =>
          m.role === role
            ? { ...m, status: "signed", signedDate: new Date().toISOString() }
            : m
        )
      );
      setSigningId(null);
      toast("Signature recorded — next signatory has been notified", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Gate Status Banner */}
      <div className={`rounded-lg border-2 p-6 ${allSigned ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gate 2 — Bid Adjudication</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-medium text-muted-foreground">{EVALUATION_DATA.tenderRef}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{EVALUATION_DATA.tenderTitle}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-base font-bold ${allSigned ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
              {allSigned ? <><CheckCircle className="h-5 w-5" /> Gate 2 Approved</> : <><Clock className="h-5 w-5" /> Awaiting BAC Sign-off</>}
            </span>
            <span className="text-sm text-muted-foreground">Day {EVALUATION_DATA.daysSinceStart} since evaluation started</span>
          </div>
        </div>
      </div>

      {/* Section 1: Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Automated Scoring Summary</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Bids Received", value: EVALUATION_DATA.stats.totalBids, cls: "bg-primary/10 text-primary" },
            { label: "Bids Disqualified", value: EVALUATION_DATA.stats.disqualified, cls: "bg-danger/10 text-danger" },
            { label: "Below Threshold", value: EVALUATION_DATA.stats.belowThreshold, cls: "bg-warning/10 text-warning" },
            { label: "Proceeding to Ranking", value: EVALUATION_DATA.stats.proceeding, cls: "bg-success/10 text-success" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Ranked Bidder Table */}
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Ranked Bidders</h3>
            <button onClick={() => toast("Generating evaluation report PDF…", "info")} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              <Download className="h-3.5 w-3.5" />
              Export Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium text-center">Compliance</th>
                  <th className="px-4 py-3 font-medium text-center">Functionality</th>
                  <th className="px-4 py-3 font-medium text-center">Price</th>
                  <th className="px-4 py-3 font-medium text-center">BBBEE</th>
                  <th className="px-4 py-3 font-medium text-center">Total</th>
                  <th className="px-4 py-3 font-medium text-center">Flags</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {BIDDERS.map((bidder) => {
                  const rowCls = bidder.status === "disqualified" ? "bg-danger/5" : bidder.rank === 1 ? "bg-warning/10" : bidder.rank <= 3 ? "bg-success/5" : "";
                  const sCls = (s: number | null, t = 70) => s === null ? "text-muted-foreground" : s >= 80 ? "text-success font-medium" : s >= t ? "text-foreground font-medium" : "text-danger";
                  return (
                    <tr key={bidder.id} className={`${rowCls} cursor-pointer hover:opacity-90 transition-opacity`} onClick={() => bidder.flags.length > 0 && setFlagModal(bidder)}>
                      <td className="px-4 py-3">
                        {bidder.status === "disqualified" ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-danger/20"><XCircle className="h-4 w-4 text-danger" /></span>
                        ) : bidder.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-warning text-warning-foreground font-bold text-sm"><Award className="h-4 w-4" />#1</span>
                        ) : (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm">#{bidder.rank}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{bidder.company}</td>
                      <td className={`px-4 py-3 text-center ${sCls(bidder.compliance)}`}>{bidder.compliance}%</td>
                      <td className={`px-4 py-3 text-center ${sCls(bidder.functionality, 60)}`}>{bidder.functionality}%</td>
                      <td className={`px-4 py-3 text-center ${sCls(bidder.price)}`}>{bidder.price}%</td>
                      <td className={`px-4 py-3 text-center ${sCls(bidder.bbbee)}`}>{bidder.bbbee}%</td>
                      <td className={`px-4 py-3 text-center font-bold ${bidder.total ? "text-foreground" : "text-muted-foreground"} ${bidder.status === "disqualified" ? "line-through" : ""}`}>
                        {bidder.total ? `${bidder.total.toFixed(1)}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {bidder.redFlags > 0 ? (
                          <button onClick={(e) => { e.stopPropagation(); setFlagModal(bidder); }} className="inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-1 text-xs font-medium text-danger hover:bg-danger/20">
                            <AlertTriangle className="h-3 w-3" />{bidder.redFlags} flag
                          </button>
                        ) : (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-success/10">
                            <CheckCircle className="h-4 w-4 text-success" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {bidder.status === "recommended" && <span className="inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-2 py-1 text-xs font-medium text-warning"><BadgeCheck className="h-3 w-3" />Recommended</span>}
                        {bidder.status === "proceeding" && <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success"><CheckCircle className="h-3 w-3" />Proceeding</span>}
                        {bidder.status === "disqualified" && <span className="inline-flex items-center gap-1 rounded-md border border-danger/20 bg-danger/10 px-2 py-1 text-xs font-medium text-danger"><XCircle className="h-3 w-3" />Disqualified</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2: Integrity Checks */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Automated Integrity Checks</h2>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRITY_CHECKS.map((check, i) => (
              <button key={i} onClick={() => setCheckModal(check)} className="flex items-center gap-3 rounded-md border border-transparent p-2 hover:border-border hover:bg-muted/30 text-left transition-colors">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${check.status === "pass" ? "bg-success/10" : "bg-danger/10"}`}>
                  {check.status === "pass" ? <CheckCircle className="h-5 w-5 text-success" /> : <AlertTriangle className="h-5 w-5 text-danger" />}
                </div>
                <span className="text-sm text-foreground">{check.check}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: BAC Sign-off */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Bid Adjudication Committee (BAC) Sign-off</h2>
          <p className="mt-1 text-sm text-muted-foreground">All members must biometrically sign before the award is released</p>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Sign-off Progress</h3>
              <span className="text-sm font-medium text-foreground">{signedCount} of {bacMembers.length} signatures received</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${(signedCount / bacMembers.length) * 100}%` }} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Sign-off Status</th>
                  <th className="px-6 py-3 font-medium">Date/Time</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bacMembers.map((member, i) => (
                  <tr key={member.role} className={i % 2 === 1 ? "bg-muted/20" : "bg-card"}>
                    <td className="px-6 py-4 font-medium text-foreground">{member.role}</td>
                    <td className="px-6 py-4 text-muted-foreground">{member.name}</td>
                    <td className="px-6 py-4">
                      {member.role === "BEC Chairperson" ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          <CheckCircle className="h-3 w-3" />Recommendation submitted
                        </span>
                      ) : member.status === "signed" ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-2 py-1 text-xs font-medium text-success">
                          <CheckCircle className="h-3 w-3" />Signed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md border border-warning/20 bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
                          <Clock className="h-3 w-3" />Pending — Notified {member.notifiedDate}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {member.signedDate ? formatDateTime(member.signedDate) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== "BEC Chairperson" && member.status === "pending" && (
                        <button
                          onClick={() => handleSignOff(member.role)}
                          disabled={signingId === member.role}
                          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                        >
                          {signingId === member.role ? (
                            <><Fingerprint className="h-3.5 w-3.5 animate-pulse" />Verifying…</>
                          ) : (
                            <><Fingerprint className="h-3.5 w-3.5" />Record Sign-off</>
                          )}
                        </button>
                      )}
                      {member.status === "signed" && member.role !== "BEC Chairperson" && (
                        <span className="text-xs text-muted-foreground">Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {allSigned && (
          <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/10 p-5">
            <CheckCircle className="h-6 w-6 text-success shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-success">Gate 2 Sign-off Complete</h4>
              <p className="mt-1 text-sm text-muted-foreground">All BAC members have signed. Sizwe Construction (Pty) Ltd is approved for award of TBX-2025-0039. The award letter will be generated automatically.</p>
              <button onClick={() => toast("Award letter generated and sent to Sizwe Construction (Pty) Ltd", "success")} className="mt-3 inline-flex items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-success/90">
                <FileText className="h-4 w-4" />
                Generate Award Letter
              </button>
            </div>
          </div>
        )}

        <div className="rounded-lg border-2 border-warning/30 bg-warning/10 p-6">
          <div className="flex items-start gap-3">
            <AlertOctagon className="h-6 w-6 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">System Rule — Mandatory Deviation Reporting</h4>
              <p className="mt-1 text-sm text-muted-foreground">If the BAC awards other than the top-ranked bidder, a written justification is mandatory and this deviation is automatically reported to the Auditor-General.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flag Modal */}
      {flagModal && (
        <Modal title={`Red Flags — ${flagModal.company}`} onClose={() => setFlagModal(null)}>
          <div className="space-y-4">
            {flagModal.flags.map((flag, i) => (
              <div key={i} className="rounded-lg border border-danger/20 bg-danger/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-danger shrink-0" />
                    <span className="font-semibold text-foreground">{flag.type}</span>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${flag.severity === "High" ? "bg-danger text-white" : "bg-warning text-warning-foreground"}`}>
                    {flag.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{flag.detail}</p>
              </div>
            ))}
            <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              This flag was generated automatically by the Tenderbox integrity engine. No SCM official can override or suppress a system-generated flag. A record of this flag is included in the audit trail.
            </div>
            <button onClick={() => setFlagModal(null)} className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Integrity Check Detail Modal */}
      {checkModal && (
        <Modal title={checkModal.check} onClose={() => setCheckModal(null)} size="sm">
          <div className="space-y-4">
            <div className={`flex items-center gap-3 rounded-lg border p-4 ${checkModal.status === "pass" ? "border-success/20 bg-success/10" : "border-danger/20 bg-danger/10"}`}>
              {checkModal.status === "pass" ? <CheckCircle className="h-6 w-6 text-success" /> : <AlertTriangle className="h-6 w-6 text-danger" />}
              <span className={`font-semibold ${checkModal.status === "pass" ? "text-success" : "text-danger"}`}>
                {checkModal.status === "pass" ? "Check Passed" : "Alert Raised"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{checkModal.detail}</p>
            <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              All 12 integrity checks run at closing time and are logged immutably. Results cannot be altered after generation.
            </div>
            <button onClick={() => setCheckModal(null)} className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
