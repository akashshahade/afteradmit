export type Audience = "students" | "universities" | "partners";

export type HelpTopic = { id: string; audience: Audience; title: string; body: string };
export type HelpArticle = { id: string; topic: string; q: string; a: string };

export const audiences: { id: Audience; label: string }[] = [
  { id: "students", label: "Students" },
  { id: "universities", label: "Universities" },
  { id: "partners", label: "Partners" },
];

export const helpTopics: HelpTopic[] = [
  { id: "getting-started", audience: "students", title: "Getting started", body: "Invites, sign-up and onboarding" },
  { id: "roadmap", audience: "students", title: "Roadmap & milestones", body: "Stages, deadlines and reminders" },
  { id: "visa", audience: "students", title: "Visa & documents", body: "I-20, SEVIS and what we store" },
  { id: "community", audience: "students", title: "Community & messages", body: "Spaces, posts and safety" },
  { id: "marketplace", audience: "students", title: "Marketplace", body: "Partners, perks and privacy" },
  { id: "account", audience: "students", title: "Account & billing", body: "Profile, Plus plan and data" },
  { id: "setup", audience: "universities", title: "Setting up", body: "Templates, dates and branding" },
  { id: "invites", audience: "universities", title: "Inviting your class", body: "CSV uploads and activation" },
  { id: "insights", audience: "universities", title: "Class insights", body: "Progress, stages and exports" },
  { id: "privacy", audience: "universities", title: "Privacy & compliance", body: "FERPA, GDPR and access" },
  { id: "listings", audience: "partners", title: "Listings", body: "Creating and updating offers" },
  { id: "leads", audience: "partners", title: "Leads & analytics", body: "Clicks, leads and reporting" },
  { id: "partner-billing", audience: "partners", title: "Billing", body: "Plans, invoices and payment" },
];

export const helpArticles: HelpArticle[] = [
  { id: "join", topic: "getting-started", q: "How do I join AfterAdmit?", a: "AfterAdmit is offered through your university. Once you've accepted your offer, your school sends you an invite email — open it on any device to create your account. If you can't find it, check your spam folder or ask your admissions office to resend it." },
  { id: "free", topic: "getting-started", q: "Is AfterAdmit free for students?", a: "Yes. Your school covers everything on your roadmap. An optional Plus plan adds one-to-one advisor calls and document reviews." },
  { id: "onboarding", topic: "getting-started", q: "Why does onboarding ask about my visa and family?", a: "Five short questions let us personalize your roadmap. Domestic students never see visa steps, and steps like dependent visas only appear if they apply to you. You can change your answers anytime in your profile." },
  { id: "dates", topic: "roadmap", q: "Where do my deadlines come from?", a: "Every date on your roadmap comes from your school's real deadlines, set by its admissions and student services teams. If a date changes, your roadmap updates automatically." },
  { id: "complete", topic: "roadmap", q: "How do I mark a milestone as done?", a: "Open the milestone from your roadmap or Home and tap 'Mark as done'. Some milestones ask for a quick confirmation, like the date you paid a fee. You can undo it at any time." },
  { id: "reminders", topic: "roadmap", q: "When will I get reminders?", a: "By default, a week before and a day before anything is due, plus a nudge if something becomes overdue. Change this in Profile → Notifications." },
  { id: "store", topic: "visa", q: "Do you store my passport or visa numbers?", a: "No. AfterAdmit never asks for or stores passport numbers, visa numbers or SEVIS IDs. We only track whether a step is done." },
  { id: "advice", topic: "visa", q: "Is AfterAdmit immigration advice?", a: "No. Your roadmap is general guidance built with your school. For decisions about your visa or status, always confirm with your school's international office and official government sources." },
  { id: "sevis", topic: "visa", q: "Where do I pay the SEVIS fee?", a: "Only on the official US government SEVIS I-901 payment site. Your roadmap links to it directly — avoid third-party sites that charge extra." },
  { id: "spaces", topic: "community", q: "Who can see my posts?", a: "Only verified admitted students at your school. Spaces are private, and your university can't read posts or messages." },
  { id: "report", topic: "community", q: "How do I report a post or message?", a: "Use the ••• menu on any post, comment or message and choose 'Report'. Moderators review reports quickly, and you can also block a member from their profile." },
  { id: "dm", topic: "community", q: "Can I message other students privately?", a: "Yes. Open a member's profile and choose 'Message'. Never share passport, visa or bank details with someone you haven't met." },
  { id: "vetted", topic: "marketplace", q: "How are partners chosen?", a: "Every partner is reviewed by AfterAdmit for fit, pricing transparency and student reviews before being listed." },
  { id: "share", topic: "marketplace", q: "Do partners get my contact details?", a: "Never. Opening a partner takes you to their website, and you decide what to share there. AfterAdmit records only an anonymous click." },
  { id: "plus", topic: "account", q: "What's included in AfterAdmit Plus?", a: "One-to-one advisor calls, document reviews before key appointments and priority support. You can cancel anytime from Profile → Billing." },
  { id: "delete", topic: "account", q: "How do I download or delete my data?", a: "Go to Profile → Privacy & data. You can export everything as a file or permanently delete your account." },
  { id: "launch", topic: "setup", q: "How long does it take to launch?", a: "Most teams go live in under a week: confirm term dates, adjust school-specific guidance on our proven template, upload your class and send invites." },
  { id: "brand", topic: "setup", q: "Can we use our own branding and contacts?", a: "Yes. Add your logo, office contacts and links to your own pages. Students see them inside each relevant milestone." },
  { id: "csv", topic: "invites", q: "How do we invite our admitted class?", a: "Upload a CSV with names and emails, or connect your CRM. Students receive a branded invite and can activate from their phone in minutes." },
  { id: "resend", topic: "invites", q: "Can we resend invites to students who haven't joined?", a: "Yes. Filter by 'Invited, not active' and resend in one click. We recommend a reminder after five days." },
  { id: "see", topic: "insights", q: "What can our team see?", a: "Aggregate progress for your class: activation, completion by stage, and how many students are behind on key deadlines. Never individual milestones, posts, messages or partner clicks." },
  { id: "export", topic: "insights", q: "Can we export reports?", a: "Yes. Export class-level reports as CSV or PDF from the Insights page, ready for enrollment meetings." },
  { id: "ferpa", topic: "privacy", q: "Is AfterAdmit FERPA and GDPR compliant?", a: "Yes. We act as a school official under FERPA and as a processor under GDPR, with a Data Processing Addendum in every agreement." },
  { id: "access", topic: "privacy", q: "Who on our team can access the dashboard?", a: "Only people you invite. Roles control what each person can see and edit, and every sign-in supports SSO." },
  { id: "list", topic: "listings", q: "How do we create a listing?", a: "From the Partner dashboard, choose 'New listing', add your offer, perk and link, then submit it for review. Most listings are approved within two business days." },
  { id: "edit", topic: "listings", q: "Can we update an offer after it's live?", a: "Yes. Edits to copy and links go live immediately; changes to pricing or perks are re-reviewed to keep the marketplace trustworthy." },
  { id: "lead", topic: "leads", q: "What counts as a lead?", a: "A student opening your offer and continuing to your site. You see anonymous, aggregate counts by school and category — never personal details." },
  { id: "report-leads", topic: "leads", q: "Where can we see performance?", a: "The Overview page shows clicks, leads and conversion by week, with breakdowns by school and listing." },
  { id: "invoice", topic: "partner-billing", q: "How does billing work?", a: "Plans are billed monthly or annually. Download invoices and update payment details from Billing in your Partner dashboard." },
  { id: "cancel", topic: "partner-billing", q: "Can we pause or cancel?", a: "Yes. Pause listings anytime, or cancel at the end of your billing period from the Billing page." },
];
