"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PostCard, UserAvatar } from "@/components/community/post-card";
import { CreatePostBar, RightRail, SortBar, SpaceFilter, sortPosts, type Sort } from "@/components/community/feed";
import type { Member, Post } from "@/lib/community-data";
import { loadCommunityFeed } from "@/lib/community-live";
import { useStudent } from "@/components/student/store";
import { createClient } from "@/lib/supabase/client";

export default function CommunityHome() {
  const { profile } = useStudent();
  const [sort, setSort] = React.useState<Sort>("best");
  const [space, setSpace] = React.useState("all");
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [members, setMembers] = React.useState<Record<string, Member>>({});
  const [loading, setLoading] = React.useState(true);
  const [spaceCount, setSpaceCount] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const feed = await loadCommunityFeed();
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        let count = 0;
        if (user) {
          const { data } = await supabase.from("community_members").select("space_id").eq("user_id", user.id);
          count = data?.length ?? 0;
        }
        if (!cancelled) {
          setPosts(feed.posts);
          setMembers(feed.members);
          setSpaceCount(count);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const list = sortPosts(
    posts.filter((p) => space === "all" || p.community === space),
    sort,
  );

  const avatars = Object.values(members).slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink">Community</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Ask, share and plan with your incoming class.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {avatars.map((m) => (
                <UserAvatar key={m.id} member={m} size={28} compact className="ring-2 ring-white" />
              ))}
            </div>
            <div className="text-[12px] leading-tight">
              <div className="font-semibold">Your class feed</div>
              <div className="text-muted-foreground">{loading ? "Loading…" : `${list.length} posts`}</div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="ml-auto rounded-full">
            <Link href="/student/community/spaces">
              <LayoutGrid className="size-4" /> Browse spaces
            </Link>
          </Button>
        </div>
      </div>

      {spaceCount < 3 && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary-soft/35 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[13.5px] font-semibold text-ink">Explore spaces for your class</div>
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">
              You&apos;re in the main class feed. Join Housing, Roommates, or Visa when you need them.
            </p>
          </div>
          <Button asChild size="sm" variant="ink" className="shrink-0 rounded-full">
            <Link href="/student/community/spaces">Browse spaces</Link>
          </Button>
        </div>
      )}

      <div className="mt-6">
        <SpaceFilter value={space} onChange={setSpace} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <CreatePostBar />
          <SortBar sort={sort} onChange={setSort} />
          <div className="space-y-3">
            {list.map((p) => (
              <PostCard key={p.id} post={p} membersOverride={members} />
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
