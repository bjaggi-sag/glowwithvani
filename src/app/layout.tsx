import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap"
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://glowwithvani.com"),
  title: {
    default: "GlowWithVani | Toronto Makeup Artist",
    template: "%s | GlowWithVani"
  },
  description:
    "Luxury minimal makeup artistry in Toronto and the GTA for bridal, editorial, glam events, and SFX.",
  keywords: [
    "Toronto makeup artist",
    "GTA bridal makeup",
    "GlowWithVani",
    "editorial makeup Toronto",
    "SFX makeup artist"
  ],
  openGraph: {
    title: "GlowWithVani",
    description:
      "Luxury minimal makeup artistry in Toronto and the GTA for bridal, editorial, glam events, and SFX.",
    type: "website",
    url: "https://glowwithvani.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowWithVani",
    description:
      "Luxury minimal makeup artistry in Toronto and the GTA for bridal, editorial, glam events, and SFX."
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
