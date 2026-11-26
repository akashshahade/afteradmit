import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { inviteLinkPath } from "@/lib/invites";
import { sendEmail } from "@/lib/email/resend";
import { inviteEmail } from "@/lib/email/templates";

const MAX_TOKENS = 200;

type InviteRow = {
  token: string;
  email: string;
  first_name: string | null;
  school_name: string | null;
  program: string | null;
  intake: string | null;
  expires_at: string | null;
};

export async function POST(request: NextRequest) {
  let body: { tokens?: unknown };
  try {
    body = (await request.json()) as { tokens?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokens = Array.isArray(body.tokens)
    ? body.tokens.filter((t): t is string => typeof t === "string" && t.length > 0).slice(0, MAX_TOKENS)
    : [];
  if (!tokens.length) {
    return NextResponse.json({ error: "No invites selected" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // RPC enforces role + school scope; returns only this admin's pending invites.
  const { data, error } = await supabase.rpc("get_invites_for_email_send", { p_tokens: tokens });
  if (error) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const invites = (Array.isArray(data) ? data : []) as InviteRow[];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");

  const results = await Promise.all(
    invites.map(async (invite) => {
      const { subject, html, text } = inviteEmail({
        firstName: invite.first_name ?? "",
        schoolName: invite.school_name ?? "",
        program: invite.program,
        intake: invite.intake,
        inviteUrl: `${siteUrl}${inviteLinkPath(invite.token)}`,
        expiresAt: invite.expires_at,
      });
      const sent = await sendEmail({ to: invite.email, subject, html, text });
      return { token: invite.token, email: invite.email, ok: sent.ok };
    }),
  );

  const sent = results.filter((r) => r.ok).length;
  return NextResponse.json({
    sent,
    failed: results.length - sent,
    skipped: tokens.length - invites.length,
    results: results.map(({ token, ok }) => ({ token, ok })),
  });
}
