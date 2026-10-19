"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, FileText, MessagesSquare, Route, Store, Building2, Users, LayoutDashboard, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { milestones, stages } from "@/lib/data";
import { communities, posts } from "@/lib/community-data";
import { universities, listings } from "@/lib/ops-data";

type Item = { id: string; label: string; hint: string; href: string; group: string; icon: React.ElementType };

function itemsFor(role: "student" | "admin" | "partner"): Item[] {
  if (role === "student") {
    return [
      { id: "home", label: "Home", hint: "Dashboard", href: "/student", group: "Pages", icon: LayoutDashboard },
      { id: "roadmap", label: "Roadmap", hint: "All 9 stages", href: "/student/roadmap", group: "Pages", icon: Route },
      { id: "community", label: "Community", hint: "Popular in Anderson", href: "/student/community", group: "Pages", icon: MessagesSquare },
      { id: "market", label: "Marketplace", hint: "Vetted providers", href: "/student/marketplace", group: "Pages", icon: Store },
      { id: "profile", label: "Profile & settings", hint: "Account, billing, privacy", href: "/student/profile", group: "Pages", icon: UserRound },
      ...milestones.map((m) => ({
        id: m.id,
        label: m.title,
        hint: `Stage ${m.stage} · ${stages[m.stage - 1].name}`,
        href: `/student/roadmap?m=${m.id}`,
        group: "Milestones",
        icon: FileText,
      })),
      ...posts.map((p) => ({ id: p.id, label: p.title, hint: communities.find((c) => c.id === p.community)?.name ?? "", href: `/student/community/${p.id}`, group: "Posts", icon: MessagesSquare })),
    ];
  }
  if (role === "admin") {
    return [
      { id: "ov", label: "Overview", hint: "KPIs", href: "/admin", group: "Pages", icon: LayoutDashboard },
      { id: "uni", label: "Universities", hint: "Schools & terms", href: "/admin/universities", group: "Pages", icon: Building2 },
      { id: "tpl", label: "Roadmap template", hint: "Stages & milestones", href: "/admin/roadmap", group: "Pages", icon: Route },
      { id: "prov", label: "Providers", hint: "Directory", href: "/admin/providers", group: "Pages", icon: Store },
      { id: "leads", label: "Leads", hint: "Click events", href: "/admin/leads", group: "Pages", icon: Users },
      { id: "mod", label: "Moderation", hint: "Community queue", href: "/admin/community", group: "Pages", icon: MessagesSquare },
      ...universities.map((u) => ({ id: u.id, label: u.name, hint: u.status, href: "/admin/universities", group: "Universities", icon: Building2 })),
    ];
  }
  return [
    { id: "ov", label: "Overview", hint: "Performance", href: "/partner", group: "Pages", icon: LayoutDashboard },
    { id: "ls", label: "Listings", hint: "Your services", href: "/partner/listings", group: "Pages", icon: Store },
    { id: "leads", label: "Leads", hint: "Click activity", href: "/partner/leads", group: "Pages", icon: Users },
    ...listings.map((l) => ({ id: l.id, label: l.title, hint: l.status, href: "/partner/listings", group: "Listings", icon: FileText })),
  ];
}

export function CommandPalette({ open, onOpenChange, role }: { open: boolean; onOpenChange: (o: boolean) => void; role: "student" | "admin" | "partner" }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-[560px]">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <PaletteBody role={role} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PaletteBody({ role, onClose }: { role: "student" | "admin" | "partner"; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const all = React.useMemo(() => itemsFor(role), [role]);
  const results = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? all.filter((i) => i.label.toLowerCase().includes(s) || i.hint.toLowerCase().includes(s)) : all.filter((i) => i.group === "Pages" || i.group === "Milestones").slice(0, 9);
    return list.slice(0, 12);
  }, [q, all]);

  const go = (item: Item) => {
    onClose();
    router.push(item.href);
  };

  const groups = results.reduce<Record<string, Item[]>>((acc, i) => {
    (acc[i.group] ??= []).push(i);
    return acc;
  }, {});

  let index = -1;

  return (
    <>
        <div className="flex items-center gap-2.5 border-b px-4">
          <Search className="size-4 text-subtle" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                go(results[active]);
              }
            }}
            placeholder="Search or jump to…"
            className="h-12 flex-1 bg-transparent text-[14px] outline-none placeholder:text-subtle"
          />
          <kbd className="rounded border bg-muted px-1.5 font-mono text-[10.5px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[380px] overflow-y-auto p-1.5">
          {results.length === 0 && <div className="py-10 text-center text-[13px] text-muted-foreground">No results for “{q}”</div>}
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-1">
              <div className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-subtle">{group}</div>
              {items.map((item) => {
                index += 1;
                const i = index;
                return (
                  <button
                    key={item.group + item.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px]",
                      active === i ? "bg-muted" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className={cn("size-4 shrink-0", active === i ? "text-primary" : "text-subtle")} />
                    <span className="flex-1 truncate font-medium">{item.label}</span>
                    <span className="shrink-0 text-[12px] text-subtle">{item.hint}</span>
                    {active === i && <CornerDownLeft className="size-3.5 text-subtle" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
    </>
  );
}
