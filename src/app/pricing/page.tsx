import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHero, PageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple per-admit pricing for universities, free for students, and performance-based plans for partners.",
};

const plans = [
  {
    name: "Pilot",
    price: "Free",
    unit: "first intake, up to 150 admits",
    body: "Prove the impact with one program before you commit.",
    cta: "Start a pilot",
    features: ["Personal roadmaps for every admit", "Private class community", "Aggregate class insights", "CSV invites and email support"],
  },
  {
    name: "Growth",
    price: "$39",
    unit: "per admitted student, per intake",
    body: "For admissions teams running one or more programs.",
    cta: "Book a demo",
    featured: true,
    features: ["Everything in Pilot", "Unlimited programs and intakes", "Your branding, dates and contacts", "SSO and webhooks", "Dedicated launch manager"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "university-wide agreements",
    body: "For universities rolling out across schools and departments.",
    cta: "Talk to sales",
    features: ["Everything in Growth", "Slate and Salesforce sync", "Custom data agreements (DPA)", "SLA and priority support", "Quarterly impact reviews"],
  },
];

const others = [
  { who: "Students", price: "Free", body: "Every roadmap, reminder and space is free for admitted students. Optional Plus — $12/month — adds 1:1 advisor calls and document reviews." },
  { who: "Partners", price: "From $499/mo", body: "Vetted listings shown at the right milestone, plus pay-per-lead pricing. Student contact details are never shared." },
];

const faqs = [
  { q: "How is the per-admit price counted?", a: "By the number of admitted students you invite in an intake. Students who withdraw before joining aren't counted." },
  { q: "Is there a minimum?", a: "Growth plans have an annual minimum of $6,000 — about 150 admits." },
  { q: "Can we pay from different budgets?", a: "Yes. Many schools split the cost between admissions, international services and student affairs. We can invoice each." },
];

export default function PricingPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[1200px] px-5 pt-32 md:px-8 md:pt-40">
        <PageHero
          center
          eyebrow="Pricing"
          title="Priced per admit."
          muted="Paid back in arrivals."
          description="Universities pay a simple per-student fee. Students never pay to use their roadmap. Partners pay to reach students at the right moment."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={cn("flex flex-col rounded-[24px] border p-7", p.featured ? "border-ink bg-ink text-white" : "bg-white")}>
              <div className="flex items-center justify-between">
                <h2 className={cn("text-[16px] font-semibold", p.featured ? "text-white" : "text-ink")}>{p.name}</h2>
                {p.featured && <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-white">Most popular</span>}
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="tabular text-[44px] font-semibold leading-none tracking-[-0.04em]">{p.price}</span>
              </div>
              <div className={cn("mt-2 text-[13.5px]", p.featured ? "text-white/55" : "text-muted-foreground")}>{p.unit}</div>
              <p className={cn("mt-5 text-[14.5px] leading-relaxed", p.featured ? "text-white/75" : "text-muted-foreground")}>{p.body}</p>
              <ul className={cn("mt-6 flex-1 space-y-3 border-t pt-6", p.featured ? "border-white/10" : "")}>
                {p.features.map((f) => (
                  <li key={f} className={cn("flex gap-2.5 text-[14px]", p.featured ? "text-white/85" : "text-ink")}>
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.featured ? "default" : "outline"} size="lg" className="mt-8 w-full rounded-full">
                <Link href="/contact?topic=university">
                  {p.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {others.map((o) => (
            <div key={o.who} className="rounded-[24px] border bg-[#FAFAFA] p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[16px] font-semibold text-ink">For {o.who.toLowerCase()}</h2>
                <span className="tabular text-[15px] font-semibold text-ink">{o.price}</span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1200px] px-5 pb-24 md:mt-32 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink md:text-[36px]">Pricing questions</h2>
          <dl className="divide-y border-y">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-[15.5px] font-semibold text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
