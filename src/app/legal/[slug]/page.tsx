import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { legalPages, type LegalSlug } from "@/components/marketing/assets";

export const instant = false;

const content: Record<LegalSlug, { updated: string; intro: string; sections: [string, string][] }> = {
  privacy: {
    updated: "May 1, 2027",
    intro: "AfterAdmit helps universities guide admitted students from offer to arrival. This policy explains what we collect, why, and the choices you have.",
    sections: [
      ["What we collect", "Account details (name, email, school), onboarding answers that personalize your roadmap (program, home country, visa type, funding sources, dependents, housing preference), milestone progress, community posts and messages, and basic product analytics."],
      ["What we never collect", "Passport numbers, visa numbers, SEVIS IDs, or the contents of financial documents."],
      ["How we use it", "To build and date your roadmap, send reminders you've opted into, run the community, and improve the product. We do not sell personal data."],
      ["What your school sees", "Aggregate progress for its admitted class only. Universities never see your individual milestones, posts, messages or partner clicks."],
      ["Partners", "When you click a partner we record an anonymous lead event. We never share your contact details — you choose what to share on the partner's site."],
      ["Your rights", "Download or delete your data anytime from Profile → Privacy & data, or email privacy@afteradmit.com."],
    ],
  },
  terms: {
    updated: "May 1, 2027",
    intro: "These terms govern your use of AfterAdmit. By creating an account you agree to them.",
    sections: [
      ["Accounts", "You need a valid university invite to create a student account. Keep your login secure and tell us about any unauthorized use."],
      ["Guidance, not advice", "Roadmaps and community posts are general guidance. Always confirm visa, immigration and financial decisions with your school or official sources."],
      ["Community conduct", "Be respectful, don't share others' personal information, and follow each space's guidelines. We may remove content or accounts that break these rules."],
      ["Partners", "Partner services are provided by third parties under their own terms. AfterAdmit is not party to those transactions."],
      ["Changes", "We'll notify you of material changes at least 14 days in advance."],
    ],
  },
  cookies: {
    updated: "May 1, 2027",
    intro: "We use a small number of cookies to keep you signed in and understand how the product is used.",
    sections: [
      ["Essential", "Authentication and security cookies required for AfterAdmit to work."],
      ["Analytics", "Privacy-friendly product analytics on page views and key events. No advertising cookies."],
      ["Your choices", "You can block non-essential cookies in your browser settings at any time."],
    ],
  },
  "student-data": {
    updated: "May 1, 2027",
    intro: "Universities share admitted-student records with us to run AfterAdmit. We treat them accordingly.",
    sections: [
      ["FERPA", "We act as a school official with a legitimate educational interest and use education records only to provide the service to the university."],
      ["GDPR", "For students in the EU/EEA and UK, the university is the controller and AfterAdmit is the processor. Data subject requests are honored within 30 days."],
      ["Data minimization", "We collect only what personalization requires and never store identity-document numbers."],
      ["Separation by school", "Each university's data is logically isolated. University admins can only access their own school's aggregate data."],
    ],
  },
  "data-processing": {
    updated: "May 1, 2027",
    intro: "Our Data Processing Addendum (DPA) forms part of every university agreement.",
    sections: [
      ["Scope", "Processing of admitted-student data solely to deliver AfterAdmit on the university's instructions."],
      ["Sub-processors", "Hosting, email delivery and authentication providers, listed in our sub-processor register and updated with 30 days' notice."],
      ["Requests", "To receive a countersigned DPA, email legal@afteradmit.com."],
    ],
  },
  security: {
    updated: "May 1, 2027",
    intro: "Students trust universities with their futures. Universities trust us with their students.",
    sections: [
      ["Encryption", "TLS 1.2+ in transit and AES-256 at rest."],
      ["Access control", "Role-based access checks on every API endpoint, SSO and MFA for staff, and least-privilege production access."],
      ["Monitoring", "Continuous logging, alerting and annual third-party penetration testing."],
      ["Disclosure", "Found a vulnerability? Email security@afteradmit.com — we respond within one business day."],
    ],
  },
  accessibility: {
    updated: "May 1, 2027",
    intro: "AfterAdmit should work for every admitted student.",
    sections: [
      ["Standard", "We design to WCAG 2.2 AA: keyboard navigation, visible focus, sufficient contrast and screen-reader labels."],
      ["Feedback", "If something isn't accessible to you, email accessibility@afteradmit.com and we'll respond within two business days."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: legalPages[slug as LegalSlug] ?? "Legal" };
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  if (!(slug in legalPages)) notFound();
  const key = slug as LegalSlug;
  const page = content[key];

  return (
    <div className="bg-white">
      <SiteNav />
      <main className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 pb-24 pt-32 md:grid-cols-[220px_minmax(0,1fr)] md:px-8 md:pt-36">
        <aside className="min-w-0 md:sticky md:top-28 md:self-start">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Home
          </Link>
          <nav className="-mx-5 mt-6 flex gap-1 overflow-x-auto px-5 scrollbar-none md:mx-0 md:flex-col md:px-0">
            {Object.entries(legalPages).map(([s, label]) => (
              <Link
                key={s}
                href={`/legal/${s}`}
                className={`shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${s === key ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="min-w-0 max-w-[680px]">
          <div className="text-[13px] font-medium text-primary">Legal</div>
          <h1 className="mt-3 text-[36px] font-semibold leading-tight tracking-[-0.04em] text-ink md:text-[44px]">{legalPages[key]}</h1>
          <p className="mt-3 text-[13px] text-muted-foreground">Last updated {page.updated}</p>
          <p className="mt-8 text-[16px] leading-relaxed text-[#3f3f46]">{page.intro}</p>
          <div className="mt-10 space-y-8">
            {page.sections.map(([h, b]) => (
              <section key={h}>
                <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">{h}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{b}</p>
              </section>
            ))}
          </div>
          <div className="mt-14 rounded-2xl border p-5 text-[14px] text-muted-foreground">
            Questions about this page? Email <a href="mailto:legal@afteradmit.com" className="font-medium text-foreground underline-offset-4 hover:underline">legal@afteradmit.com</a>.
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
