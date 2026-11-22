"use client";

import * as React from "react";
import { toast } from "sonner";
import { Download, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/client";
import { loadProviders } from "@/lib/marketplace-live";

type PartnerLeadRow = {
  id: string;
  listing: string;
  milestone: string;
  school: string;
  source: string;
  at: string;
};

function formatAt(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function mapPartnerLead(row: Record<string, unknown>, listingNames: Record<string, string>): PartnerLeadRow {
  const providerId = row.provider_id ? String(row.provider_id) : "";
  const listing =
    String(row.listing_title ?? row.listing ?? row.provider_name ?? (providerId && listingNames[providerId]) ?? providerId ?? "Listing");
  const source = String(row.source ?? "marketplace");
  const milestone = String(row.milestone_title ?? row.milestone ?? row.milestone_id ?? "—");
  const school = String(row.school_name ?? row.school ?? "—");
  const atRaw = String(row.created_at ?? row.clicked_at ?? "");
  return {
    id: String(row.id ?? row.lead_id),
    listing,
    milestone,
    school,
    source: source.charAt(0).toUpperCase() + source.slice(1),
    at: atRaw ? formatAt(atRaw) : "—",
  };
}

export default function PartnerLeads() {
  const [listing, setListing] = React.useState("all");
  const [rows, setRows] = React.useState<PartnerLeadRow[]>([]);

  React.useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const providers = await loadProviders();
      const listingNames = Object.fromEntries(providers.map((p) => [p.id, p.name]));
      const { data, error } = await supabase.rpc("list_partner_leads");
      if (!error && data?.length) {
        setRows((data as Record<string, unknown>[]).map((row) => mapPartnerLead(row, listingNames)));
      }
    })();
  }, []);

  const listings = React.useMemo(() => Array.from(new Set(rows.map((r) => r.listing))), [rows]);
  const visible = rows.filter((e) => listing === "all" || e.listing === listing);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Manage"
        title="Leads"
        description="Every click from a student to your site. Billed per lead."
        actions={
          <Button variant="ink" size="sm" onClick={() => toast.success("Export ready", { description: "leads_export.csv" })}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />

      <div className="mt-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-[12.5px] text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-success" />
        Lead events are anonymous. AfterAdmit never shares student names, emails, or phone numbers — students choose what to share on your site.
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
        <div className="flex items-center gap-2 border-b px-5 py-3">
          <Select value={listing} onValueChange={setListing}>
            <SelectTrigger size="sm" className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All listings</SelectItem>
              {listings.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto text-[12px] text-muted-foreground">
            {visible.length} events{rows.length ? "" : " · connect as partner to load live data"}
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Milestone</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Clicked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-[12px]">{e.id}</TableCell>
                <TableCell className="max-w-[260px] truncate font-medium">{e.listing}</TableCell>
                <TableCell>
                  <Badge variant={e.source === "Milestone" ? "default" : "secondary"}>{e.source}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{e.milestone}</TableCell>
                <TableCell>{e.school}</TableCell>
                <TableCell className="tabular text-muted-foreground">{e.at}</TableCell>
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