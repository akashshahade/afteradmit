/**
 * One-time seed: UCLA Anderson university admin for the pilot.
 * Run: node scripts/seed-uni-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      process.env[m[1].trim()] ??= m[2].trim();
    }
  } catch {
    // ignore
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or publishable/anon key in .env.local");
  process.exit(1);
}

const email = "uni.admin@anderson.edu";
const password = "AndersonAdmin1!";

const supabase = createClient(url, key);

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: "university_admin",
      first_name: "Jordan",
      last_name: "Lee",
      school_name: "UCLA Anderson",
    },
  },
});

if (error) {
  console.error("signUp failed:", error.message);
  process.exit(1);
}

console.log("University admin ready:");
console.log("  email:", email);
console.log("  password:", password);
console.log("  user id:", data.user?.id ?? "(check Auth dashboard)");
console.log("  login: /university/login");
