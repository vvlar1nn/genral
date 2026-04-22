import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PragueAI Hotels — Find Your Perfect Stay in Prague",
  description:
    "AI-powered hotel recommendations for tourists in Prague. Find your perfect hotel in seconds with our intelligent assistant.",
  keywords: ["Prague hotels", "AI hotel recommendations", "Prague travel", "hotel search"],
  openGraph: {
    title: "PragueAI Hotels",
    description: "Find your perfect stay in Prague with AI in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
