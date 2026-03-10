"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { InstagramIcon } from "@/components/InstagramIcon";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container inner">
        <Link href="/" className="brand brand-wrap" aria-label="GlowWithVani home">
          <Image src="/brand/logo.png" alt="GlowWithVani logo" width={44} height={44} className="brand-logo brand-logo-nav" />
          <span className="brand-wordmark">GlowWithVani</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={`nav ${isOpen ? "open" : ""}`} aria-label="Primary">
          <Link href="/#about" onClick={closeMenu}>
            About
          </Link>
          <Link href="/#services" onClick={closeMenu}>
            Services
          </Link>
          <Link href="/portfolio" onClick={closeMenu}>
            Portfolio
          </Link>
          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>
          <a
            href="https://instagram.com/GlowWithVanii"
            target="_blank"
            rel="noreferrer"
            className="instagram-link-inline"
            onClick={closeMenu}
          >
            <InstagramIcon className="instagram-icon" />
            <span>Instagram</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
