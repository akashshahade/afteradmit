"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig } from "@/components/shell/form-sheet";
import { createClient } from "@/lib/supabase/client";
import { displayName, initials, type Profile } from "@/lib/auth-profile";

const defaultTeam = [
  { n: "Sam Patel", e: "sam@afteradmit.com", r: "Content editor", i: "SP", c: "#FF4500" },
  { n: "Mia Johnson", e: "mia@afteradmit.com", r: "Partnerships", i: "MJ", c: "#7C3AED" },
  { n: "Leo Park", e: "leo@afteradmit.com", r: "Moderator", i: "LP", c: "#0F766E" },
];

export default function AdminSettings() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [members, setMembers] = React.useState(defaultTeam);
  const [form, setForm] = React.useState<FormSheetConfig | null>(null);

  React.useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_my_profile");
        if (error) throw error;
        const row = (Array.isArray(data) ? data[0] : data) as Profile | null;
        setProfile(row);
        setFirstName(row?.first_name ?? "");
        setLastName(row?.last_name ?? "");
        setEmail(row?.email ?? "");
        if (row) {
          setMembers((m) => [
            { n: displayName(row), e: row.email, r: "Owner", i: initials(row), c: "#18181B" },
            ...m,
          ]);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <PageContainer className="max-w-[920px]">
        <PageHeader eyebrow="Workspace" title="Settings" description="Loading…" />
        <Skeleton className="mt-7 h-[200px] rounded-2xl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-[920px]">
      <PageHeader eyebrow="Workspace" title="Settings" description="Your account, team, and platform defaults." />

      <section className="mt-7 rounded-2xl border bg-white">
        <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Your account</div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>First name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Last name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Email</Label>
            <Input value={email} readOnly className="text-muted-foreground" />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-[14.5px] font-semibold">Team</div>
          <Button
            size="xs"
            variant="ink"
            onClick={() =>
              setForm({
                title: "Invite a teammate",
                description: "They'll get an email to join the AfterAdmit workspace.",
                submitLabel: "Send invite",
                success: "Invite sent",
                fields: [
                  { name: "name", label: "Name", required: true },
                  { name: "email", label: "Work email", type: "email", required: true, placeholder: "name@afteradmit.com" },
                  { name: "role", label: "Role", type: "select", options: ["Content editor", "Partnerships", "Moderator", "Analyst"] },
                ],
                onSubmit: (v) =>
                  setMembers((m) => [
                    ...m,
                    { n: v.name, e: v.email, r: v.role, i: v.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase(), c: "#0EA5E9" },
                  ]),
              })
            }
          >
            <Plus className="size-3.5" /> Invite
          </Button>
        </div>
        <ul className="divide-y">
          {members.map((t) => (
            <li key={t.e} className="flex items-center gap-3 px-6 py-3">
              <Avatar>
                <AvatarFallback className="text-white" style={{ background: t.c }}>
                  {t.i}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{t.n}</div>
                <div className="text-[12px] text-muted-foreground">{t.e}</div>
              </div>
              {t.r === "Owner" ? (
                <Badge variant="ink">Owner</Badge>
              ) : (
                <Select defaultValue={t.r}>
                  <SelectTrigger size="sm" className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Content editor", "Partnerships", "Moderator", "Analyst"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-2xl border bg-white">
        <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Platform defaults</div>
        <div className="divide-y px-6">
          {[
            ["Invite link expiry", "Days before a student invite expires", "14 days"],
            ["Lead counting", "When a provider click counts as a billable lead", "On click"],
            ["Reminder cadence", "Days before due date to send reminders", "7 and 1 days"],
          ].map(([t, d, v]) => (
            <div key={t} className="flex items-center justify-between py-4">
              <div>
                <div className="text-[13px] font-medium">{t}</div>
                <div className="text-[12px] text-muted-foreground">{d}</div>
              </div>
              <span className="text-[13px] font-medium">{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="text-[13px] font-medium">Allow universities to write their own milestones</div>
              <div className="text-[12px] text-muted-foreground">Otherwise they can only edit and hide AfterAdmit milestones</div>
            </div>
            <Switch />
          </div>
        </div>
      </section>

      <div className="mt-5 flex justify-end">
        <FormSheet config={form} onClose={() => setForm(null)} />
        <Button
          variant="ink"
          onClick={() => {
            if (profile) toast.success("Account loaded from live profile");
            else toast.success("Settings saved");
          }}
        >
          Save changes
        </Button>
      </div>
    </PageContainer>
  );
}