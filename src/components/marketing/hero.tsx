import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductShot } from "@/components/marketing/product-shot";

const schoolLogos = [
  { src: "/ucla-anderson.svg", alt: "UCLA Anderson School of Management", w: 149, h: 28 },
  { src: "/logos/harvard.svg", alt: "Harvard University", w: 124, h: 34 },
  { src: "/logos/stanford.svg", alt: "Stanford University", w: 115, h: 24 },
  { src: "/logos/nyu.svg", alt: "New York University", w: 88, h: 30 },
  { src: "/logos/yale.svg", alt: "Yale University", w: 60, h: 26 },
];

function LogoMarquee() {
  // Each copy holds the set twice so it's always wider than the viewport; two copies make the loop seamless.
  const set = [...schoolLogos, ...schoolLogos];
  return (
    <div className="group relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
            {set.map((l, i) => (
              <li key={i} className="shrink-0">
                <Image
                  src={l.src}
                  alt={copy === 0 && i < schoolLogos.length ? l.alt : ""}
                  width={l.w}
                  height={l.h}
                  className="opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-32 md:pb-14 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,black,transparent)]"
        style={{
          backgroundImage: "linear-gradient(to right, #EEEEF0 1px, transparent 1px), linear-gradient(to bottom, #EEEEF0 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-5 text-center md:px-8">
        <Link
          href="/#schools"
          className="inline-flex items-center gap-2 rounded-full border bg-white/80 py-1 pl-1 pr-3 text-[12.5px] font-medium text-muted-foreground shadow-xs backdrop-blur transition-colors hover:text-foreground animate-in fade-in-0 slide-in-from-bottom-1 duration-700"
        >
          <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] text-white">New</span>
          Live with UCLA Anderson<span className="hidden sm:inline">&nbsp;for Fall &apos;27</span>
          <ArrowRight className="size-3.5" />
        </Link>

        <h1 className="mx-auto mt-6 max-w-[880px] text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:text-[60px] md:text-[76px]">
          From admit to arrival.
          <br />
          <span className="text-[#A1A1AA]">One clear path.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-relaxed text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-700 md:text-[17px]">
          A personalized roadmap for every admitted student — visas, funding, housing and classmates — so they arrive ready on day one.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
          <Button asChild variant="ink" size="xl" className="h-12 w-full rounded-full px-6 sm:w-auto">
            <Link href="/contact?topic=university">
              Book a demo <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="h-12 w-full rounded-full px-6 sm:w-auto">
            <Link href="/invite">I have an invite</Link>
          </Button>
        </div>

        <div className="mt-16 md:mt-20">
          <p className="text-[12.5px] text-muted-foreground">Helping admitted students arrive ready at</p>
          <LogoMarquee />
        </div>

        <div className="mt-14 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 md:mt-16">
          <ProductShot />
        </div>
      </div>
    </section>
  );
}
