import type { Member, Post } from "@/lib/community-data";
import { members as seedMembers, posts as seedPosts } from "@/lib/community-data";
import { createClient } from "@/lib/supabase/client";

const COLORS = ["#0F766E", "#2563EB", "#B45309", "#7C3AED", "#DB2777", "#059669", "#DC2626"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function memberFromProfile(row: {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  program: string | null;
  home_city?: string | null;
  home_country?: string | null;
  hometown?: string | null;
  avatar_color?: string | null;
  handle?: string | null;
}): Member {
  const name =
    row.full_name?.trim() ||
    `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() ||
    "Student";
  const color = row.avatar_color || COLORS[row.id.charCodeAt(0) % COLORS.length];
  const handle =
    row.handle ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .slice(0, 16) ||
    "student";
  return {
    id: row.id,
    name,
    handle,
    initials: initials(name) || "ST",
    color,
    program: row.program ?? "",
    from: row.hometown || row.home_city || row.home_country || "",
  };
}

function mapDbPost(row: {
  id: string;
  space_id: string;
  author_id: string;
  title: string;
  body: string | null;
  flair: string | null;
  flair_color: string | null;
  milestone_id: string | null;
  created_at: string;
  vote_score: number | null;
  pinned: boolean | null;
}): Post {
  const ageMs = Date.now() - new Date(row.created_at).getTime();
  const hours = Math.max(1, Math.round(ageMs / 3_600_000));
  const time = hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
  return {
    id: row.id,
    community: row.space_id,
    author: row.author_id,
    title: row.title,
    body: row.body ?? "",
    flair: row.flair ?? "Discussion",
    flairColor: row.flair_color ?? "#0F766E",
    milestone: row.milestone_id ?? undefined,
    votes: row.vote_score ?? 0,
    comments: 0,
    time,
    pinned: !!row.pinned,
  };
}

export async function loadCommunityFeed(): Promise<{
  posts: Post[];
  members: Record<string, Member>;
}> {
  const supabase = createClient();
  const { data: rows, error } = await supabase
    .from("community_posts")
    .select("id, space_id, author_id, title, body, flair, flair_color, milestone_id, created_at, vote_score, pinned")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error || !rows?.length) {
    return { posts: seedPosts, members: seedMembers };
  }

  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, program, home_city, home_country, avatar_color, handle")
    .in("id", authorIds);

  const members: Record<string, Member> = { ...seedMembers };
  for (const p of profiles ?? []) {
    members[p.id] = memberFromProfile(p);
  }
  for (const id of authorIds) {
    if (!members[id]) {
      members[id] = memberFromProfile({
        id,
        first_name: "Classmate",
        last_name: "",
        program: null,
        home_city: null,
        home_country: null,
      });
    }
  }

  return { posts: [...rows.map(mapDbPost), ...seedPosts], members };
}

export async function voteOnPost(postId: string, delta: 1 | -1) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to vote");

  const { error } = await supabase.from("community_votes").upsert(
    { user_id: user.id, target_type: "post", target_id: postId, value: delta },
    { onConflict: "user_id,target_type,target_id" },
  );
  if (error) throw error;
}
