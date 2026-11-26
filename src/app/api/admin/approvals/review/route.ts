import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { accessDecisionEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  let body: { userId?: unknown; decision?: unknown; schoolName?: unknown; reason?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const decision = body.decision === "approve" || body.decision === "reject" ? body.decision : null;
  const schoolName = typeof body.schoolName === "string" ? body.schoolName.trim() : null;
  const reason = typeof body.reason === "string" ? body.reason.trim() : null;

  if (!userId || !decision) {
    return NextResponse.json({ error: "userId and decision are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data: updated, error } = await supabase.rpc("review_access_request", {
    p_user_id: userId,
    p_decision: decision,
    p_school_name: schoolName || null,
    p_reason: reason || null,
  });

  if (error || !updated) {
    const status = error?.message?.toLowerCase().includes("admin") ? 403 : 400;
    return NextResponse.json({ error: error?.message ?? "Could not update request" }, { status });
  }

  const row = (Array.isArray(updated) ? updated[0] : updated) as {
    email: string;
    first_name: string | null;
    requested_role: "university_admin" | "partner" | null;
    requested_org_name: string | null;
    school_name: string | null;
  };

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const isUni = row.requested_role === "university_admin";
  const loginUrl = `${siteUrl}${isUni ? "/university/login" : "/partner/login"}`;
  const orgName = row.school_name || row.requested_org_name || "your organization";

  const template = accessDecisionEmail({
    firstName: row.first_name,
    roleLabel: isUni ? "University admin" : "Partner",
    orgName,
    approved: decision === "approve",
    reason,
    loginUrl,
  });

  const mail = await sendEmail({
    to: row.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return NextResponse.json({ ok: true, profile: row, emailSent: mail.ok });
}
