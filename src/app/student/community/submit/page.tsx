"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AlignLeft, ImageIcon, Link2, BarChart3, Bold, Italic, List, Link as LinkIcon, Code, Route, X, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CommunityIcon } from "@/components/community/post-card";
import { communities } from "@/lib/community-data";
import { milestones } from "@/lib/data";

const flairs = ["Question", "Looking", "Offering", "Guide", "Interview experience", "Meetup"];

function SubmitInner() {
  const router = useRouter();
  const params = useSearchParams();
  const m = params.get("m");
  const linked = m ? milestones.find((x) => x.id === m) : undefined;
  const [community, setCommunity] = React.useState(params.get("c") ?? linked?.communityTag ?? "AndersonFall27");
  const [type, setType] = React.useState<"text" | "image" | "link" | "poll">("text");
  const [title, setTitle] = React.useState(linked ? `Question about “${linked.title}”` : "");
  const [flair, setFlair] = React.useState<string | null>("Question");
  const [milestone, setMilestone] = React.useState(linked?.id ?? "none");
  const [options, setOptions] = React.useState(["", ""]);
  const [body, setBody] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const imageRef = React.useRef<HTMLInputElement>(null);

  const formatting = [
    { icon: Bold, label: "Bold", wrap: ["**", "**"] },
    { icon: Italic, label: "Italic", wrap: ["_", "_"] },
    { icon: List, label: "Bulleted list", wrap: ["\n- ", ""] },
    { icon: LinkIcon, label: "Link", wrap: ["[", "](https://)"] },
    { icon: Code, label: "Code", wrap: ["`", "`"] },
  ] as const;

  const format = ([before, after]: readonly [string, string]) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = body.slice(0, s) + before + body.slice(s, e) + after + body.slice(e);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, e + before.length);
    });
  };

  const addImages = (files: FileList | null) => {
    const list = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setImages((im) => [...im, ...list.map((f) => URL.createObjectURL(f))].slice(0, 8));
  };

  const tabs = [
    { k: "text", l: "Text", i: AlignLeft },
    { k: "image", l: "Images", i: ImageIcon },
    { k: "link", l: "Link", i: Link2 },
    { k: "poll", l: "Poll", i: BarChart3 },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-8 md:px-8">
      <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">Create post</h1>

      <div className="mt-5">
        <Select value={community} onValueChange={setCommunity}>
          <SelectTrigger className="h-10 rounded-full pl-1.5 pr-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {communities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center gap-2">
                  <CommunityIcon id={c.id} size={22} />
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 flex gap-5 border-b">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setType(t.k)}
            className={cn(
              "relative flex h-10 items-center gap-1.5 text-[13px] font-semibold transition-colors",
              type === t.k ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.i className="size-4" /> {t.l}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <div className="relative">
          <Input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 300))} placeholder="Title" className="h-12 rounded-xl text-[15px] font-medium" />
          <span className="tabular absolute bottom-[-18px] right-1 text-[11px] text-subtle">{title.length}/300</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {flairs.map((f) => (
            <button
              key={f}
              onClick={() => setFlair(flair === f ? null : f)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                flair === f ? "border-ink bg-ink text-white" : "text-muted-foreground hover:border-[#d4d4d8] hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {type === "text" && (
          <div className="overflow-hidden rounded-xl border focus-within:border-primary/60 focus-within:ring-[3px] focus-within:ring-primary/12">
            <div className="flex items-center gap-0.5 border-b px-2 py-1.5">
              {formatting.map(({ icon: I, label, wrap }) => (
                <button key={label} type="button" aria-label={label} title={label} onClick={() => format(wrap)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <I className="size-4" />
                </button>
              ))}
            </div>
            <Textarea ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body text (optional)" className="min-h-44 rounded-none border-0 shadow-none focus-visible:ring-0" />
          </div>
        )}
        {type === "image" && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addImages(e.dataTransfer.files);
            }}
            className="rounded-xl border border-dashed p-4"
          >
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((src, i) => (
                  <div key={src} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                    <img src={src} alt={`Upload ${i + 1}`} className="size-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => setImages((im) => im.filter((x) => x !== src))}
                      className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                {images.length < 8 && (
                  <button type="button" onClick={() => imageRef.current?.click()} className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed text-[12px] text-muted-foreground hover:bg-[#fafafa]">
                    <Plus className="mb-1 size-4" /> Add
                  </button>
                )}
              </div>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center text-center">
                <ImageIcon className="size-6 text-subtle" />
                <div className="mt-2 text-[13px] font-medium">Drag and drop images</div>
                <Button variant="outline" size="xs" className="mt-3" onClick={() => imageRef.current?.click()}>
                  Upload
                </Button>
              </div>
            )}
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addImages(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        )}
        {type === "link" && <Input placeholder="Link URL" className="h-11 rounded-xl" />}
        {type === "poll" && (
          <div className="space-y-2 rounded-xl border p-4">
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={o} onChange={(e) => setOptions((os) => os.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Option ${i + 1}`} />
                {options.length > 2 && (
                  <Button variant="ghost" size="icon-sm" onClick={() => setOptions((os) => os.filter((_, j) => j !== i))}>
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="ghost" size="xs" onClick={() => setOptions((os) => [...os, ""])} disabled={options.length >= 6}>
              <Plus className="size-3.5" /> Add option
            </Button>
          </div>
        )}

        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            <Route className="size-4 text-primary" /> Link to a milestone
          </div>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">Classmates working on the same milestone will see your post there.</p>
          <Select value={milestone} onValueChange={setMilestone}>
            <SelectTrigger className="mt-3 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="none">No milestone</SelectItem>
              {milestones.map((x) => (
                <SelectItem key={x.id} value={x.id}>
                  {x.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-xl border px-4 py-3">
          <div>
            <div className="text-[13px] font-medium">Notify me of replies</div>
            <div className="text-[12px] text-muted-foreground">Email and in-app</div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" className="rounded-full" onClick={() => toast("Draft saved")}>
            Save draft
          </Button>
          <Button
            className="rounded-full px-5"
            disabled={!title.trim()}
            onClick={() => {
              toast.success("Post published", { description: `Posted to a/${community}` });
              router.push(`/student/community/c/${community}`);
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <React.Suspense>
      <SubmitInner />
    </React.Suspense>
  );
}
