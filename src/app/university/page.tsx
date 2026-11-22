"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Share2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/charts/chart-bits";
import { createClient } from "@/lib/supabase/client";
import { inviteLinkPath } from "@/lib/invites";
import { shareInviteLink } from "@/lib/share";
import { cn, formatDate } from "@/lib/utils";
import type { AdmissionBatch } from "@/lib/university-batches";

type InviteRow = {
  id: string;
  token: string;
  email: string;
  first_name: string;
  last_name: string;
  program: string;
  intake: string;
  status: string;
  created_at: string;
  batch_id?: string | null;
  program_start?: string | null;
};

type ProgressRow = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  done_count: number;
  total_count: number;
};

const statusClass: Record<string, string> = {
  accepted: "bg-success/10 text-success",
  pending: "bg-primary-soft text-primary",
  expired: "bg-warning-soft text-warning",
  revoked: "bg-muted text-muted-foreground",
};

export default function UniversityOverviewPage() {
  const [rows, setRows] = React.useState<InviteRow[]>([]);
  const [batches, setBatches] = React.useState<AdmissionBatch[]>([]);
  const [batchId, setBatchId] = React.useState<string>("all");
  const [progressByEmail, setProgressByEmail] = React.useState<Record<string, ProgressRow>>({});
  const [loading, setLoading] = React.useState(true);

  const loadBatches = React.useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("list_school_batches");
    const list = (data as AdmissionBatch[]) ?? [];
    setBatches(list);
    const active = list.find((b) => b.is_active);
    if (active) setBatchId((cur) => (cur === "all" ? active.id : cur));
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const batchArg = batchId !== "all" ? batchId : null;
      const [{ data, error }, { data: progress }] = await Promise.all([
        supabase.rpc("list_school_invites", { p_batch_id: batchArg }),
        supabase.rpc("list_school_progress"),
      ]);
      if (error) throw error;
      setRows((data as InviteRow[]) ?? []);
      const map: Record<string, ProgressRow> = {};
      for (const p of (progress as ProgressRow[]) ?? []) {
        map[p.email.toLowerCase()] = p;
      }
      setProgressByEmail(map);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load invites");
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  React.useEffect(() => {
    void loadBatches();
  }, [loadBatches]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const selectedBatch = batches.find((b) => b.id === batchId);
  const invited = rows.length;
  const joined = rows.filter((r) => r.status === "accepted").length;
  const pending = rows.filter((r) => r.status === "pending").length;
  const expired = rows.filter((r) => r.status === "expired").length;
  const joinedEmails = new Set(rows.filter((r) => r.status === "accepted").map((r) => r.email.toLowerCase()));
  const progressValues = Object.values(progressByEmail).filter(
    (p) => p.total_count > 0 && (batchId === "all" || joinedEmails.has(p.email.toLowerCase())),
  );
  const avgPct = progressValues.length
    ? Math.round(
        progressValues.reduce((sum, p) => sum + (p.done_count / Math.max(p.total_count, 1)) * 100, 0) /
          progressValues.length,
      )
    : 0;

  const inviteUrl = (token: string) => `${window.location.origin}${inviteLinkPath(token)}`;

  const copyOne = async (row: InviteRow) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(row.token));
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareOne = async (row: InviteRow) => {
    const result = await shareInviteLink({
      url: inviteUrl(row.token),
      studentName: `${row.first_name} ${row.last_name}`.trim() || row.email,
    });
    if (result === "shared") toast.success("Invite shared");
    else if (result === "copied") toast.success("Invite link copied");
    else if (result === "mailto") toast.message("Opened email draft");
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="University"
        title="Class overview"
        description={
          selectedBatch
            ? `${selectedBatch.name} · ${selectedBatch.program} · starts ${formatDate(selectedBatch.program_start)}`
            : "Track invites and join status for your admitted students."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={batchId} onValueChange={setBatchId}>
              <SelectTrigger className="h-8 w-[220px] rounded-full text-[12.5px]">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All batches</SelectItem>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} · {b.program}
                    {b.is_active ? " (active)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild size="sm" variant="ink">
              <Link href="/university/invites">
                <UserPlus className="size-4" /> Invite students
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" data-tour="kpis">
        <KpiCard label="Invited" value={String(invited)} hint="In this view" />
        <KpiCard label="Joined" value={String(joined)} hint="Accepted invites" />
        <KpiCard label="Pending" value={String(pending)} hint="Not joined yet" />
        <KpiCard label="Expired" value={String(expired)} hint="Needs resend" />
        <KpiCard label="Avg roadmap" value={`${avgPct}%`} hint="Aggregate completion" />
      </div>

      {selectedBatch && (
        <Card className="mt-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="text-[13px]">
              <span className="font-medium">Program starts {formatDate(selectedBatch.program_start, { month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="text-muted-foreground">
                {selectedBatch.orientation_date
                  ? ` · Orientation ${formatDate(selectedBatch.orientation_date)}`
                  : ""}
                {selectedBatch.housing_deadline
                  ? ` · Housing ${formatDate(selectedBatch.housing_deadline)}`
                  : ""}
              </span>
            </div>
            <Button asChild size="xs" variant="outline">
              <Link href="/university/batches">Manage batches</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader className="border-b">
          <CardTitle>Students</CardTitle>
          <CardDescription>
            {loading ? "Loading…" : `${rows.length} invite${rows.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Roadmap</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No invites yet.{" "}
                      <Link href="/university/invites" className="font-medium text-foreground underline-offset-4 hover:underline">
                        Invite your first students
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {`${r.first_name} ${r.last_name}`.trim() || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.email}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {r.program} · {r.intake}
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize", statusClass[r.status] ?? "bg-muted")}>
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {(() => {
                        const p = progressByEmail[r.email.toLowerCase()];
                        if (!p || !p.total_count) return "—";
                        return `${Math.round((p.done_count / p.total_count) * 100)}%`;
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.status === "pending" && (
                        <div className="flex justify-end gap-1.5">
                          <Button size="xs" variant="outline" onClick={() => void copyOne(r)}>
                            <Copy className="size-3.5" /> Copy
                          </Button>
                          <Button size="xs" variant="outline" onClick={() => void shareOne(r)}>
                            <Share2 className="size-3.5" /> Share
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
