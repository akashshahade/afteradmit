export const admin = { name: "Jordan Lee", initials: "JL", email: "jordan@afteradmit.com", title: "Operations Lead" };

export type University = {
  id: string;
  name: string;
  short: string;
  domain: string;
  terms: string[];
  students: number;
  signedUp: number;
  avgProgress: number;
  status: "Live" | "Onboarding" | "Draft";
  color: string;
  admins: number;
  logo?: string;
};

export const universities: University[] = [
  { id: "ucla", name: "UCLA Anderson School of Management", short: "UCLA Anderson", domain: "anderson.ucla.edu", terms: ["Fall 2027"], students: 362, signedUp: 311, avgProgress: 34, status: "Live", color: "#2774AE", admins: 3, logo: "/ucla-anderson.svg" },
  { id: "northshore", name: "Northshore Business School", short: "Northshore", domain: "northshore.edu", terms: ["Fall 2027"], students: 284, signedUp: 198, avgProgress: 27, status: "Live", color: "#7C2D12", admins: 2 },
  { id: "bayview", name: "Bayview Graduate School", short: "Bayview", domain: "bayview.edu", terms: ["Fall 2027", "Spring 2028"], students: 410, signedUp: 236, avgProgress: 22, status: "Live", color: "#1E3A8A", admins: 4 },
  { id: "lakeside", name: "Lakeside Institute of Technology", short: "Lakeside Tech", domain: "lakeside.edu", terms: ["Fall 2027"], students: 0, signedUp: 0, avgProgress: 0, status: "Onboarding", color: "#065F46", admins: 1 },
  { id: "summit", name: "Summit State University", short: "Summit State", domain: "summit.edu", terms: [], students: 0, signedUp: 0, avgProgress: 0, status: "Draft", color: "#6D28D9", admins: 0 },
];

export const kpis = {
  students: 1056,
  studentsDelta: 12.4,
  activation: 70.8,
  activationDelta: 4.1,
  leads: 1645,
  leadsDelta: 18.2,
  milestonesDone: 9_284,
  milestonesDelta: 9.6,
  helpful: 91,
};

export const leadsTrend = [
  { d: "Apr 20", leads: 31, signups: 22 },
  { d: "Apr 27", leads: 44, signups: 38 },
  { d: "May 4", leads: 58, signups: 51 },
  { d: "May 11", leads: 72, signups: 49 },
  { d: "May 18", leads: 69, signups: 63 },
  { d: "May 25", leads: 88, signups: 71 },
  { d: "Jun 1", leads: 104, signups: 66 },
  { d: "Jun 8", leads: 121, signups: 74 },
  { d: "Jun 15", leads: 117, signups: 58 },
  { d: "Jun 22", leads: 139, signups: 81 },
  { d: "Jun 29", leads: 152, signups: 77 },
  { d: "Jul 6", leads: 168, signups: 69 },
];

export const stageCompletion = [
  { stage: "Start", pct: 88 },
  { stage: "Finance", pct: 64 },
  { stage: "Visa", pct: 47 },
  { stage: "Academics", pct: 12 },
  { stage: "Health", pct: 29 },
  { stage: "Housing", pct: 41 },
  { stage: "Essentials", pct: 18 },
  { stage: "Travel", pct: 9 },
  { stage: "Arrival", pct: 0 },
];

export const leadsByCategory = [
  { category: "Loan", leads: 522, fill: "#6366F1" },
  { category: "Housing", leads: 374, fill: "#14B8A6" },
  { category: "Banking", leads: 220, fill: "#F59E0B" },
  { category: "Insurance", leads: 156, fill: "#EC4899" },
  { category: "Travel", leads: 141, fill: "#0EA5E9" },
  { category: "Other", leads: 232, fill: "#D4D4D8" },
];

export type LeadEvent = {
  id: string;
  student: string;
  university: string;
  provider: string;
  milestone: string;
  clicked: string;
};

export const leadEvents: LeadEvent[] = [
  { id: "L-20931", student: "stu_8f21", university: "UCLA Anderson", provider: "Northbridge Student Loans", milestone: "Loan secured", clicked: "Jul 8, 09:14" },
  { id: "L-20930", student: "stu_2ac9", university: "UCLA Anderson", provider: "Westwood Commons", milestone: "Lease signed", clicked: "Jul 8, 09:02" },
  { id: "L-20929", student: "stu_77d0", university: "Bayview", provider: "Harbor Health International", milestone: "School insurance plan or waiver", clicked: "Jul 8, 08:47" },
  { id: "L-20928", student: "stu_51be", university: "Northshore", provider: "Atlas Card", milestone: "International debit card ready", clicked: "Jul 8, 08:31" },
  { id: "L-20927", student: "stu_8f21", university: "UCLA Anderson", provider: "Meridian Education Finance", milestone: "Loan secured", clicked: "Jul 8, 08:12" },
  { id: "L-20926", student: "stu_0c4e", university: "UCLA Anderson", provider: "SkyStudent Fares", milestone: "Flight booked", clicked: "Jul 7, 22:40" },
  { id: "L-20925", student: "stu_93aa", university: "Bayview", provider: "Pacific Coast Bank", milestone: "US bank account planned", clicked: "Jul 7, 21:18" },
  { id: "L-20924", student: "stu_2ac9", university: "UCLA Anderson", provider: "Westwood Commons", milestone: "Arrival plan made", clicked: "Jul 7, 19:55" },
  { id: "L-20923", student: "stu_6d12", university: "Northshore", provider: "Wiseline Transfers", milestone: "Home bank access set up", clicked: "Jul 7, 18:03" },
  { id: "L-20922", student: "stu_f001", university: "UCLA Anderson", provider: "Signal Mobile", milestone: "US phone plan active", clicked: "Jul 7, 16:29" },
];

export type Feedback = {
  id: string;
  university: string;
  milestone: string | null;
  helpful: boolean;
  comment: string;
  when: string;
};

export const feedback: Feedback[] = [
  { id: "f1", university: "UCLA Anderson", milestone: "DS-160 submitted and interview booked", helpful: true, comment: "The tip about booking early saved me — Mumbai slots were gone a week later.", when: "2h ago" },
  { id: "f2", university: "UCLA Anderson", milestone: "Loan secured", helpful: true, comment: "Comparing lenders side by side was great. Wish there was a rate calculator.", when: "5h ago" },
  { id: "f3", university: "Bayview", milestone: "School insurance plan or waiver approved", helpful: false, comment: "Wasn't clear which plans actually qualify for the waiver.", when: "1d ago" },
  { id: "f4", university: "Northshore", milestone: null, helpful: true, comment: "Honestly this whole app made the summer way less stressful. Thank you!", when: "1d ago" },
  { id: "f5", university: "UCLA Anderson", milestone: "Immunization records submitted", helpful: false, comment: "Link to the health portal was broken for me.", when: "2d ago" },
  { id: "f6", university: "Bayview", milestone: "Roommates confirmed", helpful: true, comment: "Found both roommates through the community. 10/10.", when: "3d ago" },
];

export type ModItem = {
  id: string;
  kind: "post" | "comment";
  community: string;
  author: string;
  excerpt: string;
  reason: string;
  reports: number;
  when: string;
};

export const modQueue: ModItem[] = [
  { id: "r1", kind: "comment", community: "Roommates", author: "lucasb", excerpt: "DM me for a cheaper broker, I get commission on...", reason: "Spam / self-promotion", reports: 4, when: "1h" },
  { id: "r2", kind: "post", community: "Housing", author: "westwoodcommons", excerpt: "We're Westwood Commons — AMA about furnished suites...", reason: "Partner promotion", reports: 1, when: "4d" },
  { id: "r3", kind: "comment", community: "F-1 & Visa", author: "anon_2291", excerpt: "Just post your SEVIS number and I'll check it for you", reason: "Personal information request", reports: 6, when: "2d" },
  { id: "r4", kind: "post", community: "Westwood Life", author: "party_la", excerpt: "Selling tickets for a rooftop party, link in bio", reason: "Spam", reports: 3, when: "3d" },
];

// ─── Partner (Westwood Commons) ──────────────────────────────────────────────

export const partner = {
  company: "Westwood Commons",
  contact: "Elena Ruiz",
  initials: "ER",
  email: "elena@westwoodcommons.com",
  title: "Partnerships Manager",
  category: "Housing",
  plan: "Pay-per-lead",
  cpl: 8,
};

export type Listing = {
  id: string;
  title: string;
  type: string;
  price: string;
  status: "Live" | "In review" | "Paused" | "Draft";
  placements: string[];
  schools: string[];
  clicks: number;
  ctr: number;
  perk?: string;
  updated: string;
};

export const listings: Listing[] = [
  { id: "ls1", title: "Furnished 3-bed suite · Gayley Ave", type: "Shared suite", price: "$1,580 / bed / mo", status: "Live", placements: ["Lease signed", "Roommates confirmed"], schools: ["UCLA Anderson"], clicks: 128, ctr: 6.4, perk: "No application fee", updated: "2d ago" },
  { id: "ls2", title: "Arrival short-stay beds (2–14 nights)", type: "Short stay", price: "$65 / night", status: "Live", placements: ["Arrival plan made"], schools: ["UCLA Anderson", "Bayview"], clicks: 74, ctr: 4.9, perk: "Free airport shuttle", updated: "5d ago" },
  { id: "ls3", title: "Studio · Levering Ave", type: "Studio", price: "$2,350 / mo", status: "In review", placements: ["Lease signed"], schools: ["UCLA Anderson"], clicks: 0, ctr: 0, updated: "Today" },
  { id: "ls4", title: "Summer sublets for interns", type: "Sublet", price: "$1,200 / mo", status: "Paused", placements: ["Housing type decided"], schools: ["Bayview"], clicks: 39, ctr: 2.1, updated: "3w ago" },
];

export const partnerTrend = [
  { d: "Jun 9", clicks: 8 },
  { d: "Jun 10", clicks: 12 },
  { d: "Jun 11", clicks: 9 },
  { d: "Jun 12", clicks: 15 },
  { d: "Jun 13", clicks: 14 },
  { d: "Jun 14", clicks: 7 },
  { d: "Jun 15", clicks: 6 },
  { d: "Jun 16", clicks: 18 },
  { d: "Jun 17", clicks: 21 },
  { d: "Jun 18", clicks: 17 },
  { d: "Jun 19", clicks: 24 },
  { d: "Jun 20", clicks: 22 },
  { d: "Jun 21", clicks: 13 },
  { d: "Jun 22", clicks: 11 },
];

export const partnerByMilestone = [
  { milestone: "Lease signed", clicks: 112 },
  { milestone: "Arrival plan made", clicks: 74 },
  { milestone: "Roommates confirmed", clicks: 41 },
  { milestone: "Housing type decided", clicks: 14 },
];

export const partnerInvoices = [
  { id: "INV-0042", period: "June 2027", leads: 241, amount: 1928, status: "Due" as const, due: "Jul 15, 2027" },
  { id: "INV-0037", period: "May 2027", leads: 188, amount: 1504, status: "Paid" as const, due: "Jun 15, 2027" },
  { id: "INV-0031", period: "April 2027", leads: 96, amount: 768, status: "Paid" as const, due: "May 15, 2027" },
];
