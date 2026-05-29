import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole =
  | "contractor"
  | "client_entity"
  | "consultant"
  | "professional"
  | "employee"
  | "psc_community"
  | "integrated_org"
  | "supplier"
  | "auditor";

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string | null;
  entity_name: string | null;
  entity_id: string | null;
  phone: string | null;
  created_at: string;
}
