"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  EyeOff,
  Globe,
  Info,
  Link2,
  Mail,
  MessageSquare,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Lightbulb,
  Undo2,
  Star,
} from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ActivityRings } from "@/components/charts/activity-rings";
import { PageContainer } from "@/components/shell/app-shell";
import { useStudent } from "@/components/student/store";
import { DueBadge, StatusIcon, statusLabel } from "@/components/student/milestone-bits";
import { hiddenMilestones, isOverdue, milestones as allMilestones, providerById, stages, student, TODAY, type Milestone } from "@/lib/data";

function FeedbackPrompt({ milestone }: { milestone: Milestone }) {
  const [vote, setVote] = React.useState<"yes" | "no" | null>(null);
  const [sent, setSent] = React.useState(false);
  if (sent)
    return (
      <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-[13px] text-muted-foreground">
        <Check className="size-4 text-success" /> Thanks — your feedback helps the next class.
      </div>
    );
  return (
    <div className="rounded-xl border bg-white p-4 animate-in fade-in-0 slide-in-from-bottom-1">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium">Was this milestone helpful?</span>
        <div className="flex gap-1.5">
          <Button size="xs" variant={vote === "yes" ? "ink" : "outline"} onClick={() => setVote("yes")}>
            <ThumbsUp className="size-3.5" /> Yes
          </Button>
          <Button size="xs" variant={vote === "no" ? "ink" : "outline"} onClick={() => setVote("no")}>
            <ThumbsDown className="size-3.5" /> No
          </Button>
        </div>
      </div>
      {vote && (
        <div className="mt-3 space-y-2 animate-in fade-in-0">
          <Textarea placeholder={vote === "yes" ? "What helped most? (optional)" : "What was missing or confusing? (optional)"} className="min-h-16 text-[13px]" />
          <div className="flex justify-end">
            <Button
              size="xs"
              onClick={() => {
                setSent(true);
                toast.success("Feedback sent", { description: milestone.title });
              }}
            >
              Send feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneDetail({ milestone, onPrev, onNext }: { milestone: Milestone; onPrev?: () => void; onNext?: () => void }) {
  const { setStatus, toggleTask } = useStudent();
  const stage = stages[milestone.stage - 1];
  const doneTasks = milestone.tasks.filter((t) => t.done).length;
  const overdue = isOverdue(milestone);

  const openProvider = (id: string) => {
    const p = providerById(id);
    window.open(`/go/${p.id}?ref=afteradmit&m=${milestone.id}&s=ucla`, "_blank", "noopener");
    toast(`Opened ${p.name} in a new tab`, {
      description: `Lead recorded · ?ref=afteradmit&m=${milestone.id}&s=ucla`,
      icon: <ArrowUpRight className="size-4 text-primary" />,
    });
  };

  return (
    <div key={milestone.id} className="animate-in fade-in-0 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
          <stage.icon className="size-3.5" />
          Stage {stage.id} · {stage.name}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-xs" onClick={onPrev} disabled={!onPrev} aria-label="Previous milestone">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={onNext} disabled={!onNext} aria-label="Next milestone">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <h2 className="mt-3 text-[21px] font-semibold leading-snug tracking-[-0.025em] text-ink">{milestone.title}</h2>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge variant={milestone.status === "done" ? "success" : milestone.status === "in_progress" ? "default" : "secondary"}>{statusLabel[milestone.status]}</Badge>
        {milestone.international && (
          <Badge variant="outline" className="gap-1">
            <Globe /> International only
          </Badge>
        )}
        {overdue && <Badge variant="destructive">Overdue</Badge>}
      </div>
      <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#3f3f46]">{milestone.description}</p>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border">
        <div className="bg-white p-3">
          <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <Calendar className="size-3.5" /> Due date
          </div>
          <div className={cn("mt-1 text-[13.5px] font-semibold", overdue && "text-destructive")}>{formatDate(milestone.due, { month: "short", day: "numeric", year: "numeric" })}</div>
          <div className="text-[11.5px] text-subtle">{milestone.dueRule}</div>
        </div>
        <div className="bg-white p-3">
          <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <Check className="size-3.5" /> Steps
          </div>
          <div className="tabular mt-1 text-[13.5px] font-semibold">
            {doneTasks} of {milestone.tasks.length}
          </div>
          <Progress value={(doneTasks / milestone.tasks.length) * 100} className="mt-1.5 h-1" />
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-primary-soft/70 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
          <Lightbulb className="size-3.5" /> Why it matters
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#3f3f46]">{milestone.why}</p>
      </div>

      {(milestone.requires || milestone.rule) && (
        <div className="mt-3 space-y-1.5">
          {milestone.requires && (
            <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <Link2 className="size-3.5" /> Requires: <span className="font-medium text-foreground">{milestone.requires}</span>
            </div>
          )}
          {milestone.rule && (
            <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <Info className="size-3.5" /> Shown because: <span className="font-medium text-foreground">{milestone.rule}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">Steps</div>
        <ul className="space-y-1">
          {milestone.tasks.map((t) => (
            <li key={t.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#fafafa]">
                <Checkbox checked={t.done} onCheckedChange={() => toggleTask(milestone.id, t.id)} className="mt-px" />
                <span className={cn("text-[13.5px] leading-snug", t.done && "text-subtle line-through decoration-[#d4d4d8]")}>{t.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {milestone.providers && milestone.providers.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">Vetted providers</span>
            <span className="text-[11px] text-subtle">You&apos;ll leave AfterAdmit</span>
          </div>
          <div className="space-y-2">
            {milestone.providers.map((id) => {
              const p = providerById(id);
              return (
                <button
                  key={id}
                  onClick={() => openProvider(id)}
                  className="group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all hover:border-[#d4d4d8] hover:shadow-sm"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white" style={{ background: p.color }}>
                    {p.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium">
                      {p.name}
                      <span className="flex items-center gap-0.5 text-[11.5px] font-normal text-muted-foreground">
                        <Star className="size-3 fill-current text-[#f5a524]" /> {p.rating}
                      </span>
                    </span>
                    <span className="block truncate text-[12px] text-muted-foreground">{p.perk ?? p.tagline}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-subtle transition-colors group-hover:text-primary" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">School contact</div>
        <div className="mt-2 text-[13.5px] font-semibold">{milestone.contact.name}</div>
        <div className="text-[12.5px] text-muted-foreground">{milestone.contact.role}</div>
        {milestone.contact.hours && <div className="mt-0.5 text-[12px] text-subtle">{milestone.contact.hours}</div>}
        <div className="mt-3 flex gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => toast("Opening your email app", { description: milestone.contact.email })}
          >
            <Mail className="size-3.5" /> Email office
          </Button>
          <Button asChild size="xs" variant="outline">
            <Link href={`/student/community/submit?m=${milestone.id}`}>
              <MessageSquare className="size-3.5" /> Ask the community
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {milestone.status !== "done" ? (
          <Button
            className="flex-1"
            size="lg"
            onClick={() => {
              setStatus(milestone.id, "done");
              toast.success("Milestone complete", { description: milestone.title });
            }}
          >
            <Check className="size-4" /> Mark milestone done
          </Button>
        ) : (
          <Button className="flex-1" size="lg" variant="outline" onClick={() => setStatus(milestone.id, "in_progress")}>
            <Undo2 className="size-4" /> Reopen milestone
          </Button>
        )}
        {milestone.status !== "not_applicable" ? (
          <Button size="lg" variant="ghost" className="text-muted-foreground" onClick={() => setStatus(milestone.id, "not_applicable")}>
            <CircleSlash className="size-4" /> Not applicable to me
          </Button>
        ) : (
          <Button size="lg" variant="ghost" className="text-muted-foreground" onClick={() => setStatus(milestone.id, "not_started")}>
            <Undo2 className="size-4" /> Make applicable
          </Button>
        )}
      </div>

      {milestone.status === "done" && (
        <div className="mt-4">
          <FeedbackPrompt milestone={milestone} />
        </div>
      )}
    </div>
  );
}

function RoadmapInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { milestones, stats } = useStudent();
  const [view, setView] = React.useState<"stages" | "timeline">("stages");

  const paramM = params.get("m");
  const paramStage = Number(params.get("stage"));
  const initial = milestones.find((m) => m.id === paramM) ?? milestones.find((m) => m.id === "m4")!;
  const [selectedId, setSelectedId] = React.useState(initial.id);
  const [stage, setStage] = React.useState(paramStage >= 1 && paramStage <= 9 ? paramStage : initial.stage);
  const [syncedParam, setSyncedParam] = React.useState(paramM);

  // Follow ?m= changes from search or the dashboard while already on this page.
  if (paramM !== syncedParam) {
    setSyncedParam(paramM);
    const m = milestones.find((x) => x.id === paramM);
    if (m) {
      setSelectedId(m.id);
      setStage(m.stage);
    }
  }

  const selected = milestones.find((m) => m.id === selectedId)!;
  const stageMilestones = milestones.filter((m) => m.stage === stage);
  const timeline = [...milestones].sort((a, b) => a.due.localeCompare(b.due));
  const ordered = view === "stages" ? stageMilestones : timeline;
  const idx = ordered.findIndex((m) => m.id === selectedId);

  const [mobileDetail, setMobileDetail] = React.useState(false);

  const select = (m: Milestone, openSheet = true) => {
    setSelectedId(m.id);
    router.replace(`/student/roadmap?m=${m.id}`, { scroll: false });
    if (openSheet && window.matchMedia("(max-width: 1023px)").matches) setMobileDetail(true);
  };

  const firstUpcoming = timeline.find((m) => m.due > TODAY)?.id;

  const months = timeline.reduce<Record<string, Milestone[]>>((acc, m) => {
    const k = formatDate(m.due, { month: "long", year: "numeric" });
    (acc[k] ??= []).push(m);
    return acc;
  }, {});

  const st = stats.byStage[stage - 1];
  const currentStage = stages[stage - 1];

  return (
    <PageContainer className="max-w-[1320px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[12px] font-medium text-muted-foreground">UCLA Anderson · Fall 2027</div>
          <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-ink sm:text-[26px]">Your roadmap</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-[220px]">
            <div className="flex items-baseline justify-between text-[12.5px]">
              <span className="text-muted-foreground">
                <span className="tabular font-semibold text-foreground">{stats.done}</span> of {stats.total} milestones
              </span>
              <span className="tabular font-semibold text-primary">{stats.pct}%</span>
            </div>
            <Progress value={stats.pct} className="mt-1.5" />
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "stages" | "timeline")}>
            <TabsList>
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-[12.5px]">
        <span className="font-medium text-muted-foreground">Personalized from your answers</span>
        {[student.profile.visaType + " visa", "Funding includes a loan", "Off-campus housing", "No dependents"].map((c) => (
          <span key={c} className="rounded-full border px-2.5 py-0.5 font-medium">
            {c}
          </span>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <EyeOff className="size-3.5" /> {hiddenMilestones.length} hidden
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-0">
            <div className="border-b px-4 py-2.5 text-[12.5px] font-semibold">Hidden from your roadmap</div>
            <ul className="divide-y">
              {hiddenMilestones.map((h) => (
                <li key={h.title} className="px-4 py-2.5">
                  <div className="text-[13px] font-medium">{h.title}</div>
                  <div className="text-[12px] text-muted-foreground">{h.reason}</div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <Button asChild variant="link" size="xs" className="ml-1 text-[12.5px]">
          <Link href="/student/profile?tab=journey">
            <Pencil className="size-3" /> Edit answers
          </Link>
        </Button>
      </div>

      {view === "stages" && (
        <StageTrack
          current={stage}
          byStage={stats.byStage}
          onSelect={(id) => {
            setStage(id);
            const first = milestones.find((m) => m.stage === id && m.status !== "done") ?? milestones.find((m) => m.stage === id)!;
            select(first, false);
          }}
        />
      )}

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="rounded-2xl border bg-white">
          {view === "stages" ? (
            <>
              <div className="flex items-center gap-4 border-b px-5 py-4">
                <ActivityRings size={44} stroke={5} rings={[{ value: st.total ? st.done / st.total : 0, color: "#FF4500" }]}>
                  <currentStage.icon className="size-4 text-ink" strokeWidth={1.8} />
                </ActivityRings>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[16px] font-semibold tracking-tight">{currentStage.name}</span>
                    <span className="tabular text-[12px] text-muted-foreground">
                      Stage {stage} of 9 · {st.done}/{st.total} done
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{currentStage.blurb}</p>
                </div>
              </div>
              <ul className="p-2">
                {stageMilestones.map((m) => (
                  <MilestoneRow key={m.id} m={m} active={m.id === selectedId} onClick={() => select(m)} />
                ))}
              </ul>
            </>
          ) : (
            <div className="px-3 py-5 sm:px-5">
              {Object.entries(months).map(([month, items]) => {
                const [name, year] = month.split(" ");
                const open = items.filter((m) => m.status !== "done" && m.status !== "not_applicable").length;
                return (
                  <section key={month} className="pb-6 last:pb-1">
                    <div className="mb-2 flex items-center gap-3 px-1">
                      <span className="text-[13px] font-semibold tracking-tight text-ink">{name}</span>
                      <span className="tabular text-[12px] text-subtle">{year}</span>
                      <span className="h-px flex-1 bg-border" />
                      <span className="tabular text-[11.5px] text-muted-foreground">{open ? `${open} open` : "All done"}</span>
                    </div>
                    <ol className="relative">
                      <span className="absolute bottom-3 left-[20px] top-3 w-px bg-border" aria-hidden />
                      {items.map((m) => (
                        <React.Fragment key={m.id}>
                          {m.id === firstUpcoming && (
                            <li className="relative flex items-center gap-2 py-2 pl-[13px]" aria-label="Today">
                              <span className="relative flex size-[15px] items-center justify-center">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />
                                <span className="relative size-[9px] rounded-full bg-primary ring-[3px] ring-white" />
                              </span>
                              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">Today · {formatDate(TODAY)}</span>
                              <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                            </li>
                          )}
                          <TimelineRow m={m} active={m.id === selectedId} onClick={() => select(m)} />
                        </React.Fragment>
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <aside className="hidden rounded-2xl border bg-white p-5 lg:sticky lg:top-[72px] lg:block lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto">
          <MilestoneDetail
            milestone={selected}
            onPrev={idx > 0 ? () => select(ordered[idx - 1]) : undefined}
            onNext={idx >= 0 && idx < ordered.length - 1 ? () => select(ordered[idx + 1]) : undefined}
          />
        </aside>
      </div>

      <Sheet open={mobileDetail} onOpenChange={setMobileDetail}>
        <SheetContent side="bottom" className="lg:hidden">
          <SheetTitle className="sr-only">{selected.title}</SheetTitle>
          <div className="overflow-y-auto px-5 pb-6 pt-3">
            <MilestoneDetail
              milestone={selected}
              onPrev={idx > 0 ? () => select(ordered[idx - 1]) : undefined}
              onNext={idx >= 0 && idx < ordered.length - 1 ? () => select(ordered[idx + 1]) : undefined}
            />
          </div>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}

function MilestoneRow({ m, active, onClick, showStage }: { m: Milestone; active: boolean; onClick: () => void; showStage?: boolean }) {
  const done = m.tasks.filter((t) => t.done).length;
  const stage = stages[m.stage - 1];
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors",
          active ? "bg-primary-soft/70" : "hover:bg-[#fafafa]",
        )}
      >
        <StatusIcon status={m.status} overdue={isOverdue(m)} />
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-[13.5px] font-medium", m.status === "not_applicable" && "text-subtle line-through")}>{m.title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            {showStage && (
              <>
                <stage.icon className="size-3" /> {stage.name}
                <span className="text-subtle">·</span>
              </>
            )}
            <span className="tabular">
              {statusLabel[m.status]} · {done}/{m.tasks.length} steps
            </span>
            {m.international && (
              <>
                <span className="text-subtle">·</span>
                <Globe className="size-3" />
              </>
            )}
          </span>
        </span>
        <DueBadge milestone={m} />
      </button>
    </li>
  );
}

const shortMonth = (iso: string) => formatDate(iso, { month: "short" });

const stageWindows = stages.map((s) => {
  const dues = allMilestones.filter((m) => m.stage === s.id).map((m) => m.due).sort();
  const a = shortMonth(dues[0]);
  const b = shortMonth(dues[dues.length - 1]);
  return a === b ? a : `${a} – ${b}`;
});

function StageTrack({
  current,
  byStage,
  onSelect,
}: {
  current: number;
  byStage: { stage: number; total: number; done: number }[];
  onSelect: (id: number) => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border bg-white">
      <div className="overflow-x-auto px-2 pb-4 pt-5 scrollbar-none sm:px-3">
        <ol className="flex min-w-[760px]">
          {stages.map((s, i) => {
            const b = byStage[i];
            const pct = b.total ? b.done / b.total : 0;
            const complete = b.total > 0 && b.done === b.total;
            const active = s.id === current;
            return (
              <li key={s.id} className="relative flex flex-1 flex-col items-center">
                {i < stages.length - 1 && (
                  <span className="absolute left-[calc(50%+26px)] right-[calc(-50%+26px)] top-[21px] h-[2px] overflow-hidden rounded-full bg-muted" aria-hidden>
                    <span className="block h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${pct * 100}%` }} />
                  </span>
                )}
                <button
                  onClick={() => onSelect(s.id)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${s.name}: ${b.done} of ${b.total} done`}
                  className="group flex flex-col items-center rounded-xl px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <span
                    className={cn(
                      "relative flex size-11 items-center justify-center rounded-full transition-all duration-200",
                      active ? "bg-ink text-white shadow-[0_6px_16px_-6px_rgba(18,18,20,0.5)]" : "bg-white group-hover:-translate-y-0.5",
                    )}
                  >
                    {active ? (
                      <>
                        <s.icon className="size-[18px]" strokeWidth={1.8} />
                        <span className="absolute -inset-1 rounded-full border-2 border-primary/70" />
                      </>
                    ) : complete ? (
                      <span className="flex size-11 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="size-[18px]" strokeWidth={2.75} />
                      </span>
                    ) : (
                      <ActivityRings size={44} stroke={3.5} rings={[{ value: pct, color: "#FF4500" }]} interactive={false}>
                        <s.icon className={cn("size-[17px]", pct > 0 ? "text-ink" : "text-subtle")} strokeWidth={1.8} />
                      </ActivityRings>
                    )}
                  </span>
                  <span className={cn("mt-2.5 whitespace-nowrap text-[12.5px] transition-colors", active ? "font-semibold text-ink" : "font-medium text-muted-foreground group-hover:text-foreground")}>
                    {s.name}
                  </span>
                  <span className="tabular mt-0.5 whitespace-nowrap text-[11px] text-subtle">
                    {b.done}/{b.total} · {stageWindows[i]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function TimelineRow({ m, active, onClick }: { m: Milestone; active: boolean; onClick: () => void }) {
  const stage = stages[m.stage - 1];
  const done = m.tasks.filter((t) => t.done).length;
  const d = new Date(m.due + "T12:00:00");
  const finished = m.status === "done" || m.status === "not_applicable";
  return (
    <li className="relative">
      <button
        onClick={onClick}
        className={cn("group flex w-full items-center gap-3 rounded-xl py-2.5 pl-[11px] pr-2.5 text-left transition-colors", active ? "bg-primary-soft/60" : "hover:bg-[#fafafa]")}
      >
        <span className="relative z-10 rounded-full bg-white ring-4 ring-white">
          <StatusIcon status={m.status} overdue={isOverdue(m)} />
        </span>
        <span className="flex w-9 shrink-0 flex-col items-center leading-none">
          <span className={cn("tabular text-[15px] font-semibold", finished ? "text-subtle" : "text-ink")}>{d.getDate()}</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-subtle">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-[13.5px] font-medium", finished && "text-muted-foreground")}>{m.title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <stage.icon className="size-3" /> {stage.name}
            <span className="text-subtle">·</span>
            <span className="tabular">
              {done}/{m.tasks.length} steps
            </span>
          </span>
        </span>
        <DueBadge milestone={m} />
      </button>
    </li>
  );
}

export default function RoadmapPage() {
  return (
    <React.Suspense>
      <RoadmapInner />
    </React.Suspense>
  );
}
