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

export type AdminInvite = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  school_name: string | null;
  program: string | null;
  intake: string | null;
  status: string;
  created_at: string;
  accepted_at: string | null;
  token: string;
};

export type AdminFeedback = {
  id: string;
  milestone_id: string | null;
  helpful: boolean | null;
  note: string | null;
  created_at: string;
  user_email: string | null;
  school_name: string | null;
};

export type AdminLeadsAnalytics = {
  trend: { d: string; leads: number; signups: number }[];
  by_category: { category: string; leads: number }[];
};

export type AdminModeration = {
  spaces: { id: string; name: string; title: string | null; members: number; posts: number }[];
  recent_posts: {
    id: string;
    title: string | null;
    body: string | null;
    space_id: string;
    vote_score: number;
    created_at: string;
    author_email: string | null;
  }[];
};

export type AdminAccessRequest = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  requested_role: "university_admin" | "partner";
  requested_org_name: string | null;
  school_name: string | null;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export async function loadAccessRequests(): Promise<AdminAccessRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_access_requests");
  if (error) return [];
  return (data ?? []) as AdminAccessRequest[];
}

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

export async function upsertSchool(payload: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("upsert_school", { payload });
  if (error) throw error;
  return data as AdminSchool;
}

export async function loadAdminInvites(): Promise<AdminInvite[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_admin_invites");
  if (error) return [];
  return (data ?? []) as AdminInvite[];
}

export async function loadAdminFeedback(): Promise<AdminFeedback[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_admin_feedback");
  if (error) return [];
  return (data ?? []) as AdminFeedback[];
}

export async function loadAdminLeadsAnalytics(): Promise<AdminLeadsAnalytics | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("admin_leads_analytics");
  if (error) return null;
  return data as AdminLeadsAnalytics;
}

export async function loadAdminModeration(): Promise<AdminModeration | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_admin_moderation");
  if (error) return null;
  return data as AdminModeration;
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

export async function updateSupportTicket(id: string, status?: string, priority?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("update_support_ticket", {
    p_id: id,
    p_status: status ?? null,
    p_priority: priority ?? null,
  });
  if (error) throw error;
  return data;
}

export async function loadProvidersAdmin() {
  const supabase = createClient();
  const { data, error } = await supabase.from("marketplace_providers").select("*").order("name");
  if (error) return [];
  return data ?? [];
}

export async function setProviderActive(id: string, active: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("set_provider_active", {
    p_id: id,
    p_active: active,
  });
  if (error) throw error;
  return data;
}
