import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}

export function PageHero({ eyebrow, title, muted, description, children, center }: { eyebrow: string; title: string; muted?: string; description: string; children?: React.ReactNode; center?: boolean }) {
  return (
    <header className={center ? "mx-auto max-w-[760px] text-center" : "max-w-[760px]"}>
      <div className="text-[13px] font-medium text-primary">{eyebrow}</div>
      <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[50px] md:text-[58px]">
        {title}
        {muted && <span className="block text-[#A1A1AA]">{muted}</span>}
      </h1>
      <p className={center ? "mx-auto mt-5 max-w-[560px] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]" : "mt-5 max-w-[580px] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]"}>{description}</p>
      {children}
    </header>
  );
}
