import type { Metadata } from "next";
import Link from "next/link";

import { Photo } from "@/components/Photo";
import { primaryButton } from "@/components/buttonStyles";
import { lifestyleImage } from "@/lib/images";
import { SHOP } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Visit the shop",
  description:
    "Oddment is at 12 Weaver's Row in Manchester's Northern Quarter. Opening hours, directions and how click & collect works.",
};

export default function VisitPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-[22px] pb-[70px] pt-[34px]">
      <h1 className="mb-2 font-serif text-[clamp(34px,5vw,48px)] font-normal">
        Visit the shop
      </h1>
      <p className="mb-[30px] max-w-[52ch] text-[rgba(43,43,43,0.82)]">
        We&apos;re a two-minute walk from Stevenson Square, next to the print
        studio. Knock on the window if the door sticks.
      </p>

      <div className="grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <Photo
            image={lifestyleImage(6)}
            label="shopfront photo — Weaver's Row exterior"
            className="mb-3 aspect-[4/3] border border-rule"
            sizes="(max-width: 768px) 100vw, 560px"
            variant="deep"
            priority
          />
          <div className="flex aspect-[16/9] items-center justify-center border border-rule od-placeholder-map">
            <span className="bg-paper px-2 py-1.5 font-mono text-[11px] text-[rgba(43,43,43,0.6)]">
              map — M4 1AA, Northern Quarter
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="border-t border-rule py-5">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-faint">
              Address
            </p>
            <p className="font-serif text-2xl leading-snug">
              {SHOP.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="border-t border-rule py-5">
            <p className="mb-2.5 text-[11px] uppercase tracking-[0.18em] text-faint">
              Opening hours
            </p>
            {SHOP.hours.map((row) => (
              <div
                key={row.days}
                className="mb-1.5 flex max-w-[320px] justify-between text-base"
              >
                <span>{row.days}</span>
                <span>{row.time}</span>
              </div>
            ))}
          </div>

          <div className="border-y border-rule py-5">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-faint">
              How click &amp; collect works
            </p>
            <ol className="list-decimal pl-5 text-base leading-[1.9] text-[rgba(43,43,43,0.85)]">
              <li>Choose collection at checkout — it&apos;s free.</li>
              <li>
                We pull the piece and text you when it&apos;s ready, usually
                within two hours.
              </li>
              <li>
                Come in any time within seven days. Try it on properly while
                you&apos;re here.
              </li>
            </ol>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/shop" className={`${primaryButton} px-[26px]`}>
              Shop for collection
            </Link>
            <a
              href={SHOP.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-edge border border-rule-strong px-[22px] py-[15px] text-sm text-ink hover:border-ink"
            >
              {SHOP.instagram}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
