"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, UserPlus } from "lucide-react";

import { AppShell, type NavSection } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/client";
import { displayName, initials, type Profile } from "@/lib/auth-profile";

const sections: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/university", icon: LayoutDashboard, exact: true },
      { label: "Invite students", href: "/university/invites", icon: UserPlus },
    ],
  },
];

export function UniversityShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("get_my_profile");
        const row = (Array.isArray(data) ? data[0] : data) as Profile | null;
        if (cancelled) return;
        if (!row || row.role !== "university_admin") {
          await supabase.auth.signOut();
          router.replace("/university/login");
          return;
        }
        setProfile(row);
        setReady(true);
      } catch {
        if (!cancelled) router.replace("/university/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready || !profile) {
    return (
      <div className="grid min-h-dvh place-items-center bg-white text-[13px] text-muted-foreground">
        Loading workspace…
      </div>
    );
  }

  const name = displayName(profile);
  const email = profile.email;
  const school = profile.school_name ?? "Your university";

  return (
    <AppShell
      role="university"
      sections={sections}
      header={
        <div className="rounded-xl border p-3">
          <div className="text-[12.5px] font-semibold">{school}</div>
          <div className="mt-1 text-[11.5px] text-muted-foreground">University admin</div>
        </div>
      }
      user={{
        name,
        email,
        initials: initials(profile),
        color: "#18181B",
        subtitle: school,
      }}
      notifications={[]}
      profileHref="/university"
    >
      {children}
    </AppShell>
  );
}
