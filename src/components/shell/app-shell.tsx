"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronsUpDown, LogOut, Menu, Search, Settings, CreditCard, UserRound, LifeBuoy, ArrowRightLeft, Check, Compass, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CommandPalette } from "@/components/shell/command-palette";
import { HelpSheet } from "@/components/shell/help-sheet";
import { DemoTour, requestTour } from "@/components/shell/demo-tour";

export type NavIcon = React.ComponentType<{ className?: string; strokeWidth?: number }>;
export type NavItem = { label: string; href: string; icon: NavIcon; badge?: string | number; exact?: boolean };
export type NavSection = { label?: string; items: NavItem[] };

export type ShellUser = { name: string; email: string; initials: string; color?: string; subtitle?: string };

export type ShellNotification = { id: string; title: string; body: string; time: string; unread: boolean };

type AppShellProps = {
  role: "student" | "admin" | "partner";
  sections: NavSection[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  user: ShellUser;
  notifications: ShellNotification[];
  profileHref: string;
  billingHref?: string;
  topAction?: React.ReactNode;
  mobileNav?: NavItem[];
  children: React.ReactNode;
};

const roleLabel = { student: "Student", admin: "AfterAdmit Admin", partner: "Partner" };

function SidebarNav({
  sections,
  header,
  footer,
  onNavigate,
  collapsed = false,
  onToggle,
  homeHref,
}: Pick<AppShellProps, "sections" | "header" | "footer"> & { onNavigate?: () => void; collapsed?: boolean; onToggle?: () => void; homeHref: string }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 shrink-0 items-center", collapsed ? "justify-center px-2" : "justify-between pl-4 pr-2.5")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                aria-label="Expand sidebar"
                className="group relative flex size-9 items-center justify-center rounded-lg outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <LogoMark className="size-7 transition-opacity group-hover:opacity-0" />
                <PanelLeftOpen className="absolute size-[18px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Expand <kbd className="ml-1 font-mono text-[10.5px] text-white/60">⌘B</kbd>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <Link href={homeHref} onClick={onNavigate} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
              <Logo size="sm" />
            </Link>
            {onToggle && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-xs" onClick={onToggle} aria-label="Collapse sidebar" className="text-subtle hover:text-foreground">
                    <PanelLeftClose className="size-[17px]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Collapse <kbd className="ml-1 font-mono text-[10.5px] text-white/60">⌘B</kbd>
                </TooltipContent>
              </Tooltip>
            )}
          </>
        )}
      </div>
      {header && !collapsed && <div className="px-3 pb-2">{header}</div>}
      <nav className={cn("flex-1 overflow-y-auto pb-4 scrollbar-none", collapsed ? "px-2" : "px-3")}>
        {sections.map((section, i) => (
          <div key={i} className={cn(i > 0 && (collapsed ? "mt-3 border-t pt-3" : "mt-5"))}>
            {section.label && !collapsed && (
              <div className="mb-1 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-subtle">{section.label}</div>
            )}
            <ul className={cn(collapsed ? "space-y-1" : "space-y-px")}>
              {section.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
                const link = (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-label={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center rounded-md text-[13.5px] font-medium text-[#3f3f46] transition-colors hover:bg-muted hover:text-foreground",
                      collapsed ? "mx-auto size-9 justify-center" : "h-8 gap-2.5 px-2",
                      active && "bg-muted text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn("size-[17px] shrink-0 text-[#8b8b93] transition-colors group-hover:text-foreground", active && "text-primary group-hover:text-primary")}
                      strokeWidth={1.75}
                    />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={cn(
                          "tabular min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold leading-5",
                          typeof item.badge === "number" ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-white",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {collapsed && typeof item.badge === "number" && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary ring-2 ring-white" />}
                  </Link>
                );
                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                          {item.badge !== undefined && <span className="ml-1.5 text-white/60">{item.badge}</span>}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className={cn("border-t", collapsed ? "p-2" : "p-3")}>{footer}</div>}
    </div>
  );
}

function NotificationsButton({ items }: { items: ShellNotification[] }) {
  const [list, setList] = React.useState(items);
  const unread = list.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative text-muted-foreground hover:text-foreground" aria-label="Notifications">
          <Bell className="size-[17px]" strokeWidth={1.75} />
          {unread > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary ring-2 ring-white" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-[13.5px] font-semibold">Notifications</div>
          <button
            className="text-[12px] font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setList((l) => l.map((n) => ({ ...n, unread: false })))}
          >
            Mark all as read
          </button>
        </div>
        <ul className="max-h-[380px] divide-y overflow-y-auto">
          {list.map((n) => (
            <li key={n.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-[#fafafa]">
              <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-medium">{n.title}</p>
                  <span className="shrink-0 text-[11.5px] text-subtle">{n.time}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">{n.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t px-4 py-2.5 text-center">
          <button className="text-[12.5px] font-medium text-primary hover:underline">View all activity</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserMenu({ user, role, profileHref, billingHref, compact }: Pick<AppShellProps, "user" | "role" | "profileHref" | "billingHref"> & { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = React.useState(false);
  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={compact ? `${user.name} menu` : undefined}
          className={cn(
            "flex items-center rounded-lg text-left transition-colors outline-none hover:bg-muted data-[state=open]:bg-muted",
            compact ? "mx-auto size-10 justify-center" : "w-full gap-2.5 p-1.5",
          )}
        >
          <Avatar className="size-8">
            <AvatarFallback style={{ backgroundColor: user.color ?? "#18181B" }} className="text-white">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold leading-tight">{user.name}</div>
                <div className="truncate text-[11.5px] text-muted-foreground">{user.subtitle ?? roleLabel[role]}</div>
              </div>
              <ChevronsUpDown className="size-3.5 text-subtle" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={compact ? "right" : "top"} align={compact ? "end" : "start"} className="w-[232px]">
        <div className="px-2 py-2">
          <div className="text-[13px] font-semibold">{user.name}</div>
          <div className="truncate text-[12px] text-muted-foreground">{user.email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push(profileHref)}>
          <UserRound /> Profile
          <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
        </DropdownMenuItem>
        {billingHref && (
          <DropdownMenuItem onSelect={() => router.push(billingHref)}>
            <CreditCard /> Billing
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => router.push(profileHref)}>
          <Settings /> Settings
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setHelpOpen(true)}>
          <LifeBuoy /> Help & support
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => requestTour(role, pathname, (href) => router.push(href))}>
          <Compass /> Product tour
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
        {(
          [
            ["student", "Student", "/student"],
            ["admin", "AfterAdmit Admin", "/admin"],
            ["partner", "Partner", "/partner"],
          ] as const
        ).map(([key, label, href]) => (
          <DropdownMenuItem key={key} onSelect={() => router.push(href)}>
            <ArrowRightLeft /> {label}
            {role === key && <Check className="ml-auto !text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/login")}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <HelpSheet open={helpOpen} onOpenChange={setHelpOpen} role={role} />
    </>
  );
}

export function AppShell({ role, sections, header, footer, user, notifications, profileHref, billingHref, topAction, mobileNav, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebarFooter = (
    <div className="space-y-2">
      {footer}
      <UserMenu user={user} role={role} profileHref={profileHref} billingHref={billingHref} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r bg-white transition-[width] duration-200 ease-out lg:block",
          collapsed ? "w-[64px]" : "w-[248px]",
        )}
      >
        <SidebarNav
          sections={sections}
          header={header}
          homeHref={`/${role}`}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          footer={collapsed ? <UserMenu user={user} role={role} profileHref={profileHref} billingHref={billingHref} compact /> : sidebarFooter}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 sm:max-w-[280px]">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav sections={sections} header={header} homeHref={`/${role}`} footer={sidebarFooter} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col lg:bg-canvas">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-white/90 px-3 backdrop-blur-md sm:gap-3 sm:px-4 md:px-6">
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Menu className="size-[18px]" />
          </Button>
          <Link href={`/${role}`} className="sm:hidden" aria-label="AfterAdmit home">
            <LogoMark className="size-6" />
          </Link>
          <button
            data-tour="search"
            onClick={() => setPaletteOpen(true)}
            className="group flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-white px-2.5 text-[13px] text-subtle shadow-xs transition-colors hover:border-[#d4d4d8] hover:text-muted-foreground sm:max-w-[420px]"
          >
            <Search className="size-[15px] shrink-0" strokeWidth={2} />
            <span className="flex-1 truncate text-left">
              <span className="sm:hidden">Search</span>
              <span className="hidden sm:inline">Search milestones, posts, people…</span>
            </span>
            <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-[10.5px] font-medium text-muted-foreground sm:inline">⌘K</kbd>
          </button>
          <div className="flex shrink-0 items-center gap-1 sm:ml-auto sm:gap-1.5">
            {topAction}
            <NotificationsButton items={notifications} />
          </div>
        </header>
        <main className={cn("flex-1", mobileNav && "pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0")}>{children}</main>
      </div>
      <DemoTour role={role} />

      {mobileNav && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
          <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
            {mobileNav.map((item) => {
              const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={cn("relative flex h-full flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-colors", active ? "text-ink" : "text-subtle")}
                  >
                    {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                    <span className="relative">
                      <item.icon className={cn("size-[21px]", active && "text-primary")} strokeWidth={active ? 2 : 1.75} />
                      {typeof item.badge === "number" && (
                        <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9.5px] font-bold text-white ring-2 ring-white">{item.badge}</span>
                      )}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} role={role} />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-[12px] font-medium text-muted-foreground">{eyebrow}</div>}
        <h1 className="text-[21px] font-semibold leading-tight tracking-[-0.028em] text-ink sm:text-[24px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:shrink-0">{actions}</div>}
    </div>
  );
}

export function PageContainer({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 py-6 md:px-8 md:py-8", className)}>{children}</div>;
}
