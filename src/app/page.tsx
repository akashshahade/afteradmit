import type { Metadata } from "next";

import { SiteNav } from "@/components/marketing/site-nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";

export const metadata: Metadata = {
  title: "AfterAdmit — From admit to arrival",
  description: "A personalized roadmap for every admitted student — visas, funding, housing and classmates — so they arrive ready on day one.",
};

export default function LandingPage() {
  return (
    <div className="bg-white">
      <SiteNav />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
