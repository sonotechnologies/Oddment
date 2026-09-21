import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductCard } from "@/components/ProductCard";
import { ShopFilters, SortSelect } from "@/components/ShopFilters";
import { allSizeLabels, listProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/shop";

type ShopPageProps = {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function categoryFromParams(segments?: string[]) {
  if (!segments || segments.length === 0) return null;
  if (segments.length > 1) return undefined;
  return CATEGORY_SLUGS[segments[0]] ?? undefined;
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { category } = await params;
  const key = categoryFromParams(category);
  if (key === undefined) return { title: "Shop" };
  return { title: key ? CATEGORY_LABELS[key] : "Shop" };
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  params,
  searchParams,
}: ShopPageProps) {
  const { category: segments } = await params;
  const category = categoryFromParams(segments);
  if (category === undefined) notFound();

  const search = await searchParams;
  const size = single(search.size);
  const sortParam = single(search.sort);
  const sort =
    sortParam === "low" || sortParam === "high" ? sortParam : "new";
  const maxRaw = Number(single(search.max));
  const maxPricePence =
    Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : undefined;

  const [products, sizes, priciest] = await Promise.all([
    listProducts({
      category: category ?? undefined,
      size,
      maxPricePence,
      sort,
    }),
    allSizeLabels(),
    prisma.product.findFirst({
      orderBy: { pricePence: "desc" },
      select: { pricePence: true },
    }),
  ]);

  const maxAvailablePence = priciest?.pricePence ?? 20000;
  const title = category ? CATEGORY_LABELS[category] : "New in";
  const crumb = category ? `Shop / ${CATEGORY_LABELS[category]}` : "Everything";

  return (
    <main className="mx-auto max-w-[1180px] px-[22px] pb-[70px] pt-[34px]">
      <p className="mb-2.5 text-xs uppercase tracking-[0.16em] text-sage">
        {crumb}
      </p>
      <h1 className="mb-1 font-serif text-[clamp(34px,5vw,46px)] font-normal">
        {title}
      </h1>
      <p className="mb-[26px] text-sm text-muted">
        {products.length} {products.length === 1 ? "piece" : "pieces"} · Free UK
        standard delivery over £75
      </p>

      <div className="grid gap-[30px] md:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="max-w-[280px]" />}>
          <ShopFilters sizes={sizes} maxAvailablePence={maxAvailablePence} />
        </Suspense>

        <div className="min-w-0">
          <div className="mb-4 flex justify-end">
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <p className="py-10 font-serif text-2xl">
              Nothing matches that just yet. Try widening the price, or{" "}
              <Link href="/contact" className="underline">
                ask us on Instagram
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(215px,1fr))]">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 4}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
