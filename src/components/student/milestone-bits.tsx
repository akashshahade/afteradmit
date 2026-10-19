import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { daysBetween, dueLabel, isOverdue, TODAY, type Milestone, type MilestoneStatus } from "@/lib/data";

export function StatusIcon({ status, overdue, className }: { status: MilestoneStatus; overdue?: boolean; className?: string }) {
  if (status === "done")
    return (
      <span className={cn("flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary text-white", className)}>
        <Check className="size-3" strokeWidth={3} />
      </span>
    );
  if (status === "not_applicable")
    return (
      <span className={cn("flex size-[18px] shrink-0 items-center justify-center rounded-full bg-muted text-subtle", className)}>
        <Minus className="size-3" strokeWidth={3} />
      </span>
    );
  if (status === "in_progress")
    return (
      <span className={cn("relative flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px]", overdue ? "border-destructive" : "border-primary", className)}>
        <span className={cn("absolute inset-[3px] rounded-full", overdue ? "bg-destructive" : "bg-primary")} style={{ clipPath: "inset(0 50% 0 0)" }} />
      </span>
    );
  return <span className={cn("block size-[18px] shrink-0 rounded-full border-[1.5px] border-dashed", overdue ? "border-destructive" : "border-[#c4c4ca]", className)} />;
}

export function DueBadge({ milestone }: { milestone: Pick<Milestone, "status" | "due"> }) {
  if (milestone.status === "done") return <Badge variant="success">Done</Badge>;
  if (milestone.status === "not_applicable") return <Badge variant="secondary">N/A</Badge>;
  if (isOverdue(milestone)) return <Badge variant="destructive">{dueLabel(milestone.due)}</Badge>;
  const d = daysBetween(TODAY, milestone.due);
  if (d <= 14) return <Badge variant="warning">{dueLabel(milestone.due)}</Badge>;
  return <Badge variant="outline" className="font-normal text-muted-foreground">{dueLabel(milestone.due)}</Badge>;
}

export const statusLabel: Record<MilestoneStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
  not_applicable: "Not applicable",
};
