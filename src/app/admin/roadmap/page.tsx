"use client";

import * as React from "react";
import { toast } from "sonner";
import { ChevronDown, Globe, GripVertical, Plus, Filter, Pencil, Send, X, Store, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { milestones, providerById, stages, type Milestone } from "@/lib/data";

const anchors = ["Deposit deadline", "Housing deadline", "Insurance waiver deadline", "Health form deadline", "Orientation", "Program start"];

function RuleRow({ attr, op, value, onRemove }: { attr: string; op: string; value: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={attr}>
        <SelectTrigger size="sm" className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["Visa type", "Funding sources", "Has dependents", "Housing preference", "Home country", "Program"].map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={op}>
        <SelectTrigger size="sm" className="w-[110px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["is", "is not", "includes"].map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input defaultValue={value} className="h-8 flex-1 text-[13px]" />
      <Button variant="ghost" size="icon-xs" aria-label="Remove condition" onClick={onRemove}>
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

type Rule = { id: number; attr: string; op: string; value: string };

function RuleEditor({ m }: { m: Milestone }) {
  const [rules, setRules] = React.useState<Rule[]>(() => [
    ...(m.international ? [{ id: 1, attr: "Visa type", op: "is not", value: "Domestic" }] : []),
    ...(m.rule?.includes("loan") ? [{ id: 2, attr: "Funding sources", op: "includes", value: "Loan" }] : []),
    ...(m.rule?.includes("off-campus") ? [{ id: 3, attr: "Housing preference", op: "is", value: "Off-campus" }] : []),
  ]);
  return (
    <>
      <div className="mt-3 space-y-2">
        {rules.map((r) => (
          <RuleRow key={r.id} attr={r.attr} op={r.op} value={r.value} onRemove={() => setRules((rs) => rs.filter((x) => x.id !== r.id))} />
        ))}
        {rules.length === 0 && <p className="text-[12.5px] text-muted-foreground">No rule — shown to every student.</p>}
      </div>
      <Button variant="ghost" size="xs" className="mt-2" onClick={() => setRules((rs) => [...rs, { id: Date.now(), attr: "Program", op: "is", value: "" }])}>
        <Plus className="size-3.5" /> Add condition
      </Button>
    </>
  );
}

function TaskEditor({ m }: { m: Milestone }) {
  const [tasks, setTasks] = React.useState(() => m.tasks.map((t) => ({ id: t.id, text: t.text })));
  return (
    <>
      {tasks.map((t) => (
        <div key={t.id} className="flex items-center gap-2">
          <GripVertical className="size-4 text-subtle" />
          <Input defaultValue={t.text} placeholder="Describe the task" className="h-8 text-[13px]" />
          <Button variant="ghost" size="icon-xs" aria-label="Remove task" onClick={() => setTasks((ts) => ts.filter((x) => x.id !== t.id))}>
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="xs" onClick={() => setTasks((ts) => [...ts, { id: `new-${Date.now()}`, text: "" }])}>
        <Plus className="size-3.5" /> Add task
      </Button>
    </>
  );
}

function EditSheet({ m, onOpenChange }: { m: Milestone | null; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={!!m} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[560px]">
        {m && (
          <>
            <SheetHeader>
              <div className="text-[12px] font-medium text-muted-foreground">
                Stage {m.stage} · {stages[m.stage - 1].name}
              </div>
              <SheetTitle>Edit milestone</SheetTitle>
              <SheetDescription>Changes apply to the master template. Push to universities when ready.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input defaultValue={m.title} />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea defaultValue={m.description} />
              </div>
              <div className="space-y-1.5">
                <Label>Why it matters</Label>
                <Textarea defaultValue={m.why} className="min-h-16" />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <div className="space-y-1.5">
                  <Label>Anchor date</Label>
                  <Select defaultValue="Program start">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {anchors.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Offset (days)</Label>
                  <Input type="number" defaultValue={-60} className="tabular" />
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-semibold">
                    <Filter className="size-4 text-primary" /> Visibility rule
                  </div>
                  <span className="text-[11.5px] text-muted-foreground">Conditions joined by AND</span>
                </div>
                <RuleEditor key={m.id} m={m} />
              </div>

              <div className="space-y-2">
                <Label>Tasks</Label>
                <TaskEditor key={m.id} m={m} />
              </div>

              <div className="divide-y rounded-xl border">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-[13px] font-medium">International only</div>
                    <div className="text-[12px] text-muted-foreground">Hidden for domestic students</div>
                  </div>
                  <Switch defaultChecked={m.international} />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-[13px] font-medium">Active</div>
                    <div className="text-[12px] text-muted-foreground">Universities can still turn it off</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="ink"
                onClick={() => {
                  onOpenChange(false);
                  toast.success("Milestone saved to master template");
                }}
              >
                Save milestone
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function TemplatePage() {
  const [open, setOpen] = React.useState<number[]>([1, 3]);
  const [editing, setEditing] = React.useState<Milestone | null>(null);

  return (
    <PageContainer className="max-w-[1080px]">
      <PageHeader
        eyebrow="Content"
        title="Master roadmap template"
        description="9 stages · Stage → Milestone → Task. Universities receive a linked copy and can edit text or turn milestones off."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => window.open("/student/roadmap", "_blank", "noopener")}>
              <Eye className="size-4" /> Preview as student
            </Button>
            <Button size="sm" onClick={() => toast.success("Update pushed to 3 live universities", { description: "Completed student progress is preserved." })}>
              <Send className="size-4" /> Push to universities
            </Button>
          </>
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px]">
        <Badge variant="outline">v3.2 · draft</Badge>
        <span className="text-muted-foreground">Last published May 2, 2027 by Jordan Lee · 2 unpublished changes</span>
      </div>

      <div className="mt-6 space-y-3">
        {stages.map((s) => {
          const items = milestones.filter((m) => m.stage === s.id);
          const isOpen = open.includes(s.id);
          return (
            <div key={s.id} className="overflow-hidden rounded-2xl border bg-white">
              <button
                onClick={() => setOpen((o) => (o.includes(s.id) ? o.filter((x) => x !== s.id) : [...o, s.id]))}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fcfcfc]"
              >
                <span className="tabular flex size-8 items-center justify-center rounded-lg bg-muted text-[12.5px] font-semibold">{s.id}</span>
                <s.icon className="size-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold">{s.name}</div>
                  <div className="truncate text-[12px] text-muted-foreground">{s.blurb}</div>
                </div>
                <span className="text-[12px] text-muted-foreground">{items.length} milestones</span>
                <ChevronDown className={cn("size-4 text-subtle transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="border-t">
                  <ul className="divide-y">
                    {items.map((m) => (
                      <li key={m.id} className="group flex items-center gap-3 px-5 py-3 hover:bg-[#fcfcfc]">
                        <GripVertical className="size-4 cursor-grab text-[#d4d4d8] group-hover:text-subtle" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-[13.5px] font-medium">{m.title}</span>
                            {m.international && (
                              <Badge variant="outline" className="gap-1">
                                <Globe /> Intl
                              </Badge>
                            )}
                            {m.rule && <Badge variant="default">Rule</Badge>}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted-foreground">
                            <span>{m.tasks.length} tasks</span>
                            <span className="text-subtle">·</span>
                            <span>{m.dueRule}</span>
                            {m.providers && (
                              <>
                                <span className="text-subtle">·</span>
                                <span className="flex items-center gap-1">
                                  <Store className="size-3" /> {m.providers.map((p) => providerById(p).name.split(" ")[0]).join(", ")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Switch defaultChecked onClick={(e) => e.stopPropagation()} />
                        <Button variant="ghost" size="icon-xs" onClick={() => setEditing(m)} aria-label="Edit">
                          <Pencil className="size-3.5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t px-5 py-2.5">
                    <Button variant="ghost" size="xs" className="text-muted-foreground">
                      <Plus className="size-3.5" /> Add milestone
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <EditSheet m={editing} onOpenChange={(o) => !o && setEditing(null)} />
    </PageContainer>
  );
}
