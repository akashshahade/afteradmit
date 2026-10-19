"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Ellipsis, Star, Check, X, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig, type FormField } from "@/components/shell/form-sheet";
import { milestones, providers, type Provider } from "@/lib/data";

function providerFields(p?: Provider): FormField[] {
  return [
    { name: "name", label: "Company name", defaultValue: p?.name, required: true, placeholder: "e.g. Northbridge Student Loans" },
    { name: "category", label: "Category", type: "select", defaultValue: p?.category ?? "Loan", options: ["Loan", "Housing", "Banking", "Insurance", "Remittance", "Phone", "Travel", "Moving", "Visa"] },
    { name: "tagline", label: "Tagline", defaultValue: p?.tagline, required: true },
    { name: "perk", label: "Student perk", defaultValue: p?.perk, placeholder: "e.g. 0.25% rate discount" },
    { name: "url", label: "Website", type: "url", defaultValue: p ? `https://${p.id}.example.com` : "", placeholder: "https://" },
    { name: "description", label: "Description", type: "textarea", defaultValue: p?.description },
  ];
}

export default function ProvidersPage() {
  const router = useRouter();
  const [form, setForm] = React.useState<FormSheetConfig | null>(null);
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const [review, setReview] = React.useState(true);
  const list = providers.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) && (tab === "all" || p.category === tab));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Content"
        title="Provider directory"
        description="Vetted partners shown on milestones. Students leave AfterAdmit to complete anything with a provider."
        actions={
          <Button
            size="sm"
            onClick={() =>
              setForm({
                title: "Add provider",
                description: "New providers go live after they're placed on at least one milestone.",
                submitLabel: "Add provider",
                success: "Provider added",
                successDescription: "Draft saved — place it on a milestone to go live.",
                fields: providerFields(),
              })
            }
          >
            <Plus className="size-4" /> Add provider
          </Button>
        }
      />

      {review && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary-soft/50 p-4 sm:flex-row sm:items-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-[12px] font-bold text-white">WC</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold">
              Listing awaiting approval <Badge variant="warning" className="gap-1"><Clock /> In review</Badge>
            </div>
            <div className="text-[12.5px] text-muted-foreground">Westwood Commons · “Studio · Levering Ave” · $2,350/mo · requested placement on “Lease signed”</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setReview(false);
              toast("Listing rejected", { description: "Partner was notified." });
            }}
          >
            <X className="size-4" /> Reject
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setReview(false);
              toast.success("Listing approved", { description: "Now live for UCLA Anderson." });
            }}
          >
            <Check className="size-4" /> Approve
          </Button>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
          <Tabs value={tab} onValueChange={setTab} className="max-w-full overflow-x-auto scrollbar-none">
            <TabsList className="h-8">
              {["all", "Loan", "Housing", "Banking", "Insurance", "Travel"].map((c) => (
                <TabsTrigger key={c} value={c} className="text-[12.5px] capitalize">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:ml-auto sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search providers" className="h-8 pl-8 text-[13px]" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Placements</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Leads (30d)</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((p) => {
              const placements = milestones.filter((m) => m.providers?.includes(p.id)).length;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: p.color }}>
                        {p.initials}
                      </span>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="max-w-[260px] truncate text-[12px] text-muted-foreground">{p.tagline}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="tabular">{placements} milestones</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-[#f5a524] text-[#f5a524]" /> {p.rating}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="tabular w-8 font-medium">{p.leads}</span>
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${(p.leads / 318) * 100}%` }} />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[11.5px] text-muted-foreground">ref=aa_{p.id}</TableCell>
                  <TableCell>
                    <Switch defaultChecked={p.active} onCheckedChange={(v) => toast(v ? `${p.name} activated` : `${p.name} deactivated`)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Actions">
                          <Ellipsis className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() =>
                            setForm({ title: `Edit ${p.name}`, success: "Provider updated", successDescription: p.name, fields: providerFields(p) })
                          }
                        >
                          Edit provider
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push("/admin/roadmap")}>Manage placements</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push("/admin/leads")}>View leads</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => toast(`${p.name} deactivated`, { description: "Hidden from students until reactivated." })}>
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className={cn("mt-3 text-[12px] text-muted-foreground")}>Provider links use outbound URLs with tracking parameters, so every click is attributed to a milestone and school.</p>
      <FormSheet config={form} onClose={() => setForm(null)} />
    </PageContainer>
  );
}
