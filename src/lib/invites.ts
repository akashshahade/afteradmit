export type InviteRecord = {
  token: string;
  email: string;
  first_name: string;
  last_name: string;
  school_name: string;
  school_short: string;
  program: string;
  intake: string;
  program_start: string | null;
  status: string;
  expires_at: string;
};

export function inviteLinkPath(token: string) {
  return `/invite?token=${encodeURIComponent(token)}`;
}

export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}
