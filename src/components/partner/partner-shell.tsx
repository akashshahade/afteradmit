"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, Store, MousePointerClick, CreditCard, Building, Plus } from "lucide-react";

import { AppShell, type NavSection } from "@/components/shell/app-shell";
import { WorkspaceSkeleton } from "@/components/shell/workspace-skeleton";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { displayName, initials, type Profile } from "@/lib/auth-profile";

const notifications = [
  { id: "p1", title: "Leads", body: "Lead events sync from marketplace clicks.", time: "now", unread: false },
];

const sections: NavSection[] = [
  { items: [{ label: "Overview", href: "/partner", icon: LayoutDashboard, exact: true }] },
  {
    label: "Manage",
    items: [
      { label: "Listings", href: "/partner/listings", icon: Store },
      { label: "Leads", href: "/partner/leads", icon: MousePointerClick },
      { label: "Billing", href: "/partner/billing", icon: CreditCard },
    ],
  },
  { label: "Company", items: [{ label: "Company profile", href: "/partner/settings", icon: Building }] },
];

export function PartnerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [orgName, setOrgName] = React.useState("Partner");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_my_profile");
        if (error) throw error;
        const row = (Array.isArray(data) ? data[0] : data) as Profile | null;
        if (!row || row.role !== "partner") {
          await supabase.auth.signOut();
          toast.error("Partner access required");
          router.replace("/login");
          return;
        }
        setProfile(row);
        if (row.partner_org_id) {
          const { data: org } = await supabase
            .from("partner_orgs")
            .select("name")
            .eq("id", row.partner_org_id)
            .maybeSingle();
          if (org?.name) setOrgName(org.name);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load partner session");
        router.replace("/login");
      } finally {
        setReady(true);
      }
    })();
  }, [router]);

  if (!ready || !profile) {
    return <WorkspaceSkeleton label="Loading partner workspace…" />;
  }

  return (
    <AppShell
      role="partner"
      sections={sections}
      header={
        <div className="flex items-center gap-2.5 rounded-xl border p-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-ink text-[11px] font-bold text-white">
            {orgName.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold">{orgName}</div>
            <div className="text-[11.5px] text-muted-foreground">Verified partner</div>
          </div>
        </div>
      }
      user={{
        name: displayName(profile),
        email: profile.email,
        initials: initials(profile),
        color: profile.avatar_color || "#FF4500",
        subtitle: "Partner",
      }}
      notifications={notifications}
      profileHref="/partner/settings"
      billingHref="/partner/billing"
      topAction={
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/partner/listings?new=1">
            <Plus className="size-4" /> New listing
          </Link>
        </Button>
      }
    >
      {children}
    </AppShell>
  );
}
