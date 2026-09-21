import Link from "next/link";

import { HandUnderline } from "@/components/HandUnderline";
import { Photo } from "@/components/Photo";
import { ProductCard } from "@/components/ProductCard";
import { ghostButton, primaryButton } from "@/components/buttonStyles";
import { lifestyleImage } from "@/lib/images";
import { newIn, staffPicks } from "@/lib/products";
import { SHOP } from "@/lib/shop";

const CATEGORIES = [
  { href: "/shop/women", name: "Women", label: "category shot — womenswear rail" },
  { href: "/shop/men", name: "Men", label: "category shot — menswear rail" },
  {
    href: "/shop/accessories",
    name: "Accessories",
    label: "category shot — scarves and belts on counter",
  },
];

export default async function HomePage() {
  const [arrivals, picks] = await Promise.all([newIn(4), staffPicks(3)]);

  return (
    <main>
      <section className="mx-auto max-w-[1180px] px-[22px] pb-2.5 pt-[34px]">
        <div className="grid items-center gap-[26px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="animate-rise">
            <p className="mb-3.5 text-[11px] uppercase tracking-[0.24em] text-sage">
              Autumn arrivals
            </p>
            <h1 className="font-serif text-[clamp(40px,7vw,68px)] font-normal leading-[1.04] tracking-[-0.01em]">
              Good things,
              <br />
              <em className="italic">oddly chosen</em>
            </h1>
            <HandUnderline className="my-3.5 mb-5" />
            <p className="mb-[26px] max-w-[40ch] text-[17px] text-[rgba(43,43,43,0.82)]">
              A small shop on Weaver&apos;s Row with a big appetite for things
              made properly. Hand-picked menswear and womenswear, most of it in
              ones and twos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className={primaryButton}>
                Shop new in
              </Link>
              <Link href="/visit" className={ghostButton}>
                Visit the shop
              </Link>
            </div>
          </div>

          <div className="relative">
            <Photo
              image={lifestyleImage(0)}
              label="lifestyle shot — model in overshirt, shop doorway"
              className="aspect-[4/5] border border-rule"
              sizes="(max-width: 768px) 100vw, 560px"
              priority
            />
            <div className="absolute -bottom-[18px] -left-3.5 w-[44%]">
              <Photo
                image={lifestyleImage(1)}
                label="shop interior detail"
                className="aspect-square border border-rule"
                sizes="(max-width: 768px) 45vw, 250px"
                variant="deep"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[22px] pt-14">
        <div className="mb-[22px] flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-normal">
            New in
          </h2>
          <Link
            href="/shop"
            className="text-[13px] uppercase tracking-[0.08em] text-oxblood hover:text-clay"
          >
            See all →
          </Link>
        </div>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(215px,1fr))]">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[22px] pt-14">
        <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {CATEGORIES.map((category, i) => (
            <Link
              key={category.href}
              href={category.href}
              className="group block border border-rule"
            >
              <Photo
                image={lifestyleImage(i + 2)}
                label={category.label}
                className="aspect-[5/4]"
                sizes="(max-width: 768px) 100vw, 380px"
                variant="deep"
              />
              <div className="flex items-baseline justify-between gap-2.5 px-[18px] pb-[18px] pt-4">
                <span className="font-serif text-2xl group-hover:text-clay">
                  {category.name}
                </span>
                <span className="text-xs uppercase tracking-[0.08em] text-oxblood">
                  Shop →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[22px] pt-[60px]">
        <div className="mb-5 flex flex-wrap items-baseline gap-3.5">
          <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-normal">
            Staff picks
          </h2>
          <span className="inline-block rotate-[-2deg] font-hand text-[22px] text-clay">
            things we&apos;ve nicked for ourselves
          </span>
        </div>
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {picks.map((product) => (
            <div key={product.id} className="border border-rule bg-panel p-4">
              <ProductCard product={product} />
              {product.staffNote ? (
                <p className="mt-2.5 font-hand text-[21px] leading-tight text-oxblood">
                  {product.staffNote} — {product.staffNoteAuthor}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[22px] pt-16">
        <div className="grid items-center gap-7 border-y border-rule py-10 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <div>
            <h2 className="mb-3.5 font-serif text-[clamp(26px,3.6vw,34px)] font-normal">
              An oddment is a leftover piece of cloth
            </h2>
            <p className="mb-5 max-w-[46ch] text-[rgba(43,43,43,0.82)]">
              We named the shop after the bits that get kept back because
              someone saw something in them. That&apos;s more or less how we
              buy: small runs, odd sizes, things that won&apos;t turn up in
              every window on the street.
            </p>
            <Link href="/about" className={`${ghostButton} px-6 py-[13px]`}>
              Our story
            </Link>
          </div>
          <Photo
            image={lifestyleImage(5)}
            label="shop interior — rails and counter"
            className="aspect-[16/10] border border-rule"
            sizes="(max-width: 768px) 100vw, 560px"
            variant="deep"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[22px] pb-[70px] pt-10">
        <div className="grid gap-6 bg-ink p-[34px] text-paper [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-sage">
              Come in
            </p>
            <p className="font-serif text-[26px] leading-tight">
              12 Weaver&apos;s Row
              <br />
              Northern Quarter, M4 1AA
            </p>
          </div>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-sage">
              Open
            </p>
            <p className="text-base leading-[1.8]">
              Mon–Sat 10am–6pm
              <br />
              Sun 11am–4pm
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2.5">
            <Link
              href="/visit"
              className="rounded-edge bg-paper px-[22px] py-3.5 text-center text-[13px] uppercase tracking-[0.06em] text-ink hover:bg-white"
            >
              Directions &amp; click &amp; collect
            </Link>
            <a
              href={SHOP.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-edge border border-[rgba(245,240,232,0.4)] px-[22px] py-[13px] text-center text-sm text-paper hover:border-paper"
            >
              Message us on Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
