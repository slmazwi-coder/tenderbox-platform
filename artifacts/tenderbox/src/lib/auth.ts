import { supabase } from "./supabase";
import type { Session } from "@supabase/supabase-js";
import type { Profile, UserRole } from "./supabase";
import { useAuth } from "@/contexts/AuthContext";

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as Profile;
}

export const ROLE_ROUTES: Record<UserRole | "default", string> = {
  contractor: "/contractor",
  client_entity: "/client",
  consultant: "/consultant",
  professional: "/professional",
  employee: "/contractor",
  psc_community: "/psc",
  integrated_org: "/org",
  supplier: "/supplier",
  auditor: "/auditor",
  default: "/contractor",
};

export function getRoleRoute(role: UserRole | null | undefined): string {
  if (!role) return ROLE_ROUTES.default;
  return ROLE_ROUTES[role] ?? ROLE_ROUTES.default;
}

export function useProfile(): Profile | null {
  const { profile } = useAuth();
  return profile;
}
