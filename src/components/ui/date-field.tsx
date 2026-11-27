"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= days; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function DateField({
  id,
  value,
  onChange,
  placeholder = "Select a date",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const selected = parseIso(value);
  const [open, setOpen] = React.useState(false);
  const [cursor, setCursor] = React.useState(() => selected ?? new Date());

  React.useEffect(() => {
    if (selected) setCursor(selected);
  }, [value]);

  const cells = monthGrid(cursor.getFullYear(), cursor.getMonth());
  const label = selected
    ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn("h-10 w-full justify-start font-normal", !selected && "text-muted-foreground")}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="text-[13px] font-semibold">
            {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} />;
            const iso = toIso(date);
            const active = iso === value;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  onChange(iso);
                  setOpen(false);
                }}
                className={cn(
                  "h-8 rounded-md text-[12.5px] hover:bg-muted",
                  active && "bg-ink font-semibold text-white hover:bg-ink",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between border-t pt-2">
          <button type="button" className="text-[12px] text-muted-foreground hover:text-foreground" onClick={() => onChange("")}>
            Clear
          </button>
          <button
            type="button"
            className="text-[12px] font-medium text-primary"
            onClick={() => {
              const today = toIso(new Date());
              onChange(today);
              setOpen(false);
            }}
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
