"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  spark,
}: {
  label: string;
  value: React.ReactNode;
  delta?: number;
  hint?: string;
  icon?: React.ElementType;
  spark?: number[];
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-muted-foreground">{label}</span>
        {Icon && <Icon className="size-4 text-subtle" strokeWidth={1.8} />}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="tabular text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink">{value}</div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px]">
            {delta !== undefined && (
              <span className={cn("inline-flex items-center gap-0.5 font-semibold", up ? "text-success" : "text-destructive")}>
                {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {Math.abs(delta)}%
              </span>
            )}
            {hint && <span className="text-muted-foreground">{hint}</span>}
          </div>
        </div>
        {spark && <Sparkline data={spark} />}
      </div>
    </div>
  );
}

export function Sparkline({ data, color = "#FF4500", width = 88, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((d, i) => [(i / (data.length - 1)) * width, height - ((d - min) / (max - min || 1)) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const id = React.useId();
  return (
    <svg width={width} height={height} className="shrink-0 overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width} ${height} L0 ${height} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean;
  payload?: { name?: string; value: number; color?: string; dataKey?: string; payload?: { fill?: string } }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[140px] rounded-lg border bg-white px-3 py-2 text-[12px] shadow-md">
      {label && <div className="mb-1 text-muted-foreground">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
          <span className="flex-1 capitalize text-muted-foreground">{p.name ?? p.dataKey}</span>
          <span className="tabular font-semibold">
            {p.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}
