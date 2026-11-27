// Branded, email-safe HTML built from AfterAdmit design tokens (globals.css).
// ink #18181b · primary #ff4500 · primary-soft #fff1eb · muted #f4f4f5 · muted-foreground #6e6e76 · border #ececee

const FONT = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function assetOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://afteradmit.vercel.app").replace(/\/$/, "");
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailBox(rows: { label: string; value: string }[]) {
  const valid = rows.filter((r) => r.value.trim());
  if (!valid.length) return "";
  const items = valid
    .map(
      (r, idx) => `<tr>
        <td style="padding:${idx === 0 ? "12px 16px 6px 16px" : idx === valid.length - 1 ? "6px 16px 12px 16px" : "6px 16px"};font-family:${FONT};font-size:13px;line-height:19px;color:#6e6e76;width:120px;vertical-align:top;">${esc(r.label)}</td>
        <td style="padding:${idx === 0 ? "12px 16px 6px 16px" : idx === valid.length - 1 ? "6px 16px 12px 16px" : "6px 16px"};font-family:${FONT};font-size:13.5px;line-height:19px;font-weight:600;color:#18181b;vertical-align:top;">${esc(r.value)}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 4px 0;background:#fafafa;border:1px solid #ececee;border-radius:12px;">
    ${items}
  </table>`;
}

function layout(opts: {
  preheader: string;
  eyebrow: string;
  heading: string;
  body: string;
  cta?: { label: string; url: string };
  footnote?: string;
}) {
  const logoUrl = `${assetOrigin()}/apple-icon`;
  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 6px 0;">
        <tr><td style="border-radius:10px;background:#18181b;">
          <a href="${esc(opts.cta.url)}" style="display:inline-block;padding:13px 22px;font-family:${FONT};font-size:14.5px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;letter-spacing:-0.01em;">${esc(opts.cta.label)} &rarr;</a>
        </td></tr>
      </table>
      <p style="margin:14px 0 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:#6e6e76;word-break:break-all;">Or copy and paste this link into your browser:<br/><a href="${esc(opts.cta.url)}" style="color:#ff4500;text-decoration:none;">${esc(opts.cta.url)}</a></p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${esc(opts.heading)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
    body, table, td, p, h1, a { font-family: ${FONT} !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;-webkit-font-smoothing:antialiased;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:36px 14px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #ececee;border-radius:16px;overflow:hidden;">
        <!-- Subtle brand top accent -->
        <!-- Header with official AfterAdmit logo mark + wordmark -->
        <tr><td style="padding:28px 32px 20px 32px;border-bottom:1px solid #f4f4f5;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <img src="${esc(logoUrl)}" width="30" height="30" alt="AfterAdmit" style="display:block;width:30px;height:30px;border-radius:8px;border:0;"/>
            </td>
            <td style="padding-left:10px;vertical-align:middle;font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:-0.03em;color:#18181b;">
              After<span style="color:#ff4500;">Admit</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:28px 32px 32px 32px;font-family:${FONT};color:#121214;">
          <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff1eb;color:#ff4500;font-family:${FONT};font-size:11.5px;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;">${esc(opts.eyebrow)}</div>
          <h1 style="margin:14px 0 12px 0;font-family:${FONT};font-size:24px;line-height:30px;font-weight:600;letter-spacing:-0.03em;color:#18181b;">${esc(opts.heading)}</h1>
          ${opts.body}
          ${cta}
          ${opts.footnote ? `<p style="margin:24px 0 0 0;padding-top:16px;border-top:1px solid #f4f4f5;font-family:${FONT};font-size:12.5px;line-height:19px;color:#6e6e76;">${opts.footnote}</p>` : ""}
        </td></tr>
      </table>

      <!-- Footer -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin-top:16px;">
        <tr><td align="center" style="font-family:${FONT};font-size:12px;line-height:18px;color:#6e6e76;">
          © 2026 AfterAdmit, Inc. &middot; From admit to arrival.<br/>
          This message was sent automatically by AfterAdmit. Please do not reply to this email.<br/>
          Need a person? Write to <a href="mailto:info@afteradmit.com" style="color:#18181b;text-decoration:underline;">info@afteradmit.com</a>
        </td></tr>
      </table>
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
  const school = input.schoolName.trim() || "Your university";
  const expires = input.expiresAt
    ? new Date(input.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const details = detailBox([
    { label: "University", value: school },
    { label: "Program", value: input.program?.trim() || "" },
    { label: "Intake", value: input.intake?.trim() || "" },
  ]);

  const body = `
    <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#121214;">Hi ${esc(first)},</p>
    <p style="margin:0 0 6px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3f3f46;"><strong>${esc(school)}</strong> has invited you to AfterAdmit — your personal pre-arrival roadmap with deadlines, visa &amp; housing guidance, vetted providers, and your incoming classmates.</p>
    ${details}
  `;

  const footnote = expires
    ? `This personal invite link expires on ${esc(expires)}. If you didn't expect this email, you can safely ignore it.`
    : "If you didn't expect this email, you can safely ignore it.";

  const html = layout({
    preheader: `${school} invited you to AfterAdmit`,
    eyebrow: "University Invite",
    heading: `Welcome to ${school} on AfterAdmit`,
    body,
    cta: { label: "Accept invite & create account", url: input.inviteUrl },
    footnote,
  });

  const text = [
    `Hi ${first},`,
    "",
    `${school} has invited you to AfterAdmit — your personal path from admit to arrival.`,
    input.program ? `Program: ${input.program}` : "",
    input.intake ? `Intake: ${input.intake}` : "",
    "",
    `Accept your invite: ${input.inviteUrl}`,
    expires ? `This invite link expires on ${expires}.` : "",
    "",
    "Questions? Reply to this email or write to info@afteradmit.com",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `${school} invited you to AfterAdmit`,
    html,
    text,
  };
}

export function accessDecisionEmail(input: {
  firstName?: string | null;
  roleLabel: string;
  orgName: string;
  approved: boolean;
  reason?: string | null;
  loginUrl: string;
}) {
  const first = (input.firstName ?? "").trim() || "there";
  const org = input.orgName.trim() || "your organization";

  if (input.approved) {
    const details = detailBox([
      { label: "Organization", value: org },
      { label: "Workspace", value: input.roleLabel },
      { label: "Status", value: "Approved & active" },
    ]);
    const body = `
      <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#121214;">Hi ${esc(first)},</p>
      <p style="margin:0 0 6px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3f3f46;">Welcome aboard. Your <strong>${esc(input.roleLabel)}</strong> workspace for <strong>${esc(org)}</strong> is verified and ready. Sign in to invite your class, set up your first batch, and start the term.</p>
      ${details}
    `;
    const html = layout({
      preheader: `Your AfterAdmit ${input.roleLabel.toLowerCase()} access is approved`,
      eyebrow: "Access Approved",
      heading: "Your workspace is ready",
      body,
      cta: { label: "Sign in to AfterAdmit", url: input.loginUrl },
      footnote: "Need help onboarding your team or uploading your first student cohort? Simply reply to this email.",
    });
    const text = [
      `Hi ${first},`,
      "",
      `Your ${input.roleLabel} access for ${org} on AfterAdmit has been approved.`,
      "",
      `Sign in: ${input.loginUrl}`,
      "",
      "Questions? Reply to this email or write to info@afteradmit.com",
    ].join("\n");
    return { subject: `Approved: ${org} on AfterAdmit`, html, text };
  }

  const details = detailBox([
    { label: "Organization", value: org },
    { label: "Requested", value: input.roleLabel },
    { label: "Status", value: "Not approved" },
  ]);
  const reasonBlock = input.reason?.trim()
    ? `<p style="margin:16px 0 0 0;font-family:${FONT};font-size:14px;line-height:22px;color:#3f3f46;"><strong>Note from our team:</strong> ${esc(input.reason.trim())}</p>`
    : "";
  const body = `
    <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#121214;">Hi ${esc(first)},</p>
    <p style="margin:0 0 6px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3f3f46;">We reviewed your <strong>${esc(input.roleLabel)}</strong> request for <strong>${esc(org)}</strong> and could not approve it at this time.</p>
    ${details}
    ${reasonBlock}
  `;
  const html = layout({
    preheader: "Update on your AfterAdmit access request",
    eyebrow: "Access Update",
    heading: "Update on your access request",
    body,
    footnote: "If you believe this was a mistake, reply directly to this email from your institutional work address and our team will re-review.",
  });
  const text = [
    `Hi ${first},`,
    "",
    `We could not approve your ${input.roleLabel} access request for ${org} at this time.`,
    input.reason?.trim() ? `Note: ${input.reason.trim()}` : "",
    "",
    "Reply to this email or write to info@afteradmit.com if you have questions.",
  ]
    .filter(Boolean)
    .join("\n");
  return { subject: "Update on your AfterAdmit access request", html, text };
}

export function accessRequestReceivedEmail(input: {
  firstName?: string | null;
  roleLabel: string;
  orgName: string;
  reference?: string | null;
}) {
  const first = (input.firstName ?? "").trim() || "there";
  const org = input.orgName.trim() || "your organization";

  const details = detailBox([
    { label: "Request no.", value: input.reference?.trim() || "" },
    { label: "Organization", value: org },
    { label: "Workspace", value: input.roleLabel },
    { label: "Status", value: "Pending verification" },
  ]);

  const body = `
    <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#121214;">Hi ${esc(first)},</p>
    <p style="margin:0 0 6px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3f3f46;">We received your onboarding request for <strong>${esc(org)}</strong>. To protect admitted students, our team verifies every organization manually before granting access.</p>
    ${details}
  `;

  const html = layout({
    preheader: `We received your AfterAdmit ${input.roleLabel.toLowerCase()} request`,
    eyebrow: "Request Received",
    heading: "We're reviewing your request",
    body,
    footnote: "You'll receive an email with a direct sign-in link as soon as your workspace is approved.",
  });

  const text = [
    `Hi ${first},`,
    "",
    `We received your ${input.roleLabel} access request for ${org} on AfterAdmit.`,
    "To protect admitted students, our team verifies every organization manually. We'll email you as soon as your workspace is approved.",
    "",
    "Questions? Reply to this email or write to info@afteradmit.com",
  ].join("\n");

  return {
    subject: `We received your AfterAdmit request for ${org}`,
    html,
    text,
  };
}
