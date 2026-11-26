"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { friendlyAuthError } from "@/components/auth/forgot-password-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordStrong } from "@/lib/password";
import { createClient } from "@/lib/supabase/client";

function loginPathFor(from: string | null) {
  switch (from) {
    case "university":
      return "/university/login";
    case "partner":
      return "/partner/login";
    case "admin":
      return "/admin/login";
    default:
      return "/login";
  }
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const urlError = searchParams.get("error");
  const backHref = loginPathFor(from);

  const [checking, setChecking] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const supabase = createClient();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setChecking(false);
      }
    });

    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setHasSession(Boolean(data.session));
      } catch {
        if (!active) return;
        setHasSession(false);
      } finally {
        if (active) setChecking(false);
      }
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong(password)) {
      toast.error("Please meet all password requirements");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      setDone(true);
      toast.success("Password updated");
    } catch (err) {
      toast.error(friendlyAuthError(err, "Could not update password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white px-5 py-5 sm:px-10">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="AfterAdmit home" className="rounded-md">
          <Logo />
        </Link>
        <Link href={backHref} className="text-[13px] font-medium text-foreground hover:text-primary">
          Back to sign in
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-10">
        {done ? (
          <div className="space-y-4 rounded-2xl border p-6">
            <CheckCircle2 className="size-8 text-success" />
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
              Password updated
            </h1>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              Your new password is saved. You can sign in now with your updated credentials.
            </p>
            <Button variant="ink" size="lg" className="w-full" onClick={() => router.replace(backHref)}>
              Continue to sign in <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : checking ? (
          <div className="rounded-2xl border p-6 text-center text-[13.5px] text-muted-foreground">
            Verifying your reset link…
          </div>
        ) : !hasSession || urlError ? (
          <div className="space-y-4 rounded-2xl border p-6">
            <KeyRound className="size-7 text-primary" />
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
              Reset link expired
            </h1>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              This password reset link is invalid or has already been used. Request a fresh link from your sign-in page.
            </p>
            <Button asChild variant="ink" className="w-full">
              <Link href={backHref}>Go to sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
              Set a new password
            </h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Choose a strong password for your AfterAdmit account.
            </p>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-subtle hover:text-foreground"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <PasswordChecklist password={password} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className="h-10"
                  required
                />
              </div>

              <Button type="submit" variant="ink" size="lg" className="w-full" disabled={saving}>
                {saving ? "Updating password…" : "Update password"}
                {!saving && <ArrowRight className="size-4" />}
              </Button>
            </form>
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-[12px] text-subtle">
        <span>© 2026 AfterAdmit, Inc.</span>
        <div className="flex gap-4">
          <Link className="hover:text-foreground" href="/legal/privacy">
            Privacy
          </Link>
          <Link className="hover:text-foreground" href="/legal/terms">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center bg-white text-[13px] text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ResetPasswordInner />
    </React.Suspense>
  );
}
