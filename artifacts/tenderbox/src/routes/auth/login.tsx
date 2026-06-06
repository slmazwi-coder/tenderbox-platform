import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, CreditCard, Scale, Building2, UserCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleRoute } from "@/lib/auth";

export const Route = createFileRoute("/auth/login")({ component: LoginPage });

const FEATURES = [
  { icon: ShieldCheck, text: "Compliance-enforced bid submission" },
  { icon: Scale, text: "Algorithm-scored evaluation — no manipulation" },
  { icon: CreditCard, text: "Escrow-enforced 30-day statutory payments" },
  { icon: Building2, text: "Full MFMA audit trail on every action" },
];

const DEMO_ACCOUNTS = [
  { email: "scm@amathole.gov.za", password: "Demo@1234", role: "Client Entity", entity: "Amathole District Municipality" },
  { email: "contractor@sizwe.co.za", password: "Demo@1234", role: "Contractor", entity: "Sizwe Construction Pty Ltd" },
  { email: "pa@konsult.co.za", password: "Demo@1234", role: "Consultant", entity: "Konsult Engineers" },
  { email: "auditor@agsa.gov.za", password: "Demo@1234", role: "Auditor", entity: "Auditor-General South Africa" },
  { email: "psc@ward7.gov.za", password: "Demo@1234", role: "PSC Community", entity: "Ward 7 PSC Emalahleni" },
];

function LoginPage() {
  const { signIn, user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && profile) {
      navigate({ to: getRoleRoute(profile.role) });
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email.trim(), password);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
    // On success, onAuthStateChange fires → profile loads → useEffect redirects
  };

  const fillCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
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
              Transparent.<br />Accountable.<br />Automated.
            </h1>
            <p className="mt-4 text-base text-white/70 leading-relaxed max-w-sm">
              South Africa's end-to-end procurement platform for municipalities and public entities.
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
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden text-center">
            <div className="text-xl font-bold tracking-wide text-foreground">TENDERBOX</div>
            <div className="text-xs text-muted-foreground mt-0.5">Procurement Platform</div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Access your Tenderbox account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create account
            </Link>
          </p>

          {/* Demo Accounts Card */}
          <div className="mt-8 rounded-lg border-2 border-amber-500/50 bg-amber-50/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-amber-800 text-sm">Demo Accounts</h3>
            </div>
            <p className="text-xs text-amber-700/80 mb-4">
              For demonstration purposes only. These accounts are pre-configured with test data.
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <div
                  key={account.email}
                  className="flex items-center justify-between rounded-md bg-white/60 border border-amber-200/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{account.email}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {account.role} · {account.entity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillCredentials(account.email, account.password)}
                    className="ml-2 shrink-0 rounded-md bg-amber-100 px-2.5 py-1 text-[10px] font-medium text-amber-800 hover:bg-amber-200 transition-colors"
                  >
                    Login
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
