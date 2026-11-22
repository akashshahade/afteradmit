"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CalendarDays, Check, Clock, Eye, EyeOff, MailCheck, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { daysUntil, type InviteRecord } from "@/lib/invites";
import { isPasswordStrong, PASSWORD_RULES, passwordChecks, passwordScore } from "@/lib/password";
import { cn } from "@/lib/utils";

function InviteBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [invite, setInvite] = React.useState<InviteRecord | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = React.useState(Boolean(token));

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [terms, setTerms] = React.useState(true);
  const [privacy, setPrivacy] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setLoadingInvite(false);
      setLoadError("This invite link is missing a token. Ask your school to resend your invite.");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadingInvite(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_invite_by_token", {
          invite_token: token,
        });
        if (error) throw error;
        const row = (Array.isArray(data) ? data[0] : data) as InviteRecord | undefined;
        if (!row) {
          if (!cancelled) setLoadError("Invite not found. Ask your school to resend your invite.");
          return;
        }
        if (row.status !== "pending") {
          if (!cancelled) {
            setLoadError(
              row.status === "accepted"
                ? "This invite was already used. Sign in instead."
                : "This invite has expired. Ask your school to resend it.",
            );
            setInvite(row);
          }
          return;
        }
        if (!cancelled) {
          setInvite(row);
          setFirstName(row.first_name || "");
          setLastName(row.last_name || "");
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string"
                ? (err as { message: string }).message
                : "Could not load invite";
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoadingInvite(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite || invite.status !== "pending") return;
    if (!terms || !privacy) {
      toast.error("Accept the terms and privacy policy");
      return;
    }
    if (!isPasswordStrong(password)) {
      toast.error("Choose a stronger password", {
        description: "Use 8+ characters with upper, lower, number, and a symbol.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            invite_token: token,
          },
        },
      });
      if (error) throw error;

      if (!data.session) {
        // Fallback if project still requires email confirmation
        toast.success("Check your email to confirm", {
          description: "Then sign in to continue onboarding.",
        });
        router.replace("/login");
        return;
      }

      const { error: acceptError } = await supabase.rpc("accept_invite", {
        invite_token: token,
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
      });
      if (acceptError) throw acceptError;

      toast.success("Account created");
      router.replace("/onboarding");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInvite) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-[13px] text-muted-foreground">
        Loading your invite…
      </div>
    );
  }

  if (!invite || loadError) {
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
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="text-[24px] font-semibold tracking-tight text-ink">Invite unavailable</h1>
          <p className="mt-3 text-[14px] text-muted-foreground">{loadError}</p>
          <Button asChild variant="ink" className="mt-8">
            <Link href="/login">Go to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  const expiresIn = daysUntil(invite.expires_at);
  const programStart = invite.program_start
    ? new Date(invite.program_start + "T00:00:00").toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";

  return (
    <div className="flex min-h-dvh flex-col bg-white lg:h-dvh lg:overflow-hidden">
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-5 sm:px-6">
        <Link href="/" aria-label="AfterAdmit home" className="rounded-md">
          <Logo size="sm" />
        </Link>
        <Link href="/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
          Already have an account? <span className="text-foreground">Sign in</span>
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-[1040px] flex-1 content-center gap-8 px-5 py-6 sm:px-6 md:grid-cols-[1fr_380px] md:gap-10 md:py-8 lg:items-center lg:overflow-hidden">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-3 rounded-xl border px-3 py-2">
            <Image src="/ucla-anderson.svg" alt={invite.school_name} width={160} height={30} className="h-[22px] w-auto" priority />
          </div>
          <h1 className="mt-4 text-[28px] font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-[32px]">
            Congratulations{invite.first_name ? `, ${invite.first_name}` : ""}.
            <br />
            <span className="text-primary">Welcome to {invite.school_short}.</span>
          </h1>
          <p className="mt-2.5 max-w-[460px] text-[13.5px] leading-relaxed text-muted-foreground">
            {invite.school_name} partnered with AfterAdmit to guide you from admit to arrival — deadlines, forms, and decisions in one place.
          </p>

          <dl className="mt-5 grid max-w-[460px] gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
            {[
              { icon: CalendarDays, k: "Intake", v: `${invite.program} · ${invite.intake}` },
              { icon: Clock, k: "Program starts", v: programStart },
              { icon: MailCheck, k: "Invited as", v: invite.email },
              { icon: ShieldCheck, k: "Invite expires", v: expiresIn ? `in ${expiresIn} days` : "soon" },
            ].map((r) => (
              <div key={r.k} className="bg-white px-3.5 py-2.5">
                <dt className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <r.icon className="size-3.5" /> {r.k}
                </dt>
                <dd className="mt-0.5 truncate text-[13px] font-medium">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border p-5 shadow-sm">
          <h2 className="text-[16px] font-semibold tracking-tight">Create your account</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">Set a password with your invited email.</p>

          <form className="mt-4 space-y-3" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="fn">First name</Label>
                <Input id="fn" className="h-9" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ln">Last name</Label>
                <Input id="ln" className="h-9" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="em">Email</Label>
              <Input id="em" className="h-9 bg-muted/50 text-muted-foreground" value={invite.email} readOnly />
              <p className="text-[11px] text-subtle">Verified against your university invite.</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="pw">Password</Label>
              <div className="relative">
                <Input
                  id="pw"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-9 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-subtle hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((i) => {
                  const score = passwordScore(password);
                  return (
                    <span
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        score >= i ? (score >= 5 ? "bg-success" : score >= 3 ? "bg-primary" : "bg-warning") : "bg-muted",
                      )}
                    />
                  );
                })}
              </div>
              <ul className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => {
                  const ok = passwordChecks(password)[rule.key];
                  return (
                    <li
                      key={rule.key}
                      className={cn(
                        "flex items-center gap-1.5 text-[11.5px]",
                        ok ? "text-success" : "text-muted-foreground",
                      )}
                    >
                      <Check className={cn("size-3", ok ? "opacity-100" : "opacity-30")} strokeWidth={3} />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="space-y-2 pt-0.5">
              <label className="flex items-start gap-2 text-[12px] leading-snug text-muted-foreground">
                <Checkbox checked={terms} onCheckedChange={(v) => setTerms(!!v)} className="mt-px" />
                <span>
                  I agree to the{" "}
                  <a className="font-medium text-foreground underline-offset-2 hover:underline" href="/legal/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>
                </span>
              </label>
              <label className="flex items-start gap-2 text-[12px] leading-snug text-muted-foreground">
                <Checkbox checked={privacy} onCheckedChange={(v) => setPrivacy(!!v)} className="mt-px" />
                <span>
                  I consent to the{" "}
                  <a className="font-medium text-foreground underline-offset-2 hover:underline" href="/legal/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  . My school only sees aggregate progress.
                </span>
              </label>
            </div>
            <Button
              type="submit"
              variant="ink"
              size="lg"
              className="w-full"
              disabled={!terms || !privacy || submitting || !isPasswordStrong(password)}
            >
              {submitting ? "Creating account…" : "Create account"}
              {!submitting && <ArrowRight className="size-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-white text-[13px] text-muted-foreground">Loading…</div>
      }
    >
      <InviteBody />
    </React.Suspense>
  );
}
