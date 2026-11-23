"use client";

import * as React from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Filter, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { ChartTooltip } from "@/components/charts/chart-bits";
import { type Provider } from "@/lib/data";
import { loadProvidersAdmin, loadRecentClicks, loadAdminLeadsAnalytics } from "@/lib/admin-live";

type ClickRow = {
  id: string;
  provider_id: string;
  school_name: string | null;
  milestone_id: string | null;
  source: string | null;
  created_at: string;
  user_id: string | null;
};

type LeadRow = {
  id: string;
  student: string;
  university: string;
  provider: string;
  milestone: string;
  clicked: string;
};

function pseudoStudent(userId: string | null) {
  if (!userId) return "—";
  return `stu_${userId.replace(/-/g, "").slice(0, 4)}`;
}

function formatClicked(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function clickToLead(c: ClickRow, providerName: string): LeadRow {
  return {
    id: String(c.id),
    student: pseudoStudent(c.user_id),
    university: c.school_name ?? "—",
    provider: providerName,
    milestone: c.milestone_id ?? "—",
    clicked: formatClicked(c.created_at),
  };
}

function mapProviderRow(row: Record<string, unknown>): Provider {
  const name = String(row.name ?? "");
  return {
    id: String(row.id),
    name,
    category: String(row.category ?? "Loan") as Provider["category"],
    tagline: String(row.tagline ?? ""),
    description: String(row.description ?? ""),
    initials: String(row.initials || name.slice(0, 2).toUpperCase()),
    color: String(row.color || "#18181B"),
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    url: String(row.url || "#"),
    leads: 0,
    active: !!row.active,
  };
}

export default function LeadsPage() {
  const [uni, setUni] = React.useState("all");
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [rows, setRows] = React.useState<LeadRow[]>([]);
  const [leadsTrend, setLeadsTrend] = React.useState<{ d: string; leads: number; signups?: number }[]>([]);

  React.useEffect(() => {
    void Promise.all([loadRecentClicks(), loadProvidersAdmin(), loadAdminLeadsAnalytics()])
      .then(([clicks, providerRows, analytics]) => {
        const mappedProviders = providerRows.map((row) => mapProviderRow(row as Record<string, unknown>));
        setProviders(mappedProviders);
        setLeadsTrend(analytics?.trend ?? []);
        const names = Object.fromEntries(mappedProviders.map((p) => [p.id, p.name]));
        const leadRows = (clicks as ClickRow[]).map((c) => clickToLead(c, names[c.provider_id] ?? c.provider_id));
        setRows(leadRows);
        const counts: Record<string, number> = {};
        for (const c of clicks as ClickRow[]) counts[c.provider_id] = (counts[c.provider_id] ?? 0) + 1;
        setProviders((prev) => prev.map((p) => ({ ...p, leads: counts[p.id] ?? 0 })));
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load leads"));
  }, []);

  const visible = rows.filter((l) => uni === "all" || l.university === uni);
  const universities = React.useMemo(() => {
    return ["all", ...Array.from(new Set(rows.map((l) => l.university).filter((u) => u && u !== "—")))];
  }, [rows]);
  const top = [...providers].sort((a, b) => b.leads - a.leads).slice(0, 6);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Insights"
        title="Leads"
        description="Every provider click is a lead event: student, provider, milestone, university, timestamp."
        actions={
          <Button size="sm" variant="ink" onClick={() => toast.success("Export ready", { description: `leads_export.csv · ${rows.length} rows` })}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Filter className="size-4 text-subtle" />
        <Select value={uni} onValueChange={setUni}>
          <SelectTrigger size="sm" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {universities.map((u) => (
              <SelectItem key={u} value={u}>
                {u === "all" ? "All universities" : u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger size="sm" className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All providers</SelectItem>
            {providers.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="12w">
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="12w">Last 12 weeks</SelectItem>
            <SelectItem value="custom">Custom range…</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly lead volume</CardTitle>
            <CardDescription>A lead is counted when a student clicks through to a provider.</CardDescription>
          </CardHeader>
          <CardContent className="pl-1 pr-5 pt-4">
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsTrend.length ? leadsTrend : [{ d: "—", leads: 0 }]} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f0f0f2" />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} width={34} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#fafafa" }} />
                  <Bar dataKey="leads" name="Leads" fill="#FF4500" radius={[5, 5, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top providers</CardTitle>
            <CardDescription>Leads from recent clicks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-4">
            {top.length === 0 && <p className="text-[13px] text-muted-foreground">No provider leads yet.</p>}
            {top.map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="size-2 rounded-sm" style={{ background: p.color }} />
                    {p.name}
                  </span>
                  <span className="tabular font-semibold">{p.leads}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${top[0]?.leads ? (p.leads / top[0].leads) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="text-[13.5px] font-semibold">Lead events</div>
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Info className="size-3.5" /> Student IDs are pseudonymous. Never shown to university admins.
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Milestone</TableHead>
              <TableHead>Clicked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-[12px]">{l.id}</TableCell>
                <TableCell className="font-mono text-[12px] text-muted-foreground">{l.student}</TableCell>
                <TableCell>
                  <Badge variant="outline">{l.university}</Badge>
                </TableCell>
                <TableCell className="font-medium">{l.provider}</TableCell>
                <TableCell className="max-w-[240px] truncate text-muted-foreground">{l.milestone}</TableCell>
                <TableCell className="tabular text-muted-foreground">{l.clicked}</TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[13px] text-muted-foreground">
                  No lead events yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}