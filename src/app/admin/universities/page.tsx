"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Ellipsis, Check, Upload, Copy, Store, UserPlus, Building2, CalendarDays, ArrowRight, ArrowLeft } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig } from "@/components/shell/form-sheet";
import { universities } from "@/lib/ops-data";
import { providers } from "@/lib/data";

const steps = [
  { k: "school", l: "University", i: Building2 },
  { k: "term", l: "Intake term", i: CalendarDays },
  { k: "template", l: "Roadmap", i: Copy },
  { k: "providers", l: "Providers", i: Store },
  { k: "admins", l: "Admins", i: UserPlus },
];

function NewUniversitySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = React.useState(0);
  const [color, setColor] = React.useState("#2774AE");
  const [admins, setAdmins] = React.useState(["admissions@lakeside.edu", ""]);
  const handleOpenChange = (o: boolean) => {
    if (!o) setStep(0);
    onOpenChange(o);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle>Onboard a new university</SheetTitle>
          <SheetDescription>Set up the school before any student is invited.</SheetDescription>
        </SheetHeader>
        <div className="flex items-center gap-1 border-b px-6 py-3">
          {steps.map((s, i) => (
            <React.Fragment key={s.k}>
              <button onClick={() => setStep(i)} className={cn("flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-medium", i === step ? "bg-ink text-white" : i < step ? "text-foreground" : "text-subtle")}>
                <span className={cn("flex size-4 items-center justify-center rounded-full text-[10px]", i < step ? "bg-primary text-white" : i === step ? "bg-white/20" : "border")}>
                  {i < step ? <Check className="size-2.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.l}</span>
              </button>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>University name</Label>
                <Input placeholder="e.g. Lakeside Institute of Technology" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Email domain</Label>
                  <Input placeholder="lakeside.edu" />
                </div>
                <div className="space-y-1.5">
                  <Label>Brand colour</Label>
                  <div className="flex items-center gap-2 rounded-lg border px-2 shadow-xs">
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-6 cursor-pointer rounded border-0 bg-transparent p-0" />
                    <input value={color} onChange={(e) => setColor(e.target.value)} className="h-9 flex-1 bg-transparent font-mono text-[13px] outline-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Logo</Label>
                <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed text-[12.5px] text-muted-foreground">
                  <Upload className="mb-1.5 size-4" /> SVG or PNG, at least 400px wide
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>International office contact</Label>
                <Input placeholder="intl.office@lakeside.edu" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Term name</Label>
                <Input defaultValue="Fall 2027" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Program start", "Orientation", "Deposit deadline", "Housing deadline", "Insurance waiver deadline", "Health form deadline"].map((d) => (
                  <div key={d} className="space-y-1.5">
                    <Label>{d}</Label>
                    <Input type="date" defaultValue="2027-09-20" />
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-muted-foreground">These anchor dates drive every milestone due date (anchor + offset days).</p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13.5px] font-semibold">AfterAdmit Master Template</div>
                    <div className="text-[12px] text-muted-foreground">v3.2 · 9 stages · 38 milestones · updated May 2</div>
                  </div>
                  <Badge variant="success">Recommended</Badge>
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-[13px]">
                <Checkbox defaultChecked /> Link milestones to master so template updates can be pushed
              </label>
              <label className="flex items-center gap-2.5 text-[13px]">
                <Checkbox defaultChecked /> Include international-only milestones
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2">
              {providers.slice(0, 8).map((p, i) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 hover:bg-[#fafafa]">
                  <Checkbox defaultChecked={i < 6} />
                  <span className="flex size-8 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: p.color }}>
                    {p.initials}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-medium">{p.name}</span>
                    <span className="block text-[12px] text-muted-foreground">{p.category}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              {admins.map((e, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="admin@university.edu"
                    value={e}
                    onChange={(ev) => setAdmins((a) => a.map((x, j) => (j === i ? ev.target.value : x)))}
                  />
                  <Button variant="outline" size="icon" aria-label="Remove" disabled={admins.length === 1} onClick={() => setAdmins((a) => a.filter((_, j) => j !== i))}>
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setAdmins((a) => [...a, ""])}>
                <Plus className="size-4" /> Add another
              </Button>
              <p className="text-[12px] text-muted-foreground">University admins can edit dates and school-specific text, invite students, and see aggregate progress only.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button variant="ink" onClick={() => setStep((s) => s + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleOpenChange(false);
                toast.success("University created", { description: "Admin invites sent." });
              }}
            >
              Create university
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UniversitiesInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(params.get("new") === "1");
  const [form, setForm] = React.useState<FormSheetConfig | null>(null);
  const [archived, setArchived] = React.useState<string[]>([]);
  const [q, setQ] = React.useState("");
  const list = universities.filter((u) => !archived.includes(u.id) && u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Content"
        title="Universities"
        description="Each university gets its own branded roadmap, deadlines, contacts, and providers."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add university
          </Button>
        }
      />

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <div className="flex items-center gap-3 border-b px-5 py-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search universities" className="h-8 pl-8 text-[13px]" />
          </div>
          <span className="ml-auto text-[12px] text-muted-foreground">{list.length} universities</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terms</TableHead>
              <TableHead>Students</TableHead>
              <TableHead className="w-[180px]">Activation</TableHead>
              <TableHead>Avg. progress</TableHead>
              <TableHead>Admins</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((u) => {
              const act = u.students ? Math.round((u.signedUp / u.students) * 100) : 0;
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg text-[11px] font-bold text-white" style={{ background: u.color }}>
                        {u.short.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        {u.logo ? <Image src={u.logo} alt={u.name} width={100} height={19} className="h-[15px] w-auto" /> : <div className="font-medium">{u.short}</div>}
                        <div className="text-[12px] text-muted-foreground">{u.domain}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === "Live" ? "success" : u.status === "Onboarding" ? "warning" : "secondary"}>
                      <span className={cn("size-1.5 rounded-full", u.status === "Live" ? "bg-success" : u.status === "Onboarding" ? "bg-warning" : "bg-subtle")} />
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.terms.join(", ") || "—"}</TableCell>
                  <TableCell className="tabular">{formatNumber(u.students)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Progress value={act} className="h-1.5 w-24" />
                      <span className="tabular text-[12px] text-muted-foreground">{act}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular">{u.avgProgress}%</TableCell>
                  <TableCell className="tabular">{u.admins}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Actions">
                          <Ellipsis className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() =>
                            setForm({
                              title: `Edit ${u.short}`,
                              success: "University updated",
                              successDescription: u.short,
                              fields: [
                                { name: "name", label: "University name", defaultValue: u.name, required: true },
                                { name: "short", label: "Short name", defaultValue: u.short, required: true },
                                { name: "domain", label: "Email domain", defaultValue: u.domain },
                                { name: "intl", label: "International office contact", type: "email", defaultValue: `intl.office@${u.domain}` },
                              ],
                            })
                          }
                        >
                          Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setForm({
                              title: `Terms · ${u.short}`,
                              description: "Anchor dates drive every milestone due date.",
                              success: "Term dates saved",
                              successDescription: "Student roadmaps update automatically.",
                              fields: [
                                { name: "term", label: "Term", type: "select", defaultValue: u.terms[0] ?? "Fall 2027", options: ["Fall 2027", "Spring 2028", "Fall 2028"] },
                                { name: "start", label: "Program start", type: "date", defaultValue: "2027-09-20" },
                                { name: "orientation", label: "Orientation", type: "date", defaultValue: "2027-09-13" },
                                { name: "deposit", label: "Deposit deadline", type: "date", defaultValue: "2027-05-01" },
                                { name: "housing", label: "Housing deadline", type: "date", defaultValue: "2027-06-01" },
                              ],
                            })
                          }
                        >
                          Manage terms
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push("/admin/providers")}>Assign providers</DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            setForm({
                              title: `Invite admins · ${u.short}`,
                              description: "University admins see aggregate progress only.",
                              submitLabel: "Send invite",
                              success: "Admin invite sent",
                              fields: [
                                { name: "email", label: "Email", type: "email", required: true, placeholder: `name@${u.domain}` },
                                { name: "role", label: "Role", type: "select", options: ["Admin", "Editor", "Viewer"] },
                              ],
                            })
                          }
                        >
                          Invite admins
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push("/admin/invites")}>Invite students</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toast.success("Template update pushed", { description: u.short })}>Push template update</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => {
                            setArchived((a) => [...a, u.id]);
                            toast(`${u.short} archived`, { action: { label: "Undo", onClick: () => setArchived((a) => a.filter((x) => x !== u.id)) } });
                          }}
                        >
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <NewUniversitySheet open={open} onOpenChange={setOpen} />
      <FormSheet config={form} onClose={() => setForm(null)} />
    </PageContainer>
  );
}

export default function UniversitiesPage() {
  return (
    <React.Suspense>
      <UniversitiesInner />
    </React.Suspense>
  );
}
