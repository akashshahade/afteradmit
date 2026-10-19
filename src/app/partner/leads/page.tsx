"use client";

import * as React from "react";
import { toast } from "sonner";
import { Download, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { listings } from "@/lib/ops-data";

const events = [
  { id: "L-20930", listing: "Furnished 3-bed suite · Gayley Ave", milestone: "Lease signed", school: "UCLA Anderson", source: "Milestone", at: "Jul 8, 09:02" },
  { id: "L-20924", listing: "Arrival short-stay beds (2–14 nights)", milestone: "Arrival plan made", school: "UCLA Anderson", source: "Milestone", at: "Jul 7, 19:55" },
  { id: "L-20917", listing: "Furnished 3-bed suite · Gayley Ave", milestone: "Roommates confirmed", school: "UCLA Anderson", source: "Community post", at: "Jul 7, 14:12" },
  { id: "L-20911", listing: "Arrival short-stay beds (2–14 nights)", milestone: "—", school: "Bayview", source: "Marketplace", at: "Jul 7, 10:40" },
  { id: "L-20904", listing: "Furnished 3-bed suite · Gayley Ave", milestone: "Lease signed", school: "UCLA Anderson", source: "Milestone", at: "Jul 6, 22:18" },
  { id: "L-20898", listing: "Furnished 3-bed suite · Gayley Ave", milestone: "—", school: "UCLA Anderson", source: "Marketplace", at: "Jul 6, 17:03" },
  { id: "L-20889", listing: "Arrival short-stay beds (2–14 nights)", milestone: "Arrival plan made", school: "Bayview", source: "Milestone", at: "Jul 6, 09:51" },
];

export default function PartnerLeads() {
  const [listing, setListing] = React.useState("all");
  const rows = events.filter((e) => listing === "all" || e.listing === listing);
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Manage"
        title="Leads"
        description="Every click from a student to your site. Billed per lead."
        actions={
          <Button variant="ink" size="sm" onClick={() => toast.success("Export ready", { description: "westwood_leads_june.csv" })}>
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
                <SelectItem key={l.id} value={l.title}>
                  {l.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto text-[12px] text-muted-foreground">{rows.length} events · last 3 days</span>
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
            {rows.map((e) => (
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
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
