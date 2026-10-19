"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Role = "student" | "admin" | "partner";
type Step = { selector: string; title: string; body: string };

const homes: Record<Role, string> = { student: "/student", admin: "/admin", partner: "/partner" };

const tours: Record<Role, Step[]> = {
  student: [
    { selector: '[data-tour="journey"]', title: "Your whole journey at a glance", body: "Three rings track roadmap progress, this month's milestones and on-time rate. The countdown shows days until orientation." },
    { selector: '[data-tour="up-next"]', title: "Always know what's next", body: "The next few milestones, dated from the school's real deadlines. Tap a circle to mark one done." },
    { selector: '[data-tour="stages"]', title: "Nine stages, admit to arrival", body: "From Get Started to Arrival — steps that don't apply to this student are hidden automatically." },
    { selector: '[data-tour="search"]', title: "Find anything", body: "Search milestones, community posts and people. Press ⌘K from anywhere." },
  ],
  admin: [
    { selector: '[data-tour="kpis"]', title: "The platform in four numbers", body: "Invited students, activation, partner leads and milestones completed across every live school." },
    { selector: '[data-tour="completion"]', title: "See where classes get stuck", body: "Completion by stage, in aggregate. Schools never see an individual student's activity." },
    { selector: '[data-tour="universities"]', title: "Every school, side by side", body: "Activation and average roadmap progress for each live university." },
    { selector: 'a[href="/admin/invites"]', title: "Invite a class in minutes", body: "Upload an admitted-student spreadsheet, review it, and send personal invites in one go." },
  ],
  partner: [
    { selector: '[data-tour="kpis"]', title: "Performance at a glance", body: "Leads, click-through and spend this month — billed per lead, never per impression." },
    { selector: '[data-tour="daily"]', title: "Leads, day by day", body: "Every click from a student to your offer, as it happens." },
    { selector: '[data-tour="sources"]', title: "Where students find you", body: "Which roadmap milestones send you students — so you show up at exactly the right moment." },
    { selector: '[data-tour="listings"]', title: "Your listings", body: "Performance for each offer. Student contact details are never shared." },
  ],
};

const START_EVENT = "aa:start-tour";
const PENDING_KEY = "aa-tour-pending";

function findVisible(selector: string) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
}

export function requestTour(role: Role, pathname: string, push: (href: string) => void) {
  if (pathname === homes[role]) {
    window.dispatchEvent(new Event(START_EVENT));
  } else {
    sessionStorage.setItem(PENDING_KEY, role);
    push(homes[role]);
  }
}

export function DemoTour({ role }: { role: Role }) {
  const pathname = usePathname();
  const steps = tours[role];
  const [active, setActive] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const [viewport, setViewport] = React.useState({ w: 1280, h: 800 });

  React.useEffect(() => {
    if (pathname !== homes[role]) return;
    const seenKey = `aa-tour-seen-${role}`;
    const pending = sessionStorage.getItem(PENDING_KEY) === role;
    if (!pending && localStorage.getItem(seenKey)) return;
    sessionStorage.removeItem(PENDING_KEY);
    const t = window.setTimeout(() => {
      localStorage.setItem(seenKey, "1");
      setIndex(0);
      setActive(true);
    }, 900);
    return () => window.clearTimeout(t);
  }, [pathname, role]);

  React.useEffect(() => {
    const start = () => {
      setIndex(0);
      setActive(true);
    };
    window.addEventListener(START_EVENT, start);
    return () => window.removeEventListener(START_EVENT, start);
  }, []);

  React.useEffect(() => {
    if (!active) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = findVisible(steps[index].selector);
        setRect(el ? el.getBoundingClientRect() : null);
        setViewport({ w: window.innerWidth, h: window.innerHeight });
      });
    };
    findVisible(steps[index].selector)?.scrollIntoView({ block: "center", behavior: "smooth" });
    measure();
    const settle = window.setTimeout(measure, 500);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [active, index, steps]);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, steps.length]);

  if (!active) return null;

  const step = steps[index];
  const last = index === steps.length - 1;
  const pad = 8;
  const cardW = Math.min(340, viewport.w - 24);
  const mobile = viewport.w < 640;
  const cardH = 210;
  let cardStyle: React.CSSProperties;
  if (!rect || mobile) {
    cardStyle = mobile ? { left: 12, right: 12, bottom: "calc(80px + env(safe-area-inset-bottom))" } : { left: (viewport.w - cardW) / 2, top: viewport.h / 2 - cardH / 2, width: cardW };
  } else {
    const below = rect.bottom + pad + 12 + cardH < viewport.h;
    const top = below ? rect.bottom + pad + 12 : Math.max(12, rect.top - pad - 12 - cardH);
    const left = Math.min(Math.max(12, rect.left), viewport.w - cardW - 12);
    cardStyle = { top, left, width: cardW };
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {rect ? (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-2xl ring-2 ring-white/70 transition-all duration-300 ease-out"
          style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2, boxShadow: "0 0 0 9999px rgba(12,12,16,0.55)" }}
        />
      ) : (
        <div aria-hidden className="fixed inset-0 bg-[rgba(12,12,16,0.55)]" />
      )}

      <div key={index} className="fixed rounded-2xl border bg-white p-5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200" style={cardStyle}>
        <div className="flex items-center justify-between">
          <span className="tabular text-[12px] font-medium text-primary">
            {index + 1} of {steps.length}
          </span>
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <span key={s.selector} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-ink" : "w-1.5 bg-border")} />
            ))}
          </div>
        </div>
        <h2 id="tour-title" className="mt-3 text-[16px] font-semibold tracking-tight text-ink">
          {step.title}
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
        <div className="mt-5 flex items-center justify-between gap-2">
          <button type="button" onClick={() => setActive(false)} className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
            Skip tour
          </button>
          <div className="flex gap-2">
            {index > 0 && (
              <Button size="sm" variant="outline" onClick={() => setIndex(index - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" variant="ink" onClick={() => (last ? setActive(false) : setIndex(index + 1))}>
              {last ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
