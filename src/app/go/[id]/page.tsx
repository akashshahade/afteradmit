import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Gift, Star } from "lucide-react";

import { PartnerOfferForm } from "@/components/site/partner-offer-form";
import { providers } from "@/lib/data";

export const instant = false;

export function generateStaticParams() {
  return providers.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/go/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = providers.find((x) => x.id === id);
  return { title: p ? `${p.name} — Student offer` : "Partner", robots: { index: false, follow: false } };
}

export default async function PartnerOfferPage({ params }: PageProps<"/go/[id]">) {
  const { id } = await params;
  const p = providers.find((x) => x.id === id);
  if (!p) notFound();

  return (
    <div className="min-h-dvh bg-[#FAFAFA]">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center gap-3 px-5 md:px-8">
          <span className="flex size-9 items-center justify-center rounded-lg text-[12px] font-bold text-white" style={{ background: p.color }}>
            {p.initials}
          </span>
          <span className="text-[15px] font-semibold">{p.name}</span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] text-muted-foreground sm:flex">
            <BadgeCheck className="size-3.5 text-success" /> Referred by AfterAdmit
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1040px] grid-cols-1 gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="text-[13px] font-medium" style={{ color: p.color }}>
            {p.category}
          </div>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink md:text-[44px]">{p.tagline}</h1>
          <p className="mt-5 max-w-[560px] text-[16.5px] leading-relaxed text-muted-foreground">{p.description}</p>
          <div className="mt-6 flex items-center gap-2 text-[13.5px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={i < Math.round(p.rating) ? "size-4 fill-[#F5A524] text-[#F5A524]" : "size-4 text-[#E4E4E7]"} />
              ))}
            </span>
            <span className="font-medium text-ink">{p.rating}</span> · {p.reviews.toLocaleString("en-US")} student reviews
          </div>
          {p.perk && (
            <div className="mt-8 flex max-w-[560px] items-start gap-3 rounded-2xl border bg-white p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Gift className="size-4" />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold">AfterAdmit student offer</div>
                <div className="mt-0.5 text-[14px] text-muted-foreground">{p.perk}</div>
                {p.code && (
                  <div className="mt-2 inline-flex rounded-md border border-dashed px-2 py-0.5 font-mono text-[12.5px] font-semibold">{p.code}</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <PartnerOfferForm partner={p.name} color={p.color} />
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-[1040px] flex-col gap-2 px-5 py-6 text-[12.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>
            © 2027 {p.name}. Independent partner of AfterAdmit.
          </span>
          <Link href="/student/marketplace" className="font-medium text-ink hover:underline">
            ← Back to AfterAdmit
          </Link>
        </div>
      </footer>
    </div>
  );
}
