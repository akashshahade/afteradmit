import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";
import { ArticleBody } from "@/components/blog/article-body";
import { AuthorAvatar, PostCard } from "@/components/blog/post-card";
import { ReadingProgress, ShareButtons, TableOfContents } from "@/components/blog/article-tools";
import { authors, formatDate, getPost, headingId, posts, readMinutes, relatedPosts, summarize } from "@/lib/blog";

export const instant = false;

const SITE = "https://afteradmit.com";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  const author = authors[post.author];
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: author.name }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [author.name],
      tags: post.tags,
      images: [{ url: post.cover, alt: post.coverAlt }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.cover] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = authors[post.author];
  const minutes = readMinutes(post);
  const toc = post.body.filter((b) => b.type === "h2").map((b) => ({ id: headingId(b.text), text: b.text }));
  const related = relatedPosts(post).map(summarize);
  const forSchools = post.category === "For schools";
  const image = post.cover.startsWith("http") ? post.cover : `${SITE}${post.cover}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { "@type": "Person", name: author.name, jobTitle: author.role },
      publisher: { "@type": "Organization", name: "AfterAdmit", logo: { "@type": "ImageObject", url: `${SITE}/afteradmit-logo.svg` } },
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
      keywords: post.tags.join(", "),
      articleSection: post.category,
      timeRequired: `PT${minutes}M`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${SITE}/blog/${post.slug}` },
      ],
    },
  ];

  return (
    <div className="bg-white">
      <ReadingProgress />
      <SiteNav />
      <main className="pb-24 pt-28 md:pt-36">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <article>
          <header className="mx-auto max-w-[800px] px-5 md:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Link href="/blog" className="transition-colors hover:text-foreground">
                Journal
              </Link>
              <ChevronRight className="size-3.5 text-subtle" />
              <span className={forSchools ? "font-medium text-ink" : "font-medium text-primary"}>{post.category}</span>
            </nav>
            <h1 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[36px] md:text-[42px]">{post.title}</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">{post.description}</p>
            <div className="mt-8 flex items-center justify-between gap-3 border-y py-4">
              <div className="flex min-w-0 items-center gap-3">
                <AuthorAvatar author={author} size={40} />
                <div className="min-w-0 leading-tight">
                  <div className="text-[14px] font-semibold text-ink">{author.name}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted-foreground sm:text-[13px]">
                    <span className="hidden sm:inline">{author.role} · </span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time> · {minutes} min read
                  </div>
                </div>
              </div>
              <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
            </div>

            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 sm:aspect-[21/9] md:mt-10 md:rounded-[20px]">
              <Image src={post.cover} alt={post.coverAlt} fill loading="eager" sizes="(min-width: 800px) 736px, 100vw" className="object-cover" />
            </div>
          </header>

          <div className="mx-auto mt-10 grid max-w-[1120px] grid-cols-1 gap-12 px-5 md:mt-14 md:px-8 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-center lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents items={toc} />
              </div>
            </aside>

            <div className="min-w-0">
              <section aria-label="Key takeaways" className="mb-12 rounded-2xl border p-5 sm:p-6">
                <h2 className="text-[13px] font-medium uppercase tracking-[0.08em] text-subtle">Key takeaways</h2>
                <ul className="mt-4 space-y-3">
                  {post.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 text-[15.5px] leading-relaxed text-ink">
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              <ArticleBody blocks={post.body} />

              <div className="mt-14 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-[12.5px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-5 rounded-2xl border p-6 sm:flex-row sm:items-start">
                <AuthorAvatar author={author} size={52} />
                <div className="min-w-0">
                  <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-subtle">Written by</div>
                  <div className="mt-1 text-[16px] font-semibold text-ink">{author.name}</div>
                  <div className="text-[13px] text-muted-foreground">{author.role}, AfterAdmit</div>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{author.bio}</p>
                </div>
              </div>

              <div className="relative mt-10 overflow-hidden rounded-2xl bg-ink p-7 sm:p-8">
                <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/30 blur-[90px]" />
                <div className="relative">
                  <div className="text-[19px] font-semibold tracking-[-0.02em] text-white sm:text-[21px]">
                    {forSchools ? "See where your incoming class is stuck." : "Every step, dated and in order."}
                  </div>
                  <p className="mt-2 max-w-[440px] text-[14.5px] leading-relaxed text-white/60">
                    {forSchools
                      ? "AfterAdmit gives every admit a personal roadmap — and gives your team aggregate visibility into the whole class."
                      : "AfterAdmit turns everything in this guide into a personal roadmap with reminders. Ask your school if it's available for your class."}
                  </p>
                  <Button asChild size="lg" className="mt-6 rounded-full px-5">
                    <Link href={forSchools ? "/contact?topic=university" : "/login"}>
                      {forSchools ? "Book a demo" : "I have an invite"} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mx-auto mt-24 max-w-[1200px] border-t px-5 pt-16 md:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related" className="text-[26px] font-semibold tracking-[-0.03em] text-ink sm:text-[30px]">
                Keep reading
              </h2>
              <Link href="/blog" className="hidden items-center gap-1 text-[14px] font-medium text-ink hover:underline sm:flex">
                All articles <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
