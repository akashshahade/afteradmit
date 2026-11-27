import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { RememberSessionGate } from "@/components/auth/remember-session-gate";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://afteradmit.com"),
  title: { default: "AfterAdmit", template: "%s · AfterAdmit" },
  description: "Your personalized path from admit to arrival.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
      <body className="min-h-full">
        <TooltipProvider>{children}</TooltipProvider>
        <RememberSessionGate />
        <Toaster
          position="bottom-right"
          toastOptions={{ className: "!rounded-xl !border-border !shadow-lg !text-[13px] !font-sans" }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
