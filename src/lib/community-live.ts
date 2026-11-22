import type { Comment, Community, Member, Post } from "@/lib/community-data";
import { communities as seedCommunities } from "@/lib/community-data";
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
  avatar_url?: string | null;
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

function relativeTime(iso: string) {
  const ageMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.round(ageMs / 3_600_000));
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
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
  image_url?: string | null;
  comment_count?: number | null;
}): Post {
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
    comments: row.comment_count ?? 0,
    time: relativeTime(row.created_at),
    pinned: !!row.pinned,
  };
}

export async function loadSpaces(): Promise<Community[]> {
  const supabase = createClient();
  const { data: spaces, error } = await supabase
    .from("community_spaces")
    .select("id, name, title, description, color, emoji")
    .order("name");

  if (error || !spaces?.length) return seedCommunities;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let joined = new Set<string>();
  if (user) {
    const { data: memberships } = await supabase
      .from("community_members")
      .select("space_id")
      .eq("user_id", user.id);
    joined = new Set((memberships ?? []).map((m) => m.space_id));
  }

  const counts = await Promise.all(
    spaces.map(async (s) => {
      const { count } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("space_id", s.id);
      return [s.id, count ?? 0] as const;
    }),
  );
  const countMap = Object.fromEntries(counts);

  const seedById = Object.fromEntries(seedCommunities.map((c) => [c.id, c]));

  return spaces.map((s) => {
    const seed = seedById[s.id];
    return {
      id: s.id,
      name: s.name,
      title: s.title,
      description: s.description,
      color: s.color,
      emoji: s.emoji,
      members: countMap[s.id] ?? 0,
      online: seed?.online ?? 0,
      joined: joined.has(s.id),
      rules: seed?.rules ?? ["Be kind", "No spam"],
      cover: seed?.cover,
      logo: seed?.logo,
    } satisfies Community;
  });
}

export async function loadCommunityFeed(spaceId?: string): Promise<{
  posts: Post[];
  members: Record<string, Member>;
}> {
  const supabase = createClient();
  let q = supabase
    .from("community_posts")
    .select("id, space_id, author_id, title, body, flair, flair_color, milestone_id, created_at, vote_score, pinned, image_url")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);
  if (spaceId) q = q.eq("space_id", spaceId);

  const { data: rows, error } = await q;
  if (error) return { posts: [], members: {} };
  if (!rows?.length) return { posts: [], members: {} };

  const postIds = rows.map((r) => r.id);
  const { data: commentRows } = await supabase
    .from("community_comments")
    .select("post_id")
    .in("post_id", postIds);
  const commentCounts: Record<string, number> = {};
  for (const c of commentRows ?? []) {
    commentCounts[c.post_id] = (commentCounts[c.post_id] ?? 0) + 1;
  }

  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, program, home_city, home_country, avatar_color, avatar_url, handle")
    .in("id", authorIds);

  const members: Record<string, Member> = {};
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

  return {
    posts: rows.map((r) => mapDbPost({ ...r, comment_count: commentCounts[r.id] ?? 0 })),
    members,
  };
}

export async function loadPost(postId: string): Promise<{
  post: Post | null;
  comments: Comment[];
  members: Record<string, Member>;
}> {
  const supabase = createClient();
  const { data: row } = await supabase
    .from("community_posts")
    .select("id, space_id, author_id, title, body, flair, flair_color, milestone_id, created_at, vote_score, pinned, image_url")
    .eq("id", postId)
    .maybeSingle();

  if (!row) return { post: null, comments: [], members: {} };

  const { data: commentRows } = await supabase
    .from("community_comments")
    .select("id, post_id, author_id, parent_id, body, vote_score, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  const authorIds = [...new Set([row.author_id, ...(commentRows ?? []).map((c) => c.author_id)])];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, program, home_city, home_country, avatar_color, avatar_url, handle")
    .in("id", authorIds);

  const members: Record<string, Member> = {};
  for (const p of profiles ?? []) members[p.id] = memberFromProfile(p);

  const comments: Comment[] = (commentRows ?? [])
    .filter((c) => !c.parent_id)
    .map((c) => ({
      id: c.id,
      author: c.author_id,
      body: c.body,
      time: relativeTime(c.created_at),
      votes: c.vote_score ?? 0,
      replies: (commentRows ?? [])
        .filter((r) => r.parent_id === c.id)
        .map((r) => ({
          id: r.id,
          author: r.author_id,
          body: r.body,
          time: relativeTime(r.created_at),
          votes: r.vote_score ?? 0,
        })),
    }));

  return {
    post: mapDbPost({ ...row, comment_count: commentRows?.length ?? 0 }),
    comments,
    members,
  };
}

export async function addComment(postId: string, body: string, parentId?: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to comment");

  const { error } = await supabase.from("community_comments").insert({
    post_id: postId,
    author_id: user.id,
    body: body.trim(),
    parent_id: parentId ?? null,
  });
  if (error) throw error;
}

export async function voteOnPost(postId: string, delta: 1 | -1) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to vote");

  const { data, error } = await supabase.rpc("vote_on_post", {
    p_post_id: postId,
    p_value: delta,
  });
  if (error) throw error;
  return typeof data === "number" ? data : undefined;
}
