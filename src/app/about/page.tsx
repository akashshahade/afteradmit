import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Landmark, ShieldCheck, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero, PageShell } from "@/components/marketing/page-shell";
import { authors } from "@/lib/blog";

export const metadata: Metadata = {
  title: "About",
  description: "AfterAdmit helps universities guide every admitted student from offer to arrival — with a personal roadmap, a private class community and vetted partners.",
};

const stats = [
  { value: "35", label: "steps between “yes” and day one" },
  { value: "5+", label: "offices the average admit hears from" },
  { value: "86%", label: "of invited admits active in week one" },
  { value: "<1 wk", label: "for a school to launch an intake" },
];

const principles = [
  { icon: ShieldCheck, title: "Student-first privacy", body: "Schools see class progress in aggregate — never an individual's activity, posts or messages." },
  { icon: Landmark, title: "Built with schools", body: "Every roadmap starts from a university's real deadlines, contacts and requirements." },
  { icon: CalendarCheck, title: "Every step, dated", body: "No vague to-do lists. Each step has an owner, a date and a reason it matters." },
  { icon: Waves, title: "Calm over noise", body: "Fewer, better-timed nudges. We'd rather send one useful reminder than five newsletters." },
];

const founders = [
  { name: "Aditi Rao", role: "Co-founder & CEO", initials: "AR", color: "#FF4500" },
  { name: "Jordan Whitfield", role: "Co-founder & CTO", initials: "JW", color: "#7C3AED" },
];

export default function AboutPage() {
  const team = [...founders, ...Object.values(authors).map((a) => ({ name: a.name, role: a.role, initials: a.initials, color: a.color }))];

  return (
    <PageShell>
      <section className="mx-auto max-w-[1200px] px-5 pt-32 md:px-8 md:pt-40">
        <PageHero
          eyebrow="About"
          title="Every admitted student"
          muted="deserves to arrive ready."
          description="AfterAdmit guides admitted students from offer to arrival — and gives the universities that admit them a clear view of how their class is doing."
        />
        <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[20px] bg-muted sm:aspect-[21/9] md:mt-16 md:rounded-[28px]">
          <Image src="/students1.webp" alt="Graduates celebrating together" fill loading="eager" sizes="(min-width: 1200px) 1136px, 100vw" className="object-cover object-[center_35%]" />
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-[1200px] grid-cols-1 gap-8 px-5 md:mt-28 md:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <div className="text-[13px] font-medium text-primary">Why we started</div>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink md:text-[38px]">Getting in is the hard part. Getting there shouldn&apos;t be.</h2>
        </div>
        <div className="space-y-5 text-[16.5px] leading-[1.75] text-[#3f3f46]">
          <p>Between saying yes and showing up on day one, an admitted student faces dozens of steps: visas, funding, health records, housing, travel. Each one belongs to a different office, arrives in a different email and runs on a different deadline.</p>
          <p>For international students the stakes are higher still. One missed step — a fee paid late, an interview booked too close — can delay an arrival by a semester. Admissions teams feel it too, as committed students quietly melt away over the summer.</p>
          <p>We built AfterAdmit to replace that noise with one clear path: a personal, dated roadmap for every student, a private space to meet their class, and a calm view for the school of where everyone stands.</p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-5 md:mt-28 md:px-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border bg-border lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-6 md:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd className="tabular text-[34px] font-semibold leading-none tracking-[-0.04em] text-ink md:text-[44px]">{s.value}</dd>
              <dd className="mt-3 text-[13.5px] leading-snug text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-5 md:mt-28 md:px-8">
        <div className="max-w-[640px]">
          <div className="text-[13px] font-medium text-primary">How we work</div>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink md:text-[38px]">Four things we won&apos;t compromise on.</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[20px] border p-6">
              <Icon className="size-5 text-primary" />
              <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-5 md:mt-28 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[560px]">
            <div className="text-[13px] font-medium text-primary">Team</div>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink md:text-[38px]">Former admits, admissions leaders and builders.</h2>
          </div>
          <p className="max-w-[340px] text-[14.5px] leading-relaxed text-muted-foreground">Most of us have made the move ourselves — and remember exactly how confusing it was.</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {team.map((m) => (
            <li key={m.name} className="flex flex-col items-start gap-4 rounded-[20px] border p-5 sm:flex-row sm:items-center">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white" style={{ background: m.color }}>
                {m.initials}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-ink">{m.name}</span>
                <span className="block text-[13px] text-muted-foreground">{m.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-[1200px] px-5 pb-24 md:mt-28 md:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-7 py-10 sm:px-10 md:px-14 md:py-14">
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 size-[380px] rounded-full bg-primary/30 blur-[110px]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-white md:text-[40px]">
                Help us build it.
                <span className="block text-white/45">We&apos;re hiring.</span>
              </h2>
              <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-white/60">Small team, real impact, and a product thousands of students rely on at a big moment in their lives.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" className="h-12 rounded-full px-6">
                <Link href="/careers">
                  See open roles <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
