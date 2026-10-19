import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/student", "/admin", "/partner", "/onboarding", "/invite", "/go"] },
    sitemap: "https://afteradmit.com/sitemap.xml",
  };
}
