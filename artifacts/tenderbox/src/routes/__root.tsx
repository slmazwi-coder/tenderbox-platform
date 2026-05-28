import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { DemoProvider, useDemoMode } from "@/contexts/DemoContext";

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
          Something went wrong on our end. You can try refreshing or head back home.
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

function AppShell() {
  const { isDemoMode } = useDemoMode();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/landing";

  if (isLanding) {
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
          <span className="inline-block h-2 w-2 rounded-full bg-warning-foreground/80 animate-pulse" />
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
              All data encrypted&nbsp;·&nbsp;Audit trail active&nbsp;·&nbsp;MFMA compliant&nbsp;·&nbsp;Powered by Tenderbox
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
      <DemoProvider>
        <AppShell />
      </DemoProvider>
    </QueryClientProvider>
  );
}
