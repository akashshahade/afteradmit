"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type Segment = { label: string; value: number; color: string };

export function SegmentedDonut({
  segments,
  size = 168,
  stroke = 14,
  gap = 4,
  active,
  onActiveChange,
  className,
}: {
  segments: Segment[];
  size?: number;
  stroke?: number;
  gap?: number;
  active: number | null;
  onActiveChange: (i: number | null) => void;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = segments.reduce((n, s) => n + s.value, 0);
  const r = (size - stroke - 6) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  // Round caps extend each arc by stroke/2 on both ends, so the visual gap needs that added back.
  const cut = gap + stroke;

  const lengths = segments.map((s) => (s.value / total) * circ);
  const arcs = lengths.map((len, i) => ({
    start: lengths.slice(0, i).reduce((a, b) => a + b, 0),
    len: Math.max(len - cut, 0.5),
  }));

  const hovered = active !== null ? segments[active] : null;

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} onMouseLeave={() => onActiveChange(null)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        {segments.map((s, i) => {
          const on = active === i;
          const dim = active !== null && !on;
          return (
            <circle
              key={s.label}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={on ? stroke + 4 : stroke}
              strokeLinecap="round"
              strokeDasharray={`${mounted ? arcs[i].len : 0} ${circ}`}
              strokeDashoffset={-(arcs[i].start + cut / 2)}
              tabIndex={0}
              role="img"
              aria-label={`${s.label}: ${Math.round((s.value / total) * 100)}%`}
              onMouseEnter={() => onActiveChange(i)}
              onFocus={() => onActiveChange(i)}
              onBlur={() => onActiveChange(null)}
              className="cursor-pointer outline-none"
              style={{
                opacity: dim ? 0.25 : 1,
                transition: `stroke-dasharray 0.9s cubic-bezier(.22,1,.36,1) ${i * 90}ms, stroke-width .2s ease, opacity .2s ease`,
                filter: on ? `drop-shadow(0 2px 6px ${s.color}55)` : undefined,
              }}
            />
          );
        })}
      </svg>
      {hovered && (
        <div key={active} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="tabular text-[24px] font-semibold leading-none tracking-[-0.03em]" style={{ color: hovered.color }}>
            {Math.round((hovered.value / total) * 100)}%
          </div>
          <div className="mt-1.5 max-w-[60%] text-[11px] font-medium leading-tight text-muted-foreground">{hovered.label}</div>
        </div>
      )}
    </div>
  );
}
