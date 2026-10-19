"use client";

import * as React from "react";
import { toast } from "sonner";
import { MessageSquare, Share, Plus, Minus } from "lucide-react";
import { ShareMenu } from "@/components/community/share-menu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoteInline } from "@/components/community/vote";
import { ContentMenu } from "@/components/community/content-menu";
import { ME, RoleBadge, UserAvatar } from "@/components/community/post-card";
import { members, type Comment } from "@/lib/community-data";

export function CommentComposer({
  onSubmit,
  onCancel,
  placeholder = "Join the conversation",
  autoFocus,
  initial = "",
  submitLabel = "Comment",
}: {
  onSubmit: (body: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  initial?: string;
  submitLabel?: string;
}) {
  const [value, setValue] = React.useState(initial);
  const [focused, setFocused] = React.useState(!!autoFocus || !!initial);
  return (
    <div className={cn("rounded-2xl border bg-white transition-shadow", focused && "border-[#d4d4d8] shadow-sm")}>
      <Textarea
        autoFocus={autoFocus}
        value={value}
        onFocus={() => setFocused(true)}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn("resize-none border-0 bg-transparent px-4 py-3 shadow-none focus-visible:ring-0", focused ? "min-h-24" : "min-h-11")}
      />
      {focused && (
        <div className="flex items-center justify-end gap-2 px-2.5 pb-2.5">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setFocused(false);
              setValue(initial);
              onCancel?.();
            }}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            variant="ink"
            disabled={!value.trim()}
            onClick={() => {
              onSubmit(value.trim());
              setValue("");
              setFocused(false);
            }}
          >
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

function CommentNode({ comment, opId, depth, locked, isMod }: { comment: Comment; opId: string; depth: number; locked?: boolean; isMod?: boolean }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [replying, setReplying] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [body, setBody] = React.useState(comment.body);
  const [edited, setEdited] = React.useState(!!comment.edited);
  const [removed, setRemoved] = React.useState(!!comment.removed);
  const [deleted, setDeleted] = React.useState(false);
  const [replies, setReplies] = React.useState<Comment[]>(comment.replies ?? []);
  const author = members[comment.author];
  const isOwn = comment.author === ME;

  return (
    <div className="relative">
      <div className="flex gap-2.5">
        <div className="flex flex-col items-center">
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="flex size-6 items-center justify-center rounded-full border text-muted-foreground hover:border-foreground hover:text-foreground" aria-label="Expand thread">
              <Plus className="size-3" />
            </button>
          ) : (
            <UserAvatar member={author} size={26} />
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="group/line mt-1.5 flex w-4 flex-1 justify-center" aria-label="Collapse thread">
              <span className="w-px bg-border transition-colors group-hover/line:w-[2px] group-hover/line:bg-primary" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1 pb-1">
          <div className="flex h-[26px] items-center gap-1.5 text-[12px]">
            <span className={cn("font-semibold", deleted || removed ? "text-muted-foreground" : "text-foreground")}>{deleted ? "[deleted]" : author.name}</span>
            {comment.author === opId && !deleted && <span className="rounded bg-ink px-1 text-[10px] font-semibold leading-4 text-white">Author</span>}
            {!deleted && <RoleBadge member={author} />}
            <span className="text-subtle">•</span>
            <span className="text-muted-foreground">{comment.time} ago</span>
            {edited && !deleted && <span className="text-subtle">• edited</span>}
            {collapsed && (
              <span className="ml-1 text-muted-foreground">
                <Minus className="mr-1 inline size-3" />
                {replies.length} more {replies.length === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>

          {!collapsed && (
            <>
              {removed ? (
                <p className="mt-0.5 text-[13px] italic text-muted-foreground">[Removed by moderator]</p>
              ) : deleted ? (
                <p className="mt-0.5 text-[13px] italic text-muted-foreground">[deleted]</p>
              ) : editing ? (
                <div className="mt-1.5">
                  <CommentComposer
                    autoFocus
                    initial={body}
                    submitLabel="Save"
                    onCancel={() => setEditing(false)}
                    onSubmit={(v) => {
                      setBody(v);
                      setEdited(true);
                      setEditing(false);
                      toast("Comment updated");
                    }}
                  />
                </div>
              ) : (
                <p className="mt-0.5 whitespace-pre-line text-[13.5px] leading-relaxed text-[#27272a]">{body}</p>
              )}

              {!removed && !deleted && !editing && (
                <div className="-ml-1 mt-1 flex flex-wrap items-center gap-0.5">
                  <VoteInline initial={comment.votes} />
                  <button
                    disabled={locked}
                    onClick={() => setReplying((r) => !r)}
                    className="inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <MessageSquare className="size-[15px]" strokeWidth={1.8} /> Reply
                  </button>
                  <ShareMenu title={`${author.name} on AfterAdmit`} hash={comment.id}>
                    <button className="inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted">
                      <Share className="size-[15px]" strokeWidth={1.8} /> Share
                    </button>
                  </ShareMenu>
                  <ContentMenu
                    kind="comment"
                    isOwn={isOwn}
                    isMod={isMod && !isOwn}
                    author={author.name}
                    actions={{
                      onEdit: () => setEditing(true),
                      onDelete: () => {
                        setDeleted(true);
                        toast("Comment deleted");
                      },
                      onRemove: () => {
                        setRemoved(true);
                        toast("Comment removed");
                      },
                    }}
                  />
                </div>
              )}

              {replying && (
                <div className="mt-2">
                  <CommentComposer
                    autoFocus
                    placeholder={`Reply to ${author.name.split(" ")[0]}`}
                    submitLabel="Reply"
                    onCancel={() => setReplying(false)}
                    onSubmit={(v) => {
                      setReplies((r) => [{ id: `new-${Date.now()}`, author: ME, body: v, time: "just now", votes: 1 }, ...r]);
                      setReplying(false);
                    }}
                  />
                </div>
              )}

              {replies.length > 0 && (
                <div className="mt-3 space-y-3">
                  {replies.map((r) => (
                    <CommentNode key={r.id} comment={r} opId={opId} depth={depth + 1} locked={locked} isMod={isMod} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentThread({ comments, opId, locked, isMod }: { comments: Comment[]; opId: string; locked?: boolean; isMod?: boolean }) {
  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <CommentNode key={c.id} comment={c} opId={opId} depth={0} locked={locked} isMod={isMod} />
      ))}
    </div>
  );
}
