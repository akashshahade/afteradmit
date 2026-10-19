import { notFound } from "next/navigation";

import { posts } from "@/lib/community-data";
import { PostView } from "./post-detail";

export const instant = false;

export function generateStaticParams() {
  return posts.map((p) => ({ postId: p.id }));
}

export default async function PostPage({ params }: PageProps<"/student/community/[postId]">) {
  const { postId } = await params;
  if (!posts.some((p) => p.id === postId)) notFound();
  return <PostView postId={postId} />;
}
