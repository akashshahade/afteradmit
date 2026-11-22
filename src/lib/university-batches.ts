export type BatchStatus = "planning" | "open" | "closed";

export type AdmissionBatch = {
  id: string;
  school_name: string;
  name: string;
  program: string;
  status: BatchStatus;
  is_active: boolean;
  program_start: string;
  orientation_date: string | null;
  deposit_deadline: string | null;
  housing_deadline: string | null;
  health_form_deadline: string | null;
  insurance_waiver_deadline: string | null;
  invite_count?: number;
  joined_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type SchoolSettings = {
  name: string;
  full_name: string;
  short_name: string;
  timezone: string;
  support_email: string | null;
  updated_at?: string;
};

export type ProgramDates = {
  batch_id: string;
  batch_name: string;
  program: string;
  school_name: string;
  program_start: string;
  orientation_date: string | null;
  deposit_deadline: string | null;
  housing_deadline: string | null;
  health_form_deadline: string | null;
  insurance_waiver_deadline: string | null;
};

export const BATCH_STATUS_LABEL: Record<BatchStatus, string> = {
  planning: "Planning",
  open: "Open",
  closed: "Closed",
};
