import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DateReady — How Ready Are You For Dating? (60-Sec Assessment)",
  description: "Find out how ready you are for dating. Take the 60-second assessment to discover your confidence score, communication style, and custom action plan.",
  keywords: ["dating confidence", "dating readiness quiz", "communication style", "dating assessment India", "self improvement"],
  authors: [{ name: "Subix" }],
  creator: "DateReady by Subix",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dateready.subix.in"),
  openGraph: {
    title: "DateReady — 60-Second Dating Readiness Assessment",
    description: "Discover your dating confidence score, communication strengths, and growth areas.",
    url: "https://dateready.subix.in",
    siteName: "DateReady",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DateReady — 60-Second Dating Readiness Assessment",
    description: "Discover your dating confidence score, communication strengths, and growth areas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0B12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} dark h-full`}>
      <body className="bg-[#07070C] text-[#F5F5FA] min-h-full font-sans antialiased selection:bg-[#FF4D8D]/30 selection:text-[#FFFFFF]">
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
