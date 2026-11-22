"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/client";
import { displayName, type Profile } from "@/lib/auth-profile";

export default function UniversityProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

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
        setHandle(row?.handle ?? "");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("update_my_admin_profile", {
        payload: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          handle: handle.trim() || null,
        },
      });
      if (error) throw error;
      const row = (Array.isArray(data) ? data[0] : data) as Profile;
      setProfile(row);
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/university/login");
  };

  return (
    <PageContainer className="max-w-[640px]">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description={profile ? displayName(profile) : "University admin"}
      />

      <Card className="mt-6">
        <CardHeader className="border-b">
          <CardTitle>Personal details</CardTitle>
          <CardDescription>Visible to AfterAdmit support when you contact us.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} readOnly disabled={loading} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first">First name</Label>
              <Input
                id="first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Last name</Label>
              <Input
                id="last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={loading}
              placeholder="optional"
            />
          </div>
          <div className="space-y-2">
            <Label>School</Label>
            <Input value={profile?.school_name ?? ""} readOnly disabled />
          </div>
          <div className="flex flex-wrap justify-between gap-2 pt-1">
            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut className="size-4" /> Sign out
            </Button>
            <Button variant="ink" disabled={loading || saving} onClick={() => void save()}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
