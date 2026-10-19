"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type Ring = { value: number; color: string; track?: string; label?: string; display?: string };

export function ActivityRings({
  rings,
  size = 160,
  stroke = 14,
  gap = 4,
  className,
  children,
  active: activeProp,
  onActiveChange,
  interactive,
}: {
  rings: Ring[];
  size?: number;
  stroke?: number;
  gap?: number;
  className?: string;
  children?: React.ReactNode;
  active?: number | null;
  onActiveChange?: (i: number | null) => void;
  interactive?: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [hoverLocal, setHoverLocal] = React.useState<number | null>(null);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isInteractive = interactive ?? (rings.length > 1 || !!onActiveChange);
  const active = activeProp !== undefined ? activeProp : hoverLocal;
  const setActive = (i: number | null) => {
    setHoverLocal(i);
    onActiveChange?.(i);
  };
  const hovered = active !== null && active !== undefined ? rings[active] : undefined;

  const c = size / 2;
  // Diameter of the empty space inside the innermost ring; centre text is sized to fit it.
  const hole = size - 2 * (rings.length * stroke + (rings.length - 1) * gap);
  const valueSize = hole >= 90 ? 26 : hole >= 64 ? 20 : 15;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} onMouseLeave={() => isInteractive && setActive(null)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        {rings.map((ring, i) => {
          const r = c - stroke / 2 - i * (stroke + gap);
          const circ = 2 * Math.PI * r;
          const v = Math.max(0, Math.min(1, ring.value));
          const dim = isInteractive && active !== null && active !== undefined && active !== i;
          const on = isInteractive && active === i;
          return (
            <g
              key={i}
              onMouseEnter={() => isInteractive && setActive(i)}
              onFocus={() => isInteractive && setActive(i)}
              onBlur={() => isInteractive && setActive(null)}
              tabIndex={isInteractive ? 0 : undefined}
              role={isInteractive ? "img" : undefined}
              aria-label={ring.label ? `${ring.label}: ${ring.display ?? Math.round(v * 100) + "%"}` : undefined}
              className={cn("outline-none transition-opacity duration-200", isInteractive && "cursor-pointer")}
              style={{ opacity: dim ? 0.28 : 1, pointerEvents: isInteractive ? "stroke" : "none" }}
            >
              <circle cx={c} cy={c} r={r} fill="none" stroke={ring.track ?? ring.color} strokeOpacity={ring.track ? 1 : 0.14} strokeWidth={stroke} />
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={on ? stroke + 2 : stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={mounted ? circ * (1 - v) : circ}
                style={{
                  transition: `stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1) ${i * 120}ms, stroke-width .2s ease`,
                  filter: on ? `drop-shadow(0 0 6px ${ring.color}66)` : undefined,
                }}
              />
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {hovered?.label ? (
          <div key={active} className="animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="tabular font-semibold leading-none tracking-tight" style={{ color: hovered.color, fontSize: valueSize }}>
              {hovered.display ?? `${Math.round(hovered.value * 100)}%`}
            </div>
            <div className="mx-auto mt-1.5 line-clamp-2 font-medium leading-tight text-muted-foreground" style={{ fontSize: hole >= 64 ? 11 : 10, maxWidth: hole * 0.78 }}>
              {hovered.label}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function MiniRing({ value, size = 36, stroke = 4, color = "#FF4500", className, children }: { value: number; size?: number; stroke?: number; color?: string; className?: string; children?: React.ReactNode }) {
  return (
    <ActivityRings rings={[{ value, color }]} size={size} stroke={stroke} className={className} interactive={false}>
      {children}
    </ActivityRings>
  );
}
