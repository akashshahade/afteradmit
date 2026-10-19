import type { LucideIcon } from "lucide-react";
import { Rocket, Wallet, Globe, GraduationCap, HeartPulse, House, Landmark, Plane, MapPin } from "lucide-react";

// Fixed "today" so overdue and countdown states are stable in the demo.
export const TODAY = "2027-05-18";

export const RING_COLORS = { roadmap: "#FF4500", month: "#8B5CF6", onTime: "#14B8A6" };

export const school = {
  name: "UCLA Anderson",
  fullName: "UCLA Anderson School of Management",
  logo: "/ucla-anderson.svg",
  program: "Full-Time MBA",
  term: "Fall 2027",
  termShort: "Fall '27",
  emailDomain: "anderson.ucla.edu",
  dates: {
    depositDeadline: "2027-04-15",
    healthFormDeadline: "2027-08-01",
    housingDeadline: "2027-06-01",
    insuranceWaiverDeadline: "2027-08-15",
    orientation: "2027-09-13",
    programStart: "2027-09-20",
  },
};

export const student = {
  id: "stu_sayali",
  name: "Sayali D.",
  firstName: "Sayali",
  initials: "SD",
  email: "sayali.d@gmail.com",
  schoolEmail: "sayali.d.2029@anderson.ucla.edu",
  avatarColor: "#FF4500",
  profile: {
    program: "Full-Time MBA",
    homeCountry: "India",
    homeCity: "Mumbai",
    visaType: "F-1",
    funding: ["Loan", "Scholarship"],
    dependents: false,
    housing: "Off-campus",
    offerAccepted: true,
  },
  joined: "2027-03-22",
  karma: 214,
};

export type MilestoneStatus = "not_started" | "in_progress" | "done" | "not_applicable";

export type Task = { id: string; text: string; done: boolean };

export type Contact = { name: string; role: string; email: string; hours?: string };

export type Milestone = {
  id: string;
  stage: number;
  title: string;
  description: string;
  why: string;
  due: string;
  dueRule: string;
  status: MilestoneStatus;
  completedAt?: string;
  tasks: Task[];
  international?: boolean;
  rule?: string;
  requires?: string;
  contact: Contact;
  providers?: string[];
  communityTag?: string;
};

export type Stage = { id: number; name: string; short: string; icon: LucideIcon; blurb: string };

export const stages: Stage[] = [
  { id: 1, name: "Get Started", short: "Start", icon: Rocket, blurb: "Lock in your seat and get set up with the school." },
  { id: 2, name: "Finance", short: "Finance", icon: Wallet, blurb: "Know your costs and confirm how you'll pay for them." },
  { id: 3, name: "Visa", short: "Visa", icon: Globe, blurb: "Get your I-20, pay SEVIS, and book your visa interview." },
  { id: 4, name: "Academics", short: "Academics", icon: GraduationCap, blurb: "Finish pre-program work so day one feels easy." },
  { id: 5, name: "Healthcare", short: "Health", icon: HeartPulse, blurb: "Insurance, immunizations, and medical prep." },
  { id: 6, name: "Housing", short: "Housing", icon: House, blurb: "Pick where you'll live and who you'll live with." },
  { id: 7, name: "Essentials", short: "Essentials", icon: Landmark, blurb: "Banking, cards, and money flowing across borders." },
  { id: 8, name: "Travel", short: "Travel", icon: Plane, blurb: "Flights, packing, and a plan for landing day." },
  { id: 9, name: "Arrival", short: "Arrival", icon: MapPin, blurb: "Check in, move in, and get connected in LA." },
];

const admissions: Contact = { name: "MBA Admissions Office", role: "UCLA Anderson", email: "mba.admissions@example.edu", hours: "Mon–Fri, 9am–5pm PT" };
const intlOffice: Contact = { name: "International Student Office", role: "Visa & immigration advising", email: "intl.office@example.edu", hours: "Drop-in Tue & Thu" };
const finAid: Contact = { name: "Financial Aid Office", role: "Loans, scholarships, cost of attendance", email: "finaid@example.edu" };
const health: Contact = { name: "Student Health Services", role: "Insurance & immunizations", email: "health@example.edu" };
const housingOffice: Contact = { name: "Housing Services", role: "On- and off-campus housing", email: "housing@example.edu" };
const studentAffairs: Contact = { name: "MBA Student Affairs", role: "Orientation & pre-program", email: "mba.studentaffairs@example.edu" };

const t = (id: string, items: [string, boolean?][]): Task[] => items.map(([text, done], i) => ({ id: `${id}-t${i + 1}`, text, done: !!done }));

export const milestones: Milestone[] = [
  // Stage 1
  {
    id: "m1", stage: 1, title: "Offer accepted", status: "done", completedAt: "2027-03-22",
    description: "Accept your admission offer in the admit portal and review any scholarship terms.",
    why: "Your seat isn't held until you accept. Everything else on this roadmap depends on it.",
    due: "2027-04-01", dueRule: "Round 2 reply date",
    tasks: t("m1", [["Review admit letter and scholarship terms", true], ["Accept your offer in the admit portal", true], ["Save the confirmation email", true]]),
    contact: admissions,
  },
  {
    id: "m2", stage: 1, title: "Enrollment deposit paid", status: "done", completedAt: "2027-04-02",
    description: "Pay the enrollment deposit to confirm your place in the Fall 2027 class.",
    why: "Missing the deposit deadline releases your seat to the waitlist.",
    due: "2027-04-15", dueRule: "Deposit deadline",
    tasks: t("m2", [["Pay the deposit through the admit portal", true], ["Download your deposit receipt", true]]),
    contact: admissions,
  },
  {
    id: "m3", stage: 1, title: "School accounts active", status: "done", completedAt: "2027-04-09",
    description: "Activate your university login, school email, and multi-factor authentication.",
    why: "Every school system — housing, health, registration — uses this login.",
    due: "2027-04-30", dueRule: "15 days after deposit deadline",
    tasks: t("m3", [["Create your university login ID", true], ["Activate your Anderson email", true], ["Turn on multi-factor authentication", true]]),
    contact: admissions,
  },
  {
    id: "m4", stage: 1, title: "Joined community groups", status: "in_progress",
    description: "Join your program's Slack or WhatsApp group and the Anderson groups on AfterAdmit.",
    why: "Classmates share roommate, housing, and travel plans here first.",
    due: "2027-05-31", dueRule: "Before housing deadline",
    tasks: t("m4", [["Join your program's Slack or WhatsApp group", true], ["Join the Anderson Fall '27 space on AfterAdmit"]]),
    contact: admissions, communityTag: "AndersonFall27",
  },
  {
    id: "m5", stage: 1, title: "Transcripts and degree submitted", status: "in_progress",
    description: "Send final official transcripts and your degree certificate to admissions.",
    why: "Your enrollment stays conditional until these arrive. International students need them for the I-20 file too.",
    due: "2027-06-30", dueRule: "Admissions final documents date",
    tasks: t("m5", [["Request final official transcripts", true], ["Submit your degree certificate"], ["Complete a credential evaluation if requested"]]),
    contact: admissions,
  },
  // Stage 2
  {
    id: "m6", stage: 2, title: "Cost of attendance checked", status: "done", completedAt: "2027-04-05",
    description: "Review tuition, fees, housing, and living costs for your first year.",
    why: "This number drives your loan amount and the funds you'll show for your I-20.",
    due: "2027-04-20", dueRule: "5 days after deposit deadline",
    tasks: t("m6", [["Review the official cost of attendance", true], ["Build a monthly LA budget", true]]),
    contact: finAid,
  },
  {
    id: "m7", stage: 2, title: "Funding sources confirmed", status: "done", completedAt: "2027-04-18",
    description: "Confirm how you'll cover costs: scholarship, loan, sponsor, or self-funding.",
    why: "The school and your visa officer both need to see a complete funding plan.",
    due: "2027-04-30", dueRule: "15 days after deposit deadline",
    tasks: t("m7", [["Confirm scholarship amount", true], ["Decide on loan amount", true]]),
    contact: finAid,
  },
  {
    id: "m8", stage: 2, title: "Loan secured", status: "in_progress", rule: "Funding includes a loan",
    description: "Compare lenders, apply, and get a sanction or support letter for your I-20.",
    why: "International lenders can take 3–4 weeks to approve. A support letter helps your visa interview.",
    due: "2027-06-15", dueRule: "60 days before program start",
    tasks: t("m8", [["Compare 2–3 lenders", true], ["Submit your loan application", true], ["Get your approval letter"], ["Request a support letter from your lender"]]),
    contact: finAid, providers: ["northbridge", "meridian"], communityTag: "Finance",
  },
  {
    id: "m9", stage: 2, title: "Financial documents submitted for the I-20", status: "done", completedAt: "2027-04-28", international: true,
    description: "Send proof of funding to the international office so they can issue your I-20.",
    why: "No proof of funds, no I-20 — and no I-20, no visa.",
    due: "2027-05-01", dueRule: "I-20 request deadline",
    tasks: t("m9", [["Gather bank statements and loan letter", true], ["Submit through the international office portal", true]]),
    contact: intlOffice,
  },
  // Stage 3
  {
    id: "m10", stage: 3, title: "I-20 received", status: "done", completedAt: "2027-05-06", international: true,
    description: "Download your I-20 and check every field — name, program dates, funding.",
    why: "Typos on your I-20 can delay your visa interview. Catch them now.",
    due: "2027-05-15", dueRule: "After financial documents",
    tasks: t("m10", [["Download the I-20", true], ["Check name, dates and funding", true], ["Sign page one", true]]),
    contact: intlOffice, requires: "Financial documents submitted for the I-20",
  },
  {
    id: "m11", stage: 3, title: "DS-160 submitted and interview booked", status: "in_progress", international: true,
    description: "Complete the DS-160 visa form, pay the visa fee, and book your interview slot.",
    why: "Interview wait times in Mumbai can run 4–8 weeks in summer. Book early.",
    due: "2027-06-01", dueRule: "~110 days before program start",
    tasks: t("m11", [["Complete the DS-160 form", true], ["Pay the visa application fee", true], ["Book your interview appointment"]]),
    contact: intlOffice, requires: "I-20 received", communityTag: "F1Visa",
  },
  {
    id: "m12", stage: 3, title: "SEVIS fee paid", status: "not_started", international: true,
    description: "Pay the I-901 SEVIS fee and keep the receipt for your interview.",
    why: "Your visa interview can't go ahead without proof of SEVIS payment.",
    due: "2027-05-25", dueRule: "At least 3 days before interview",
    tasks: t("m12", [["Pay the I-901 SEVIS fee online"], ["Print and save the receipt"]]),
    contact: intlOffice, requires: "I-20 received",
  },
  {
    id: "m13", stage: 3, title: "Visa document checklist ready", status: "not_started", international: true,
    description: "Assemble everything for your interview: passport, I-20, SEVIS receipt, funding proof, admit letter.",
    why: "Interviews are short. Organised documents make a confident first impression.",
    due: "2027-06-10", dueRule: "Before interview date",
    tasks: t("m13", [["Passport valid 6+ months past program start"], ["Signed I-20 and SEVIS receipt"], ["Funding proof and admit letter"], ["Practise common interview questions"]]),
    contact: intlOffice, providers: ["visaprep"], communityTag: "F1Visa",
  },
  // Stage 4
  {
    id: "m14", stage: 4, title: "Pre-program coursework done", status: "not_started",
    description: "Finish the quantitative and Excel prep modules before orientation.",
    why: "Core courses move fast in week one. Prep modules level the field.",
    due: "2027-08-20", dueRule: "24 days before orientation",
    tasks: t("m14", [["Quantitative skills modules"], ["Excel and financial modelling primer"], ["Accounting fundamentals quiz"]]),
    contact: studentAffairs,
  },
  // Stage 5
  {
    id: "m15", stage: 5, title: "School insurance plan or waiver approved", status: "not_started",
    description: "Enroll in the school health plan or submit a waiver with comparable coverage.",
    why: "You'll be auto-enrolled and billed if you miss the waiver deadline.",
    due: "2027-08-15", dueRule: "Insurance waiver deadline",
    tasks: t("m15", [["Compare school plan vs private plan"], ["Submit enrollment or waiver"], ["Save your insurance card"]]),
    contact: health, providers: ["harbor"],
  },
  {
    id: "m16", stage: 5, title: "Immunization records submitted", status: "in_progress",
    description: "Submit proof of required vaccinations through the student health portal.",
    why: "A registration hold is placed on accounts without immunization records.",
    due: "2027-05-15", dueRule: "Early health form deadline",
    tasks: t("m16", [["Collect vaccination records from your doctor", true], ["Get a TB screening if required"], ["Submit through the student health portal"]]),
    contact: health,
  },
  {
    id: "m17", stage: 5, title: "Checkups done at home", status: "not_started",
    description: "Book dental, vision, and general checkups before you leave.",
    why: "Routine care is often cheaper and faster at home than in your first US semester.",
    due: "2027-07-31", dueRule: "30 days before travel",
    tasks: t("m17", [["General checkup"], ["Dental cleaning"], ["Eye test and spare glasses"]]),
    contact: health,
  },
  {
    id: "m18", stage: 5, title: "Prescriptions stocked", status: "not_started",
    description: "Get a 3-month supply and a doctor's letter for any regular medication.",
    why: "Some medicines need a US prescription to refill. Bridge the gap.",
    due: "2027-08-31", dueRule: "2 weeks before orientation",
    tasks: t("m18", [["3-month supply of regular medication"], ["Doctor's letter with generic names"]]),
    contact: health,
  },
  // Stage 6
  {
    id: "m19", stage: 6, title: "Housing type decided", status: "done", completedAt: "2027-05-02",
    description: "Choose between on-campus graduate housing and renting off-campus.",
    why: "On-campus spots fill early; off-campus leases in Westwood start in June–August.",
    due: "2027-05-10", dueRule: "3 weeks before housing deadline",
    tasks: t("m19", [["Compare on- and off-campus costs", true], ["Decide on housing type", true]]),
    contact: housingOffice,
  },
  {
    id: "m20", stage: 6, title: "Roommates confirmed", status: "in_progress",
    description: "Find classmates to share with. Check the Roommates community for open listings.",
    why: "Sharing a 2-bed in Westwood can save you $900+ a month.",
    due: "2027-06-15", dueRule: "2 weeks after housing deadline",
    tasks: t("m20", [["Post or reply in the Roommates space", true], ["Video call with potential roommates"], ["Agree on budget and move-in date"]]),
    contact: housingOffice, communityTag: "Roommates",
  },
  {
    id: "m21", stage: 6, title: "Lease signed", status: "not_started", rule: "Housing preference is off-campus",
    description: "Tour (virtually), apply, and sign a lease for your off-campus place.",
    why: "Good units near campus go fast once summer starts.",
    due: "2027-06-01", dueRule: "Housing deadline",
    tasks: t("m21", [["Shortlist 3 places"], ["Schedule virtual tours"], ["Review lease terms"], ["Sign and pay the deposit"]]),
    contact: housingOffice, providers: ["westwood", "sunset"], communityTag: "Housing",
  },
  // Stage 7
  {
    id: "m22", stage: 7, title: "US bank account planned", status: "not_started",
    description: "Pick a US bank and check which accounts you can open before you arrive.",
    why: "You'll need a US account for rent, payroll, and splitting bills with classmates.",
    due: "2027-08-01", dueRule: "6 weeks before orientation",
    tasks: t("m22", [["Compare student checking accounts"], ["Check documents needed to open"]]),
    contact: studentAffairs, providers: ["pacific"],
  },
  {
    id: "m23", stage: 7, title: "International debit card ready", status: "not_started", international: true,
    description: "Get a card that works in the US with low FX fees for your first few weeks.",
    why: "It can take 1–2 weeks to open a US account after you land.",
    due: "2027-08-15", dueRule: "4 weeks before orientation",
    tasks: t("m23", [["Order an international debit card"], ["Load your first month's budget"]]),
    contact: studentAffairs, providers: ["atlas"],
  },
  {
    id: "m24", stage: 7, title: "Home bank access set up", status: "not_started", international: true,
    description: "Enable international transactions and remote access on your home accounts.",
    why: "OTPs to your home number won't work once you switch SIMs.",
    due: "2027-08-15", dueRule: "4 weeks before orientation",
    tasks: t("m24", [["Enable international usage"], ["Switch OTPs to an app or email"], ["Set up a remittance account"]]),
    contact: studentAffairs, providers: ["wiseline"],
  },
  {
    id: "m25", stage: 7, title: "Packing list reviewed", status: "not_started",
    description: "Use the Anderson packing list to plan what to bring and what to buy in LA.",
    why: "Checked bags are expensive. Know what's cheaper to buy locally.",
    due: "2027-08-25", dueRule: "3 weeks before orientation",
    tasks: t("m25", [["Review the packing list"], ["Mark items to buy in LA"]]),
    contact: studentAffairs,
  },
  // Stage 8
  {
    id: "m26", stage: 8, title: "Flight booked", status: "not_started",
    description: "Book a flight landing 1–2 weeks before orientation. Student fares with discount codes are in the marketplace.",
    why: "F-1 students can enter up to 30 days before the program start date.",
    due: "2027-07-15", dueRule: "60 days before orientation",
    tasks: t("m26", [["Pick an arrival date"], ["Compare student fares"], ["Book and save your itinerary"]]),
    contact: studentAffairs, providers: ["skystudent"],
  },
  {
    id: "m27", stage: 8, title: "Packing done", status: "not_started",
    description: "Pack using your list. Ship heavier items ahead if needed.",
    why: "Shipping a box ahead often beats paying for a third bag.",
    due: "2027-09-01", dueRule: "12 days before orientation",
    tasks: t("m27", [["Pack checked and carry-on bags"], ["Ship extra boxes"]]),
    contact: studentAffairs, providers: ["parcelpack"],
  },
  {
    id: "m28", stage: 8, title: "Document kit assembled", status: "not_started",
    description: "Carry originals of every key document in your hand luggage.",
    why: "CBP officers can ask for your I-20 and funding proof at the port of entry.",
    due: "2027-08-30", dueRule: "2 weeks before orientation",
    tasks: t("m28", [["Passport with visa"], ["Signed I-20 and SEVIS receipt"], ["Admit letter and funding proof"], ["Digital copies in the cloud"]]),
    contact: intlOffice,
  },
  {
    id: "m29", stage: 8, title: "Arrival plan made", status: "not_started",
    description: "Plan your first 72 hours: airport transfer, first nights, and SIM.",
    why: "If your lease starts later, book a short stay near campus now.",
    due: "2027-08-30", dueRule: "2 weeks before orientation",
    tasks: t("m29", [["Airport to Westwood transfer"], ["First nights booked"], ["Share itinerary with family"]]),
    contact: studentAffairs, providers: ["westwood"],
  },
  // Stage 9
  {
    id: "m30", stage: 9, title: "I-94 downloaded and international office check-in done", status: "not_started", international: true,
    description: "Download your I-94 record and complete check-in with the international office.",
    why: "Check-in activates your SEVIS record. Missing it can affect your status.",
    due: "2027-09-10", dueRule: "Before orientation",
    tasks: t("m30", [["Download your I-94"], ["Complete check-in with the international office"]]),
    contact: intlOffice, requires: "Arrived in the US",
  },
  {
    id: "m31", stage: 9, title: "Orientation done", status: "not_started",
    description: "Attend orientation week and meet your cohort and section.",
    why: "Sections, teams, and recruiting kick off here.",
    due: "2027-09-17", dueRule: "Orientation week",
    tasks: t("m31", [["Register for orientation"], ["Attend all mandatory sessions"]]),
    contact: studentAffairs,
  },
  {
    id: "m32", stage: 9, title: "Bank, SSN and essentials set up", status: "not_started",
    description: "Open your US account and apply for an SSN if you have on-campus work.",
    why: "You'll need an SSN for on-campus jobs and for building US credit.",
    due: "2027-09-30", dueRule: "2 weeks after program start",
    tasks: t("m32", [["Open your US bank account"], ["Apply for an SSN if eligible"]]),
    contact: intlOffice, providers: ["pacific"],
  },
  {
    id: "m33", stage: 9, title: "Moved in", status: "not_started",
    description: "Pick up keys, do a move-in inspection, and set up your space.",
    why: "Photos at move-in protect your security deposit at move-out.",
    due: "2027-09-10", dueRule: "Before orientation",
    tasks: t("m33", [["Pick up keys"], ["Photograph the unit at move-in"]]),
    contact: housingOffice,
  },
  {
    id: "m34", stage: 9, title: "US phone plan active", status: "not_started",
    description: "Activate a US number. eSIMs can be set up before you fly.",
    why: "Banks, the school, and Uber all need a US number.",
    due: "2027-09-10", dueRule: "Before orientation",
    tasks: t("m34", [["Pick a plan"], ["Activate the eSIM"]]),
    contact: studentAffairs, providers: ["signal"],
  },
  {
    id: "m35", stage: 9, title: "Home Wi‑Fi set up", status: "not_started",
    description: "Set up internet at your place, or confirm it's included in rent.",
    why: "Installation slots book out 1–2 weeks in late August.",
    due: "2027-09-15", dueRule: "First week",
    tasks: t("m35", [["Check if Wi‑Fi is included"], ["Book installation"]]),
    contact: housingOffice,
  },
];

export const hiddenMilestones = [
  { title: "Dependent visa documents (F-2)", stage: 3, reason: "You're not bringing dependents" },
  { title: "On-campus housing application", stage: 6, reason: "You chose off-campus housing" },
  { title: "Sponsor letter submitted", stage: 2, reason: "Your funding doesn't include a sponsor" },
];

export type Provider = {
  id: string;
  name: string;
  category: "Loan" | "Insurance" | "Housing" | "Banking" | "Remittance" | "Phone" | "Travel" | "Visa" | "Moving";
  tagline: string;
  description: string;
  perk?: string;
  code?: string;
  initials: string;
  color: string;
  rating: number;
  reviews: number;
  url: string;
  leads: number;
  active: boolean;
};

export const providers: Provider[] = [
  { id: "northbridge", name: "Northbridge Student Loans", category: "Loan", tagline: "No-cosigner loans for international MBAs", description: "Fixed and variable rate loans for international students at top US business schools. Approval letters in 5 business days.", perk: "0.25% rate discount for Anderson admits", initials: "NB", color: "#1D4ED8", rating: 4.7, reviews: 412, url: "#", leads: 318, active: true },
  { id: "meridian", name: "Meridian Education Finance", category: "Loan", tagline: "Cover up to 100% of cost of attendance", description: "Loans that cover tuition and living costs, with a 6-month grace period after graduation.", perk: "Waived origination fee", initials: "ME", color: "#0F766E", rating: 4.5, reviews: 268, url: "#", leads: 204, active: true },
  { id: "harbor", name: "Harbor Health International", category: "Insurance", tagline: "Waiver-compliant student health plans", description: "Plans built to meet university waiver requirements, with a dedicated claims line for students.", perk: "First month free", initials: "HH", color: "#BE123C", rating: 4.4, reviews: 189, url: "#", leads: 156, active: true },
  { id: "westwood", name: "Westwood Commons", category: "Housing", tagline: "Furnished student suites + short-stay beds", description: "Furnished suites a 6-minute walk from campus, plus 2-week arrival beds for students whose lease starts later.", perk: "No application fee for AfterAdmit students", initials: "WC", color: "#18181B", rating: 4.8, reviews: 96, url: "#", leads: 241, active: true },
  { id: "sunset", name: "Sunset Village Apartments", category: "Housing", tagline: "1–2 bed apartments in Westwood", description: "Unfurnished and furnished apartments with flexible 10- and 12-month leases.", initials: "SV", color: "#B45309", rating: 4.3, reviews: 74, url: "#", leads: 133, active: true },
  { id: "pacific", name: "Pacific Coast Bank", category: "Banking", tagline: "Student checking with no SSN required", description: "Open a student checking account with your passport and I-20. No monthly fees for students.", perk: "$100 bonus after first deposit", initials: "PC", color: "#0369A1", rating: 4.2, reviews: 301, url: "#", leads: 122, active: true },
  { id: "atlas", name: "Atlas Card", category: "Banking", tagline: "Multi-currency debit card", description: "Hold USD and INR, spend in the US with no FX markup up to $5,000 a month.", initials: "AC", color: "#7C3AED", rating: 4.6, reviews: 520, url: "#", leads: 98, active: true },
  { id: "wiseline", name: "Wiseline Transfers", category: "Remittance", tagline: "Send money home at mid-market rates", description: "Transparent fees for tuition payments and family transfers between India and the US.", perk: "First transfer fee-free", initials: "WL", color: "#15803D", rating: 4.8, reviews: 1140, url: "#", leads: 87, active: true },
  { id: "signal", name: "Signal Mobile", category: "Phone", tagline: "US eSIM before you fly", description: "Activate a US number from home. Unlimited talk, text, and 15GB data.", perk: "$15/mo student plan", initials: "SM", color: "#DB2777", rating: 4.1, reviews: 233, url: "#", leads: 64, active: true },
  { id: "skystudent", name: "SkyStudent Fares", category: "Travel", tagline: "Student fares with extra baggage", description: "Discounted one-way student fares with a free extra checked bag on partner airlines.", perk: "Extra 10% off with code", code: "ANDERSON10", initials: "SS", color: "#0891B2", rating: 4.5, reviews: 388, url: "#", leads: 141, active: true },
  { id: "parcelpack", name: "Parcel & Pack", category: "Moving", tagline: "Ship boxes door-to-door", description: "Door-to-door international shipping for students, with pickup from your home.", initials: "PP", color: "#CA8A04", rating: 4.0, reviews: 58, url: "#", leads: 29, active: true },
  { id: "visaprep", name: "VisaPrep Advisors", category: "Visa", tagline: "Mock F-1 interviews with ex-officers", description: "30-minute mock interviews and a document review before your appointment.", initials: "VP", color: "#4338CA", rating: 4.6, reviews: 147, url: "#", leads: 52, active: true },
];

export const providerById = (id: string) => providers.find((p) => p.id === id)!;

export function daysBetween(fromISO: string, toISO: string) {
  const a = new Date(fromISO + "T00:00:00Z").getTime();
  const b = new Date(toISO + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86_400_000);
}

export function isOverdue(m: Pick<Milestone, "status" | "due">) {
  return m.status !== "done" && m.status !== "not_applicable" && daysBetween(TODAY, m.due) < 0;
}

export function dueLabel(due: string) {
  const d = daysBetween(TODAY, due);
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  if (d < 14) return `Due in ${d}d`;
  return `Due ${new Date(due + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export const progressHistory = [
  { week: "Mar 22", done: 1 },
  { week: "Mar 29", done: 1 },
  { week: "Apr 5", done: 3 },
  { week: "Apr 12", done: 4 },
  { week: "Apr 19", done: 5 },
  { week: "Apr 26", done: 6 },
  { week: "May 3", done: 7 },
  { week: "May 10", done: 8 },
  { week: "May 17", done: 8 },
];

export type Notification = { id: string; title: string; body: string; time: string; unread: boolean; kind: "deadline" | "community" | "system" | "message" };

export const studentNotifications: Notification[] = [
  { id: "n1", kind: "deadline", title: "Immunization records are overdue", body: "Submit through the student health portal to avoid a registration hold.", time: "2h", unread: true },
  { id: "n2", kind: "community", title: "Arjun replied to your post", body: "“Happy to share — we're looking at Westwood Commons too…”", time: "4h", unread: true },
  { id: "n3", kind: "deadline", title: "SEVIS fee due in 7 days", body: "Pay before booking your visa interview.", time: "1d", unread: true },
  { id: "n4", kind: "message", title: "New message from Sofia Alvarez", body: "Are you on the Mumbai → LAX flight on Sep 2?", time: "1d", unread: false },
  { id: "n5", kind: "system", title: "Weekly digest", body: "You completed 1 milestone this week. 3 actions are up next.", time: "3d", unread: false },
];
