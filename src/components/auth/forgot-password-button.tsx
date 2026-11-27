"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";

export function friendlyAuthError(err: unknown, fallback = "Something went wrong") {
  const msg = err instanceof Error ? err.message : "";
  if (!msg || msg.includes("NEXT_PUBLIC_") || msg.includes("SUPABASE")) {
    return "Service temporarily unavailable. Please try again shortly.";
  }
  return msg || fallback;
}

export function ForgotPasswordButton({
  email,
  portal,
}: {
  email: string;
  portal: "student" | "university" | "partner" | "admin";
}) {
  const [open, setOpen] = React.useState(false);
  const [sending, setSending] = React.useState<"link" | "reset" | null>(null);

  const send = async (kind: "link" | "reset") => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address first");
      return;
    }
    setSending(kind);
    try {
      const supabase = createClient();
      if (kind === "link") {
        const { error } = await supabase.auth.signInWithOtp({
          email: trimmed,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              portal === "student" ? "/student" : `/${portal === "university" ? "university" : portal}`,
            )}`,
          },
        });
        if (error) throw error;
        toast.success("Sign-in link sent", {
          description: `Check ${trimmed}. The link signs you in on this device.`,
        });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            `/reset-password?from=${portal}`,
          )}`,
        });
        if (error) throw error;
        toast.success("Password reset link sent", {
          description: `Check ${trimmed} (including spam) for your reset link.`,
        });
      }
      setOpen(false);
    } catch (err) {
      toast.error(friendlyAuthError(err, "Could not send email"));
    } finally {
      setSending(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="text-[12px] font-medium text-muted-foreground hover:text-primary">
          Forgot password?
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[280px] space-y-2 p-3">
        <div className="text-[13px] font-semibold">Need a way back in?</div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Nothing is sent until you choose. We&apos;ll email {email.trim() || "the address above"}.
        </p>
        <Button type="button" size="sm" variant="ink" className="w-full" disabled={!!sending} onClick={() => void send("link")}>
          {sending === "link" ? "Sending…" : "Email me a sign-in link"}
        </Button>
        <Button type="button" size="sm" variant="outline" className="w-full" disabled={!!sending} onClick={() => void send("reset")}>
          {sending === "reset" ? "Sending…" : "Reset my password"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
