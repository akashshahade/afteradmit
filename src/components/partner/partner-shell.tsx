"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, Store, MousePointerClick, CreditCard, Building, Plus } from "lucide-react";

import { AppShell, type NavSection } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { partner } from "@/lib/ops-data";

const notifications = [
  { id: "p1", title: "Listing in review", body: "“Studio · Levering Ave” is being reviewed by AfterAdmit.", time: "20m", unread: true },
  { id: "p2", title: "21 new leads yesterday", body: "Most came from the “Lease signed” milestone.", time: "9h", unread: true },
  { id: "p3", title: "June invoice available", body: "INV-0042 · 241 leads · $4,338.00", time: "2d", unread: false },
];

const sections: NavSection[] = [
  { items: [{ label: "Overview", href: "/partner", icon: LayoutDashboard, exact: true }] },
  {
    label: "Manage",
    items: [
      { label: "Listings", href: "/partner/listings", icon: Store, badge: "4" },
      { label: "Leads", href: "/partner/leads", icon: MousePointerClick },
      { label: "Billing", href: "/partner/billing", icon: CreditCard },
    ],
  },
  { label: "Company", items: [{ label: "Company profile", href: "/partner/settings", icon: Building }] },
];

export function PartnerShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      role="partner"
      sections={sections}
      header={
        <div className="flex items-center gap-2.5 rounded-xl border p-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-ink text-[11px] font-bold text-white">WC</span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold">{partner.company}</div>
            <div className="text-[11.5px] text-muted-foreground">Verified partner · {partner.category}</div>
          </div>
        </div>
      }
      user={{ name: partner.contact, email: partner.email, initials: partner.initials, color: "#FF4500", subtitle: partner.title }}
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
