import type { Metadata } from "next";

import { PageHero, PageShell } from "@/components/marketing/page-shell";
import { HelpCenter } from "@/components/site/help-center";
import { helpArticles } from "@/lib/help-data";

export const metadata: Metadata = {
  title: "Help center",
  description: "Answers for admitted students, universities and partners using AfterAdmit — invites, roadmaps, visas, community, class insights and billing.",
};

export default function HelpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: helpArticles.map((a) => ({ "@type": "Question", name: a.q, acceptedAnswer: { "@type": "Answer", text: a.a } })),
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <PageHero center eyebrow="Help center" title="How can we help?" description="Answers for students, universities and partners. Search, or pick a topic below." />
        <HelpCenter />
      </section>
    </PageShell>
  );
}
