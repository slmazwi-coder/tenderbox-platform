import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useProfile, getRoleRoute } from "@/lib/auth";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: Props) {
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && !allowedRoles.includes(profile.role ?? "")) {
      navigate({ to: getRoleRoute(profile.role) });
    }
  }, [profile, navigate, allowedRoles]);

  if (!profile) return null;
  if (!allowedRoles.includes(profile.role ?? "")) return null;

  return <>{children}</>;
}
