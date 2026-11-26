"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ForgotPasswordButton, friendlyAuthError } from "@/components/auth/forgot-password-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/auth-profile";

function PreviewPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col">
      <Image src="/login1.avif" alt="AfterAdmit operations" fill loading="eager" sizes="55vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="relative mt-auto px-14 pb-14 xl:px-20">
        <div className="max-w-[480px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[12px] font-medium text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Platform operations
          </div>
          <h2 className="mt-5 text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
            Run AfterAdmit
            <br />
            <span className="text-white/55">across every school.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Universities, invites, marketplace providers, moderation, and support — one ops workspace.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const goAdmin = () => {
    router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin");
    router.refresh();
  };

  const ensureAdmin = async (supabase: ReturnType<typeof createClient>) => {
    const { data: profile, error: profileError } = await supabase.rpc("get_my_profile");
    if (profileError) throw profileError;
    const row = (Array.isArray(profile) ? profile[0] : profile) as Profile | null;
    if (!row || row.role !== "admin") {
      await supabase.auth.signOut();
      throw new Error("This account is not a platform admin");
    }
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      await ensureAdmin(supabase);
      toast.success("Signed in");
      goAdmin();
    } catch (err) {
      toast.error(friendlyAuthError(err, "Something went wrong"));
    } finally {
      setLoading(false);
    }
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
            <Link href="/login" className="font-medium text-foreground hover:text-primary">
              Student sign in
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center py-8">
          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
            Admin sign in
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Sign in to the AfterAdmit operations console.
          </p>

          <form className="mt-6 space-y-3.5" onSubmit={signIn}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@afteradmit.com"
                className="h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <ForgotPasswordButton email={email} portal="admin" />
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="h-10 pr-10"
                  required
                  minLength={6}
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
            </div>
            <Button type="submit" variant="ink" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </form>
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
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center bg-white text-[13px] text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </React.Suspense>
  );
}
