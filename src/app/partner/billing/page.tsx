"use client";

import * as React from "react";
import { toast } from "sonner";
import { Download, Check } from "lucide-react";

import { formatNumber } from "@/lib/utils";
import { downloadFile, toCsv } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig } from "@/components/shell/form-sheet";
import { partner, partnerInvoices } from "@/lib/ops-data";

export default function PartnerBilling() {
  const [cap, setCap] = React.useState(6000);
  const [form, setForm] = React.useState<FormSheetConfig | null>(null);
  return (
    <PageContainer className="max-w-[1000px]">
      <PageHeader eyebrow="Manage" title="Billing" description="Pay-per-lead pricing. You're invoiced monthly for verified lead events." />

      <div className="mt-7 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12.5px] font-medium text-muted-foreground">Current plan</div>
              <div className="mt-1 text-[20px] font-semibold tracking-tight">{partner.plan}</div>
            </div>
            <Badge variant="ink">Active</Badge>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="tabular text-[34px] font-semibold tracking-[-0.03em]">${partner.cpl}</span>
            <span className="text-[13px] text-muted-foreground">per lead · Housing category</span>
          </div>
          <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
            {["Milestone + marketplace placement", "Partner badge in community", "Monthly CSV lead export", "Dedicated partner manager"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-3.5 text-primary" strokeWidth={2.5} /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-[12.5px] font-medium text-muted-foreground">July so far</div>
          <div className="tabular mt-1 text-[28px] font-semibold tracking-tight">$560.00</div>
          <div className="text-[12.5px] text-muted-foreground">70 leads · 8 days</div>
          <div className="mt-5">
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Monthly cap</span>
              <span className="tabular font-medium">$560 / ${cap.toLocaleString("en-US")}</span>
            </div>
            <Progress value={Math.min(100, (560 / cap) * 100)} className="mt-1.5" />
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
                  { name: "holder", label: "Account holder", defaultValue: partner.company, required: true },
                  { name: "routing", label: "Routing number", placeholder: "9 digits" },
                  { name: "account", label: "Account number", placeholder: "•••• 6621" },
                ],
              })
            }
          >
            Update
          </Button>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <span className="flex h-8 w-12 items-center justify-center rounded-md bg-ink text-[10px] font-bold tracking-wider text-white">ACH</span>
          <div className="flex-1">
            <div className="text-[13px] font-medium">Business checking ····6621</div>
            <div className="text-[12px] text-muted-foreground">Auto-pay on invoice due date</div>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
        <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Invoices</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerInvoices.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-[12px]">{i.id}</TableCell>
                <TableCell>{i.period}</TableCell>
                <TableCell className="tabular">{i.leads}</TableCell>
                <TableCell className="tabular font-medium">${formatNumber(i.amount)}.00</TableCell>
                <TableCell className="text-muted-foreground">{i.due}</TableCell>
                <TableCell>
                  <Badge variant={i.status === "Paid" ? "success" : "warning"}>{i.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {i.status === "Due" ? (
                    <Button size="xs" onClick={() => toast.success("Payment scheduled")}>
                      Pay now
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Download ${i.id}`}
                      onClick={() => {
                        downloadFile(
                          `${i.id}.csv`,
                          toCsv([
                            ["Invoice", "Period", "Leads", "Amount (USD)", "Due", "Status"],
                            [i.id, i.period, i.leads, i.amount, i.due, i.status],
                          ]),
                        );
                        toast.success("Invoice downloaded", { description: i.id });
                      }}
                    >
                      <Download className="size-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <FormSheet config={form} onClose={() => setForm(null)} />
    </PageContainer>
  );
}
