"use client";

import * as React from "react";
import { toast } from "sonner";
import { ThumbsDown, ThumbsUp, Download, MessageSquareQuote } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/charts/chart-bits";
import { ActivityRings } from "@/components/charts/activity-rings";
import { feedback } from "@/lib/ops-data";

const lowest = [
  { m: "School insurance plan or waiver approved", pct: 64, n: 88 },
  { m: "Immunization records submitted", pct: 71, n: 142 },
  { m: "US bank account planned", pct: 78, n: 51 },
];

export default function FeedbackPage() {
  const [tab, setTab] = React.useState("all");
  const [resolved, setResolved] = React.useState<string[]>([]);
  const list = feedback.filter((f) => tab === "all" || (tab === "neg" ? !f.helpful : tab === "general" ? f.milestone === null : f.helpful));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Insights"
        title="Feedback"
        description="Milestone prompts (“Was this helpful?”) and the general feedback form, across all universities."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success("Feedback exported")}>
            <Download className="size-4" /> Export
          </Button>
        }
      />

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_1.3fr]">
        <div className="flex items-center gap-5 rounded-2xl border bg-white p-5">
          <ActivityRings size={84} stroke={10} rings={[{ value: 0.91, color: "#FF4500" }]}>
            <span className="tabular text-[17px] font-semibold">91%</span>
          </ActivityRings>
          <div>
            <div className="text-[13.5px] font-semibold">Helpful rate</div>
            <div className="mt-0.5 text-[12px] text-muted-foreground">2,184 milestone ratings</div>
          </div>
        </div>
        <KpiCard label="Written comments" value="612" delta={8.3} hint="this month" icon={MessageSquareQuote} />
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-[12.5px] font-medium text-muted-foreground">Needs attention</div>
          <ul className="mt-2.5 space-y-2">
            {lowest.map((l) => (
              <li key={l.m} className="flex items-center gap-3 text-[12.5px]">
                <span className="min-w-0 flex-1 truncate">{l.m}</span>
                <span className={cn("tabular font-semibold", l.pct < 70 ? "text-destructive" : "text-warning")}>{l.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pos">Helpful</TabsTrigger>
            <TabsTrigger value="neg">Not helpful</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {list.map((f) => (
          <div key={f.id} className={cn("rounded-2xl border bg-white p-5 transition-opacity", resolved.includes(f.id) && "opacity-50")}>
            <div className="flex items-center gap-2">
              <span className={cn("flex size-7 items-center justify-center rounded-full", f.helpful ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>
                {f.helpful ? <ThumbsUp className="size-3.5" /> : <ThumbsDown className="size-3.5" />}
              </span>
              <Badge variant="outline">{f.university}</Badge>
              <span className="ml-auto text-[12px] text-subtle">{f.when}</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed">“{f.comment}”</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="truncate text-[12px] text-muted-foreground">{f.milestone ?? "General feedback form"}</span>
              {!f.helpful && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setResolved((r) => [...r, f.id]);
                    toast("Marked as resolved");
                  }}
                >
                  {resolved.includes(f.id) ? "Resolved" : "Mark resolved"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
