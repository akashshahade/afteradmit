import { createClient } from "@/lib/supabase/client";

export type PartnerOverview = {
  org_id: string;
  org_name: string;
  leads_month: number;
  leads_total: number;
  active_listings: number;
  total_listings: number;
  daily: { d: string; clicks: number }[];
  by_milestone: { milestone: string; clicks: number }[];
  listings: { id: string; name: string; category: string; active: boolean; clicks: number }[];
};

export type PartnerListing = {
  id: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string | null;
  perk: string | null;
  code: string | null;
  url: string | null;
  active: boolean;
  rating: number | null;
  reviews: number | null;
  leads: number;
  updated_at: string | null;
};

export type PartnerOrg = {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  status: string;
};

export type PartnerBillingOverview = {
  plan: {
    id: string;
    name: string;
    audience: string;
    amount_cents: number;
    currency: string;
    interval: string;
    features: string[] | unknown;
    active: boolean;
  } | null;
  subscription: Record<string, unknown> | null;
  leads_month: number;
  invoices: {
    id: string;
    amount_cents: number;
    currency: string;
    status: string;
    description: string | null;
    due_at: string | null;
    paid_at: string | null;
    created_at: string;
  }[];
};

export async function loadPartnerOverview(): Promise<PartnerOverview | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("partner_overview_stats");
  if (error) throw error;
  return data as PartnerOverview;
}

export async function listPartnerListings(): Promise<PartnerListing[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_partner_listings");
  if (error) throw error;
  return (data ?? []) as PartnerListing[];
}

export async function upsertPartnerListing(payload: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("upsert_partner_listing", { payload });
  if (error) throw error;
  return data as PartnerListing;
}

export async function setPartnerListingActive(id: string, active: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("set_partner_listing_active", {
    p_id: id,
    p_active: active,
  });
  if (error) throw error;
  return data;
}

export async function deletePartnerListing(id: string) {
  const supabase = createClient();
  const { error } = await supabase.rpc("delete_partner_listing", { p_id: id });
  if (error) throw error;
}

export async function getMyPartnerOrg(): Promise<PartnerOrg | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_my_partner_org");
  if (error) throw error;
  return data as PartnerOrg | null;
}

export async function updatePartnerOrg(payload: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("update_partner_org", { payload });
  if (error) throw error;
  return data as PartnerOrg;
}

export async function loadPartnerBilling(): Promise<PartnerBillingOverview> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("partner_billing_overview");
  if (error) throw error;
  return data as PartnerBillingOverview;
}

export async function requestPartnerCheckout(planId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("request_partner_plan_checkout", {
    p_plan_id: planId,
  });
  if (error) throw error;
  return data;
}

export async function listPartnerLeads() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_partner_leads");
  if (error) throw error;
  return data ?? [];
}
