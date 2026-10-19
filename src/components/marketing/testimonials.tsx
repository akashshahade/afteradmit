import Image from "next/image";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type Review = { quote: string; name: string; route: string; program: string; photo: string };

const featured: Review = {
  quote: "AfterAdmit’s class space let me meet my section months early — I even found someone from Bogotá on my flight. I walked into orientation already feeling at home.",
  name: "Sofia Ramírez",
  route: "Bogotá → UCLA Anderson",
  program: "MBA ’29",
  photo: "/user4.webp",
};

const reviews: Review[] = [
  { quote: "My AfterAdmit roadmap put the I-20, SEVIS fee and visa interview in the right order, with dates. I never had to guess what came next.", name: "Emma Lindqvist", route: "Stockholm → Harvard Business School", program: "MBA ’29", photo: "/user1.webp" },
  { quote: "I posted my budget in AfterAdmit’s Roommates space and matched with two classmates in a week. We signed our lease together before any of us flew.", name: "Lucas Moreau", route: "Lyon → NYU Stern", program: "MBA ’29", photo: "/user2.webp" },
  { quote: "AfterAdmit reminded me a week before every deadline, so nothing slipped. Its housing checklist also flagged a listing that turned out to be a scam.", name: "Ji-woo Park", route: "Seoul → Stanford", program: "MS Computer Science ’28", photo: "/user5.avif" },
  {
    quote: "Through AfterAdmit’s marketplace I opened a US bank account without an SSN and got a student eSIM before I flew — both with perks I wouldn’t have found alone.",
    name: "James Whitaker",
    route: "London → Yale SOM",
    program: "MBA ’29",
    photo: "/user6.webp",
  },
];

const everyone = [featured, ...reviews];

function Stars({ size = "size-4" }: { size?: string }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn(size, "fill-[#F5A524] text-[#F5A524]")} aria-hidden />
      ))}
    </span>
  );
}

function Person({ r }: { r: Review }) {
  return (
    <figcaption className="flex items-center gap-3">
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
        <Image src={r.photo} alt={r.name} fill sizes="40px" className="object-cover" />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-ink">{r.name}</span>
        <span className="block text-[12.5px] leading-snug text-muted-foreground">
          {r.route} · {r.program}
        </span>
      </span>
    </figcaption>
  );
}

function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <figure className={cn("flex flex-col rounded-[20px] border bg-white p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(18,18,20,0.3)]", className)}>
      <Stars />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#3f3f46]">“{r.quote}”</blockquote>
      <div className="mt-6">
        <Person r={r} />
      </div>
    </figure>
  );
}

function RatingCard({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col justify-between overflow-hidden rounded-[20px] bg-ink p-6 text-white", className)}>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/30 blur-[80px]" />
      <div className="relative">
        <div className="flex items-baseline gap-2">
          <span className="tabular text-[52px] font-semibold leading-none tracking-[-0.04em]">4.9</span>
          <span className="text-[14px] text-white/50">/ 5</span>
        </div>
        <div className="mt-3">
          <Stars />
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-white/65">Average rating from 2,400+ admitted students across 40+ programs.</p>
      </div>
      <div className="relative mt-6 flex -space-x-2">
        {everyone.map((r) => (
          <span key={r.name} className="relative size-8 overflow-hidden rounded-full bg-white/10 ring-2 ring-ink">
            <Image src={r.photo} alt="" fill sizes="32px" className="object-cover" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const [emma, lucas, jiwoo, james] = reviews;

  return (
    <section aria-labelledby="stories" className="border-t py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="max-w-[640px]">
          <div className="text-[13px] font-medium text-primary">Student stories</div>
          <h2 id="stories" className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-ink md:text-[44px]">
            Students who&apos;ve made the move.
            <span className="block text-[#A1A1AA]">In their own words.</span>
          </h2>
        </div>

        <div className="mt-12 hidden grid-cols-3 gap-4 lg:grid">
          <ReviewCard r={featured} />
          <ReviewCard r={emma} />
          <RatingCard />
          <ReviewCard r={lucas} />
          <ReviewCard r={jiwoo} />
          <ReviewCard r={james} />
        </div>

        <div className="mt-8 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {everyone.map((r) => (
                <span key={r.name} className="relative size-8 overflow-hidden rounded-full bg-muted ring-2 ring-white">
                  <Image src={r.photo} alt="" fill sizes="32px" className="object-cover" />
                </span>
              ))}
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <Stars size="size-3.5" />
                <span className="text-[13.5px] font-semibold text-ink">4.9</span>
              </div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">from 2,400+ admitted students</div>
            </div>
          </div>
          <div className="-mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 scrollbar-none md:-mx-8 md:scroll-px-8 md:px-8">
            {everyone.map((r) => (
              <ReviewCard key={r.name} r={r} className="w-[85%] shrink-0 snap-start sm:w-[46%]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
