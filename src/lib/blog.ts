import { photos, unsplash } from "@/components/marketing/assets";

export type BlogCategory = "For students" | "For schools";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "quote"; text: string; cite?: string };

export type Author = { id: string; name: string; role: string; initials: string; color: string; bio: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  date: string;
  updated?: string;
  cover: string;
  coverAlt: string;
  takeaways: string[];
  body: Block[];
};

export const authors: Record<string, Author> = {
  priya: {
    id: "priya",
    name: "Priya Raman",
    role: "Student Success Lead",
    initials: "PR",
    color: "#2563EB",
    bio: "Priya has guided more than 4,000 international admits through visas, housing and their first week on campus. She moved from Chennai to Boston for her own master's.",
  },
  ethan: {
    id: "ethan",
    name: "Ethan Caldwell",
    role: "Former Director of Admissions",
    initials: "EC",
    color: "#18181B",
    bio: "Ethan spent twelve years running graduate admissions and yield at two US business schools before joining AfterAdmit to work on the months between deposit and day one.",
  },
  lena: {
    id: "lena",
    name: "Lena Park",
    role: "Community & Housing",
    initials: "LP",
    color: "#DB2777",
    bio: "Lena runs AfterAdmit's student spaces and housing partnerships. She has signed four leases in three countries — and read every line of each one.",
  },
  marcus: {
    id: "marcus",
    name: "Marcus Reyes",
    role: "Editor",
    initials: "MR",
    color: "#0F766E",
    bio: "Marcus edits the AfterAdmit Journal. Before that he covered higher education for a decade, with a focus on access and first-generation students.",
  },
};

export const posts: Post[] = [
  {
    slug: "f1-visa-timeline-after-admission",
    title: "The F-1 visa timeline after admission: a month-by-month guide",
    description: "From I-20 to port of entry — what to do each month between your admit and your flight, and the deadlines that catch students out.",
    category: "For students",
    tags: ["F-1 visa", "I-20", "SEVIS", "International students"],
    author: "priya",
    date: "2027-05-06",
    cover: "/passport.webp",
    coverAlt: "Passport and travel documents on a table",
    takeaways: [
      "Your I-20 comes first — everything else depends on it.",
      "Pay the SEVIS I-901 fee before your visa interview and keep the receipt.",
      "Book your interview early; wait times vary widely by consulate.",
      "You can enter the US up to 30 days before your program start date.",
    ],
    body: [
      { type: "p", text: "Getting admitted is the hard part. Getting to campus on time is the part nobody explains clearly. The F-1 student visa process is a chain — each step unlocks the next — so the order matters as much as the deadlines. Here's the sequence, month by month, for a typical fall start." },
      { type: "h2", text: "Months 1–2: accept, prove funding, get your I-20" },
      { type: "p", text: "Once you accept your offer, your school's international office will ask for proof that you can cover your first year of tuition and living costs. That usually means bank statements, a sponsor letter, or a loan approval letter. When they're satisfied, they issue your **Form I-20** — the document that makes you eligible to apply for an F-1 visa." },
      { type: "ul", items: ["Check that your name matches your passport exactly.", "Confirm the program start date — your travel window is calculated from it.", "Sign page one. An unsigned I-20 is a common reason for delays at interviews."] },
      { type: "h2", text: "Month 2: pay the SEVIS I-901 fee" },
      { type: "p", text: "With your I-20 in hand, pay the **SEVIS I-901 fee** on the official fmjfee.com site using the SEVIS ID printed on your form. Pay it at least three business days before your visa interview so the payment shows up in the system, and save the receipt as a PDF — you'll be asked for it." },
      { type: "callout", title: "Only use the official site", text: "Third-party sites sometimes charge extra to 'process' the SEVIS fee. You never need them. Pay directly on the government site and keep your confirmation." },
      { type: "h2", text: "Months 2–3: DS-160 and your visa interview" },
      { type: "p", text: "Complete the **DS-160** online application, pay the visa application fee for your country, and book an interview at your nearest US embassy or consulate. Wait times range from days to months depending on the location and season, so book as soon as you can — you can often reschedule to an earlier slot later." },
      { type: "p", text: "An F-1 visa can be issued up to 365 days before your program starts, so there's no advantage to waiting." },
      { type: "h3", text: "What to bring" },
      { type: "ul", items: ["Passport valid for at least six months beyond your intended stay", "Signed I-20", "DS-160 confirmation page", "SEVIS I-901 payment receipt", "Financial documents that match what you gave your school", "Your admission letter"] },
      { type: "h2", text: "Months 3–4: plan your arrival window" },
      { type: "p", text: "F-1 students can enter the US **no more than 30 days before** the program start date on the I-20. Book flights inside that window, and line up somewhere to stay for your first nights — leases often start later than you'd like." },
      { type: "h2", text: "Arrival: port of entry" },
      { type: "p", text: "Keep your passport, I-20, and financial documents in your carry-on, not your checked bag. After you land, download your I-94 record online and check it lists F-1 and 'D/S'. Then report to your international office during the check-in period." },
      { type: "quote", text: "The students who struggle aren't the ones with hard cases. They're the ones who did the right steps in the wrong order.", cite: "Priya Raman" },
      { type: "p", text: "Rules and fees change, and your circumstances may be different. Always confirm details with your school's international office and the official US government sites before you act." },
    ],
  },
  {
    slug: "what-is-summer-melt-and-how-to-prevent-it",
    title: "What is summer melt — and how admissions teams can prevent it",
    description: "Admitted students who deposit but never arrive cost schools seats, revenue and diversity. Here's what drives melt and the interventions that actually work.",
    category: "For schools",
    tags: ["Summer melt", "Yield", "Admissions", "Enrollment"],
    author: "ethan",
    date: "2027-04-22",
    cover: "/students1.webp",
    coverAlt: "Graduates throwing their caps in the air",
    takeaways: [
      "Melt is usually a logistics problem disguised as a decision.",
      "Students stall on the hardest step, not the first one.",
      "Personal, dated nudges outperform long welcome emails.",
      "Track progress by stage so you can intervene before deadlines pass.",
    ],
    body: [
      { type: "p", text: "Every admissions team knows the feeling. Deposits are in, the class looks strong, and then — somewhere between May and orientation — a slice of it quietly disappears. That's **summer melt**: admitted, committed students who never enroll." },
      { type: "p", text: "Research by Benjamin Castleman and Lindsay Page found that between 10 and 40 percent of college-intending students, depending on the population, failed to enroll anywhere the following fall. Graduate and international programs see their own version, driven by visas, funding and housing." },
      { type: "h2", text: "Why students melt" },
      { type: "p", text: "Exit conversations rarely surface a change of heart. They surface a stalled task." },
      { type: "ul", items: ["A financial document they didn't know how to get", "A visa appointment they couldn't book in time", "A housing search that felt impossible from abroad", "No one to ask — and no sense that anyone noticed"] },
      { type: "callout", title: "The pattern", text: "Students don't stall on the first step. They stall on the hardest one — and every week they're stuck, the next deadline gets closer." },
      { type: "h2", text: "Five interventions that work" },
      { type: "ol", items: [
        "**One dated checklist per student.** Replace the welcome PDF with a personal list of steps tied to your real deadlines. Hide what doesn't apply.",
        "**Short, timely nudges.** A reminder a week before and a day before a deadline beats a monthly newsletter every time.",
        "**Peer connection early.** Students who know classmates before arrival are more likely to show up. Give them a moderated space to meet.",
        "**A single source of truth.** Every office — admissions, financial aid, housing, international — should point to the same plan.",
        "**Aggregate visibility.** You don't need to watch individuals. You need to know that 30% of your class hasn't paid SEVIS with three weeks to go.",
      ] },
      { type: "h2", text: "Measuring what matters" },
      { type: "p", text: "The most useful melt metric isn't melt itself — by the time you measure it, it's too late. Track **activation** (how many admits have started their plan) and **completion by stage** (where the class is stuck). Both tell you where to intervene while there's still time." },
      { type: "quote", text: "We stopped asking 'who's going to melt?' and started asking 'which step is everyone stuck on?' The second question has an answer.", cite: "Ethan Caldwell" },
      { type: "h2", text: "Where to start" },
      { type: "p", text: "Map every step between deposit and orientation, assign each one an owner and a date, and send nothing that isn't attached to a step. It's simple — and it's the foundation every other intervention builds on." },
    ],
  },
  {
    slug: "off-campus-housing-checklist-international-students",
    title: "Finding off-campus housing from abroad: a checklist for international students",
    description: "How to search, verify and sign a lease near campus before you arrive — without getting scammed or overpaying.",
    category: "For students",
    tags: ["Housing", "Leases", "International students"],
    author: "lena",
    date: "2027-04-08",
    cover: "/housing_campus.webp",
    coverAlt: "Student apartments near a university campus",
    takeaways: [
      "Start with your school's housing office — they know which buildings students use.",
      "Never send money before you've verified the landlord and seen the lease.",
      "Ask about international-student requirements up front: guarantors, SSN, deposits.",
      "Plan temporary housing if your lease starts after you land.",
    ],
    body: [
      { type: "p", text: "Signing a lease for a place you've never seen, in a city you've never lived in, is one of the most stressful parts of moving for school. The good news: with the right order of operations, it's very manageable." },
      { type: "h2", text: "1. Decide what you actually need" },
      { type: "ul", items: ["**Budget:** rent plus utilities, internet and renter's insurance", "**Commute:** walking distance, or a direct transit line to campus", "**Lease length:** 12-month leases are standard; 10-month or academic-year leases exist but are rarer", "**Furnished or not:** furnished costs more but saves a first-week furniture scramble", "**Roommates:** sharing is the single biggest lever on cost"] },
      { type: "h2", text: "2. Search in the right places" },
      { type: "p", text: "Begin with your school's off-campus housing office and student community — they know which buildings students actually live in, and which landlords have a track record. Vetted partners and student-focused buildings often have experience with international paperwork." },
      { type: "h2", text: "3. Verify before you pay anything" },
      { type: "callout", title: "Red flags", text: "A price far below the area average, a landlord who 'is abroad' and can't show the unit, pressure to pay by wire or gift card, or a request for a deposit before you've seen a lease." },
      { type: "ul", items: ["Ask for a live video tour — not a pre-recorded one.", "Search the address and the landlord's name together.", "Confirm the property manager's company exists and lists the building.", "Pay through a traceable method and keep every receipt."] },
      { type: "h2", text: "4. Ask about international-student requirements" },
      { type: "p", text: "Many landlords ask for a US credit history or a US-based guarantor. Ask early whether they accept alternatives: a larger deposit, prepaid rent, proof of funds, or a guarantor service. Some buildings work with international students every year and have a standard process." },
      { type: "h2", text: "5. Read the lease line by line" },
      { type: "ul", items: ["Move-in and move-out dates", "What's included: utilities, internet, furniture, parking", "Subletting and early-termination rules", "Who handles repairs, and how fast", "The exact deposit amount and conditions for getting it back"] },
      { type: "h2", text: "6. Plan your first nights" },
      { type: "p", text: "F-1 students can arrive up to 30 days before their program starts, but leases often begin on the 1st or 15th. If there's a gap, book short-stay housing or ask your school about temporary options so you're not searching for a bed after a long flight." },
    ],
  },
  {
    slug: "how-to-find-a-roommate-before-you-arrive",
    title: "How to find a roommate before you arrive (and actually get along)",
    description: "The questions to ask, the red flags to notice and the one agreement that prevents most roommate fights — from people who've been through it.",
    category: "For students",
    tags: ["Roommates", "Community", "Housing"],
    author: "lena",
    date: "2027-03-25",
    cover: "/roommates.webp",
    coverAlt: "Two roommates relaxing together in a shared apartment",
    takeaways: [
      "Talk about habits, not just budgets.",
      "Always have at least one video call before you commit.",
      "Write a simple roommate agreement in your first week.",
      "Keep personal documents private until you've signed a lease together.",
    ],
    body: [
      { type: "p", text: "Most roommate problems aren't about personality. They're about expectations nobody said out loud — who cleans, when it's quiet, how often friends stay over. The fix is to have those conversations before you sign, not after." },
      { type: "h2", text: "Where to look" },
      { type: "p", text: "Start inside your admitted class. A private space for admitted students means everyone has been verified by the school and is moving on the same timeline. Post your budget, preferred neighborhood, move-in date and a few honest lines about how you live." },
      { type: "h2", text: "The questions that matter" },
      { type: "ul", items: ["What's your budget, including utilities?", "Are you an early riser or a night owl?", "How clean is 'clean' for you?", "How often will you have guests, and do they stay over?", "Do you cook? Share groceries?", "Smoking, pets, allergies?", "How do you prefer to handle disagreements?"] },
      { type: "callout", title: "Do one video call", text: "Messaging hides a lot. A 20-minute video call tells you more than a week of texts — and it's the best way to confirm someone is who they say they are." },
      { type: "h2", text: "Stay safe" },
      { type: "p", text: "Move to private messages for personal details, but never share passport, visa or bank information with someone you haven't met. If someone pushes you to send money for 'their' apartment before you've seen a lease, step back." },
      { type: "h2", text: "Write a roommate agreement" },
      { type: "p", text: "It sounds formal. It isn't. A one-page shared note covering rent split, bills, cleaning, quiet hours and guests prevents most of the arguments that sink roommate relationships. Revisit it after the first month." },
      { type: "quote", text: "We wrote ours on a napkin on move-in day. We never needed to look at it — because we'd already had the conversation.", cite: "A second-year MBA student" },
    ],
  },
  {
    slug: "pre-arrival-communication-plan-for-admissions-teams",
    title: "A pre-arrival communication plan for admissions teams",
    description: "What to send admitted students between deposit and orientation — and when. A week-by-week template you can adapt for your next intake.",
    category: "For schools",
    tags: ["Admissions", "Communication", "Onboarding"],
    author: "ethan",
    date: "2027-03-11",
    cover: "/admission_team.webp",
    coverAlt: "University campus building on a clear day",
    takeaways: [
      "Every message should map to a step and a date.",
      "Fewer, better-timed messages beat more messages.",
      "Coordinate offices so students hear one voice.",
      "Measure activation in week one — it predicts the rest.",
    ],
    body: [
      { type: "p", text: "Between deposit and orientation, the average admitted student hears from five or more offices. Each message makes sense on its own. Together, they're noise. A simple plan — one owner, one calendar, one source of truth — changes that." },
      { type: "h2", text: "Principles" },
      { type: "ul", items: ["**One step per message.** If it doesn't ask the student to do something specific, it can wait.", "**Date everything.** 'Soon' is not a deadline.", "**Personalize by situation.** Domestic students shouldn't receive visa reminders.", "**Make it skimmable.** One action, one link, one deadline."] },
      { type: "h2", text: "A week-by-week template" },
      { type: "h3", text: "Week 0 — Welcome" },
      { type: "p", text: "Congratulations, plus a single link to the student's personal plan. Nothing else." },
      { type: "h3", text: "Weeks 1–2 — Foundations" },
      { type: "p", text: "Account setup, financial documents, and for international students, the I-20 request. Introduce the student community." },
      { type: "h3", text: "Weeks 3–8 — The heavy lift" },
      { type: "p", text: "Visa, funding, health requirements and housing. This is where most students stall, so increase reminder frequency around each deadline." },
      { type: "h3", text: "Weeks 9–12 — Readiness" },
      { type: "p", text: "Pre-program coursework, travel, banking and phone setup. Shift the tone from tasks to excitement." },
      { type: "h3", text: "Final two weeks — Arrival" },
      { type: "p", text: "Check-in instructions, first-week schedule and who to contact on landing day." },
      { type: "callout", title: "Coordinate before you send", text: "Put every office's messages on one shared calendar. If two land in the same week, merge them or move one." },
      { type: "h2", text: "What to measure" },
      { type: "ol", items: ["**Activation:** share of admits who've opened their plan in the first week.", "**Completion by stage:** where the class is stuck, in aggregate.", "**Time to complete:** how long key steps take, so next year's dates are realistic."] },
      { type: "p", text: "None of this requires watching individual students. Aggregate progress is enough to know where to send help — and it keeps student trust intact." },
    ],
  },
  {
    slug: "open-us-bank-account-without-ssn",
    title: "Opening a US bank account without an SSN: what admitted students should know",
    description: "Which documents you'll need, whether you can open an account before you fly, and how to start building US credit from day one.",
    category: "For students",
    tags: ["Banking", "Finance", "International students"],
    author: "marcus",
    date: "2027-02-26",
    cover: unsplash(photos.studying, 1600, 1000),
    coverAlt: "Students planning together at a table",
    takeaways: [
      "Many banks open student accounts with a passport and I-20 — no SSN required.",
      "Some banks let you start the process before you arrive.",
      "Bring enough accessible money for your first two to four weeks.",
      "A secured credit card is the simplest way to start a US credit history.",
    ],
    body: [
      { type: "p", text: "A US bank account makes everything easier: paying rent, getting paid for an on-campus job, splitting bills with roommates. Many new international students assume they need a Social Security number first. Often, they don't." },
      { type: "h2", text: "What you'll usually need" },
      { type: "ul", items: ["Passport with your F-1 visa", "Form I-20", "Proof of enrollment or an admission letter", "A US address — campus housing or your lease often works", "Sometimes a second form of ID"] },
      { type: "p", text: "You'll typically need an SSN only if you're working in the US, for example in an on-campus job. Requirements differ by bank and branch, so call ahead or check online before you go." },
      { type: "h2", text: "Can I open one before I arrive?" },
      { type: "p", text: "Some banks and student-focused providers let you start an application from abroad and finish it in person. This can save a trip in your first busy week — and means you'll have account details ready for your landlord." },
      { type: "callout", title: "Your first month", text: "Plan to have enough accessible money for two to four weeks of expenses — through an international card, a multi-currency account or traveller's funds — in case your US account takes longer to set up." },
      { type: "h2", text: "Moving money from home" },
      { type: "p", text: "Compare total cost, not just the fee: exchange-rate markups often matter more. For large payments like tuition, check whether your school accepts payments through a specific provider." },
      { type: "h2", text: "Start building credit" },
      { type: "p", text: "Without a US credit history, renting and getting a phone plan can be harder. A **secured credit card** — backed by a deposit you provide — is the simplest place to start. Use it for small purchases and pay it off in full every month." },
      { type: "p", text: "Banking rules vary by provider and change over time. Confirm the latest requirements with your bank and your school's international office." },
    ],
  },
];

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function readMinutes(post: Post) {
  const words = post.body
    .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(3, Math.round(words / 220));
}

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function formatDate(iso: string) {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function relatedPosts(post: Post, count = 3) {
  const same = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const other = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...same, ...other].slice(0, count);
}

export type PostSummary = Pick<Post, "slug" | "title" | "description" | "category" | "date" | "cover" | "coverAlt"> & { minutes: number; author: Author };

export function summarize(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    date: post.date,
    cover: post.cover,
    coverAlt: post.coverAlt,
    minutes: readMinutes(post),
    author: authors[post.author],
  };
}
