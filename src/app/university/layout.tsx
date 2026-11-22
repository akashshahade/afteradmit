"use client";

import { usePathname } from "next/navigation";

import { UniversityShell } from "@/components/university/university-shell";

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/university/login") {
    return children;
  }
  return <UniversityShell>{children}</UniversityShell>;
}
