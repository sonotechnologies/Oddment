"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-5 px-[22px] py-3.5">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[30px] tracking-[0.01em] text-ink">
            Oddment
          </span>
          <span className="mt-[5px] text-[10px] uppercase tracking-[0.22em] text-sage">
            Northern Quarter
          </span>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center gap-5 text-sm tracking-[0.02em]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-ink underline underline-offset-4 decoration-clay"
                  : "text-ink hover:text-clay"
              }
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/bag"
            className="rounded-full bg-oxblood px-4 py-2 text-[13px] tracking-[0.04em] text-paper hover:bg-clay"
          >
            Bag{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
