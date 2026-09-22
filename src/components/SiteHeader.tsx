"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useBag } from "@/components/useBag";

const NAV = [
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
  { href: "/shop/accessories", label: "Accessories" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const { count } = useBag();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-4 py-2.5 sm:px-[22px] md:gap-5 md:py-3.5">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex flex-col leading-none"
        >
          <span className="font-serif text-2xl tracking-[0.01em] text-ink md:text-[30px]">
            Oddment
          </span>
          <span className="mt-[5px] hidden text-[10px] uppercase tracking-[0.22em] text-sage md:block">
            Northern Quarter
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="ml-auto hidden items-center gap-5 text-sm tracking-[0.02em] md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-ink underline decoration-clay underline-offset-4"
                  : "text-ink hover:text-clay"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/bag"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-oxblood px-3.5 py-2 text-[13px] tracking-[0.04em] text-paper hover:bg-clay md:px-4"
          >
            Bag{count > 0 ? ` (${count})` : ""}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(43,43,43,0.24)] md:hidden"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M4 4 L16 16 M16 4 L4 16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6 H17 M3 10 H17 M3 14 H17"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-rule bg-paper md:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={[
                "block border-b border-[rgba(43,43,43,0.08)] px-4 py-3.5 text-base",
                pathname === item.href ? "text-clay" : "text-ink",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/visit"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 text-[13px] text-faint"
          >
            12 Weaver&apos;s Row · Mon–Sat 10am–6pm
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
