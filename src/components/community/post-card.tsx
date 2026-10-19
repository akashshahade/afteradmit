"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bookmark, Lock, MessageCircle, Pin, Route, Share2, BadgeCheck, MapPin, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VotePill } from "@/components/community/vote";
import { SpaceIcon } from "@/components/community/space-icon";
import { ContentMenu } from "@/components/community/content-menu";
import { ShareMenu } from "@/components/community/share-menu";
import { communities, members, type Member, type Post } from "@/lib/community-data";
import { milestones } from "@/lib/data";

export const ME = "priya";
export const MOD_OF = ["Roommates"];

export function CommunityIcon({ id, size = 20 }: { id: string; size?: number }) {
  const c = communities.find((x) => x.id === id)!;
  return <SpaceIcon community={c} size={size} />;
}

export function UserAvatar({ member, size = 24, className, compact }: { member: Member; size?: number; className?: string; compact?: boolean }) {
  return (
    <Avatar style={{ width: size, height: size }} className={className}>
      <AvatarFallback className="font-semibold text-white" style={{ background: member.color, fontSize: size * (compact ? 0.42 : 0.38) }}>
        {compact ? member.initials[0] : member.initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function RoleBadge({ member }: { member: Member }) {
  if (member.role === "mod") return <span className="rounded-md bg-success-soft px-1.5 py-px text-[10.5px] font-semibold text-success">Moderator</span>;
  if (member.role === "staff") return <span className="rounded-md bg-primary-soft px-1.5 py-px text-[10.5px] font-semibold text-primary">AfterAdmit</span>;
  if (member.role === "partner")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-md bg-[#eff4ff] px-1.5 py-px text-[10.5px] font-semibold text-[#2563EB]">
        <BadgeCheck className="size-3" /> Partner
      </span>
    );
  return null;
}

export function Flair({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function SpaceChip({ id, className }: { id: string; className?: string }) {
  const c = communities.find((x) => x.id === id)!;
  return (
    <Link
      href={`/student/community/c/${id}`}
      className={cn("relative z-10 inline-flex items-center gap-1.5 rounded-full border bg-white py-0.5 pl-0.5 pr-2.5 text-[12px] font-medium transition-colors hover:border-[#d4d4d8]", className)}
    >
      <CommunityIcon id={id} size={18} />
      {c.name}
    </Link>
  );
}

export function MapPreview() {
  return (
    <div className="relative mt-4 h-[200px] overflow-hidden rounded-xl border bg-[#f7f7f5]">
      <svg viewBox="0 0 600 200" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="#ebebe8" strokeWidth="10" fill="none">
          <path d="M-20 55 L620 85" />
          <path d="M-20 150 L620 120" />
          <path d="M120 -20 L180 220" />
          <path d="M380 -20 L330 220" />
        </g>
        <g stroke="#ffffff" strokeWidth="4" fill="none">
          <path d="M-20 55 L620 85" />
          <path d="M-20 150 L620 120" />
          <path d="M120 -20 L180 220" />
          <path d="M380 -20 L330 220" />
        </g>
        <rect x="200" y="16" width="120" height="46" rx="8" fill="#e3f1e6" />
        <circle cx="250" cy="100" r="46" fill="#FF4500" fillOpacity=".1" stroke="#FF4500" strokeOpacity=".35" strokeDasharray="4 4" />
      </svg>
      {[
        { x: "41%", y: "48%", l: "Westwood", main: true },
        { x: "63%", y: "70%", l: "Palms" },
        { x: "84%", y: "32%", l: "Mid-City" },
        { x: "13%", y: "72%", l: "Santa Monica" },
      ].map((p) => (
        <div key={p.l} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: p.x, top: p.y }}>
          <div className={cn("flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold shadow-md", p.main ? "bg-ink text-white" : "bg-white text-foreground")}>
            <MapPin className={cn("size-3", p.main && "text-primary")} /> {p.l}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Poll({ poll }: { poll: NonNullable<Post["poll"]> }) {
  const [choice, setChoice] = React.useState<number | null>(null);
  const total = poll.total + (choice !== null ? 1 : 0);
  return (
    <div className="relative z-10 mt-4 space-y-1.5">
      {poll.options.map((o, i) => {
        const v = o.votes + (choice === i ? 1 : 0);
        const pct = Math.round((v / total) * 100);
        return (
          <button
            key={o.label}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setChoice(i);
            }}
            className={cn(
              "relative flex h-9 w-full items-center overflow-hidden rounded-lg border px-3 text-left text-[13px] transition-colors",
              choice === null && "hover:border-primary/40 hover:bg-primary-soft/40",
              choice === i && "border-primary/40",
            )}
          >
            {choice !== null && <span className={cn("absolute inset-y-0 left-0 transition-all duration-500", choice === i ? "bg-primary-soft" : "bg-muted/70")} style={{ width: `${pct}%` }} />}
            <span className="relative flex flex-1 items-center gap-1.5 font-medium">
              {o.label}
              {choice === i && <Check className="size-3.5 text-primary" strokeWidth={3} />}
            </span>
            {choice !== null && <span className="tabular relative text-[12px] font-semibold">{pct}%</span>}
          </button>
        );
      })}
      <div className="pt-1 text-[11.5px] text-muted-foreground">
        <span className="tabular">{total}</span> votes · closes in 4 days
      </div>
    </div>
  );
}

const replierPool = ["daniel", "arjun", "sofia", "maya", "kenji", "amara", "rohan", "lucas"];

function Repliers({ post }: { post: Post }) {
  const seed = post.id.charCodeAt(1) % 4;
  const people = replierPool.filter((p) => p !== post.author).slice(seed, seed + 3);
  if (!post.comments) return null;
  return (
    <div className="hidden items-center gap-2 sm:flex">
      <div className="flex -space-x-1.5">
        {people.map((p) => (
          <UserAvatar key={p} member={members[p]} size={20} compact className="ring-2 ring-white" />
        ))}
      </div>
      <span className="text-[12px] text-muted-foreground">
        {members[people[0]].name.split(" ")[0]} and {post.comments - 1} others replied
      </span>
    </div>
  );
}

export function PostCard({ post, showCommunity = true }: { post: Post; showCommunity?: boolean }) {
  const router = useRouter();
  const [state, setState] = React.useState({ pinned: !!post.pinned, locked: !!post.locked, removed: false, deleted: false, saved: false });
  const author = members[post.author];
  const isOwn = post.author === ME;
  const isMod = MOD_OF.includes(post.community);
  const ms = post.milestone ? milestones.find((m) => m.id === post.milestone) : undefined;

  if (state.deleted) return null;

  const actions = {
    pinned: state.pinned,
    locked: state.locked,
    onPin: () => {
      setState((s) => ({ ...s, pinned: !s.pinned }));
      toast(state.pinned ? "Post unpinned" : "Post pinned to space");
    },
    onLock: () => {
      setState((s) => ({ ...s, locked: !s.locked }));
      toast(state.locked ? "Replies unlocked" : "Replies locked");
    },
    onRemove: () => {
      setState((s) => ({ ...s, removed: true }));
      toast("Post removed by moderator");
    },
    onDelete: () => {
      setState((s) => ({ ...s, deleted: true }));
      toast("Post deleted");
    },
    onEdit: () => router.push(`/student/community/${post.id}?edit=1`),
  };

  if (state.removed)
    return (
      <div className="rounded-2xl border border-dashed px-4 py-5 text-center text-[13px] text-muted-foreground">
        Post removed by a moderator ·{" "}
        <button className="font-medium text-foreground hover:underline" onClick={() => setState((s) => ({ ...s, removed: false }))}>
          Undo
        </button>
      </div>
    );

  return (
    <article className="group relative cursor-pointer rounded-2xl border bg-white p-5 transition-[border-color,box-shadow] hover:border-[#dcdce0] hover:shadow-[0_4px_16px_-6px_rgba(18,18,20,0.08)]">
      <Link href={`/student/community/${post.id}`} className="absolute inset-0 z-[1] rounded-2xl" aria-label={post.title} />

      <div className="relative flex items-start gap-3">
        <UserAvatar member={author} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="text-[13.5px] font-semibold">{author.name}</span>
            <RoleBadge member={author} />
            <span className="text-[12px] text-subtle">· {post.time}</span>
          </div>
          <div className="truncate text-[12px] text-muted-foreground">
            {author.program} · {author.from}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {state.pinned && (
            <span className="relative z-10 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11.5px] font-medium">
              <Pin className="size-3" /> Pinned
            </span>
          )}
          {state.locked && <Lock className="size-3.5 text-subtle" />}
          {showCommunity && (
            <span className="relative z-10 hidden md:inline-flex">
              <SpaceChip id={post.community} />
            </span>
          )}
          <div className="relative z-10">
            <ContentMenu kind="post" isOwn={isOwn} isMod={isMod} author={author.name} actions={actions} />
          </div>
        </div>
      </div>

      <h3 className="mt-3.5 text-[16px] font-semibold leading-snug tracking-[-0.015em] text-ink group-hover:text-ink/80">{post.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">{post.body}</p>

      {post.image === "map" && <MapPreview />}
      {post.poll && (
        <div className="relative z-10">
          <Poll poll={post.poll} />
        </div>
      )}

      <div className="relative mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Flair label={post.flair} color={post.flairColor} />
        {ms && (
          <Link
            href={`/student/roadmap?m=${ms.id}`}
            className="relative z-10 inline-flex items-center gap-1 rounded-md bg-primary-soft px-1.5 py-0.5 text-[11.5px] font-medium text-primary hover:underline"
          >
            <Route className="size-3" /> {ms.title}
          </Link>
        )}
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2 border-t pt-3.5">
        <VotePill initial={post.votes} />
        <Link
          href={`/student/community/${post.id}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MessageCircle className="size-4" strokeWidth={1.8} />
          <span className="tabular">{post.comments}</span>
        </Link>
        <div className="ml-1">
          <Repliers post={post} />
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            aria-label="Save"
            onClick={() => {
              setState((s) => ({ ...s, saved: !s.saved }));
              toast(state.saved ? "Removed from saved" : "Saved");
            }}
            className={cn("rounded-lg p-2 transition-colors hover:bg-muted", state.saved ? "text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <Bookmark className={cn("size-4", state.saved && "fill-current")} strokeWidth={1.8} />
          </button>
          <ShareMenu title={post.title} path={`/student/community/${post.id}`}>
            <button aria-label="Share" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted">
              <Share2 className="size-4" strokeWidth={1.8} />
            </button>
          </ShareMenu>
        </div>
      </div>
    </article>
  );
}
