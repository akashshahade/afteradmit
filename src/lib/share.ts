export async function shareInviteLink(opts: {
  url: string;
  studentName?: string;
  schoolName?: string;
}) {
  const title = "You're invited to AfterAdmit";
  const text = opts.studentName
    ? `${opts.studentName}, you're invited to AfterAdmit${opts.schoolName ? ` for ${opts.schoolName}` : ""}. Open your invite:`
    : `You're invited to AfterAdmit${opts.schoolName ? ` for ${opts.schoolName}` : ""}. Open your invite:`;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url: opts.url });
      return "shared" as const;
    } catch (err) {
      // User cancelled share sheet — not an error.
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled" as const;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(opts.url);
    return "copied" as const;
  } catch {
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n${opts.url}`)}`,
      "_blank",
    );
    return "mailto" as const;
  }
}
