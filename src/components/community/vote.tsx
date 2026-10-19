"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn, compactNumber } from "@/lib/utils";

export function useVote(initial: number) {
  const [vote, setVote] = React.useState<1 | -1 | 0>(0);
  return {
    vote,
    score: initial + vote,
    up: () => setVote((v) => (v === 1 ? 0 : 1)),
    down: () => setVote((v) => (v === -1 ? 0 : -1)),
  };
}

function stop(e: React.MouseEvent, fn: () => void) {
  e.preventDefault();
  e.stopPropagation();
  fn();
}

export function VotePill({ initial, className }: { initial: number; className?: string }) {
  const { vote, score, up, down } = useVote(initial);
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center rounded-lg border bg-white transition-colors",
        vote === 1 && "border-primary/30 bg-primary-soft",
        className,
      )}
    >
      <button
        aria-label="Upvote"
        aria-pressed={vote === 1}
        onClick={(e) => stop(e, up)}
        className={cn("flex h-full items-center rounded-l-lg px-1.5 transition-colors", vote === 1 ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-primary")}
      >
        <ChevronUp className="size-4" strokeWidth={2.4} />
      </button>
      <span className={cn("tabular min-w-7 text-center text-[12.5px] font-semibold", vote === 1 ? "text-primary" : "text-foreground")}>{compactNumber(score)}</span>
      <button
        aria-label="Downvote"
        aria-pressed={vote === -1}
        onClick={(e) => stop(e, down)}
        className={cn("flex h-full items-center rounded-r-lg px-1.5 transition-colors", vote === -1 ? "text-ink" : "text-muted-foreground hover:bg-muted hover:text-ink")}
      >
        <ChevronDown className="size-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

export function VoteInline({ initial }: { initial: number }) {
  const { vote, score, up, down } = useVote(initial);
  return (
    <div className="inline-flex items-center">
      <button aria-label="Upvote" onClick={up} className={cn("rounded-md p-1 transition-colors hover:bg-muted", vote === 1 ? "text-primary" : "text-muted-foreground hover:text-primary")}>
        <ChevronUp className="size-4" strokeWidth={2.4} />
      </button>
      <span className={cn("tabular min-w-4 text-center text-[12px] font-semibold", vote === 1 ? "text-primary" : "text-foreground")}>{compactNumber(score)}</span>
      <button aria-label="Downvote" onClick={down} className={cn("rounded-md p-1 transition-colors hover:bg-muted", vote === -1 ? "text-ink" : "text-muted-foreground hover:text-ink")}>
        <ChevronDown className="size-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}
