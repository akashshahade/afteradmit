import { notFound } from "next/navigation";

import { communities } from "@/lib/community-data";
import { CommunityView } from "./community-view";

export const instant = false;

export function generateStaticParams() {
  return communities.map((c) => ({ id: c.id }));
}

export default async function CommunityPage({ params }: PageProps<"/student/community/c/[id]">) {
  const { id } = await params;
  if (!communities.some((c) => c.id === id)) notFound();
  return <CommunityView id={id} />;
}
