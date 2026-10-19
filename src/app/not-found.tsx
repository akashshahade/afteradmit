import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = { title: "Page not found" };

const links = [
  { href: "/blog", label: "Journal", body: "Guides on visas, housing and money" },
  { href: "/help", label: "Help center", body: "Answers for students and schools" },
  { href: "/contact", label: "Contact", body: "Talk to a real person" },
];

export default function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[720px] px-5 pb-24 pt-36 text-center md:px-8 md:pt-44">
        <div className="tabular text-[13px] font-medium text-primary">Error 404</div>
        <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[52px]">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-5 max-w-[460px] text-[16px] leading-relaxed text-muted-foreground">The link may be broken, or the page may have moved. Let&apos;s get you back on the path.</p>
        <Button asChild variant="ink" size="xl" className="mt-8 h-12 rounded-full px-6">
          <Link href="/">
            Back to home <ArrowRight className="size-4" />
          </Link>
        </Button>
        <div className="mt-14 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-2xl border p-5 transition-colors hover:border-ink/20 hover:bg-[#FAFAFA]">
              <div className="flex items-center justify-between text-[14.5px] font-semibold text-ink">
                {l.label}
                <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">{l.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
