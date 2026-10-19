"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Lock, MessageSquare, Pin, Route, Share, ArrowUpRight, Search } from "lucide-react";
import { ShareMenu } from "@/components/community/share-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VotePill } from "@/components/community/vote";
import { ContentMenu } from "@/components/community/content-menu";
import { CommunityIcon, Flair, ME, MOD_OF, MapPreview, Poll, RoleBadge, SpaceChip, UserAvatar } from "@/components/community/post-card";
import { CommentComposer, CommentThread } from "@/components/community/comment-thread";
import { JoinButton } from "@/components/community/feed";
import { comments as allComments, communities, defaultComments, members, posts, type Comment } from "@/lib/community-data";
import { milestones } from "@/lib/data";

function PostDetail({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const post = posts.find((p) => p.id === id);
  const [editing, setEditing] = React.useState(params.get("edit") === "1");
  const [title, setTitle] = React.useState(post?.title ?? "");
  const [body, setBody] = React.useState(post?.body ?? "");
  const [edited, setEdited] = React.useState(false);
  const [pinned, setPinned] = React.useState(!!post?.pinned);
  const [locked, setLocked] = React.useState(!!post?.locked);
  const [thread, setThread] = React.useState<Comment[]>(post ? (allComments[post.id] ?? defaultComments) : []);
  const [sort, setSort] = React.useState("best");

  if (!post) notFound();

  const author = members[post.author];
  const community = communities.find((c) => c.id === post.community)!;
  const isOwn = post.author === ME;
  const isMod = MOD_OF.includes(post.community);
  const ms = post.milestone ? milestones.find((m) => m.id === post.milestone) : undefined;

  return (
    <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 gap-6 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="icon-sm" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="size-4" />
          </Button>
          <SpaceChip id={post.community} />
          <span className="text-[12px] text-subtle">· {post.time} ago</span>
          <div className="ml-auto flex items-center gap-2">
            {pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11.5px] font-medium">
                <Pin className="size-3" /> Pinned
              </span>
            )}
            {locked && (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-warning">
                <Lock className="size-3.5" /> Locked
              </span>
            )}
            <ContentMenu
              kind="post"
              isOwn={isOwn}
              isMod={isMod}
              author={author.name}
              actions={{
                pinned,
                locked,
                onEdit: () => setEditing(true),
                onDelete: () => {
                  toast("Post deleted");
                  router.push("/student/community");
                },
                onRemove: () => {
                  toast("Post removed by moderator");
                  router.push(`/student/community/c/${post.community}`);
                },
                onPin: () => {
                  setPinned((p) => !p);
                  toast(pinned ? "Post unpinned" : "Post pinned");
                },
                onLock: () => {
                  setLocked((l) => !l);
                  toast(locked ? "Comments unlocked" : "Comments locked");
                },
              }}
            />
          </div>
        </div>

        {editing ? (
          <div className="mt-5 space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 text-[15px] font-semibold" />
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-40 text-[14px]" />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTitle(post.title);
                  setBody(post.body);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="ink"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setEdited(true);
                  toast.success("Post updated");
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-5 text-[24px] font-semibold leading-tight tracking-[-0.025em] text-ink">{title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <UserAvatar member={author} size={36} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                  {author.name} <RoleBadge member={author} />
                </div>
                <div className="text-[12px] text-muted-foreground">
                  {author.program} · {author.from}
                </div>
              </div>
            </div>
            <p className="mt-5 whitespace-pre-line text-[14.5px] leading-[1.7] text-[#27272a]">{body}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Flair label={post.flair} color={post.flairColor} />
              {edited && <span className="text-[12px] text-subtle">edited just now</span>}
            </div>
          </>
        )}

        {post.image === "map" && <MapPreview />}
        {post.poll && <Poll poll={post.poll} />}

        {ms && (
          <Link href={`/student/roadmap?m=${ms.id}`} className="mt-4 flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-[#d4d4d8]">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Route className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] text-muted-foreground">Linked milestone</div>
              <div className="truncate text-[13px] font-medium">{ms.title}</div>
            </div>
            <ArrowUpRight className="size-4 text-subtle" />
          </Link>
        )}

        <div className="mt-5 flex items-center gap-2 border-y py-3">
          <VotePill initial={post.votes} />
          <span className="inline-flex h-8 items-center gap-1.5 px-2.5 text-[12.5px] font-medium text-muted-foreground">
            <MessageSquare className="size-4" strokeWidth={1.8} />
            <span className="tabular">{post.comments + thread.length - (allComments[post.id] ?? defaultComments).length} replies</span>
          </span>
          <ShareMenu title={post.title}>
            <button className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground data-[state=open]:bg-muted">
              <Share className="size-4" strokeWidth={1.8} /> Share
            </button>
          </ShareMenu>
        </div>

        <div className="mt-6">
          {locked ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-warning/20 bg-warning-soft/60 px-4 py-3 text-[13px]">
              <Lock className="size-4 text-warning" /> Replies are locked by a moderator.
            </div>
          ) : (
            <CommentComposer
              onSubmit={(v) => {
                setThread((t) => [{ id: `new-${Date.now()}`, author: ME, body: v, time: "just now", votes: 1 }, ...t]);
                toast.success("Comment posted");
              }}
            />
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-[12.5px] text-muted-foreground">Sort replies</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger size="sm" className="h-7 px-2.5 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Most helpful</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="old">Oldest</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative ml-auto hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
            <Input placeholder="Search replies" className="h-7 w-48 pl-8 text-[12.5px]" />
          </div>
        </div>

        <div className="mt-5 pb-10">
          <CommentThread comments={sort === "new" ? [...thread].reverse() : thread} opId={post.author} locked={locked} isMod={isMod} />
        </div>
      </div>

      <aside className="hidden space-y-4 lg:block">
        <div className="relative overflow-hidden rounded-2xl border bg-white p-4">
          <div className="absolute inset-x-0 top-0 h-1" style={{ background: community.color }} />
          <div>
            <div className="flex items-center justify-between">
              <CommunityIcon id={community.id} size={40} />
              <JoinButton community={community} size="xs" />
            </div>
            <div className="mt-2 text-[14px] font-semibold">{community.name}</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{community.description}</p>
            <div className="mt-3 flex gap-5 text-[12px]">
              <div>
                <div className="tabular font-semibold">{community.members}</div>
                <div className="text-muted-foreground">Members</div>
              </div>
              <div>
                <div className="tabular flex items-center gap-1 font-semibold">
                  <span className="size-1.5 rounded-full bg-success" />
                  {community.online}
                </div>
                <div className="text-muted-foreground">Online</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-subtle">About the author</div>
          <div className="mt-3 flex items-center gap-3">
            <UserAvatar member={author} size={40} />
            <div>
              <div className="text-[13.5px] font-semibold">{author.name}</div>
              <div className="text-[12px] text-muted-foreground">
                {author.program} · {author.from}
              </div>
            </div>
          </div>
          {!isOwn && (
            <Button asChild variant="outline" size="xs" className="mt-3 w-full">
              <Link href="/student/messages">Send message</Link>
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

export function PostView({ postId }: { postId: string }) {
  return (
    <React.Suspense>
      <PostDetail id={postId} />
    </React.Suspense>
  );
}
