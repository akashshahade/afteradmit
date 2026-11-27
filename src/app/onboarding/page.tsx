"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ChevronsUpDown, EyeOff, LayoutGrid, Loader2, Route, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { school, stages } from "@/lib/data";
import { COUNTRIES } from "@/lib/countries";
import { createClient } from "@/lib/supabase/client";
import { displayName, type Profile } from "@/lib/auth-profile";
import {
  applyOnboardingRules,
  blankCatalog,
  progressPayload,
  type OnboardingAnswers,
} from "@/lib/student-progress";

type Q = {
  id: string;
  title: string;
  help: string;
  options?: { label: string; sub?: string }[];
  multi?: boolean;
  kind?: "choices" | "country";
};

const questions: Q[] = [
  {
    id: "program",
    title: "Which program are you joining?",
    help: "We'll pull your program's dates and orientation schedule.",
    options: [
      { label: "Full-Time MBA" },
      { label: "Fully Employed MBA" },
      { label: "Executive MBA" },
      { label: "Master of Financial Engineering" },
    ],
  },
  {
    id: "country",
    title: "Where are you moving from?",
    help: "Used for timezone, visa tips, and classmates near you.",
    kind: "country",
  },
  {
    id: "visa",
    title: "What's your visa situation?",
    help: "Domestic students won't see visa-only steps on the roadmap.",
    options: [
      { label: "F-1", sub: "Most international degree students" },
      { label: "J-1", sub: "Exchange or sponsored programs" },
      { label: "Domestic", sub: "US citizen or permanent resident" },
    ],
  },
  {
    id: "funding",
    title: "How are you funding your degree?",
    help: "Pick all that apply — we'll keep only the milestones you need.",
    multi: true,
    options: [
      { label: "Scholarship" },
      { label: "Loan" },
      { label: "Sponsor / employer" },
      { label: "Self-funded" },
    ],
  },
  {
    id: "dependents",
    title: "Are you bringing dependents?",
    help: "A spouse or children on F-2/J-2 visas.",
    options: [{ label: "No, just me" }, { label: "Yes" }],
  },
  {
    id: "housing",
    title: "Where do you plan to live?",
    help: "Shows the right housing milestones and partners.",
    options: [
      { label: "Off-campus", sub: "Rent an apartment near campus" },
      { label: "On-campus", sub: "University graduate housing" },
      { label: "Not sure yet" },
    ],
  },
  {
    id: "accepted",
    title: "Have you accepted your offer?",
    help: "We'll mark that milestone done if you already have.",
    options: [{ label: "Yes, I've accepted" }, { label: "Not yet" }],
  },
];

function toAnswers(raw: Record<string, string[]>): OnboardingAnswers {
  return {
    program: raw.program?.[0] ?? "Full-Time MBA",
    country: raw.country?.[0] ?? "Other country",
    visa: raw.visa?.[0] ?? "F-1",
    funding: raw.funding ?? [],
    dependents: raw.dependents?.[0] === "Yes",
    housing: raw.housing?.[0] ?? "Not sure yet",
    offerAccepted: raw.accepted?.[0]?.startsWith("Yes") ?? false,
  };
}

function hiddenLabels(a: OnboardingAnswers) {
  const hidden: string[] = [];
  if (a.visa === "Domestic") hidden.push("Visa & SEVIS steps");
  if (!a.dependents) hidden.push("Dependent visa documents (F-2/J-2)");
  if (!a.funding.some((f) => /loan/i.test(f))) hidden.push("Loan secured");
  if (/on-campus/i.test(a.housing)) hidden.push("Off-campus lease signing");
  if (/off-campus/i.test(a.housing)) hidden.push("On-campus housing application");
  if (!a.funding.some((f) => /sponsor/i.test(f))) hidden.push("Sponsor letter");
  return hidden;
}

function errorMessage(err: unknown) {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return "Could not save onboarding";
}

function CountryPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (country: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const filtered = COUNTRIES.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-[14px] transition-all",
            value
              ? "border-primary bg-primary-soft/40 ring-[3px] ring-primary/10"
              : "hover:border-[#d4d4d8]",
          )}
        >
          <span className={cn(value ? "font-medium text-ink" : "text-muted-foreground")}>
            {value || "Search countries…"}
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter…"
            className="h-9 pl-8"
            autoFocus
          />
        </div>
        <ul className="max-h-64 overflow-y-auto">
          {filtered.map((c) => {
            const on = value === c;
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13.5px]",
                    on ? "bg-primary-soft font-medium text-primary" : "hover:bg-muted",
                  )}
                >
                  {c}
                  {on && <Check className="size-3.5" strokeWidth={3} />}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-2.5 py-6 text-center text-[13px] text-muted-foreground">No matches</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [phase, setPhase] = React.useState<"loading" | "welcome" | "questions" | "building" | "ready">("loading");
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [hidden, setHidden] = React.useState<string[]>([]);

  const q = questions[step];
  const total = questions.length;

  React.useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login?next=/onboarding");
        return;
      }
      const { data } = await supabase.rpc("get_my_profile");
      const prof = (Array.isArray(data) ? data[0] : data) as Profile | null;
      setProfile(prof);
      if (prof?.onboarding_completed_at) {
        router.replace("/student");
        return;
      }
      setPhase("welcome");
    })();
  }, [router]);

  const finish = React.useCallback(async () => {
    setPhase("building");
    const parsed = toAnswers(answers);
    setHidden(hiddenLabels(parsed));

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const base =
        (profile?.first_name || "student").toLowerCase().replace(/[^a-z0-9]/g, "") || "student";
      const handle = `${base}${Math.floor(Math.random() * 90 + 10)}`;

      const list = applyOnboardingRules(blankCatalog(), parsed);
      const progress = progressPayload(list).map((r) => ({
        milestone_id: r.milestone_id,
        status: r.status,
        completed_at: r.completed_at,
        tasks: r.tasks,
      }));

      // Join only the class space up front — students explore Housing / Visa / Roommates next.
      const spaces = ["AndersonFall27"];

      const { error } = await supabase.rpc("complete_student_onboarding", {
        p_program: parsed.program,
        p_home_country: parsed.country,
        p_visa_type: parsed.visa,
        p_funding: parsed.funding,
        p_dependents: parsed.dependents,
        p_housing: parsed.housing,
        p_offer_accepted: parsed.offerAccepted,
        p_handle: profile?.handle || handle,
        p_progress: progress,
        p_spaces: spaces,
      });
      if (error) throw error;

      setTimeout(() => setPhase("ready"), 900);
    } catch (err) {
      toast.error(errorMessage(err));
      setPhase("questions");
    }
  }, [answers, profile]);

  const next = React.useCallback(() => {
    if (!answers[q.id]?.length) {
      toast.error(q.kind === "country" ? "Select a country to continue" : "Pick an option to continue");
      return;
    }
    if (step < total - 1) setStep((s) => s + 1);
    else void finish();
  }, [answers, finish, q, step, total]);

  React.useEffect(() => {
    if (phase !== "questions") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") next();
      if (q.kind === "country") return;
      const opts = q.options ?? [];
      const n = Number(e.key);
      if (n >= 1 && n <= opts.length) {
        const label = opts[n - 1].label;
        setAnswers((a) => ({
          ...a,
          [q.id]: q.multi
            ? a[q.id]?.includes(label)
              ? a[q.id].filter((x) => x !== label)
              : [...(a[q.id] ?? []), label]
            : [label],
        }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, q, phase]);

  const sideImage =
    phase === "ready" || phase === "building"
      ? "/onboarding3.avif"
      : phase === "welcome"
        ? "/onboarding.avif"
        : step % 2 === 0
          ? "/onboarding2.avif"
          : "/onboarding.avif";

  if (phase === "loading") {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="flex h-14 items-center justify-between border-b px-5 sm:px-8">
          <Logo size="sm" />
          <span className="text-[13px] text-muted-foreground">Student onboarding</span>
        </header>
        <div className="grid flex-1 place-items-center gap-3 text-[13px] text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          Preparing your onboarding…
        </div>
      </div>
    );
  }

  const firstName =
    profile?.first_name ||
    displayName(profile ?? { first_name: "", last_name: "", email: "there" }).split(" ")[0];

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:flex-row">
      <aside className="relative hidden min-h-dvh w-[42%] shrink-0 overflow-hidden bg-[#18181B] lg:block">
        <Image src={sideImage} alt="" fill priority className="object-cover opacity-90" sizes="42vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/70">AfterAdmit</div>
          <p className="mt-3 max-w-sm text-[22px] font-semibold leading-snug tracking-[-0.02em]">
            From admit letter to arrival — one clear path for your class.
          </p>
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-[radial-gradient(900px_480px_at_10%_-10%,#fff1eb,transparent),linear-gradient(#fff,#fff)]">
      <header className="flex h-14 shrink-0 items-center justify-between px-5 sm:px-8">
        <Logo size="sm" />
        <div className="flex items-center gap-4 text-[13px]">
          <span className="hidden text-muted-foreground sm:inline">{profile?.school_name || "Your university"}</span>
          <button
            type="button"
            className="font-medium text-muted-foreground hover:text-foreground"
            onClick={() => {
              void createClient().auth.signOut().then(() => router.replace("/login"));
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="h-[3px] w-full bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-500 ease-out"
          style={{
            width:
              phase === "welcome"
                ? "8%"
                : phase === "questions"
                  ? `${((step + 1) / (total + 1)) * 100}%`
                  : "100%",
          }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        {phase === "welcome" && (
          <div className="w-full max-w-[560px] animate-in fade-in-0 slide-in-from-bottom-2 duration-400">
            <div className="text-[12.5px] font-medium text-primary">
              {profile?.school_name || school.name} · {profile?.intake || school.term}
            </div>
            <h1 className="mt-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[40px]">
              Welcome{firstName ? `, ${firstName}` : ""}.
              <br />
              Let&apos;s build your path in.
            </h1>
            <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground">
              Seven quick questions. We hide milestones you don&apos;t need — visa steps for domestic students,
              loan tasks if you&apos;re self-funded — and keep the rest dated for your start.
            </p>
            <ul className="mt-7 space-y-3 text-[13.5px] text-muted-foreground">
              {[
                "Personalized roadmap for your program",
                "Class spaces for housing, visas, and roommates",
                "Partner perks when you need them — never before",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <Button variant="ink" size="xl" className="mt-9" onClick={() => setPhase("questions")}>
              Start onboarding <ArrowRight className="size-4" />
            </Button>
            <p className="mt-4 text-[12px] text-subtle">About 2 minutes · You can change answers later in Profile</p>
          </div>
        )}

        {phase === "questions" && (
          <div key={q.id} className="w-full max-w-[540px] animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="text-[12.5px] font-medium text-primary">
              {step === 0 ? `Welcome${firstName ? `, ${firstName}` : ""}` : `Question ${step + 1} of ${total}`}
            </div>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[32px]">
              {q.title}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{q.help}</p>

            <div className="mt-7 space-y-2">
              {q.kind === "country" ? (
                <CountryPicker
                  value={answers.country?.[0]}
                  onChange={(country) => setAnswers((a) => ({ ...a, country: [country] }))}
                />
              ) : (
                (q.options ?? []).map((o, i) => {
                  const on = answers[q.id]?.includes(o.label);
                  return (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({
                          ...a,
                          [q.id]: q.multi
                            ? on
                              ? a[q.id].filter((x) => x !== o.label)
                              : [...(a[q.id] ?? []), o.label]
                            : [o.label],
                        }))
                      }
                      className={cn(
                        "group flex w-full items-center gap-3.5 rounded-xl border bg-white/80 px-4 py-3.5 text-left transition-all",
                        on
                          ? "border-primary bg-primary-soft/60 ring-[3px] ring-primary/10"
                          : "hover:border-[#d4d4d8] hover:bg-[#fcfcfc]",
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
                })
              )}
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
            <p className="mt-1.5 max-w-sm text-[13.5px] text-muted-foreground">
              Personalizing {profile?.school_name || "your"} milestones from your answers.
            </p>
          </div>
        )}

        {phase === "ready" && (
          <div className="w-full max-w-[640px] animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            <div className="text-[12.5px] font-medium text-primary">You&apos;re set</div>
            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-ink sm:text-[32px]">
              Your roadmap is ready{firstName ? `, ${firstName}` : ""}.
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Nine stages dated for {school.term}. You&apos;re in the class space — pick Housing, Visa, and Roommates
              next so the right classmates find you.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-9">
              {stages.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-1.5 rounded-xl border bg-white py-3 shadow-sm">
                  <s.icon className="size-4 text-primary" strokeWidth={1.8} />
                  <span className="text-[11px] font-medium">{s.short}</span>
                </div>
              ))}
            </div>

            {hidden.length > 0 && (
              <div className="mt-5 rounded-xl border bg-white p-4">
                <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
                  <EyeOff className="size-3.5" /> Hidden because they don&apos;t apply to you
                </div>
                <ul className="mt-2.5 space-y-1.5 text-[13px]">
                  {hidden.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 rounded-xl border border-primary/15 bg-primary-soft/40 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                  <LayoutGrid className="size-4" />
                </span>
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">Explore class spaces</div>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    Join Housing, Roommates, F-1 & Visa, and more when you&apos;re ready — you only see spaces you join.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="ink"
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => {
                  try {
                    sessionStorage.setItem("aa-tour-pending", "student");
                  } catch {}
                  router.push("/student");
                }}
              >
                <Route className="size-4" /> Go to my dashboard
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => router.push("/student/community/spaces")}
              >
                <LayoutGrid className="size-4" /> Explore spaces
              </Button>
            </div>
          </div>
        )}
      </div>
      <footer className="flex h-12 items-center justify-between px-5 text-[12px] text-muted-foreground sm:px-8">
        <span>Step {phase === "questions" ? step + 1 : phase === "welcome" ? 0 : total} of {total}</span>
        <div className="flex gap-4">
          <a href="/help" className="hover:text-foreground">Help</a>
          <a href="/legal/privacy" className="hover:text-foreground">Privacy</a>
        </div>
      </footer>
      </div>
    </div>
  );
}
