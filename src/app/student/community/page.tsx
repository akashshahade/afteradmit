"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PostCard, UserAvatar } from "@/components/community/post-card";
import { CreatePostBar, RightRail, SortBar, SpaceFilter, sortPosts, type Sort } from "@/components/community/feed";
import { members, posts } from "@/lib/community-data";

export default function CommunityHome() {
  const [sort, setSort] = React.useState<Sort>("best");
  const [space, setSpace] = React.useState("all");
  const list = sortPosts(
    posts.filter((p) => space === "all" || p.community === space),
    sort,
  );

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink">Community</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Ask, share and plan with the incoming Anderson class.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {["arjun", "sofia", "kenji", "amara", "maya"].map((m) => (
                <UserAvatar key={m} member={members[m]} size={28} compact className="ring-2 ring-white" />
              ))}
            </div>
            <div className="text-[12px] leading-tight">
              <div className="font-semibold">642 classmates</div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" /> 48 online now
              </div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="ml-auto rounded-full">
            <Link href="/student/community/spaces">
              <LayoutGrid className="size-4" /> Browse spaces
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <SpaceFilter value={space} onChange={setSpace} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <CreatePostBar />
          <SortBar sort={sort} onChange={setSort} />
          <div className="space-y-3">
            {list.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
            {list.length === 0 && (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <div className="text-[14px] font-semibold">Nothing here yet</div>
                <p className="mt-1 text-[13px] text-muted-foreground">Start the first conversation in this space.</p>
              </div>
            )}
          </div>
        </div>
        <RightRail />
      </div>
    </div>
  );
}
