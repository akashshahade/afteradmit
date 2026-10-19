"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Link2, Mail, MessageCircle, Send, Share2 } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.47 9.47m8.06-17.53A11.33 11.33 0 0 0 12.04.63C5.76.63.65 5.74.65 12.02c0 2.01.52 3.97 1.52 5.69L.55 23.6l6.03-1.58a11.36 11.36 0 0 0 5.45 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.19-5.9-3.34-8.05" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** Share options for a post or comment. `path` defaults to the current page; `hash` targets a comment. */
export function ShareMenu({ title, path, hash, children }: { title: string; path?: string; hash?: string; children: React.ReactNode }) {
  const router = useRouter();
  const [canNativeShare] = React.useState(() => typeof navigator !== "undefined" && typeof navigator.share === "function");

  const url = () => `${window.location.origin}${path ?? window.location.pathname}${hash ? `#${hash}` : ""}`;
  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer,width=620,height=600");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={async () => {
            await navigator.clipboard.writeText(url());
            toast.success("Link copied");
          }}
        >
          <Link2 /> Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            await navigator.clipboard.writeText(url());
            toast.success("Link copied", { description: "Paste it into any chat to share." });
            router.push("/student/messages");
          }}
        >
          <Send /> Send to a classmate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}>
          <WhatsAppIcon /> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => (window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url())}`)}>
          <Mail /> Email
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)}>
          <LinkedInIcon /> LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => open(`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`)}>
          <XIcon /> X
        </DropdownMenuItem>
        {canNativeShare && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                navigator.share({ title, url: url() }).catch(() => undefined);
              }}
            >
              <Share2 /> More apps…
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-muted-foreground">
          <MessageCircle className="size-3" /> Only admitted students can open this link.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
