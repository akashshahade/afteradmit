"use client";

import * as React from "react";
import { toast } from "sonner";
import { ChevronRight, LifeBuoy, Paperclip } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, createTicket, replyAsRequester, useTickets, type Ticket, type TicketOwner, type TicketStatus } from "@/components/support/support-store";

export const statusStyles: Record<TicketStatus, string> = {
  Open: "bg-primary-soft text-primary",
  Pending: "bg-warning-soft text-warning",
  Resolved: "bg-success/10 text-success",
};

export function StatusPill({ status }: { status: TicketStatus }) {
  return <span className={cn("whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium", statusStyles[status])}>{status === "Pending" ? "Awaiting you" : status}</span>;
}

export function NewRequestDialog({ open, onOpenChange, owner }: { open: boolean; onOpenChange: (o: boolean) => void; owner: TicketOwner }) {
  const [category, setCategory] = React.useState(categories[0]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New support request</DialogTitle>
          <DialogDescription>Tell us what&apos;s going on. We usually reply within a few hours.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const ticket = createTicket({ owner, category, subject: String(data.get("subject")).trim(), body: String(data.get("body")).trim() });
            onOpenChange(false);
            toast.success(`Request ${ticket.id} sent`, { description: "We'll email you when we reply." });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="req-category">Topic</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="req-category" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="req-subject">Subject</Label>
            <Input id="req-subject" name="subject" required maxLength={120} placeholder="A short summary" className="h-10 text-[16px] sm:text-[13.5px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="req-body">Details</Label>
            <Textarea id="req-body" name="body" required rows={5} maxLength={4000} placeholder="What happened, and what did you expect?" className="text-[16px] sm:text-[13.5px]" />
          </div>
          <button type="button" onClick={() => toast("File picker opened")} className="flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
            <Paperclip className="size-3.5" /> Attach a screenshot
          </button>
          <p className="text-[11.5px] text-subtle">Never include passport, visa or bank numbers.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="ink">
              Send request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RequestRow({ t, onOpen }: { t: Ticket; onOpen: () => void }) {
  const last = t.messages[t.messages.length - 1];
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-[#FCFCFC]">
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[13.5px] font-medium">{t.subject}</span>
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
            {t.id} · {last.from === "agent" ? `${last.name} replied` : "You wrote"} · {t.updated}
          </span>
        </span>
        <StatusPill status={t.status} />
        <ChevronRight className="size-4 shrink-0 text-subtle" />
      </button>
    </li>
  );
}

function ThreadDialog({ ticket, onOpenChange }: { ticket: Ticket | null; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={!!ticket} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        {ticket && (
          <>
            <DialogHeader>
              <DialogTitle className="pr-6">{ticket.subject}</DialogTitle>
              <DialogDescription>
                {ticket.id} · {ticket.category}
              </DialogDescription>
            </DialogHeader>
            <ol className="max-h-[50vh] space-y-3 overflow-y-auto">
              {ticket.messages.map((m, i) => (
                <li key={i} className={cn("rounded-xl p-3 text-[13.5px] leading-relaxed", m.from === "agent" ? "bg-[#FAFAFA]" : "border")}>
                  <div className="mb-1 flex items-center justify-between text-[11.5px] text-muted-foreground">
                    <span className="font-medium text-ink">{m.from === "agent" ? `${m.name} · AfterAdmit` : "You"}</span>
                    {m.time}
                  </div>
                  {m.body}
                </li>
              ))}
            </ol>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                const body = String(new FormData(e.currentTarget).get("reply") ?? "").trim();
                if (!body) return;
                replyAsRequester(ticket.id, body);
                e.currentTarget.reset();
                toast.success("Reply sent");
              }}
            >
              <Textarea name="reply" required rows={3} placeholder="Write a reply…" className="text-[16px] sm:text-[13.5px]" />
              <div className="flex justify-end">
                <Button type="submit" size="sm" variant="ink">
                  Send reply
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function MyRequests({ owner, limit, className }: { owner: TicketOwner; limit?: number; className?: string }) {
  const all = useTickets().filter((t) => t.owner === owner);
  const [newOpen, setNewOpen] = React.useState(false);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const list = limit ? all.slice(0, limit) : all;
  const current = all.find((t) => t.id === openId) ?? null;

  return (
    <div className={className}>
      <Button variant="ink" className="w-full" onClick={() => setNewOpen(true)}>
        <LifeBuoy className="size-4" /> New support request
      </Button>
      {list.length > 0 ? (
        <ul className="mt-3 divide-y border-y">
          {list.map((t) => (
            <RequestRow key={t.id} t={t} onOpen={() => setOpenId(t.id)} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[12.5px] text-muted-foreground">You haven&apos;t opened any requests yet.</p>
      )}
      <NewRequestDialog open={newOpen} onOpenChange={setNewOpen} owner={owner} />
      <ThreadDialog ticket={current} onOpenChange={(o) => !o && setOpenId(null)} />
    </div>
  );
}
