"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#schools", label: "For schools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200", scrolled ? "border-b bg-white/85 backdrop-blur-md" : "border-b border-transparent")}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center px-5 md:px-8">
        <Link href="/" aria-label="AfterAdmit home">
          <Logo size="sm" />
        </Link>
        <nav className="ml-12 hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="ink" size="sm" className="rounded-full px-4">
            <Link href="/contact?topic=university">
              Book a demo <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon-sm" className="ml-auto md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[300px] p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo size="sm" />
          <nav className="mt-8 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 text-[15px] font-medium hover:bg-muted">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild variant="ink" size="lg">
              <Link href="/contact?topic=university" onClick={() => setOpen(false)}>
                Book a demo
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
