"use client";

import * as React from "react";

import { milestones as seed, type Milestone, type MilestoneStatus, isOverdue } from "@/lib/data";

type StudentStore = {
  milestones: Milestone[];
  setStatus: (id: string, status: MilestoneStatus) => void;
  toggleTask: (id: string, taskId: string) => void;
  stats: {
    total: number;
    done: number;
    pct: number;
    overdue: number;
    byStage: { stage: number; total: number; done: number }[];
  };
};

const Ctx = React.createContext<StudentStore | null>(null);

export function StudentStoreProvider({ children }: { children: React.ReactNode }) {
  const [milestones, setMilestones] = React.useState<Milestone[]>(seed);

  const setStatus = React.useCallback((id: string, status: MilestoneStatus) => {
    setMilestones((ms) =>
      ms.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              completedAt: status === "done" ? "2027-05-18" : undefined,
              tasks: status === "done" ? m.tasks.map((t) => ({ ...t, done: true })) : m.tasks,
            }
          : m,
      ),
    );
  }, []);

  const toggleTask = React.useCallback((id: string, taskId: string) => {
    setMilestones((ms) =>
      ms.map((m) => {
        if (m.id !== id) return m;
        const tasks = m.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
        const doneCount = tasks.filter((t) => t.done).length;
        const status: MilestoneStatus = m.status === "not_applicable" ? m.status : doneCount === 0 ? "not_started" : doneCount === tasks.length ? "done" : "in_progress";
        return { ...m, tasks, status, completedAt: status === "done" ? "2027-05-18" : undefined };
      }),
    );
  }, []);

  const stats = React.useMemo(() => {
    const applicable = milestones.filter((m) => m.status !== "not_applicable");
    const done = applicable.filter((m) => m.status === "done").length;
    return {
      total: applicable.length,
      done,
      pct: Math.round((done / applicable.length) * 100),
      overdue: milestones.filter(isOverdue).length,
      byStage: Array.from({ length: 9 }, (_, i) => {
        const s = applicable.filter((m) => m.stage === i + 1);
        return { stage: i + 1, total: s.length, done: s.filter((m) => m.status === "done").length };
      }),
    };
  }, [milestones]);

  return <Ctx.Provider value={{ milestones, setStatus, toggleTask, stats }}>{children}</Ctx.Provider>;
}

export function useStudent() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useStudent must be used inside StudentStoreProvider");
  return v;
}
