import type { Provider } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

export async function loadProviders(): Promise<Provider[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("marketplace_providers")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error || !data?.length) {
    const { providers } = await import("@/lib/data");
    return providers.filter((p) => p.active);
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category as Provider["category"],
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    perk: row.perk ?? undefined,
    code: row.code ?? undefined,
    initials: row.initials || row.name.slice(0, 2).toUpperCase(),
    color: row.color || "#18181B",
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    url: row.url || "#",
    leads: 0,
    active: !!row.active,
  }));
}

export async function logMarketplaceClick(providerId: string, opts?: { milestoneId?: string; source?: string }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase.from("profiles").select("school_name").eq("id", user.id).maybeSingle();

  await supabase.from("marketplace_clicks").insert({
    user_id: user.id,
    provider_id: providerId,
    school_name: profile?.school_name ?? null,
    milestone_id: opts?.milestoneId ?? null,
    source: opts?.source ?? "marketplace",
  });
}
