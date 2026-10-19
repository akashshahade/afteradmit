"use client";

import * as React from "react";
import { Check, House, MessageCircle, Route, Store, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { stages } from "@/lib/data";
import { Logo } from "@/components/brand/logo";
import { ActivityRings } from "@/components/charts/activity-rings";

const nav = [
  { icon: House, label: "Home", active: true },
  { icon: Route, label: "Roadmap" },
  { icon: Users, label: "Community" },
  { icon: MessageCircle, label: "Messages", badge: "2" },
  { icon: Store, label: "Marketplace" },
];

const rings = [
  { label: "Roadmap", value: 0.23, display: "23%", color: "#FF4500" },
  { label: "This month", value: 0.67, display: "4/6", color: "#8B5CF6" },
  { label: "On time", value: 0.9, display: "90%", color: "#14B8A6" },
];

// The first item ticks itself off once in view; the last one slides in to replace it.
const upNext: { t: string; s: string; due: string; soon?: boolean }[] = [
  { t: "Pay SEVIS I-901 fee", s: "Visa", due: "Due in 7d", soon: true },
  { t: "Book visa interview", s: "Visa", due: "May 30" },
  { t: "Sign housing lease", s: "Housing", due: "Jun 1" },
  { t: "Upload immunization records", s: "Healthcare", due: "Jun 8" },
];

const CURRENT = 2;

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export function ProductShot() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const [ticked, setTicked] = React.useState(false);
  const [swapped, setSwapped] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setInView(true);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        timers.push(window.setTimeout(() => setTicked(true), 2200));
        timers.push(window.setTimeout(() => setSwapped(true), 3200));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const done = ticked ? 9 : 8;

  return (
    <div ref={ref} className="mx-auto max-w-[1080px]">
      <div className="overflow-hidden rounded-xl border bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_32px_80px_-40px_rgba(18,18,20,0.3)]">
        <div className="grid md:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden border-r p-3 md:block">
            <div className="px-2 py-1.5">
              <Logo size="sm" />
            </div>
            <div className="mt-3 flex items-center gap-2.5 rounded-lg border px-2.5 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#107BB6] text-[8.5px] font-bold tracking-tight text-white">UCLA</span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[12px] font-medium text-ink">UCLA Anderson</span>
                <span className="block text-[11px] text-muted-foreground">MBA · Fall &apos;27</span>
              </span>
            </div>
            <ul className="mt-4 space-y-0.5">
              {nav.map(({ icon: Icon, label, active, badge }) => (
                <li key={label} className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]", active ? "bg-muted font-medium text-ink" : "text-muted-foreground")}>
                  <Icon className="size-3.5" />
                  {label}
                  {badge && <span className="ml-auto flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">{badge}</span>}
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0 bg-canvas p-4 sm:p-5 md:p-7">
            <div className="text-[16px] font-semibold tracking-[-0.025em] text-ink sm:text-[19px]">
              Hey there, good morning{" "}
              <span role="img" aria-label="waving hand" className={cn("inline-block origin-[70%_70%]", inView && "animate-[wave_1.8s_ease-in-out_0.3s_1]")}>
                👋
              </span>
            </div>
            <div className="mt-0.5 text-[13px] text-muted-foreground">125 days until orientation</div>

            <div className="mt-5 rounded-xl border bg-white p-3.5 sm:p-4 md:p-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-ink">Your path</span>
                <span className="tabular text-muted-foreground">
                  <span className="font-medium text-ink transition-colors">{done}</span> of 35 done
                </span>
              </div>
              <div className="mt-4 flex gap-1 sm:hidden">
                {stages.map((s, i) => (
                  <span key={s.id} className={cn("h-1.5 flex-1 rounded-full", i < CURRENT ? "bg-primary" : i === CURRENT ? "bg-ink" : "bg-[#EBEBED]")} />
                ))}
              </div>
              <div className="mt-5 hidden grid-cols-9 sm:grid">
                {stages.map((s, i) => {
                  const Icon = s.icon;
                  const isDone = i < CURRENT;
                  const isNow = i === CURRENT;
                  return (
                    <div key={s.id} className="relative flex min-w-0 flex-col items-center">
                      {i < stages.length - 1 && <span aria-hidden className={cn("absolute left-1/2 top-[11px] h-[2px] w-full sm:top-[15px]", isDone ? "bg-primary" : "bg-[#EBEBED]")} />}
                      <span className="relative z-10 flex size-6 items-center justify-center sm:size-8">
                        {isNow && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-primary/25 [animation-duration:2.2s]" />}
                        <span
                          className={cn(
                            "relative flex size-6 items-center justify-center rounded-full sm:size-8",
                            isDone ? "bg-primary text-white" : isNow ? "bg-ink text-white ring-[3px] ring-primary/20 sm:ring-4" : "border bg-white text-subtle",
                          )}
                        >
                          {isDone ? <Check className="size-3 sm:size-4" strokeWidth={3} /> : <Icon className="size-3 sm:size-3.5" />}
                        </span>
                      </span>
                      <span className={cn("mt-2 hidden w-full truncate px-0.5 text-center text-[12px] sm:block", isNow ? "font-medium text-ink" : isDone ? "text-muted-foreground" : "text-subtle")}>
                        {s.short}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-[12px] text-muted-foreground sm:hidden">
                Stage 3 of 9 · <span className="font-medium text-ink">{stages[CURRENT].name}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="rounded-xl border bg-white p-3.5 sm:p-4 md:p-5">
                <div className="text-[13px] font-semibold text-ink">Up next</div>
                <ul className="mt-2">
                  {upNext.map((u, i) => {
                    const first = i === 0;
                    const open = first ? !swapped : i === upNext.length - 1 ? swapped : true;
                    const checked = first && ticked;
                    return (
                      <li key={u.t}>
                        <Collapse open={open}>
                          <div className={cn("flex items-center gap-3 py-2.5", i > 0 && "border-t")}>
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300",
                                checked ? "border-primary bg-primary text-white" : "border-[#d4d4d8]",
                              )}
                            >
                              {checked && <Check className="size-2.5 animate-in zoom-in-50 duration-200" strokeWidth={3.5} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={cn("block text-[13px] font-medium leading-snug transition-colors duration-300 sm:truncate", checked ? "text-subtle line-through" : "text-ink")}>{u.t}</span>
                              <span className="block text-[12px] text-muted-foreground">
                                {u.s}
                                <span className={cn("sm:hidden", u.soon && "font-medium text-warning")}> · {u.due}</span>
                              </span>
                            </span>
                            <span className={cn("hidden shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:inline", u.soon ? "bg-warning-soft text-warning" : "border text-muted-foreground")}>{u.due}</span>
                          </div>
                        </Collapse>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-xl border bg-white p-3.5 sm:p-4 md:p-5">
                <div className="text-[13px] font-semibold text-ink">Progress</div>
                <div className="mt-4 flex flex-col items-center gap-4 sm:items-start sm:gap-5 lg:flex-row lg:items-center">
                  <ActivityRings size={108} stroke={10} gap={3} interactive={false} rings={rings.map((r) => ({ value: inView ? r.value : 0, color: r.color, track: "#F1F1F3" }))} />
                  <ul className="w-full min-w-0 space-y-2.5 text-[12.5px] lg:w-auto lg:flex-1">
                    {rings.map((r) => (
                      <li key={r.label} className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
                        <span className="flex-1 truncate text-muted-foreground">{r.label}</span>
                        <span className="tabular font-semibold text-ink">{r.display}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
