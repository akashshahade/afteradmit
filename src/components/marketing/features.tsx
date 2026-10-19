import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, EyeOff, Globe, House, Landmark, Lock, Plane, Rocket, ShieldCheck, Wallet, GraduationCap, HeartPulse, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { photos, unsplash } from "@/components/marketing/assets";

function Tile({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("relative flex flex-col overflow-hidden rounded-[22px] border bg-white", className)}>{children}</div>;
}

function TileText({ eyebrow, title, body, dark }: { eyebrow: string; title: string; body: string; dark?: boolean }) {
  return (
    <div className="p-6 md:p-7">
      <div className={`text-[12px] font-medium ${dark ? "text-white/50" : "text-primary"}`}>{eyebrow}</div>
      <h3 className={`mt-2 text-[20px] font-semibold leading-snug tracking-[-0.025em] ${dark ? "text-white" : "text-ink"}`}>{title}</h3>
      <p className={`mt-2 max-w-[400px] text-[14px] leading-relaxed ${dark ? "text-white/60" : "text-muted-foreground"}`}>{body}</p>
    </div>
  );
}

const stageIcons = [Rocket, Wallet, Globe, GraduationCap, HeartPulse, House, Landmark, Plane, MapPin];

const privacyPoints = [
  { icon: ShieldCheck, text: "FERPA & GDPR aligned" },
  { icon: Lock, text: "No passport or visa numbers stored" },
  { icon: EyeOff, text: "Contact details never shared with partners" },
];

function RoadmapVisual() {
  return (
    <div className="mt-auto px-6 pb-6 md:px-7 md:pb-7">
      <div className="rounded-2xl border bg-[#fcfcfc] p-4 sm:p-5">
        <div className="flex items-center">
          {stageIcons.map((Icon, i) => (
            <div key={i} className={`items-center last:flex-none ${i > 5 ? "hidden sm:flex sm:flex-1" : i === 5 ? "flex flex-none sm:flex-1" : "flex flex-1"}`}>
              <span
                className={
                  i < 2
                    ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white sm:size-8"
                    : i === 2
                      ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-white ring-[3px] ring-primary/30 sm:size-8"
                      : "flex size-6 shrink-0 items-center justify-center rounded-full border bg-white text-subtle sm:size-8"
                }
              >
                {i < 2 ? <Check className="size-3 sm:size-3.5" strokeWidth={3} /> : <Icon className="size-3 sm:size-3.5" />}
              </span>
              {i < stageIcons.length - 1 && <span className={`h-[2px] flex-1 ${i === 5 ? "hidden sm:block" : ""} ${i < 2 ? "bg-primary" : "bg-[#EBEBED]"}`} />}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {[
            ["DS-160 submitted", "In progress", "bg-primary-soft text-primary"],
            ["SEVIS fee paid", "Due in 7d", "bg-warning-soft text-warning"],
            ["Dependent visa (F-2)", "Hidden for you", "bg-muted text-muted-foreground"],
          ].map(([t, s, c]) => (
            <div key={t} className="rounded-xl border bg-white px-3 py-2.5">
              <div className="truncate text-[12.5px] font-medium">{t}</div>
              <span className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ${c}`}>
                {s === "Hidden for you" && <EyeOff className="size-3" />}
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeadlinesVisual() {
  const rows = [
    { t: "Immunization records", d: "3d overdue", c: "bg-destructive-soft text-destructive", inset: "sm:mr-5" },
    { t: "SEVIS fee", d: "Due in 7d", c: "bg-warning-soft text-warning", inset: "sm:mx-2.5" },
    { t: "Housing deadline", d: "Jun 1", c: "border text-muted-foreground", inset: "sm:ml-5" },
  ];
  return (
    <div className="mt-auto space-y-2 px-6 pb-6 md:px-7 md:pb-7">
      {rows.map((r) => (
        <div key={r.t} className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 py-2.5 shadow-xs ${r.inset}`}>
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{r.t}</span>
          <span className={`shrink-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ${r.c}`}>{r.d}</span>
        </div>
      ))}
    </div>
  );
}

function ClassVisual() {
  return (
    <div className="relative mt-auto h-[190px]">
      <div className="absolute inset-x-6 bottom-0 top-0 overflow-hidden rounded-t-[18px] md:inset-x-7">
        <Image src={unsplash(photos.studying, 800, 500)} alt="Admitted students planning together" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="absolute bottom-4 left-9 right-9 flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:left-10 sm:right-10 md:left-11">
        <div className="flex -space-x-1.5">
          {["#2563EB", "#DB2777", "#0F766E", "#7C3AED"].map((c, i) => (
            <span key={c} className={`size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white ${i === 3 ? "hidden sm:flex" : "flex"}`} style={{ background: c }}>
              {"ASKM"[i]}
            </span>
          ))}
        </div>
        <span className="whitespace-nowrap text-[12px] font-medium">
          642 classmates<span className="hidden sm:inline"> · 48 online</span>
        </span>
      </div>
    </div>
  );
}

function PartnersVisual() {
  const partners = [
    { i: "NB", c: "#1D4ED8", n: "Student loans", p: "0.25% off" },
    { i: "WC", c: "#18181B", n: "Furnished suites", p: "No app fee" },
    { i: "SM", c: "#DB2777", n: "US eSIM", p: "$15 / mo" },
  ];
  return (
    <div className="mt-auto space-y-2 px-6 pb-6 md:px-7 md:pb-7">
      {partners.map((p) => (
        <div key={p.i} className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: p.c }}>
            {p.i}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[12.5px] font-medium">
              <span className="truncate">{p.n}</span>
              <BadgeCheck className="size-3.5 shrink-0 text-success" />
            </span>
            <span className="block text-[11px] font-medium text-primary sm:hidden">{p.p}</span>
          </span>
          <span className="hidden whitespace-nowrap rounded-md bg-primary-soft px-1.5 py-0.5 text-[10.5px] font-medium text-primary sm:inline">{p.p}</span>
        </div>
      ))}
    </div>
  );
}

const schoolOutcomes = [
  { title: "Live in under a week", body: "Your dates and branding on a proven template." },
  { title: "One CSV invites the class", body: "Admits activate from their phone in minutes." },
  { title: "See where the class is stuck", body: "Stage-by-stage progress, aggregate only." },
];

function SchoolsCard() {
  return (
    <div id="schools" className="scroll-mt-24 overflow-hidden rounded-[22px] border bg-white md:col-span-6">
      <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto">
          <Image src="/admission_team.webp" alt="University campus on a clear day" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-[center_60%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <dl className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-5 p-5 text-white sm:p-6 md:p-8">
            <div>
              <dt className="sr-only">Activation</dt>
              <dd className="tabular whitespace-nowrap text-[30px] font-semibold leading-none tracking-[-0.04em] sm:text-[36px] md:text-[44px]">86%</dd>
              <dd className="mt-2 text-[12.5px] leading-snug text-white/80">admits active in week one</dd>
            </div>
            <div>
              <dt className="sr-only">Launch time</dt>
              <dd className="tabular whitespace-nowrap text-[30px] font-semibold leading-none tracking-[-0.04em] sm:text-[36px] md:text-[44px]">&lt;1 wk</dd>
              <dd className="mt-2 text-[12.5px] leading-snug text-white/80">kickoff to launch</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:px-10 lg:py-7">
          <div className="text-[12.5px] font-medium text-primary">For admissions teams</div>
          <h3 className="mt-2 text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[28px] md:text-[30px]">
            Fewer emails. Less summer melt.
            <span className="block text-[#A1A1AA]">Admits who arrive ready.</span>
          </h3>
          <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-muted-foreground">Pre-arrival, off your team&apos;s plate.</p>
          <ol className="mt-5 border-t">
            {schoolOutcomes.map((o, i) => (
              <li key={o.title} className="flex gap-4 border-b py-2.5">
                <span className="tabular pt-[3px] text-[12px] font-medium text-primary">0{i + 1}</span>
                <div>
                  <div className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{o.title}</div>
                  <p className="text-[13.5px] leading-relaxed text-muted-foreground">{o.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild variant="ink" size="lg" className="rounded-full px-5">
              <Link href="/contact?topic=university">
                Book a demo <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full px-4">
              <Link href="/#faq">How it works</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="product" className="scroll-mt-20 pb-20 pt-10 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="max-w-[640px]">
          <div className="text-[13px] font-medium text-primary">Product</div>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-ink md:text-[48px]">
            Everything between
            <br />
            &ldquo;yes&rdquo; and day one.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">One place for the 35 things every admitted student has to get right — built with the school, personalized for each student.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Tile className="md:col-span-4">
            <TileText eyebrow="Personal roadmap" title="Nine stages. Thirty-five milestones. Zero guesswork." body="Built from five onboarding questions and dated from your school's real deadlines. Steps that don't apply simply disappear." />
            <RoadmapVisual />
          </Tile>

          <Tile className="md:col-span-2">
            <TileText eyebrow="Deadlines" title="Nothing slips." body="Reminders a week and a day before anything is due — and a nudge the moment it isn't." />
            <DeadlinesVisual />
          </Tile>

          <Tile className="bg-[#FFF6F2] md:col-span-2">
            <TileText eyebrow="Spaces" title="Meet your class before you land." body="Roommates, visa interview stories and weekend plans — private to admitted students." />
            <ClassVisual />
          </Tile>

          <Tile className="md:col-span-2">
            <TileText eyebrow="Marketplace" title="Vetted partners, real perks." body="Loans, housing, banking and phone plans chosen for students — never sold your data." />
            <PartnersVisual />
          </Tile>

          <Tile className="border-ink bg-ink md:col-span-2">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative">
              <TileText dark eyebrow="Privacy" title="Schools see progress, never people." body="Aggregate dashboards for admissions. Individual activity stays with the student." />
            </div>
            <ul className="relative mt-auto space-y-2.5 px-6 pb-7 text-[13px] text-white/80 md:px-7">
              {privacyPoints.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Icon className="size-4 text-primary" /> {text}
                </li>
              ))}
            </ul>
          </Tile>

          <SchoolsCard />
        </div>
      </div>
    </section>
  );
}
