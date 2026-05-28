import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CreditCard,
  FileText,
  ArrowRight,
  CheckCircle,
  Building2,
  BarChart3,
  Scale,
} from "lucide-react";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
});

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Compliance-enforced participation",
    description:
      "Only contractors with verified CIDB registration, valid SARS tax clearance, and current BBBEE certificates can submit bids. No manual checks. The system enforces this automatically.",
  },
  {
    icon: Scale,
    title: "Algorithm-scored evaluation",
    description:
      "Every bid is scored on compliance, functionality, price, and B-BBEE using fixed, published criteria. Human evaluators ratify — they cannot manipulate. The system runs 12 automated integrity checks on every submission.",
  },
  {
    icon: CreditCard,
    title: "Escrow-enforced 30-day payments",
    description:
      "Funds are ring-fenced the moment an invoice is submitted. A statutory 30-day clock starts automatically. If any official delays beyond their window, they are named and the delay is recorded in the audit trail.",
  },
];

const STATS = [
  { value: "R45B", label: "Lost to procurement corruption annually in SA" },
  { value: "30", label: "Day statutory payment deadline, enforced automatically" },
  { value: "12", label: "Automated integrity checks run on every bid submitted" },
  { value: "100%", label: "Digital audit trail — immutable, MFMA compliant" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Tender Published", desc: "SCM officer publishes on Tenderbox. Register, briefing, and closing are automated." },
  { step: "02", title: "Bids Submitted", desc: "Only compliant contractors can submit. Every bid receives a unique tracking ID." },
  { step: "03", title: "Automated Evaluation", desc: "Gate 2 scoring runs immediately at closing. Red flags are raised by the system — not officials." },
  { step: "04", title: "Award & Payment", desc: "BAC signs off digitally. Escrow releases payment within the statutory 30-day window." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1F4E79] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            <Building2 className="h-3.5 w-3.5" />
            Built for South African municipalities and public entities
          </div>
          <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
            Transparent.<br />Accountable.<br />Automated.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80 leading-relaxed">
            South Africa's first end-to-end procurement automation platform built for municipalities and public entities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-md bg-[#C55A11] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C55A11]/90"
            >
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Login to Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-0 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.value}
              className={`flex flex-col items-center px-6 py-8 text-center ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
            >
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            What Tenderbox delivers
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="text-3xl font-bold text-primary/20">{step.step}</div>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tenderbox */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Why Tenderbox
          </h2>
          <div className="mt-8 space-y-4">
            {[
              "Reduce procurement corruption with automated compliance checks on every bid",
              "Protect contractors with escrow-enforced 30-day payments — interest accrues automatically if delayed",
              "Generate legally compliant tender records, briefing registers, and closing registers automatically",
              "Every decision is logged, every deviation is reported to the Auditor-General",
              "Runs alongside your existing MFMA processes — no disruption to current SCM workflows",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <p className="text-sm text-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1F4E79] px-6 py-16 text-white">
        <div className="mx-auto max-w-xl text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-white/60" />
          <h2 className="mt-4 text-2xl font-bold">Ready to see it live?</h2>
          <p className="mt-2 text-sm text-white/70">
            We offer a free six-month pilot for qualifying municipalities — two full tender cycles, no cost, no obligation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-md bg-[#C55A11] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C55A11]/90"
            >
              View Live Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Login to Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-4">
        <p className="text-center text-[11px] text-muted-foreground">
          All data encrypted&nbsp;·&nbsp;Audit trail active&nbsp;·&nbsp;MFMA compliant&nbsp;·&nbsp;Powered by Tenderbox
        </p>
      </footer>
    </div>
  );
}
