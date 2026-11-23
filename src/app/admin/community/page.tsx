"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, ShieldX, Ban, Flag, MessageSquare, FileText, Lock, Pin, Eye, Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig } from "@/components/shell/form-sheet";
import { KpiCard } from "@/components/charts/chart-bits";
import { loadAdminModeration, type AdminModeration } from "@/lib/admin-live";

function timeAgo(iso: string) {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export default function ModerationPage() {
  const [mod, setMod] = React.useState<AdminModeration | null>(null);
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  const [tab, setTab] = React.useState("queue");
  const [settings, setSettings] = React.useState<FormSheetConfig | null>(null);

  React.useEffect(() => {
    void loadAdminModeration()
      .then(setMod)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load moderation"));
  }, []);

  const queue = (mod?.recent_posts ?? []).filter((p) => !dismissed.includes(p.id));
  const spaces = mod?.spaces ?? [];

  const act = (id: string, msg: string) => {
    setDismissed((q) => [...q, id]);
    toast(msg);
  };

  const postTotal = mod?.recent_posts?.length ?? 0;

  return (
    <PageContainer>
      <PageHeader eyebrow="Insights" title="Community moderation" description="Reports, removals, and community settings across every school." />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Recent posts" value={String(queue.length)} hint="in review queue" icon={Flag} />
        <KpiCard label="Spaces" value={String(spaces.length)} icon={FileText} />
        <KpiCard label="Posts tracked" value={String(postTotal)} icon={MessageSquare} />
        <KpiCard label="Members (top spaces)" value={String(spaces.reduce((n, s) => n + s.members, 0))} icon={Check} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="queue">
            Mod queue <Badge variant="solid" className="ml-1 px-1.5 py-0">{queue.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="log">Mod log</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "queue" && (
        <div className="mt-4 space-y-3">
          {queue.length === 0 && (
            <div className="rounded-2xl border border-dashed py-16 text-center">
              <Check className="mx-auto size-6 text-success" />
              <div className="mt-2 text-[14px] font-semibold">Queue is clear</div>
              <p className="text-[13px] text-muted-foreground">Nice work. New posts will show up here.</p>
            </div>
          )}
          {queue.map((r) => (
            <div key={r.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-5 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <Badge variant="outline" className="capitalize">
                    post
                  </Badge>
                  <span className="font-semibold">{r.title ?? "Untitled"}</span>
                  <span className="text-subtle">·</span>
                  <span className="text-muted-foreground">{r.author_email ?? "anonymous"}</span>
                  <span className="text-subtle">·</span>
                  <span className="text-muted-foreground">{timeAgo(r.created_at)} ago</span>
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed">“{(r.body ?? "").slice(0, 200)}{(r.body ?? "").length > 200 ? "…" : ""}”</p>
                <div className="mt-1.5 text-[12px] text-muted-foreground">
                  Score: <span className="font-medium text-foreground">{r.vote_score}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => act(r.id, "Approved — kept visible")}>
                  <Check className="size-4" /> Approve
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive-soft" onClick={() => act(r.id, "Content removed")}>
                  <ShieldX className="size-4" /> Remove
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="More">
                      <Ellipsis className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => toast("Opening post preview")}>
                      <Eye /> View in context
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => toast("Comments locked")}>
                      <Lock /> Lock comments
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => toast("Post pinned")}>
                      <Pin /> Pin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => act(r.id, "Author restricted")}>
                      <Ban /> Restrict user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "communities" && (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Community</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Partners can post</TableHead>
                <TableHead>Restricted</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-[13px] text-muted-foreground">
                    No community spaces yet.
                  </TableCell>
                </TableRow>
              )}
              {spaces.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-[12px] text-muted-foreground">{c.title ?? "—"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="tabular">{c.members}</TableCell>
                  <TableCell className="tabular">{c.posts}</TableCell>
                  <TableCell>
                    <Switch defaultChecked={false} />
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked={false} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setSettings({
                          title: `${c.name} settings`,
                          description: "Space configuration.",
                          success: "Space settings saved",
                          successDescription: c.name,
                          fields: [
                            { name: "name", label: "Space name", defaultValue: c.name, required: true },
                            { name: "description", label: "Description", type: "textarea", defaultValue: c.title ?? "" },
                          ],
                        })
                      }
                    >
                      Settings
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {tab === "log" && (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
          <ul className="divide-y">
            {(mod?.recent_posts ?? []).slice(0, 8).map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3 text-[13px]">
                <span className="font-semibold">{p.author_email ?? "System"}</span>
                <span className="text-muted-foreground">posted in</span>
                <span className="font-medium">{p.title ?? p.space_id}</span>
                <span className="ml-auto shrink-0 text-[12px] text-subtle">{timeAgo(p.created_at)} ago</span>
              </li>
            ))}
            {!mod?.recent_posts?.length && (
              <li className="px-5 py-10 text-center text-[13px] text-muted-foreground">No activity logged yet.</li>
            )}
          </ul>
        </div>
      )}
      <FormSheet config={settings} onClose={() => setSettings(null)} />
    </PageContainer>
  );
}