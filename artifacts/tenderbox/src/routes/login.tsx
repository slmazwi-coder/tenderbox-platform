import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/supabase";

export const Route = createFileRoute("/login")({ component: LoginPage });

const ROLE_OPTIONS: { value: UserRole; label: string; desc: string }[] = [
  { value: "contractor", label: "Contractor", desc: "Submit bids and manage projects" },
  { value: "client_entity", label: "Client Entity", desc: "Municipality or public entity" },
  { value: "consultant", label: "Consultant", desc: "Advisory and specialist services" },
  { value: "professional", label: "Professional", desc: "Engineer, architect, surveyor" },
  { value: "supplier", label: "Supplier", desc: "Goods and supply chain" },
  { value: "auditor", label: "Auditor", desc: "Oversight and compliance review" },
  { value: "employee", label: "Employee", desc: "Internal staff" },
  { value: "psc_community", label: "PSC Community", desc: "Public sector community" },
  { value: "integrated_org", label: "Integrated Org", desc: "Integrated organisation" },
];

function LoginPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("contractor");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const { error } = await signIn(loginEmail.trim(), loginPassword);
    if (error) {
      setLoginError(error);
      setLoginLoading(false);
    }
    // on success, the auth state change will trigger redirect via useEffect
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!signupName.trim()) { setSignupError("Display name is required"); return; }
    if (signupPassword.length < 8) { setSignupError("Password must be at least 8 characters"); return; }
    setSignupLoading(true);
    const { error } = await signUp(signupEmail.trim(), signupPassword, signupRole, signupName.trim());
    setSignupLoading(false);
    if (error) {
      setSignupError(error);
    } else {
      setSignupSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F4E79] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TENDERBOX</h1>
          <p className="mt-1 text-sm text-white/60">South African Procurement Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-white/10">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "py-3.5 text-sm font-semibold transition-colors",
                  tab === t
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80",
                ].join(" ")}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-white/60 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@organisation.gov.za"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-white/60 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPass ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    >
                      {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-200">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C55A11] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C55A11]/90 disabled:opacity-60 transition-colors"
                >
                  {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Sign In
                </button>

                <p className="text-center text-xs text-white/40">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("signup")} className="text-white/70 underline hover:text-white">
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {tab === "signup" && !signupSuccess && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-white/60 mb-1.5">
                    Full name / Organisation name
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Sizwe Construction (Pty) Ltd"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-white/60 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@organisation.gov.za"
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-white/60 mb-1.5">
                    Account type
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                    {ROLE_OPTIONS.map((r) => (
                      <label
                        key={r.value}
                        className={[
                          "flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                          signupRole === r.value
                            ? "border-[#C55A11] bg-[#C55A11]/10"
                            : "border-white/10 hover:border-white/25 hover:bg-white/5",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={signupRole === r.value}
                          onChange={() => setSignupRole(r.value)}
                          className="mt-0.5 accent-[#C55A11]"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{r.label}</div>
                          <div className="text-xs text-white/50">{r.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-white/60 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPass ? "text" : "password"}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    >
                      {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {signupError && (
                  <p className="rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-200">
                    {signupError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C55A11] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C55A11]/90 disabled:opacity-60 transition-colors"
                >
                  {signupLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Account
                </button>

                <p className="text-center text-xs text-white/40">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-white/70 underline hover:text-white">
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {/* SIGNUP SUCCESS */}
            {tab === "signup" && signupSuccess && (
              <div className="py-4 text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 mx-auto">
                  <Building2 className="h-7 w-7 text-green-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Account created</h3>
                  <p className="mt-1.5 text-sm text-white/60">
                    Check your email to confirm your address, then sign in below.
                  </p>
                </div>
                <button
                  onClick={() => setTab("login")}
                  className="w-full rounded-lg bg-[#C55A11] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C55A11]/90"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/30">
          MFMA compliant · Encrypted · Audit trail active
        </p>
      </div>
    </div>
  );
}
