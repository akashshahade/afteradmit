"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Ellipsis, Pencil, Pause, Play, Copy, Trash2, Upload, Route, Eye, MousePointerClick, Percent, Gift } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { listings as seed, type Listing } from "@/lib/ops-data";

const placementOptions = ["Housing type decided", "Roommates confirmed", "Lease signed", "Arrival plan made", "Moved in"];

function PhotoPicker() {
  const [photos, setPhotos] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const created = React.useRef<string[]>([]);

  React.useEffect(() => () => created.current.forEach((p) => URL.revokeObjectURL(p)), []);

  return (
    <div className="grid grid-cols-4 gap-2">
      {photos.map((src, i) => (
        <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
          <img src={src} alt={`Listing photo ${i + 1}`} className="size-full object-cover" />
          <button
            type="button"
            aria-label="Remove photo"
            onClick={() => setPhotos((p) => p.filter((x) => x !== src))}
            className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
      {photos.length === 0 &&
        [0, 1, 2].map((i) => <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7]" />)}
      {photos.length < 8 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed text-[11px] text-muted-foreground hover:bg-[#fafafa]"
        >
          <Upload className="mb-1 size-4" /> Add
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
          const urls = files.map((f) => URL.createObjectURL(f));
          created.current.push(...urls);
          setPhotos((p) => [...p, ...urls].slice(0, 8));
          if (files.length) toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added`);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ListingSheet({ open, onOpenChange, listing, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; listing: Listing | null; onSave: (l: Partial<Listing>) => void }) {
  const [title, setTitle] = React.useState(listing?.title ?? "");
  const handleOpenChange = (o: boolean) => {
    if (!o) setTitle(listing?.title ?? "");
    onOpenChange(o);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle>{listing ? "Edit listing" : "New listing"}</SheetTitle>
          <SheetDescription>New listings and edits are reviewed by AfterAdmit before going live (usually within 1 business day).</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <div className="space-y-1.5">
            <Label>Listing title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Furnished 2-bed suite · Gayley Ave" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select defaultValue={listing?.type ?? "Shared suite"}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Shared suite", "Studio", "Short stay", "Sublet", "1-bed apartment"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input defaultValue={listing?.price ?? ""} placeholder="$1,500 / mo" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea placeholder="What's included, distance to campus, lease terms…" defaultValue={listing ? "Fully furnished suite, 6-minute walk to campus. Utilities and Wi-Fi included. 12-month lease with August move-in." : ""} className="min-h-24" />
          </div>
          <div className="space-y-1.5">
            <Label>Photos</Label>
            <PhotoPicker />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Gift className="size-3.5 text-primary" /> Student perk (optional)
            </Label>
            <Input defaultValue={listing?.perk ?? ""} placeholder="e.g. No application fee" />
          </div>
          <div className="space-y-1.5">
            <Label>Destination URL</Label>
            <Input defaultValue="https://westwoodcommons.com/suites/gayley" />
            <p className="font-mono text-[11.5px] text-muted-foreground">→ …/gayley?ref=afteradmit&amp;m=&#123;milestone&#125;&amp;s=&#123;school&#125;</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Route className="size-3.5" /> Requested placements
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {placementOptions.map((p) => (
                <label key={p} className="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
                  <Checkbox defaultChecked={listing?.placements.includes(p)} /> {p}
                </label>
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground">AfterAdmit decides final placement per university.</p>
          </div>
        </div>
        <div className="flex justify-between gap-2 border-t px-6 py-4">
          <Button variant="ghost" onClick={() => toast("Draft saved")}>
            Save draft
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!title.trim()}
              onClick={() => {
                onSave({ title });
                handleOpenChange(false);
              }}
            >
              Submit for review
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ListingsInner() {
  const params = useSearchParams();
  const [items, setItems] = React.useState(seed);
  const [tab, setTab] = React.useState("all");
  const [sheet, setSheet] = React.useState(params.get("new") === "1");
  const [editing, setEditing] = React.useState<Listing | null>(null);
  const [deleting, setDeleting] = React.useState<Listing | null>(null);

  const list = items.filter((l) => tab === "all" || l.status === tab);

  const update = (id: string, patch: Partial<Listing>) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Manage"
        title="Listings"
        description="Services you offer to admitted students. Each listing can appear on relevant roadmap milestones and in the marketplace."
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setSheet(true);
            }}
          >
            <Plus className="size-4" /> New listing
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList>
          {["all", "Live", "In review", "Paused"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t}
              <span className="tabular ml-1 text-subtle">{t === "all" ? items.length : items.filter((x) => x.status === t).length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {list.map((l) => (
          <div key={l.id} className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-md">
            <div className="relative h-36 bg-gradient-to-br from-[#f4f4f5] via-[#ececee] to-[#e4e4e7]">
              <svg viewBox="0 0 400 144" className="absolute inset-0 size-full opacity-60" preserveAspectRatio="xMidYMid slice">
                <rect x="40" y="40" width="120" height="104" fill="#fff" />
                <rect x="60" y="60" width="30" height="30" fill="#e4e4e7" />
                <rect x="110" y="60" width="30" height="30" fill="#e4e4e7" />
                <rect x="180" y="20" width="160" height="124" fill="#fafafa" />
                {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={196 + c * 36} y={36 + r * 34} width="22" height="22" fill="#e4e4e7" />))}
              </svg>
              <div className="absolute left-3 top-3">
                <Badge variant={l.status === "Live" ? "success" : l.status === "In review" ? "warning" : "secondary"} className="bg-white shadow-sm">
                  <span className={cn("size-1.5 rounded-full", l.status === "Live" ? "bg-success" : l.status === "In review" ? "bg-warning" : "bg-subtle")} />
                  {l.status}
                </Badge>
              </div>
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-xs" className="bg-white" aria-label="Listing actions">
                      <Ellipsis className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => {
                        setEditing(l);
                        setSheet(true);
                      }}
                    >
                      <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => toast("Opening student preview")}>
                      <Eye /> Preview as student
                    </DropdownMenuItem>
                    {l.status === "Live" ? (
                      <DropdownMenuItem
                        onSelect={() => {
                          update(l.id, { status: "Paused" });
                          toast("Listing paused");
                        }}
                      >
                        <Pause /> Pause
                      </DropdownMenuItem>
                    ) : l.status === "Paused" ? (
                      <DropdownMenuItem
                        onSelect={() => {
                          update(l.id, { status: "Live" });
                          toast.success("Listing resumed");
                        }}
                      >
                        <Play /> Resume
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onSelect={() => {
                        setItems((xs) => [...xs, { ...l, id: `ls${Date.now()}`, title: `${l.title} (copy)`, status: "Draft", clicks: 0, ctr: 0, updated: "Just now" }]);
                        toast("Listing duplicated");
                      }}
                    >
                      <Copy /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(l)}>
                      <Trash2 /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[14.5px] font-semibold">{l.title}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                    {l.type} · {l.price}
                  </div>
                </div>
              </div>
              {l.perk && (
                <div className="mt-3 w-fit rounded-md bg-primary-soft px-2 py-1 text-[11.5px] font-medium text-primary">
                  <Gift className="mr-1 inline size-3" />
                  {l.perk}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {l.placements.map((p) => (
                  <Badge key={p} variant="outline" className="gap-1 font-normal">
                    <Route /> {p}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border pt-0 [&>*]:bg-white" style={{ marginTop: 16 }}>
                <div className="p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MousePointerClick className="size-3" /> Leads
                  </div>
                  <div className="tabular text-[14px] font-semibold">{l.clicks}</div>
                </div>
                <div className="p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Percent className="size-3" /> CTR
                  </div>
                  <div className="tabular text-[14px] font-semibold">{l.ctr}%</div>
                </div>
                <div className="p-2.5">
                  <div className="text-[11px] text-muted-foreground">Schools</div>
                  <div className="truncate text-[12.5px] font-medium">{l.schools.join(", ")}</div>
                </div>
              </div>
              <div className="mt-3 text-[11.5px] text-subtle">Updated {l.updated}</div>
            </div>
          </div>
        ))}
      </div>

      <ListingSheet
        key={editing?.id ?? "new"}
        open={sheet}
        onOpenChange={setSheet}
        listing={editing}
        onSave={({ title }) => {
          if (editing) {
            update(editing.id, { title: title!, status: "In review", updated: "Just now" });
          } else {
            setItems((xs) => [
              { id: `ls${Date.now()}`, title: title!, type: "Shared suite", price: "$1,500 / mo", status: "In review", placements: ["Lease signed"], schools: ["UCLA Anderson"], clicks: 0, ctr: 0, updated: "Just now" },
              ...xs,
            ]);
          }
          toast.success("Submitted for review", { description: "AfterAdmit will review within 1 business day." });
        }}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>It will be removed from every milestone and the marketplace. Historical lead data is kept for billing.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setItems((xs) => xs.filter((x) => x.id !== deleting?.id));
                toast("Listing deleted");
              }}
            >
              Delete listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}

export default function ListingsPage() {
  return (
    <React.Suspense>
      <ListingsInner />
    </React.Suspense>
  );
}
