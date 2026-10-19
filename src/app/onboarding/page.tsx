"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { school, stages } from "@/lib/data";

type Q = { id: string; title: string; help: string; options: { label: string; sub?: string }[]; multi?: boolean };

const questions: Q[] = [
  { id: "program", title: "Which program are you joining?", help: "We'll pull your program's dates and orientation schedule.", options: [{ label: "Full-Time MBA" }, { label: "Fully Employed MBA" }, { label: "Executive MBA" }, { label: "Master of Financial Engineering" }] },
  { id: "country", title: "Where are you moving from?", help: "Used for timezone, visa consulate tips, and classmates near you.", options: [{ label: "India" }, { label: "China" }, { label: "United States" }, { label: "Other country" }] },
  { id: "visa", title: "What's your visa situation?", help: "Domestic students won't see visa or international-only steps.", options: [{ label: "F-1", sub: "Most international degree students" }, { label: "J-1", sub: "Exchange or sponsored programs" }, { label: "Domestic", sub: "US citizen or permanent resident" }] },
  { id: "funding", title: "How are you funding your degree?", help: "Pick all that apply.", multi: true, options: [{ label: "Scholarship" }, { label: "Loan" }, { label: "Sponsor / employer" }, { label: "Self-funded" }] },
  { id: "dependents", title: "Are you bringing dependents?", help: "A spouse or children on F-2/J-2 visas.", options: [{ label: "No, just me" }, { label: "Yes" }] },
  { id: "housing", title: "Where do you plan to live?", help: "Shows the right housing milestones and partners.", options: [{ label: "Off-campus", sub: "Rent an apartment near campus" }, { label: "On-campus", sub: "University graduate housing" }, { label: "Not sure yet" }] },
  { id: "accepted", title: "Have you accepted your offer?", help: "We'll mark this milestone done if you have.", options: [{ label: "Yes, I've accepted" }, { label: "Not yet" }] },
];

const defaults: Record<string, string[]> = {
  program: ["Full-Time MBA"],
  country: ["India"],
  visa: ["F-1"],
  funding: ["Scholarship", "Loan"],
  dependents: ["No, just me"],
  housing: ["Off-campus"],
  accepted: ["Yes, I've accepted"],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string[]>>(defaults);
  const [phase, setPhase] = React.useState<"questions" | "building" | "ready">("questions");

  const q = questions[step];
  const total = questions.length;

  const next = React.useCallback(() => {
    if (step < total - 1) setStep((s) => s + 1);
    else {
      setPhase("building");
      setTimeout(() => setPhase("ready"), 1800);
    }
  }, [step, total]);

  React.useEffect(() => {
    if (phase !== "questions") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") next();
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) {
        const label = q.options[n - 1].label;
        setAnswers((a) => ({ ...a, [q.id]: q.multi ? (a[q.id]?.includes(label) ? a[q.id].filter((x) => x !== label) : [...(a[q.id] ?? []), label]) : [label] }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, q, phase]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-16 items-center justify-between px-6">
        <Logo size="sm" />
        <Image src={school.logo} alt={school.name} width={140} height={26} className="h-[22px] w-auto opacity-90" />
      </header>
      <div className="h-[3px] w-full bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${phase === "questions" ? ((step + 1) / (total + 1)) * 100 : 100}%` }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        {phase === "questions" && (
          <div key={q.id} className="w-full max-w-[520px] animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="text-[12.5px] font-medium text-primary">
              Question {step + 1} of {total}
            </div>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink">{q.title}</h1>
            <p className="mt-2 text-[14px] text-muted-foreground">{q.help}</p>

            <div className="mt-8 space-y-2">
              {q.options.map((o, i) => {
                const on = answers[q.id]?.includes(o.label);
                return (
                  <button
                    key={o.label}
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        [q.id]: q.multi ? (on ? a[q.id].filter((x) => x !== o.label) : [...(a[q.id] ?? []), o.label]) : [o.label],
                      }))
                    }
                    className={cn(
                      "group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all",
                      on ? "border-primary bg-primary-soft/60 ring-[3px] ring-primary/10" : "hover:border-[#d4d4d8] hover:bg-[#fcfcfc]",
                    )}
                  >
                    <kbd
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-medium transition-colors",
                        on ? "border-primary bg-primary text-white" : "bg-white text-muted-foreground",
                      )}
                    >
                      {on ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                    </kbd>
                    <span className="flex-1">
                      <span className="block text-[14px] font-medium">{o.label}</span>
                      {o.sub && <span className="block text-[12.5px] text-muted-foreground">{o.sub}</span>}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <div className="flex items-center gap-3">
                <span className="hidden text-[12px] text-subtle sm:inline">
                  press <kbd className="rounded border px-1 font-mono text-[10.5px]">Enter ↵</kbd>
                </span>
                <Button variant="ink" size="lg" onClick={next} disabled={!answers[q.id]?.length}>
                  {step === total - 1 ? "Build my roadmap" : "Continue"} <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {phase === "building" && (
          <div className="flex flex-col items-center text-center animate-in fade-in-0 duration-300">
            <Loader2 className="size-7 animate-spin text-primary" />
            <h2 className="mt-5 text-[20px] font-semibold tracking-tight">Building your roadmap…</h2>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">Applying UCLA Anderson&apos;s Fall 2027 dates and your answers.</p>
          </div>
        )}

        {phase === "ready" && (
          <div className="w-full max-w-[620px] animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="size-5" />
            </div>
            <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.03em] text-ink">Your roadmap is ready, Sayali.</h1>
            <p className="mt-2 text-[14px] text-muted-foreground">35 milestones across 9 stages, dated from your Fall 2027 term. You can change your answers anytime in your profile.</p>

            <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-9">
              {stages.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-1.5 rounded-xl border py-3">
                  <s.icon className="size-4 text-primary" strokeWidth={1.8} />
                  <span className="text-[11px] font-medium">{s.short}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border p-4">
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
                <EyeOff className="size-3.5" /> Hidden because they don&apos;t apply to you
              </div>
              <ul className="mt-2.5 space-y-1.5 text-[13px]">
                <li>Dependent visa documents (F-2)</li>
                <li>On-campus housing application</li>
                <li>Sponsor letter submitted</li>
              </ul>
            </div>

            <Button variant="default" size="xl" className="mt-8 w-full sm:w-auto" onClick={() => router.push("/student")}>
              Go to my dashboard <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
