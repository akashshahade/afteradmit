"use client";

import * as React from "react";
import { toast } from "sonner";
import { Download, Check } from "lucide-react";

import { downloadFile, toCsv } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig } from "@/components/shell/form-sheet";
import { loadPartnerBilling, type PartnerBillingOverview } from "@/lib/partner-live";

function formatCents(cents: number, currency = "USD") {
  const sym = currency === "USD" ? "$" : `${currency} `;
  return `${sym}${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PartnerBilling() {
  const [cap, setCap] = React.useState(6000);
  const [form, setForm] = React.useState<FormSheetConfig | null>(null);
  const [billing, setBilling] = React.useState<PartnerBillingOverview | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    void (async () => {
      try {
        const data = await loadPartnerBilling();
        setBilling(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load billing");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const plan = billing?.plan;
  const invoices = billing?.invoices ?? [];
  const leadsMonth = billing?.leads_month ?? 0;
  const spendCents = plan ? leadsMonth * plan.amount_cents : 0;
  const features = Array.isArray(plan?.features) ? (plan.features as string[]) : [];

  if (loading) {
    return (
      <PageContainer className="max-w-[1000px]">
        <PageHeader eyebrow="Manage" title="Billing" description="Loading billing…" />
        <Skeleton className="mt-7 h-[220px] rounded-2xl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-[1000px]">
      <PageHeader eyebrow="Manage" title="Billing" description="Pay-per-lead pricing. You're invoiced monthly for verified lead events." />

      <div className="mt-7 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12.5px] font-medium text-muted-foreground">Current plan</div>
              <div className="mt-1 text-[20px] font-semibold tracking-tight">{plan?.name ?? "No plan"}</div>
            </div>
            <Badge variant={plan?.active ? "ink" : "secondary"}>{plan?.active ? "Active" : "Inactive"}</Badge>
          </div>
          {plan ? (
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="tabular text-[34px] font-semibold tracking-[-0.03em]">{formatCents(plan.amount_cents, plan.currency)}</span>
              <span className="text-[13px] text-muted-foreground">per lead · {plan.audience}</span>
            </div>
          ) : (
            <p className="mt-4 text-[13px] text-muted-foreground">No subscription plan on file.</p>
          )}
          <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
            {(features.length ? features : ["Milestone + marketplace placement", "Monthly lead export"]).map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-3.5 text-primary" strokeWidth={2.5} /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-[12.5px] font-medium text-muted-foreground">This month</div>
          <div className="tabular mt-1 text-[28px] font-semibold tracking-tight">{formatCents(spendCents, plan?.currency ?? "USD")}</div>
          <div className="text-[12.5px] text-muted-foreground">
            {leadsMonth} lead{leadsMonth === 1 ? "" : "s"}
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Monthly cap</span>
              <span className="tabular font-medium">
                {formatCents(spendCents)} / ${cap.toLocaleString("en-US")}
              </span>
            </div>
            <Progress value={cap ? Math.min(100, (spendCents / 100 / cap) * 100) : 0} className="mt-1.5" />
          </div>
          <Button
            variant="outline"
            size="xs"
            className="mt-4"
            onClick={() =>
              setForm({
                title: "Monthly spend cap",
                description: "Listings pause automatically when you reach the cap and resume on the 1st.",
                success: "Spend cap updated",
                fields: [{ name: "cap", label: "Cap (USD per month)", type: "number", defaultValue: cap, required: true }],
                onSubmit: (v) => setCap(Math.max(100, Number(v.cap) || cap)),
              })
            }
          >
            Adjust cap
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-[14.5px] font-semibold">Payment method</div>
          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              setForm({
                title: "Update payment method",
                description: "Invoices are paid automatically on their due date.",
                success: "Payment method updated",
                fields: [
                  { name: "type", label: "Method", type: "select", options: ["ACH bank transfer", "Corporate card"] },
                  { name: "holder", label: "Account holder", required: true },
                ],
              })
            }
          >
            Update
          </Button>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 text-[13px] text-muted-foreground">
          Payment details are managed outside this portal for now.
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
        <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Invoices</div>
        {invoices.length === 0 ? (
          <p className="px-6 py-10 text-center text-[13px] text-muted-foreground">No invoices yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => {
                const statusLabel = i.status.charAt(0).toUpperCase() + i.status.slice(1);
                const paid = i.status.toLowerCase() === "paid";
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-[12px]">{i.id.slice(0, 8)}</TableCell>
                    <TableCell className="text-muted-foreground">{i.description ?? "—"}</TableCell>
                    <TableCell className="tabular font-medium">{formatCents(i.amount_cents, i.currency)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(i.due_at)}</TableCell>
                    <TableCell>
                      <Badge variant={paid ? "success" : "warning"}>{statusLabel}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Download invoice`}
                        onClick={() => {
                          downloadFile(
                            `invoice-${i.id.slice(0, 8)}.csv`,
                            toCsv([
                              ["Invoice", "Amount", "Due", "Status", "Paid"],
                              [i.id, formatCents(i.amount_cents, i.currency), formatDate(i.due_at), statusLabel, formatDate(i.paid_at)],
                            ]),
                          );
                          toast.success("Invoice downloaded");
                        }}
                      >
                        <Download className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
      <FormSheet config={form} onClose={() => setForm(null)} />
    </PageContainer>
  );
}