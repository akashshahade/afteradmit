"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search, Send, Paperclip, Smile, Ellipsis, PenSquare, Phone, Info, BellOff, Ban, Flag, Trash2, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserAvatar } from "@/components/community/post-card";
import { conversations as seed, members } from "@/lib/community-data";

export default function MessagesPage() {
  const [convos, setConvos] = React.useState(seed);
  const [activeId, setActiveId] = React.useState(seed[0].id);
  const [draft, setDraft] = React.useState("");
  const [q, setQ] = React.useState("");
  const [mobileChat, setMobileChat] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const active = convos.find((c) => c.id === activeId)!;
  const other = members[active.with];

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [activeId, active.messages.length]);

  const send = () => {
    if (!draft.trim()) return;
    setConvos((cs) => cs.map((c) => (c.id === activeId ? { ...c, last: draft, time: "now", messages: [...c.messages, { from: "priya", body: draft, time: "Just now" }] } : c)));
    setDraft("");
  };

  const filtered = convos.filter((c) => members[c.with].name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex h-[calc(100dvh-56px-64px-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-56px)]">
      <div className={cn("flex w-full shrink-0 flex-col border-r bg-white md:max-w-[340px]", mobileChat && "max-md:hidden")}>
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h1 className="text-[18px] font-semibold tracking-tight">Messages</h1>
          <Button variant="ghost" size="icon-sm" aria-label="New message" onClick={() => toast("Start a new conversation")}>
            <PenSquare className="size-4" />
          </Button>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search classmates" className="h-8 pl-8 text-[13px]" />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto px-2">
          {filtered.map((c) => {
            const m = members[c.with];
            const on = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActiveId(c.id);
                    setMobileChat(true);
                    setConvos((cs) => cs.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
                  }}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors", on ? "bg-muted" : "hover:bg-[#fafafa]")}
                >
                  <div className="relative">
                    <UserAvatar member={m} size={40} />
                    {["arjun", "sofia"].includes(m.id) && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-[13.5px]", c.unread ? "font-semibold" : "font-medium")}>{m.name}</span>
                      <span className="shrink-0 text-[11px] text-subtle">{c.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("truncate text-[12.5px]", c.unread ? "font-medium text-foreground" : "text-muted-foreground")}>{c.last}</span>
                      {c.unread > 0 && <span className="tabular ml-auto flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col bg-white", !mobileChat && "max-md:hidden")}>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:gap-3 sm:px-5">
          <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setMobileChat(false)} aria-label="Back to conversations">
            <ArrowLeft className="size-4" />
          </Button>
          <UserAvatar member={other} size={36} />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold">{other.name}</div>
            <div className="text-[12px] text-muted-foreground">
              {other.program} · {other.from}
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" className="max-sm:hidden" aria-label="Call" onClick={() => toast("Voice calls are coming soon", { description: "For now, share a call link in the chat." })}>
            <Phone className="size-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="max-sm:hidden" aria-label="Info">
                <Info className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[280px] p-0">
              <div className="flex flex-col items-center border-b px-5 py-5 text-center">
                <UserAvatar member={other} size={56} />
                <div className="mt-3 text-[14.5px] font-semibold">{other.name}</div>
                <div className="text-[12.5px] text-muted-foreground">@{other.handle}</div>
              </div>
              <dl className="space-y-2.5 px-5 py-4 text-[12.5px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Program</dt>
                  <dd className="font-medium">{other.program}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">From</dt>
                  <dd className="font-medium">{other.from}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">School</dt>
                  <dd className="font-medium">UCLA Anderson</dd>
                </div>
              </dl>
              <div className="border-t px-5 py-3 text-[11.5px] text-muted-foreground">Verified admitted student</div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More">
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => toast("Conversation muted")}>
                <BellOff /> Mute
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast(`Blocked ${other.name}`)}>
                <Ban /> Block
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Report sent")}>
                <Flag /> Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => toast("Conversation deleted")}>
                <Trash2 /> Delete conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto max-w-[680px] space-y-1">
            <div className="mb-6 flex flex-col items-center text-center">
              <UserAvatar member={other} size={56} />
              <div className="mt-2 text-[14px] font-semibold">{other.name}</div>
              <div className="text-[12px] text-muted-foreground">{other.program} · {other.from}</div>
            </div>
            {active.messages.map((msg, i) => {
              const mine = msg.from === "priya";
              const prev = active.messages[i - 1];
              const grouped = prev && prev.from === msg.from;
              return (
                <div key={i} className={cn("flex", mine ? "justify-end" : "justify-start", !grouped && "pt-3")}>
                  <div className="max-w-[72%]">
                    {!grouped && <div className={cn("mb-1 text-[11px] text-subtle", mine && "text-right")}>{msg.time}</div>}
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed",
                        mine ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-muted text-foreground",
                      )}
                    >
                      {msg.body}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        </div>

        <div className="border-t p-4">
          <div className="mx-auto flex max-w-[680px] items-center gap-2 rounded-2xl border bg-white px-2 py-1.5 focus-within:border-[#d4d4d8] focus-within:shadow-sm">
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Attach">
              <Paperclip className="size-4" />
            </Button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${other.name.split(" ")[0]}`}
              className="h-8 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-subtle"
            />
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Emoji">
              <Smile className="size-4" />
            </Button>
            <Button size="icon-sm" className="rounded-xl" onClick={send} disabled={!draft.trim()} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-[680px] text-center text-[11px] text-subtle">Never share passport, visa, or financial document numbers in chat.</p>
        </div>
      </div>
    </div>
  );
}
