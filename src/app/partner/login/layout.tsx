import type { Metadata } from "next";

/** Login must not use the authenticated partner shell. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PartnerLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
