"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  FileText,
  Megaphone,
  MessagesSquare,
  Plus,
  Rocket,
  Route,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  TrendingUp,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { audiences, helpArticles, helpTopics, type Audience, type HelpArticle } from "@/lib/help-data";

const topicIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "getting-started": Rocket,
  roadmap: Route,
  visa: FileText,
  community: MessagesSquare,
  marketplace: Store,
  account: UserRound,
  setup: Settings2,
  invites: UsersRound,
  insights: BarChart3,
  privacy: ShieldCheck,
  listings: Megaphone,
  leads: TrendingUp,
  "partner-billing": CreditCard,
};

function Question({ article, open, onToggle, label }: { article: HelpArticle; open: boolean; onToggle: () => void; label?: string }) {
  return (
    <li>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 py-4 text-left">
        <span className="min-w-0 flex-1">
          {label && <span className="mb-1 block text-[12px] font-medium text-primary">{label}</span>}
          <span className="block text-[15px] font-medium tracking-[-0.01em] text-ink sm:text-[15.5px]">{article.q}</span>
        </span>
        <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200", open && "rotate-45 border-ink bg-ink text-white")}>
          <Plus className="size-3.5" />
        </span>
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <p className="max-w-[640px] pb-5 text-[14.5px] leading-relaxed text-muted-foreground">{article.a}</p>
        </div>
      </div>
    </li>
  );
}

export function HelpCenter() {
  const [audience, setAudience] = React.useState<Audience>("students");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<string | null>(null);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  const q = query.trim().toLowerCase();
  const topics = helpTopics.filter((t) => t.audience === audience);
  const results = q ? helpArticles.filter((a) => `${a.q} ${a.a}`.toLowerCase().includes(q)) : [];
  const topicTitle = (id: string) => helpTopics.find((t) => t.id === id)?.title;

  return (
    <>
      <div className="mx-auto mt-8 max-w-[600px]">
        <label className="relative block">
          <span className="sr-only">Search help articles</span>
          <Search className="pointer-events-none absolute left-5 top-1/2 size-[18px] -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(null);
            }}
            placeholder="Search for answers"
            className="h-14 w-full rounded-full border bg-white pl-12 pr-12 text-[16px] shadow-[0_8px_30px_-18px_rgba(18,18,20,0.3)] outline-none transition-[border-color,box-shadow] placeholder:text-subtle focus:border-primary/50 focus:ring-[4px] focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>

      {q ? (
        <section aria-live="polite" className="mx-auto mt-14 max-w-[800px]">
          <div className="text-[13px] text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for <span className="font-medium text-ink">&ldquo;{query.trim()}&rdquo;</span>
          </div>
          {results.length > 0 ? (
            <ul className="mt-4 divide-y border-y">
              {results.map((a) => (
                <Question key={a.id} article={a} open={open === a.id} onToggle={() => toggle(a.id)} label={topicTitle(a.topic)} />
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed p-10 text-center">
              <div className="text-[15px] font-semibold text-ink">No answers found</div>
              <p className="mt-1 text-[14px] text-muted-foreground">Try a different word, or ask our team directly.</p>
              <Link href="/contact?topic=student" className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium text-ink underline-offset-4 hover:underline">
                Contact support <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="mt-12 flex justify-center">
            <div role="tablist" aria-label="Choose your audience" className="flex w-full max-w-[420px] rounded-full border bg-[#FAFAFA] p-1 sm:w-auto">
              {audiences.map((a) => (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={audience === a.id}
                  onClick={() => {
                    setAudience(a.id);
                    setOpen(null);
                  }}
                  className={cn("flex-1 rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors sm:px-5", audience === a.id ? "bg-white text-ink shadow-xs ring-1 ring-border" : "text-muted-foreground hover:text-foreground")}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div key={audience} className="animate-in fade-in-0 duration-300">
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => {
                const Icon = topicIcons[t.id] ?? FileText;
                const count = helpArticles.filter((a) => a.topic === t.id).length;
                return (
                  <a key={t.id} href={`#${t.id}`} className="group flex items-start gap-4 rounded-[20px] border bg-white p-5 transition-colors hover:border-ink/20 hover:bg-[#FAFAFA]">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-ink">{t.title}</span>
                      <span className="block text-[13px] text-muted-foreground">{t.body}</span>
                      <span className="mt-2 hidden text-[12px] text-subtle sm:block">
                        {count} {count === 1 ? "article" : "articles"}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                  </a>
                );
              })}
            </div>

            <div className="mt-20 space-y-14">
              {topics.map((t) => (
                <section key={t.id} id={t.id} className="grid scroll-mt-28 grid-cols-1 gap-2 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
                  <div>
                    <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">{t.title}</h2>
                    <p className="mt-1 text-[13.5px] text-muted-foreground">{t.body}</p>
                  </div>
                  <ul className="divide-y border-y">
                    {helpArticles
                      .filter((a) => a.topic === t.id)
                      .map((a) => (
                        <Question key={a.id} article={a} open={open === a.id} onToggle={() => toggle(a.id)} />
                      ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-24 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[24px] bg-ink p-7 sm:p-9">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/30 blur-[90px]" />
          <div className="relative">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white sm:text-[28px]">Still need help?</h2>
            <p className="mt-2 max-w-[400px] text-[15px] leading-relaxed text-white/60">Our team replies within one business day — usually much sooner.</p>
            <Link
              href={`/contact?topic=${audience === "universities" ? "university" : audience === "partners" ? "partner" : "student"}`}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Contact support <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <Link href="/blog" className="group flex flex-col justify-between rounded-[24px] border p-7 transition-colors hover:bg-[#FAFAFA] sm:p-9">
          <div>
            <div className="text-[13px] font-medium text-primary">Journal</div>
            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-ink">In-depth guides on visas, housing and money.</h2>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
            Read the guides <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </>
  );
}
