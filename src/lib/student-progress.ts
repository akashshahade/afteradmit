import {
  milestones as catalog,
  type Milestone,
  type MilestoneStatus,
  type Task,
} from "@/lib/data";

export type OnboardingAnswers = {
  program: string;
  country: string;
  visa: string;
  funding: string[];
  dependents: boolean;
  housing: string;
  offerAccepted: boolean;
};

export type ProgressRow = {
  milestone_id: string;
  status: MilestoneStatus;
  completed_at: string | null;
  tasks: Task[];
};

export function blankCatalog(): Milestone[] {
  return catalog.map((m) => ({
    ...m,
    status: "not_started" as const,
    completedAt: undefined,
    tasks: m.tasks.map((t) => ({ ...t, done: false })),
  }));
}

/** Apply onboarding rules to hide / complete milestones for a new student. */
export function applyOnboardingRules(list: Milestone[], answers: OnboardingAnswers): Milestone[] {
  const domestic = answers.visa === "Domestic";
  const hasLoan = answers.funding.some((f) => /loan/i.test(f));
  const hasSponsor = answers.funding.some((f) => /sponsor/i.test(f));
  const onCampus = /on-campus/i.test(answers.housing);
  const offCampus = /off-campus/i.test(answers.housing);

  return list.map((m) => {
    let status: MilestoneStatus = m.status;
    let tasks = m.tasks;
    let completedAt = m.completedAt;

    const na = () => {
      status = "not_applicable";
      completedAt = undefined;
    };

    if (m.international && domestic) na();
    if (m.id === "m8" && !hasLoan) na(); // Loan secured
    if (m.id === "m21" && !offCampus) na(); // Lease signed (off-campus)
    if (m.rule?.toLowerCase().includes("sponsor") && !hasSponsor) na();
    if (m.title.toLowerCase().includes("dependent") && !answers.dependents) na();
    if (m.id === "m19") {
      // Housing type decided — mark done from onboarding choice
      status = "done";
      completedAt = new Date().toISOString().slice(0, 10);
      tasks = tasks.map((t) => ({ ...t, done: true }));
    }
    if (m.id === "m1" && answers.offerAccepted) {
      status = "done";
      completedAt = new Date().toISOString().slice(0, 10);
      tasks = tasks.map((t) => ({ ...t, done: true }));
    }
    // On-campus housing application — N/A if off-campus
    if (/on-campus housing/i.test(m.title) && offCampus) na();
    if (onCampus && m.id === "m21") na();

    return { ...m, status, tasks, completedAt };
  });
}

export function mergeProgress(list: Milestone[], rows: ProgressRow[]): Milestone[] {
  const map = new Map(rows.map((r) => [r.milestone_id, r]));
  return list.map((m) => {
    const row = map.get(m.id);
    if (!row) return m;
    const tasks =
      Array.isArray(row.tasks) && row.tasks.length
        ? m.tasks.map((t) => {
            const match = row.tasks.find((x) => x.id === t.id);
            return match ? { ...t, done: !!match.done } : t;
          })
        : m.tasks;
    return {
      ...m,
      status: row.status,
      completedAt: row.completed_at ?? undefined,
      tasks,
    };
  });
}

export function progressPayload(list: Milestone[]) {
  return list.map((m) => ({
    milestone_id: m.id,
    status: m.status,
    completed_at: m.completedAt ?? null,
    tasks: m.tasks,
  }));
}

export function answersFromProfile(p: {
  program?: string | null;
  home_country?: string | null;
  visa_type?: string | null;
  funding?: unknown;
  dependents?: boolean | null;
  housing?: string | null;
  offer_accepted?: boolean | null;
}): OnboardingAnswers {
  const funding = Array.isArray(p.funding) ? (p.funding as string[]) : [];
  return {
    program: p.program || "Full-Time MBA",
    country: p.home_country || "Other country",
    visa: p.visa_type || "F-1",
    funding,
    dependents: !!p.dependents,
    housing: p.housing || "Not sure yet",
    offerAccepted: !!p.offer_accepted,
  };
}
