import type { Metadata } from "next";

import { PartnerShell } from "@/components/partner/partner-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PartnerLayout({ children }: LayoutProps<"/partner">) {
  return <PartnerShell>{children}</PartnerShell>;
}
