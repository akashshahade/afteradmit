"use client";

import * as React from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MousePointerClick, Percent, Wallet, Store, ChevronRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

import { cn, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { ChartTooltip, KpiCard } from "@/components/charts/chart-bits";
import { SegmentedDonut } from "@/components/charts/segmented-donut";
import { loadPartnerOverview, type PartnerOverview } from "@/lib/partner-live";

const ringColors = ["#6366F1", "#14B8A6", "#F59E0B", "#EC4899"];

export default function PartnerOverviewPage() {
  const [overview, setOverview] = React.useState<PartnerOverview | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeRing, setActiveRing] = React.useState<number | null>(null);

  React.useEffect(() => {
    void (async () => {
      try {
        const data = await loadPartnerOverview();
        setOverview(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load overview");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const partnerTrend = overview?.daily ?? [];
  const partnerByMilestone = overview?.by_milestone ?? [];
  const listings = overview?.listings ?? [];
  const orgName = overview?.org_name ?? "Partner";
  const total = partnerByMilestone.reduce((n, m) => n + m.clicks, 0) || 1;
  const sources = partnerByMilestone.map((m, i) => {
    const share = m.clicks / total;
    return { ...m, share, color: ringColors[i % ringColors.length], pct: Math.round(share * 100) };
  });
  const activeCount = overview?.active_listings ?? listings.filter((l) => l.active).length;
  const totalListings = overview?.total_listings ?? listings.length;

  if (loading) {
    return (
      <PageContainer>
        <PageHeader eyebrow="Partner portal" title="Overview" description="Loading your dashboard…" />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[108px] rounded-2xl" />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-[320px] rounded-2xl" />
          <Skeleton className="h-[320px] rounded-2xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow={`${orgName} · Partner portal`}
        title={`Welcome back`}
        description="How your listings are performing with admitted students."
      />

      <div data-tour="kpis" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Leads this month"
          value={formatNumber(overview?.leads_month ?? 0)}
          hint="this month"
          icon={MousePointerClick}
          spark={partnerTrend.map((d) => d.clicks)}
        />
        <KpiCard label="Total leads" value={formatNumber(overview?.leads_total ?? 0)} hint="all time" icon={Percent} />
        <KpiCard label="Leads (chart period)" value={formatNumber(partnerTrend.reduce((n, d) => n + d.clicks, 0))} hint="daily series" icon={Wallet} />
        <KpiCard
          label="Active listings"
          value={`${activeCount} of ${totalListings}`}
          hint={totalListings - activeCount > 0 ? `${totalListings - activeCount} paused` : "all live"}
          icon={Store}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card data-tour="daily">
          <CardHeader>
            <CardTitle>Daily leads</CardTitle>
            <CardDescription>Clicks from students to your listings</CardDescription>
          </CardHeader>
          <CardContent className="relative min-h-[250px] flex-1 pl-1 pr-5 pt-4">
            {partnerTrend.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center text-[13px] text-muted-foreground">No click data yet.</div>
            ) : (
              <div className="absolute inset-0 pb-5 pl-1 pr-5 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={partnerTrend} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF4500" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#FF4500" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f0f0f2" />
                    <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} interval={1} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} width={28} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e4e4e7" }} />
                    <Area type="monotone" dataKey="clicks" name="Leads" stroke="#FF4500" strokeWidth={2} fill="url(#gP)" activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-tour="sources">
          <CardHeader>
            <CardTitle>Where students find you</CardTitle>
            <CardDescription>Share of leads by roadmap milestone</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-5">
            {sources.length === 0 ? (
              <p className="py-8 text-[13px] text-muted-foreground">No milestone breakdown yet.</p>
            ) : (
              <>
                <SegmentedDonut
                  size={168}
                  stroke={14}
                  active={activeRing}
                  onActiveChange={setActiveRing}
                  segments={sources.map((s) => ({ label: s.milestone, value: s.clicks, color: s.color }))}
                />
                <ul className="w-full divide-y" onMouseLeave={() => setActiveRing(null)}>
                  {sources.map((s, i) => (
                    <li
                      key={s.milestone}
                      onMouseEnter={() => setActiveRing(i)}
                      className={cn(
                        "flex cursor-default items-center gap-3 py-2.5 transition-opacity duration-200 first:pt-0 last:pb-0",
                        activeRing !== null && activeRing !== i && "opacity-40",
                      )}
                    >
                      <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{s.milestone}</span>
                      <span className="tabular text-[13px] font-semibold text-ink">{s.clicks}</span>
                      <span
                        className="tabular w-10 text-right text-[12px] text-muted-foreground transition-colors"
                        style={activeRing === i ? { color: s.color } : undefined}
                      >
                        {s.pct}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card data-tour="listings">
          <CardHeader>
            <CardTitle>Your listings</CardTitle>
            <CardDescription>Performance this month</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="xs" className="text-muted-foreground">
                <Link href="/partner/listings">
                  Manage <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-3">
            {listings.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">No listings yet.</p>
            ) : (
              listings.map((l) => (
                <Link key={l.id} href="/partner/listings" className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[#fafafa]">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{l.name}</div>
                    <div className="mt-0.5 text-[12px] text-muted-foreground">{l.category}</div>
                  </div>
                  <Badge variant={l.active ? "success" : "secondary"}>{l.active ? "Live" : "Paused"}</Badge>
                  <div className="w-16 text-right">
                    <div className="tabular text-[13px] font-semibold">{l.clicks}</div>
                    <div className="text-[11px] text-muted-foreground">leads</div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-ink bg-ink text-white">
          <div className="pointer-events-none absolute -bottom-24 -right-16 size-60 rounded-full bg-primary/30 blur-3xl" />
          <CardContent className="relative flex h-full flex-col p-6">
            <ShieldCheck className="size-5 text-primary" />
            <div className="mt-4 text-[16px] font-semibold tracking-tight">How leads work</div>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              A lead is a student clicking through to your site from a milestone or the marketplace. AfterAdmit never shares student contact details — students choose what to share with you.
            </p>
            <div className="mt-auto pt-6">
              <Button asChild variant="outline" size="sm" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link href="/partner/leads">
                  View lead activity <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}