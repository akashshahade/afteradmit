"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search, Send, Ellipsis, PenSquare, ArrowLeft, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/community/post-card";
import { useStudent } from "@/components/student/store";
import { createClient } from "@/lib/supabase/client";
import {
  classmateToMember,
  listClassmates,
  loadConversations,
  sendDirectMessage,
  startConversation,
  type Classmate,
  type LiveConversation,
} from "@/lib/messages-live";

export default function MessagesPage() {
  const { profile } = useStudent();
  const [convos, setConvos] = React.useState<LiveConversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [q, setQ] = React.useState("");
  const [mobileChat, setMobileChat] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [classmates, setClassmates] = React.useState<Classmate[]>([]);
  const endRef = React.useRef<HTMLDivElement>(null);
  const me = profile?.id;

  const refresh = React.useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const list = await loadConversations(user.id);
      setConvos(list);
      setActiveId((cur) => cur ?? list[0]?.id ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const active = convos.find((c) => c.id === activeId) ?? null;
  const other = active ? classmateToMember(active.other) : null;

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [activeId, active?.messages.length]);

  const send = async () => {
    if (!draft.trim() || !activeId) return;
    const body = draft.trim();
    setDraft("");
    try {
      const msg = await sendDirectMessage(activeId, body);
      setConvos((cs) =>
        cs.map((c) =>
          c.id === activeId
            ? { ...c, last: body, time: "now", messages: [...c.messages, msg] }
            : c,
        ),
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not send");
      setDraft(body);
    }
  };

  const openPicker = async () => {
    setPickerOpen(true);
    try {
      setClassmates(await listClassmates());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load classmates");
    }
  };

  const startWith = async (c: Classmate) => {
    try {
      const id = await startConversation(c.id);
      setPickerOpen(false);
      await refresh();
      setActiveId(id);
      setMobileChat(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start chat");
    }
  };

  const filtered = convos.filter((c) =>
    classmateToMember(c.other).name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100dvh-56px-64px-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-56px)]">
      <div className={cn("flex w-full shrink-0 flex-col border-r bg-white md:max-w-[340px]", mobileChat && "max-md:hidden")}>
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h1 className="text-[18px] font-semibold tracking-tight">Messages</h1>
          <Button variant="ghost" size="icon-sm" aria-label="New message" onClick={() => void openPicker()}>
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
          {loading && <li className="px-3 py-8 text-center text-[13px] text-muted-foreground">Loading…</li>}
          {!loading && filtered.length === 0 && (
            <li className="px-3 py-10 text-center">
              <div className="text-[13.5px] font-medium">No conversations yet</div>
              <p className="mt-1 text-[12.5px] text-muted-foreground">Message a classmate about housing, visas, or meetup plans.</p>
              <Button className="mt-4 rounded-full" size="sm" onClick={() => void openPicker()}>
                <UserPlus className="size-4" /> New message
              </Button>
            </li>
          )}
          {filtered.map((c) => {
            const m = classmateToMember(c.other);
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
                  <UserAvatar member={m} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate text-[13.5px]", c.unread ? "font-semibold" : "font-medium")}>{m.name}</span>
                      <span className="shrink-0 text-[11px] text-subtle">{c.time}</span>
                    </div>
                    <span className={cn("truncate text-[12.5px]", c.unread ? "font-medium text-foreground" : "text-muted-foreground")}>{c.last}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col bg-white", !mobileChat && "max-md:hidden")}>
        {!active || !other ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <div className="text-[15px] font-semibold">Your inbox</div>
              <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">Pick a conversation or start a new one with someone in your class.</p>
              <Button className="mt-4 rounded-full" onClick={() => void openPicker()}>
                <PenSquare className="size-4" /> New message
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:gap-3 sm:px-5">
              <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setMobileChat(false)} aria-label="Back to conversations">
                <ArrowLeft className="size-4" />
              </Button>
              <UserAvatar member={other} size={36} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold">{other.name}</div>
                <div className="text-[12px] text-muted-foreground">
                  {other.program}
                  {other.from ? ` · ${other.from}` : ""}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More">
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast("Mute coming soon")}>Mute</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Report sent to AfterAdmit")}>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
              {active.messages.length === 0 && (
                <div className="rounded-xl border border-dashed px-4 py-8 text-center text-[13px] text-muted-foreground">
                  Say hi — share housing tips, ask about visas, or plan a meetup.
                </div>
              )}
              {active.messages.map((msg) => {
                const mine = msg.sender_id === me;
                return (
                  <div key={msg.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed",
                        mine ? "bg-ink text-white" : "bg-muted text-foreground",
                      )}
                    >
                      {msg.body}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <div className="shrink-0 border-t p-3 sm:p-4">
              <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${other.name.split(" ")[0]}…`}
                  className="min-h-10 flex-1"
                />
                <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>Start a chat with someone in your admitted class.</DialogDescription>
          </DialogHeader>
          <ul className="max-h-[360px] space-y-1 overflow-y-auto">
            {classmates.length === 0 && (
              <li className="py-8 text-center text-[13px] text-muted-foreground">
                No other classmates have joined yet. Invite a friend with your school&apos;s invite link.
              </li>
            )}
            {classmates.map((c) => {
              const m = classmateToMember(c);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => void startWith(c)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-muted"
                  >
                    <UserAvatar member={m} size={36} />
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-medium">{m.name}</div>
                      <div className="truncate text-[12px] text-muted-foreground">
                        {m.program}
                        {m.from ? ` · ${m.from}` : ""}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
