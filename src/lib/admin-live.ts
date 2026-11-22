import { createClient } from "@/lib/supabase/client";

export type AdminStats = {
  students: number;
  schools: number;
  invites: number;
  joined: number;
  posts: number;
  clicks: number;
  open_tickets: number;
  avg_progress: number;
};

export type AdminSchool = {
  name: string;
  full_name: string | null;
  short_name: string | null;
  timezone: string | null;
  support_email: string | null;
  students: number;
  invited: number;
  joined: number;
  batches: number;
};

export async function loadAdminStats(): Promise<AdminStats | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("admin_overview_stats");
  if (error) return null;
  return data as AdminStats;
}

export async function loadAdminSchools(): Promise<AdminSchool[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_admin_schools");
  if (error) return [];
  return (data ?? []) as AdminSchool[];
}

export async function loadRecentClicks(limit = 40) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("marketplace_clicks")
    .select("id, provider_id, school_name, milestone_id, source, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function loadSupportTickets() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return [];
  return data ?? [];
}

export async function loadProvidersAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase.from("marketplace_providers").select("*").order("name");
  if (error) return [];
  return data ?? [];
}
