"use client";

import { toast } from "sonner";
import { BadgeCheck, Upload, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { partner } from "@/lib/ops-data";

export default function PartnerSettings() {
  return (
    <PageContainer className="max-w-[920px]">
      <PageHeader eyebrow="Company" title="Company profile" description="How Westwood Commons appears to students across AfterAdmit." />

      <section className="mt-7 rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-[14.5px] font-semibold">Public profile</div>
          <Badge variant="default" className="gap-1">
            <BadgeCheck /> Verified partner
          </Badge>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-ink text-[18px] font-bold text-white">WC</span>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Replace logo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Company name</Label>
              <Input defaultValue={partner.company} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input defaultValue="Housing" readOnly className="text-muted-foreground" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tagline</Label>
              <Input defaultValue="Furnished student suites + short-stay beds" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>About</Label>
              <Textarea defaultValue="Furnished suites a 6-minute walk from campus, plus 2-week arrival beds for students whose lease starts later." />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input defaultValue="https://westwoodcommons.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Support email</Label>
              <Input defaultValue="students@westwoodcommons.com" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-[14.5px] font-semibold">Team</div>
          <Button size="xs" variant="ink">
            <Plus className="size-3.5" /> Invite
          </Button>
        </div>
        <ul className="divide-y">
          {[
            { n: partner.contact, e: partner.email, r: "Admin", i: partner.initials, c: "#FF4500" },
            { n: "Marcus Hill", e: "marcus@westwoodcommons.com", r: "Viewer", i: "MH", c: "#18181B" },
          ].map((t) => (
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
              <Badge variant="secondary">{t.r}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-2xl border bg-white">
        <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Notifications</div>
        <div className="divide-y px-6">
          {[
            ["Daily lead summary", "Email at 8am PT", true],
            ["Listing review updates", "When AfterAdmit approves or requests changes", true],
            ["Community mentions", "When students mention Westwood Commons", false],
          ].map(([t, d, on]) => (
            <div key={t as string} className="flex items-center justify-between py-4">
              <div>
                <div className="text-[13px] font-medium">{t}</div>
                <div className="text-[12px] text-muted-foreground">{d}</div>
              </div>
              <Switch defaultChecked={on as boolean} />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 flex justify-end">
        <Button variant="ink" onClick={() => toast.success("Profile saved")}>
          Save changes
        </Button>
      </div>
    </PageContainer>
  );
}
