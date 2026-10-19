"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Check, Copy, Download, FileSpreadsheet, Mail, RotateCw, Send, UploadCloud, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { KpiCard } from "@/components/charts/chart-bits";
import { universities } from "@/lib/ops-data";

type RowStatus = "ready" | "invalid" | "duplicate" | "existing";
type Row = { name: string; email: string; program: string; intake: string; status: RowStatus };
type Step = "upload" | "review" | "sending" | "sent";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_ROWS = 5000;

const tracking = [
  { name: "Sayali D.", email: "sayali.d@gmail.com", sent: "Apr 28", status: "Joined" },
  { name: "Arjun Mehta", email: "arjun.m@gmail.com", sent: "Apr 28", status: "Joined" },
  { name: "Sofia Alvarez", email: "sofia.alvarez@gmail.com", sent: "Apr 28", status: "Joined" },
  { name: "Rohan Iyer", email: "rohan.iyer@outlook.com", sent: "Apr 28", status: "Opened" },
  { name: "Kenji Watanabe", email: "kenji.w@gmail.com", sent: "Apr 29", status: "Joined" },
  { name: "Ji-woo Park", email: "jiwoo.park@naver.com", sent: "Apr 29", status: "Sent" },
  { name: "Amara Okafor", email: "amara.o@gmail.com", sent: "Apr 29", status: "Joined" },
  { name: "Lucas Bernard", email: "lucas.bernard@orange.fr", sent: "Apr 30", status: "Bounced" },
  { name: "Maya Chen", email: "maya.chen@gmail.com", sent: "Apr 30", status: "Joined" },
  { name: "Mateo Rossi", email: "mateo.rossi@gmail.com", sent: "May 2", status: "Sent" },
] as const;

const existing = new Set<string>(tracking.map((t) => t.email));

const sample = [
  ["Ananya Sharma", "ananya.sharma@gmail.com"],
  ["Wei Zhang", "wei.zhang@outlook.com"],
  ["Carlos Mendes", "carlos.mendes@gmail.com"],
  ["Fatima Al-Sayed", "fatima.alsayed@yahoo.com"],
  ["Lukas Becker", "lukas.becker@gmx.de"],
  ["Priyanka Nair", "priyanka.nair@gmail"],
  ["Tomás Ruiz", "tomas.ruiz@gmail.com"],
  ["Grace Kim", "grace.kim@gmail.com"],
  ["Wei Zhang", "wei.zhang@outlook.com"],
  ["Oluwaseun Adeyemi", "seun.adeyemi@gmail.com"],
  ["Sayali D.", "sayali.d@gmail.com"],
  ["Hannah Müller", "hannah.mueller@web.de"],
].map(([name, email]) => ({ name, email, program: "MBA", intake: "Fall 2027" }));

function validate(rows: Omit<Row, "status">[]): Row[] {
  const seen = new Set<string>();
  return rows.slice(0, MAX_ROWS).map((r) => {
    const email = r.email.trim().toLowerCase();
    let status: RowStatus = "ready";
    if (!EMAIL.test(email)) status = "invalid";
    else if (seen.has(email)) status = "duplicate";
    else if (existing.has(email)) status = "existing";
    seen.add(email);
    return { ...r, email, status };
  });
}

function parseCsv(text: string): Omit<Row, "status">[] {
  const split = (line: string) => line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.trim().replace(/^"|"$/g, ""));
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
    return { name: c[n] ?? "", email: c[e] ?? "", program: c[p] || "MBA", intake: c[t] || "Fall 2027" };
  });
}

const statusMeta: Record<RowStatus, { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-success/10 text-success" },
  invalid: { label: "Invalid email", className: "bg-destructive-soft text-destructive" },
  duplicate: { label: "Duplicate", className: "bg-warning-soft text-warning" },
  existing: { label: "Already invited", className: "bg-muted text-muted-foreground" },
};

const trackingMeta: Record<string, string> = {
  Joined: "bg-success/10 text-success",
  Opened: "bg-primary-soft text-primary",
  Sent: "bg-muted text-muted-foreground",
  Bounced: "bg-destructive-soft text-destructive",
};

function Stepper({ step }: { step: Step }) {
  const steps = ["Upload", "Review", "Send"];
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

export default function InvitesPage() {
  const live = universities.filter((u) => u.status !== "Draft");
  const [uniId, setUniId] = React.useState(live[0].id);
  const uni = live.find((u) => u.id === uniId)!;
  const [step, setStep] = React.useState<Step>("upload");
  const [rows, setRows] = React.useState<Row[]>([]);
  const [fileName, setFileName] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [filter, setFilter] = React.useState<"All" | "Joined" | "Not joined" | "Bounced">("All");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const ready = rows.filter((r) => r.status === "ready");
  const issues = rows.length - ready.length;
  const count = (s: RowStatus) => rows.filter((r) => r.status === s).length;

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
    } else {
      toast.error("Unsupported file", { description: "Upload a .csv or .xlsx file." });
    }
  };

  const downloadTemplate = () => {
    const csv = "name,email,program,intake\nAnanya Sharma,ananya.sharma@example.com,MBA,Fall 2027\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "afteradmit-invite-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const send = () => {
    setStep("sending");
    setProgress(0);
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + 9 + Math.random() * 14);
      setProgress(p);
      if (p < 100) window.setTimeout(tick, 140);
      else
        window.setTimeout(() => {
          setStep("sent");
          toast.success(`${ready.length} invites sent`, { description: `${uni.short} · ${uni.terms[0] ?? "Fall 2027"}` });
        }, 300);
    };
    window.setTimeout(tick, 200);
  };

  const reset = () => {
    setRows([]);
    setFileName("");
    setStep("upload");
  };

  const shown = tracking.filter((t) => filter === "All" || (filter === "Joined" ? t.status === "Joined" : filter === "Bounced" ? t.status === "Bounced" : t.status === "Sent" || t.status === "Opened"));
  const notJoined = uni.students - uni.signedUp;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Content"
        title="Invite students"
        description="Upload an admitted class to send each student a personal, branded invite."
        actions={
          <Button size="sm" variant="outline" onClick={downloadTemplate}>
            <Download className="size-4" /> CSV template
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Select value={uniId} onValueChange={(v) => { setUniId(v); reset(); }}>
          <SelectTrigger size="sm" className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {live.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.short}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="fall-2027">
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fall-2027">Fall 2027</SelectItem>
            <SelectItem value="spring-2028">Spring 2028</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mt-5">
        <CardHeader className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>New invites</CardTitle>
            <CardDescription>{uni.name}</CardDescription>
          </div>
          <Stepper step={step} />
        </CardHeader>

        <CardContent className="pt-6">
          {step === "upload" && (
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
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors outline-none focus-visible:border-primary/60",
                  dragging ? "border-primary bg-primary-soft/50" : "hover:border-ink/25 hover:bg-[#FCFCFC]",
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <UploadCloud className="size-6" />
                </span>
                <div className="mt-4 text-[15px] font-semibold">Drop your admitted-student list here</div>
                <p className="mt-1 text-[13px] text-muted-foreground">CSV or Excel · columns: name, email, program, intake · up to 5,000 rows</p>
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
              <div className="mt-4 flex flex-col gap-2 text-[12.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>Export your admitted list from Slate, Salesforce or Excel as a CSV.</span>
                <button type="button" onClick={() => loadRows("sample-fall-2027.csv", sample)} className="font-medium text-ink underline-offset-4 hover:underline">
                  Try with a sample file
                </button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                  <span className="mr-1 flex items-center gap-1.5 font-medium text-ink">
                    <FileSpreadsheet className="size-4 text-muted-foreground" /> {fileName}
                  </span>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 font-medium text-success">{ready.length} ready</span>
                  {count("invalid") > 0 && <span className="rounded-full bg-destructive-soft px-2 py-0.5 font-medium text-destructive">{count("invalid")} invalid</span>}
                  {count("duplicate") > 0 && <span className="rounded-full bg-warning-soft px-2 py-0.5 font-medium text-warning">{count("duplicate")} duplicate</span>}
                  {count("existing") > 0 && <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">{count("existing")} already invited</span>}
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
                          <TableCell className={cn("max-w-[220px] truncate", r.status === "invalid" ? "text-destructive" : "text-muted-foreground")}>{r.email || "—"}</TableCell>
                          <TableCell className="hidden text-muted-foreground sm:table-cell">
                            {r.program} · {r.intake}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn("whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium", statusMeta[r.status].className)}>{statusMeta[r.status].label}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {issues > 0 && (
                  <p className="mt-3 flex items-start gap-2 text-[12.5px] text-muted-foreground">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {issues} {issues === 1 ? "row" : "rows"} with issues will be skipped. Fix them in your file and upload again anytime.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border bg-[#FAFAFA] p-4">
                <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
                  <Mail className="size-4" /> Email preview
                </div>
                <div className="mt-3 rounded-xl border bg-white p-4 text-[13px] shadow-xs">
                  <div className="text-[11.5px] text-muted-foreground">From: {uni.short} via AfterAdmit</div>
                  <div className="mt-1 font-semibold">You&apos;re invited: your path to {uni.short}</div>
                  <div className="my-3 h-px bg-border" />
                  <p className="leading-relaxed text-muted-foreground">
                    Hi {ready[0]?.name.split(" ")[0] ?? "there"}, congratulations on your admission! {uni.short} uses AfterAdmit to guide you from offer to arrival — every step, dated and in order.
                  </p>
                  <span className="mt-4 inline-flex rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-white">Accept your invite</span>
                  <p className="mt-3 text-[11px] text-subtle">Link expires in 14 days</p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-between xl:col-span-2">
                <Button variant="ghost" onClick={reset}>
                  <ArrowLeft className="size-4" /> Upload a different file
                </Button>
                <Button variant="ink" disabled={!ready.length} onClick={send}>
                  <Send className="size-4" /> Send {ready.length} {ready.length === 1 ? "invite" : "invites"}
                </Button>
              </div>
            </div>
          )}

          {step === "sending" && (
            <div className="flex flex-col items-center py-14 text-center">
              <div className="text-[15px] font-semibold">Sending invites…</div>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {Math.round((progress / 100) * ready.length)} of {ready.length}
              </p>
              <div className="mt-5 h-1.5 w-full max-w-[360px] overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {step === "sent" && (
            <div className="flex flex-col items-center py-12 text-center animate-in fade-in-0 duration-500">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white">
                <Check className="size-5" strokeWidth={3} />
              </span>
              <div className="mt-4 text-[18px] font-semibold tracking-tight">{ready.length} invites on their way</div>
              <p className="mt-1 max-w-[400px] text-[13.5px] text-muted-foreground">Students can join from any device. We&apos;ll send a reminder after 5 days to anyone who hasn&apos;t joined.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={reset}>
                  <UserPlus className="size-4" /> Invite more
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    void navigator.clipboard.writeText(`https://app.afteradmit.com/join/${uni.id}-fall-2027`);
                    toast.success("Invite link copied");
                  }}
                >
                  <Copy className="size-4" /> Copy class invite link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Invited" value={uni.students.toLocaleString("en-US")} hint={uni.terms[0] ?? "—"} icon={Mail} />
        <KpiCard label="Joined" value={uni.signedUp.toLocaleString("en-US")} hint={uni.students ? `${Math.round((uni.signedUp / uni.students) * 100)}% activation` : "—"} icon={Check} />
        <KpiCard label="Not joined yet" value={notJoined.toLocaleString("en-US")} hint="reminder in 2 days" icon={RotateCw} />
        <KpiCard label="Bounced" value={uni.students ? "4" : "0"} hint="check addresses" icon={AlertCircle} />
      </div>

      <Card className="mt-5">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Invite tracking</CardTitle>
            <CardDescription>Who has joined, and who might need a nudge</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success(`Reminder sent to ${notJoined} students`)} disabled={!notJoined}>
            <RotateCw className="size-4" /> Remind all not joined
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-3 scrollbar-none">
            {(["All", "Joined", "Not joined", "Bounced"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn("shrink-0 rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors", filter === f ? "bg-ink text-white" : "text-muted-foreground hover:bg-muted")}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden md:table-cell">Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((t) => (
                  <TableRow key={t.email}>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                      <div className="max-w-[180px] truncate text-[12px] text-muted-foreground sm:max-w-none">{t.email}</div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{t.sent}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium", trackingMeta[t.status])}>{t.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {t.status !== "Joined" && (
                        <Button size="xs" variant="ghost" onClick={() => toast.success(t.status === "Bounced" ? "Opened email editor" : `Invite resent to ${t.name}`)}>
                          {t.status === "Bounced" ? "Fix email" : "Resend"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
