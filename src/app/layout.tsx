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
    default: "GlowWithVani | Toronto Makeup Artist for Bridal, Editorial & Luxury Glam",
    template: "%s | GlowWithVani"
  },
  description:
    "GlowWithVani is a Toronto-based luxury makeup artist for bridal beauty, editorial shoots, event glam, theatre, and creative makeup across the GTA and destination weddings.",
  keywords: [
    "Toronto makeup artist",
    "makeup artist Toronto",
    "bridal makeup artist Toronto",
    "luxury makeup artist Toronto",
    "editorial makeup Toronto",
    "event makeup artist Toronto",
    "theatre makeup artist Toronto",
    "SFX makeup artist Toronto",
    "destination wedding makeup artist",
    "GlowWithVani"
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
    title: "GlowWithVani | Toronto Makeup Artist for Bridal, Editorial & Luxury Glam",
    description:
      "Toronto-based luxury makeup artist for bridal beauty, editorial shoots, event glam, theatre, and creative makeup.",
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
    title: "GlowWithVani | Toronto Makeup Artist for Bridal, Editorial & Luxury Glam",
    description:
      "Toronto-based luxury makeup artist for bridal beauty, editorial shoots, event glam, theatre, and creative makeup.",
    images: ["/icon.png"]
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='glowwithvani-theme';var stored=localStorage.getItem(key);var theme=stored||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme='light';}})();`
          }}
        />
      </head>
      <body className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
