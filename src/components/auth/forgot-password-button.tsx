"use client";

import * as React from "react";
import { toast } from "sonner";

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
  const [sending, setSending] = React.useState(false);

  const onClick = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address first");
      return;
    }
    setSending(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        `/reset-password?from=${portal}`,
      )}`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, { redirectTo });
      if (error) throw error;
      toast.success("Password reset link sent", {
        description: `Check ${trimmed} (including spam) for your reset link.`,
      });
    } catch (err) {
      toast.error(friendlyAuthError(err, "Could not send reset email"));
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={sending}
      className="text-[12px] font-medium text-muted-foreground hover:text-primary disabled:opacity-50"
    >
      {sending ? "Sending…" : "Forgot password?"}
    </button>
  );
}
