import * as React from "react";
import { Info } from "lucide-react";

import { headingId, type Block } from "@/lib/blog";

function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="text-[17px] leading-[1.75] text-[#3f3f46]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="mt-6 first:mt-0">
                {rich(b.text)}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={headingId(b.text)} className="mt-14 scroll-mt-28 text-[24px] font-semibold leading-snug tracking-[-0.03em] text-ink sm:text-[26px]">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-9 text-[18px] font-semibold tracking-[-0.02em] text-ink">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mt-5 space-y-2.5">
                {b.items.map((item) => (
                  <li key={item} className="relative pl-6 before:absolute before:left-1 before:top-[0.72em] before:size-1.5 before:rounded-full before:bg-primary">
                    {rich(item)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-6 space-y-4">
                {b.items.map((item, n) => (
                  <li key={item} className="flex gap-4">
                    <span className="tabular mt-[3px] flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[12px] font-semibold text-primary">{n + 1}</span>
                    <span className="min-w-0">{rich(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <aside key={i} className="mt-8 rounded-2xl border bg-[#FAFAFA] p-5 sm:p-6">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                  <Info className="size-4 text-primary" /> {b.title}
                </div>
                <p className="mt-2 text-[15.5px] leading-relaxed text-muted-foreground">{rich(b.text)}</p>
              </aside>
            );
          case "quote":
            return (
              <figure key={i} className="my-12 border-l-2 border-primary pl-6">
                <blockquote className="text-[21px] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[24px]">&ldquo;{b.text}&rdquo;</blockquote>
                {b.cite && <figcaption className="mt-3 text-[14px] text-muted-foreground">— {b.cite}</figcaption>}
              </figure>
            );
        }
      })}
    </div>
  );
}
