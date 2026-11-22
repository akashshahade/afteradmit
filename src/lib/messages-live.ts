import { createClient } from "@/lib/supabase/client";

export type Classmate = {
  id: string;
  first_name: string;
  last_name: string;
  handle: string | null;
  program: string | null;
  home_city: string | null;
  home_country: string | null;
  avatar_color: string | null;
};

export type LiveMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type LiveConversation = {
  id: string;
  other: Classmate;
  last: string;
  time: string;
  messages: LiveMessage[];
  unread: number;
};

function displayName(c: Pick<Classmate, "first_name" | "last_name" | "handle">) {
  const n = `${c.first_name} ${c.last_name}`.trim();
  return n || c.handle || "Classmate";
}

function initials(c: Pick<Classmate, "first_name" | "last_name">) {
  const a = c.first_name?.[0];
  const b = c.last_name?.[0];
  if (a && b) return `${a}${b}`.toUpperCase();
  return (c.first_name || "ST").slice(0, 2).toUpperCase();
}

export function classmateToMember(c: Classmate) {
  return {
    id: c.id,
    name: displayName(c),
    handle: c.handle || c.first_name.toLowerCase() || "student",
    initials: initials(c),
    color: c.avatar_color || "#FF4500",
    program: c.program || "",
    from: c.home_city || c.home_country || "",
  };
}

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(ms / 60_000));
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export async function listClassmates(): Promise<Classmate[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("list_classmates");
  if (error) throw error;
  return (data ?? []) as Classmate[];
}

export async function loadConversations(userId: string): Promise<LiveConversation[]> {
  const supabase = createClient();
  const { data: memberships, error } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("user_id", userId);
  if (error) throw error;
  if (!memberships?.length) return [];

  const ids = memberships.map((m) => m.conversation_id);
  const { data: allMembers } = await supabase
    .from("conversation_members")
    .select("conversation_id, user_id")
    .in("conversation_id", ids);

  const otherByConvo = new Map<string, string>();
  for (const row of allMembers ?? []) {
    if (row.user_id !== userId) otherByConvo.set(row.conversation_id, row.user_id);
  }

  const otherIds = [...new Set([...otherByConvo.values()])];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, handle, program, home_city, home_country, avatar_color")
    .in("id", otherIds.length ? otherIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p as Classmate]));

  const { data: messages } = await supabase
    .from("direct_messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .in("conversation_id", ids)
    .order("created_at", { ascending: true });

  const byConvo = new Map<string, LiveMessage[]>();
  for (const m of (messages ?? []) as LiveMessage[]) {
    const list = byConvo.get(m.conversation_id) ?? [];
    list.push(m);
    byConvo.set(m.conversation_id, list);
  }

  const out: LiveConversation[] = [];
  for (const id of ids) {
    const otherId = otherByConvo.get(id);
    const other = otherId ? profileMap.get(otherId) : undefined;
    if (!other) continue;
    const msgs = byConvo.get(id) ?? [];
    const lastMsg = msgs[msgs.length - 1];
    out.push({
      id,
      other,
      last: lastMsg?.body ?? "Say hello",
      time: lastMsg ? relativeTime(lastMsg.created_at) : "",
      messages: msgs,
      unread: 0,
    });
  }

  out.sort((a, b) => {
    const at = a.messages[a.messages.length - 1]?.created_at ?? "";
    const bt = b.messages[b.messages.length - 1]?.created_at ?? "";
    return bt.localeCompare(at);
  });
  return out;
}

export async function startConversation(otherUserId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_or_create_dm", { other_user_id: otherUserId });
  if (error) throw error;
  return data as string;
}

export async function sendDirectMessage(conversationId: string, body: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to message");
  const { data, error } = await supabase.rpc("send_direct_message", {
    p_conversation_id: conversationId,
    p_body: body,
  });
  if (error) throw error;
  const row = (Array.isArray(data) ? data[0] : data) as LiveMessage;
  return row;
}
