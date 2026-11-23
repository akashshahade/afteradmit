"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/auth-profile";

function PreviewPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col">
      <Image src="/login1.avif" alt="Partner workspace" fill loading="eager" sizes="55vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="relative mt-auto px-14 pb-14 xl:px-20">
        <div className="max-w-[480px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[12px] font-medium text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Partner portal
          </div>
          <h2 className="mt-5 text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
            Reach admitted students
            <br />
            <span className="text-white/55">at the right moment.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Manage listings, track leads from roadmap milestones, and bill per verified click.
          </p>
        </div>
      </div>
    </div>
  );
}

function PartnerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/partner";
  const startCreate = searchParams.get("mode") === "create";

  const [mode, setMode] = React.useState<"signin" | "create">(startCreate ? "create" : "signin");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [orgName, setOrgName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const goPartner = () => {
    router.replace(nextPath.startsWith("/partner") ? nextPath : "/partner");
    router.refresh();
  };

  const ensurePartner = async (supabase: ReturnType<typeof createClient>) => {
    const { data: profile, error: profileError } = await supabase.rpc("get_my_profile");
    if (profileError) throw profileError;
    const row = (Array.isArray(profile) ? profile[0] : profile) as Profile | null;
    if (!row || row.role !== "partner") {
      await supabase.auth.signOut();
      throw new Error("This account is not a partner");
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
      await ensurePartner(supabase);
      toast.success("Signed in");
      goPartner();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !orgName.trim() || !email.trim() || !password) {
      toast.error("Fill in all fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Use at least 8 characters for your password");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });
      if (error) throw error;
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          toast.success("Account created", {
            description: "Confirm your email if required, then sign in.",
          });
          setMode("signin");
          return;
        }
      }

      const { error: regError } = await supabase.rpc("register_partner", {
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
        p_org_name: orgName.trim(),
        p_contact_email: email.trim(),
      });
      if (regError) throw regError;

      toast.success("Partner account created");
      goPartner();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
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
            <span className="hidden sm:inline">Student? </span>
            <Link href="/login" className="font-medium text-foreground hover:text-primary">
              Student sign in
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center py-8">
          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
            {mode === "signin" ? "Partner sign in" : "Create partner account"}
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {mode === "signin"
              ? "Sign in to manage listings and leads."
              : "Create your company workspace on AfterAdmit."}
          </p>

          <form className="mt-6 space-y-3.5" onSubmit={mode === "signin" ? signIn : createAccount}>
            {mode === "create" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="first">First name</Label>
                    <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="last">Last name</Label>
                    <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="org">Company name</Label>
                  <Input
                    id="org"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Westwood Commons"
                    className="h-10"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signin" ? "Your password" : "At least 8 characters"}
                  className="h-10 pr-10"
                  required
                  minLength={mode === "signin" ? 6 : 8}
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
              {loading
                ? mode === "signin"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
            {mode === "signin" ? (
              <>
                New partner?{" "}
                <button type="button" className="font-medium text-foreground hover:text-primary" onClick={() => setMode("create")}>
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" className="font-medium text-foreground hover:text-primary" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between text-[12px] text-subtle">
          <span>© 2027 AfterAdmit, Inc.</span>
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

export default function PartnerLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center bg-white text-[13px] text-muted-foreground">
          Loading…
        </div>
      }
    >
      <PartnerLoginForm />
    </React.Suspense>
  );
}
