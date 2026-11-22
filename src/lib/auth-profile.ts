export type AppRole = "student" | "university_admin" | "admin" | "partner";

export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AppRole;
  school_name: string | null;
  program: string | null;
  intake: string | null;
  onboarding_completed_at?: string | null;
  home_country?: string | null;
  home_city?: string | null;
  visa_type?: string | null;
  funding?: string[] | null;
  dependents?: boolean | null;
  housing?: string | null;
  offer_accepted?: boolean | null;
  avatar_color?: string | null;
  avatar_url?: string | null;
  handle?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  industry?: string | null;
  batch_id?: string | null;
  partner_org_id?: string | null;
  notification_prefs?: Record<string, unknown> | null;
};

export function displayName(profile: Pick<Profile, "first_name" | "last_name" | "email">) {
  const name = `${profile.first_name} ${profile.last_name}`.trim();
  return name || profile.email;
}

export function initials(profile: Pick<Profile, "first_name" | "last_name" | "email">) {
  const a = profile.first_name?.[0];
  const b = profile.last_name?.[0];
  if (a && b) return `${a}${b}`.toUpperCase();
  return profile.email.slice(0, 2).toUpperCase();
}
