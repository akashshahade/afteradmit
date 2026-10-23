"use client";

import * as React from "react";
import { toast } from "sonner";
import { BookOpen, CalendarClock, ChevronDown, ExternalLink, Mail, MessageCircle, Search, Send, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { milestones } from "@/lib/data";
import { MyRequests } from "@/components/support/my-requests";

type Role = "student" | "admin" | "partner";
type Faq = { q: string; a: string };

const faqs: Record<Role, Faq[]> = {
  student: [
    { q: "How is my roadmap personalized?", a: "It's built from your onboarding answers — visa type, funding, housing and dependents — and dated from UCLA Anderson's Fall 2027 term. Change answers anytime in Profile → Journey answers; completed milestones are kept." },
    { q: "Can UCLA Anderson see my progress?", a: "Only aggregate progress for the whole class. The school never sees your individual milestones, posts, messages or which providers you clicked." },
    { q: "What happens when I click a provider?", a: "We open the provider's site in a new tab and record an anonymous click. Nothing is purchased in AfterAdmit and your contact details are never shared — you choose what to share with them." },
    { q: "A milestone doesn't apply to me. What do I do?", a: "Open the milestone and choose “Not applicable to me”. It's removed from your progress, and you can make it applicable again anytime." },
    { q: "Who do I ask about a deadline or my visa?", a: "Every milestone lists the right school office. For peer advice, ask in the F-1 & Visa or Anderson Fall '27 spaces." },
    { q: "Do I need AfterAdmit Plus?", a: "No. Everything on your roadmap is free through your school. Plus adds 1:1 advisor calls and document reviews." },
  ],
  admin: [
    { q: "How do I onboard a new university?", a: "Universities → Add university. Set branding and email domain, create the intake term and anchor dates, copy the master template, assign providers, then invite the school's admins." },
    { q: "Do template updates overwrite student progress?", a: "No. Pushing an update changes text, rules and dates, but every completed milestone stays completed." },
    { q: "How are leads counted?", a: "A lead is a click from a milestone or the marketplace to a provider's tracked URL. Leads are attributed to the milestone and school they came from." },
    { q: "Who can see individual student activity?", a: "Only AfterAdmit admins, and only pseudonymous IDs in lead exports. University admins see aggregates only." },
    { q: "How does moderation work?", a: "Reports land in Moderation → Mod queue. Approve, remove or ban from there; every action is recorded in the mod log." },
  ],
  partner: [
    { q: "How am I billed?", a: "Pay-per-lead at $18 per click-through, invoiced monthly. You can set a monthly cap in Billing." },
    { q: "Why is my listing “In review”?", a: "New listings and edits are checked by AfterAdmit before going live — usually within 1 business day." },
    { q: "Can I see who clicked my listing?", a: "No. Lead events are anonymous. Students choose what to share with you on your own site." },
    { q: "How do I appear on more milestones?", a: "Request placements when editing a listing. AfterAdmit decides final placement per university." },
    { q: "Can I post in the community?", a: "Only in spaces that allow partners, and posts are labelled with a Partner badge. Promotional posts may be removed." },
  ],
};

const guides: Record<Role, string[]> = {
  student: ["Getting started with your roadmap", "F-1 visa timeline, step by step", "Finding roommates through Spaces", "Using the marketplace safely"],
  admin: ["Launching a new intake term", "Writing visibility rules", "Exporting leads for billing", "Moderation guidelines"],
  partner: ["Writing a listing that converts", "Understanding lead reports", "Billing & invoices", "Partner community guidelines"],
};

const supportEmail = "info@afteradmit.com";

const shortcuts = [
  { k: "⌘ K", l: "Search anything" },
  { k: "⌘ B", l: "Collapse sidebar" },
  { k: "Esc", l: "Close dialogs and panels" },
];

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = React.useState(false);
  return (
    <li className="border-b last:border-0">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 py-3 text-left text-[13px] font-medium hover:text-foreground">
        <span className="flex-1">{faq.q}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-subtle transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <p className="pb-3.5 pr-6 text-[12.5px] leading-relaxed text-muted-foreground animate-in fade-in-0">{faq.a}</p>}
    </li>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">{children}</div>;
}

export function HelpSheet({ open, onOpenChange, role }: { open: boolean; onOpenChange: (o: boolean) => void; role: Role }) {
  const [q, setQ] = React.useState("");
  const [topic, setTopic] = React.useState("idea");
  const [message, setMessage] = React.useState("");

  const list = faqs[role].filter((f) => (f.q + f.a).toLowerCase().includes(q.trim().toLowerCase()));
  const contacts = Array.from(new Map(milestones.map((m) => [m.contact.name, m.contact])).values()).slice(0, 4);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle>Help &amp; support</SheetTitle>
          <SheetDescription>Answers, guides and a real person when you need one.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help" className="h-10 pl-9" />
          </div>

          <section>
            <SectionTitle>Your requests</SectionTitle>
            <MyRequests owner={role} limit={3} />
          </section>

          <section>
            <SectionTitle>Contact us</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {[
                { i: MessageCircle, l: "Live chat", d: "~2 min", on: () => toast("Connecting you to support…", { description: "A teammate will join shortly." }) },
                { i: Mail, l: "Email", d: "< 2 hours", on: () => { window.location.href = `mailto:${supportEmail}`; } },
                { i: CalendarClock, l: role === "student" ? "Book a call" : "Schedule call", d: role === "student" ? "Plus" : "15 min", on: () => toast("Opening scheduling") },
              ].map((c) => (
                <button key={c.l} onClick={c.on} className="flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 text-center transition-colors hover:border-[#d4d4d8] hover:bg-[#fcfcfc]">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <c.i className="size-4" />
                  </span>
                  <span className="text-[12.5px] font-medium">{c.l}</span>
                  <span className="text-[11px] text-muted-foreground">{c.d}</span>
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11.5px] text-muted-foreground">
              Support hours: Mon–Fri, 8am–8pm PT ·{" "}
              <a href={`mailto:${supportEmail}`} className="font-medium text-foreground underline-offset-4 hover:underline">{supportEmail}</a>
            </p>
          </section>

          <section>
            <SectionTitle>Frequently asked</SectionTitle>
            {list.length ? (
              <ul className="rounded-xl border px-4">
                {list.map((f) => (
                  <FaqItem key={f.q} faq={f} />
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed py-6 text-center text-[12.5px] text-muted-foreground">No answers for “{q}”. Try contacting us above.</div>
            )}
          </section>

          <section>
            <SectionTitle>Guides</SectionTitle>
            <ul className="space-y-0.5">
              {guides[role].map((g) => (
                <li key={g}>
                  <button onClick={() => toast("Opening guide", { description: g })} className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] transition-colors hover:bg-muted">
                    <BookOpen className="size-4 text-subtle group-hover:text-primary" />
                    <span className="flex-1">{g}</span>
                    <ExternalLink className="size-3.5 text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {role === "student" && (
            <section>
              <SectionTitle>Your school contacts</SectionTitle>
              <ul className="divide-y rounded-xl border">
                {contacts.map((c) => (
                  <li key={c.name} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">{c.name}</div>
                      <div className="truncate text-[11.5px] text-muted-foreground">{c.role}</div>
                    </div>
                    <Button variant="ghost" size="icon-xs" aria-label={`Email ${c.name}`} onClick={() => toast("Opening your email app", { description: c.email })}>
                      <Mail className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <SectionTitle>Send feedback</SectionTitle>
            <div className="space-y-2.5 rounded-xl border p-4">
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea or suggestion</SelectItem>
                  <SelectItem value="bug">Something isn&apos;t working</SelectItem>
                  <SelectItem value="content">Wrong or outdated information</SelectItem>
                  <SelectItem value="other">Something else</SelectItem>
                </SelectContent>
              </Select>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what's on your mind…" className="min-h-20" />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="ink"
                  disabled={!message.trim()}
                  onClick={() => {
                    setMessage("");
                    toast.success("Thanks for the feedback", { description: "Our team reads every message." });
                  }}
                >
                  <Send className="size-3.5" /> Send
                </Button>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Keyboard shortcuts</SectionTitle>
            <ul className="space-y-2">
              {shortcuts.map((s) => (
                <li key={s.k} className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">{s.l}</span>
                  <kbd className="rounded border bg-muted px-1.5 font-mono text-[11px] font-medium">{s.k}</kbd>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-3.5 text-[12px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" /> All systems operational
          </span>
          <span className="flex items-center gap-1 text-subtle">
            <ShieldCheck className="size-3.5" /> v1.0 · Privacy · Terms
          </span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
