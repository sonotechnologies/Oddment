import type { Metadata } from "next";

import { SHOP } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Message Oddment on Instagram or drop us an email. We're at 12 Weaver's Row, Northern Quarter, Manchester.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[760px] px-[22px] pb-20 pt-11">
      <h1 className="mb-3 font-serif text-[clamp(32px,5vw,46px)] font-normal">
        Get in touch
      </h1>
      <p className="mb-8 max-w-[52ch] text-[rgba(43,43,43,0.82)]">
        Questions about fit, stock, or whether we can put something by for you
        — Instagram is the fastest way to reach us. One of the four of us picks
        up messages through the day.
      </p>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        <a
          href={SHOP.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="block border border-rule bg-panel p-6 hover:border-ink"
        >
          <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-sage">
            Fastest
          </p>
          <p className="mb-2 font-serif text-2xl">Message us on Instagram</p>
          <p className="text-sm text-muted">{SHOP.instagram}</p>
        </a>

        <a
          href={`mailto:${SHOP.email}`}
          className="block border border-rule bg-panel p-6 hover:border-ink"
        >
          <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-sage">
            Email
          </p>
          <p className="mb-2 font-serif text-2xl">Drop us a line</p>
          <p className="text-sm text-muted">{SHOP.email}</p>
        </a>
      </div>

      <div className="mt-8 border-t border-rule pt-6">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-faint">
          Come in
        </p>
        <p className="font-serif text-2xl leading-snug">
          {SHOP.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <div className="mt-4">
          {SHOP.hours.map((row) => (
            <div
              key={row.days}
              className="mb-1 flex max-w-[320px] justify-between text-base"
            >
              <span>{row.days}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
