"use client";

import { usePathname } from "next/navigation";

import { PartnerShell } from "@/components/partner/partner-shell";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/partner/login") {
    return children;
  }
  return <PartnerShell>{children}</PartnerShell>;
}
