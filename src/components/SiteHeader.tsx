import Link from "next/link";
import Image from "next/image";
import { InstagramIcon } from "@/components/InstagramIcon";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container inner">
        <Link href="/" className="brand brand-wrap" aria-label="GlowWithVani home">
          <Image src="/brand/logo.png" alt="GlowWithVani logo" width={44} height={44} className="brand-logo brand-logo-nav" />
          <span className="brand-wordmark">GlowWithVani</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#about">About</Link>
          <Link href="/#services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/contact">Contact</Link>
          <a href="https://instagram.com/GlowWithVanii" target="_blank" rel="noreferrer" className="instagram-link-inline">
            <InstagramIcon className="instagram-icon" />
            <span>Instagram</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
