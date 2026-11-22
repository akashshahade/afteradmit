"use client";

import * as React from "react";
import Link from "next/link";
import { Share2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/charts/chart-bits";
import { createClient } from "@/lib/supabase/client";
import { inviteLinkPath } from "@/lib/invites";
import { shareInviteLink } from "@/lib/share";
import { cn } from "@/lib/utils";

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
};

const statusClass: Record<string, string> = {
  accepted: "bg-success/10 text-success",
  pending: "bg-primary-soft text-primary",
  expired: "bg-warning-soft text-warning",
  revoked: "bg-muted text-muted-foreground",
};

export default function UniversityOverviewPage() {
  const [rows, setRows] = React.useState<InviteRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_school_invites");
      if (error) throw error;
      setRows((data as InviteRow[]) ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load invites");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const invited = rows.length;
  const joined = rows.filter((r) => r.status === "accepted").length;
  const pending = rows.filter((r) => r.status === "pending").length;
  const expired = rows.filter((r) => r.status === "expired").length;

  const shareOne = async (row: InviteRow) => {
    const url = `${window.location.origin}${inviteLinkPath(row.token)}`;
    const result = await shareInviteLink({
      url,
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
        description="Track invites and join status for your admitted students."
        actions={
          <Button asChild size="sm" variant="ink">
            <Link href="/university/invites">
              <UserPlus className="size-4" /> Invite students
            </Link>
          </Button>
        }
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-tour="kpis">
        <KpiCard label="Invited" value={String(invited)} hint="All invite rows" />
        <KpiCard label="Joined" value={String(joined)} hint="Accepted invites" />
        <KpiCard label="Pending" value={String(pending)} hint="Not joined yet" />
        <KpiCard label="Expired" value={String(expired)} hint="Needs resend" />
      </div>

      <Card className="mt-6">
        <CardHeader className="border-b">
          <CardTitle>Students</CardTitle>
          <CardDescription>
            {loading ? "Loading…" : `${rows.length} invite${rows.length === 1 ? "" : "s"} for your school`}
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
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
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
                    <TableCell className="text-right">
                      {r.status === "pending" && (
                        <Button size="xs" variant="outline" onClick={() => void shareOne(r)}>
                          <Share2 className="size-3.5" /> Share
                        </Button>
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
