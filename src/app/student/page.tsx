"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityRings } from "@/components/charts/activity-rings";
import { PageContainer } from "@/components/shell/app-shell";
import { useStudent } from "@/components/student/store";
import { DueBadge, StatusIcon } from "@/components/student/milestone-bits";
import { daysBetween, isOverdue, RING_COLORS, school, stages, student, TODAY } from "@/lib/data";

const ORANGE = "#FF4500";
const INK = "#18181B";

export default function StudentDashboard() {
  const { milestones, stats, setStatus } = useStudent();
  const [activeRing, setActiveRing] = React.useState<number | null>(null);

  const daysToStart = daysBetween(TODAY, school.dates.programStart);
  const thisMonth = milestones.filter((m) => m.due.startsWith("2027-05"));
  const monthDone = thisMonth.filter((m) => m.status === "done").length;
  const doneList = milestones.filter((m) => m.status === "done");
  const onTime = doneList.filter((m) => m.completedAt && m.completedAt <= m.due).length;
  const onTimePct = doneList.length ? Math.round((onTime / doneList.length) * 100) : 0;

  const upNext = milestones
    .filter((m) => m.status !== "done" && m.status !== "not_applicable")
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 5);

  const dueSoon = milestones.filter((m) => {
    const d = daysBetween(TODAY, m.due);
    return m.status !== "done" && m.status !== "not_applicable" && d >= 0 && d <= 30;
  }).length;

  const nextDeadline = [
    { label: "Housing deadline", date: school.dates.housingDeadline },
    { label: "Health forms", date: school.dates.healthFormDeadline },
    { label: "Insurance waiver", date: school.dates.insuranceWaiverDeadline },
    { label: "Orientation", date: school.dates.orientation },
  ].find((d) => daysBetween(TODAY, d.date) >= 0)!;

  const TRACK = "#F1F1F3";
  const rings = [
    { label: "Roadmap", sub: `${stats.done} of ${stats.total} milestones`, value: stats.pct / 100, display: `${stats.pct}%`, color: RING_COLORS.roadmap, track: TRACK },
    { label: "This month", sub: "May milestones completed", value: thisMonth.length ? monthDone / thisMonth.length : 0, display: `${monthDone}/${thisMonth.length}`, color: RING_COLORS.month, track: TRACK },
    { label: "On time", sub: "Finished before the due date", value: onTimePct / 100, display: `${onTimePct}%`, color: RING_COLORS.onTime, track: TRACK },
  ];

  const journeyDays = daysBetween(student.joined, school.dates.programStart);
  const elapsed = journeyDays - daysToStart;

  return (
    <PageContainer className="max-w-[1080px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-[22px] font-semibold tracking-[-0.03em] text-ink sm:text-[26px]">
            Good morning, {student.firstName}
            <span role="img" aria-label="waving hand" className="inline-block origin-[70%_70%] animate-[wave_1.8s_ease-in-out_0.4s_1]">
              👋
            </span>
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {stats.overdue > 0 ? (
              <>
                <span className="font-medium text-destructive">{stats.overdue} overdue</span> · {dueSoon} due in the next 30 days
              </>
            ) : (
              "You're on track. Here's what's next."
            )}
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/student/roadmap">
            Open roadmap <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <Card data-tour="journey" className="mt-6 overflow-hidden shadow-sm sm:mt-7">
        <div className="grid md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-[14px] font-semibold tracking-tight">Journey progress</div>
              <div className="text-[12px] text-muted-foreground">Personalized for F-1 · loan · off-campus</div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-7 sm:flex-row sm:gap-10">
              <ActivityRings size={168} stroke={11} gap={5} rings={rings} active={activeRing} onActiveChange={setActiveRing}>
                <div className="tabular text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink">{stats.pct}%</div>
                <div className="mt-1.5 text-[11px] font-medium text-muted-foreground">complete</div>
              </ActivityRings>

              <ul className="w-full min-w-0 flex-1 divide-y" onMouseLeave={() => setActiveRing(null)}>
                {rings.map((r, i) => (
                  <li
                    key={r.label}
                    onMouseEnter={() => setActiveRing(i)}
                    className={cn(
                      "flex cursor-default items-center gap-3.5 py-3.5 transition-opacity duration-200 first:pt-0 last:pb-0",
                      activeRing !== null && activeRing !== i && "opacity-40",
                    )}
                  >
                    <ActivityRings size={28} stroke={3.5} rings={[{ value: r.value, color: r.color, track: TRACK }]} interactive={false} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-ink">{r.label}</div>
                      <div className="truncate text-[12px] text-muted-foreground">{r.sub}</div>
                    </div>
                    <div
                      className="tabular text-[19px] font-semibold tracking-[-0.02em] text-ink transition-colors duration-200"
                      style={activeRing === i ? { color: r.color } : undefined}
                    >
                      {r.display}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex flex-col border-t p-5 sm:p-7 md:border-l md:border-t-0">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/[0.07] blur-2xl" />
            <div className="relative flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <CalendarDays className="size-3.5" /> Program starts {formatDate(school.dates.programStart, { month: "short", day: "numeric" })}
            </div>
            <div className="relative mt-2 flex items-baseline gap-1.5">
              <span className="tabular text-[32px] font-semibold leading-none tracking-[-0.035em] text-ink">{daysToStart}</span>
              <span className="text-[13px] text-muted-foreground">days to go</span>
            </div>
            <div className="relative mt-4">
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-ink" style={{ width: `${(elapsed / journeyDays) * 100}%` }} />
              </div>
              <div className="tabular mt-1.5 flex justify-between text-[11px] text-subtle">
                <span>Admitted</span>
                <span>
                  Day {elapsed} of {journeyDays}
                </span>
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] md:mt-auto">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="flex-1 truncate font-medium">{nextDeadline.label}</span>
              <span className="tabular text-muted-foreground">{formatDate(nextDeadline.date)}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] [&>*]:min-w-0">
        <Card data-tour="up-next">
          <CardHeader>
            <CardTitle>Up next</CardTitle>
            <CardDescription>Tap the circle to mark a milestone done</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="xs" className="text-muted-foreground">
                <Link href="/student/roadmap">
                  View all <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pb-2 pt-3">
            <ul>
              {upNext.map((m) => {
                const stage = stages[m.stage - 1];
                return (
                  <li key={m.id} className="flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-[#fafafa]">
                    <button
                      onClick={() => setStatus(m.id, "done")}
                      className="group/check flex size-10 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                      aria-label={`Mark ${m.title} done`}
                    >
                      <span className="transition-transform group-hover/check:scale-110">
                        <StatusIcon status={m.status} overdue={isOverdue(m)} />
                      </span>
                    </button>
                    <Link href={`/student/roadmap?m=${m.id}`} className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-medium">{m.title}</div>
                      <div className="text-[12px] text-muted-foreground">{stage.name}</div>
                    </Link>
                    <DueBadge milestone={m} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card data-tour="stages">
          <CardHeader>
            <CardTitle>Stages</CardTitle>
            <CardDescription>
              {stats.done} of {stats.total} milestones done
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-1 px-3 pb-3 pt-3">
            {stats.byStage.map((s) => {
              const stage = stages[s.stage - 1];
              const v = s.total ? s.done / s.total : 0;
              return (
                <Link
                  key={s.stage}
                  href={`/student/roadmap?stage=${s.stage}`}
                  className="flex flex-col items-center rounded-xl py-2.5 transition-colors hover:bg-[#fafafa]"
                >
                  <ActivityRings size={48} stroke={5} rings={[{ value: v, color: v === 1 ? INK : ORANGE }]}>
                    <stage.icon className={cn("size-4", v > 0 ? "text-ink" : "text-subtle")} strokeWidth={1.75} />
                  </ActivityRings>
                  <div className="mt-1.5 text-[11.5px] font-medium">{stage.short}</div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
