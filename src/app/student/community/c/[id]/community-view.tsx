"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Bell, CalendarDays, Ellipsis, Lock, ShieldCheck } from "lucide-react";

import { compactNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MOD_OF, PostCard, RoleBadge, UserAvatar } from "@/components/community/post-card";
import { SpaceIcon } from "@/components/community/space-icon";
import { CreatePostBar, JoinButton, SortBar, sortPosts, type Sort } from "@/components/community/feed";
import { communities, members, posts, type Community } from "@/lib/community-data";

function SpaceAvatar({ community }: { community: Community }) {
  return (
    <span className="block rounded-full shadow-md ring-4 ring-white">
      <SpaceIcon community={community} size={88} shape="circle" />
    </span>
  );
}

export function CommunityView({ id }: { id: string }) {
  const community = communities.find((c) => c.id === id);
  const [sort, setSort] = React.useState<Sort>("best");
  if (!community) notFound();

  const list = sortPosts(
    posts.filter((p) => p.community === community.id),
    sort,
  );
  const isMod = MOD_OF.includes(community.id);
  const mods = ["daniel", ...(isMod ? ["priya"] : []), "aa"];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8">
      <Link href="/student/community/spaces" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All spaces
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
        <div className="relative h-32 sm:h-44 md:h-52">
          {community.cover ? (
            <Image src={community.cover} alt={`${community.name} cover`} fill sizes="(min-width: 1120px) 1120px, 100vw" loading="eager" className="object-cover object-[center_55%]" />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${community.color}, ${community.color}b3)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>

        <div className="px-5 pb-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="-mt-10 sm:-mt-12">
              <SpaceAvatar community={community} />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" size="icon-sm" onClick={() => toast("You'll be notified about new posts")} aria-label="Notifications">
                <Bell className="size-4" />
              </Button>
              <JoinButton community={community} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-sm" aria-label="More">
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => toast("Pinned to your sidebar")}>Pin to sidebar</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast(`Muted ${community.name}`)}>Mute space</DropdownMenuItem>
                  {isMod && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => toast("Opening review queue")}>
                        <ShieldCheck /> Review queue
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast("Opening space settings")}>Space settings</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast("Opening guidelines editor")}>Edit guidelines</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">{community.name}</h1>
              {community.id === "AndersonFall27" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <Lock className="size-3" /> Anderson only
                </span>
              )}
            </div>
            <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">{community.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {["arjun", "sofia", "kenji", "maya"].map((m) => (
                    <UserAvatar key={m} member={members[m]} size={22} compact className="ring-2 ring-white" />
                  ))}
                </div>
                <span className="font-medium">{compactNumber(community.members)} members</span>
              </div>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" /> {community.online} online
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="size-3.5" /> Since Mar 2027
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <CreatePostBar community={community.id} />
          <SortBar sort={sort} onChange={setSort} />
          <div className="space-y-3">
            {list.map((p) => (
              <PostCard key={p.id} post={p} showCommunity={false} />
            ))}
            {list.length === 0 && (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <div className="text-[14px] font-semibold">No posts yet</div>
                <p className="mt-1 text-[13px] text-muted-foreground">Be the first to start a conversation.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-[13px] font-semibold">Guidelines</div>
            <ol className="mt-3 space-y-2.5">
              {community.rules.map((r, i) => (
                <li key={r} className="flex gap-3 text-[13px] leading-snug">
                  <span className="tabular flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="text-[13px] font-semibold">Moderators</div>
            <ul className="mt-3 space-y-3">
              {mods.map((m) => (
                <li key={m} className="flex items-center gap-2.5">
                  <UserAvatar member={members[m]} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium">
                      {members[m].name}
                      {m === "priya" && <span className="text-[11.5px] font-normal text-muted-foreground">(you)</span>}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground">{members[m].program}</div>
                  </div>
                  <RoleBadge member={members[m]} />
                </li>
              ))}
            </ul>
            <Button variant="outline" size="xs" className="mt-4 w-full" onClick={() => toast("Message sent to moderators")}>
              Message moderators
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
