"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Check, GraduationCap, Handshake, Landmark, Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const topics = [
  { id: "university", label: "University", icon: Landmark, org: "University", orgPlaceholder: "e.g. UCLA Anderson", message: "Tell us about your incoming class and timeline." },
  { id: "student", label: "Student", icon: GraduationCap, org: "School you're joining", orgPlaceholder: "e.g. UCLA Anderson", message: "How can we help?" },
  { id: "partner", label: "Partner", icon: Handshake, org: "Company", orgPlaceholder: "e.g. Northbridge Student Loans", message: "What do you offer admitted students?" },
  { id: "press", label: "Press", icon: Newspaper, org: "Publication", orgPlaceholder: "e.g. Inside Higher Ed", message: "What's your story about, and your deadline?" },
] as const;

type TopicId = (typeof topics)[number]["id"];

const field = "h-11 rounded-xl text-[16px] sm:text-[14px]";

function ContactFormInner() {
  const params = useSearchParams();
  const initial = topics.some((t) => t.id === params.get("topic")) ? (params.get("topic") as TopicId) : "university";
  const [topicId, setTopicId] = React.useState<TopicId>(initial);
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const topic = topics.find((t) => t.id === topicId)!;

  if (sentTo) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[24px] border bg-white p-8 text-center animate-in fade-in-0 duration-500">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
          <Check className="size-5" strokeWidth={3} />
        </span>
        <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-ink">Thanks, {sentTo}.</h2>
        <p className="mt-2 max-w-[340px] text-[15px] leading-relaxed text-muted-foreground">We&apos;ve got your message and will reply within one business day.</p>
        <Button variant="outline" className="mt-7 rounded-full px-5" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="rounded-[24px] border bg-white p-5 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const name = String(new FormData(e.currentTarget).get("name") ?? "").trim().split(" ")[0];
        setSentTo(name || "there");
        toast.success("Message sent", { description: "We'll reply within one business day." });
      }}
    >
      <fieldset>
        <legend className="text-[14px] font-semibold text-ink">I&apos;m reaching out as a…</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {topics.map(({ id, label, icon: Icon }) => {
            const on = id === topicId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setTopicId(id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                  on ? "border-ink bg-ink text-white" : "text-muted-foreground hover:border-ink/25 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Jordan Lee" className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{topicId === "university" ? "Work email" : "Email"}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="org">{topic.org}</Label>
          <Input id="org" name="org" required placeholder={topic.orgPlaceholder} className={field} />
        </div>
        {topicId === "university" ? (
          <div className="space-y-2">
            <Label htmlFor="size">Incoming class size</Label>
            <Select name="size" defaultValue="100-500">
              <SelectTrigger id="size" className={cn(field, "w-full")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lt-100">Under 100</SelectItem>
                <SelectItem value="100-500">100 – 500</SelectItem>
                <SelectItem value="500-1000">500 – 1,000</SelectItem>
                <SelectItem value="gt-1000">1,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="role">{topicId === "student" ? "Program" : "Your role"}</Label>
            <Input id="role" name="role" placeholder={topicId === "student" ? "e.g. MBA, Fall '27" : "e.g. Head of Partnerships"} className={field} />
          </div>
        )}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" required rows={5} placeholder={topic.message} className="min-h-[132px] rounded-xl text-[16px] sm:text-[14px]" />
        </div>
      </div>

      {topicId === "student" && (
        <p className="mt-5 rounded-xl bg-[#FAFAFA] px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          Need help with your roadmap? The{" "}
          <Link href="/help" className="font-medium text-ink underline underline-offset-4">
            Help center
          </Link>{" "}
          is the fastest way to an answer.
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] leading-relaxed text-subtle">
          By sending, you agree to our{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">
            privacy policy
          </Link>
          .
        </p>
        <Button type="submit" variant="ink" size="xl" className="h-12 w-full rounded-full px-6 sm:w-auto">
          {topicId === "university" ? "Request a demo" : "Send message"} <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}

export function ContactForm() {
  return (
    <React.Suspense fallback={<div className="min-h-[560px] rounded-[24px] border bg-white" />}>
      <ContactFormInner />
    </React.Suspense>
  );
}
