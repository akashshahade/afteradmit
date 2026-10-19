import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Briefcase, CalendarDays, DollarSign, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/marketing/page-shell";
import { formatDate } from "@/lib/blog";
import { getJob, jobs } from "@/lib/careers";

export const instant = false;

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: "Role not found" };
  return { title: `${job.title} — Careers`, description: job.summary };
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="relative pl-6 text-[16px] leading-relaxed text-[#3f3f46] before:absolute before:left-1 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-primary">
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const apply = `mailto:careers@afteradmit.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  const facts = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Type", value: `${job.type} · ${job.team}` },
    { icon: DollarSign, label: "Compensation", value: job.salary },
    { icon: CalendarDays, label: "Posted", value: formatDate(job.posted) },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [...job.about, ...job.responsibilities, ...job.requirements].join(" "),
    datePosted: job.posted,
    employmentType: "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "AfterAdmit", sameAs: "https://afteradmit.com" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" } },
    ...(job.location.includes("Remote") ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "USA" } } : {}),
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-[1040px] px-5 pb-24 pt-28 md:px-8 md:pt-36">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Link href="/careers" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> All open roles
        </Link>

        <header className="mt-6 border-b pb-8">
          <div className="text-[13px] font-medium text-primary">{job.team}</div>
          <h1 className="mt-2 text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[40px]">{job.title}</h1>
          <p className="mt-3 max-w-[620px] text-[16.5px] leading-relaxed text-muted-foreground">{job.summary}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <article className="min-w-0 max-w-[680px]">
            <section>
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">About the role</h2>
              {job.about.map((p) => (
                <p key={p} className="mt-4 text-[16px] leading-[1.75] text-[#3f3f46]">
                  {p}
                </p>
              ))}
            </section>
            <Section title="What you'll do" items={job.responsibilities} />
            <Section title="What you'll bring" items={job.requirements} />
            <Section title="Nice to have" items={job.niceToHave} />
            {job.stack && (
              <section className="mt-10">
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tools we use</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.stack.map((s) => (
                    <span key={s} className="rounded-full border px-3 py-1 text-[13px] text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
            <section className="mt-10">
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Benefits</h2>
              <p className="mt-4 text-[16px] leading-[1.75] text-[#3f3f46]">Medical, dental and vision cover; meaningful equity; 401(k); a yearly learning budget; flexible time off; and fully paid parental leave.</p>
            </section>
            <section className="mt-10">
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">How to apply</h2>
              <p className="mt-4 text-[16px] leading-[1.75] text-[#3f3f46]">
                Email your CV or LinkedIn profile and a few lines on why this role interests you. Our process is an intro call, a conversation about your work, a short paid work sample, and meeting the team — usually within three weeks.
              </p>
            </section>
            <p className="mt-12 border-t pt-6 text-[13px] leading-relaxed text-muted-foreground">
              AfterAdmit is an equal opportunity employer. We welcome applicants of every background and do not discriminate on the basis of race, religion, color, national origin, sex, sexual orientation, gender identity, age, disability, veteran status or any other protected characteristic. The salary range reflects the base pay we expect to offer for this role in the listed locations; final pay depends on experience.
            </p>
          </article>

          <aside className="order-first lg:order-none">
            <div className="rounded-2xl border p-5 lg:sticky lg:top-28">
              <dl className="space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="text-[12px] text-subtle">{label}</dt>
                      <dd className="text-[14px] font-medium text-ink">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <Button asChild variant="ink" size="lg" className="mt-6 w-full rounded-full">
                <a href={apply}>
                  Apply for this role <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
