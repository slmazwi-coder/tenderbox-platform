import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  CreditCard,
  ArrowRight,
  CheckCircle,
  XCircle,
  Building2,
  Send,
  Mail,
} from "lucide-react";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

const FEATURES = [
  { feature: "Tender publication", traditional: "Manual, inconsistent", tenderbox: "Automated, multi-portal" },
  { feature: "Evaluation", traditional: "Human-scored, manipulable", tenderbox: "Algorithm-scored, audited" },
  { feature: "Payment processing", traditional: "Finance discretion", tenderbox: "Escrow-enforced, 30 days" },
  { feature: "Corruption detection", traditional: "After the fact", tenderbox: "Real-time, 12 automated checks" },
  { feature: "Audit trail", traditional: "Paper-based", tenderbox: "Immutable digital record" },
  { feature: "CIDB compliance", traditional: "Manually checked", tenderbox: "Live API verification" },
];

const SLIDES = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "text-danger",
    iconBg: "bg-danger/10",
    headline: "R45 billion lost to procurement corruption annually",
    stat: "R45B",
    statLabel: "Lost per year",
    points: [
      "Unqualified contractors winning tenders",
      "Bid rigging and evaluation manipulation",
      "Delayed payments used as corruption tools",
    ],
    cta: "See how Tenderbox solves this",
    link: "/",
    accent: "border-danger/20 bg-danger/5",
  },
  {
    id: 2,
    icon: ShieldCheck,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    headline: "Only verified, compliant businesses can participate",
    stat: "94%",
    statLabel: "Readiness score — Sizwe Construction",
    points: [
      "8 of 8 compliance documents verified",
      "CIDB Grade 7CE · BBBEE Level 1 confirmed",
      "Expired documents automatically block bid submission",
    ],
    cta: "View contractor compliance dashboard",
    link: "/profile",
    accent: "border-success/20 bg-success/5",
    callout: "A contractor with expired documents cannot submit a bid. The system enforces this automatically.",
  },
  {
    id: 3,
    icon: BarChart3,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    headline: "The system ranks — humans ratify",
    stat: "12",
    statLabel: "Automated integrity checks per bid",
    points: [
      "Automated scoring: compliance, functionality, price, B-BBEE",
      "Red flag engine detects bid rigging and shell companies",
      "BAC sign-off chain — biometric, traceable, reported to AG",
    ],
    cta: "View Gate 2 evaluation for TBX-2025-0039",
    link: "/evaluation",
    accent: "border-warning/20 bg-warning/5",
    callout: "Ntuli Civil Works was automatically flagged for an abnormally low bid. No official made that decision. The system did.",
  },
  {
    id: 4,
    icon: CreditCard,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    headline: "30 days — enforced by escrow",
    stat: "30",
    statLabel: "Day statutory outer limit",
    points: [
      "Funds ring-fenced the moment the invoice is submitted",
      "8-step approval chain — each step has a countdown timer",
      "Overdue officials are named and reported automatically",
    ],
    cta: "View payment engine dashboard",
    link: "/payments",
    accent: "border-primary/20 bg-primary/5",
    callout: "The money is ring-fenced. No official can delay payment beyond 30 days. The system releases it automatically.",
  },
];

export default function DemoPage() {
  const [name, setName] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Government Demonstration</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Guided presentation for municipal officials · Follow the sequence below
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">South African Procurement Platform</span>
          </div>
        </div>
      </div>

      {/* Presentation cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Presentation Sequence — 4 Modules
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SLIDES.map((slide) => {
            const Icon = slide.icon;
            return (
              <div
                key={slide.id}
                className={`relative rounded-lg border-2 p-6 ${slide.accent}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${slide.iconBg}`}>
                    <Icon className={`h-6 w-6 ${slide.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold text-foreground">
                        {slide.id}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{slide.stat}</div>
                        <div className="text-[10px] text-muted-foreground">{slide.statLabel}</div>
                      </div>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-foreground leading-snug">
                      {slide.headline}
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {slide.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    {slide.callout && (
                      <div className="mt-4 rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-xs italic text-muted-foreground">
                        "{slide.callout}"
                      </div>
                    )}
                    <Link
                      to={slide.link}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-foreground/80"
                    >
                      {slide.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features comparison */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Feature Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Feature</th>
                <th className="px-6 py-3 font-medium">Traditional Process</th>
                <th className="px-6 py-3 font-medium text-success">Tenderbox</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 1 ? "bg-muted/30" : "bg-card"}>
                  <td className="px-6 py-3 font-medium text-foreground">{row.feature}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <XCircle className="h-3.5 w-3.5 shrink-0 text-danger" />
                      {row.traditional}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-success">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                      {row.tenderbox}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact / pilot section */}
      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to transform your municipality's procurement?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Request a free six-month pilot covering two full tender cycles — at no cost.
          </p>

          {submitted ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-success/20 bg-success/10 px-6 py-5">
              <CheckCircle className="h-8 w-8 text-success" />
              <p className="font-semibold text-success">Request received</p>
              <p className="text-sm text-muted-foreground">
                The Tenderbox team will contact you within one business day.
              </p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (name && municipality) setSubmitted(true);
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="relative flex-1">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Municipality name"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                Request a Pilot Programme
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
