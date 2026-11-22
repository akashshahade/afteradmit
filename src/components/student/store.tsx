"use client";

import * as React from "react";
import { toast } from "sonner";

import { isOverdue, school as schoolDefaults, type Milestone, type MilestoneStatus } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import {
  answersFromProfile,
  applyOnboardingRules,
  blankCatalog,
  mergeProgress,
  progressPayload,
  type OnboardingAnswers,
  type ProgressRow,
} from "@/lib/student-progress";
import type { Profile } from "@/lib/auth-profile";
import type { ProgramDates } from "@/lib/university-batches";

type StudentStore = {
  ready: boolean;
  profile: Profile | null;
  programDates: ProgramDates | null;
  milestones: Milestone[];
  setStatus: (id: string, status: MilestoneStatus) => void;
  toggleTask: (id: string, taskId: string) => void;
  refresh: () => Promise<void>;
  stats: {
    total: number;
    done: number;
    pct: number;
    overdue: number;
    byStage: { stage: number; total: number; done: number }[];
  };
};

const Ctx = React.createContext<StudentStore | null>(null);

async function persistAll(list: Milestone[]) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const rows = progressPayload(list).map((r) => ({
    user_id: user.id,
    milestone_id: r.milestone_id,
    status: r.status,
    completed_at: r.completed_at,
    tasks: r.tasks,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("milestone_progress").upsert(rows, {
    onConflict: "user_id,milestone_id",
  });
  if (error) toast.error(error.message);
}

export function StudentStoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [programDates, setProgramDates] = React.useState<ProgramDates | null>(null);
  const [milestones, setMilestones] = React.useState<Milestone[]>(blankCatalog());

  const refresh = React.useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setReady(true);
      return;
    }

    const [{ data: profileData }, { data: datesData }] = await Promise.all([
      supabase.rpc("get_my_profile"),
      supabase.rpc("get_my_program_dates"),
    ]);
    const prof = (Array.isArray(profileData) ? profileData[0] : profileData) as Profile | null;
    setProfile(prof);

    const datesRow = (Array.isArray(datesData) ? datesData[0] : datesData) as ProgramDates | null;
    setProgramDates(
      datesRow ?? {
        batch_id: "",
        batch_name: schoolDefaults.term,
        program: schoolDefaults.program,
        school_name: schoolDefaults.name,
        program_start: schoolDefaults.dates.programStart,
        orientation_date: schoolDefaults.dates.orientation,
        deposit_deadline: schoolDefaults.dates.depositDeadline,
        housing_deadline: schoolDefaults.dates.housingDeadline,
        health_form_deadline: schoolDefaults.dates.healthFormDeadline,
        insurance_waiver_deadline: schoolDefaults.dates.insuranceWaiverDeadline,
      },
    );

    const { data: rows, error } = await supabase
      .from("milestone_progress")
      .select("milestone_id,status,completed_at,tasks")
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message);
      setReady(true);
      return;
    }

    let list = blankCatalog();
    if (prof?.onboarding_completed_at) {
      const answers: OnboardingAnswers = answersFromProfile(prof);
      list = applyOnboardingRules(list, answers);
    }
    if (rows?.length) {
      list = mergeProgress(list, rows as ProgressRow[]);
    }
    setMilestones(list);
    setReady(true);
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const setStatus = React.useCallback((id: string, status: MilestoneStatus) => {
    setMilestones((ms) => {
      const next = ms.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              completedAt: status === "done" ? new Date().toISOString().slice(0, 10) : undefined,
              tasks: status === "done" ? m.tasks.map((t) => ({ ...t, done: true })) : m.tasks,
            }
          : m,
      );
      void persistAll(next);
      return next;
    });
  }, []);

  const toggleTask = React.useCallback((id: string, taskId: string) => {
    setMilestones((ms) => {
      const next = ms.map((m) => {
        if (m.id !== id) return m;
        const tasks = m.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
        const doneCount = tasks.filter((t) => t.done).length;
        const status: MilestoneStatus =
          m.status === "not_applicable"
            ? m.status
            : doneCount === 0
              ? "not_started"
              : doneCount === tasks.length
                ? "done"
                : "in_progress";
        return {
          ...m,
          tasks,
          status,
          completedAt: status === "done" ? new Date().toISOString().slice(0, 10) : undefined,
        };
      });
      void persistAll(next);
      return next;
    });
  }, []);

  const stats = React.useMemo(() => {
    const applicable = milestones.filter((m) => m.status !== "not_applicable");
    const done = applicable.filter((m) => m.status === "done").length;
    const total = Math.max(applicable.length, 1);
    return {
      total: applicable.length,
      done,
      pct: Math.round((done / total) * 100),
      overdue: milestones.filter(isOverdue).length,
      byStage: Array.from({ length: 9 }, (_, i) => {
        const s = applicable.filter((m) => m.stage === i + 1);
        return { stage: i + 1, total: s.length, done: s.filter((m) => m.status === "done").length };
      }),
    };
  }, [milestones]);

  return (
    <Ctx.Provider value={{ ready, profile, programDates, milestones, setStatus, toggleTask, refresh, stats }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStudent() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useStudent must be used inside StudentStoreProvider");
  return v;
}
