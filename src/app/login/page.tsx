"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, Store, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const demoAccounts = [
  { key: "student", label: "Student", name: "Sayali Dhale", email: "sayali.dhale@afteradmit.com", href: "/student", icon: GraduationCap, desc: "UCLA Anderson · MBA Fall '27" },
  { key: "admin", label: "AfterAdmit Admin", name: "Jordan Lee", email: "jordan@afteradmit.com", href: "/admin", icon: ShieldCheck, desc: "Universities, content, leads" },
  { key: "partner", label: "Partner", name: "Elena Ruiz", email: "elena@westwoodcommons.com", href: "/partner", icon: Store, desc: "Westwood Commons · Housing" },
] as const;

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

function PreviewPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col">
      <Image src="/login1.avif" alt="Admitted students on campus" fill loading="eager" sizes="55vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="relative mt-auto px-14 pb-14 xl:px-20">
        <div className="max-w-[480px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[12px] font-medium text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Fall 2027 cohort is live
          </div>
          <h2 className="mt-5 text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
            From admit to arrival,
            <br />
            <span className="text-white/55">one clear path.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            A personalized roadmap for every admitted student — deadlines, guidance, vetted providers, and your future classmates in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<(typeof demoAccounts)[number]["key"]>("student");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const account = demoAccounts.find((a) => a.key === selected)!;

  const signIn = (href: string) => {
    setLoading(true);
    setTimeout(() => router.push(href), 450);
  };

  return (
    <div className="grid min-h-dvh bg-white lg:h-dvh lg:grid-cols-[1.1fr_minmax(480px,1fr)] lg:overflow-hidden">
      <PreviewPanel />
      <div className="flex flex-col px-5 py-5 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="AfterAdmit home" className="rounded-md">
            <Logo />
          </Link>
          <span className="text-[13px] text-muted-foreground">
            <span className="hidden sm:inline">New here? </span>
            <Link href="/invite" className="font-medium text-foreground hover:text-primary">
              Accept your invite
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center py-8">
          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">Welcome back</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Sign in to continue your journey.</p>

          <div className="mt-6 space-y-1.5">
            <Label>Demo account</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-12 w-full items-center gap-3 rounded-xl border bg-white px-2.5 text-left shadow-xs outline-none transition-colors hover:border-[#d4d4d8] focus-visible:ring-[3px] focus-visible:ring-primary/12 data-[state=open]:border-primary/50">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
                    <account.icon className="size-3.5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[13px] font-semibold">{account.label}</span>
                    <span className="block truncate text-[11.5px] text-muted-foreground">{account.desc}</span>
                  </span>
                  <ChevronsUpDown className="size-4 text-subtle" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                {demoAccounts.map((a) => (
                  <DropdownMenuItem key={a.key} onSelect={() => setSelected(a.key)} className="gap-3 py-2">
                    <span className={cn("flex size-7 items-center justify-center rounded-lg", a.key === selected ? "bg-primary text-white" : "bg-muted")}>
                      <a.icon className={cn("size-3.5", a.key === selected && "!text-white")} strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-[13px] font-medium">{a.label}</span>
                      <span className="block truncate text-[11.5px] text-muted-foreground">{a.desc}</span>
                    </span>
                    {a.key === selected && <Check className="!text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="my-5 h-px bg-border" />

          <form
            className="space-y-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              signIn(account.href);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={account.email} readOnly className="h-10" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => toast.success("Password reset link sent", { description: `Check ${account.email}` })}
                  className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} defaultValue="demo-password" className="h-10 pr-10" />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-subtle hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="ink" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : `Sign in as ${account.label}`}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full gap-2.5" onClick={() => signIn(account.href)}>
              <GoogleIcon /> Continue with Google
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-between text-[12px] text-subtle">
          <span>© 2027 AfterAdmit, Inc.</span>
          <div className="flex gap-4">
            <Link className="hover:text-foreground" href="/legal/privacy">Privacy</Link>
            <Link className="hover:text-foreground" href="/legal/terms">Terms</Link>
            <Link className="hover:text-foreground" href="/help">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
