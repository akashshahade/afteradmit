"use client";

import * as React from "react";
import { LayoutDashboard, Building2, Route, Store, MousePointerClick, MessageSquareQuote, ShieldCheck, Settings, UserPlus, Inbox } from "lucide-react";

import { AppShell, type NavSection } from "@/components/shell/app-shell";
import { admin } from "@/lib/ops-data";

const notifications = [
  { id: "a1", title: "New partner listing in review", body: "Westwood Commons submitted “Studio · Levering Ave”.", time: "20m", unread: true },
  { id: "a2", title: "6 reports on a comment in a/F1Visa", body: "Personal information request — needs review.", time: "2h", unread: true },
  { id: "a3", title: "Lakeside Tech finished term setup", body: "Ready to copy the master template.", time: "1d", unread: false },
  { id: "a4", title: "June leads export ready", body: "1,645 lead events across 3 universities.", time: "2d", unread: false },
];

const sections: NavSection[] = [
  {
    items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { label: "Universities", href: "/admin/universities", icon: Building2, badge: "5" },
      { label: "Invite students", href: "/admin/invites", icon: UserPlus },
      { label: "Roadmap template", href: "/admin/roadmap", icon: Route },
      { label: "Providers", href: "/admin/providers", icon: Store, badge: 1 },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Leads", href: "/admin/leads", icon: MousePointerClick },
      { label: "Feedback", href: "/admin/feedback", icon: MessageSquareQuote },
      { label: "Moderation", href: "/admin/community", icon: ShieldCheck, badge: 4 },
      { label: "Support", href: "/admin/support", icon: Inbox, badge: 3 },
    ],
  },
  {
    label: "Workspace",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="admin"
      sections={sections}
      header={
        <div className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[12px]">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="font-medium">Production</span>
          <span className="ml-auto text-muted-foreground">3 schools live</span>
        </div>
      }
      user={{ name: admin.name, email: admin.email, initials: admin.initials, color: "#18181B", subtitle: admin.title }}
      notifications={notifications}
      profileHref="/admin/settings"
    >
      {children}
    </AppShell>
  );
}
