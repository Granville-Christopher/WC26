import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteLayout } from "@/components/SiteLayout";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CupVault — FIFA World Cup 2026 Tickets",
    template: "%s | CupVault",
  },
  description:
    "Buy FIFA World Cup 2026 tickets for all 104 matches across the USA, Canada, and Mexico. Verified sellers, guaranteed delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
