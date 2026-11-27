"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  Route,
  Store,
  MousePointerClick,
  MessageSquareQuote,
  ShieldCheck,
  Settings,
  UserPlus,
  Inbox,
  UserCheck,
} from "lucide-react";

import { AppShell, type NavSection, type ShellNotification } from "@/components/shell/app-shell";
import { WorkspaceSkeleton } from "@/components/shell/workspace-skeleton";
import { createClient } from "@/lib/supabase/client";
import { displayName, initials, type Profile } from "@/lib/auth-profile";
import { loadAccessRequests, type AdminAccessRequest } from "@/lib/admin-live";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [pendingRequests, setPendingRequests] = React.useState<AdminAccessRequest[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_my_profile");
        if (error) throw error;
        const row = (Array.isArray(data) ? data[0] : data) as Profile | null;
        if (!row || row.role !== "admin") {
          await supabase.auth.signOut();
          toast.error("Admin access required");
          router.replace("/login");
          return;
        }
        setProfile(row);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load admin session");
        router.replace("/login");
      } finally {
        setReady(true);
      }
    })();
  }, [router]);

  React.useEffect(() => {
    if (!profile) return;
    let active = true;
    void (async () => {
      const reqs = await loadAccessRequests();
      if (!active) return;
      setPendingRequests(reqs.filter((r) => r.approval_status === "pending"));
    })();
    return () => {
      active = false;
    };
  }, [profile, pathname]);

  if (!ready || !profile) {
    return <WorkspaceSkeleton label="Loading AfterAdmit admin…" />;
  }

  const pendingCount = pendingRequests.length;

  const sections: NavSection[] = [
    {
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
        {
          label: "Approvals",
          href: "/admin/approvals",
          icon: UserCheck,
          badge: pendingCount > 0 ? pendingCount : undefined,
        },
      ],
    },
    {
      label: "Content",
      items: [
        { label: "Universities", href: "/admin/universities", icon: Building2 },
        { label: "Invite students", href: "/admin/invites", icon: UserPlus },
        { label: "Roadmap template", href: "/admin/roadmap", icon: Route },
        { label: "Providers", href: "/admin/providers", icon: Store },
      ],
    },
    {
      label: "Insights",
      items: [
        { label: "Leads", href: "/admin/leads", icon: MousePointerClick },
        { label: "Feedback", href: "/admin/feedback", icon: MessageSquareQuote },
        { label: "Moderation", href: "/admin/community", icon: ShieldCheck },
        { label: "Support", href: "/admin/support", icon: Inbox },
      ],
    },
    {
      label: "Workspace",
      items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
    },
  ];

  const notifications: ShellNotification[] =
    pendingCount > 0
      ? pendingRequests.map((req) => ({
          id: `req-${req.id}`,
          title:
            req.requested_role === "university_admin"
              ? `University request: ${req.requested_org_name || "New school"}`
              : `Partner request: ${req.requested_org_name || "New partner"}`,
          body: `${`${req.first_name ?? ""} ${req.last_name ?? ""}`.trim() || req.email} (${req.email}) is waiting for approval.`,
          time: new Date(req.created_at).toLocaleDateString(),
          unread: true,
        }))
      : [
          {
            id: "all-clear",
            title: "All caught up",
            body: "No pending university or partner approval requests.",
            time: "now",
            unread: false,
          },
        ];

  return (
    <AppShell
      role="admin"
      sections={sections}
      header={
        <div className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[12px]">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="font-medium">Production</span>
          <span className="ml-auto text-muted-foreground">AfterAdmit ops</span>
        </div>
      }
      user={{
        name: displayName(profile),
        email: profile.email,
        initials: initials(profile),
        color: "#18181B",
        subtitle: "AfterAdmit Admin",
      }}
      notifications={notifications}
      profileHref="/admin/settings"
    >
      {children}
    </AppShell>
  );
}
