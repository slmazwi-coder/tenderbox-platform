import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { DemoProvider, useDemoMode } from "@/contexts/DemoContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function isPublicPath(pathname: string): boolean {
  return pathname.startsWith("/auth/") || pathname === "/landing";
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isPublic = isPublicPath(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      navigate({ to: "/auth/login" });
    }
  }, [loading, user, isPublic, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1F4E79]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm text-white/60">Loading Tenderbox…</p>
        </div>
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return <>{children}</>;
}

function AppShell() {
  const { isDemoMode } = useDemoMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = isPublicPath(pathname);

  if (isPublic) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-warning px-4 py-2 text-sm font-semibold text-warning-foreground">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-warning-foreground/80" />
          Demo Mode Active — Tenderbox Government Demonstration
        </div>
      )}
      <div className={isDemoMode ? "pt-9" : ""}>
        <AppSidebar />
        <div className="pl-60">
          <AppHeader />
          <main className="p-6">
            <Outlet />
          </main>
          <footer className="border-t border-border bg-card px-6 py-3">
            <p className="text-center text-[11px] text-muted-foreground">
              All data encrypted&nbsp;·&nbsp;Audit trail active&nbsp;·&nbsp;MFMA
              compliant&nbsp;·&nbsp;Powered by Tenderbox
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DemoProvider>
          <ToastProvider>
            <AuthGate>
              <AppShell />
            </AuthGate>
          </ToastProvider>
        </DemoProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
