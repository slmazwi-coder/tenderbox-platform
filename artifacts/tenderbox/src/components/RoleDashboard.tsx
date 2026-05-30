import { Link } from "@tanstack/react-router";
import {
  FileText, Send, CreditCard, ShieldCheck, Briefcase,
  BarChart3, Scale, User, type LucideIcon,
} from "lucide-react";
import { useProfile } from "@/lib/auth";

interface QuickLink { label: string; desc: string; to: string; icon: LucideIcon; color: string }

const ALL_LINKS: QuickLink[] = [
  { label: "Active Tenders", desc: "Browse and apply for open tenders", to: "/tenders", icon: FileText, color: "bg-primary/10 text-primary" },
  { label: "My Bids", desc: "Track submitted bids and outcomes", to: "/bids", icon: Send, color: "bg-accent/10 text-accent" },
  { label: "Compliance", desc: "Manage your compliance documents", to: "/compliance", icon: ShieldCheck, color: "bg-success/10 text-success" },
  { label: "Payments", desc: "Invoices and payment tracking", to: "/payments", icon: CreditCard, color: "bg-warning/10 text-warning" },
  { label: "Evaluation", desc: "Gate 2 evaluation results", to: "/evaluation", icon: Scale, color: "bg-primary/10 text-primary" },
  { label: "Projects", desc: "Active and completed projects", to: "/projects", icon: Briefcase, color: "bg-muted text-foreground" },
  { label: "Reports", desc: "Analytics and audit reports", to: "/reports", icon: BarChart3, color: "bg-muted text-foreground" },
  { label: "My Profile", desc: "Documents and certifications", to: "/profile", icon: User, color: "bg-muted text-foreground" },
];

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; links: string[] }> = {
  contractor: {
    title: "Contractor Dashboard",
    subtitle: "Browse tenders, submit bids, and manage your compliance documents.",
    links: ["Active Tenders", "My Bids", "Compliance", "Payments", "Projects", "My Profile"],
  },
  client_entity: {
    title: "Client Entity Dashboard",
    subtitle: "Publish tenders, evaluate bids, and manage municipal procurement.",
    links: ["Active Tenders", "Evaluation", "Payments", "Reports", "Projects"],
  },
  consultant: {
    title: "Consultant Dashboard",
    subtitle: "Manage advisory engagements, compliance documents, and project reports.",
    links: ["Active Tenders", "My Bids", "Projects", "Reports", "My Profile"],
  },
  professional: {
    title: "Professional Dashboard",
    subtitle: "Manage professional engagements and certification documents.",
    links: ["Active Tenders", "My Bids", "Compliance", "Projects", "My Profile"],
  },
  psc_community: {
    title: "PSC Community Dashboard",
    subtitle: "Community procurement oversight and reporting.",
    links: ["Active Tenders", "Reports", "Compliance", "My Profile"],
  },
  integrated_org: {
    title: "Integrated Organisation Dashboard",
    subtitle: "Organisation-wide procurement management and reporting.",
    links: ["Active Tenders", "Evaluation", "Payments", "Reports", "Projects"],
  },
  supplier: {
    title: "Supplier Dashboard",
    subtitle: "Manage supply chain bids, payments, and compliance.",
    links: ["Active Tenders", "My Bids", "Compliance", "Payments", "My Profile"],
  },
  auditor: {
    title: "Auditor Dashboard",
    subtitle: "Review procurement records, compliance status, and audit reports.",
    links: ["Active Tenders", "Evaluation", "Compliance", "Reports"],
  },
};

interface Props {
  role: string;
}

export function RoleDashboard({ role }: Props) {
  const profile = useProfile();
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.contractor;
  const visibleLinks = ALL_LINKS.filter((l) => config.links.includes(l.label));

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{config.title}</p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xl">
          {config.subtitle}
        </p>
      </section>

      {/* Quick navigation */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLinks.map(({ label, desc, to, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
