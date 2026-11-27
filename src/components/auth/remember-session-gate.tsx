"use client";

import * as React from "react";

import { createClient } from "@/lib/supabase/client";
import { shouldSignOutForgottenSession } from "@/components/auth/auth-portal-links";

export function RememberSessionGate() {
  React.useEffect(() => {
    if (!shouldSignOutForgottenSession()) return;
    const supabase = createClient();
    void supabase.auth.signOut();
  }, []);
  return null;
}
