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
import { modQueue } from "@/lib/ops-data";
import { communities } from "@/lib/community-data";

export default function ModerationPage() {
  const [queue, setQueue] = React.useState(modQueue);
  const [tab, setTab] = React.useState("queue");
  const [settings, setSettings] = React.useState<FormSheetConfig | null>(null);

  const act = (id: string, msg: string) => {
    setQueue((q) => q.filter((x) => x.id !== id));
    toast(msg);
  };

  return (
    <PageContainer>
      <PageHeader eyebrow="Insights" title="Community moderation" description="Reports, removals, and community settings across every school." />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open reports" value={queue.length} hint="awaiting review" icon={Flag} />
        <KpiCard label="Posts this week" value="1,284" delta={14.2} icon={FileText} />
        <KpiCard label="Comments this week" value="6,920" delta={9.1} icon={MessageSquare} />
        <KpiCard label="Avg. time to action" value="3.2h" delta={-12} hint="faster" icon={Check} />
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
              <p className="text-[13px] text-muted-foreground">Nice work. New reports will show up here.</p>
            </div>
          )}
          {queue.map((r) => (
            <div key={r.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-5 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <Badge variant={r.reports >= 4 ? "destructive" : "warning"} className="gap-1">
                    <Flag /> {r.reports} reports
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {r.kind}
                  </Badge>
                  <span className="font-semibold">{r.community}</span>
                  <span className="text-subtle">·</span>
                  <span className="text-muted-foreground">@{r.author}</span>
                  <span className="text-subtle">·</span>
                  <span className="text-muted-foreground">{r.when} ago</span>
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed">“{r.excerpt}”</p>
                <div className="mt-1.5 text-[12px] text-muted-foreground">
                  Reason: <span className="font-medium text-foreground">{r.reason}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => act(r.id, "Approved — reports dismissed")}>
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
                    <DropdownMenuItem onSelect={() => window.open(`/student/community/c/${communities.find((c) => c.name === r.community)?.id ?? ""}`, "_blank", "noopener")}>
                      <Eye /> View in context
                    </DropdownMenuItem>
                    {r.kind === "post" && (
                      <>
                        <DropdownMenuItem onSelect={() => toast("Comments locked")}>
                          <Lock /> Lock comments
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toast("Post pinned")}>
                          <Pin /> Pin
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => act(r.id, `@${r.author} banned`)}>
                      <Ban /> Ban user
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
                <TableHead>Moderators</TableHead>
                <TableHead>Partners can post</TableHead>
                <TableHead>Restricted</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: c.color }}>
                        {c.emoji}
                      </span>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-[12px] text-muted-foreground">UCLA Anderson</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="tabular">{c.members}</TableCell>
                  <TableCell className="tabular">{c.id === "Roommates" ? 3 : 2}</TableCell>
                  <TableCell>
                    <Switch defaultChecked={c.id === "Housing"} />
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked={c.id === "AndersonFall27"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setSettings({
                          title: `${c.name} settings`,
                          description: "Applies to this space at every school.",
                          success: "Space settings saved",
                          successDescription: c.name,
                          fields: [
                            { name: "name", label: "Space name", defaultValue: c.name, required: true },
                            { name: "description", label: "Description", type: "textarea", defaultValue: c.description },
                            { name: "rules", label: "Guidelines (one per line)", type: "textarea", defaultValue: c.rules.join("\n") },
                            { name: "slow", label: "Slow mode", type: "switch", hint: "Members can post once every 10 minutes" },
                            { name: "approve", label: "Approve new posts", type: "switch", hint: "Moderators review posts before they go live" },
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
            {[
              ["Daniel Kim", "removed a comment", "Roommates", "Spam / self-promotion", "1h"],
              ["AfterAdmit Team", "locked a post", "Anderson Fall '27", "Announcement", "2d"],
              ["Sayali D.", "pinned a post", "Roommates", "Roommate spreadsheet", "3d"],
              ["AfterAdmit Team", "banned @party_la", "Westwood Life", "Repeated spam", "4d"],
            ].map(([who, what, where, why, when]) => (
              <li key={who + what} className="flex items-center gap-3 px-5 py-3 text-[13px]">
                <span className="font-semibold">{who}</span>
                <span className="text-muted-foreground">{what} in</span>
                <span className="font-medium">{where}</span>
                <span className="truncate text-muted-foreground">— {why}</span>
                <span className="ml-auto shrink-0 text-[12px] text-subtle">{when} ago</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <FormSheet config={settings} onClose={() => setSettings(null)} />
    </PageContainer>
  );
}
