export type Job = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  summary: string;
  about: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  stack?: string[];
};

export const jobs: Job[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-stack Engineer",
    team: "Engineering",
    location: "Los Angeles, CA or Remote (US)",
    type: "Full-time",
    salary: "$170,000 – $210,000 + equity",
    posted: "2027-05-02",
    summary: "Own core parts of the student roadmap and the university dashboard, from data model to polished UI.",
    about: [
      "AfterAdmit guides admitted students from offer to arrival, and gives the universities that admit them a clear view of how their class is doing. Students rely on us during one of the biggest moves of their lives.",
      "As a senior engineer you'll work across the stack — designing data models, building APIs and shipping interfaces that feel calm and fast. You'll work directly with our designer, our student success team and the admissions teams we serve.",
    ],
    responsibilities: [
      "Design, build and ship end-to-end features across the student app and the university dashboard",
      "Own the roadmap engine that turns a school's deadlines into a personal, dated plan for every student",
      "Build reliable notification and reminder systems across email and push",
      "Set a high bar for performance, accessibility and code quality, and help others meet it",
      "Talk directly to students and admissions teams to understand the problems behind feature requests",
    ],
    requirements: [
      "5+ years building and shipping production web applications",
      "Deep experience with TypeScript and React; comfortable with server-side rendering",
      "Strong SQL and data-modeling skills (we use Postgres)",
      "Experience designing APIs and background jobs that are easy to reason about",
      "Clear written communication and a habit of shipping small, often",
    ],
    niceToHave: [
      "Experience with Next.js App Router and React Server Components",
      "Background in education, higher-ed or regulated data (FERPA, GDPR)",
      "Experience building multi-tenant SaaS with role-based access",
      "Lived experience as an international student",
    ],
    stack: ["TypeScript", "Next.js", "React", "Postgres", "Tailwind CSS", "Vercel"],
  },
  {
    slug: "senior-product-designer",
    title: "Senior Product Designer",
    team: "Design",
    location: "Los Angeles, CA (hybrid)",
    type: "Full-time",
    salary: "$155,000 – $190,000 + equity",
    posted: "2027-04-24",
    summary: "Shape how thousands of students navigate one of the biggest moves of their lives.",
    about: [
      "Our product serves three audiences at once — admitted students, university admissions teams and vetted partners. Each needs something different, and all of it needs to feel simple.",
      "You'll lead design across the product, from early research to pixel-level polish, and own our design system as it grows.",
    ],
    responsibilities: [
      "Lead end-to-end design for new features, from problem framing to shipped UI",
      "Run lightweight research with students and admissions teams every month",
      "Own and evolve our design system, components and content guidelines",
      "Write interface copy — much of our UX is words",
      "Partner closely with engineering to ship and iterate quickly",
    ],
    requirements: [
      "5+ years of product design experience with a portfolio of shipped work",
      "Strong interaction, visual and systems design skills",
      "Experience designing for multiple user types within one product",
      "Fluency in Figma and comfort prototyping interactions",
      "Excellent written communication",
    ],
    niceToHave: ["Experience in edtech or B2B2C products", "Ability to prototype in code", "Experience designing for mobile-first audiences"],
    stack: ["Figma", "FigJam", "Linear", "Notion"],
  },
  {
    slug: "university-partnerships-lead",
    title: "University Partnerships Lead",
    team: "Go-to-market",
    location: "Los Angeles, CA or New York, NY",
    type: "Full-time",
    salary: "$130,000 – $150,000 base + commission + equity",
    posted: "2027-05-09",
    summary: "Bring AfterAdmit to admissions and enrollment teams, and help them launch for their next intake.",
    about: [
      "Universities are our customers. You'll own the relationship from first conversation to successful launch — running demos, scoping pilots and making sure every school sees results in its first intake.",
    ],
    responsibilities: [
      "Build and manage a pipeline of graduate and undergraduate admissions teams",
      "Run discovery calls, tailored demos and pilot proposals",
      "Guide new schools through launch with our student success team",
      "Bring customer insight back to product and shape our roadmap",
      "Represent AfterAdmit at admissions and enrollment conferences",
    ],
    requirements: [
      "4+ years in sales, partnerships or account management, ideally SaaS",
      "Experience selling to, or working in, higher education",
      "Confidence leading senior stakeholders through a buying process",
      "Strong organization and follow-through",
      "Willingness to travel up to 25%",
    ],
    niceToHave: ["Experience with Slate, Salesforce or other admissions CRMs", "An existing network in admissions or enrollment management"],
  },
  {
    slug: "student-success-specialist",
    title: "Student Success Specialist (Hindi or Mandarin)",
    team: "Student success",
    location: "Remote",
    type: "Full-time",
    salary: "$62,000 – $75,000 + equity",
    posted: "2027-05-12",
    summary: "Be the friendly expert students reach when visas, housing or money get confusing.",
    about: [
      "When a student is stuck — on a visa appointment, a lease, or a bank account — you're who they talk to. You'll answer questions, spot patterns and turn them into better guidance for every student.",
    ],
    responsibilities: [
      "Answer student questions across chat and email with care and accuracy",
      "Host small-group onboarding sessions for new cohorts",
      "Moderate student community spaces alongside school moderators",
      "Turn common questions into Help center articles and roadmap improvements",
      "Escalate visa and wellbeing concerns to the right school contacts",
    ],
    requirements: [
      "Fluent English and fluent Hindi or Mandarin",
      "2+ years in a customer support, advising or student-facing role",
      "Calm, clear writing — especially under pressure",
      "Comfort with support tools and learning new software quickly",
    ],
    niceToHave: ["Lived experience as an international student in the US", "Familiarity with F-1 visa processes"],
  },
];

export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}
