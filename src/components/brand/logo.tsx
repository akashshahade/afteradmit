import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#FF4500" />
      <path d="M8 10.5h5.2l3.3 5.5-3.3 5.5H8l3.3-5.5L8 10.5Z" fill="#fff" fillOpacity=".55" />
      <path d="M14.6 10.5h5.2l3.3 5.5-3.3 5.5h-5.2l3.3-5.5-3.3-5.5Z" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn(size === "sm" && "size-6", size === "md" && "size-7", size === "lg" && "size-9")} />
      <span
        className={cn(
          "font-semibold tracking-[-0.03em] text-ink",
          size === "sm" && "text-[15px]",
          size === "md" && "text-[16.5px]",
          size === "lg" && "text-[21px]",
        )}
      >
        After<span className="text-primary">Admit</span>
      </span>
    </span>
  );
}
