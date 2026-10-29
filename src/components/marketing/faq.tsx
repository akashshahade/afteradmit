"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "Who is AfterAdmit for?", a: "Universities that want every admitted student to arrive ready. The school brings AfterAdmit to its incoming class; students join through their school's invite." },
  { q: "Is it free for students?", a: "Yes. Your school pays $50 per admitted student, so the roadmap is free. Optional Concierge is $149 per month for students who want 1:1 support." },
  { q: "What can my school see?", a: "Aggregate progress for the whole class — sign-up rate, completion by stage and who's behind on key deadlines, in aggregate. Never your individual milestones, posts, messages or partner clicks." },
  { q: "Does it work for domestic students too?", a: "Yes. The roadmap adapts to your answers — domestic students simply never see visa or international-only steps." },
  { q: "How long does it take a school to launch?", a: "Most teams go live in under a week: confirm term dates, adjust school-specific guidance, upload a CSV of admits, and send invites." },
  { q: "How do partners work?", a: "Every partner is vetted by AfterAdmit. Clicking one opens their site — nothing is purchased in AfterAdmit and your contact details are never shared." },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 border-t py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:grid-cols-[1fr_1.4fr] md:px-8">
        <div>
          <div className="text-[13px] font-medium text-primary">FAQ</div>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-ink md:text-[44px]">Questions, answered.</h2>
          <p className="mt-4 max-w-[340px] text-[15px] leading-relaxed text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Our team usually replies within a few hours.
          </p>
          <Button asChild variant="outline" className="mt-6 rounded-full px-5">
            <Link href="mailto:info@afteradmit.com">info@afteradmit.com</Link>
          </Button>
        </div>
        <ul className="divide-y border-y">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q}>
                <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center gap-6 py-5 text-left">
                  <span className="flex-1 text-[16px] font-medium tracking-[-0.01em] text-ink">{f.q}</span>
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200", on && "rotate-45 border-ink bg-ink text-white")}>
                    <Plus className="size-3.5" />
                  </span>
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="max-w-[560px] pb-5 text-[14.5px] leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
