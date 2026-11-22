"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Layers, Pencil, Plus, Star } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/client";
import {
  BATCH_STATUS_LABEL,
  type AdmissionBatch,
  type BatchStatus,
} from "@/lib/university-batches";

type FormState = {
  id?: string;
  name: string;
  program: string;
  status: BatchStatus;
  is_active: boolean;
  program_start: string;
  orientation_date: string;
  deposit_deadline: string;
  housing_deadline: string;
  health_form_deadline: string;
  insurance_waiver_deadline: string;
};

const emptyForm = (): FormState => ({
  name: "",
  program: "Full-Time MBA",
  status: "open",
  is_active: false,
  program_start: "",
  orientation_date: "",
  deposit_deadline: "",
  housing_deadline: "",
  health_form_deadline: "",
  insurance_waiver_deadline: "",
});

function fromBatch(b: AdmissionBatch): FormState {
  return {
    id: b.id,
    name: b.name,
    program: b.program,
    status: b.status,
    is_active: b.is_active,
    program_start: b.program_start ?? "",
    orientation_date: b.orientation_date ?? "",
    deposit_deadline: b.deposit_deadline ?? "",
    housing_deadline: b.housing_deadline ?? "",
    health_form_deadline: b.health_form_deadline ?? "",
    insurance_waiver_deadline: b.insurance_waiver_deadline ?? "",
  };
}

export default function UniversityBatchesPage() {
  const [batches, setBatches] = React.useState<AdmissionBatch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(emptyForm);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_school_batches");
      if (error) throw error;
      setBatches((data as AdmissionBatch[]) ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load batches");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!form.name.trim() || !form.program_start) {
      toast.error("Name and program start date are required");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("upsert_admission_batch", {
        payload: {
          id: form.id ?? null,
          name: form.name.trim(),
          program: form.program.trim(),
          status: form.status,
          is_active: form.is_active,
          program_start: form.program_start,
          orientation_date: form.orientation_date || null,
          deposit_deadline: form.deposit_deadline || null,
          housing_deadline: form.housing_deadline || null,
          health_form_deadline: form.health_form_deadline || null,
          insurance_waiver_deadline: form.insurance_waiver_deadline || null,
        },
      });
      if (error) throw error;
      toast.success(form.id ? "Batch updated" : "Batch created");
      setOpen(false);
      setForm(emptyForm());
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save batch");
    } finally {
      setSaving(false);
    }
  };

  const setActive = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("set_active_batch", { p_batch_id: id });
      if (error) throw error;
      toast.success("Active batch updated");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not set active batch");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Admissions"
        title="Batches"
        description="Define cohorts with a program start date. Invites and student countdowns follow the batch you assign."
        actions={
          <Button
            size="sm"
            variant="ink"
            onClick={() => {
              setForm(emptyForm());
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> New batch
          </Button>
        }
      />

      <div className="mt-6 grid gap-4">
        {loading && (
          <Card>
            <CardContent className="py-10 text-center text-[13px] text-muted-foreground">Loading batches…</CardContent>
          </Card>
        )}
        {!loading && batches.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Layers className="size-8 text-muted-foreground" />
              <div className="text-[14px] font-semibold">No batches yet</div>
              <p className="max-w-sm text-[13px] text-muted-foreground">
                Create a Fall / Spring cohort with a program start date so students know when classes begin.
              </p>
              <Button
                variant="ink"
                onClick={() => {
                  setForm(emptyForm());
                  setOpen(true);
                }}
              >
                <Plus className="size-4" /> Create first batch
              </Button>
            </CardContent>
          </Card>
        )}

        {batches.map((b) => (
            <Card
              key={b.id}
              className={cn(
                "overflow-hidden border-[#e8e8ec] shadow-sm",
                b.is_active && "border-l-[3px] border-l-primary ring-1 ring-primary/10",
              )}
            >
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-[16px]">
                    {b.name} · {b.program}
                  </CardTitle>
                  {b.is_active && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="size-3 fill-current" /> Active
                    </Badge>
                  )}
                  <Badge variant="outline">{BATCH_STATUS_LABEL[b.status]}</Badge>
                </div>
                <CardDescription className="mt-1">
                  Program starts {formatDate(b.program_start)}
                  {b.orientation_date ? ` · Orientation ${formatDate(b.orientation_date)}` : ""}
                </CardDescription>
              </div>
              <div className="flex shrink-0 gap-2">
                {!b.is_active && (
                  <Button size="xs" variant="outline" onClick={() => void setActive(b.id)}>
                    <Check className="size-3.5" /> Make active
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setForm(fromBatch(b));
                    setOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4 sm:grid-cols-4">
              <div>
                <div className="text-[11.5px] font-medium uppercase tracking-wide text-subtle">Invited</div>
                <div className="mt-1 text-[20px] font-semibold tabular">{b.invite_count ?? 0}</div>
              </div>
              <div>
                <div className="text-[11.5px] font-medium uppercase tracking-wide text-subtle">Joined</div>
                <div className="mt-1 text-[20px] font-semibold tabular">{b.joined_count ?? 0}</div>
              </div>
              <div>
                <div className="text-[11.5px] font-medium uppercase tracking-wide text-subtle">Housing deadline</div>
                <div className="mt-1 text-[13.5px] font-medium">
                  {b.housing_deadline ? formatDate(b.housing_deadline) : "—"}
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-medium uppercase tracking-wide text-subtle">Deposit deadline</div>
                <div className="mt-1 text-[13.5px] font-medium">
                  {b.deposit_deadline ? formatDate(b.deposit_deadline) : "—"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{form.id ? "Edit batch" : "New batch"}</SheetTitle>
            <SheetDescription>
              Program start drives the student countdown. Other deadlines help you track admissions readiness.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="batch-name">Cohort name</Label>
              <Input
                id="batch-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Fall 2028"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-program">Program</Label>
              <Input
                id="batch-program"
                value={form.program}
                onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as BatchStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(BATCH_STATUS_LABEL) as BatchStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {BATCH_STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-start">Program start</Label>
                <Input
                  id="program-start"
                  type="date"
                  value={form.program_start}
                  onChange={(e) => setForm((f) => ({ ...f, program_start: e.target.value }))}
                />
              </div>
            </div>
            {(
              [
                ["orientation_date", "Orientation"],
                ["deposit_deadline", "Deposit deadline"],
                ["housing_deadline", "Housing deadline"],
                ["health_form_deadline", "Health forms"],
                ["insurance_waiver_deadline", "Insurance waiver"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="date"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <label className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px]">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="size-4 rounded border"
              />
              Set as active batch for invites & overview
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="ink" disabled={saving} onClick={() => void save()}>
                {saving ? "Saving…" : "Save batch"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
