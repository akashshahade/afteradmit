"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, Route, MessagesSquare, Mail, Store, Sparkles, PenSquare, LayoutGrid } from "lucide-react";

import { AppShell, type NavIcon, type NavSection } from "@/components/shell/app-shell";
import { WorkspaceSkeleton } from "@/components/shell/workspace-skeleton";
import { Button } from "@/components/ui/button";
import { SpaceIcon } from "@/components/community/space-icon";
import { StudentStoreProvider, useStudent } from "@/components/student/store";
import { school, studentNotifications } from "@/lib/data";
import { communities } from "@/lib/community-data";
import { displayName, initials } from "@/lib/auth-profile";
import { createClient } from "@/lib/supabase/client";

const communityIcons: Record<string, NavIcon> = Object.fromEntries(
  communities.map((c) => {
    const Icon: NavIcon = () => <SpaceIcon community={c} size={18} />;
    Icon.displayName = `CommunityIcon(${c.id})`;
    return [c.id, Icon];
  }),
);

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, profile, stats, programDates } = useStudent();
  const [joinedIds, setJoinedIds] = React.useState<string[]>([]);
  const [unread, setUnread] = React.useState(0);

  React.useEffect(() => {
    if (!ready) return;
    if (profile && !profile.onboarding_completed_at) {
      router.replace("/onboarding");
    }
  }, [ready, profile, router]);

  React.useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberships } = await supabase
        .from("community_members")
        .select("space_id")
        .eq("user_id", user.id);
      if (memberships?.length) {
        setJoinedIds(memberships.map((m) => m.space_id));
      }

      const { data: convos } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("user_id", user.id);
      setUnread(convos?.length ? 0 : 0);
    })();
  }, [ready]);

  if (!ready) {
    return <WorkspaceSkeleton label="Loading your student workspace…" />;
  }

  const joined = communities.filter((c) => joinedIds.includes(c.id));

  const sections: NavSection[] = [
    {
      items: [
        { label: "Home", href: "/student", icon: House, exact: true },
        { label: "Roadmap", href: "/student/roadmap", icon: Route, badge: `${stats.done}/${stats.total}` },
        { label: "Community", href: "/student/community", icon: MessagesSquare },
        { label: "Messages", href: "/student/messages", icon: Mail, badge: unread || undefined },
        { label: "Marketplace", href: "/student/marketplace", icon: Store },
      ],
    },
    {
      label: "Your spaces",
      items: [
        ...joined.map((c) => ({
          label: c.name,
          href: `/student/community/c/${c.id}`,
          icon: communityIcons[c.id],
        })),
        { label: "Browse all spaces", href: "/student/community/spaces", icon: LayoutGrid },
      ],
    },
  ];

  const name = profile ? displayName(profile) : "Student";
  const email = profile?.email ?? "";
  const home = profile?.home_city || profile?.home_country || "Student";

  const header = (
    <Link href="/student/profile" className="block rounded-xl border p-3 transition-colors hover:bg-[#fcfcfc]">
      <Image src={school.logo} alt={school.name} width={180} height={34} className="h-[22px] w-auto" />
      <div className="mt-2 flex items-center justify-between text-[11.5px] text-muted-foreground">
        <span>{programDates?.program || profile?.program || school.program}</span>
        <span className="font-medium text-foreground">
          {programDates?.batch_name || profile?.intake || school.termShort}
        </span>
      </div>
    </Link>
  );

  const footer = (
    <div className="rounded-xl border bg-white p-3">
      <div className="flex items-center gap-1.5 text-[12.5px] font-semibold">
        <Sparkles className="size-3.5 text-primary" /> Concierge · $149/mo
      </div>
      <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
        1:1 support on top of the roadmap. Everything else stays included.
      </p>
      <Button asChild size="xs" variant="ink" className="mt-2.5 w-full">
        <Link href="/student/profile?tab=billing">Upgrade</Link>
      </Button>
    </div>
  );

  return (
    <AppShell
      role="student"
      sections={sections}
      header={header}
      footer={footer}
      user={{
        name,
        email,
        initials: profile ? initials(profile) : "ST",
        color: profile?.avatar_color || "#FF4500",
        subtitle: `${profile?.program || "MBA"} · ${home}`,
      }}
      notifications={studentNotifications}
      profileHref="/student/profile"
      billingHref="/student/profile?tab=billing"
      mobileNav={[
        { label: "Home", href: "/student", icon: House, exact: true },
        { label: "Roadmap", href: "/student/roadmap", icon: Route },
        { label: "Community", href: "/student/community", icon: MessagesSquare },
        { label: "Messages", href: "/student/messages", icon: Mail, badge: unread || undefined },
        { label: "Market", href: "/student/marketplace", icon: Store },
      ]}
      topAction={
        <Button asChild size="sm" variant="ghost" className="hidden text-muted-foreground hover:text-foreground sm:inline-flex">
          <Link href="/student/community/submit">
            <PenSquare className="size-4" /> Create post
          </Link>
        </Button>
      }
    >
      {children}
    </AppShell>
  );
}

export function StudentShell({ children }: { children: React.ReactNode }) {
  return (
    <StudentStoreProvider>
      <Shell>{children}</Shell>
    </StudentStoreProvider>
  );
}
