"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowUpRight, BadgeCheck, Copy, Search, ShieldCheck, Star, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageContainer } from "@/components/shell/app-shell";
import { milestones, providers, type Provider } from "@/lib/data";

const categories = ["All", "Loan", "Housing", "Banking", "Insurance", "Remittance", "Phone", "Travel", "Visa", "Moving"] as const;

export default function MarketplacePage() {
  const [cat, setCat] = React.useState<(typeof categories)[number]>("All");
  const [q, setQ] = React.useState("");
  const [leaving, setLeaving] = React.useState<Provider | null>(null);

  const list = providers.filter((p) => (cat === "All" || p.category === cat) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.tagline.toLowerCase().includes(q.toLowerCase())));
  const placementsFor = (id: string) => milestones.filter((m) => m.providers?.includes(id));

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[12px] font-medium text-muted-foreground">Vetted by AfterAdmit</div>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-ink">Marketplace</h1>
          <p className="mt-1 max-w-xl text-[13.5px] text-muted-foreground">Trusted providers for loans, housing, banking and more — with student perks. You&apos;ll complete everything on the provider&apos;s site.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search providers" className="pl-9" />
        </div>
      </div>

      <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "h-8 shrink-0 rounded-full border px-3.5 text-[12.5px] font-medium transition-colors",
              cat === c ? "border-ink bg-ink text-white" : "bg-white text-muted-foreground hover:border-[#d4d4d8] hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[12.5px] text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-success" />
        AfterAdmit never shares your contact details with providers. You choose what to share on their site.
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const placements = placementsFor(p.id);
          return (
            <div key={p.id} className="group flex flex-col rounded-2xl border bg-white p-5 transition-all hover:border-[#d4d4d8] hover:shadow-md">
              <div className="flex items-start gap-3.5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white" style={{ background: p.color }}>
                  {p.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[14px] font-semibold">{p.name}</span>
                    <BadgeCheck className="size-4 shrink-0 text-success" aria-label="Verified" />
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Badge variant="secondary" className="font-medium">{p.category}</Badge>
                    <span className="flex items-center gap-0.5">
                      <Star className="size-3 fill-[#f5a524] text-[#f5a524]" /> {p.rating}
                      <span className="text-subtle">({p.reviews})</span>
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3.5 text-[13px] font-medium">{p.tagline}</p>
              <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">{p.description}</p>

              {p.perk && (
                <div className="mt-3.5 flex items-center justify-between gap-2 rounded-lg bg-primary-soft/70 px-3 py-2">
                  <span className="text-[12px] font-medium text-primary">{p.perk}</span>
                  {p.code && (
                    <button
                      onClick={() => toast.success("Code copied", { description: p.code })}
                      className="flex items-center gap-1 rounded-md border border-primary/20 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary"
                    >
                      {p.code} <Copy className="size-3" />
                    </button>
                  )}
                </div>
              )}

              {placements.length > 0 && (
                <div className="mt-3 text-[11.5px] text-subtle">
                  Helps with: <span className="text-muted-foreground">{placements.map((m) => m.title).join(", ")}</span>
                </div>
              )}

              <div className="mt-auto pt-4">
                <Button variant="outline" className="w-full group-hover:border-ink group-hover:bg-ink group-hover:text-white" onClick={() => setLeaving(p)}>
                  Visit {p.name.split(" ")[0]} <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!leaving} onOpenChange={(o) => !o && setLeaving(null)}>
        {leaving && (
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <span className="mb-2 flex size-11 items-center justify-center rounded-xl text-[13px] font-bold text-white" style={{ background: leaving.color }}>
                {leaving.initials}
              </span>
              <DialogTitle>You&apos;re leaving AfterAdmit</DialogTitle>
              <DialogDescription>
                We&apos;ll open {leaving.name} in a new tab. Nothing is purchased or shared from AfterAdmit — you decide what to share with them.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-[12px] text-muted-foreground">
              <Info className="mt-px size-3.5 shrink-0" />
              Link includes a referral tag so {leaving.name.split(" ")[0]} can honour your student perk.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeaving(null)}>
                Stay here
              </Button>
              <Button
                variant="ink"
                onClick={() => {
                  window.open(`/go/${leaving.id}?ref=afteradmit&s=ucla`, "_blank", "noopener");
                  toast(`Opened ${leaving.name} in a new tab`, { description: "Lead recorded · ref=afteradmit&s=ucla" });
                  setLeaving(null);
                }}
              >
                Continue <ArrowUpRight className="size-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </PageContainer>
  );
}
