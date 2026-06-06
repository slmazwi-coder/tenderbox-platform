import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useProfile, getRoleRoute } from "@/lib/auth";

export const Route = createFileRoute("/")({ component: IndexRedirect });

function IndexRedirect() {
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: getRoleRoute(profile?.role), replace: true });
  }, [profile, navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}
