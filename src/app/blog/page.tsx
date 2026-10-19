import type { Metadata } from "next";

import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";
import { BlogIndex } from "@/components/blog/blog-index";
import { posts, summarize } from "@/lib/blog";

const description = "Practical guides for admitted students and the admissions teams who support them — F-1 visas, housing, banking, roommates and preventing summer melt.";

export const metadata: Metadata = {
  title: "Journal — Guides from admit to arrival",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", title: "The AfterAdmit Journal", description, url: "/blog" },
  twitter: { card: "summary_large_image", title: "The AfterAdmit Journal", description },
};

export default function BlogPage() {
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date)).map(summarize);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The AfterAdmit Journal",
    description,
    url: "https://afteradmit.com/blog",
    publisher: { "@type": "Organization", name: "AfterAdmit", logo: { "@type": "ImageObject", url: "https://afteradmit.com/afteradmit-logo.svg" } },
    blogPost: list.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://afteradmit.com/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author.name },
    })),
  };

  return (
    <div className="bg-white">
      <SiteNav />
      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <header className="max-w-[720px]">
          <div className="text-[13px] font-medium text-primary">Journal</div>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[52px] md:text-[60px]">
            Guides from admit
            <br />
            <span className="text-[#A1A1AA]">to arrival.</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">{description}</p>
        </header>
        <BlogIndex posts={list} />
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
