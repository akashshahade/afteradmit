"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Plus, Users, CalendarDays, ShieldCheck, Home, Globe, Sparkles, MapPin } from "lucide-react";

import { cn, compactNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommunityIcon, UserAvatar } from "@/components/community/post-card";
import { communities, members, type Community, type Post } from "@/lib/community-data";

export type Sort = "best" | "hot" | "new" | "top";

function ageInHours(t: string) {
  if (t === "just now") return 0;
  const n = parseInt(t);
  if (t.endsWith("h")) return n;
  if (t.endsWith("d")) return n * 24;
  if (t.endsWith("w")) return n * 168;
  return 0;
}

export function sortPosts(list: Post[], sort: Sort) {
  const sorted = [...list];
  if (sort === "new") sorted.sort((a, b) => ageInHours(a.time) - ageInHours(b.time));
  else if (sort === "top") sorted.sort((a, b) => b.votes - a.votes);
  else if (sort === "hot") sorted.sort((a, b) => b.votes / (ageInHours(b.time) + 2) - a.votes / (ageInHours(a.time) + 2));
  else sorted.sort((a, b) => b.votes + b.comments * 3 - (a.votes + a.comments * 3));
  return sorted.sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
}

export function SortBar({ sort, onChange }: { sort: Sort; onChange: (s: Sort) => void }) {
  const items: { k: Sort; l: string }[] = [
    { k: "best", l: "For you" },
    { k: "new", l: "Latest" },
    { k: "hot", l: "Trending" },
    { k: "top", l: "Most helpful" },
  ];
  return (
    <div className="flex items-center gap-5 border-b">
      {items.map((it) => (
        <button
          key={it.k}
          onClick={() => onChange(it.k)}
          className={cn(
            "relative h-10 text-[13px] font-medium transition-colors",
            sort === it.k ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-ink" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {it.l}
        </button>
      ))}
    </div>
  );
}

const prompts = [
  { l: "Find roommates", c: "Roommates", i: Users },
  { l: "Visa question", c: "F1Visa", i: Globe },
  { l: "Housing tip", c: "Housing", i: Home },
  { l: "Plan a meetup", c: "WestwoodLife", i: MapPin },
];

export function CreatePostBar({ community }: { community?: string }) {
  const href = `/student/community/submit${community ? `?c=${community}` : ""}`;
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-3">
        <UserAvatar member={members.priya} size={36} />
        <Link href={href} className="flex h-10 flex-1 items-center rounded-xl bg-muted/70 px-4 text-[13.5px] text-muted-foreground transition-colors hover:bg-muted">
          Ask your class anything…
        </Link>
        <Button asChild variant="ink" size="sm" className="hidden sm:inline-flex">
          <Link href={href}>Post</Link>
        </Button>
      </div>
      {!community && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-none sm:flex-wrap sm:pl-12">
          {prompts.map((p) => (
            <Link
              key={p.l}
              href={`/student/community/submit?c=${p.c}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:border-[#d4d4d8] hover:text-foreground"
            >
              <p.i className="size-3.5" /> {p.l}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function JoinButton({ community, size = "sm" }: { community: Community; size?: "sm" | "xs" }) {
  const [joined, setJoined] = React.useState(community.joined);
  return (
    <Button
      size={size}
      variant={joined ? "outline" : "ink"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setJoined((j) => !j);
        toast(joined ? `Left ${community.name}` : `Joined ${community.name}`);
      }}
    >
      {joined ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
      {joined ? "Joined" : "Join"}
    </Button>
  );
}

export function SpaceFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors",
          value === "all" ? "border-ink bg-ink text-white" : "bg-white text-muted-foreground hover:border-[#d4d4d8] hover:text-foreground",
        )}
      >
        <Sparkles className="size-3.5" /> All spaces
      </button>
      {communities.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border py-0 pl-1 pr-3 text-[12.5px] font-medium transition-colors",
            value === c.id ? "border-ink bg-ink text-white" : "bg-white text-muted-foreground hover:border-[#d4d4d8] hover:text-foreground",
          )}
        >
          <CommunityIcon id={c.id} size={22} />
          {c.name}
        </button>
      ))}
    </div>
  );
}

const events = [
  { d: "JUN", n: "03", t: "F-1 interview prep AMA", m: "F-1 & Visa · Zoom · 7pm IST" },
  { d: "JUN", n: "08", t: "Housing office hours", m: "Housing · with second-years" },
  { d: "JUN", n: "12", t: "LA admits picnic", m: "Westwood Life · Sunset Canyon" },
];

export function RightRail() {
  return (
    <aside className="hidden space-y-4 lg:block">
      <div className="rounded-2xl border bg-white p-2">
        <div className="flex items-center justify-between px-3 pb-1 pt-2.5">
          <span className="text-[13px] font-semibold">Spaces</span>
          <Link href="/student/community/spaces" className="text-[12px] font-medium text-muted-foreground hover:text-foreground">
            See all {communities.length}
          </Link>
        </div>
        <ul>
          {communities.map((c) => (
            <li key={c.id}>
              <Link href={`/student/community/c/${c.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#fafafa]">
                <CommunityIcon id={c.id} size={30} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{c.name}</div>
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    {compactNumber(c.members)} members
                    <span className="size-1 rounded-full bg-success" /> {c.online}
                  </div>
                </div>
                {c.joined ? <Check className="size-4 text-subtle" /> : <span className="text-[12px] font-medium text-primary">Join</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <CalendarDays className="size-4 text-muted-foreground" /> Happening soon
        </div>
        <ul className="mt-3 space-y-3">
          {events.map((e) => (
            <li key={e.t} className="flex items-center gap-3">
              <div className="flex w-10 shrink-0 flex-col items-center rounded-lg border py-1">
                <span className="text-[9.5px] font-semibold tracking-wider text-primary">{e.d}</span>
                <span className="tabular text-[15px] font-semibold leading-tight">{e.n}</span>
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{e.t}</div>
                <div className="truncate text-[11.5px] text-muted-foreground">{e.m}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2.5 rounded-2xl border bg-white p-4 text-[12px] leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
        <span>Only admitted students can see Spaces. UCLA Anderson never sees your posts or messages.</span>
      </div>
    </aside>
  );
}
