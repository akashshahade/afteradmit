export type Member = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  program: string;
  from: string;
  role?: "staff" | "mod" | "partner";
};

export const members: Record<string, Member> = {
  priya: { id: "priya", name: "Sayali Dhale", handle: "sayali_d", initials: "SD", color: "#FF4500", program: "MBA '29", from: "Mumbai, IN" },
  arjun: { id: "arjun", name: "Arjun Mehta", handle: "arjun.m", initials: "AM", color: "#2563EB", program: "MBA '29", from: "Bengaluru, IN" },
  sofia: { id: "sofia", name: "Sofia Alvarez", handle: "sofi_alv", initials: "SA", color: "#DB2777", program: "MBA '29", from: "Bogotá, CO" },
  kenji: { id: "kenji", name: "Kenji Watanabe", handle: "kenjiw", initials: "KW", color: "#0F766E", program: "MBA '29", from: "Tokyo, JP" },
  amara: { id: "amara", name: "Amara Okafor", handle: "amara.o", initials: "AO", color: "#7C3AED", program: "MBA '29", from: "Lagos, NG" },
  lucas: { id: "lucas", name: "Lucas Bernard", handle: "lucasb", initials: "LB", color: "#B45309", program: "MBA '29", from: "Lyon, FR" },
  maya: { id: "maya", name: "Maya Chen", handle: "mayac", initials: "MC", color: "#0891B2", program: "MBA '29", from: "Seattle, US" },
  daniel: { id: "daniel", name: "Daniel Kim", handle: "dkim", initials: "DK", color: "#18181B", program: "MBA '28", from: "Second-year", role: "mod" },
  rohan: { id: "rohan", name: "Rohan Iyer", handle: "rohan_i", initials: "RI", color: "#15803D", program: "MBA '29", from: "Pune, IN" },
  aa: { id: "aa", name: "AfterAdmit Team", handle: "afteradmit", initials: "AA", color: "#FF4500", program: "Staff", from: "AfterAdmit", role: "staff" },
  westwood: { id: "westwood", name: "Westwood Commons", handle: "westwoodcommons", initials: "WC", color: "#18181B", program: "Verified partner", from: "Housing", role: "partner" },
};

export type Community = {
  id: string;
  name: string;
  title: string;
  description: string;
  members: number;
  online: number;
  color: string;
  emoji: string;
  joined: boolean;
  rules: string[];
  cover?: string;
  logo?: "ucla";
};

export const communities: Community[] = [
  { id: "AndersonFall27", name: "Anderson Fall '27", title: "Your incoming class", description: "The official space for the incoming UCLA Anderson Full-Time MBA class of 2029.", members: 642, online: 48, color: "#FF4500", emoji: "A", joined: true, cover: "/UCLA_campus.webp", logo: "ucla", rules: ["Be kind — we're all new here", "No spam or referral links", "Tag every post with a topic", "No sharing personal documents"] },
  { id: "Housing", name: "Housing", title: "Westwood and beyond", description: "Leases, neighbourhoods, landlords, and everything about living near campus.", members: 488, online: 31, color: "#18181B", emoji: "H", joined: true, cover: "/housing_campus.webp", rules: ["Listings need price and location", "No brokers without disclosure"] },
  { id: "Roommates", name: "Roommates", title: "Find your people", description: "Find classmates to share with. Post your budget, move-in date, and vibe.", members: 371, online: 22, color: "#DB2777", emoji: "R", joined: true, cover: "/roommates.webp", rules: ["Tag posts Looking or Offering", "Move to messages for personal details"] },
  { id: "F1Visa", name: "F-1 & Visa", title: "I-20 to port of entry", description: "I-20s, SEVIS, DS-160, interview experiences, and port of entry.", members: 512, online: 39, color: "#2563EB", emoji: "V", joined: true, cover: "/passport.webp", rules: ["Never post passport or SEVIS numbers", "Interview stories: include consulate + date"] },
  { id: "Finance", name: "Loans & Money", title: "Budgeting in LA", description: "Loans, scholarships, banking, remittances, and budgeting in LA.", members: 403, online: 17, color: "#15803D", emoji: "$", joined: false, rules: ["No affiliate links", "Share rates, not personal finances"] },
  { id: "WestwoodLife", name: "Westwood Life", title: "Life beyond class", description: "Food, gyms, weekend trips, and life in LA beyond the classroom.", members: 298, online: 12, color: "#7C3AED", emoji: "W", joined: false, rules: ["Keep it friendly"] },
];

export type Comment = {
  id: string;
  author: string;
  body: string;
  time: string;
  votes: number;
  replies?: Comment[];
  edited?: boolean;
  removed?: boolean;
};

export type Post = {
  id: string;
  community: string;
  author: string;
  title: string;
  body: string;
  flair: string;
  flairColor: string;
  time: string;
  votes: number;
  comments: number;
  pinned?: boolean;
  locked?: boolean;
  image?: "map" | "checklist";
  poll?: { options: { label: string; votes: number }[]; total: number };
  milestone?: string;
  awards?: number;
  reported?: number;
};

export const posts: Post[] = [
  {
    id: "p1", community: "AndersonFall27", author: "daniel", pinned: true, flair: "Megathread", flairColor: "#18181B",
    title: "Fall '27 Admit Megathread — introduce yourself here!",
    body: "Welcome to Anderson! Drop your name, where you're from, what you did pre-MBA, and one thing you're excited about in LA. Second-years will be hanging around to answer questions all summer.",
    time: "3w", votes: 486, comments: 214, awards: 3,
  },
  {
    id: "p2", community: "Roommates", author: "priya", flair: "Looking", flairColor: "#DB2777",
    title: "Looking for 1–2 roommates near Westwood · ~$1,600/mo · move-in Aug 25",
    body: "Hi all! I'm Sayali, coming from Mumbai (ex-consulting). Looking for 1–2 roommates for a 2-bed or 3-bed within walking distance of campus. Budget around $1,600 each. I'm tidy, early riser, love cooking on weekends. Non-smoker. DM me or reply here!",
    time: "6h", votes: 42, comments: 11, milestone: "m20",
  },
  {
    id: "p3", community: "F1Visa", author: "arjun", flair: "Interview experience", flairColor: "#2563EB",
    title: "F-1 approved at Mumbai consulate today — here's every question they asked",
    body: "Interview was ~3 minutes. Questions: Why Anderson? Why an MBA now? Who's funding you? (Loan + scholarship, showed sanction letter.) What will you do after? Officer kept my passport — approved! Tips: keep your I-20 and sanction letter on top, answer in 1–2 sentences, be confident about post-MBA plans.",
    time: "9h", votes: 318, comments: 47, awards: 2, milestone: "m11",
  },
  {
    id: "p4", community: "Housing", author: "maya", flair: "Question", flairColor: "#6E6E76",
    title: "Westwood vs Palms vs Mid-City — where are second-years actually living?",
    body: "Trying to decide between walking distance (pricey) and a short commute (cheaper, need a car?). Would love a breakdown from anyone who's done it.",
    time: "1d", votes: 127, comments: 38, image: "map",
    poll: { options: [{ label: "Westwood (walk)", votes: 214 }, { label: "Palms / Culver City", votes: 96 }, { label: "Mid-City / Koreatown", votes: 41 }, { label: "Santa Monica", votes: 58 }], total: 409 },
  },
  {
    id: "p5", community: "Finance", author: "kenji", flair: "Guide", flairColor: "#15803D",
    title: "I compared 4 international student lenders so you don't have to",
    body: "Rates as of this week for a $120k loan, no cosigner. Northbridge came out lowest for Anderson admits thanks to the school discount, Meridian has the longest grace period. Full table in the comments — DM if you want my spreadsheet.",
    time: "2d", votes: 204, comments: 29, milestone: "m8",
  },
  {
    id: "p6", community: "AndersonFall27", author: "aa", flair: "Announcement", flairColor: "#FF4500",
    title: "Reminder: SEVIS fee and immunization deadlines are coming up",
    body: "A few of you have deadlines this month. Open your roadmap to see what's due — overdue items are flagged. Questions? Ask in the F-1 & Visa space.",
    time: "2d", votes: 96, comments: 8, locked: true,
  },
  {
    id: "p7", community: "WestwoodLife", author: "sofia", flair: "Meetup", flairColor: "#7C3AED",
    title: "LA-area admits: picnic at Sunset Canyon on June 12?",
    body: "A few of us are already in LA for summer internships. Thinking a casual picnic + frisbee. Reply if you're in!",
    time: "3d", votes: 73, comments: 22,
  },
  {
    id: "p8", community: "Housing", author: "westwood", flair: "Partner", flairColor: "#18181B",
    title: "We're Westwood Commons — AMA about furnished suites & arrival beds",
    body: "Hi Anderson! We run furnished student suites 6 minutes from campus. Ask us anything about leases, arrival short-stays, or what's included. (Verified AfterAdmit partner.)",
    time: "4d", votes: 34, comments: 19, reported: 1,
  },
];

export const comments: Record<string, Comment[]> = {
  p2: [
    {
      id: "c1", author: "arjun", time: "5h", votes: 18,
      body: "Hey Sayali! I'm also looking for a place around Westwood, budget similar. Early riser too. Would be great to chat — I've been looking at Westwood Commons and a couple of places on Gayley.",
      replies: [
        {
          id: "c2", author: "priya", time: "5h", votes: 9,
          body: "Amazing! Westwood Commons was on my list too. Sending you a DM now.",
          replies: [
            { id: "c3", author: "arjun", time: "4h", votes: 6, body: "Happy to share — we're looking at Westwood Commons too, they have a 3-bed opening in August. Let's set up a call this week?" },
          ],
        },
        { id: "c4", author: "rohan", time: "3h", votes: 4, body: "If you're doing a 3-bed I might be interested! Pune → LA, MBA '29, non-smoker. Budget ~$1,500." },
      ],
    },
    {
      id: "c5", author: "daniel", time: "4h", votes: 22,
      body: "Second-year here. Quick tip: Gayley and Levering are the sweet spot — 10 min walk, slightly cheaper than right next to campus. Avoid signing anything before seeing a video tour.",
      replies: [{ id: "c6", author: "priya", time: "3h", votes: 5, body: "This is super helpful, thank you Daniel!" }],
    },
    {
      id: "c7", author: "sofia", time: "2h", votes: 7, edited: true,
      body: "Not looking for a roommate myself but bookmarking — there's also a roommate spreadsheet pinned in the Roommates space.",
    },
    { id: "c8", author: "lucas", time: "1h", votes: -3, removed: true, body: "" },
  ],
};

export const defaultComments: Comment[] = [
  {
    id: "d1", author: "daniel", time: "8h", votes: 31,
    body: "Great write-up. Saving this for the next batch of admits.",
    replies: [{ id: "d2", author: "amara", time: "6h", votes: 8, body: "Same — super useful. Did they ask about your work experience at all?" }],
  },
  { id: "d3", author: "maya", time: "5h", votes: 12, body: "Thanks for sharing! This is exactly what I needed this week." },
];

export type Conversation = {
  id: string;
  with: string;
  last: string;
  time: string;
  unread: number;
  messages: { from: string; body: string; time: string }[];
};

export const conversations: Conversation[] = [
  {
    id: "dm1", with: "arjun", last: "Perfect — Thursday 7pm IST works!", time: "12m", unread: 2,
    messages: [
      { from: "priya", body: "Hey Arjun! Saw your reply on the roommate post. Want to hop on a call this week?", time: "Yesterday 9:14 PM" },
      { from: "arjun", body: "Yes! I've shortlisted two places at Westwood Commons. 3-bed, $1,580 each with Rohan.", time: "Yesterday 9:31 PM" },
      { from: "priya", body: "Love that. Can you share the listing? I'll check it against my budget.", time: "Yesterday 9:33 PM" },
      { from: "arjun", body: "Sent it through the marketplace link. They also have arrival beds if our lease starts Sep 1.", time: "Today 8:02 AM" },
      { from: "priya", body: "Thursday 7pm IST for a call with Rohan too?", time: "Today 8:10 AM" },
      { from: "arjun", body: "Perfect — Thursday 7pm IST works!", time: "Today 8:12 AM" },
    ],
  },
  {
    id: "dm2", with: "sofia", last: "Are you on the Mumbai → LAX flight on Sep 2?", time: "1d", unread: 0,
    messages: [
      { from: "sofia", body: "Hi Sayali! Are you on the Mumbai → LAX flight on Sep 2? A few of us are coordinating airport pickups.", time: "Yesterday 4:20 PM" },
    ],
  },
  {
    id: "dm3", with: "daniel", last: "Happy to review your lease before you sign.", time: "3d", unread: 0,
    messages: [
      { from: "priya", body: "Hi Daniel — thanks for the tip on Gayley! Any red flags to look for in a lease?", time: "Mon 11:02 AM" },
      { from: "daniel", body: "Check the move-out cleaning clause and whether utilities are included. Happy to review your lease before you sign.", time: "Mon 2:40 PM" },
    ],
  },
  {
    id: "dm4", with: "kenji", last: "Shared the lender spreadsheet with you.", time: "5d", unread: 0,
    messages: [{ from: "kenji", body: "Shared the lender spreadsheet with you.", time: "Thu 10:15 AM" }],
  },
];
