const RESEND_URL = "https://api.resend.com/emails";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  from?: string;
};

export type SendEmailResult = { ok: true; id: string } | { ok: false; error: string };

/** Server-only Resend sender. Fails closed when the API key is missing. */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = input.from ?? process.env.RESEND_FROM_INVITES;
  if (!apiKey || !from) {
    return { ok: false, error: "Email is not configured" };
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo ?? "info@afteradmit.com",
      }),
    });

    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !body.id) {
      console.error("[resend] send failed", res.status, body.message);
      return { ok: false, error: "Could not send email" };
    }
    return { ok: true, id: body.id };
  } catch (err) {
    console.error("[resend] network error", err);
    return { ok: false, error: "Could not send email" };
  }
}
