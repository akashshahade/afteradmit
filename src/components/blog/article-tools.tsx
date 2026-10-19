"use client";

import * as React from "react";
import { toast } from "sonner";
import { Link2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page">
      <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-subtle">On this page</div>
      <ul className="mt-4 space-y-0.5 border-l">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 text-[13px] leading-snug transition-colors",
                active === i.id ? "border-ink font-medium text-ink" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-primary" style={{ transform: `scaleX(${progress})` }} />;
}

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const share = (network: "x" | "linkedin") => {
    const url = encodeURIComponent(`${window.location.origin}${path}`);
    const text = encodeURIComponent(title);
    const href = network === "x" ? `https://x.com/intent/post?text=${text}&url=${url}` : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=560");
  };

  const btn = "flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-ink hover:bg-ink hover:text-white sm:size-9";

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <button
        type="button"
        aria-label="Copy link"
        className={btn}
        onClick={async () => {
          await navigator.clipboard.writeText(`${window.location.origin}${path}`);
          toast.success("Link copied");
        }}
      >
        <Link2 className="size-4" />
      </button>
      <button type="button" aria-label="Share on X" className={btn} onClick={() => share("x")}>
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button type="button" aria-label="Share on LinkedIn" className={btn} onClick={() => share("linkedin")}>
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      </button>
    </div>
  );
}
