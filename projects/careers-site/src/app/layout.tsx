import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.grq.ae"),
  title: "GRQ Holdings",
  description: "Join GRQ Holdings.",
  openGraph: {
    siteName: "GRQ Holdings",
    title: "GRQ Holdings",
    description: "Join GRQ Holdings.",
    url: "https://www.grq.ae/",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "GRQ Holdings",
                alternateName: "GRQ",
                url: "https://www.grq.ae",
                logo: "https://www.grq.ae/logo.png",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "GRQ Holdings",
                alternateName: "GRQ",
                url: "https://www.grq.ae",
              },
            ]),
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans min-h-screen bg-black text-white flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <SmoothScroll>
          {/* ──── Premium Dynamic Nav ──── */}
          <Header />

          {/* Main Content */}
          <main suppressHydrationWarning className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>

          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
