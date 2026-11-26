// Email-safe HTML built from AfterAdmit design tokens (globals.css).
// ink #18181b · primary #ff4500 · muted #f4f4f5 · muted-foreground #6e6e76 · border #ececee

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(opts: { preheader: string; heading: string; body: string; cta?: { label: string; url: string }; footnote?: string }) {
  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px 0;">
        <tr><td style="border-radius:12px;background:#18181b;">
          <a href="${esc(opts.cta.url)}" style="display:inline-block;padding:13px 22px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">${esc(opts.cta.label)}</a>
        </td></tr>
      </table>
      <p style="margin:12px 0 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:#6e6e76;word-break:break-all;">Or paste this link into your browser:<br/><a href="${esc(opts.cta.url)}" style="color:#ff4500;">${esc(opts.cta.url)}</a></p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #ececee;border-radius:16px;">
        <tr><td style="padding:28px 32px 0 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="width:28px;height:28px;background:#ff4500;border-radius:8px;text-align:center;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;line-height:28px;">A</td>
            <td style="padding-left:10px;font-family:${FONT};font-size:15px;font-weight:600;color:#121214;letter-spacing:-0.01em;">AfterAdmit</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:24px 32px 32px 32px;font-family:${FONT};color:#121214;">
          <h1 style="margin:0 0 12px 0;font-family:${FONT};font-size:22px;line-height:28px;font-weight:600;letter-spacing:-0.02em;color:#121214;">${esc(opts.heading)}</h1>
          ${opts.body}
          ${cta}
          ${opts.footnote ? `<p style="margin:24px 0 0 0;font-family:${FONT};font-size:12.5px;line-height:19px;color:#6e6e76;">${opts.footnote}</p>` : ""}
        </td></tr>
      </table>
      <p style="margin:16px 0 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:#6e6e76;">© 2027 AfterAdmit, Inc. · Questions? Reply to this email or write to info@afteradmit.com</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function inviteEmail(input: {
  firstName: string;
  schoolName: string;
  program?: string | null;
  intake?: string | null;
  inviteUrl: string;
  expiresAt?: string | null;
}) {
  const first = input.firstName.trim() || "there";
  const school = input.schoolName.trim() || "your university";
  const programLine = [input.program, input.intake].filter(Boolean).join(" · ");
  const expires = input.expiresAt
    ? new Date(input.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const body = `
    <p style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#121214;">Hi ${esc(first)},</p>
    <p style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#121214;">
      <strong>${esc(school)}</strong> has invited you to AfterAdmit, your personal path from admit to arrival. Create your account to see your roadmap, deadlines, and classmates.
    </p>
    ${programLine ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 0 0;background:#f4f4f5;border-radius:12px;width:100%;"><tr><td style="padding:14px 16px;font-family:${FONT};font-size:13.5px;line-height:20px;color:#6e6e76;">Your program<br/><span style="color:#121214;font-size:15px;font-weight:600;">${esc(programLine)}</span></td></tr></table>` : ""}`;

  const footnote = expires ? `This invite link expires on ${esc(expires)}.` : "";

  const html = layout({
    preheader: `${school} invited you to AfterAdmit`,
    heading: `${school} invited you`,
    body,
    cta: { label: "Create your account", url: input.inviteUrl },
    footnote,
  });

  const text = [
    `Hi ${first},`,
    "",
    `${school} has invited you to AfterAdmit, your personal path from admit to arrival.`,
    programLine ? `Program: ${programLine}` : "",
    "",
    `Create your account: ${input.inviteUrl}`,
    expires ? `This invite link expires on ${expires}.` : "",
    "",
    "Questions? Reply to this email or write to info@afteradmit.com",
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  return {
    subject: `${school} invited you to AfterAdmit`,
    html,
    text,
  };
}
