import type { Metadata } from "next";

/** Login must not use the authenticated admin shell. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
