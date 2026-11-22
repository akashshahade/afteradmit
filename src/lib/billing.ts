import { createClient } from "@/lib/supabase/client";

export type BillingPlan = {
  id: string;
  name: string;
  audience: "student" | "university" | "partner";
  amount_cents: number;
  currency: string;
  interval: string;
  features: string[];
  active: boolean;
};

export type BillingSubscription = {
  id: string;
  subject_type: string;
  subject_id: string;
  plan_id: string;
  status: string;
  provider: string;
  current_period_start: string | null;
  current_period_end: string | null;
  metadata: Record<string, unknown>;
};

export type BillingInvoice = {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  description: string | null;
  due_at: string | null;
  paid_at: string | null;
  created_at: string;
};

export function formatMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export async function listPlans(audience?: BillingPlan["audience"]) {
  const supabase = createClient();
  let q = supabase.from("billing_plans").select("*").eq("active", true).order("amount_cents");
  if (audience) q = q.eq("audience", audience);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    features: Array.isArray(p.features) ? p.features : [],
  })) as BillingPlan[];
}

export async function getMySubscription() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("billing_subscriptions")
    .select("*")
    .eq("subject_type", "user")
    .eq("subject_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as BillingSubscription | null;
}

export async function listMyInvoices() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("billing_invoices")
    .select("*")
    .eq("subject_type", "user")
    .eq("subject_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as BillingInvoice[];
}

/** Pipeline only — creates pending_checkout; no Stripe yet. */
export async function requestCheckout(planId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("request_plan_checkout", { p_plan_id: planId });
  if (error) throw error;
  return data as BillingSubscription;
}

export async function getSchoolContract(_schoolName?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_my_school_contract");
  if (error) throw error;
  return data as {
    plan_id: string | null;
    seats: number;
    status: string;
    school_name?: string;
    billing_plans?: { name?: string; features?: string[] } | null;
  } | null;
}
