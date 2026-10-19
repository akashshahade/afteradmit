import type { MetadataRoute } from "next";

import { legalPages } from "@/components/marketing/assets";
import { posts } from "@/lib/blog";
import { jobs } from "@/lib/careers";

const SITE = "https://afteradmit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/careers`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE}/help`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((p) => ({ url: `${SITE}/blog/${p.slug}`, lastModified: p.updated ?? p.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...jobs.map((j) => ({ url: `${SITE}/careers/${j.slug}`, lastModified: j.posted, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...Object.keys(legalPages).map((slug) => ({ url: `${SITE}/legal/${slug}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
