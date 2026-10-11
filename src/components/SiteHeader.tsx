"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InstagramIcon } from "@/components/InstagramIcon";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem("glowwithvani-theme", nextTheme); } catch { /* Theme still works when storage is unavailable. */ }
    setTheme(nextTheme);
  }

  return (
    <header className="site-header">
      <div className="container inner">
        <Link href="/" className="brand brand-wrap" aria-label="GlowWithVani home">
          <Image src="/brand/logo.png" alt="GlowWithVani logo" width={44} height={44} className="brand-logo brand-logo-nav brand-logo-light" />
          <Image src="/brand/logo-dark.png" alt="GlowWithVani logo" width={44} height={44} className="brand-logo brand-logo-nav brand-logo-dark" />
          <span className="brand-wordmark">GlowWithVani</span>
        </Link>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label="Toggle color theme"
            aria-pressed={isMounted ? theme === "dark" : false}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb" />
            </span>
            <span className="theme-toggle-label">{isMounted ? (theme === "dark" ? "Dark" : "Light") : "Theme"}</span>
          </button>

          <button
            type="button"
            className={`nav-toggle${isOpen ? " open" : ""}`}
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav id="primary-navigation" className={`nav${isOpen ? " open" : ""}`} aria-label="Primary">
          <Link href="/portfolio" onClick={closeMenu}>The Work</Link>
          <Link href="/#about" onClick={closeMenu}>
            About
          </Link>
          <Link href="/#services" onClick={closeMenu}>
            Services
          </Link>
          <Link href="/#screen-print" onClick={closeMenu}>Screen & Print</Link>
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
