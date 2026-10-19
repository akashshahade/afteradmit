"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BlogCategory, PostSummary } from "@/lib/blog";
import { FeaturedPostCard, PostCard } from "@/components/blog/post-card";

const filters: ("All" | BlogCategory)[] = ["All", "For students", "For schools"];

export function BlogIndex({ posts }: { posts: PostSummary[] }) {
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("All");
  const [email, setEmail] = React.useState("");
  const list = filter === "All" ? posts : posts.filter((p) => p.category === filter);
  const [featured, ...rest] = list;

  return (
    <>
      <div className="mt-10 flex gap-1 overflow-x-auto border-b scrollbar-none" role="tablist" aria-label="Filter articles">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "relative shrink-0 px-3 pb-3 text-[14px] font-medium transition-colors",
              filter === f ? "text-ink after:absolute after:inset-x-3 after:-bottom-px after:h-[2px] after:rounded-full after:bg-ink" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
            <span className="tabular ml-1.5 text-[12px] text-subtle">{f === "All" ? posts.length : posts.filter((p) => p.category === f).length}</span>
          </button>
        ))}
      </div>

      <div key={filter} className="animate-in fade-in-0 duration-300">
        {featured && (
          <div className="mt-10">
            <FeaturedPostCard post={featured} />
          </div>
        )}
        {rest.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-24 grid grid-cols-1 items-center gap-8 rounded-[24px] border bg-[#FAFAFA] p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink sm:text-[28px]">One useful email a month.</h2>
          <p className="mt-2 max-w-[460px] text-[15px] leading-relaxed text-muted-foreground">New guides on visas, housing, money and the months before day one. No spam, unsubscribe anytime.</p>
        </div>
        <form
          className="flex items-center gap-1 rounded-full border bg-white p-1 shadow-xs focus-within:border-primary/50 focus-within:ring-[3px] focus-within:ring-primary/10"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            setEmail("");
            toast.success("You're subscribed", { description: "The next issue lands in your inbox early next month." });
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-10 min-w-0 flex-1 bg-transparent px-4 text-[14px] outline-none placeholder:text-subtle"
          />
          <button type="submit" className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-ink-hover">
            Subscribe <ArrowRight className="size-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}
