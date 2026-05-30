import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, CreditCard, Scale, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/supabase";

export const Route = createFileRoute("/auth/signup")({ component: SignupPage });

const FEATURES = [
  { icon: ShieldCheck, text: "Compliance-enforced bid submission" },
  { icon: Scale, text: "Algorithm-scored evaluation — no manipulation" },
  { icon: CreditCard, text: "Escrow-enforced 30-day statutory payments" },
  { icon: Building2, text: "Full MFMA audit trail on every action" },
];

const ROLES: { value: UserRole; label: string }[] = [
  { value: "contractor", label: "Contractor" },
  { value: "client_entity", label: "Client Entity (Municipality / Public Body)" },
  { value: "consultant", label: "Consultant" },
  { value: "professional", label: "Professional (Engineer / Architect / Surveyor)" },
  { value: "employee", label: "Employee" },
  { value: "psc_community", label: "PSC Community" },
  { value: "integrated_org", label: "Integrated Organisation" },
  { value: "supplier", label: "Supplier" },
  { value: "auditor", label: "Auditor" },
];

function SignupPage() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [entityName, setEntityName] = useState("");
  const [role, setRole] = useState<UserRole>("contractor");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/auth/login" });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!displayName.trim()) { setError("Display name is required"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setSubmitting(true);
    const { error: err } = await signUp(email.trim(), password, role, displayName.trim());
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Navy hero panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#1F4E79] px-12 py-14 text-white">
        <div>
          <div className="text-2xl font-bold tracking-wider">TENDERBOX</div>
          <div className="text-xs text-white/50 mt-0.5 tracking-wide uppercase">Procurement Platform</div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Join the future<br />of public<br />procurement.
            </h1>
            <p className="mt-4 text-base text-white/70 leading-relaxed max-w-sm">
              Create your account to start submitting bids, managing tenders, and tracking compliance documents.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-white/80" />
                </div>
                <p className="text-sm text-white/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-white/30">
          All data encrypted · MFMA compliant · Powered by Tenderbox
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-6 lg:hidden text-center">
            <div className="text-xl font-bold tracking-wide text-foreground">TENDERBOX</div>
          </div>

          {success ? (
            <div className="text-center space-y-5 py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <ShieldCheck className="h-8 w-8 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Account created</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Check your email inbox and click the confirmation link, then sign in below.
                </p>
              </div>
              <Link
                to="/auth/login"
                className="block w-full rounded-lg bg-[#C55A11] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#C55A11]/90"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create account</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Register your organisation on Tenderbox
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Display name / Organisation name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Sizwe Construction (Pty) Ltd"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organisation.gov.za"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Account type
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Entity / Company name <span className="text-muted-foreground/60 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder="Registered entity name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C55A11] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C55A11]/90 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Account
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
