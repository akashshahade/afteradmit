import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Handshake, LifeBuoy, MapPin, Newspaper, Sparkles } from "lucide-react";

import { PageHero, PageShell } from "@/components/marketing/page-shell";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the AfterAdmit team — book a demo for your university, get help as a student, or partner with us.",
};

const channels = [
  { icon: Sparkles, title: "Sales & demos", body: "For admissions and enrollment teams", email: "hello@afteradmit.com" },
  { icon: LifeBuoy, title: "Student support", body: "Help with your roadmap or account", email: "support@afteradmit.com" },
  { icon: Handshake, title: "Partnerships", body: "Loans, housing, banking and more", email: "partners@afteradmit.com" },
  { icon: Newspaper, title: "Press", body: "Media enquiries and press kit", email: "press@afteradmit.com" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <PageHero
          eyebrow="Contact"
          title="Let's talk."
          description="Bringing AfterAdmit to your incoming class, getting ready to arrive, or want to partner with us — we'd love to hear from you."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-10">
          <ContactForm />

          <aside className="space-y-4">
            <div className="divide-y rounded-[24px] border">
              {channels.map(({ icon: Icon, title, body, email }) => (
                <a key={email} href={`mailto:${email}`} className="group flex items-start gap-4 p-5 transition-colors first:rounded-t-[24px] last:rounded-b-[24px] hover:bg-[#FAFAFA]">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-semibold text-ink">{title}</span>
                    <span className="block text-[13px] text-muted-foreground">{body}</span>
                    <span className="mt-1.5 block truncate text-[13.5px] font-medium text-ink underline-offset-4 group-hover:underline">{email}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-start gap-4 rounded-[24px] border p-5">
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">Los Angeles</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">AfterAdmit, Inc.<br />Westwood, Los Angeles, CA</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-[24px] border p-5">
                <Clock className="mt-0.5 size-[18px] shrink-0 text-muted-foreground" />
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">One business day</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">Our typical reply time, Monday to Friday, 9am – 6pm PT.</p>
                </div>
              </div>
            </div>

            <Link href="/help" className="group flex items-center justify-between rounded-[24px] bg-ink p-5 text-white">
              <span>
                <span className="block text-[14.5px] font-semibold">Looking for a quick answer?</span>
                <span className="block text-[13px] text-white/60">Browse the Help center</span>
              </span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
