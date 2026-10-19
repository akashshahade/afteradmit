"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, GraduationCap, MousePointerClick, CheckCheck, UserCheck, ThumbsUp, ThumbsDown, ChevronRight, Plus } from "lucide-react";

import { formatNumber } from "@/lib/utils";
import { downloadFile, toCsv } from "@/lib/download";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { ChartTooltip, KpiCard } from "@/components/charts/chart-bits";
import { ActivityRings } from "@/components/charts/activity-rings";
import { feedback, kpis, leadsByCategory, leadsTrend, stageCompletion, universities } from "@/lib/ops-data";

export default function AdminOverview() {
  const totalLeads = leadsByCategory.reduce((n, c) => n + c.leads, 0);
  const live = universities.filter((u) => u.status === "Live");

  return (
    <PageContainer>
      <PageHeader
        eyebrow="AfterAdmit · Operations"
        title="Overview"
        description="Activation, progress, and partner leads across every university."
        actions={
          <>
            <Select defaultValue="30">
              <SelectTrigger size="sm" className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 12 weeks</SelectItem>
                <SelectItem value="term">Fall 2027 term</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadFile(
                  "afteradmit-overview.csv",
                  toCsv([
                    ["University", "Status", "Invited", "Joined", "Activation %", "Avg progress %"],
                    ...universities.map((u) => [u.short, u.status, u.students, u.signedUp, u.students ? Math.round((u.signedUp / u.students) * 100) : 0, u.avgProgress]),
                  ]),
                );
                toast.success("Report downloaded", { description: "afteradmit-overview.csv" });
              }}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/universities?new=1">
                <Plus className="size-4" /> Add university
              </Link>
            </Button>
          </>
        }
      />

      <div data-tour="kpis" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Invited students" value={formatNumber(kpis.students)} delta={kpis.studentsDelta} hint="vs last period" icon={GraduationCap} spark={[12, 18, 22, 30, 41, 48, 55, 63]} />
        <KpiCard label="Activation rate" value={`${kpis.activation}%`} delta={kpis.activationDelta} hint="signed up" icon={UserCheck} spark={[52, 55, 58, 61, 64, 66, 69, 71]} />
        <KpiCard label="Provider leads" value={formatNumber(kpis.leads)} delta={kpis.leadsDelta} hint="clicks" icon={MousePointerClick} spark={[31, 44, 58, 72, 69, 88, 104, 121, 139, 168]} />
        <KpiCard label="Milestones completed" value={formatNumber(kpis.milestonesDone)} delta={kpis.milestonesDelta} hint="all schools" icon={CheckCheck} spark={[3, 5, 6, 9, 12, 14, 18, 22]} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Leads & sign-ups</CardTitle>
            <CardDescription>Weekly provider clicks and new student accounts</CardDescription>
            <CardAction>
              <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" /> Leads
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-ink" /> Sign-ups
                </span>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="pl-1 pr-5 pt-4">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsTrend} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4500" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#FF4500" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f0f0f2" />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} width={34} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e4e4e7" }} />
                  <Area type="monotone" dataKey="leads" name="Leads" stroke="#FF4500" strokeWidth={2} fill="url(#gLeads)" />
                  <Area type="monotone" dataKey="signups" name="Sign-ups" stroke="#18181B" strokeWidth={2} fill="transparent" strokeDasharray="0" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads by category</CardTitle>
            <CardDescription>Drives pay-per-lead billing</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="relative mx-auto h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsByCategory} dataKey="leads" nameKey="category" innerRadius={62} outerRadius={86} paddingAngle={2} cornerRadius={4} stroke="none">
                    {leadsByCategory.map((c) => (
                      <Cell key={c.category} fill={c.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="tabular text-[22px] font-semibold tracking-tight">{formatNumber(totalLeads)}</div>
                <div className="text-[11.5px] text-muted-foreground">total leads</div>
              </div>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {leadsByCategory.map((c) => (
                <li key={c.category} className="flex items-center gap-2 text-[12.5px]">
                  <span className="size-2 rounded-sm" style={{ background: c.fill }} />
                  <span className="flex-1 text-muted-foreground">{c.category}</span>
                  <span className="tabular font-medium">{c.leads}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card data-tour="completion">
          <CardHeader>
            <CardTitle>Completion by stage</CardTitle>
            <CardDescription>Share of milestones done, all live schools</CardDescription>
          </CardHeader>
          <CardContent className="pl-1 pr-5 pt-4">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageCompletion} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f0f0f2" />
                  <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#a1a1aa" }} width={34} unit="%" />
                  <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ fill: "#fafafa" }} />
                  <Bar dataKey="pct" name="Complete" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {stageCompletion.map((s, i) => (
                      <Cell key={s.stage} fill={i < 3 ? "#FF4500" : "#18181B"} fillOpacity={i < 3 ? 1 : 0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card data-tour="universities">
          <CardHeader>
            <CardTitle>Live universities</CardTitle>
            <CardDescription>Activation and average roadmap progress</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="xs" className="text-muted-foreground">
                <Link href="/admin/universities">
                  All <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-1 px-3 pb-3 pt-3">
            {live.map((u) => (
              <Link key={u.id} href="/admin/universities" className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[#fafafa]">
                <ActivityRings
                  size={48}
                  stroke={5}
                  gap={2}
                  rings={[
                    { value: u.signedUp / u.students, color: "#FF4500", label: "Activated", display: `${Math.round((u.signedUp / u.students) * 100)}%` },
                    { value: u.avgProgress / 100, color: "#18181B", label: "Progress", display: `${u.avgProgress}%` },
                  ]}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {u.logo ? <Image src={u.logo} alt="" width={90} height={17} className="h-[14px] w-auto" /> : <span className="truncate text-[13.5px] font-semibold">{u.short}</span>}
                  </div>
                  <div className="mt-1 text-[12px] text-muted-foreground">
                    {u.terms.join(", ")} · {formatNumber(u.students)} students
                  </div>
                </div>
                <div className="text-right text-[12px]">
                  <div className="tabular font-semibold">{Math.round((u.signedUp / u.students) * 100)}%</div>
                  <div className="text-muted-foreground">activated</div>
                </div>
                <div className="w-16 text-right text-[12px]">
                  <div className="tabular font-semibold">{u.avgProgress}%</div>
                  <div className="text-muted-foreground">progress</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Latest feedback</CardTitle>
          <CardDescription>{kpis.helpful}% of milestone ratings are “helpful”</CardDescription>
          <CardAction>
            <Button asChild variant="ghost" size="xs" className="text-muted-foreground">
              <Link href="/admin/feedback">
                View all <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 md:grid-cols-3">
          {feedback.slice(0, 3).map((f) => (
            <div key={f.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <Badge variant={f.helpful ? "success" : "destructive"} className="gap-1">
                  {f.helpful ? <ThumbsUp /> : <ThumbsDown />}
                  {f.helpful ? "Helpful" : "Not helpful"}
                </Badge>
                <span className="text-[11.5px] text-subtle">{f.when}</span>
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed">“{f.comment}”</p>
              <div className="mt-2.5 truncate text-[11.5px] text-muted-foreground">
                {f.university} · {f.milestone ?? "General feedback"}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
