export function unsplash(id: string, w = 800, h?: number) {
  return `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ""}&q=75&auto=format&fit=crop`;
}

export const photos = {
  graduation: "photo-1541339907198-e08756dedf3f",
  studentPortrait: "photo-1494790108377-be9c29b29330",
  studentPortrait2: "photo-1507003211169-0a1dd7228f2d",
  classmates: "photo-1517486808906-6ca8b3f04846",
  campus: "photo-1562774053-701939374585",
  flight: "photo-1436491865332-7a61a109cc05",
  studying: "photo-1522202176988-66273c2fd55f",
};

export const legalPages = {
  privacy: "Privacy policy",
  terms: "Terms of service",
  cookies: "Cookie policy",
  "student-data": "Student data (FERPA & GDPR)",
  "data-processing": "Data processing addendum",
  security: "Security",
  accessibility: "Accessibility",
} as const;

export type LegalSlug = keyof typeof legalPages;
