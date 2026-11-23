"use client";

import * as React from "react";
import { toast } from "sonner";
import { BadgeCheck, Upload, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/client";
import { displayName, initials, type Profile } from "@/lib/auth-profile";
import { getMyPartnerOrg, updatePartnerOrg, type PartnerOrg } from "@/lib/partner-live";

export default function PartnerSettings() {
  const [org, setOrg] = React.useState<PartnerOrg | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [companyName, setCompanyName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const [orgRow, profileRes] = await Promise.all([
          getMyPartnerOrg(),
          supabase.rpc("get_my_profile"),
        ]);
        if (profileRes.error) throw profileRes.error;
        const row = (Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data) as Profile | null;
        setOrg(orgRow);
        setProfile(row);
        setCompanyName(orgRow?.name ?? "");
        setContactEmail(orgRow?.contact_email ?? row?.email ?? "");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updatePartnerOrg({
        name: companyName.trim(),
        contact_email: contactEmail.trim() || null,
      });
      setOrg(updated);
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const orgInitials = companyName.slice(0, 2).toUpperCase() || "PA";

  if (loading) {
    return (
      <PageContainer className="max-w-[920px]">
        <PageHeader eyebrow="Company" title="Company profile" description="Loading…" />
        <Skeleton className="mt-7 h-[360px] rounded-2xl" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-[920px]">
      <PageHeader
        eyebrow="Company"
        title="Company profile"
        description={org ? `How ${org.name} appears to students across AfterAdmit.` : "Partner organization settings."}
      />

      <section className="mt-7 rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-[14.5px] font-semibold">Public profile</div>
          {org?.status === "verified" && (
            <Badge variant="default" className="gap-1">
              <BadgeCheck /> Verified partner
            </Badge>
          )}
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-ink text-[18px] font-bold text-white">{orgInitials}</span>
            <Button variant="outline" size="sm" type="button">
              <Upload className="size-4" /> Replace logo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Company name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={org?.slug ?? ""} readOnly className="text-muted-foreground" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Support email</Label>
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" />
            </div>
          </div>
        </div>
      </section>

      {profile && (
        <section className="mt-5 rounded-2xl border bg-white">
          <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Your account</div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">{initials(profile)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[13px] font-medium">{displayName(profile)}</div>
              <div className="text-[12px] text-muted-foreground">{profile.email}</div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-5 rounded-2xl border bg-white">
        <div className="border-b px-6 py-4 text-[14.5px] font-semibold">Notifications</div>
        <div className="divide-y px-6">
          {[
            ["Daily lead summary", "Email at 8am PT", true],
            ["Listing review updates", "When AfterAdmit approves or requests changes", true],
            ["Community mentions", "When students mention your company", false],
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
        <Button variant="ink" disabled={saving || !companyName.trim()} onClick={() => void save()}>
          Save changes
        </Button>
      </div>
    </PageContainer>
  );
}