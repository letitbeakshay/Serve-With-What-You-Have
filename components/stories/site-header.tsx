"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";

const NAV_LINKS = [
  { href: "/#ways", label: "Ways to serve" },
  { href: "/#how", label: "How it works" },
  { href: "/#scenes", label: "Stories" },
  { href: "/#orgs", label: "For organisations" },
];

export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={stuck ? "stuck" : undefined}>
      <div className="wrap">
        <nav className="nav">
          <Link className="brand" href="/">
            <BrandMark />
            <b>Serve With What You Have</b>
          </Link>
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link className="btn btn-solid" href="/#ways">
            See what I can serve with
          </Link>
          <button
            className="burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link className="btn btn-solid" href="/#ways" onClick={() => setMenuOpen(false)}>
            See what I can serve with
          </Link>
        </div>
      </div>
    </header>
  );
}
