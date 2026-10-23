import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero, PageShell } from "@/components/marketing/page-shell";
import { jobs } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at AfterAdmit in engineering, design, partnerships and student success. Help every admitted student arrive ready.",
};

export default function CareersPage() {
  const teams = [...new Set(jobs.map((j) => j.team))];

  return (
    <PageShell>
      <section className="mx-auto max-w-[960px] px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <PageHero
          eyebrow="Careers"
          title="Help every admitted student arrive ready."
          description="We're a small team in Los Angeles building the clear path from admit to arrival. Here's where we're hiring."
        />

        <div className="mt-14 space-y-12 md:mt-20">
          {teams.map((team) => (
            <section key={team} aria-labelledby={`team-${team}`}>
              <h2 id={`team-${team}`} className="text-[13px] font-medium uppercase tracking-[0.08em] text-subtle">
                {team}
              </h2>
              <ul className="mt-3 divide-y border-y">
                {jobs
                  .filter((j) => j.team === team)
                  .map((j) => (
                    <li key={j.slug}>
                      <Link href={`/careers/${j.slug}`} className="group flex items-center gap-4 py-5">
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16.5px] font-semibold tracking-[-0.015em] text-ink group-hover:underline group-hover:underline-offset-4">{j.title}</span>
                          <span className="mt-1 block text-[13.5px] text-muted-foreground">
                            {j.location} · {j.type}
                          </span>
                        </span>
                        <span className="hidden text-[13.5px] text-muted-foreground md:block">{j.salary.split(" +")[0]}</span>
                        <ArrowUpRight className="size-5 shrink-0 text-subtle transition-colors group-hover:text-ink" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t pt-8 text-[14.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Don&apos;t see your role? We&apos;re always glad to hear from people who care about students.</span>
          <a href="mailto:info@afteradmit.com?subject=Open%20application" className="shrink-0 font-medium text-ink underline-offset-4 hover:underline">
            info@afteradmit.com
          </a>
        </div>
      </section>
    </PageShell>
  );
}
