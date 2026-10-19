import { GraduationCap, House, Stamp, TreePalm, UsersRound, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Community } from "@/lib/community-data";

const icons: Record<string, LucideIcon> = {
  AndersonFall27: GraduationCap,
  Housing: House,
  Roommates: UsersRound,
  F1Visa: Stamp,
  Finance: Wallet,
  WestwoodLife: TreePalm,
};

const UCLA_BLUE = "#107BB6";

function UclaLettering({ className }: { className?: string }) {
  return (
    // "UCLA" lettering from ucla-anderson.svg, cropped to its glyph bounds
    <svg viewBox="13 9.5 67.5 24.5" className={className} fill="#fff" aria-hidden>
      <path d="M14.7,26.2c-0.1-0.7-0.1-1.7-0.1-2.2l1-12h3.8l-1.1,12.1c-0.2,2.6,0.8,4.5,3.3,4.5c2.6,0,4-1.9,4.2-4.2L27.1,12H31l-1.1,12.2c-0.4,4.7-3.5,8.2-8.4,8.2C17.7,32.5,15.2,29.9,14.7,26.2" />
      <path d="M31.9,22.2c0.5-5.8,4.3-10.5,10.9-10.5c1.7,0,3.4,0.4,5.1,1.5l-0.4,4.8c-1.5-2-3.3-2.4-5-2.4c-4.1,0-6.3,2.9-6.7,6.6c-0.3,3.6,1.5,6.5,5.5,6.5c1.7,0,3.6-0.5,5.5-2.5L46.3,31c-1.9,1-3.6,1.5-5.4,1.5C34.4,32.5,31.4,27.6,31.9,22.2" />
      <path d="M50.9,12h3.8l-1.4,16.3h5.5c0.4,0,1.7,0,2,0c0,0.2-0.3,3.8-0.3,3.8H49.2L50.9,12z" />
      <path d="M70.9,19.5c0.1-0.3,0.2-0.6,0.3-0.8h0.1c0,0.2,0.1,0.5,0.2,0.9c0.2,0.9,1.7,6,1.7,6h-4.8C68.3,25.5,70.9,19.6,70.9,19.5 M71.9,11.1h-0.3L61.1,32h4.1l1.5-3.2h7.4L75,32h4.1L71.9,11.1z" />
    </svg>
  );
}

export function SpaceIcon({ community, size = 20, shape = "rounded", className }: { community: Community; size?: number; shape?: "rounded" | "circle"; className?: string }) {
  const Icon = icons[community.id] ?? GraduationCap;
  const color = community.logo === "ucla" ? UCLA_BLUE : community.color;
  const big = size >= 36;

  return (
    <span
      role="img"
      aria-label={community.name}
      className={cn("relative flex shrink-0 items-center justify-center overflow-hidden text-white", className)}
      style={{
        width: size,
        height: size,
        borderRadius: shape === "circle" ? 9999 : Math.round(size * 0.3),
        background: `linear-gradient(150deg, color-mix(in oklab, ${color} 70%, white) 0%, ${color} 55%, color-mix(in oklab, ${color} 82%, black) 100%)`,
        boxShadow: big ? "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 6px rgba(0,0,0,0.12)" : "inset 0 1px 0 rgba(255,255,255,0.22)",
      }}
    >
      {big && <span aria-hidden className="absolute -right-[18%] -top-[18%] size-[70%] rounded-full bg-white/10" />}
      {community.logo === "ucla" && big ? (
        <UclaLettering className="relative w-[64%] translate-x-[1px]" />
      ) : (
        <Icon className="relative" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={big ? 1.75 : 2.25} />
      )}
    </span>
  );
}
