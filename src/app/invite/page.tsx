"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Clock, MailCheck, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { school } from "@/lib/data";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

export default function InvitePage() {
  const router = useRouter();
  const [terms, setTerms] = React.useState(true);
  const [privacy, setPrivacy] = React.useState(true);

  return (
    <div className="min-h-screen bg-white">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" aria-label="AfterAdmit home" className="rounded-md">
          <Logo size="sm" />
        </Link>
        <Link href="/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
          Already have an account? <span className="text-foreground">Sign in</span>
        </Link>
      </header>

      <div className="mx-auto grid max-w-[1040px] gap-12 px-6 py-14 md:grid-cols-[1fr_400px] md:py-20">
        <div>
          <div className="inline-flex items-center gap-3 rounded-xl border px-4 py-3">
            <Image src={school.logo} alt={school.name} width={160} height={30} className="h-[26px] w-auto" priority />
          </div>
          <h1 className="mt-8 text-[36px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink">
            Congratulations, Sayali.
            <br />
            <span className="text-primary">Welcome to Anderson.</span>
          </h1>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground">
            {school.name} has partnered with AfterAdmit to guide you from today until you check in on campus — every deadline, form, and decision, personalized for you.
          </p>

          <dl className="mt-10 grid max-w-[480px] gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
            {[
              { icon: CalendarDays, k: "Intake", v: `${school.program} · ${school.term}` },
              { icon: Clock, k: "Program starts", v: "September 20, 2027" },
              { icon: MailCheck, k: "Invited as", v: "sayali.dhale@afteradmit.com" },
              { icon: ShieldCheck, k: "Invite expires", v: "in 12 days" },
            ].map((r) => (
              <div key={r.k} className="bg-white p-4">
                <dt className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <r.icon className="size-3.5" /> {r.k}
                </dt>
                <dd className="mt-1 text-[13.5px] font-medium">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border p-6 shadow-sm">
          <h2 className="text-[17px] font-semibold tracking-tight">Create your account</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Use the Google account you applied with, or set a password.</p>

          <Button variant="outline" size="lg" className="mt-6 w-full gap-2.5" onClick={() => router.push("/onboarding")}>
            <GoogleIcon /> Continue with Google
          </Button>
          <div className="my-5 flex items-center gap-3 text-[12px] text-subtle">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/onboarding");
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fn">First name</Label>
                <Input id="fn" defaultValue="Sayali" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ln">Last name</Label>
                <Input id="ln" defaultValue="D." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="em">Email</Label>
              <Input id="em" defaultValue="sayali.dhale@afteradmit.com" readOnly className="bg-muted/50 text-muted-foreground" />
              <p className="text-[11.5px] text-subtle">Verified against your university invite.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" defaultValue="supersecure" />
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            </div>
            <div className="space-y-2.5 pt-1">
              <label className="flex items-start gap-2.5 text-[12.5px] leading-snug text-muted-foreground">
                <Checkbox checked={terms} onCheckedChange={(v) => setTerms(!!v)} className="mt-px" />
                <span>
                  I agree to the <a className="font-medium text-foreground underline-offset-2 hover:underline" href="/legal/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                </span>
              </label>
              <label className="flex items-start gap-2.5 text-[12.5px] leading-snug text-muted-foreground">
                <Checkbox checked={privacy} onCheckedChange={(v) => setPrivacy(!!v)} className="mt-px" />
                <span>
                  I consent to the <a className="font-medium text-foreground underline-offset-2 hover:underline" href="/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. My school only sees aggregate progress.
                </span>
              </label>
            </div>
            <Button type="submit" variant="ink" size="lg" className="w-full" disabled={!terms || !privacy}>
              Create account <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
