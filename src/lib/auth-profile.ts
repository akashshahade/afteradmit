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
