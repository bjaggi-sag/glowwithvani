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
    "GlowWithVani is a Toronto-based luxury makeup artist serving the GTA for bridal makeup, event glam, editorial photoshoots, and destination weddings.",
  keywords: [
    "bridal makeup artist Toronto",
    "Toronto makeup artist",
    "makeup artist Toronto",
    "luxury makeup artist Toronto",
    "GTA bridal makeup",
    "GlowWithVani",
    "destination wedding makeup artist",
    "party makeup artist Toronto",
    "editorial makeup Toronto",
    "SFX makeup artist"
  ],
  applicationName: "GlowWithVani",
  category: "beauty",
  creator: "GlowWithVani",
  publisher: "GlowWithVani",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }]
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: false
  },
  openGraph: {
    title: "GlowWithVani | Toronto Bridal & Luxury Makeup Artist",
    description:
      "Toronto-based luxury makeup artist for bridal beauty, event glam, editorial shoots, and destination weddings.",
    type: "website",
    url: "https://glowwithvani.com",
    siteName: "GlowWithVani",
    locale: "en_CA",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "GlowWithVani logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowWithVani | Toronto Bridal & Luxury Makeup Artist",
    description:
      "Toronto-based luxury makeup artist for bridal beauty, event glam, editorial shoots, and destination weddings.",
    images: ["/icon.png"]
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
