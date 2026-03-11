import Link from "next/link";
import { InstagramIcon } from "@/components/InstagramIcon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container inner">
        <p>© GlowWithVani. Toronto & GTA makeup artistry.</p>
        <div className="footer-links">
          <Link href="/toronto-bridal-makeup-artist">Toronto Bridal</Link>
          <Link href="/indian-bridal-makeup-toronto">Indian Bridal</Link>
          <a href="https://instagram.com/GlowWithVanii" target="_blank" rel="noreferrer" className="instagram-link-inline">
            <InstagramIcon className="instagram-icon" />
            <span>GlowWithVanii</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
