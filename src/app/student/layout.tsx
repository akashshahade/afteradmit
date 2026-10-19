import type { Metadata } from "next";

import { StudentShell } from "@/components/student/student-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return <StudentShell>{children}</StudentShell>;
}
