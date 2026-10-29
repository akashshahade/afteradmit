import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHero, PageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Universities pay $50 per admitted student. Students can add Concierge at $149 per month. Partners pay $1–$15 per lead.",
};

const plans = [
  {
    name: "School license",
    price: "$50",
    unit: "per admitted student, per admit cycle",
    paidBy: "Paid by: University",
    badge: "Primary",
    body: "Every admitted student gets AfterAdmit free.",
    cta: "Book a demo",
    href: "/contact?topic=university",
    featured: true,
    features: ["Access from admit to on-campus onboarding", "Roadmap, class spaces and partners for every admit", "School dashboard with class progress by stage"],
  },
  {
    name: "Concierge upgrade",
    price: "$149",
    unit: "per month, for students who opt in",
    paidBy: "Paid by: Student",
    badge: "Optional",
    body: "Extra support on top of the free roadmap.",
    cta: "See how it works",
    href: "/contact?topic=student",
    features: ["1:1 support on top of the roadmap", "Everything else stays included"],
  },
  {
    name: "Partner leads",
    price: "$1–$15",
    unit: "per lead, for each student referred to a partner",
    paidBy: "Paid by: Partner",
    badge: "Secondary",
    body: "Partners pay only when a student clicks through.",
    cta: "Become a partner",
    href: "/contact?topic=partner",
    features: ["Paid when a student clicks through to a vetted partner", "Loans, housing, banking, insurance and phone plans"],
  },
];

const faqs = [
  { q: "How is the school license counted?", a: "At $50 for each admitted student in an admit cycle. Students who withdraw before joining aren't counted." },
  { q: "What do students pay?", a: "Nothing for the roadmap, spaces, or partners. Concierge is optional at $149 per month, and only for students who opt in." },
  { q: "What do partners pay?", a: "Between $1 and $15 per lead, charged when a student clicks through to a vetted partner. The fee is set per category during the pilot. Student contact details are never shared." },
];

export default function PricingPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[1200px] px-5 pt-32 md:px-8 md:pt-40">
        <PageHero
          center
          eyebrow="Pricing"
          title="Universities pay, so every admitted student gets in free."
          muted="Students can upgrade. Partners pay per lead."
          description="A school license is $50 per admitted student. Concierge is $149 per month for students who want 1:1 support. Partners pay $1–$15 when a student clicks through."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={cn("flex flex-col rounded-[24px] border p-7", p.featured ? "border-ink bg-ink text-white" : "bg-white")}>
              <div className="flex items-center justify-between">
                <h2 className={cn("text-[16px] font-semibold", p.featured ? "text-white" : "text-ink")}>{p.name}</h2>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", p.featured ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{p.badge}</span>
              </div>
              <div className={cn("mt-4 text-[12.5px]", p.featured ? "text-white/55" : "text-muted-foreground")}>{p.paidBy}</div>
              <div className="mt-3 flex items-baseline gap-2">
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
                <Link href={p.href}>
                  {p.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[24px] border border-primary/15 bg-primary-soft px-6 py-5 text-[14.5px] leading-relaxed text-ink">
          <span className="font-semibold">Per admitted student:</span> $50 license + 32% who enroll × $26 from partners and concierge = $58.32. A school with ~950 admits ≈ $55K a year.
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
          Assumptions: 32% yield (UCLA Anderson, Class of 2027), 3 partner leads per enrolling student at $8 average, 5% of enrolling students take concierge for 4 months. Lead fees set per category during the pilot.
        </p>
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
