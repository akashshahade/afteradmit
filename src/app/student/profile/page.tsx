"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  UserRound,
  Route,
  ShieldCheck,
  Bell,
  CreditCard,
  Lock,
  Plug,
  Check,
  Download,
  Trash2,
  Sparkles,
  Laptop,
  Smartphone,
  Camera,
  Receipt,
  KeyRound,
  LifeBuoy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageContainer } from "@/components/shell/app-shell";
import { FormSheet, type FormSheetConfig } from "@/components/shell/form-sheet";
import { downloadFile } from "@/lib/download";
import { MyRequests } from "@/components/support/my-requests";
import { school, student } from "@/lib/data";

const tabs = [
  { k: "profile", l: "Profile", i: UserRound },
  { k: "journey", l: "Journey answers", i: Route },
  { k: "account", l: "Account & security", i: Lock },
  { k: "notifications", l: "Notifications", i: Bell },
  { k: "billing", l: "Plan & billing", i: CreditCard },
  { k: "privacy", l: "Privacy & data", i: ShieldCheck },
  { k: "connections", l: "Connected accounts", i: Plug },
  { k: "support", l: "Support requests", i: LifeBuoy },
] as const;

type Tab = (typeof tabs)[number]["k"];

function Section({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white">
      <div className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-[14.5px] font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div className="px-4 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 py-3 first:pt-0 last:pb-0 md:grid-cols-[220px_1fr] md:gap-6">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="mt-0.5 text-[12px] text-muted-foreground">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ToggleRow({ title, desc, defaultChecked = true }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0">
      <div>
        <div className="text-[13px] font-medium">{title}</div>
        <div className="text-[12px] text-muted-foreground">{desc}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => toast("Changes discarded")}>
        Cancel
      </Button>
      <Button variant="ink" size="sm" onClick={() => toast.success("Changes saved")}>
        Save changes
      </Button>
    </div>
  );
}

function ProfileTab() {
  const [photo, setPhoto] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-5">
      <Section title="Public profile" description="Visible to classmates in the community.">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {photo && <AvatarImage src={photo} alt="Your profile photo" className="object-cover" />}
            <AvatarFallback className="text-[20px] text-white" style={{ background: student.avatarColor }}>
              {student.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Camera className="size-4" /> {photo ? "Change photo" : "Upload photo"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              disabled={!photo}
              onClick={() => {
                setPhoto(null);
                toast("Photo removed");
              }}
            >
              Remove
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.type.startsWith("image/")) {
                  setPhoto(URL.createObjectURL(f));
                  toast.success("Profile photo updated");
                }
                e.target.value = "";
              }}
            />
          </div>
        </div>
        <Separator className="my-5" />
        <div className="space-y-1 divide-y">
          <Row label="Display name">
            <Input defaultValue={student.name} className="max-w-sm" />
          </Row>
          <Row label="Username" hint="Used for mentions in Spaces">
            <div className="flex max-w-sm items-center rounded-lg border shadow-xs focus-within:border-primary/60 focus-within:ring-[3px] focus-within:ring-primary/12">
              <span className="pl-3 text-[13.5px] text-subtle">@</span>
              <input defaultValue="sayali_d" className="h-9 flex-1 bg-transparent pr-3 text-[13.5px] outline-none" />
            </div>
          </Row>
          <Row label="Bio">
            <Textarea defaultValue="Ex-consultant from Mumbai. Incoming MBA '29. Looking for roommates near Westwood and anyone into weekend hikes." className="max-w-xl" />
          </Row>
          <Row label="Hometown">
            <Input defaultValue="Mumbai, India" className="max-w-sm" />
          </Row>
          <Row label="Pre-MBA industry">
            <Select defaultValue="consulting">
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="LinkedIn">
            <Input defaultValue="linkedin.com/in/sayalid" className="max-w-sm" />
          </Row>
        </div>
      </Section>
      <SaveBar />
    </div>
  );
}

function JourneyTab() {
  return (
    <div className="space-y-5">
      <Section title="Journey answers" description="These personalize your roadmap. Completed milestones are kept when you change an answer.">
        <div className="space-y-1 divide-y">
          <Row label="University">
            <div className="flex items-center gap-2 text-[13.5px]">
              {school.fullName} <Badge variant="secondary">Managed by school</Badge>
            </div>
          </Row>
          <Row label="Program & term">
            <div className="text-[13.5px]">
              {school.program} · {school.term}
            </div>
          </Row>
          {[
            ["Home country", "India", ["India", "China", "United States", "Other"]],
            ["Visa type", "F-1", ["F-1", "J-1", "Domestic"]],
            ["Housing preference", "Off-campus", ["Off-campus", "On-campus", "Not sure yet"]],
            ["Bringing dependents", "No", ["No", "Yes"]],
          ].map(([label, value, opts]) => (
            <Row key={label as string} label={label as string}>
              <Select defaultValue={value as string} onValueChange={() => toast("Roadmap updated", { description: "Milestones were added or hidden to match." })}>
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(opts as string[]).map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Row>
          ))}
          <Row label="Funding sources" hint="Select all that apply">
            <div className="flex flex-wrap gap-1.5">
              {["Scholarship", "Loan", "Sponsor", "Self-funded"].map((f) => (
                <FundingChip key={f} label={f} initial={student.profile.funding.includes(f)} />
              ))}
            </div>
          </Row>
        </div>
      </Section>
    </div>
  );
}

function FundingChip({ label, initial }: { label: string; initial: boolean }) {
  const [on, setOn] = React.useState(initial);
  return (
    <button
      onClick={() => {
        setOn((v) => !v);
        toast("Roadmap updated");
      }}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors",
        on ? "border-ink bg-ink text-white" : "text-muted-foreground hover:border-[#d4d4d8]",
      )}
    >
      {on && <Check className="size-3.5" strokeWidth={3} />} {label}
    </button>
  );
}

function AccountTab() {
  const [sessions, setSessions] = React.useState([
    { icon: Laptop, d: "MacBook Air · Chrome", l: "Mumbai, IN", t: "Current session", cur: true },
    { icon: Smartphone, d: "iPhone 15 · Safari", l: "Mumbai, IN", t: "2 hours ago", cur: false },
  ]);
  return (
    <div className="space-y-5">
      <Section title="Email">
        <div className="space-y-1 divide-y">
          <Row label="Sign-in email">
            <div className="flex max-w-md items-center gap-2">
              <Input defaultValue={student.email} />
              <Badge variant="success">Verified</Badge>
            </div>
          </Row>
          <Row label="School email" hint="Used for invite verification">
            <div className="flex max-w-md items-center gap-2">
              <Input defaultValue={student.schoolEmail} readOnly className="text-muted-foreground" />
            </div>
          </Row>
        </div>
      </Section>
      <Section title="Password" description="Last changed 2 months ago">
        <div className="grid max-w-md gap-3">
          <div className="space-y-1.5">
            <Label>Current password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-1.5">
            <Label>New password</Label>
            <Input type="password" />
          </div>
          <Button variant="outline" size="sm" className="w-fit" onClick={() => toast.success("Password updated")}>
            Update password
          </Button>
        </div>
      </Section>
      <Section
        title="Two-factor authentication"
        description="Add an extra layer of security with an authenticator app."
        action={<Switch defaultChecked onCheckedChange={(v) => toast(v ? "2FA enabled" : "2FA disabled")} />}
      >
        <div className="flex items-center gap-3 text-[13px]">
          <KeyRound className="size-4 text-muted-foreground" /> Authenticator app · Added Apr 9, 2027
        </div>
      </Section>
      <Section
        title="Active sessions"
        action={
          <Button
            variant="outline"
            size="xs"
            disabled={sessions.length === 1}
            onClick={() => {
              setSessions((s) => s.filter((x) => x.cur));
              toast.success("Signed out of other sessions");
            }}
          >
            Sign out others
          </Button>
        }
      >
        <ul className="divide-y">
          {sessions.map((s) => (
            <li key={s.d} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <s.icon className="size-4" />
              </span>
              <div className="flex-1">
                <div className="text-[13px] font-medium">{s.d}</div>
                <div className="text-[12px] text-muted-foreground">
                  {s.l} · {s.t}
                </div>
              </div>
              {s.cur ? (
                <Badge variant="success">This device</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setSessions((all) => all.filter((x) => x.d !== s.d));
                    toast.success("Session revoked", { description: s.d });
                  }}
                >
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-5">
      <Section title="Email" description="All emails come from AfterAdmit on behalf of UCLA Anderson.">
        <div className="divide-y">
          <ToggleRow title="Weekly digest" desc="Your progress and the next 3 actions, every Monday" />
          <ToggleRow title="Deadline reminders" desc="7 days and 1 day before a milestone is due" />
          <ToggleRow title="Overdue nudges" desc="When a milestone passes its due date" />
          <ToggleRow title="Community replies" desc="When someone replies to your posts or comments" />
          <ToggleRow title="Direct messages" desc="When a classmate messages you" />
          <ToggleRow title="Partner offers" desc="New perks from vetted providers" defaultChecked={false} />
        </div>
      </Section>
      <Section title="Delivery">
        <div className="divide-y">
          <Row label="Digest day">
            <Select defaultValue="mon">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mon">Monday</SelectItem>
                <SelectItem value="wed">Wednesday</SelectItem>
                <SelectItem value="fri">Friday</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="Timezone">
            <Select defaultValue="ist">
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ist">India Standard Time (GMT+5:30)</SelectItem>
                <SelectItem value="pt">Pacific Time (GMT−7)</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </div>
      </Section>
    </div>
  );
}

const plans = [
  { k: "free", name: "Free", price: "$0", note: "Included by UCLA Anderson", features: ["Personalized roadmap", "Community & messages", "Marketplace perks", "Email reminders"] },
  { k: "plus", name: "Plus", price: "$12", note: "per month", features: ["Everything in Free", "2 advisor calls / month", "Document checklist reviews", "Priority support"], popular: true },
  { k: "concierge", name: "Concierge", price: "$149", note: "one-time", features: ["Everything in Plus", "Dedicated arrival advisor", "Housing shortlist done for you", "Airport pickup coordination"] },
];

function BillingTab() {
  const [current, setCurrent] = React.useState("free");
  const [form, setForm] = React.useState<FormSheetConfig | null>(null);
  const cardFields = (last4?: string): FormSheetConfig["fields"] => [
    { name: "name", label: "Name on card", defaultValue: last4 ? "Sayali D." : "", required: true },
    { name: "number", label: "Card number", placeholder: last4 ? `•••• •••• •••• ${last4}` : "1234 1234 1234 1234", required: !last4 },
    { name: "exp", label: "Expiry (MM/YY)", defaultValue: last4 ? "08/29" : "", placeholder: "MM/YY", required: true },
    { name: "default", label: "Set as default", type: "switch", defaultValue: true },
  ];
  return (
    <div className="space-y-5">
      <FormSheet config={form} onClose={() => setForm(null)} />
      <Section title="Your plan" description="Your school covers the Free plan. Upgrade anytime — cancel anytime.">
        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((p) => {
            const on = current === p.k;
            return (
              <div key={p.k} className={cn("relative flex flex-col rounded-xl border p-4", on && "border-ink ring-1 ring-ink", p.popular && !on && "border-primary/40")}>
                {p.popular && (
                  <Badge variant="solid" className="absolute -top-2.5 right-3">
                    <Sparkles /> Popular
                  </Badge>
                )}
                <div className="text-[13px] font-semibold">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="tabular text-[26px] font-semibold tracking-tight">{p.price}</span>
                  <span className="text-[12px] text-muted-foreground">{p.note}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[12.5px]">
                      <Check className="size-3.5 text-primary" strokeWidth={2.5} /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4"
                  size="sm"
                  variant={on ? "outline" : p.popular ? "default" : "ink"}
                  disabled={on}
                  onClick={() => {
                    setCurrent(p.k);
                    toast.success(`Switched to ${p.name}`);
                  }}
                >
                  {on ? "Current plan" : `Choose ${p.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        title="Payment method"
        action={
          <Button variant="outline" size="xs" onClick={() => setForm({ title: "Add payment method", submitLabel: "Add card", success: "Card added", fields: cardFields() })}>
            Add method
          </Button>
        }
      >
        <div className="flex items-center gap-3 rounded-xl border p-3.5">
          <span className="flex h-8 w-12 items-center justify-center rounded-md bg-ink text-[10px] font-bold tracking-wider text-white">VISA</span>
          <div className="flex-1">
            <div className="text-[13px] font-medium">Visa ending in 4242</div>
            <div className="text-[12px] text-muted-foreground">Expires 08/2029</div>
          </div>
          <Badge variant="secondary">Default</Badge>
          <Button variant="ghost" size="xs" onClick={() => setForm({ title: "Edit card", success: "Card updated", fields: cardFields("4242") })}>
            Edit
          </Button>
        </div>
      </Section>

      <Section title="Billing details">
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Billing name</Label>
            <Input defaultValue="Sayali D." />
          </div>
          <div className="space-y-1.5">
            <Label>Billing email</Label>
            <Input defaultValue={student.email} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input defaultValue="12 Marine Drive, Mumbai 400020, India" />
          </div>
        </div>
      </Section>

      <Section title="Invoices" description="Download receipts for past payments.">
        <div className="-mx-4 -my-5 sm:-mx-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["AA-1042", "May 2, 2027", "Visa document review (one-off)", "$29.00"],
                ["AA-0981", "Apr 12, 2027", "Advisor call · Finance", "$19.00"],
              ].map(([id, d, desc, amt]) => (
                <TableRow key={id}>
                  <TableCell className="font-mono text-[12px]">{id}</TableCell>
                  <TableCell>{d}</TableCell>
                  <TableCell>{desc}</TableCell>
                  <TableCell className="tabular font-medium">{amt}</TableCell>
                  <TableCell>
                    <Badge variant="success">Paid</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Download receipt ${id}`}
                      onClick={() => {
                        downloadFile(
                          `AfterAdmit-receipt-${id}.txt`,
                          [`AfterAdmit, Inc. — Receipt ${id}`, `Date: ${d}`, `Billed to: Sayali D. (${student.email})`, `Item: ${desc}`, `Amount paid: ${amt}`, "Status: Paid"].join("\n"),
                          "text/plain;charset=utf-8",
                        );
                        toast.success("Receipt downloaded", { description: id });
                      }}
                    >
                      <Receipt className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className="space-y-5">
      <Section title="Who sees what">
        <div className="divide-y">
          <ToggleRow title="Show my profile in the class directory" desc="Classmates can find you by name and hometown" />
          <ToggleRow title="Allow direct messages" desc="From any admitted student in your school" />
          <ToggleRow title="Show my roadmap progress to classmates" desc="Only your overall % — never individual milestones" defaultChecked={false} />
        </div>
        <div className="mt-5 rounded-xl bg-muted/60 p-4 text-[12.5px] leading-relaxed text-muted-foreground">
          <div className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="size-4 text-success" /> Our promises
          </div>
          UCLA Anderson sees only aggregate progress across the class — never your individual milestones or which providers you clicked. We never share your contact details with providers, and we never store passport, visa, or SEVIS numbers.
        </div>
      </Section>
      <Section title="Your data" description="GDPR and FERPA-aligned controls.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => toast.success("Export started", { description: "We'll email you a download link within 24 hours." })}>
            <Download className="size-4" /> Download my data
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive-soft">
                <Trash2 className="size-4" /> Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes your roadmap progress, posts, and messages. Your school will only see that one fewer student is active.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => toast("Deletion scheduled (demo)")}>
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Section>
    </div>
  );
}

function ConnectionsTab() {
  return (
    <Section title="Connected accounts" description="Sign in faster and import details.">
      <ul className="divide-y">
        {[
          { n: "Google", d: "sayali.d@gmail.com", on: true, c: "#4285F4", l: "G" },
          { n: "LinkedIn", d: "Show your profile on posts", on: false, c: "#0A66C2", l: "in" },
          { n: "Google Calendar", d: "Sync milestone due dates", on: true, c: "#18181B", l: "31" },
          { n: "WhatsApp", d: "Get deadline reminders", on: false, c: "#25D366", l: "W" },
        ].map((a) => (
          <li key={a.n} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
            <span className="flex size-9 items-center justify-center rounded-lg text-[12px] font-bold text-white" style={{ background: a.c }}>
              {a.l}
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-medium">{a.n}</div>
              <div className="text-[12px] text-muted-foreground">{a.d}</div>
            </div>
            <Button variant={a.on ? "outline" : "ink"} size="xs" onClick={() => toast(a.on ? `Disconnected ${a.n}` : `Connected ${a.n}`)}>
              {a.on ? "Disconnect" : "Connect"}
            </Button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProfileInner() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = (tabs.find((t) => t.k === params.get("tab"))?.k ?? "profile") as Tab;

  return (
    <PageContainer className="max-w-[1100px]">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="text-[18px] text-white" style={{ background: student.avatarColor }}>
            {student.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">{student.name}</h1>
          <div className="text-[13px] text-muted-foreground">
            @sayali_d · {school.name} · {school.program} {school.termShort} · {student.karma} karma
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[220px_1fr] md:gap-8">
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 scrollbar-none md:mx-0 md:flex-col md:overflow-visible md:px-0">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => router.replace(`/student/profile?tab=${t.k}`, { scroll: false })}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-left text-[13px] font-medium transition-colors",
                tab === t.k ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <t.i className={cn("size-4", tab === t.k && "text-primary")} /> {t.l}
            </button>
          ))}
        </nav>
        <div key={tab} className="min-w-0 animate-in fade-in-0 duration-200">
          {tab === "profile" && <ProfileTab />}
          {tab === "journey" && <JourneyTab />}
          {tab === "account" && <AccountTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "billing" && <BillingTab />}
          {tab === "privacy" && <PrivacyTab />}
          {tab === "connections" && <ConnectionsTab />}
          {tab === "support" && (
            <Section title="Support requests" description="Questions you've sent our team, and their replies.">
              <MyRequests owner="student" className="max-w-[560px]" />
            </Section>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default function ProfilePage() {
  return (
    <React.Suspense>
      <ProfileInner />
    </React.Suspense>
  );
}
