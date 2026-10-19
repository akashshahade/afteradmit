"use client";

import * as React from "react";

export type TicketStatus = "Open" | "Pending" | "Resolved";
export type TicketPriority = "Low" | "Normal" | "High" | "Urgent";
export type TicketOwner = "student" | "partner" | "admin";

export type Message = { from: "requester" | "agent"; name: string; body: string; time: string };

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: { name: string; email: string; initials: string; color: string; org: string; kind: "Student" | "Partner" | "University" };
  owner?: TicketOwner;
  assignee: string;
  updated: string;
  messages: Message[];
};

export const categories = ["Roadmap & milestones", "Account & billing", "Community", "Marketplace & partners", "Technical issue", "Something else"];

const sayali = { name: "Sayali D.", email: "sayali.d@gmail.com", initials: "SD", color: "#FF4500", org: "UCLA Anderson", kind: "Student" as const };

let tickets: Ticket[] = [
  {
    id: "AA-1052",
    subject: "Invite link says it has expired",
    category: "Account & billing",
    status: "Open",
    priority: "High",
    requester: { name: "Rohan Iyer", email: "rohan.iyer@outlook.com", initials: "RI", color: "#15803D", org: "UCLA Anderson", kind: "Student" },
    assignee: "Unassigned",
    updated: "12m ago",
    messages: [{ from: "requester", name: "Rohan Iyer", body: "Hi, I only just saw my invite email but the link says it has expired. Could you send a new one?", time: "12m ago" }],
  },
  {
    id: "AA-1051",
    subject: "Someone asked for my passport number in a DM",
    category: "Community",
    status: "Open",
    priority: "Urgent",
    requester: { name: "Maya Chen", email: "maya.chen@gmail.com", initials: "MC", color: "#0891B2", org: "UCLA Anderson", kind: "Student" },
    assignee: "Priya Raman",
    updated: "40m ago",
    messages: [{ from: "requester", name: "Maya Chen", body: "A member I don't know messaged me about a sublet and asked for a copy of my passport before I could see the room. That feels wrong — can someone look?", time: "40m ago" }],
  },
  {
    id: "AA-1048",
    subject: "Housing deposit reminder arrived twice",
    category: "Roadmap & milestones",
    status: "Pending",
    priority: "Normal",
    requester: sayali,
    owner: "student",
    assignee: "Priya Raman",
    updated: "Yesterday",
    messages: [
      { from: "requester", name: "Sayali D.", body: "I got the 'Housing deposit due' reminder twice this morning, a few minutes apart. Not a big deal, just letting you know.", time: "2d ago" },
      { from: "agent", name: "Priya Raman", body: "Thanks for flagging, Sayali! We found a duplicate schedule for one milestone and have fixed it. Could you let us know if you get another duplicate this week?", time: "Yesterday" },
    ],
  },
  {
    id: "AA-1046",
    subject: "Update photos on our Levering Ave listing",
    category: "Marketplace & partners",
    status: "Pending",
    priority: "Low",
    requester: { name: "Westwood Commons", email: "listings@westwoodcommons.com", initials: "WC", color: "#18181B", org: "Westwood Commons", kind: "Partner" },
    assignee: "Marcus Reyes",
    updated: "Yesterday",
    messages: [{ from: "requester", name: "Westwood Commons", body: "We've renovated the studios on Levering Ave and would like to replace the photos on our listing. Can we upload new ones ourselves?", time: "Yesterday" }],
  },
  {
    id: "AA-1044",
    subject: "Exporting this month's lead report",
    category: "Marketplace & partners",
    status: "Resolved",
    priority: "Normal",
    requester: { name: "Northbridge Student Loans", email: "partners@northbridge.com", initials: "NB", color: "#1D4ED8", org: "Northbridge", kind: "Partner" },
    owner: "partner",
    assignee: "Marcus Reyes",
    updated: "May 12",
    messages: [
      { from: "requester", name: "Northbridge Student Loans", body: "Where can we download a CSV of leads by school for May?", time: "May 11" },
      { from: "agent", name: "Marcus Reyes", body: "You'll find it under Leads → Export CSV. You can filter by school before exporting. Let us know if anything's missing!", time: "May 12" },
    ],
  },
  {
    id: "AA-1039",
    subject: "Can't find where to upload my I-20",
    category: "Roadmap & milestones",
    status: "Resolved",
    priority: "Normal",
    requester: sayali,
    owner: "student",
    assignee: "Priya Raman",
    updated: "May 6",
    messages: [
      { from: "requester", name: "Sayali D.", body: "The roadmap says 'I-20 received' but I can't see where to upload it.", time: "May 5" },
      { from: "agent", name: "Priya Raman", body: "Good question — we never ask you to upload your I-20, for your privacy. Just mark the milestone done once you have it. ✓", time: "May 6" },
    ],
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => tickets;

export function useTickets() {
  return React.useSyncExternalStore(subscribe, snapshot, snapshot);
}

let next = 1053;

export function createTicket(input: { subject: string; category: string; body: string; owner: TicketOwner }) {
  const requester =
    input.owner === "partner"
      ? { name: "Northbridge Student Loans", email: "partners@northbridge.com", initials: "NB", color: "#1D4ED8", org: "Northbridge", kind: "Partner" as const }
      : input.owner === "admin"
        ? { name: "AfterAdmit Admin", email: "ops@afteradmit.com", initials: "AA", color: "#18181B", org: "AfterAdmit", kind: "University" as const }
        : sayali;
  const ticket: Ticket = {
    id: `AA-${next++}`,
    subject: input.subject,
    category: input.category,
    status: "Open",
    priority: "Normal",
    requester,
    owner: input.owner,
    assignee: "Unassigned",
    updated: "Just now",
    messages: [{ from: "requester", name: requester.name, body: input.body, time: "Just now" }],
  };
  tickets = [ticket, ...tickets];
  emit();
  return ticket;
}

export function updateTicket(id: string, patch: Partial<Pick<Ticket, "status" | "priority" | "assignee">>) {
  tickets = tickets.map((t) => (t.id === id ? { ...t, ...patch, updated: "Just now" } : t));
  emit();
}

export function replyAsRequester(id: string, body: string) {
  tickets = tickets.map((t) =>
    t.id === id ? { ...t, status: "Open", updated: "Just now", messages: [...t.messages, { from: "requester", name: t.requester.name, body, time: "Just now" }] } : t,
  );
  emit();
}

export function replyToTicket(id: string, body: string, resolve = false) {
  tickets = tickets.map((t) =>
    t.id === id
      ? { ...t, status: resolve ? "Resolved" : "Pending", updated: "Just now", messages: [...t.messages, { from: "agent", name: "You", body, time: "Just now" }] }
      : t,
  );
  emit();
}
