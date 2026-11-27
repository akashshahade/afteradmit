"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Building2, Store, Clock, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/shell/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loadAccessRequests, type AdminAccessRequest } from "@/lib/admin-live";

const FREE_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
]);

function emailTrust(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (!domain) return { label: "Unknown domain", warn: true };
  if (domain.endsWith(".edu") || domain.includes(".ac.") || domain.endsWith(".edu.au")) {
    return { label: `Verified .edu domain (${domain})`, warn: false };
  }
  if (FREE_DOMAINS.has(domain)) {
    return { label: `Free email (${domain}) — verify carefully`, warn: true };
  }
  return { label: `Custom domain (${domain})`, warn: false };
}

export default function AdminApprovalsPage() {
  const [rows, setRows] = React.useState<AdminAccessRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [schoolOverrides, setSchoolOverrides] = React.useState<Record<string, string>>({});
  const [rejectReasons, setRejectReasons] = React.useState<Record<string, string>>({});

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const data = await loadAccessRequests();
    setRows(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const review = async (req: AdminAccessRequest, decision: "approve" | "reject") => {
    setBusyId(req.id);
    try {
      const res = await fetch("/api/admin/approvals/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: req.id,
          decision,
          schoolName:
            decision === "approve" && req.requested_role === "university_admin"
              ? (schoolOverrides[req.id] ?? req.requested_org_name ?? "").trim()
              : undefined,
          reason: decision === "reject" ? (rejectReasons[req.id] ?? "").trim() : undefined,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; emailSent?: boolean };
      if (!res.ok) throw new Error(json.error ?? "Action failed");
      toast.success(
        decision === "approve"
          ? `Approved ${req.email}${json.emailSent ? " (email sent)" : ""}`
          : `Rejected ${req.email}${json.emailSent ? " (email sent)" : ""}`,
      );
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update request");
    } finally {
      setBusyId(null);
    }
  };

  const pending = rows.filter((r) => r.approval_status === "pending");
  const history = rows.filter((r) => r.approval_status !== "pending");

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        eyebrow="Access control"
        title="Access approvals"
        description="Vet university admin and partner onboarding applications before granting workspace access."
      />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <h2 className="text-[15px] font-semibold">Pending review ({pending.length})</h2>
        </div>

        {loading ? (
          <Card className="p-6 text-[13.5px] text-muted-foreground">Loading requests…</Card>
        ) : pending.length === 0 ? (
          <Card className="p-6 text-[13.5px] text-muted-foreground">
            No pending access requests right now.
          </Card>
        ) : (
          <div className="space-y-4">
            {pending.map((req) => {
              const isUni = req.requested_role === "university_admin";
              const name = `${req.first_name ?? ""} ${req.last_name ?? ""}`.trim() || req.email;
              const d = req.application_details ?? {};
              const trust = emailTrust(req.email);

              return (
                <Card key={req.id} className="p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15.5px] font-semibold">{name}</span>
                        <Badge variant="outline" className="gap-1">
                          {isUni ? <Building2 className="size-3" /> : <Store className="size-3" />}
                          {isUni ? "University admin" : "Partner"}
                        </Badge>
                        <Badge
                          variant={trust.warn ? "secondary" : "outline"}
                          className={`gap-1 ${trust.warn ? "text-amber-800 bg-amber-50 border-amber-200" : "text-emerald-800 bg-emerald-50 border-emerald-200"}`}
                        >
                          {trust.warn ? <AlertTriangle className="size-3" /> : <ShieldCheck className="size-3" />}
                          {trust.label}
                        </Badge>
                      </div>
                      <div className="text-[13px] text-muted-foreground">
                        {req.email}
                        {d.job_title ? ` · ${d.job_title}` : ""}
                      </div>
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      Applied {new Date(req.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid gap-x-6 gap-y-2 rounded-xl bg-muted/40 p-3.5 text-[13px] sm:grid-cols-2">
                    <div>
                      <span className="text-muted-foreground">{isUni ? "University: " : "Company: "}</span>
                      <span className="font-medium">{req.requested_org_name || "—"}</span>
                    </div>
                    {d.website && (
                      <div className="truncate">
                        <span className="text-muted-foreground">Website: </span>
                        <a
                          href={d.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          {d.website.replace(/^https?:\/\//, "")}
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    )}
                    {(d.country || d.city) && (
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        <span className="font-medium">
                          {[d.city, d.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {d.department && (
                      <div>
                        <span className="text-muted-foreground">Department: </span>
                        <span className="font-medium">{d.department}</span>
                      </div>
                    )}
                    {d.annual_admits && (
                      <div>
                        <span className="text-muted-foreground">Annual admits: </span>
                        <span className="font-medium">{d.annual_admits}</span>
                      </div>
                    )}
                    {d.category && (
                      <div>
                        <span className="text-muted-foreground">Category: </span>
                        <span className="font-medium">{d.category}</span>
                      </div>
                    )}
                    {d.target_regions && (
                      <div>
                        <span className="text-muted-foreground">Target regions: </span>
                        <span className="font-medium">{d.target_regions}</span>
                      </div>
                    )}
                    {(d.verification_note || d.description) && (
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">
                          {isUni ? "Verification note: " : "Offer summary: "}
                        </span>
                        <span>{d.verification_note || d.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {isUni && (
                      <Input
                        value={schoolOverrides[req.id] ?? req.requested_org_name ?? ""}
                        onChange={(e) =>
                          setSchoolOverrides((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        placeholder="School name to assign"
                        className="h-9"
                      />
                    )}
                    <Input
                      value={rejectReasons[req.id] ?? ""}
                      onChange={(e) =>
                        setRejectReasons((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      placeholder="Optional note if rejecting"
                      className="h-9"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="ink"
                      disabled={busyId === req.id}
                      onClick={() => void review(req, "approve")}
                    >
                      <Check className="size-4" /> Approve &amp; email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === req.id}
                      onClick={() => void review(req, "reject")}
                    >
                      <X className="size-4" /> Reject
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[15px] font-semibold">Reviewed ({history.length})</h2>
          <Card className="divide-y">
            {history.map((req) => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-[13.5px]">
                <div>
                  <div className="font-medium">
                    {`${req.first_name ?? ""} ${req.last_name ?? ""}`.trim() || req.email}{" "}
                    <span className="text-muted-foreground">({req.email})</span>
                  </div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {req.requested_role === "university_admin" ? "University admin" : "Partner"} ·{" "}
                    {req.school_name || req.requested_org_name || "—"}
                    {req.rejection_reason ? ` · Note: ${req.rejection_reason}` : ""}
                  </div>
                </div>
                <Badge variant={req.approval_status === "approved" ? "default" : "secondary"}>
                  {req.approval_status}
                </Badge>
              </div>
            ))}
          </Card>
        </section>
      )}
    </PageContainer>
  );
}
