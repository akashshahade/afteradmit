"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/client";
import type { SchoolSettings } from "@/lib/university-batches";

export default function UniversitySettingsPage() {
  const [settings, setSettings] = React.useState<SchoolSettings | null>(null);
  const [fullName, setFullName] = React.useState("");
  const [shortName, setShortName] = React.useState("");
  const [timezone, setTimezone] = React.useState("America/Los_Angeles");
  const [supportEmail, setSupportEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_school_settings");
        if (error) throw error;
        const row = (Array.isArray(data) ? data[0] : data) as SchoolSettings | null;
        setSettings(row);
        if (row) {
          setFullName(row.full_name ?? "");
          setShortName(row.short_name ?? "");
          setTimezone(row.timezone ?? "America/Los_Angeles");
          setSupportEmail(row.support_email ?? "");
        }
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
      const supabase = createClient();
      const { data, error } = await supabase.rpc("update_school_settings", {
        payload: {
          full_name: fullName.trim(),
          short_name: shortName.trim(),
          timezone: timezone.trim(),
          support_email: supportEmail.trim() || null,
        },
      });
      if (error) throw error;
      const row = (Array.isArray(data) ? data[0] : data) as SchoolSettings;
      setSettings(row);
      toast.success("School settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer className="max-w-[720px]">
      <PageHeader
        eyebrow="University"
        title="Settings"
        description="School-wide display settings. Cohort start dates and deadlines live on Batches."
      />

      <Card className="mt-6">
        <CardHeader className="border-b">
          <CardTitle>School profile</CardTitle>
          <CardDescription>
            {loading ? "Loading…" : settings?.name ? `Internal key: ${settings.name}` : "No school linked"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              placeholder="UCLA Anderson School of Management"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short-name">Short name</Label>
            <Input
              id="short-name"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              disabled={loading}
              placeholder="Anderson"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={loading}
              placeholder="America/Los_Angeles"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-email">Support email</Label>
            <Input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={loading}
              placeholder="admissions@school.edu"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="ink" disabled={loading || saving} onClick={() => void save()}>
              {saving ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
            <Layers className="size-5" />
          </div>
          <div>
            <CardTitle className="text-[15px]">Program start & deadlines</CardTitle>
            <CardDescription>
              Manage Fall / Spring cohorts, program start dates, and admissions deadlines in Batches.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" size="sm">
            <Link href="/university/batches">Open batches</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
