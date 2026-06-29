import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UPSC Tracker | Founding Aspirants Program",
  description: "Built by an Aspirant. Designed for Every Aspirant. Join the UPSC Tracker Founding program, shape the product roadmap, and help prioritize AI-powered evaluation modules for civil services prep.",
  keywords: [
    "UPSC",
    "UPSC Tracker",
    "Civil Services Examination",
    "UPSC Study Planner",
    "AI UPSC Evaluation",
    "UPSC Syllabus Tracker",
    "UPSC 2027",
    "UPSC 2028",
    "IAS Preparation Tool"
  ],
  authors: [{ name: "UPSC Tracker Team" }],
  openGraph: {
    title: "UPSC Tracker | Founding Aspirants Program",
    description: "Shape India's first AI-powered UPSC Operating System. Secure your founding membership at 66% OFF.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSC Tracker | Founding Aspirants Program",
    description: "Built by an Aspirant. Designed for Every Aspirant. Help shape India's first AI-powered UPSC Operating System.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-brand-purple/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
