"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const portals = [
  { href: "/login", label: "Student" },
  { href: "/university/login", label: "University" },
  { href: "/partner/login", label: "Partner" },
  { href: "/admin/login", label: "Admin" },
];

export function AuthPortalLinks() {
  const pathname = usePathname();
  return (
    <div className="mt-6 rounded-xl border bg-muted/30 p-3 text-center">
      <div className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-subtle">Switch portal</div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12.5px]">
        {portals.map((portal) => {
          const active = pathname === portal.href;
          return active ? (
            <span key={portal.href} className="font-semibold text-foreground">
              {portal.label}
            </span>
          ) : (
            <Link key={portal.href} href={portal.href} className={cn("text-muted-foreground hover:text-primary")}>
              {portal.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function rememberThisDevice(remember: boolean) {
  if (remember) {
    localStorage.setItem("aa-remember", "1");
    sessionStorage.removeItem("aa-session");
    return;
  }
  localStorage.setItem("aa-remember", "0");
  sessionStorage.setItem("aa-session", "1");
}

export function shouldSignOutForgottenSession() {
  try {
    return localStorage.getItem("aa-remember") === "0" && sessionStorage.getItem("aa-session") !== "1";
  } catch {
    return false;
  }
}
