import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate, type Author, type PostSummary } from "@/lib/blog";

export function AuthorAvatar({ author, size = 28 }: { author: Author; size?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ background: author.color, width: size, height: size, fontSize: size * 0.38 }}
    >
      {author.initials}
    </span>
  );
}

export function PostMeta({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 whitespace-nowrap text-[13px]", className)}>
      <AuthorAvatar author={post.author} size={26} />
      <span className="font-medium text-ink">{post.author.name}</span>
      <span className="text-subtle">·</span>
      <time dateTime={post.date} className="text-muted-foreground">
        {formatDate(post.date)}
      </time>
    </div>
  );
}

export function CategoryLabel({ post }: { post: PostSummary }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-[12.5px] font-medium">
      <span className={post.category === "For schools" ? "text-ink" : "text-primary"}>{post.category}</span>
      <span className="text-subtle">·</span>
      <span className="text-muted-foreground">{post.minutes} min read</span>
    </div>
  );
}

export function FeaturedPostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group grid grid-cols-1 overflow-hidden rounded-[24px] border bg-white transition-shadow duration-300 hover:shadow-[0_24px_60px_-32px_rgba(18,18,20,0.25)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
        <Image src={post.cover} alt={post.coverAlt} fill loading="eager" sizes="(min-width: 1024px) 640px, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-white">Latest</span>
          <CategoryLabel post={post} />
        </div>
        <h2 className="mt-5 text-[26px] font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-[32px]">{post.title}</h2>
        <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">{post.description}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
          <PostMeta post={post} />
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white sm:flex">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-28px_rgba(18,18,20,0.28)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image src={post.cover} alt={post.coverAlt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <CategoryLabel post={post} />
        <h3 className="mt-2.5 text-[18px] font-semibold leading-snug tracking-[-0.025em] text-ink sm:text-[19px]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-muted-foreground">{post.description}</p>
        <div className="mt-auto pt-5">
          <PostMeta post={post} className="border-t pt-4" />
        </div>
      </div>
    </Link>
  );
}
