"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Eye, EyeOff, ShieldAlert } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ForgotPasswordButton, friendlyAuthError } from "@/components/auth/forgot-password-button";
import { AuthPortalLinks, rememberThisDevice } from "@/components/auth/auth-portal-links";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isPasswordStrong } from "@/lib/password";
import type { Profile } from "@/lib/auth-profile";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
]);

const COHORT_SIZES = ["Under 100", "100 – 500", "500 – 2,000", "2,000+"];

function PreviewPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col">
      <Image src="/login1.avif" alt="University campus" fill loading="eager" sizes="55vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="relative mt-auto px-14 pb-14 xl:px-20">
        <div className="max-w-[480px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[12px] font-medium text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            University workspace
          </div>
          <h2 className="mt-5 text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-white">
            Invite your class,
            <br />
            <span className="text-white/55">track every admit.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Verified admissions and international office teams invite admitted students, automate pre-arrival roadmaps, and monitor enrollment readiness.
          </p>
        </div>
      </div>
    </div>
  );
}

type StatusView =
  | { kind: "pending"; org: string; email: string }
  | { kind: "rejected"; org: string; email: string; reason?: string | null };

function UniversityLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/university";
  const startCreate = searchParams.get("mode") === "create";

  const [mode, setMode] = React.useState<"signin" | "create">(startCreate ? "create" : "signin");
  const [step, setStep] = React.useState<1 | 2>(1);

  // Step 1: Account
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  // Step 2: University profile
  const [schoolName, setSchoolName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [annualAdmits, setAnnualAdmits] = React.useState("100 – 500");
  const [verificationNote, setVerificationNote] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [statusView, setStatusView] = React.useState<StatusView | null>(null);

  const emailDomain = email.trim().split("@")[1]?.toLowerCase() ?? "";
  const isFreeEmail = Boolean(emailDomain && FREE_EMAIL_DOMAINS.has(emailDomain));

  const goUniversity = () => {
    router.replace(nextPath.startsWith("/university") ? nextPath : "/university");
    router.refresh();
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
      rememberThisDevice(remember);

      const { data: profile, error: profileError } = await supabase.rpc("get_my_profile");
      if (profileError) throw profileError;
      const row = (Array.isArray(profile) ? profile[0] : profile) as Profile | null;

      if (!row || row.role !== "university_admin") {
        await supabase.auth.signOut();
        if (row?.requested_role === "university_admin" && row.approval_status === "pending") {
          setStatusView({
            kind: "pending",
            org: row.requested_org_name || "your university",
            email: row.email,
          });
          return;
        }
        if (row?.requested_role === "university_admin" && row.approval_status === "rejected") {
          setStatusView({
            kind: "rejected",
            org: row.requested_org_name || "your university",
            email: row.email,
            reason: row.rejection_reason,
          });
          return;
        }
        throw new Error("This account does not have approved university admin access.");
      }

      toast.success("Signed in");
      goUniversity();
    } catch (err) {
      toast.error(friendlyAuthError(err, "Could not sign in"));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !jobTitle.trim() || !email.trim() || !password) {
      toast.error("Complete all required fields");
      return;
    }
    if (!isPasswordStrong(password)) {
      toast.error("Please meet all password requirements");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please accept the Terms and Privacy Policy");
      return;
    }
    setStep(2);
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !website.trim() || !country.trim()) {
      toast.error("Enter your university name, official website, and country");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/university/login`,
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
          setStatusView({
            kind: "pending",
            org: schoolName.trim(),
            email: email.trim(),
          });
          toast.success("Application submitted", {
            description: "Confirm your email, then wait for AfterAdmit approval.",
          });
          return;
        }
      }

      const normalizedWebsite = website.trim().startsWith("http")
        ? website.trim()
        : `https://${website.trim()}`;

      const { error: regError } = await supabase.rpc("register_university_admin", {
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
        p_school_name: schoolName.trim(),
        p_details: {
          job_title: jobTitle.trim(),
          website: normalizedWebsite,
          country: country.trim(),
          city: city.trim() || null,
          department: department.trim() || null,
          annual_admits: annualAdmits,
          verification_note: verificationNote.trim() || null,
        },
      });
      if (regError) throw regError;

      await fetch("/api/access-requests/notify", { method: "POST" }).catch(() => {});
      await supabase.auth.signOut();
      setStatusView({
        kind: "pending",
        org: schoolName.trim(),
        email: email.trim(),
      });
      toast.success("University onboarding request submitted");
    } catch (err) {
      toast.error(friendlyAuthError(err, "Could not submit request"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1.05fr_minmax(520px,1fr)]">
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

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">
          {statusView?.kind === "pending" ? (
            <div className="space-y-4 rounded-2xl border p-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[12px] font-medium text-primary">
                <Clock className="size-3.5" /> Pending verification
              </div>
              <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
                Your university request is under review
              </h1>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                We received your onboarding details for{" "}
                <span className="font-medium text-foreground">{statusView.org}</span>. To protect student
                data, our team verifies every university admin manually.
              </p>
              <div className="space-y-2 rounded-xl bg-muted/50 p-3.5 text-[12.5px] text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                  <span>Check <strong className="text-foreground">{statusView.email}</strong> to confirm your email if prompted.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                  <span>Once approved, we&apos;ll email you a direct sign-in link to your school workspace.</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStatusView(null);
                  setMode("signin");
                  setStep(1);
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : statusView?.kind === "rejected" ? (
            <div className="space-y-4 rounded-2xl border p-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[12px] font-medium text-foreground">
                <ShieldAlert className="size-3.5 text-primary" /> Not approved
              </div>
              <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
                Access request was not approved
              </h1>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                Your request for <span className="font-medium text-foreground">{statusView.org}</span> was not approved at this time.
                {statusView.reason ? (
                  <>
                    <br />
                    <span className="mt-2 block text-foreground">Note: {statusView.reason}</span>
                  </>
                ) : null}
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                Need help? Write to{" "}
                <a href="mailto:info@afteradmit.com" className="font-medium text-primary hover:underline">
                  info@afteradmit.com
                </a>{" "}
                from your institutional email.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStatusView(null);
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : mode === "signin" ? (
            <>
              <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">
                University sign in
              </h1>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                Sign in with your approved university admin account.
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
                    placeholder="you@university.edu"
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <ForgotPasswordButton email={email} portal="university" />
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
                <label className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-3.5 rounded border" />
                  Keep me signed in on this device
                </label>
                <Button type="submit" variant="ink" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                  {!loading && <ArrowRight className="size-4" />}
                </Button>
              </form>

              <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
                Onboarding a new university?{" "}
                <button
                  type="button"
                  className="font-medium text-foreground hover:text-primary"
                  onClick={() => {
                    setMode("create");
                    setStep(1);
                  }}
                >
                  Request university access
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-[12px] font-medium text-muted-foreground">
                <span>Step {step} of 2</span>
                <span>{step === 1 ? "Your account" : "University details"}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div className="h-1 rounded-full bg-ink" />
                <div className={`h-1 rounded-full ${step === 2 ? "bg-ink" : "bg-border"}`} />
              </div>

              <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-ink">
                {step === 1 ? "Request university access" : "Tell us about your university"}
              </h1>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                {step === 1
                  ? "Use your official university email so our team can verify your role quickly."
                  : "AfterAdmit reviews these details before activating your university workspace."}
              </p>

              {step === 1 ? (
                <form className="mt-5 space-y-3.5" onSubmit={nextStep}>
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
                    <Label htmlFor="title">Your role / title</Label>
                    <Input
                      id="title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Director of International Admissions"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Official work email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="h-10"
                      required
                    />
                    {isFreeEmail && (
                      <p className="text-[11.5px] text-amber-700">
                        Institutional emails (.edu / university domain) are approved fastest. Personal emails require extra verification.
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Create password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={show ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Strong password"
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

                  <label className="flex items-start gap-2.5 pt-1 text-[12px] text-muted-foreground">
                    <Checkbox
                      checked={agreeTerms}
                      onCheckedChange={(v) => setAgreeTerms(Boolean(v))}
                      className="mt-0.5"
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/legal/terms" className="font-medium text-foreground underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/legal/privacy" className="font-medium text-foreground underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <Button type="submit" variant="ink" size="lg" className="w-full">
                    Continue to university details <ArrowRight className="size-4" />
                  </Button>
                </form>
              ) : (
                <form className="mt-5 space-y-3.5" onSubmit={submitRequest}>
                  <div className="space-y-1.5">
                    <Label htmlFor="school">University / School full name</Label>
                    <Input
                      id="school"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. UCLA Anderson School of Management"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="website">Official university website</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.anderson.ucla.edu"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Los Angeles"
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dept">Department / Programs covered</Label>
                    <Input
                      id="dept"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. MBA, MS Business Analytics, International Office"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cohort">Annual admitted international students</Label>
                    <select
                      id="cohort"
                      value={annualAdmits}
                      onChange={(e) => setAnnualAdmits(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {COHORT_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="note">Staff directory link or note (optional)</Label>
                    <Input
                      id="note"
                      value={verificationNote}
                      onChange={(e) => setVerificationNote(e.target.value)}
                      placeholder="Link to your university bio or LinkedIn"
                      className="h-10"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} disabled={loading}>
                      <ArrowLeft className="size-4" /> Back
                    </Button>
                    <Button type="submit" variant="ink" size="lg" className="flex-1" disabled={loading}>
                      {loading ? "Submitting…" : "Submit for approval"}
                      {!loading && <ArrowRight className="size-4" />}
                    </Button>
                  </div>
                </form>
              )}

              <p className="mt-5 text-center text-[12.5px] text-muted-foreground">
                Already approved?{" "}
                <button
                  type="button"
                  className="font-medium text-foreground hover:text-primary"
                  onClick={() => {
                    setMode("signin");
                    setStep(1);
                  }}
                >
                  Sign in
                </button>
              </p>
            </>
          )}
          <AuthPortalLinks />
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

export default function UniversityLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center bg-white text-[13px] text-muted-foreground">
          Loading…
        </div>
      }
    >
      <UniversityLoginForm />
    </React.Suspense>
  );
}
