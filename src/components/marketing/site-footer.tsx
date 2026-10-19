"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Heart } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { legalPages } from "@/components/marketing/assets";

const columns = [
  {
    title: "Product",
    links: [
      ["For students", "/login"],
      ["For universities", "/#schools"],
      ["For partners", "/login"],
      ["Pricing", "/pricing"],
      ["Security", "/legal/security"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Careers", "/careers"],
      ["Press", "/contact?topic=press"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Help center", "/help"],
      ["Blog", "/blog"],
    ],
  },
  {
    title: "Legal",
    links: Object.entries(legalPages).map(([slug, label]) => [label, `/legal/${slug}`]),
  },
];

function Social({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-ink hover:bg-ink hover:text-white">
      {children}
    </a>
  );
}

export function SiteFooter() {
  const [email, setEmail] = React.useState("");
  return (
    <footer className="relative overflow-hidden border-t bg-white">
      <div className="mx-auto max-w-[1200px] px-5 pt-16 md:px-8 md:pt-20">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-muted-foreground">The admit-to-arrival platform for universities and the students they admit.</p>
            <form
              className="mt-6 flex max-w-[340px] items-center gap-1 rounded-full border bg-white p-1 shadow-xs focus-within:border-primary/50 focus-within:ring-[3px] focus-within:ring-primary/10"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim()) return;
                setEmail("");
                toast.success("You're on the list", { description: "One short update a month. Unsubscribe anytime." });
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                aria-label="Email address"
                className="h-9 min-w-0 flex-1 bg-transparent px-3.5 text-[13.5px] outline-none placeholder:text-subtle"
              />
              <button type="submit" className="flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-white transition-colors hover:bg-ink-hover">
                Subscribe <ArrowRight className="size-3.5" />
              </button>
            </form>
            <p className="mt-2.5 text-[11.5px] text-subtle">Product updates for admissions teams. No spam.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-[13px] font-semibold text-ink">{col.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
            <span>© 2027 AfterAdmit, Inc.</span>
            <span className="flex items-center gap-1.5">
              Made with <Heart className="size-3.5 fill-primary text-primary" aria-label="love" /> in Los Angeles
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Social label="AfterAdmit on X" href="https://x.com/afteradmit">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Social>
            <Social label="AfterAdmit on LinkedIn" href="https://www.linkedin.com/company/afteradmit">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </Social>
            <Social label="AfterAdmit on Instagram" href="https://www.instagram.com/afteradmit">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
            </Social>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <div className="mx-auto -mb-[3.5vw] max-w-[1400px] bg-gradient-to-b from-[#EDEDF0] to-white bg-clip-text text-center text-[19vw] font-semibold leading-none tracking-[-0.06em] text-transparent">
          AfterAdmit
        </div>
      </div>
    </footer>
  );
}
