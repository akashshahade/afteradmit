import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section id="contact" className="scroll-mt-20 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-ink">
          {/* Phone: photo band on top, fading down into the card */}
          <div className="relative h-56 [mask-image:linear-gradient(to_bottom,black_45%,transparent)] sm:h-72 md:hidden">
            <Image src="/students1.webp" alt="Graduates throwing their caps in the air" fill sizes="100vw" className="object-cover object-[center_35%] brightness-90 saturate-[0.85]" />
          </div>

          {/* Desktop: photo bleeds off the right edge, fading left into the card */}
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-[62%] [mask-image:linear-gradient(to_left,black_40%,transparent)] md:block">
            <Image src="/students1.webp" alt="Graduates throwing their caps in the air" fill sizes="(min-width: 1200px) 740px, 62vw" className="object-cover object-[center_40%] brightness-90 saturate-[0.85]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30" />
          </div>

          <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 -z-10 hidden size-[460px] rounded-full bg-primary/30 blur-[120px] md:block" />

          <div className="relative px-7 pb-9 pt-2 sm:px-10 sm:pb-12 md:flex md:min-h-[420px] md:max-w-[560px] md:flex-col md:justify-center md:px-14 md:py-16">
            <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-[48px]">
              You got in.
              <br />
              <span className="text-white/45">Now let&apos;s get you there.</span>
            </h2>
            <p className="mt-5 max-w-[420px] text-[15.5px] leading-relaxed text-white/65">
              Your visa, housing, money and classmates — in one personal plan, dated to your school&apos;s deadlines.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" className="h-12 rounded-full px-6">
                <Link href="/invite">
                  I have an invite <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white backdrop-blur hover:bg-white/10 hover:text-white">
                <Link href="/contact?topic=student">Ask for my school</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
