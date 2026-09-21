import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Photo } from "@/components/Photo";
import { ProductPurchase } from "@/components/ProductPurchase";
import { SizeGuideModalButton } from "@/components/SizeGuide";
import { productImages } from "@/lib/images";
import { formatPence } from "@/lib/money";
import { getProduct } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, SHOP } from "@/lib/shop";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const images = productImages(product.slug);
  const category = CATEGORY_LABELS[product.category];
  const categoryHref = `/shop/${category.toLowerCase()}`;
  const singleSize =
    product.sizes.length === 1 && product.sizes[0].label === "One size";

  return (
    <main className="mx-auto max-w-[1180px] px-[22px] pb-[70px] pt-[26px]">
      <Link
        href={categoryHref}
        className="mb-5 inline-block text-[13px] text-muted hover:text-ink"
      >
        ← Back to {category}
      </Link>

      <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <Photo
            image={images[0] ?? null}
            label={`product shot — ${product.imageQuery}`}
            className="aspect-[4/5] border border-rule"
            sizes="(max-width: 768px) 100vw, 560px"
            priority
          />
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {[1, 2, 3].map((index) => (
              <Photo
                key={index}
                image={images[index] ?? null}
                label={
                  index === 1
                    ? "detail — fabric close-up"
                    : index === 2
                      ? "on model — full length"
                      : "flat lay — back"
                }
                className="aspect-square border border-rule"
                sizes="180px"
                variant="deep"
              />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-sage">
            {category}
          </p>
          <h1 className="mb-2 font-serif text-[clamp(30px,4.4vw,42px)] font-normal leading-[1.1]">
            {product.name}
          </h1>
          <p className="mb-5 text-xl">{formatPence(product.pricePence)}</p>
          <p className="mb-6 max-w-[46ch] text-[rgba(43,43,43,0.82)]">
            {product.description}
          </p>

          {product.staffNote ? (
            <div className="mb-6 flex items-start gap-3 border border-[rgba(181,101,74,0.4)] bg-panel px-4 py-3.5">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="mt-[3px] flex-none"
                aria-hidden="true"
              >
                <path
                  d="M4 20 C 9 14, 15 8, 20 4"
                  fill="none"
                  stroke="var(--color-clay)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="4" r="2" fill="var(--color-clay)" />
              </svg>
              <div>
                <p className="mb-0.5 text-[11px] uppercase tracking-[0.16em] text-clay">
                  Staff pick
                </p>
                <p className="font-hand text-[22px] leading-tight text-oxblood">
                  {product.staffNote} — {product.staffNoteAuthor}
                </p>
              </div>
            </div>
          ) : null}

          {singleSize ? (
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.16em] text-faint">
                One size
              </p>
              <SizeGuideModalButton />
            </div>
          ) : null}

          <ProductPurchase
            slug={product.slug}
            sizes={product.sizes.map((s) => ({ label: s.label, stock: s.stock }))}
            singleSize={singleSize}
          />

          <div className="mt-7 flex flex-col gap-2 border-t border-rule pt-[18px] text-sm text-[rgba(43,43,43,0.78)]">
            <span>UK standard delivery £3.95 · free over £75 · 2–4 working days</span>
            <span>Next day £6.95 · International £14.95</span>
            <span>
              Click &amp; collect from Weaver&apos;s Row — free, ready in about
              two hours
            </span>
            <span>Returns within 28 days, in shop or by post</span>
            <a
              href={SHOP.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-oxblood underline hover:text-clay"
            >
              Ask us about this piece on Instagram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
