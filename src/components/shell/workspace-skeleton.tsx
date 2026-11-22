import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/brand/logo";

export function WorkspaceSkeleton({ label = "Loading your workspace…" }: { label?: string }) {
  return (
    <div className="flex min-h-dvh bg-[#fafafa]">
      <aside className="hidden w-[260px] shrink-0 flex-col border-r bg-white p-4 lg:flex">
        <div className="flex h-10 items-center">
          <Logo size="sm" />
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-[90%] rounded-lg" />
          <Skeleton className="h-9 w-[85%] rounded-lg" />
          <Skeleton className="h-9 w-[70%] rounded-lg" />
        </div>
        <div className="mt-8 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-[88%] rounded-lg" />
          <Skeleton className="h-8 w-[75%] rounded-lg" />
        </div>
        <div className="mt-auto space-y-2 pt-6">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4 sm:px-6">
          <Logo size="sm" className="lg:hidden" />
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-[1080px] space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>
            <Skeleton className="h-[220px] w-full rounded-2xl" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
            <p className="pt-2 text-center text-[12.5px] text-muted-foreground">{label}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
