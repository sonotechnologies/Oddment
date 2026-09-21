import Link from "next/link";

import { SHOP } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="mt-5 border-t border-rule">
      <div className="mx-auto grid max-w-[1180px] gap-[26px] px-[22px] pb-[34px] pt-10 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        <div>
          <p className="mb-2 font-serif text-2xl">Oddment</p>
          <p className="text-sm text-muted">
            {SHOP.tagline}
            <br />
            12 Weaver&apos;s Row, Manchester M4 1AA
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link href="/shop" className="text-ink hover:text-clay">
            Shop
          </Link>
          <Link href="/visit" className="text-ink hover:text-clay">
            Visit &amp; collect
          </Link>
          <Link href="/about" className="text-ink hover:text-clay">
            About
          </Link>
          <Link href="/size-guide" className="text-ink hover:text-clay">
            Size guide
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={SHOP.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-oxblood hover:text-clay"
          >
            Message us on Instagram
          </a>
          <span className="text-muted">{SHOP.instagram}</span>
          <a href={`mailto:${SHOP.email}`} className="text-oxblood hover:text-clay">
            {SHOP.email}
          </a>
        </div>

        <div className="text-[13px] leading-relaxed text-faint">
          <p className="mb-1.5">
            Photography via{" "}
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noreferrer"
              className="text-oxblood hover:text-clay"
            >
              Pexels
            </a>
          </p>
          <p>
            Oddment is a fictional concept store designed and built by Sono
            Technologies.
          </p>
        </div>
      </div>
    </footer>
  );
}
