"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCheck, Inbox, Search, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { replyToTicket, updateTicket, useTickets, type Ticket, type TicketPriority, type TicketStatus } from "@/components/support/support-store";
import { statusStyles } from "@/components/support/my-requests";

const filters = ["Open", "Pending", "Resolved", "All"] as const;
const priorityDot: Record<TicketPriority, string> = { Low: "bg-[#D4D4D8]", Normal: "bg-[#0EA5E9]", High: "bg-warning", Urgent: "bg-destructive" };
const agents = ["Unassigned", "Priya Raman", "Marcus Reyes", "Lena Park"];

function Avatar({ t, size = 32 }: { t: Ticket; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ background: t.requester.color, width: size, height: size, fontSize: size * 0.36 }}>
      {t.requester.initials}
    </span>
  );
}

function Detail({ t, onBack }: { t: Ticket; onBack: () => void }) {
  const [reply, setReply] = React.useState("");

  const send = (resolve: boolean) => {
    if (!reply.trim()) return;
    replyToTicket(t.id, reply.trim(), resolve);
    setReply("");
    toast.success(resolve ? `Replied and resolved ${t.id}` : `Reply sent to ${t.requester.name}`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b p-4 sm:p-5">
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-muted-foreground hover:text-foreground lg:hidden">
          <ArrowLeft className="size-3.5" /> All tickets
        </button>
        <div className="text-[12px] text-muted-foreground">
          {t.id} · {t.category}
        </div>
        <h2 className="mt-1 text-[17px] font-semibold tracking-tight">{t.subject}</h2>
        <div className="mt-3 flex items-center gap-2.5">
          <Avatar t={t} size={28} />
          <div className="min-w-0 text-[12.5px] leading-tight">
            <div className="font-medium">{t.requester.name}</div>
            <div className="truncate text-muted-foreground">
              {t.requester.kind} · {t.requester.org} · {t.requester.email}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Select value={t.status} onValueChange={(v) => updateTicket(t.id, { status: v as TicketStatus })}>
            <SelectTrigger size="sm" className="w-full" aria-label="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["Open", "Pending", "Resolved"] as const).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={t.priority} onValueChange={(v) => updateTicket(t.id, { priority: v as TicketPriority })}>
            <SelectTrigger size="sm" className="w-full" aria-label="Priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["Low", "Normal", "High", "Urgent"] as const).map((p) => (
                <SelectItem key={p} value={p}>
                  <span className={cn("size-2 rounded-full", priorityDot[p])} /> {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={t.assignee} onValueChange={(v) => updateTicket(t.id, { assignee: v })}>
            <SelectTrigger size="sm" className="w-full" aria-label="Assignee">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {agents.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ol className="min-h-[200px] flex-1 space-y-3 overflow-y-auto bg-[#FCFCFC] p-4 sm:p-5">
        {t.messages.map((m, i) => (
          <li key={i} className={cn("flex", m.from === "agent" && "justify-end")}>
            <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed", m.from === "agent" ? "bg-ink text-white" : "border bg-white")}>
              <div className={cn("mb-1 text-[11.5px]", m.from === "agent" ? "text-white/60" : "text-muted-foreground")}>
                {m.name} · {m.time}
              </div>
              {m.body}
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t p-3 sm:p-4">
        <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder={`Reply to ${t.requester.name}…`} className="text-[16px] sm:text-[13.5px]" />
        <div className="mt-2 flex flex-wrap justify-end gap-2">
          <Button size="sm" variant="outline" disabled={!reply.trim()} onClick={() => send(true)}>
            <CheckCheck className="size-4" /> Send &amp; resolve
          </Button>
          <Button size="sm" variant="ink" disabled={!reply.trim()} onClick={() => send(false)}>
            <Send className="size-4" /> Send reply
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SupportInboxPage() {
  const tickets = useTickets();
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("Open");
  const [q, setQ] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [mobileDetail, setMobileDetail] = React.useState(false);

  const query = q.trim().toLowerCase();
  const list = tickets
    .filter((t) => filter === "All" || t.status === filter)
    .filter((t) => !query || `${t.subject} ${t.requester.name} ${t.id}`.toLowerCase().includes(query));
  const selected = tickets.find((t) => t.id === selectedId) ?? list[0] ?? null;

  return (
    <PageContainer>
      <PageHeader eyebrow="Insights" title="Support" description="Requests from students, partners and universities in one inbox." />

      <div className="mt-6 grid h-auto grid-cols-1 overflow-hidden rounded-2xl border bg-white lg:h-[calc(100dvh-220px)] lg:min-h-[560px] lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className={cn("flex min-h-0 flex-col border-r", mobileDetail && "hidden lg:flex")}>
          <div className="space-y-3 border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tickets" className="h-9 pl-9 text-[16px] sm:text-[13.5px]" />
            </div>
            <div className="flex gap-1">
              {filters.map((f) => {
                const n = f === "All" ? tickets.length : tickets.filter((t) => t.status === f).length;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn("flex-1 rounded-lg px-2 py-1.5 text-[12.5px] font-medium transition-colors", filter === f ? "bg-ink text-white" : "text-muted-foreground hover:bg-muted")}
                  >
                    {f} <span className={cn("tabular", filter === f ? "text-white/60" : "text-subtle")}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <ul className="min-h-0 flex-1 divide-y overflow-y-auto">
            {list.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(t.id);
                    setMobileDetail(true);
                  }}
                  className={cn("flex w-full gap-3 px-3 py-3.5 text-left transition-colors", selected?.id === t.id ? "bg-[#F6F6F7]" : "hover:bg-[#FCFCFC]")}
                >
                  <Avatar t={t} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium">{t.requester.name}</span>
                      <span className="ml-auto shrink-0 text-[11.5px] text-subtle">{t.updated}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[13px]">{t.subject}</span>
                    <span className="mt-1.5 flex items-center gap-2 text-[11.5px] text-muted-foreground">
                      <span className={cn("size-1.5 rounded-full", priorityDot[t.priority])} />
                      {t.priority}
                      <span className="text-subtle">·</span>
                      <span className="truncate">{t.requester.kind}</span>
                      <span className={cn("ml-auto rounded-md px-1.5 py-0.5 text-[10.5px] font-medium", statusStyles[t.status])}>{t.status}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="flex flex-col items-center px-6 py-16 text-center">
                <Inbox className="size-6 text-subtle" />
                <div className="mt-3 text-[13.5px] font-medium">Nothing here</div>
                <p className="mt-1 text-[12.5px] text-muted-foreground">No tickets match this view.</p>
              </li>
            )}
          </ul>
        </div>
        <div className={cn("min-h-0", !mobileDetail && "hidden lg:block")}>
          {selected ? (
            <Detail key={selected.id} t={selected} onBack={() => setMobileDetail(false)} />
          ) : (
            <div className="flex h-full items-center justify-center p-10 text-[13px] text-muted-foreground">Select a ticket</div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
