import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { accessRequestReceivedEmail } from "@/lib/email/templates";

export async function POST() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data: profile, error } = await supabase.rpc("get_my_profile");
  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const row = (Array.isArray(profile) ? profile[0] : profile) as {
    email: string;
    first_name: string | null;
    requested_role: "university_admin" | "partner" | null;
    requested_org_name: string | null;
    approval_status: string | null;
  };

  if (row.approval_status !== "pending" || !row.requested_role) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const roleLabel = row.requested_role === "university_admin" ? "University admin" : "Partner";
  const orgName = row.requested_org_name || "your organization";

  const template = accessRequestReceivedEmail({
    firstName: row.first_name,
    roleLabel,
    orgName,
  });

  const mail = await sendEmail({
    to: row.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return NextResponse.json({ ok: mail.ok });
}
