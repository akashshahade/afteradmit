"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Check, Lock, Plus, Search } from "lucide-react";

import { cn, compactNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpaceIcon } from "@/components/community/space-icon";
import { communities, type Community } from "@/lib/community-data";

function SpaceCard({ c, joined, onToggle }: { c: Community; joined: boolean; onToggle: () => void }) {
  return (
    <Link
      href={`/student/community/c/${c.id}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-26px_rgba(18,18,20,0.35)]"
    >
      <div className="relative h-28 overflow-hidden">
        {c.cover ? (
          <Image src={c.cover} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 120% at 0% 0%, color-mix(in oklab, ${c.color} 55%, white) 0%, ${c.color} 60%, color-mix(in oklab, ${c.color} 75%, black) 100%)`,
            }}
          >
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-5">
        <div className="flex items-end justify-between gap-3">
          <span className="-mt-7 block rounded-full ring-4 ring-white">
            <SpaceIcon community={c} size={56} shape="circle" />
          </span>
          <Button
            size="xs"
            variant={joined ? "outline" : "ink"}
            className="mt-3"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
          >
            {joined ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
            {joined ? "Joined" : "Join"}
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <h3 className="truncate text-[16px] font-semibold tracking-[-0.015em] text-ink">{c.name}</h3>
          {c.id === "AndersonFall27" && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
              <Lock className="size-3" /> Anderson only
            </span>
          )}
        </div>
        <div className="text-[12.5px] font-medium text-muted-foreground">{c.title}</div>
        <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{c.description}</p>
        <div className="mt-4 flex items-center gap-3 border-t pt-3.5 text-[12.5px] text-muted-foreground">
          <span className="font-medium text-ink">{compactNumber(c.members)} members</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" /> {c.online} online
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SpacesDirectory() {
  const [joined, setJoined] = React.useState<Record<string, boolean>>(() => Object.fromEntries(communities.map((c) => [c.id, c.joined])));
  const [q, setQ] = React.useState("");

  const query = q.trim().toLowerCase();
  const match = (c: Community) => !query || `${c.name} ${c.title} ${c.description}`.toLowerCase().includes(query);
  const mine = communities.filter((c) => joined[c.id] && match(c));
  const discover = communities.filter((c) => !joined[c.id] && match(c));

  const toggle = (c: Community) => {
    const next = !joined[c.id];
    setJoined((j) => ({ ...j, [c.id]: next }));
    toast(next ? `Joined ${c.name}` : `Left ${c.name}`, next ? { description: "It now appears in your sidebar." } : undefined);
  };

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8">
      <Link href="/student/community" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Community
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink">Spaces</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Private groups for your admitted class. Join the ones that matter to you.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search spaces" aria-label="Search spaces" className="h-10 rounded-full pl-9 text-[16px] sm:text-[13.5px]" />
        </div>
      </div>

      <section aria-labelledby="your-spaces" className="mt-8">
        <div className="flex items-baseline gap-2">
          <h2 id="your-spaces" className="text-[15px] font-semibold text-ink">
            Your spaces
          </h2>
          <span className="tabular text-[13px] text-subtle">{mine.length}</span>
        </div>
        {mine.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((c) => (
              <SpaceCard key={c.id} c={c} joined onToggle={() => toggle(c)} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed px-6 py-10 text-center text-[13.5px] text-muted-foreground">
            {query ? "None of your spaces match that search." : "You haven't joined any spaces yet — start with one below."}
          </div>
        )}
      </section>

      <section aria-labelledby="discover" className="mt-12">
        <div className="flex items-baseline gap-2">
          <h2 id="discover" className="text-[15px] font-semibold text-ink">
            Discover
          </h2>
          <span className="tabular text-[13px] text-subtle">{discover.length}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discover.map((c) => (
            <SpaceCard key={c.id} c={c} joined={false} onToggle={() => toggle(c)} />
          ))}
          <button
            type="button"
            onClick={() => toast.success("Request sent", { description: "Moderators review new space ideas within 2 days." })}
            className={cn(
              "flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-dashed p-6 text-center transition-colors hover:border-ink/25 hover:bg-[#FCFCFC]",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Plus className="size-5" />
            </span>
            <span className="mt-3 text-[14.5px] font-semibold text-ink">Suggest a space</span>
            <span className="mt-1 max-w-[220px] text-[12.5px] leading-relaxed text-muted-foreground">Missing a group for your program, city or interest? Ask the moderators.</span>
          </button>
        </div>
      </section>
    </div>
  );
}
