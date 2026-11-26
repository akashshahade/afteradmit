"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, X, Building2, Store, Clock } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loadAccessRequests, type AdminAccessRequest } from "@/lib/admin-live";

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
    <div className="space-y-8">
      <PageHeader
        eyebrow="Access control"
        title="Access approvals"
        description="Review university admin and partner requests before granting workspace access."
      />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <h2 className="text-[15px] font-semibold">Pending ({pending.length})</h2>
        </div>

        {loading ? (
          <Card className="p-6 text-[13.5px] text-muted-foreground">Loading requests…</Card>
        ) : pending.length === 0 ? (
          <Card className="p-6 text-[13.5px] text-muted-foreground">
            No pending access requests right now.
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((req) => {
              const isUni = req.requested_role === "university_admin";
              const name = `${req.first_name ?? ""} ${req.last_name ?? ""}`.trim() || req.email;
              return (
                <Card key={req.id} className="p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold">{name}</span>
                        <Badge variant="outline" className="gap-1">
                          {isUni ? <Building2 className="size-3" /> : <Store className="size-3" />}
                          {isUni ? "University admin" : "Partner"}
                        </Badge>
                      </div>
                      <div className="text-[13px] text-muted-foreground">{req.email}</div>
                      <div className="text-[13px]">
                        Requested organization:{" "}
                        <span className="font-medium text-foreground">
                          {req.requested_org_name || "—"}
                        </span>
                      </div>
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {new Date(req.created_at).toLocaleDateString()}
                    </div>
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
                      <Check className="size-4" /> Approve
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
    </div>
  );
}
