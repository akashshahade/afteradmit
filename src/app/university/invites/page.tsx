"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  Send,
  Share2,
  UploadCloud,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { inviteLinkPath, splitName } from "@/lib/invites";
import { shareInviteLink } from "@/lib/share";
import type { Profile } from "@/lib/auth-profile";
import type { AdmissionBatch } from "@/lib/university-batches";
import { formatDate } from "@/lib/utils";

type RowStatus = "ready" | "invalid" | "duplicate";
type Row = { name: string; email: string; program: string; intake: string; status: RowStatus };
type Step = "upload" | "review" | "sending" | "sent";
type Created = { email: string; token: string; name?: string; first_name?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_ROWS = 5000;

const sample = [
  ["Ananya Sharma", "ananya.sharma@gmail.com"],
  ["Wei Zhang", "wei.zhang@outlook.com"],
  ["Carlos Mendes", "carlos.mendes@gmail.com"],
  ["Grace Kim", "grace.kim@gmail.com"],
].map(([name, email]) => ({ name, email, program: "Full-Time MBA", intake: "Fall 2027" }));

function validate(rows: Omit<Row, "status">[]): Row[] {
  const seen = new Set<string>();
  return rows.slice(0, MAX_ROWS).map((r) => {
    const email = r.email.trim().toLowerCase();
    let status: RowStatus = "ready";
    if (!EMAIL.test(email)) status = "invalid";
    else if (seen.has(email)) status = "duplicate";
    seen.add(email);
    return { ...r, email, status };
  });
}

function parseCsv(text: string): Omit<Row, "status">[] {
  const split = (line: string) =>
    line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.trim().replace(/^"|"$/g, ""));
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  const head = split(lines[0]).map((h) => h.toLowerCase());
  const hasHeader = head.some((h) => h.includes("email"));
  const col = (k: string, fallback: number) => {
    const i = head.findIndex((h) => h.includes(k));
    return hasHeader && i >= 0 ? i : fallback;
  };
  const [n, e, p, t] = [col("name", 0), col("email", 1), col("program", 2), col("intake", 3)];
  return (hasHeader ? lines.slice(1) : lines).map((l) => {
    const c = split(l);
    return {
      name: c[n] ?? "",
      email: c[e] ?? "",
      program: c[p] || "Full-Time MBA",
      intake: c[t] || "Fall 2027",
    };
  });
}

const statusMeta: Record<RowStatus, { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-success/10 text-success" },
  invalid: { label: "Invalid email", className: "bg-destructive-soft text-destructive" },
  duplicate: { label: "Duplicate", className: "bg-warning-soft text-warning" },
};

function Stepper({ step }: { step: Step }) {
  const steps = ["Upload", "Review", "Share"];
  const index = step === "upload" ? 0 : step === "review" ? 1 : 2;
  return (
    <ol className="flex items-center gap-2 text-[12.5px]">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-[11.5px] font-semibold",
              i < index || step === "sent" ? "bg-primary text-white" : i === index ? "bg-ink text-white" : "border text-subtle",
            )}
          >
            {i < index || step === "sent" ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
          </span>
          <span className={cn("font-medium", i <= index ? "text-ink" : "text-subtle")}>{s}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border sm:w-10" />}
        </li>
      ))}
    </ol>
  );
}

export default function UniversityInvitesPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [batches, setBatches] = React.useState<AdmissionBatch[]>([]);
  const [batchId, setBatchId] = React.useState<string>("");
  const [step, setStep] = React.useState<Step>("upload");
  const [rows, setRows] = React.useState<Row[]>([]);
  const [fileName, setFileName] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [createdInvites, setCreatedInvites] = React.useState<Created[]>([]);
  const [oneName, setOneName] = React.useState("");
  const [oneEmail, setOneEmail] = React.useState("");
  const [oneProgram, setOneProgram] = React.useState("Full-Time MBA");
  const [oneIntake, setOneIntake] = React.useState("Fall 2027");
  const [addingOne, setAddingOne] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [{ data }, { data: batchData }] = await Promise.all([
        supabase.rpc("get_my_profile"),
        supabase.rpc("list_school_batches"),
      ]);
      setProfile((Array.isArray(data) ? data[0] : data) as Profile | null);
      const list = (batchData as AdmissionBatch[]) ?? [];
      setBatches(list);
      const active = list.find((b) => b.is_active) ?? list[0];
      if (active) {
        setBatchId(active.id);
        setOneProgram(active.program);
        setOneIntake(active.name);
      }
    })();
  }, []);

  const selectedBatch = batches.find((b) => b.id === batchId);

  React.useEffect(() => {
    if (!selectedBatch) return;
    setOneProgram(selectedBatch.program);
    setOneIntake(selectedBatch.name);
  }, [selectedBatch]);

  const ready = rows.filter((r) => r.status === "ready");
  const issues = rows.length - ready.length;
  const count = (s: RowStatus) => rows.filter((r) => r.status === s).length;
  const schoolName = profile?.school_name ?? "Your university";
  const schoolShort = schoolName.includes("Anderson") ? "Anderson" : schoolName.split(" ")[0] || "School";

  const createInvites = async (
    payload: Record<string, string>[],
    opts?: { onErrorStep?: Step },
  ) => {
    if (!batchId) {
      toast.error("Select a batch before inviting");
      return null;
    }
    setStep("sending");
    setProgress(20);
    try {
      const supabase = createClient();
      setProgress(55);
      const { data, error } = await supabase.rpc("create_student_invites", {
        payload,
        p_batch_id: batchId,
      });
      if (error) throw error;
      const created = (Array.isArray(data) ? data : []) as Created[];
      if (!created.length) {
        throw new Error("No new invites created — that email may already be invited");
      }
      setCreatedInvites(created);
      setProgress(100);
      setStep("sent");
      toast.success(`${created.length} invite${created.length === 1 ? "" : "s"} created`);
      return created;
    } catch (err) {
      setStep(opts?.onErrorStep ?? "review");
      setProgress(0);
      toast.error(err instanceof Error ? err.message : "Could not create invites");
      return null;
    }
  };

  const loadRows = (name: string, parsed: Omit<Row, "status">[]) => {
    const valid = validate(parsed);
    if (!valid.length) {
      toast.error("No rows found", { description: "Check the file has a name and email column." });
      return;
    }
    setFileName(name);
    setRows(valid);
    setStep("review");
  };

  const handleFile = async (file: File) => {
    if (/\.csv$/i.test(file.name)) {
      loadRows(file.name, parseCsv(await file.text()));
    } else if (/\.(xlsx|xls)$/i.test(file.name)) {
      loadRows(file.name, sample);
      toast.message("Excel preview uses sample rows in the pilot — export CSV for real lists.");
    } else {
      toast.error("Unsupported file", { description: "Upload a .csv file." });
    }
  };

  const downloadTemplate = () => {
    const csv = "name,email,program,intake\nAnanya Sharma,ananya.sharma@example.com,Full-Time MBA,Fall 2027\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "afteradmit-invite-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const send = async () => {
    const payload = ready.map((r) => {
      const { first_name, last_name } = splitName(r.name);
      return {
        name: r.name,
        email: r.email,
        first_name,
        last_name,
        program: r.program,
        intake: r.intake,
        school_name: schoolName,
        school_short: schoolShort,
      };
    });
    await createInvites(payload, { onErrorStep: "review" });
  };

  const addOneStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = oneName.trim();
    const email = oneEmail.trim().toLowerCase();
    if (!name || !email) {
      toast.error("Enter a name and email");
      return;
    }
    if (!EMAIL.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    setAddingOne(true);
    const { first_name, last_name } = splitName(name);
    const created = await createInvites(
      [
        {
          name,
          email,
          first_name,
          last_name,
          program: oneProgram.trim() || "Full-Time MBA",
          intake: oneIntake.trim() || "Fall 2027",
          school_name: schoolName,
          school_short: schoolShort,
        },
      ],
      { onErrorStep: "upload" },
    );
    setAddingOne(false);
    if (created) {
      setOneName("");
      setOneEmail("");
    }
  };

  const reset = () => {
    setRows([]);
    setFileName("");
    setCreatedInvites([]);
    setStep("upload");
  };

  const inviteUrl = (token: string) => `${window.location.origin}${inviteLinkPath(token)}`;

  const copyOne = async (item: Created) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(item.token));
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareOne = async (item: Created) => {
    const result = await shareInviteLink({
      url: inviteUrl(item.token),
      studentName: item.name || item.first_name || item.email,
      schoolName,
    });
    if (result === "shared") toast.success("Invite shared");
    else if (result === "copied") toast.success("Invite link copied");
    else if (result === "mailto") toast.message("Opened email draft");
  };

  const shareAll = async () => {
    if (!createdInvites.length) return;
    if (createdInvites.length === 1) {
      await shareOne(createdInvites[0]);
      return;
    }
    const links = createdInvites.map((i) => `${i.email}: ${inviteUrl(i.token)}`).join("\n");
    try {
      await navigator.clipboard.writeText(links);
      toast.success(`${createdInvites.length} invite links copied`);
    } catch {
      toast.error("Could not copy links");
    }
  };

  const copyAll = async () => {
    if (!createdInvites.length) return;
    const links = createdInvites.map((i) => inviteUrl(i.token)).join("\n");
    try {
      await navigator.clipboard.writeText(links);
      toast.success(createdInvites.length === 1 ? "Invite link copied" : `${createdInvites.length} invite links copied`);
    } catch {
      toast.error("Could not copy links");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="University"
        title="Invite students"
        description={`Add admitted students for ${schoolName}, then share personal invite links.`}
        actions={
          <Button size="sm" variant="outline" onClick={downloadTemplate}>
            <Download className="size-4" /> CSV template
          </Button>
        }
      />

      <Card className="mt-6">
        <CardHeader className="border-b pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle>Batch for these invites</CardTitle>
              <CardDescription>
                Students inherit this cohort&apos;s program and start date
                {selectedBatch ? ` (${formatDate(selectedBatch.program_start)})` : ""}.
              </CardDescription>
            </div>
            <Select value={batchId} onValueChange={setBatchId}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} · {b.program}
                    {b.is_active ? " (active)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>New invites</CardTitle>
            <CardDescription>{schoolName}</CardDescription>
          </div>
          <Stepper step={step} />
        </CardHeader>

        <CardContent className="pt-6">
          {step === "upload" && (
            <div className="space-y-8">
              <form onSubmit={(e) => void addOneStudent(e)} className="space-y-4">
                <div>
                  <div className="text-[14px] font-semibold">Add one student</div>
                  <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                    Create a single invite, then share the link.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="one-name">Full name</Label>
                    <Input
                      id="one-name"
                      value={oneName}
                      onChange={(e) => setOneName(e.target.value)}
                      placeholder="Sayali Dhale"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <Label htmlFor="one-email">Email</Label>
                    <Input
                      id="one-email"
                      type="email"
                      value={oneEmail}
                      onChange={(e) => setOneEmail(e.target.value)}
                      placeholder="student@email.com"
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="one-program">Program</Label>
                    <Input
                      id="one-program"
                      value={oneProgram}
                      onChange={(e) => setOneProgram(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="one-intake">Intake</Label>
                    <Input
                      id="one-intake"
                      value={oneIntake}
                      onChange={(e) => setOneIntake(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
                <Button type="submit" variant="ink" disabled={addingOne || step === "sending"}>
                  {addingOne ? "Creating invite…" : "Create invite"}
                  {!addingOne && <UserPlus className="size-4" />}
                </Button>
              </form>

              <div className="flex items-center gap-3 text-[12px] text-subtle">
                <span className="h-px flex-1 bg-border" />
                or upload a list
                <span className="h-px flex-1 bg-border" />
              </div>

              <div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) void handleFile(f);
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors outline-none focus-visible:border-primary/60",
                    dragging ? "border-primary bg-primary-soft/50" : "hover:border-ink/25 hover:bg-[#FCFCFC]",
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <UploadCloud className="size-6" />
                  </span>
                  <div className="mt-4 text-[15px] font-semibold">Drop your admitted-student list here</div>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    CSV · columns: name, email, program, intake
                  </p>
                  <Button size="sm" variant="ink" className="mt-5 pointer-events-none">
                    <FileSpreadsheet className="size-4" /> Choose file
                  </Button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleFile(f);
                      e.target.value = "";
                    }}
                  />
                </div>
                <div className="mt-4 text-right text-[12.5px]">
                  <button
                    type="button"
                    onClick={() => loadRows("sample-fall-2027.csv", sample)}
                    className="font-medium text-ink underline-offset-4 hover:underline"
                  >
                    Try with a sample file
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                <span className="mr-1 flex items-center gap-1.5 font-medium text-ink">
                  <FileSpreadsheet className="size-4 text-muted-foreground" /> {fileName}
                </span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 font-medium text-success">{ready.length} ready</span>
                {count("invalid") > 0 && (
                  <span className="rounded-full bg-destructive-soft px-2 py-0.5 font-medium text-destructive">
                    {count("invalid")} invalid
                  </span>
                )}
                {count("duplicate") > 0 && (
                  <span className="rounded-full bg-warning-soft px-2 py-0.5 font-medium text-warning">
                    {count("duplicate")} duplicate
                  </span>
                )}
              </div>
              <div className="mt-4 max-h-[380px] overflow-auto rounded-xl border">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden sm:table-cell">Program</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i} className={cn(r.status !== "ready" && "bg-[#FCFCFC]")}>
                        <TableCell className="font-medium">{r.name || "—"}</TableCell>
                        <TableCell
                          className={cn(
                            "max-w-[220px] truncate",
                            r.status === "invalid" ? "text-destructive" : "text-muted-foreground",
                          )}
                        >
                          {r.email || "—"}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {r.program} · {r.intake}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium", statusMeta[r.status].className)}>
                            {statusMeta[r.status].label}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {issues > 0 && (
                <p className="mt-3 flex items-start gap-2 text-[12.5px] text-muted-foreground">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {issues} row{issues === 1 ? "" : "s"} with
                  issues will be skipped.
                </p>
              )}
              <div className="mt-5 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-between">
                <Button variant="ghost" onClick={reset}>
                  <ArrowLeft className="size-4" /> Upload a different file
                </Button>
                <Button variant="ink" disabled={!ready.length} onClick={() => void send()}>
                  <Send className="size-4" /> Create {ready.length} invite{ready.length === 1 ? "" : "s"}
                </Button>
              </div>
            </div>
          )}

          {step === "sending" && (
            <div className="flex flex-col items-center py-14 text-center">
              <div className="text-[15px] font-semibold">Creating invites…</div>
              <div className="mt-5 h-1.5 w-full max-w-[360px] overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {step === "sent" && (
            <div className="animate-in fade-in-0 duration-500">
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="size-5" strokeWidth={3} />
                </span>
                <div className="mt-4 text-[18px] font-semibold tracking-tight">
                  {createdInvites.length} invite{createdInvites.length === 1 ? "" : "s"} ready
                </div>
                <p className="mt-1 max-w-[420px] text-[13.5px] text-muted-foreground">
                  Share each link with the student (WhatsApp, email, Messages, copy…).
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={reset}>
                    <UserPlus className="size-4" /> Invite more
                  </Button>
                  <Button variant="outline" disabled={!createdInvites.length} onClick={() => void copyAll()}>
                    <Copy className="size-4" /> Copy {createdInvites.length === 1 ? "link" : "all links"}
                  </Button>
                  <Button variant="ink" disabled={!createdInvites.length} onClick={() => void shareAll()}>
                    <Share2 className="size-4" /> Share {createdInvites.length === 1 ? "invite" : "all"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {createdInvites.map((i) => (
                      <TableRow key={i.token}>
                        <TableCell className="font-medium">{i.email}</TableCell>
                        <TableCell className="hidden max-w-[280px] truncate font-mono text-[11.5px] text-muted-foreground md:table-cell">
                          {inviteLinkPath(i.token)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="xs" variant="outline" onClick={() => void copyOne(i)}>
                              <Copy className="size-3.5" /> Copy
                            </Button>
                            <Button size="xs" variant="outline" onClick={() => void shareOne(i)}>
                              <Share2 className="size-3.5" /> Share
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
